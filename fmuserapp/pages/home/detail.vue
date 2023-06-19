<template>
	<view>
		<view class="combo-info" v-if="data">
			<image :src="data.image.url" mode="aspectFill" @click="onPreview(data.image.url)"></image>
			<view class="info-box">
				<text>{{data.name}}</text>
				<text>￥{{data.sell_price}}</text>
			</view>
		</view>
		<view class="divider"></view>
		<view class="combo-sku" v-if="data">
			<text>产品内容</text>
			<view class="sku-list" v-for="(item, index) in data.sku" :key="index">
				{{item}}
			</view>
		</view>
		<view class="divider"></view>
		<view class="combo-comment" v-if="data">
			<text>用户评价</text>
		</view>
		<view class="divider"></view>
		<view class="combo-detail" v-if="data">
			<text>{{data.description}}</text>
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
			onPreview(url) {
				uni.previewImage({
					urls: [url],
					current: 0
				})
			},
			async getData() {
				const fmcombo = uniCloud.importObject('fm-combo')
				const result = await fmcombo.get(this.query.id)
				console.log(result)
				if (result.data && result.data.length > 0) {
					this.data = result.data[0]
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.divider {
		height: 16rpx;
		background-color: #f2f2f2;
	}

	.combo-info {
		image {
			width: 100%;
			height: 400rpx;
		}

		.info-box {
			background-color: #fff;
			padding-left: 40rpx;
			padding-top: 16rpx;
			padding-bottom: 16rpx;
			display: flex;
			flex-direction: column;

			text:nth-last-child(1) {
				color: red;
			}
		}
	}

	.combo-sku {
		padding: 40rpx;
	}

	.combo-comment {
		padding: 40rpx;
	}

	.combo-detail {
		padding: 40rpx;

		text {}
	}
</style>