<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item name="content" label="留言内容" required label-width="160rpx">
				<uni-easyinput placeholder="请输入留言内容" type="textarea" v-model="formData.content" trim="both"
					primaryColor="#00CC99" maxlength="200"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="image" label="意见图片" label-width="160rpx">
				<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object"
					v-model="formData.image"></uni-file-picker>
			</uni-forms-item>
			<uni-forms-item name="contact" label="联系人" label-width="160rpx">
				<uni-easyinput placeholder="请输入联系人" v-model="formData.contact" trim="both" maxlength="10"
					primaryColor="#00CC99"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="mobile" label="联系电话" label-width="160rpx">
				<uni-easyinput placeholder="请输入联系电话" v-model="formData.mobile" type="number" trim="both" maxlength="11"
					primaryColor="#00CC99"></uni-easyinput>
			</uni-forms-item>
			<view class="footer">
				<button class="btn-add" @click="submit" :disabled="disabled">提交</button>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		validator
	} from './feedback.js';
	console.log(validator);
	const db = uniCloud.database();
	const dbCollectionName = 'fm-feedback';

	function getValidator(fields) {
		let result = {}
		for (let key in validator) {
			if (fields.indexOf(key) > -1) {
				result[key] = validator[key]
			}
		}
		return result
	}

	export default {
		data() {
			let formData = {
				"content": "",
				"image": null,
				"contact": "",
				"mobile": ""
			}
			return {
				disabled: false,
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
			submit() {
				this.disabled = true
				uni.showLoading({
					mask: true
				})
				const that = this
				this.$refs.form.validate().then((res) => {
					this.submitForm(res)
				}).catch(() => {
					uni.hideLoading()
					that.disabled = false
				})
			},

			submitForm(value) {
				const that = this
				db.collection(dbCollectionName).add(value).then((res) => {
					uni.showToast({
						title: '提交成功'
					})
					uni.navigateBack()
					that.disabled = false
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
					that.disabled = false
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.footer {
		padding: 10rpx 32rpx 10rpx;
		margin-top: 100rpx;
		background-color: white;

		.btn-add {
			width: 100%;
			height: 80rpx;
			background-color: #00CC99;
			border-radius: 40rpx;
			color: white;
			text-align: center;
			line-height: 80rpx;
		}
	}

	.uni-container {
		padding: 32rpx;
	}

	page {
		background-color: white;
	}
</style>