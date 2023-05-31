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
							<uni-data-select placeholder="请选择计量单位" v-model="formData.unit"
								:localdata="formOptions.unit_localdata"></uni-data-select>
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
				<view class="fm-card-header">套餐规格 (最大数量为{{skuMax}}个商品)</view>
				<uni-row v-for="(sku, index) in formData.sku" :key="index">
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="goods_id" label="商品名称" :label-width="labelWidth" label-align="right">
							<uni-data-select collection="fm-goods" field="_id as value, name as text"
								v-model="sku.goods_id" @change="onChangeGoods(index)" ref="dataSelect"
								placeholder="请选择商品" />
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="4">
						<uni-forms-item name="unit" label="计量单位" :label-width="labelWidth" label-align="right">
							<uni-data-select placeholder="请选择计量单位" v-model="sku.unit"
								:localdata="formOptions.unit_localdata"></uni-data-select>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="qty" label="数量" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写数量" type="number" v-model="sku.qty"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="4">
						<button @click="onDeleteSku(index)" class="uni-button" size="mini" type="warn"
							style="margin-left: 40rpx; margin-top: 4rpx;">删除</button>
					</uni-col>
				</uni-row>
				<view class="uni-button-group" style="margin-top: 0;" v-if="formData.sku && formData.sku.length < 6">
					<button type="primary" class="uni-button" style="width: 100px;" @click="onAddSku">新增规格</button>
				</view>
			</view>
			<view class="fm-box">
				<view class="fm-card-header">配送信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="timer_unit" label="配送频率" :label-width="labelWidth" label-align="right">
							<uni-data-select placeholder="请选择配送频率" v-model="formData.delivery.timer_unit"
								:localdata="formOptions.timer_unit_localdata"></uni-data-select>
						</uni-forms-item>
					</uni-col>
				</uni-row>
			</view>
			<view class="fm-box">
				<view class="fm-card-header">产品信息</view>
				<uni-forms-item name="description" label="产品描述" :label-width="labelWidth" label-align="right">
					<uni-easyinput type="textarea" placeholder="请填写产品描述" v-model="formData.description" trim="both"
						maxlength="500"></uni-easyinput>
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
		toRaw
	} from "vue";
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
				"unit": null,
				"image": null,
				"image_content": [],
				"sku": [],
				"price_sell": null,
				"expiry": null,
				"reserve_begin": null,
				"reserve_end": null,
				"delivery": {
					"timer_unit": null
				},
				"description": ""
			}
			return {
				skuMax: 6,
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
					],
					"timer_unit_localdata": [{
							"text": "次/月",
							"value": 0
						},
						{
							"text": "次/周",
							"value": 1
						},
						{
							"text": "次/天",
							"value": 2
						},
						{
							"text": "其他",
							"value": 3
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
			this.onAddSku()
		},
		methods: {
			checkSku() {
				return this.formData.sku.filter(item => item.title && item.title.length > 0)
			},
			onAddSku() {
				const sku = {
					"goods_id": null,
					"goods_name": null,
					"qty": null,
					"unit": null,
				}
				this.formData.sku.push(sku)
			},
			onDeleteSku(index) {
				this.formData.sku.splice(index, 1)
			},
			onChangeGoods(index) {
				setTimeout(() => {
					this.formData.sku[index].goods_name = this.$refs.dataSelect[index].current
				}, 100)
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