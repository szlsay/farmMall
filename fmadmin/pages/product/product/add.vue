<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">

			<view class="fm-box">
				<view class="fm-card-header">基本信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item required name="name" label="产品名称" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写产品名称" v-model="formData.name" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="raw_name" label="原料名称" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写原材料名称" v-model="formData.raw_name"
								trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="unit" label="计量单位" :label-width="labelWidth" label-align="right">
							<uni-data-select placeholder="请选择计量单位" v-model="formData.unit"
								:localdata="$store.state.sys.measure_units" ref="dataSelectUnit"></uni-data-select>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-forms-item name="image" label="套餐主图" :label-width="labelWidth" label-align="right">
						<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object"
							v-model="formData.image" :image-styles="imageStyles"></uni-file-picker>
						<text style="color: red; font-size: 14px;">用于套餐的封面展示。格式：jpg,png,webp，建议400*400px的图片</text>
					</uni-forms-item>
				</uni-row>
				<uni-row>
					<uni-forms-item name="image_content" label="展示图片" :label-width="labelWidth" label-align="right">
						<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="array"
							v-model="formData.image_content" limit="6" :image-styles="imageStyles"></uni-file-picker>
						<text style="color: red; font-size: 14px;"
							class="title-alert">用于套餐的详情展示，最多六张。格式：jpg,png,webp</text>
					</uni-forms-item>
				</uni-row>
			</view>
			<view class="fm-box">
				<view class="fm-card-header">生产环节</view>
				<uni-row>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item name="raw_cost" label="原料成本(元)" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写原料成本" type="number"
								v-model="formData.raw_cost"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item name="yield" label="出成率(%)" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写两位小数" style="color: red;" type="number"
								v-model="formData.yield"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="finish_cost" label="成品成本(原料成本/出成率)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="自动计算成品成本" type="number" v-model="formData.finish_cost" disabled
								:styles="stylesDisabled"></uni-easyinput>
						</uni-forms-item>
					</uni-col>

				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="processing_cost" label="加工成本(元)" :label-width="labelWidth"
							label-align="right">
							<uni-easyinput placeholder="请填写加工成本" type="number"
								v-model="formData.processing_cost"></uni-easyinput>
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
	} from '@/js_sdk/validator/fm-product.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'fm-product';

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
				"raw_name": "",
				"unit": "",
				"unit_title": "",
				"image": null,
				"image_content": [],
				"raw_cost": null,
				"yield": null,
				"processing_cost": null,
				"finish_cost": null
			}
			return {
				imageStyles: {
					width: 140,
					height: 140,
				},
				stylesDisabled: {
					color: '#ffe',
				},
				labelWidth: 100,
				labelWidthMax: 200,
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
		watch: {
			"formData.raw_cost": {
				handler(newV) {
					this.getFinishCost()
				}
			},
			"formData.yield": {
				handler(newV) {
					this.getFinishCost()
				}
			},
		},
		methods: {
			getFinishCost() {
				const raw_cost = this.formData.raw_cost * 100
				const yieldNumber = this.formData.yield * 100
				let finish_cost = 0
				if (yieldNumber > 0) {
					finish_cost = Math.ceil(raw_cost / yieldNumber * 100) / 100
				} else {
					finish_cost = this.formData.raw_cost
				}
				this.formData.finish_cost = finish_cost
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