<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<view class="fm-box">
				<view class="fm-card-header">基本信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item required name="name" label="套餐名称" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写套餐名称" v-model="formData.name" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item required name="unit" label="计量单位" :label-width="labelWidth" label-align="right">
							<uni-data-select placeholder="请选择计量单位" v-model="formData.unit"
								:localdata="$store.state.sys.measure_units" @change="onChangeUnit"
								ref="dataSelectUnit"></uni-data-select>
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
				<uni-row v-for="(item, index) in formData.sku" :key="index">
					<uni-col :xs="24" :sm="6">
						<uni-forms-item required :name="['sku',index,'goods_id']" label="商品名称" :label-width="labelWidth"
							label-align="right">
							<uni-data-select collection="fm-goods" field="_id as value, name as text"
								v-model="item.goods_id" @change="onChangeGoods(index)" ref="dataSelectGoods"
								placeholder="请选择商品" :key="'goods' + index" />
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item required :name="['sku',index,'unit']" label="计量单位" :label-width="labelWidth"
							label-align="right">
							<uni-data-select placeholder="请选择计量单位" v-model="item.unit"
								:localdata="$store.state.sys.measure_units" @change="onChangeSkuUnit(index)"
								ref="dataSelectSkuUnit"></uni-data-select>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item required :name="['sku',index,'qty']" label="数量" :label-width="labelWidth"
							label-align="right">
							<uni-easyinput placeholder="请填写数量" type="number" v-model="item.qty"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
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
						<uni-forms-item name="delivery_rate" label="配送频率" :label-width="labelWidth" label-align="right">
							<uni-data-select placeholder="请选择配送频率" v-model="formData.delivery_rate"
								:localdata="$store.state.sys.delivery_rates" @change="onChangeDelivery"
								ref="dataSelectDelivery"></uni-data-select>
						</uni-forms-item>
					</uni-col>
				</uni-row>
			</view>
			<view class="fm-box">
				<view class="fm-card-header">产品信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="price_sell" label="售价" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写售价" type="number"
								v-model="formData.price_sell"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="expiry" label="保质期(天)" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写保质期" type="number" v-model="formData.expiry"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="reserve_begin" label="预定开始" :label-width="labelWidth" label-align="right">
							<uni-datetime-picker return-type="timestamp" type="date"
								v-model="formData.reserve_begin"></uni-datetime-picker>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="reserve_end" label="预定结束" :label-width="labelWidth" label-align="right">
							<uni-datetime-picker return-type="timestamp" type="date"
								v-model="formData.reserve_end"></uni-datetime-picker>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-forms-item name="description" label="产品描述" :label-width="labelWidth" label-align="right">
						<uni-easyinput type="textarea" placeholder="请填写产品描述" v-model="formData.description" trim="both"
							maxlength="500"></uni-easyinput>
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
	} from '@/js_sdk/validator/fm-combo.js';

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
				"unit": "",
				"unit_title": "",
				"image": null,
				"image_content": [],
				"sku": [],
				"delivery_rate": "",
				"delivery_rate_title": "",
				"price_sell": null,
				"expiry": null,
				"reserve_begin": null,
				"reserve_end": null,
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
			onChangeUnit() {
				setTimeout(() => {
					this.formData.unit_title = this.$refs.dataSelectUnit.current
				}, 100)
			},
			onChangeSkuUnit(index) {
				setTimeout(() => {
					this.formData.sku[index].unit_title = this.$refs.dataSelectSkuUnit[index].current
				}, 100)
			},
			onChangeDelivery() {
				setTimeout(() => {
					this.formData.delivery_rate_title = this.$refs.dataSelectDelivery.current
				}, 100)
			},
			onChangeGoods(index) {
				setTimeout(() => {
					this.formData.sku[index].goods_name = this.$refs.dataSelectGoods[index].current
				}, 100)
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
				if (this.formData.sku.length) value.sku = this.formData.sku
				value.unit_title = this.formData.unit_title
				value.delivery_rate_title = this.formData.delivery_rate_title
				const fmcombo = uniCloud.importObject("fm-combo")
				fmcombo.update(this.formDataId, value).then((res) => {
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
					"name,unit,unit_title,image,image_content,sku,delivery_rate,delivery_rate_title,price_sell,expiry,reserve_begin,reserve_end,description"
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