<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<view class="fm-box">
				<view class="fm-card-header">基本信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="name" label="套餐名称" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写套餐名称" v-model="formData.name" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="unit" label="计量单位" :label-width="labelWidth" label-align="right">
							<uni-data-select placeholder="请选择" v-model="formData.unit"
								:localdata="formOptions.unit_localdata"></uni-data-select>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-forms-item name="image" label="套餐主图" :label-width="labelWidth" label-align="right">
					<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object"
						v-model="formData.image" :image-styles="imageStyles"></uni-file-picker>
					<text style="color: red; font-size: 14px;">用于套餐的封面展示。格式：jpg,png,webp，建议400*400px的图片</text>
				</uni-forms-item>
				<uni-forms-item name="image_content" label="展示图片" :label-width="labelWidth" label-align="right">
					<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="array"
						v-model="formData.image_content" limit="6" :image-styles="imageStyles"></uni-file-picker>
					<text style="color: red; font-size: 14px;" class="title-alert">用于套餐的详情展示，最多六张。格式：jpg,png,webp</text>
				</uni-forms-item>
			</view>

			<view class="fm-box">
				<view class="fm-card-header">价格信息</view>
				<uni-forms-item name="price_cost" label="成本价" :label-width="labelWidth" label-align="right">
					<uni-easyinput placeholder="请填写成本价" type="number" v-model="formData.price_cost"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="price_original" label="原价" :label-width="labelWidth" label-align="right">
					<uni-easyinput placeholder="请填写原价" type="number" v-model="formData.price_original"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="price_sell" label="售价" :label-width="labelWidth" label-align="right">
					<uni-easyinput placeholder="请填写售价" type="number" v-model="formData.price_sell"></uni-easyinput>
				</uni-forms-item>
			</view>
			<view class="fm-box">
				<view class="fm-card-header">价格信息</view>
				<uni-forms-item name="description" label="产品描述" :label-width="labelWidth" label-align="right">
					<uni-easyinput placeholder="请填写产品描述" v-model="formData.description" trim="both"></uni-easyinput>
				</uni-forms-item>
			</view>
			<view class="fm-box">
				<view class="fm-card-header">价格信息</view>
				<uni-forms-item name="sku" label="套餐规格" :label-width="labelWidth" label-align="right">
					<uni-data-checkbox :multiple="true" v-model="formData.sku"></uni-data-checkbox>
				</uni-forms-item>
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
				"is_delete": false,
				"image": null,
				"name": "",
				"unit": 0,
				"price_cost": null,
				"price_original": null,
				"price_sell": null,
				"source_type": 0,
				"stock": null,
				"storage": "",
				"expiry": null,
				"buy_min": null,
				"buy_max": null,
				"description": "",
				"image_content": [],
				"create_uid": "",
				"create_time": null,
				"update_time": null,
				"sku": []
			}
			return {
				imageStyles: {
					width: 140,
					height: 140,
				},
				labelWidth: 80,
				formData,
				formOptions: {
					"unit_localdata": [{
							"text": "份",
							"value": 0
						},
						{
							"text": "斤",
							"value": 1
						},
						{
							"text": "箱",
							"value": 2
						},
						{
							"text": "袋",
							"value": 3
						}
					],
					"source_type_localdata": [{
							"text": "库存现货",
							"value": 0
						},
						{
							"text": "预售采购",
							"value": 1
						}
					]
				},
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