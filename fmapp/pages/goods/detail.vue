<template>
	<view class="container">
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
			<view class="title">
				<view class="title-price">￥<text>{{formData.price_sell}}</text>/{{options.unit_valuetotext[formData.unit]}}
				</view>
				<view class="title-buy">
					{{formData.buy_min}}{{options.unit_valuetotext[formData.unit]}}起购
				</view>
			</view>
			<view class="name">
				{{formData.name}}
			</view>
			<view class="area">
				<uni-icons type="location" size="20" color="#999"></uni-icons>
				<text>{{formData.producer}}</text>
			</view>
		</view>
		<view class="divider"></view>
		<view class="footer">
			<view class="desc">
				{{formData.description}}
			</view>
			<image v-for="(item, index) in formData.image_content" :key="index" :src="item.url" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	// 由schema2code生成，包含校验规则和enum静态数据
	import {
		enumConverter
	} from '@/js_sdk/validator/fm-goods.js'
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
				options: {
					// 将scheme enum 属性静态数据中的value转成text
					...enumConverter
				}
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
	.header {
		background-color: white;
		padding-bottom: 16rpx;

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

		.title {
			display: flex;
			align-items: center;
			padding-left: 32rpx;
			padding-top: 16rpx;

			.title-price {
				color: #ff4f01;
				font-size: 32rpx;

				text {
					font-size: 52rpx;
				}
			}

			.title-buy {
				margin-left: 8rpx;
				margin-top: 8rpx;
				padding: 8rpx;
				background-color: #ff4f01;
				border-radius: 4rpx;
				color: white;
				font-size: 24rpx;
			}
		}

		.name {
			padding-left: 32rpx;
			padding-top: 16rpx;
			font-size: 34rpx;
			color: #444;
			font-weight: 700;
		}

		.area {
			padding-left: 32rpx;
			padding-top: 16rpx;

			text {
				font-size: 30rpx;
				color: #999;
			}
		}
	}

	.divider {
		height: 16rpx;
		background-color: #f2f2f2;
	}

	.footer {
		background-color: white;

		.desc {
			padding-left: 32rpx;
			padding-right: 32rpx;
			padding-top: 16rpx;
			padding-bottom: 16rpx;
			color: #666;
			font-size: 30rpx;
		}
		image{
			width: 100%;
		}
	}
</style>