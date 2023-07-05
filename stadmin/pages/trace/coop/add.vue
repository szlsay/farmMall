<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<!-- 基本信息 -->
			<view class="st-box">
				<view class="st-card-header">基本信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="coop_name" label="合作社名称" required :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请输入合作社名称" v-model="formData.coop_name" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="contact_name" label="联系人姓名" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请输入联系人姓名" v-model="formData.contact_name" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="contact_phone" label="联系人电话" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请输入联系人电话" v-model="formData.contact_phone" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="scope" label="主营范围" :label-width="labelWidth" label-align="right">
							<uni-easyinput type="textarea" placeholder="请填写主营范围" v-model="formData.scope" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="image" label="合作社图片" :label-width="labelWidth" label-align="right">
							<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object"
								v-model="formData.image" :image-styles="imageStyles"></uni-file-picker>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="disabled" label="是否禁用" :label-width="labelWidth" label-align="right">
							<switch @change="binddata('disabled', $event.detail.value)" :checked="formData.disabled"></switch>
						</uni-forms-item>
					</uni-col>
				</uni-row>
			</view>
			<!-- 位置信息 -->
			<view class="st-box">
				<view class="st-card-header">位置信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="address" label="详细地址" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写详细地址" v-model="formData.address" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="longitude" label="经度" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请选择经度" v-model="formData.longitude" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="latitude" label="纬度" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请选择纬度" v-model="formData.latitude" trim="both"></uni-easyinput>
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
	} from '@/js_sdk/validator/st-coop.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'st-coop';

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
				"coop_name": "",
				"contact_name": "",
				"contact_phone": "",
				"address": "",
				"longitude": "",
				"latitude": "",
				"scope": "",
				"image": null,
				"disabled": false
			}
			return {
				labelWidth: 90,
				imageStyles: {
					width: 100,
					height: 100,
				},
				formData,
				formOptions: {},
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {

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