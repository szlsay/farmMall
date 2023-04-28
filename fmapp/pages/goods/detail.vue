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
		<view class="back" @click="onClickBack">
			<uni-icons type="back" size="30" color="white"></uni-icons>
		</view>
		<view class="bottom-buy">
			<view class="collect">
				<uni-icons type="star" size="24"></uni-icons>
				<text>收藏</text>
			</view>
			<view class="btns">
				<view class="cart" @click="handleCart">加入购物车</view>
				<view class="buy" @click="handleBuy">立即购买</view>
			</view>
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
	const cartCollectionName = 'fm-cart';
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
			onClickBack() {
				uni.navigateBack()
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
			},
			async handleCart() {
				uni.showLoading({
					mask: true
				})
				let {
					result
				} = await db.collection(cartCollectionName).where({
					goods_id: this._id,
				}).get()
				if (result.data.length === 0) {
					let value = {
						"goods_id": this._id,
						"qty": 1,
						"update_time": new Date().valueOf()
					}
					db.collection(cartCollectionName).add(value).then((res) => {
						uni.showToast({
							icon: 'none',
							title: '添加成功'
						})
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {
						uni.hideLoading()
					})
				} else {
					let cartData = result.data[0]
					cartData.qty += 1
					db.collection(cartCollectionName).doc(cartData._id).update({
						qty: cartData.qty,
						update_time: new Date().valueOf()
					}).then((res) => {
						uni.showToast({
							icon: 'none',
							title: '添加成功'
						})
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {
						uni.hideLoading()
					})
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	.container {
		padding-bottom: 110rpx;
	}

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

	.back {
		position: fixed;
		top: 32rpx;
		left: 32rpx;
		width: 88rpx;
		height: 88rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #00000033;
		border-radius: 44rpx;
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

		image {
			width: 100%;
		}
	}

	.bottom-buy {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		.collect {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;

			text {
				text-align: center;
				font-size: 24rpx;
			}
		}

		.btns {
			display: flex;
			margin-right: 32rpx;

			.cart {
				width: 240rpx;
				height: 80rpx;
				border-radius: 40rpx 0 0 40rpx;
				background-image: linear-gradient(90deg, #ffb401, #f80);

				font-size: 30rpx;
				color: #fff;
				line-height: 80rpx;
				text-align: center;
				font-weight: 500;
			}

			.buy {
				width: 240rpx;
				height: 80rpx;
				background-color: #ff442e;
				border-radius: 0 40rpx 40rpx 0;

				font-size: 30rpx;
				color: #fff;
				line-height: 80rpx;
				text-align: center;
				font-weight: 500;
			}
		}
	}
</style>