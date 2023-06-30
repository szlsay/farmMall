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
			<image v-for="(item, index) in data.image_content" :key="index" :src="item.url" mode="widthFix"></image>
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

	.product-detail {
		text {}
		image{
			width: 100%;
			vertical-align: middle;
		}
	}
</style>