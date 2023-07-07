<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<!-- 基本信息 -->
			<view class="st-box">
				<view class="st-card-header">基本信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="text" label="标题" required :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请输入标题" v-model="formData.text" maxlength="10" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="value" label="标题拼音" required :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="标题拼音，系统自动生成" v-model="formData.value" maxlength="20" trim="both"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
			</view>
			<!-- 列表内容 -->
			<view class="st-box">
				<view class="st-card-header">列表内容</view>
				<uni-row v-for="(item, index) in formData.list" :key="index">
					<uni-col :xs="24" :sm="6">
						<uni-forms-item :name="['list',index,'text']" label="标题" required :label-width="labelWidth"
							label-align="right" :rules="[{'required': true, errorMessage: '标题'}]">
							<uni-easyinput placeholder="请输入标题" v-model="item.text" maxlength="10" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item :name="['list',index,'value']" label="标题拼音" required :label-width="labelWidth"
							label-align="right">
							<uni-easyinput placeholder="标题拼音，系统自动生成" v-model="item.value" maxlength="20" trim="both"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item :name="['list',index,'icon']" label="图标" :label-width="labelWidth" label-align="right">
							<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object"
								v-model="item.icon" :image-styles="imageStyles"></uni-file-picker>
							<text style="color: red; font-size: 14px; position: absolute; left: 50px; top: 10px;">(建议40*40px)</text>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<button @click="onDelete(index)" class="uni-button" size="mini" type="warn"
							style="margin-left: 40rpx; margin-top: 4rpx;">删除</button>
					</uni-col>
				</uni-row>
				<view class="uni-button-group" style="margin-top: 0;">
					<button type="primary" class="uni-button" style="width: 100px;" @click="onAdd">新增数据</button>
				</view>
			</view>
			<view class="uni-button-group">
				<button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
				<navigator open-type="navigateBack" style="margin-left: 15px;">
					<button class="uni-button" style="width: 100px;">返回</button>
				</navigator>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		validator
	} from '@/js_sdk/validator/st-basic.js';
	import {
		pinyin
	} from 'pinyin-pro'
	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'st-basic';

	function getValidator(fields) {
		let result = {}
		for (let key in validator) {
			if (fields.includes(key)) {
				result[key] = validator[key]
			}
		}
		return result
	}



	export default {
		data() {
			let formData = {
				"text": "",
				"value": "",
				"list": []
			}
			return {
				imageStyles: {
					width: 50,
					height: 50,
				},
				labelWidth: 80,
				formData,
				formOptions: {},
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		onLoad(e) {
			if (e.id) {
				const id = e.id
				this.formDataId = id
				this.getDetail(id)
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		watch: {
			"formData.text": function(value) {
				this.$nextTick(() => {
					this.formData.value = pinyin(value, {
						toneType: 'none',
						type: 'array',
						v: true
					}).join("")
				})
			},
			"formData.list": {
				handler(value) {
					value.forEach(item => {
						if (item.text && item.text.length > 0) {
							item.value = pinyin(item.text, {
								toneType: 'none',
								type: 'array',
								v: true
							}).join("")
						} else {
							item.value = ""
						}
					})
				},
				deep: true
			}
		},
		methods: {
			onAdd() {
				const item = {
					"text": null,
					"value": null,
					"icon": null
				}
				this.formData.list.push(item)
			},
			onDelete(index) {
				this.formData.list.splice(index, 1)
			},

			/**
			 * 验证表单并提交
			 */
			submit() {
				uni.showLoading({
					mask: true
				})
				this.$refs.form.validate().then((res) => {
					return this.submitForm(res)
				}).catch(() => {}).finally(() => {
					uni.hideLoading()
				})
			},

			/**
			 * 提交表单
			 */
			submitForm(value) {
				// 使用 clientDB 提交数据
				return db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
					uni.showToast({
						title: '修改成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				})
			},

			/**
			 * 获取表单数据
			 * @param {Object} id
			 */
			getDetail(id) {
				uni.showLoading({
					mask: true
				})
				db.collection(dbCollectionName).doc(id).field("text,value,list").get().then((res) => {
					const data = res.result.data[0]
					if (data) {
						this.formData = data
					}
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .icon-add {
		width: 20px;
		height: 3px;
	}
</style>