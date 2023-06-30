<template>
	<view>
		<view class="box product-info" v-if="data">
			<image :src="data.image.url" mode="aspectFill" @click="onPreview(data.image.url)"></image>
			<view class="info-box">
				<text>{{data.name}}</text>
			</view>
		</view>
		<view class="box product-detail" v-if="data">
			<text class="product-title">详情介绍</text>
			<view>{{data.description}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				query: null,
				data: null
			}
		},
		onLoad(query) {
			this.query = query
			this.getData()
		},
		methods: {
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
			async getData() {
				const db = uniCloud.database();
				const {
					result
				} = await db.collection("fm-product").doc(this.query.id).get()
				console.log(result)
				this.data = result.data[0]
				uni.setNavigationBarTitle({
					title: this.data.name
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/common.css";

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

	.product-sku {
		.sku-list {
			display: flex;
			justify-content: space-between;
			margin-top: 32rpx;

			.left-list {
				display: flex;

				image {
					width: 200rpx;
					height: 150rpx;
					border-radius: 10rpx;
				}

				.sku-info {
					padding-left: 20rpx;

					display: flex;
					flex-direction: column;
					justify-content: space-around;
				}
			}

			.right-list {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}

	.product-comment {
		padding: 40rpx;
	}

	.product-detail {
		padding: 40rpx;

		text {}
	}
</style>