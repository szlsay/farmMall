<template>
	<view class="container">
		<view class="top-home">
			<view class="home-header">
				<view class="header-item" v-for="(item, index) in $store.state.sys.home_headers" :key="index">
					<image v-if="item.icon && item.icon.fileType == 'image'" :src="item.icon.url"></image>
					<text>{{item.text}}</text>
				</view>
			</view>
			<view class="home-banner" v-if="bannerList && bannerList.length > 0">
				<swiper circular :indicator-dots="bannerList.length > 1" indicator-active-color="#00CC99">
					<swiper-item v-for="(item, index) in bannerList" :key="index">
						<image v-if="item.image && item.image.fileType == 'image'" :src="item.image.url" class="fm_image"
							mode="aspectFill"></image>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="down-home">
			<view class="home-sort">
				<view class="sort-item" v-for="(item, index) in $store.state.sys.combo_sorts" :key="index"
					@click="onClickSort(index)" :class="{'select-item': index === currentSort}">
					<text>{{item.text}}</text>
				</view>
			</view>
			{{comboMap[currentSortValue]}}
		</view>
	</view>
</template>

<script>
	import {
		cloneObject,
		arryGroupMatchWithAll
	} from "@/utils"
	const db = uniCloud.database()
	export default {
		data() {
			return {
				bannerList: [],
				comboList: [],
				comboMap: {},
				currentSort: 0,
				currentSortValue: 'all',
			}
		},
		onLoad() {
			this.getBannerData()
			this.getComboData()
		},
		methods: {
			async getComboData() {
				const fmcombo = uniCloud.importObject("fm-combo")
				const result = await fmcombo.getList()
				this.comboList = result.data
				this.comboMap = arryGroupMatchWithAll(this.comboList, 'sort')
			},
			onClickSort(index) {
				this.currentSort = index
				this.currentSortValue = this.$store.state.sys.combo_sorts[index].value
			},
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
		.home-sort {
			display: flex;
			margin-top: 20rpx;
			margin-left: 40rpx;
			padding-bottom: 40rpx;
			overflow-x: scroll;

			.sort-item {
				margin-right: 20rpx;
				height: 64rpx;
				padding-left: 30rpx;
				padding-right: 30rpx;
				border-radius: 32rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				background: #F1F3F5;
				color: #333333;

				text {
					font-size: 28rpx;
					font-weight: 500;
					white-space: nowrap;
				}
			}

			.select-item {
				background: #00CC99;
				box-shadow: 0px 4px 10px 0px #00CC9966;
				color: #FFFFFF;
			}
		}

		::-webkit-scrollbar {
			display: none;
			width: 0;
			height: 0;
			-webkit-appearance: none;
			background: transparent;
			color: transparent;
		}
	}

	.top-home {
		.home-banner {
			padding: 16rpx 40rpx 16rpx;
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

		.home-header {
			display: flex;
			justify-content: space-evenly;
			color: white;
			padding-top: 40rpx;
			padding-bottom: 30rpx;

			.header-item {
				display: flex;
				align-items: center;

				image {
					width: 40rpx;
					height: 40rpx;
					margin-right: 2rpx;
				}

				text {
					font-size: 28rpx;
					color: #00CC99;
					margin-left: 8rpx;
				}
			}
		}
	}
</style>