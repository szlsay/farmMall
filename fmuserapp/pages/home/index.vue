<template>
	<view class="container">
		<view class="top-home">
			<view class="menu-contant">
				<view class="item-menu" v-for="(item, index) in $store.state.sys.home_headers" :key="index">
					<image v-if="item.icon && item.icon.fileType == 'image'" :src="item.icon.url"></image>
					<text>{{item.text}}</text>
				</view>
			</view>
			<view class="banner" v-if="bannerList && bannerList.length > 0">
				<swiper circular indicator-dots>
					<swiper-item v-for="(item, index) in bannerList" :key="index">
						<image v-if="item.image && item.image.fileType == 'image'" :src="item.image.url" class="fm_image"
							mode="aspectFill"></image>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="down-home">
		</view>
	</view>
</template>

<script>
	import {
		cloneObject
	} from "@/utils"
	const db = uniCloud.database()
	export default {
		data() {
			return {
				bannerList: []
			}
		},
		onLoad() {
			// this.getBannerData()
		},
		methods: {
			async getBannerData() {
				const fmbanner = uniCloud.importObject("fm-banner")
				const result = await fmbanner.getList()
				this.bannerList = result.data
				console.log(result)
			},
			handleItemClick(item) {
				uni.navigateTo({
					url: './detail?id=' + item._id
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "@/static/css/iconfont.css";

	.down-home {
		height: 100%;
		background: repeating-linear-gradient(to bottom, #00cc99, #fff);
	}

	.top-home {
		background-color: #00cc99;

		.banner {
			margin-top: -2rpx;
			padding: 16rpx 32rpx 16rpx;
			height: 300rpx;

			uni-swiper {
				height: 100%;

				.fm_image {
					width: 100%;
					height: 100%;
					border-radius: 16rpx;
				}
			}
		}

		.menu-contant {
			display: flex;
			justify-content: space-evenly;
			color: white;
			padding-top: 20rpx;
			padding-bottom: 20rpx;

			.item-menu {
				display: flex;
				align-items: center;

				image {
					width: 40rpx;
					height: 40rpx;
					margin-right: 2rpx;
				}

				text {
					color: white;
					margin-left: 8rpx;
				}
			}
		}
	}
</style>