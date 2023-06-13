<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<view class="fm-box">
				<view class="fm-card-header">基本信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="title" label="名称" required :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写名称" maxlength="20" v-model="formData.title"
								trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="type" label="英文标识" required :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写英文标识" maxlength="20" v-model="formData.type"
								trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
			</view>

			<view class="fm-box">
				<view class="fm-card-header">标签内容</view>
				<uni-row v-for="(item, index) in formData.enum" :key="index">
					<uni-col :xs="24" :sm="6">
						<uni-forms-item required label="名称" :name="['enum',index,'text']" :label-width="labelWidth"
							label-align="right" :rules="[{'required': true,errorMessage: '名称必填'}]" :key="index">
							<uni-easyinput placeholder="请填写名称" maxlength="20" v-model="item.text"
								trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item required label="值" :name="['enum',index,'value']" :label-width="labelWidth"
							label-align="right" :rules="[{'required': true,errorMessage: '值必填'}]" :key="index">
							<uni-easyinput placeholder="请填写值" maxlength="20" v-model="item.value"
								trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item :name="['enum',index,'icon']" label="图标" :label-width="labelWidth"
							label-align="right">
							<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object"
								v-model="item.image" :image-styles="imageStyles"></uni-file-picker>
							<text
								style="color: red; font-size: 14px; position: absolute; left: 50px; top: 10px;">(建议40*40px)</text>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<button @click="onDelete(index)" class="uni-button" size="mini" type="warn"
							style="margin-left: 40rpx; margin-top: 4rpx;">删除</button>
					</uni-col>
				</uni-row>
				<view class="uni-button-group" style="margin-top: 0;">
					<button type="primary" class="uni-button" style="width: 100px;" @click="onAdd">新增枚举</button>
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
	} from '@/js_sdk/validator/fm-tag.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'fm-tag';

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
				"title": "",
				"type": "",
				"enum": []
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
		onReady() {
			this.$refs.form.setRules(this.rules)
			this.onAdd()
		},
		methods: {
			onAdd() {
				const item = {
					"text": null,
					"value": null
				}
				this.formData.enum.push(item)
			},
			onDelete(index) {
				this.formData.enum.splice(index, 1)
			},
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

			submitForm(value) {
				// 使用 clientDB 提交数据
				return db.collection(dbCollectionName).add(value).then((res) => {
					uni.showToast({
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
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