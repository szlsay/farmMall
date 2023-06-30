<template>
	<view>
		<view class="box combo-info" v-if="data">
			<image :src="data.image.url" mode="aspectFill" @click="onPreview(data.image.url)"></image>
			<view class="info-box">
				<text>{{data.name}}</text>
				<text>￥{{data.sell_price}}</text>
			</view>
		</view>
		<view class="box combo-sku" v-if="data">
			<text class="combo-title">产品内容</text>
			<view class="sku-list" v-for="(item, index) in data.sku" :key="index" @click="onClickSku(item)">
				<view class="left-list">
					<image :src="item.image.url" mode="aspectFill"></image>
					<view class="sku-info">
						<text class="combo-title"> {{item.product_name}}</text>
						<text> {{item.qty}}{{getMeasureUnitText(item.unit)}}</text>
					</view>
				</view>
				<view class="right-list">
					<uni-icons type="right" size="24"></uni-icons>
				</view>
			</view>
		</view>
		<view class="box combo-comment" v-if="data">
			<text class="combo-title">用户评价</text>
		</view>
		<view class="box combo-detail" v-if="data">
			<text class="combo-title">详情介绍</text>
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
				uni.navigateTo({
					url: './product?id=' + item.product_id
				})
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
				const fmcombo = uniCloud.importObject('fm-combo')
				const result = await fmcombo.get(this.query.id)
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

	.combo-info {
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

	.combo-title {
		font-weight: bold;
	}

	.combo-sku {
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

	.combo-comment {
		padding: 40rpx;
	}

	.combo-detail {
		padding: 40rpx;

		text {}
	}
</style>