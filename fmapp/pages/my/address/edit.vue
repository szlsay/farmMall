<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item name="receive_name" label="收货人姓名" required :label-width="labelWidth" label-align="right">
				<uni-easyinput placeholder="收货人姓名" v-model="formData.receive_name" trim="both" maxlength="10"
					primaryColor="#00CC99"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="receive_mobile" label="手机号码" required :label-width="labelWidth" label-align="right">
				<uni-easyinput placeholder="手机号码" v-model="formData.receive_mobile" trim="both" type="number" maxlength="11"
					primaryColor="#00CC99"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="area_code" label="所在地区" required :label-width="labelWidth" label-align="right">
				<uni-data-picker self-field="code" parent-field="parent_code" v-model="formData.area_code"
					collection="opendb-city-china" orderby="value asc" field="code as value, name as text, eq(type, 2) as isleaf"
					@change="onChangeArea"></uni-data-picker>
			</uni-forms-item>
			<uni-forms-item name="address" label="详细住址" required :label-width="labelWidth" label-align="right">
				<uni-easyinput placeholder="省市区后面的详细住址，包含街道小区房间号" type="textarea" v-model="formData.address" trim="both"
					primaryColor="#00CC99" maxlength="50"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="is_default" label="设置为默认地址" label-width="150" label-align="right">
				<switch @change="binddata('is_default', $event.detail.value)" :checked="formData.is_default" color="#00CC99">
				</switch>
			</uni-forms-item>
			<view class="footer">
				<view class="btn-remove" @click="onClickRemove">
					删除
				</view>
				<view class="btn-add" @click="submit">
					保存
				</view>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		validator
	} from '@/js_sdk/validator/fm-address.js';

	const db = uniCloud.database();
	const dbCollectionName = 'fm-address';

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
				"receive_name": "",
				"receive_mobile": "",
				"province_code": "",
				"city_code": "",
				"area_code": "",
				"province_name": "",
				"city_name": "",
				"area_name": "",
				"address": "",
				"full_address": "",
				"is_default": false
			}
			return {
				labelWidth: 90,
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
			onClickRemove() {
				const that = this;
				uni.showModal({
					title: '提示',
					content: '确定要删除此收货地址吗？',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							that.handleDelete();
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			handleDelete() {
				const fmaddress = uniCloud.importObject('fm-address')
				fmaddress.delete(this.formDataId).then((res) => {
					uni.showToast({
						title: '删除成功'
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
			onChangeArea(e) {
				if (e.detail && e.detail.value && e.detail.value.length === 3) {
					const value = e.detail.value
					this.formData.province_name = value[0].text
					this.formData.province_code = value[0].value
					this.formData.city_name = value[1].text
					this.formData.city_code = value[1].value
					this.formData.area_name = value[2].text
				} else {
					this.formData.province_name = ""
					this.formData.province_code = ""
					this.formData.city_name = ""
					this.formData.city_code = ""
					this.formData.area_name = ""
				}
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
			async submitForm(value) {
				value.province_name = this.formData.province_name
				value.province_code = this.formData.province_code
				value.city_name = this.formData.city_name
				value.city_code = this.formData.city_code
				value.area_name = this.formData.area_name
				value.full_address = value.province_name + value.city_name + value.area_name + value.address
				const fmaddress = uniCloud.importObject("fm-address")
				fmaddress.update(this.formDataId, value).then((res) => {
					uni.showToast({
						title: '修改成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					uni.navigateBack()
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				})
			},
			getDetail(id) {
				uni.showLoading({
					mask: true
				})
				db.collection(dbCollectionName).doc(id).field(
					"receive_name,receive_mobile,province_code,city_code,area_code,province_name,city_name,area_name,address,full_address,is_default"
				).get().then((res) => {
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
	.footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 10rpx 32rpx 10rpx;
		background-color: white;

		display: flex;
		justify-content: space-around;

		.btn-add {
			width: 45%;
			height: 80rpx;
			background-color: #00CC99;
			border-radius: 40rpx;
			color: white;
			text-align: center;
			line-height: 80rpx;
		}

		.btn-remove {
			width: 45%;
			height: 80rpx;
			background-color: #ff4f01;
			border-radius: 40rpx;
			color: white;
			text-align: center;
			line-height: 80rpx;
		}
	}

	.uni-container {
		padding: 15px;
	}

	page {
		background-color: white;
	}
</style>