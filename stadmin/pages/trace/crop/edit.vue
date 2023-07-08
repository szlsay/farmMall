<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<!-- 基本信息 -->
			<view class="st-box">
				<view class="st-card-header">基本信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="cate_id" label="种类" required :label-width="labelWidth"
							label-align="right">
							<uni-data-select placeholder="请选择种类" v-model="formData.cate_id"
								:localdata="$store.state.trace.cate_list"></uni-data-select>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="crop_name" label="品种名称" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请输入品种名称" v-model="formData.crop_name"
								trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>

				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="land_id" label="地块" required :label-width="labelWidth"
							label-align="right">
							<uni-data-select placeholder="请选择地块" v-model="formData.land_id"
								:localdata="$store.state.trace.land_list"></uni-data-select>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="standard_type" label="种植标准" required :label-width="labelWidth"
							label-align="right">
							<uni-data-select placeholder="请选择种植标准" v-model="formData.standard_type"
								:localdata="$store.state.sys.standard_types"></uni-data-select>
						</uni-forms-item>
					</uni-col>
				</uni-row>

				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="plant_start_time" label="开始时间" :label-width="labelWidth"
							label-align="right">
							<uni-datetime-picker return-type="timestamp"
								v-model="formData.plant_start_time"></uni-datetime-picker>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="pick_time" label="收获时间" :label-width="labelWidth" label-align="right">
							<uni-datetime-picker return-type="timestamp"
								v-model="formData.pick_time"></uni-datetime-picker>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="plant_num" label="数量" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请输入数量" type="number"
								v-model="formData.plant_num"></uni-easyinput>
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
	} from '@/js_sdk/validator/st-crop.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'st-crop';

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
				"crop_name": "",
				"cate_id": "",
				"land_id": "",
				"standard_type": "",
				"plant_num": null,
				"plant_start_time": null,
				"pick_time": null
			}
			return {
				labelWidth: 90,
				imageStyles: {
					width: 100,
					height: 100,
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
			this.$store.dispatch("trace/getCateList")
			this.$store.dispatch("trace/getLandList")
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
					"crop_name,cate_id,land_id,standard_type,plant_num,plant_start_time,pick_time").get().then((
					res) => {
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