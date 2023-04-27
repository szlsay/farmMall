<template>
	<view class="container">
		<!-- <unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="options"
			:collection="collectionList" :getone="true" :manual="true">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="loading">
				<uni-load-more :contentText="loadMore" status="loading"></uni-load-more>
			</view>
			<view v-else-if="data">
				<view>
					<text>商品主图</text>
					<uni-file-picker v-if="data.image && data.image.fileType == 'image'" :value="data.image"
						:file-mediatype="data.image && data.image.fileType" return-type="object" readonly></uni-file-picker>
					<uni-link v-else-if="data.image" :href="data.image.url" :text="data.image.url"></uni-link>
					<text v-else></text>
				</view>
				<view>
					<text>商品名称</text>
					<text>{{data.name}}</text>
				</view>
				<view>
					<text>省</text>
					<text>{{data.province_code}}</text>
				</view>
				<view>
					<text>市</text>
					<text>{{data.city_code}}</text>
				</view>
				<view>
					<text>省市区</text>
					<text>{{data.area_code && data.area_code[0] && data.area_code[0].text}}</text>
				</view>
				<view>
					<text>省</text>
					<text>{{data.province_name}}</text>
				</view>
				<view>
					<text>市</text>
					<text>{{data.city_name}}</text>
				</view>
				<view>
					<text>区</text>
					<text>{{data.area_name}}</text>
				</view>
				<view>
					<text>商品产地</text>
					<text>{{data.producer}}</text>
				</view>
				<view>
					<text>计量单位</text>
					<text>{{options.unit_valuetotext[data.unit]}}</text>
				</view>
				<view>
					<text>成本价</text>
					<text>{{data.price_cost}}</text>
				</view>
				<view>
					<text>原价</text>
					<text>{{data.price_original}}</text>
				</view>
				<view>
					<text>售价</text>
					<text>{{data.price_sell}}</text>
				</view>
				<view>
					<text>商品来源</text>
					<text>{{options.source_type_valuetotext[data.source_type]}}</text>
				</view>
				<view>
					<text>库存</text>
					<text>{{data.stock}}</text>
				</view>
				<view>
					<text>存储条件</text>
					<text>{{data.storage}}</text>
				</view>
				<view>
					<text>保质期</text>
					<text>{{data.expiry}}</text>
				</view>
				<view>
					<text>最小起购</text>
					<text>{{data.buy_min}}</text>
				</view>
				<view>
					<text>最大起购</text>
					<text>{{data.buy_max}}</text>
				</view>
				<view>
					<text>商品描述</text>
					<text>{{data.description}}</text>
				</view>
				<view>
					<text>展示图片</text>
					<template v-for="(file, j) in data.image_content">
						<uni-file-picker v-if="file.fileType == 'image'" :value="file" :file-mediatype="file.fileType"
							return-type="object" readonly></uni-file-picker>
						<uni-link v-else :href="file.url" :text="file.url"></uni-link>
					</template>
				</view>
			</view>
		</unicloud-db> -->
		<!--    <view class="btns">
      <button type="primary" @click="handleUpdate">修改</button>
      <button type="warn" class="btn-delete" @click="handleDelete">删除</button>
    </view> -->


		<view class="header">
			<view class="banner">
				<swiper circular indicator-dots>
					<swiper-item v-if="formData.image && formData.image.fileType == 'image'">
						<image :src="formData.image.url" class="fm_image" mode="aspectFill"></image>
					</swiper-item>
					<swiper-item v-for="(item, index) in formData.image_content" :key="index">
						<image v-if="item && item.fileType == 'image'" :src="item.url" class="fm_image" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="footer"></view>

		<!-- {{formData}} -->
	</view>
</template>

<script>
	// 由schema2code生成，包含校验规则和enum静态数据
	// import {
	// 	enumConverter
	// } from '@/js_sdk/validator/fm-goods.js'
	const db = uniCloud.database()
	const dbCollectionName = 'fm-goods';

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
				formData,

				// queryWhere: '',
				// collectionList: [db.collection('fm-goods').field(
				// 	'image,name,province_code,city_code,area_code,province_name,city_name,area_name,producer,unit,price_cost,price_original,price_sell,source_type,stock,storage,expiry,buy_min,buy_max,description,image_content'
				// 	).getTemp(), db.collection('opendb-city-china').field('code, name as text, eq(type, 2) as isleaf')
				// .getTemp()],
				// loadMore: {
				// 	contentdown: '',
				// 	contentrefresh: '',
				// 	contentnomore: ''
				// },
				// options: {
				// 	// 将scheme enum 属性静态数据中的value转成text
				// 	...enumConverter
				// }
			}
		},
		onLoad(e) {
			if (e.id) {
				const id = e.id
				this._id = id
				this.getDetail(id)
			}
		},
		methods: {
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
			},
		}
	}
</script>
<style lang="scss" scoped>
	.banner {
		$view-width : 100vw;
		height: calc(#{$view-width});

		uni-swiper {
			height: 100%;

			.fm_image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
