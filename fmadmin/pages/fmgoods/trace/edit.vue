<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<uni-forms-item name="goods_id" label="商品名称" :label-width="labelWidth" label-align="right">
				<uni-data-select collection="fm-goods" field="_id as value, name as text" v-model="formData.goods_id"
					:clear="true" @change="onChangeGoods" ref="dataSelect" placeholder="请选择商品名称" />
			</uni-forms-item>
			<uni-forms-item name="made_company" label="生产企业" required :label-width="labelWidth" label-align="right">
				<uni-easyinput placeholder="请填写生产企业" v-model="formData.made_company" trim="both"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="area_code" label="生产地址" :label-width="labelWidth" label-align="right">
				<uni-data-picker self-field="code" parent-field="parent_code" v-model="formData.area_code"
					collection="opendb-city-china" orderby="value asc" field="code as value, name as text, eq(type, 2) as isleaf"
					@change="onChange"></uni-data-picker>
			</uni-forms-item>
			<uni-forms-item name="create_time" label="生产批次" required :label-width="labelWidth" label-align="right">
				<uni-datetime-picker type="date" return-type="timestamp" v-model="formData.create_time"></uni-datetime-picker>
			</uni-forms-item>
			<uni-forms-item name="expire_time" label="有效期至" :label-width="labelWidth" label-align="right">
				<uni-datetime-picker type="date" return-type="timestamp" v-model="formData.expire_time"></uni-datetime-picker>
			</uni-forms-item>
			<uni-forms-item name="image_produce" label="生产许可证" :label-width="labelWidth" label-align="right">
				<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object"
					v-model="formData.image_produce" :image-styles="imageStyles"></uni-file-picker>
			</uni-forms-item>
			<uni-forms-item name="image_report" label="质检报告" :label-width="labelWidth" label-align="right">
				<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object"
					v-model="formData.image_report" :image-styles="imageStyles"></uni-file-picker>
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
	} from '@/js_sdk/validator/fm-goods-trace.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'fm-goods-trace';

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
				"goods_id": "",
				"goods_name": "",
				"made_company": "",
				"province_code": "",
				"city_code": "",
				"area_code": "",
				"province_name": "",
				"city_name": "",
				"area_name": "",
				"made_address": "",
				"create_time": null,
				"expire_time": null,
				"image_produce": null,
				"image_report": null
			}
			return {
				labelWidth: 80,
				imageStyles: {
					width: 140,
					height: 140,
				},
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
			onChangeGoods(e) {
				if (e) {
					this.formData.goods_name = this.$refs.dataSelect.current
				} else {
					this.formData.goods_name = ''
				}
			},
			onChange(e) {
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
				value.goods_name = this.formData.goods_name
				value.province_name = this.formData.province_name
				value.province_code = this.formData.province_code
				value.city_name = this.formData.city_name
				value.city_code = this.formData.city_code
				value.area_name = this.formData.area_name
				value.made_address = value.province_name + value.city_name + value.area_name
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
					"goods_id,goods_name,made_company,province_code,city_code,area_code,province_name,city_name,area_name,made_address,create_time,expire_time,image_produce,image_report"
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