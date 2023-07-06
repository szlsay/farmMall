<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">

			<!-- 基本信息 -->
			<view class="st-box">
				<view class="st-card-header">基本信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="land_name" label="地块名称" required :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="例如：一号地块、一号大棚" v-model="formData.land_name" trim="both"
								maxlength="20"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="land_type" label="地块类型" required :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请选择地块类型" v-model="formData.land_type" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="contact_name" label="负责人姓名" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请输入负责人姓名" v-model="formData.contact_name" trim="both"
								maxlength="20"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="contact_phone" label="负责人电话" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请输入负责人电话" v-model="formData.contact_phone" trim="both"
								maxlength="11"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="map_address" label="地图选址" :label-width="labelWidth" label-align="right">
							<uni-easyinput type="textarea" placeholder="请从地图上选址" v-model="formData.map_address" trim="both"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="address" label="详细地址" :label-width="labelWidth" label-align="right">
							<uni-easyinput type="textarea" placeholder="请填写详细地址" v-model="formData.address"
								trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="longitude" label="经度" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请选择经度" v-model="formData.longitude" trim="both" disabled></uni-easyinput>
						</uni-forms-item>
						<uni-forms-item name="latitude" label="纬度" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请选择纬度" v-model="formData.latitude" trim="both" disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-forms-item name="image_content" label="地块实景" :label-width="labelWidth" label-align="right">
						<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="array"
							v-model="formData.image_content" limit="6" :image-styles="imageStyles"></uni-file-picker>
						<text style="color: red; font-size: 14px;" class="title-alert">用于地块的详情展示，最多六张。格式：jpg,png,webp</text>
					</uni-forms-item>
				</uni-row>
				<uni-row>
					<uni-forms-item name="video" label="实景视频" :label-width="labelWidth" label-align="right">
						<uni-file-picker file-mediatype="file" return-type="object" v-model="formData.video"></uni-file-picker>
					</uni-forms-item>
				</uni-row>
				<uni-row>
					<uni-forms-item name="disabled" label="是否禁用" :label-width="labelWidth" label-align="right">
						<switch @change="binddata('disabled', $event.detail.value)" :checked="formData.disabled"></switch>
					</uni-forms-item>
				</uni-row>
			</view>
			
			<!-- 位置信息 -->
			<view class="st-box">
				<view class="st-card-header">位置信息</view>
				<uni-row :gutter="20">
					<uni-col :xs="24" :sm="12">
						<view class="map-search">
							<input class="uni-search" type="text" v-model="queryMap" @confirm="onSearch"
								placeholder="请输入搜索地址" />
							<button class="uni-button" type="default" size="mini" @click="onSearch">搜索</button>
						</view>
						<view class="map-list" v-for="item in searchList" @click="onClickMap(item)">
							{{item.name}}
						</view>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<view id="map">
						</view>
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
	} from '@/js_sdk/validator/st-land.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'st-land';

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
				"land_name": "",
				"land_type": "",
				"contact_name": "",
				"contact_phone": "",
				"map_address": "",
				"address": "",
				"longitude": "",
				"latitude": "",
				"image_content": [],
				"video": null,
				"disabled": false
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