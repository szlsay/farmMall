<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<!-- 基本信息 -->
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
					<uni-forms-item name="image" label="产品主图" :label-width="labelWidth" label-align="right">
						<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object"
							v-model="formData.image" :image-styles="imageStyles"></uni-file-picker>
						<text style="color: red; font-size: 14px;">用于产品的封面展示。格式：jpg,png,webp，建议400*400px的图片</text>
					</uni-forms-item>
				</uni-row>
				<uni-row>
					<uni-forms-item name="image_content" label="展示图片" :label-width="labelWidth" label-align="right">
						<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="array"
							v-model="formData.image_content" limit="6" :image-styles="imageStyles"></uni-file-picker>
						<text style="color: red; font-size: 14px;"
							class="title-alert">用于产品的详情展示，最多六张。格式：jpg,png,webp</text>
					</uni-forms-item>
				</uni-row>
			</view>
			<!-- 生产环节 -->
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
						<uni-forms-item name="yield_ratio" label="出成率" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写两位小数" type="number"
								v-model="formData.yield_ratio"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="finish_cost" label="成品成本(原料成本/出成率)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="自动计算成品成本" type="number" v-model="formData.finish_cost"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="processing_cost" label="加工成本(元)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="请填写加工成本" type="number"
								v-model="formData.processing_cost"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="transport_cost" label="运储成本(成品成本1%)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="自动计算运储成本" type="number" v-model="formData.transport_cost"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>

				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="reproduct_cost" label="再生产成本(元)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="请填写再生产成本" type="number"
								v-model="formData.reproduct_cost"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="sideline_income" label="副产品收入(元)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="请填写副产品收入" type="number"
								v-model="formData.sideline_income"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="quality_ratio" label="质信金率" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="自动计算质信金率" type="number" v-model="formData.quality_ratio"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="sum_cost" label="成本小计(元)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="自动计算成本小计" type="number" v-model="formData.sum_cost"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>

			</view>
			<!-- 营销环节 -->
			<view class="fm-box">
				<view class="fm-card-header">营销环节</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="fixed_ratio" label="定倍率" :label-width="labelWidthMax" label-align="right">
							<uni-easyinput placeholder="自动计算定倍率" type="number" v-model="formData.fixed_ratio"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="market_price" label="营销价格(元)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="自动计算营销价格" type="number" v-model="formData.market_price"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="pack_fee" label="包装费(营销价格2%)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="自动计算包装费" type="number" v-model="formData.pack_fee"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="delivery_fee" label="配送费(营销价格2%)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="自动计算配送费" type="number" v-model="formData.delivery_fee"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="branch_fee" label="网点提成(营销价格2%)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="自动计算网点提成" type="number" v-model="formData.branch_fee"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="market_fee" label="营销费(营销价格5%)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="自动计算营销费" type="number" v-model="formData.market_fee"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="platform_fee" label="平台佣金(营销价格5%)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="自动计算平台佣金" type="number" v-model="formData.platform_fee"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
			</view>
			<!-- 结算环节 -->
			<view class="fm-box">
				<view class="fm-card-header">结算环节</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="gp_price" label="毛利润(元)" :label-width="labelWidthMax" label-align="right">
							<uni-easyinput placeholder="自动计算毛利润" type="number" v-model="formData.gp_price"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="product_bonus" label="生产奖励(毛利润10%)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="自动计算生产奖励" type="number" v-model="formData.product_bonus"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="market_bonus" label="营销奖励(毛利润10%)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="自动计算营销奖励" type="number" v-model="formData.market_bonus"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="develop_bonus" label="发展基金(毛利润2%)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="自动计算发展基金" type="number" v-model="formData.develop_bonus"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="ni_price" label="净利润(元)" :label-width="labelWidthMax" label-align="right">
							<uni-easyinput placeholder="自动计算净利润" type="number" v-model="formData.ni_price"
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
				"image": null,
				"image_content": [],
				"raw_cost": null,
				"yield_ratio": null,
				"processing_cost": null,
				"finish_cost": null,
				"transport_cost": null,
				"reproduct_cost": null,
				"sideline_income": null,
				"quality_ratio": null,
				"sum_cost": null,
				"fixed_ratio": null,
				"market_price": null,
				"pack_fee": null,
				"delivery_fee": null,
				"branch_fee": null,
				"market_fee": null,
				"platform_fee": null,
				"gp_price": null,
				"product_bonus": null,
				"market_bonus": null,
				"develop_bonus": null,
				"ni_price": null
			}
			return {
				imageStyles: {
					width: 140,
					height: 140,
				},
				labelWidth: 100,
				labelWidthMax: 200,
				formData,
				formOptions: {},
				rules: {
					...getValidator(Object.keys(formData))
				},
				testData: null
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
			"formData.yield_ratio": {
				handler(newV) {
					this.getFinishCost()
				}
			},
			"formData.processing_cost": {
				handler(newV) {
					this.getSumCost()
				}
			},
			"formData.reproduct_cost": {
				handler(newV) {
					this.getSumCost()
				}
			},
			"formData.sideline_income": {
				handler(newV) {
					this.getSumCost()
				}
			}
		},
		methods: {
			getNI() {
				const market_price = this.formData.market_price * 100
				const pack_fee = this.formData.pack_fee * 100
				const delivery_fee = this.formData.delivery_fee * 100
				const branch_fee = this.formData.branch_fee * 100
				const market_fee = this.formData.market_fee * 100
				const platform_fee = this.formData.platform_fee * 100
				const sum_cost = this.formData.sum_cost * 100
				this.formData.gp_price = Math.round(market_price - pack_fee - delivery_fee - branch_fee - market_fee -
					platform_fee - sum_cost) / 100

				const gpprice10 = Math.ceil(this.formData.gp_price * 10)
				const gpprice2 = Math.ceil(this.formData.gp_price * 2)
				this.formData.market_bonus = gpprice10 / 100
				this.formData.product_bonus = gpprice10 / 100
				this.formData.develop_bonus = gpprice2 / 100
				this.formData.ni_price = Math.floor(this.formData.gp_price * 100 - this.formData.market_bonus * 100 - this
					.formData.product_bonus * 100 - this.formData.develop_bonus * 100) / 100
			},
			getSumCost() {
				const quality_cost = Math.floor(this.formData.raw_cost * 100 * (this.formData.quality_ratio * 100))
				const finish_cost = Math.floor(this.formData.finish_cost * 10000)
				const processing_cost = Math.floor(this.formData.processing_cost * 10000)
				const transport_cost = Math.floor(this.formData.transport_cost * 10000)
				const reproduct_cost = Math.floor(this.formData.reproduct_cost * 10000)
				const sideline_income = Math.floor(this.formData.sideline_income * 10000)
				this.formData.sum_cost = Math.ceil((finish_cost + processing_cost + transport_cost + reproduct_cost -
					sideline_income + quality_cost) / 100) / 100

				const ratios_multiple = this.$store.state.sys.multiple_rules.filter(item => Number(item.start_value) <=
					this
					.formData
					.sum_cost && this.formData.sum_cost <= Number(item.end_value))
				if (ratios_multiple && ratios_multiple.length > 0) {
					this.formData.fixed_ratio = ratios_multiple[0].ratio / 100
				} else {
					this.formData.fixed_ratio = 0
				}

				this.formData.market_price = Math.ceil((this.formData.sum_cost * 100) * (this.formData.fixed_ratio * 100) /
					100) / 100

				this.formData.platform_fee = Math.ceil(this.formData.market_price * 5) / 100
				this.formData.market_fee = Math.ceil(this.formData.market_price * 5) / 100
				this.formData.pack_fee = Math.ceil(this.formData.market_price * 2) / 100
				this.formData.delivery_fee = Math.ceil(this.formData.market_price * 2) / 100
				this.formData.branch_fee = Math.ceil(this.formData.market_price * 2) / 100
				this.getNI()
			},
			getFinishCost() {
				const raw_cost = this.formData.raw_cost * 100
				const yieldNumber = this.formData.yield_ratio * 100
				let finish_cost = 0
				if (yieldNumber > 0) {
					finish_cost = Math.ceil(raw_cost / yieldNumber * 100) / 100
				} else {
					finish_cost = Math.ceil(raw_cost) / 100
				}
				this.formData.finish_cost = finish_cost
				const ratios = this.$store.state.sys.credit_rules.filter(item => Number(item.start_value) <= this.formData
					.raw_cost && this.formData.raw_cost <= Number(item.end_value))
				if (ratios && ratios.length > 0) {
					this.formData.quality_ratio = ratios[0].ratio * 100 / 10000
				} else {
					this.formData.quality_ratio = 0
				}
				// const ratios_multiple = this.$store.state.sys.multiple_rules.filter(item => Number(item.start_value) <=
				// 	this
				// 	.formData
				// 	.finish_cost && this.formData.finish_cost <= Number(item.end_value))
				// if (ratios_multiple && ratios_multiple.length > 0) {
				// 	this.formData.fixed_ratio = ratios_multiple[0].ratio / 100
				// } else {
				// 	this.formData.fixed_ratio = 0
				// }
				this.formData.transport_cost = Math.ceil(this.formData.finish_cost) / 100
				this.getSumCost()
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
				const fmproduct = uniCloud.importObject("fm-product")
				fmproduct.add(value).then((res) => {
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