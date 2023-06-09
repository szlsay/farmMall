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
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="processing_cost" label="加工成本(元)" :label-width="labelWidth"
							label-align="right">
							<uni-easyinput placeholder="请填写加工成本" type="number"
								v-model="formData.processing_cost"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="transport_cost" label="运储成本(元)" :label-width="labelWidth"
							label-align="right">
							<uni-easyinput placeholder="请填写运储成本" type="number"
								v-model="formData.transport_cost"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="reproduct_cost" label="再生成本(元)" :label-width="labelWidth"
							label-align="right">
							<uni-easyinput placeholder="请填写再生产成本" type="number"
								v-model="formData.reproduct_cost"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="sideline_income" label="副产收入(元)" :label-width="labelWidth"
							label-align="right">
							<uni-easyinput placeholder="请填写副产品收入" type="number"
								v-model="formData.sideline_income"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="quality_ratio" label="质信金率" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="自动计算质信金率" type="number" v-model="formData.quality_ratio"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="sum_cost" label="成本小计(元)" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="自动计算成本小计" type="number" v-model="formData.sum_cost"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="fixed_ratio" label="定倍率" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="自动计算定倍率" type="number" v-model="formData.fixed_ratio"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="market_price" label="营销价格(元)" :label-width="labelWidth"
							label-align="right">
							<uni-easyinput placeholder="自动计算营销价格" type="number" v-model="formData.market_price"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8"></uni-col>
				</uni-row>
			</view>
			<!-- 营销环节 -->
			<view class="fm-box">
				<view class="fm-card-header">营销环节</view>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="pack_fee" label="包装费(元)" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写包装费" type="number"
								v-model="formData.pack_fee"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="delivery_fee" label="配送费(元)" :label-width="labelWidth"
							label-align="right">
							<uni-easyinput placeholder="请填写配送费" type="number"
								v-model="formData.delivery_fee"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="branch_fee" label="网点提成(元)" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写网点提成" type="number"
								v-model="formData.branch_fee"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="market_fee" label="营销费(元)" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写营销费" type="number"
								v-model="formData.market_fee"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="platform_fee" label="平台佣金(营销价格*0.05)" :label-width="labelWidthMax"
							label-align="right">
							<uni-easyinput placeholder="自动计算平台佣金" type="number" v-model="formData.platform_fee"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item label="利润金额(元)" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="自动计算利润金额" type="number" v-model="ni_price"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
			</view>

			<!-- 结算环节 -->
			<view class="fm-box">
				<view class="fm-card-header">结算环节</view>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="gp_ratio" label="毛利润" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="自动计算毛利润" type="number" v-model="formData.gp_ratio"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="product_ratio" label="生产奖励" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写两位小数" type="number"
								v-model="formData.product_ratio"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="market_ratio" label="营销奖励" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写两位小数" type="number"
								v-model="formData.market_ratio"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="develop_ratio" label="发展基金" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写两位小数" type="number"
								v-model="formData.develop_ratio"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="ni_ratio" label="净利润" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写两位小数" type="number"
								v-model="formData.ni_ratio"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8"></uni-col>
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
				"gp_ratio": null,
				"product_ratio": null,
				"market_ratio": null,
				"develop_ratio": null,
				"ni_ratio": null
			}
			return {
				ni_price: null,
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
			"formData.transport_cost": {
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
			},
			"formData.pack_fee": {
				handler(newV) {
					this.getNI()
				}
			},
			"formData.delivery_fee": {
				handler(newV) {
					this.getNI()
				}
			},
			"formData.branch_fee": {
				handler(newV) {
					this.getNI()
				}
			},
			"formData.market_fee": {
				handler(newV) {
					this.getNI()
				}
			},
			"formData.platform_fee": {
				handler(newV) {
					this.getNI()
				}
			},
			"formData.product_ratio": {
				handler(newV) {
					this.getNiRatio()
				}
			},
			"formData.market_ratio": {
				handler(newV) {
					this.getNiRatio()
				}
			},
			"formData.develop_ratio": {
				handler(newV) {
					this.getNiRatio()
				}
			}
		},
		methods: {
			getNiRatio() {
				const gp_ratio = this.formData.gp_ratio * 100
				const product_ratio = this.formData.product_ratio * 100
				const market_ratio = this.formData.market_ratio * 100
				const develop_ratio = this.formData.develop_ratio * 100
				this.formData.ni_ratio = Math.floor(gp_ratio - product_ratio - market_ratio - develop_ratio) / 100
			},
			getNI() {
				const market_price = this.formData.market_price * 100
				const pack_fee = this.formData.pack_fee * 100
				const delivery_fee = this.formData.delivery_fee * 100
				const branch_fee = this.formData.branch_fee * 100
				const market_fee = this.formData.market_fee * 100
				const platform_fee = this.formData.platform_fee * 100
				const sum_cost = this.formData.sum_cost * 100
				this.ni_price = Math.round(market_price - pack_fee - delivery_fee - branch_fee - market_fee -
					platform_fee - sum_cost) / 100
				this.formData.gp_ratio = Math.floor(this.ni_price * 10000 / market_price) / 100
				this.getNiRatio()
			},
			getSumCost() {
				const quality_cost = Math.floor(this.formData.finish_cost * 100 * (this.formData.quality_ratio * 100))
				const finish_cost = Math.floor(this.formData.finish_cost * 10000)
				const processing_cost = Math.floor(this.formData.processing_cost * 10000)
				const transport_cost = Math.floor(this.formData.transport_cost * 10000)
				const reproduct_cost = Math.floor(this.formData.reproduct_cost * 10000)
				const sideline_income = Math.floor(this.formData.sideline_income * 10000)
				this.formData.sum_cost = Math.ceil((finish_cost + processing_cost + transport_cost + reproduct_cost -
					sideline_income + quality_cost) / 100) / 100
				this.formData.market_price = Math.ceil((this.formData.sum_cost * 100) * (this.formData.fixed_ratio * 100) /
					100) / 100

				this.formData.platform_fee = Math.ceil(this.formData.market_price * 5) / 100

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
					.finish_cost && this.formData.finish_cost <= Number(item.end_value))
				if (ratios && ratios.length > 0) {
					this.formData.quality_ratio = ratios[0].ratio * 100 / 10000
				} else {
					this.formData.quality_ratio = 0
				}
				const ratios_multiple = this.$store.state.sys.multiple_rules.filter(item => Number(item.start_value) <=
					this
					.formData
					.finish_cost && this.formData.finish_cost <= Number(item.end_value))
				if (ratios_multiple && ratios_multiple.length > 0) {
					this.formData.fixed_ratio = ratios_multiple[0].ratio / 100
				} else {
					this.formData.fixed_ratio = 0
				}
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
<style lang="scss" scoped>
	::v-deep .is-disabled {
		color: black !important;
	}
</style>