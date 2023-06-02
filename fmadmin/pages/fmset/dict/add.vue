<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<view class="fm-box">
				<view class="fm-card-header">新增字典</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="title" label="名称" required :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写名称" maxlength="20" v-model="formData.title" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="type" label="英文标识" required :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写英文标识" maxlength="20" v-model="formData.type" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-forms-item name="description" label="备注" :label-width="labelWidth" label-align="right">
						<uni-easyinput type="textarea" placeholder="请填写备注" maxlength="100" v-model="formData.description"
							trim="both"></uni-easyinput>
					</uni-forms-item>
				</uni-row>
				<uni-row>
					<uni-forms-item name="enum" label="枚举" :label-width="labelWidth" label-align="right">
						<undefined v-model="formData.enum"></undefined>
					</uni-forms-item>
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
	} from '@/js_sdk/validator/fm-dict.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'fm-dict';

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
				"description": "",
				"enum": null
			}
			return {
				imageStyles: {
					width: 140,
					height: 140,
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