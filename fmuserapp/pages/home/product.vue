<template>
	<view class="page-product ">
		<view class="box product-info" v-if="data">
			<image :src="data.image.url" mode="aspectFill" @click="onPreview(data.image.url)"></image>
			<view class="info-box">
				<text>{{data.name}}</text>
			</view>
		</view>
		<view class="box product-attri" v-if="data">
			<text class="product-title">产品属性</text>
			<view class="attri-list" v-for="(item, index) in product_attri" :key="index">
				<view class="attri-item">
					<text class="item-text">
						{{item.text}}
					</text>
					<text class="item-value">
						{{item.value}}
					</text>
				</view>
			</view>
			<view class="attri-arrow" v-show="isShowAttriArrow" @click="onClickAttriArrow">
				<uni-icons type="bottom" size="24" v-if="isAttriDown"></uni-icons>
				<uni-icons type="top" size="24" v-else></uni-icons>
			</view>
		</view>
		<view class="box product-detail" v-if="data">
			<text class="product-title">详情介绍</text>
			<view>{{data.description}}</view>
			<image v-for="(item, index) in data.image_content" :key="index" :src="item.url" mode="widthFix" @click="onPreviewImageList(index)"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				query: null,
				data: null,
				isShowAttriArrow: false,
				isAttriDown: false,
				numAttriMin: 3
			}
		},
		onLoad(query) {
			this.query = query
			this.getData()
		},
		computed: {
			product_attri() {
				if (this.isShowAttriArrow) {
					if (this.isAttriDown) {
						return this.data.product_attri.slice(0, 3)
					} else {
						return this.data.product_attri
					}
				} else {
					return this.data.product_attri
				}
			}
		},
		methods: {
			onClickAttriArrow() {
				this.isAttriDown = !this.isAttriDown
			},
			onClickSku(item) {
				console.log(item)
			},
			getMeasureUnitText(value) {
				const result = this.$store.state.sys.measure_units.filter(item => item.value === value)
				if (result && result.length > 0) {
					return result[0].text
				} else {
					return ''
				}
			},
			onPreview(url) {
				uni.previewImage({
					urls: [url],
					current: 0
				})
			},
			onPreviewImageList(index) {
				const urls = this.data.image_content.map(item => {
					return item.url
				})
				uni.previewImage({
					urls,
					current: index
				})
			},
			async getData() {
				this.isShowAttriArrow = false
				this.isAttriDown = false
				const db = uniCloud.database();
				const {
					result
				} = await db.collection("fm-product").doc(this.query.id).get()
				console.log(result)
				this.data = result.data[0]
				if (this.data.product_attri && this.data.product_attri.length > this.numAttriMin) {
					this.isShowAttriArrow = true
					this.isAttriDown = true
				}
				uni.setNavigationBarTitle({
					title: this.data.name
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/common.css";

	.page-product {
		padding-bottom: 1rpx;
	}

	.product-attri {
		.attri-arrow {
			padding-top: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.attri-list {
			padding-top: 20rpx;
			display: flex;

			.attri-item {
				display: flex;

				.item-text {
					min-width: 240rpx;
				}

				.item-value {
					font-weight: bold;
				}
			}
		}
	}

	.product-info {
		image {
			width: 100%;
			height: 400rpx;
			border-radius: 20rpx;
		}

		.info-box {
			background-color: #fff;
			padding-top: 16rpx;
			display: flex;
			border-radius: 20rpx;
			flex-direction: column;

			text:nth-last-child(1) {
				color: red;
			}
		}
	}

	.product-title {
		font-weight: bold;
	}

	.product-detail {
		text {}

		image {
			margin-top: 20rpx;
			width: 100%;
			vertical-align: middle;
			border-radius: 20rpx;
		}
	}
</style>