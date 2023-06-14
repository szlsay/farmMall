<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<!-- 基本信息 -->
			<view class="fm-box">
				<view class="fm-card-header">基本信息</view>
				<uni-row>
					<uni-forms-item name="image" label="广告图片" required :label-width="labelWidth" label-align="right">
						<uni-file-picker file-mediatype="image" file-extname="jpeg,jpg,png,webp" return-type="object"
							v-model="formData.image" :image-styles="imageStyles"></uni-file-picker>
						<text style="color: red; font-size: 14px;">请选择上传尺寸600*300，格式jpeg、jpg、png、webp，小于100KB的图片</text>
					</uni-forms-item>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="title" label="标题" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写标题" v-model="formData.title" trim="both"
								maxlength="20"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="sort" label="排序" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="数字越小，排序越前" type="number"
								v-model="formData.sort"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="status" label="生效状态" :label-width="labelWidth" label-align="right">
							<switch @change="binddata('status', $event.detail.value)" :checked="formData.status">
							</switch>
						</uni-forms-item>
					</uni-col>
				</uni-row>
			</view>
			<!-- 跳转信息 -->
			<view class="fm-box">
				<view class="fm-card-header">跳转信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="type" label="类型" :label-width="labelWidth" label-align="right">
							<uni-data-select placeholder="请选择类型" v-model="formData.type"
								:localdata="$store.state.sys.ad_types" @change='onChangeType'></uni-data-select>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="16" v-if="formData.type === 'combo'">
						<uni-forms-item name="value" label="套餐名称" :label-width="labelWidth" label-align="right">
							<uni-data-select :localdata="comboList" v-model="formData.value" placeholder="请选择套餐" />
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="16" v-if="formData.type === 'url'">
						<uni-forms-item name="value" label="链接地址" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写链接地址" v-model="formData.value" trim="both"
								maxlength="100"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="16" v-if="formData.type === 'page'">
						<uni-forms-item name="value" label="页面路径" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写页面路径" v-model="formData.value" trim="both"
								maxlength="100"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
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
	} from '@/js_sdk/validator/fm-banner.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'fm-banner';

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
				"image": null,
				"title": "",
				"sort": null,
				"status": true,
				"type": "",
				"value": ""
			}
			return {
				labelWidth: 80,
				imageStyles: {
					width: 300,
					height: 150,
				},
				comboList: [],
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
		methods: {
			onChangeType(value) {
				this.formData.value = ''
				if (value === 'combo' && this.comboList.length === 0) {
					this.getCombos()
				}
			},
			getCombos() {
				console.log("getCombos")
				const db = uniCloud.database()
				db.collection("fm-combo").where({
					is_delete: false
				}).field("_id, name").get().then(res => {
					const result = res.result.data.map(item => {
						item.value = item._id
						item.text = item.name
						return item
					})
					this.comboList = result
				})
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
				db.collection(dbCollectionName).doc(id).field("image,title,sort,status,type,value").get().then((res) => {
					const data = res.result.data[0]
					if (data) {
						this.formData = data
						if (this.formData.type === 'combo' && this.comboList.length === 0) {
							this.getCombos()
						}
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