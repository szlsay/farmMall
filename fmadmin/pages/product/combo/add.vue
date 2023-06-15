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
						<uni-forms-item required name="unit" label="产品单位" :label-width="labelWidth" label-align="right">
							<uni-data-select placeholder="请选择产品单位" v-model="formData.unit"
								:localdata="$store.state.sys.product_units" ref="dataSelectUnit"></uni-data-select>
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
						<uni-forms-item required :name="['sku',index,'product_id']" label="商品名称"
							:label-width="labelWidth" label-align="right">
							<uni-data-select :localdata="productList" v-model="item.product_id"
								@change="onChangeProduct(index)" ref="dataSelectProduct" placeholder="请选择商品"
								:key="'product' + index" />
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item :name="['sku',index,'unit']" label="计量单位" :label-width="labelWidth"
							label-align="right">
							<uni-data-select placeholder="自动匹配计量单位" v-model="item.unit"
								:localdata="$store.state.sys.measure_units" disabled></uni-data-select>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item required :name="['sku',index,'qty']" label="数量" :label-width="labelWidth"
							label-align="right">
							<uni-easyinput placeholder="请参考规格价格填写" type="number" v-model="item.qty"></uni-easyinput>
							<!-- <uni-number-box :min="0" :max="100" v-model="item.qty" /> -->
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
				<view class="fm-card-header">产品信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="product_price" label="规格价格" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="自动计算规格价格" type="number" v-model="formData.product_price"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="sell_price" label="实际售价" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请参考规格价格填写" type="number"
								v-model="formData.sell_price"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="reserve_begin" label="预订开始" :label-width="labelWidth" label-align="right">
							<uni-datetime-picker return-type="timestamp" type="date"
								v-model="formData.reserve_begin"></uni-datetime-picker>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="reserve_end" label="预订结束" :label-width="labelWidth" label-align="right">
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
			<view class="fm-box">
				<view class="fm-card-header">配送信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="delivery_ratio" label="配送频率" :label-width="labelWidth"
							label-align="right">
							<uni-data-select placeholder="请选择配送频率" v-model="formData.delivery_ratio"
								:localdata="$store.state.sys.delivery_ratios" @change="onChangeDelivery"
								ref="dataSelectDelivery"></uni-data-select>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="delivery_timer" label="配送次数" :label-width="labelWidth"
							label-align="right">
							<uni-easyinput placeholder="自动计算配送次数" type="number" v-model="formData.delivery_timer"
								disabled></uni-easyinput>
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
	} from '@/js_sdk/validator/fm-combo.js';

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
				"image": null,
				"image_content": [],
				"sku": [],
				"product_price": null,
				"sell_price": null,
				"delivery_ratio": "",
				"delivery_timer": null,
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
				},
				productList: []
			}
		},
		watch: {
			"formData.sku": {
				handler(newV) {
					let product_price = 0
					newV.map(item => {
						if (item.market_price && item.qty) {
							product_price += (item.market_price * 100) * (item.qty * 100)
						}
					})
					if (product_price > 0) {
						this.formData.product_price = Math.ceil(product_price) / 10000
					} else {
						this.formData.product_price = null
					}

				},
				deep: true
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
			this.onAddSku()
			this.getProducts()
		},
		methods: {
			getProducts() {
				const db = uniCloud.database()
				db.collection("fm-product").where({
					is_delete: false
				}).field("_id, name, unit, market_price").get().then(res => {
					const result = res.result.data.map(item => {
						item.value = item._id
						item.text = item.name
						return item
					})
					this.productList = result
				})
			},
			onChangeDelivery() {
				setTimeout(() => {
					const text = this.$refs.dataSelectDelivery.current
					if (text && text === '次/周') {
						this.formData.delivery_timer = 52
					} else if (text && text === '次/月') {
						this.formData.delivery_timer = 12
					} else {
						this.formData.delivery_timer = null
					}
				}, 100)
			},
			onChangeProduct(index) {
				setTimeout(() => {
					const name = this.$refs.dataSelectProduct[index].current
					if (name && name != '') {
						const product = this.productList.filter(item => item.name === name)[0]
						this.formData.sku[index].unit = product.unit
						this.formData.sku[index].product_name = product.name
						this.formData.sku[index].market_price = product.market_price
					} else {
						this.formData.sku[index].product_id = null
						this.formData.sku[index].unit = null
						this.formData.sku[index].product_name = null
						this.formData.sku[index].market_price = null
					}
				}, 100)
			},
			onAddSku() {
				const sku = {
					"product_id": null,
					"product_name": null,
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
				value.delivery_ratio_title = this.formData.delivery_ratio_title
				const fmcombo = uniCloud.importObject("fm-combo")
				fmcombo.add(value).then((res) => {
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
<style lang="scss" scoped>
	::v-deep .is-disabled {
		color: black !important;
	}
</style>