<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<uni-forms-item name="name" label="套餐名称">
				<uni-easyinput placeholder="请填写套餐名称" v-model="formData.name" trim="both"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="unit" label="计量单位">
				<uni-data-select placeholder="请选择计量单位" v-model="formData.unit"
					:localdata="formOptions.unit_localdata"></uni-data-select>
			</uni-forms-item>
			<uni-forms-item name="image" label="套餐主图">
				<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object"
					v-model="formData.image"></uni-file-picker>
			</uni-forms-item>
			<uni-forms-item name="image_content" label="展示图片">
				<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="array"
					v-model="formData.image_content"></uni-file-picker>
			</uni-forms-item>
			<uni-forms-item name="sku" label="套餐规格">
				<uni-data-checkbox :multiple="true" v-model="formData.sku"></uni-data-checkbox>
			</uni-forms-item>
			<uni-forms-item name="price_sell" label="售价">
				<uni-easyinput placeholder="请填写售价" type="number" v-model="formData.price_sell"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="expiry" label="保质期">
				<uni-easyinput placeholder="请填写保质期" type="number" v-model="formData.expiry"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="reserve_begin" label="预定开始时间">
				<uni-datetime-picker return-type="date" v-model="formData.reserve_begin"></uni-datetime-picker>
			</uni-forms-item>
			<uni-forms-item name="reserve_end" label="预定结束时间">
				<uni-datetime-picker return-type="date" v-model="formData.reserve_end"></uni-datetime-picker>
			</uni-forms-item>
			<uni-forms-item name="delivery" label="配送信息">
				<undefined v-model="formData.delivery"></undefined>
			</uni-forms-item>
			<uni-forms-item name="description" label="产品描述">
				<uni-easyinput placeholder="请填写产品描述" v-model="formData.description" trim="both"></uni-easyinput>
			</uni-forms-item>
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
	} from '../../js_sdk/validator/fm-combo.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'fm-combo';

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
				"name": "",
				"unit": 0,
				"image": null,
				"image_content": [],
				"sku": [],
				"price_sell": null,
				"expiry": null,
				"reserve_begin": null,
				"reserve_end": null,
				"delivery": null,
				"description": ""
			}
			return {
				formData,
				formOptions: {
					"unit_localdata": [{
							"text": "份",
							"value": 0
						},
						{
							"text": "千斤",
							"value": 1
						},
						{
							"text": "克",
							"value": 2
						},
						{
							"text": "只",
							"value": 3
						}
					]
				},
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
				db.collection(dbCollectionName).doc(id).field(
					"name,unit,image,image_content,sku,price_sell,expiry,reserve_begin,reserve_end,delivery,description"
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