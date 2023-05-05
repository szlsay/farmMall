<template>
	<view class="container">
		<view class="top">
			<view class="menu-contant">
				<view class="item-menu" v-for="(item, index) in menus" :key="index">
					<i class="iconfont" :class="item.icon"></i>
					<text>{{item.title}}</text>
				</view>
			</view>
			<view class="search-contant">
				<button class="btn-search" @click="submit">
					<i class="iconfont fm-search"></i>
					<text>买好货 上农福</text>
				</button>
			</view>

		</view>
		<unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}" :collection="collectionList"
			field="image,name,description">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="data">
				<pp-waterfall-flow :value="changeShowData(data)" @clickItem="handleItemClick"
					@clickImage="handleItemClick"></pp-waterfall-flow>
			</view>
			<uni-load-more :status="loading?'loading':(hasMore ? 'more' : 'noMore')"></uni-load-more>
		</unicloud-db>
	</view>
</template>

<script>
	import {
		cloneObject
	} from "@/utils/util.js"
	const db = uniCloud.database()
	export default {
		data() {
			return {
				collectionList: "fm-goods",
				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				},
				menus: [{
						"title": "农货批发",
						"icon": "fm-jinpaigongyings"
					},
					{
						"title": "产地资源",
						"icon": "fm-suyuan"
					},
					{
						"title": "买家保障",
						"icon": "fm-maijiabz"
					}
				]
			}
		},
		onPullDownRefresh() {
			this.$refs.udb.loadData({
				clear: true
			}, () => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			this.$refs.udb.loadMore()
		},
		methods: {
			handleItemClick(item) {
				console.log("handleItemClick---", item._id)
				uni.navigateTo({
					url: './detail?id=' + item._id
				})
			},
			changeShowData(data) {
				const copyData = cloneObject(data)
				return copyData.map(item => {
					if (item.image && item.image.url) {
						item.image = item.image.url
					}
					item.desc = item.description
					item.title = item.name
					return item
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/css/iconfont.css";

	.top {
		background-color: #36A54B;

		.menu-contant {
			display: flex;
			justify-content: space-evenly;
			color: white;
			padding-top: 32rpx;
			padding-bottom: 20rpx;

			.item-menu {
				display: flex;
				align-items: center;

				text {
					color: white;
					margin-left: 8rpx;
				}
			}
		}

		.search-contant {
			padding-left: 32rpx;
			padding-right: 32rpx;
			padding-bottom: 20rpx;

			.btn-search {
				width: 100%;
				height: 80rpx;
				background-color: white;
				border-radius: 40rpx;
				color: #333333;
				text-align: center;
				line-height: 80rpx;
				
				text{
					margin-left: 8rpx;
				}
			}
		}
	}
</style>