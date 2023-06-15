<template>
	<view class="container">
		<view class="top">
			<view class="menu-contant">
				<view class="item-menu" v-for="(item, index) in $store.state.sys.home_headers" :key="index">
					<image v-if="item.icon && item.icon.fileType == 'image'" :src="item.icon.url"></image>
					<text>{{item.text}}</text>
				</view>
			</view>
		</view>
		<unicloud-db ref="udbBanner" v-slot:default="{data, pagination, loading, hasMore, error}" collection="fm-banner"
			field="image,open_url,title,sort,status,description" where="status == true">
			<view class="banner">
				<swiper circular indicator-dots>
					<swiper-item v-for="(item, index) in data" :key="index">
						<image v-if="item.image && item.image.fileType == 'image'" :src="item.image.url"
							class="fm_image" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
			</view>
		</unicloud-db>
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

			}
		},
		methods: {
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

	.banner {
		margin-top: -2rpx;
		padding: 16rpx 32rpx 16rpx;
		height: 300rpx;
		background-color: #00cc99;

		uni-swiper {
			height: 100%;

			.fm_image {
				width: 100%;
				height: 100%;
				border-radius: 16rpx;
			}
		}
	}

	.top {
		background-color: #00cc99;

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