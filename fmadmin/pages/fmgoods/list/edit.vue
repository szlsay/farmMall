<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<uni-row>
				<uni-forms-item name="image" label="商品主图" :label-width="labelWidth" label-align="right">
					<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object"
						v-model="formData.image" :image-styles="imageStyles"></uni-file-picker>
					<text style="color: red; font-size: 14px;">请选择上传400*400px尺寸图片</text>
				</uni-forms-item>
			</uni-row>
			<uni-row>
				<uni-col :xs="24" :sm="12">
					<uni-forms-item name="name" label="商品名称" :label-width="labelWidth" label-align="right">
						<uni-easyinput placeholder="请填写商品名称" v-model="formData.name" trim="both" maxlength="10"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
				<uni-col :xs="24" :sm="12">
					<uni-forms-item name="area_code" label="商品产地" :label-width="labelWidth" label-align="right">
						<uni-data-picker self-field="code" parent-field="parent_code" v-model="formData.area_code"
							collection="opendb-city-china" orderby="value asc"
							field="code as value, name as text, eq(type, 2) as isleaf" @change="onChange"></uni-data-picker>
					</uni-forms-item>
				</uni-col>
			</uni-row>
			<uni-row>
				<uni-col :xs="24" :sm="6">
					<uni-forms-item name="unit" label="计量单位" :label-width="labelWidth" label-align="right">
						<uni-data-select placeholder="请选择" v-model="formData.unit"
							:localdata="formOptions.unit_localdata"></uni-data-select>
					</uni-forms-item>
				</uni-col>
				<uni-col :xs="24" :sm="6">
					<uni-forms-item name="price_cost" label="成本价" :label-width="labelWidth" label-align="right">
						<uni-easyinput placeholder="请填写成本价" type="number" v-model="formData.price_cost"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
				<uni-col :xs="24" :sm="6">
					<uni-forms-item name="price_original" label="原价" :label-width="labelWidth" label-align="right">
						<uni-easyinput placeholder="请填写原价" type="number" v-model="formData.price_original"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
				<uni-col :xs="24" :sm="6">
					<uni-forms-item name="price_sell" label="售价" :label-width="labelWidth" label-align="right">
						<uni-easyinput placeholder="请填写售价" type="number" v-model="formData.price_sell"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
			</uni-row>
			<uni-row>
				<uni-col :xs="24" :sm="12">
					<uni-forms-item name="source_type" label="商品来源" :label-width="labelWidth" label-align="right">
						<uni-data-checkbox v-model="formData.source_type" :localdata="formOptions.source_type_localdata"
							style="padding-top: 5px;"></uni-data-checkbox>
					</uni-forms-item>
				</uni-col>
				<uni-col :xs="24" :sm="12" v-if="formData.source_type === 0">
					<uni-forms-item name="stock" label="库存" :label-width="labelWidth" label-align="right">
						<uni-easyinput placeholder="请填写库存" type="number" v-model="formData.stock"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
			</uni-row>

			<uni-row>
				<uni-col :xs="24" :sm="12">
					<uni-forms-item name="storage" label="存储条件" :label-width="labelWidth">
						<uni-easyinput type="textarea" placeholder="请填写存储条件" v-model="formData.storage" trim="both"
							maxlength="200"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
				<uni-col :xs="24" :sm="12">
					<uni-forms-item name="expiry" label="保质期(天)" :label-width="labelWidth" label-align="right">
						<uni-easyinput placeholder="请填写保质期" type="number" v-model="formData.expiry" maxlength="6"
							width="100"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
			</uni-row>
			<uni-row>
				<uni-col :xs="24" :sm="12">
					<uni-forms-item name="buy_min" label="最小起购" :label-width="labelWidth" label-align="right">
						<uni-easyinput placeholder="请填写最小起购" type="number" v-model="formData.buy_min" maxlength="7"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
				<uni-col :xs="24" :sm="12">
					<uni-forms-item name="buy_max" label="最大起购" :label-width="labelWidth" label-align="right">
						<uni-easyinput placeholder="请填写最大起购" type="number" v-model="formData.buy_max" maxlength="7"></uni-easyinput>
					</uni-forms-item>
				</uni-col>
			</uni-row>

			<uni-forms-item name="description" label="商品描述" :label-width="labelWidth" label-align="right">
				<uni-easyinput type="textarea" placeholder="请填写商品描述" v-model="formData.description" trim="both"
					maxlength="200"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="image_content" label="展示图片" :label-width="labelWidth" label-align="right">
				<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="array"
					v-model="formData.image_content" limit="6" :image-styles="imageStyles"></uni-file-picker>
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
	} from '@/js_sdk/validator/fm-goods.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'fm-goods';

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
				"image": null,
				"name": "",
				"province_code": "",
				"city_code": "",
				"area_code": "",
				"province_name": "",
				"city_name": "",
				"area_name": "",
				"producer": "",
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
				"image_content": []
			}
			return {
				labelWidth: 80,
				imageStyles: {
					width: 140,
					height: 140,
				},
				formData,
				formOptions: {
					"source_type_localdata": [{
							"text": "库存现货",
							"value": 0
						},
						{
							"text": "预售采购",
							"value": 1
						}
					],
					"unit_localdata": [{
							"text": "斤",
							"value": 0
						},
						{
							"text": "吨",
							"value": 1
						},
						{
							"text": "只",
							"value": 2
						},
						{
							"text": "袋",
							"value": 3
						},
						{
							"text": "箱",
							"value": 4
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
			onChange(e) {
				console.log(e)
				if (e.detail && e.detail.value && e.detail.value.length === 3) {
					const value = e.detail.value
					this.formData.province_name = value[0].text
					this.formData.province_code = value[0].value
					this.formData.city_name = value[1].text
					this.formData.city_code = value[1].value
					this.formData.area_name = value[2].text
				}
			},

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
				value.province_name = this.formData.province_name
				value.province_code = this.formData.province_code
				value.city_name = this.formData.city_name
				value.city_code = this.formData.city_code
				value.area_name = this.formData.area_name
				value.producer = value.province_name + value.city_name + value.area_name
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
					"image,name,province_code,city_code,area_code,province_name,city_name,area_name,producer,unit,price_cost,price_original,price_sell,source_type,stock,storage,expiry,buy_min,buy_max,description,image_content"
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