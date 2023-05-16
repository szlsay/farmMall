<template>
	<view class="container">
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text"
			activeColor="#00CC99" style="background-color: #FFF;"></uni-segmented-control>
		<unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}" :collection="collectionList"
			field="oid,create_time,update_time,cancel_time,price_amount_total,state,order_goodslist,order_delivery"
			:where="where">
			<view class="order-cell" v-for="(item, index) in data" :key="index">
				<view class="cell-top">
					<text>订单号：{{item.oid}}</text>
					<text>{{getStateText(item.state)}}</text>
				</view>
				<view class="cell-goods" v-for="goods in item.order_goodslist" :key="goods.goods_id">
					<view class="goods-left">
						<image :src="goods.image_url" mode="aspectFill"></image>
					</view>
					<view class="goods-right">
						<text class="title">{{goods.name}}</text>
						<text>{{goods.producer}}</text>
					</view>
				</view>
				<view class="cell-mid">
					<text>收货人：{{item.order_delivery.receive_name}}</text>
					<text>收货地址：{{item.order_delivery.full_address}}</text>
					<text>合计：<text class="price">￥{{getPriceText(item.price_amount_total)}}</text> </text>
				</view>
				<view class="cell-down">
					<view class="btn-pay" v-if="item.state === 1">
						去支付
					</view>
				</view>
			</view>
			<view v-if="!(data && data.length > 0)" class="nodata">
				<image src="@/static/default-nodata.png"></image>
				<text>亲，订单空空如也~</text>
			</view>
			<uni-load-more :status="loading?'loading':(hasMore ? 'more' : 'noMore')"
				v-if="(data && data.length > 0)"></uni-load-more>
		</unicloud-db>
	</view>
</template>

<script>
	import {
		formatPrice
	} from '@/utils/util.js';
	const db = uniCloud.database()

	export default {
		data() {
			return {
				where: {},
				current: 0,
				items: ['全部', '待支付', '待发货', '待收货'],
				collectionList: "fm-order",
				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				}
			}
		},
		onLoad() {
			if (this.$route.query && this.$route.query.state != null) {
				const state = this.$route.query.state
				this.current = parseInt(state)
			} else {
				this.current = 0
			}
			if (this.current === 0) {
				this.where = {
					uid: uniCloud.getCurrentUserInfo().uid
				}
			} else {
				this.where = {
					state: this.current,
					uid: uniCloud.getCurrentUserInfo().uid
				}
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
			handleItemClick(id) {
			  uni.navigateTo({
			    url: './detail?id=' + id
			  })
			},
			getPriceText(price) {
				return formatPrice(price)
			},
			getStateText(state) {
				const state_valuetotext = {
					"1": "待支付",
					"2": "待发货",
					"3": "待收货"
				}
				return state_valuetotext[state]
			},
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
					if (this.current === 0) {
						this.where = {
							uid: uniCloud.getCurrentUserInfo().uid
						}
					} else {
						this.where = {
							state: this.current,
							uid: uniCloud.getCurrentUserInfo().uid
						}
					}
				}
			},
			handleItemClick(id) {
				uni.navigateTo({
					url: './detail?id=' + id
				})
			},
			fabClick() {
				// 打开新增页面
				uni.navigateTo({
					url: './add',
					events: {
						// 监听新增数据成功后, 刷新当前页面数据
						refreshData: () => {
							this.$refs.udb.loadData({
								clear: true
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nodata {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 400rpx;

		image {
			width: 160rpx;
			height: 160rpx;
		}

		text {
			margin-top: 20rpx;
		}
	}

	.order-cell {
		margin: 20rpx;
		background-color: white;
		border-radius: 16rpx;

		.cell-down {
			padding-top: 16rpx;
			padding-bottom: 16rpx;
			margin-left: 16rpx;
			margin-right: 16rpx;
			display: flex;
			justify-content: end;

			.btn-pay {
				color: #00CC99;
				text-align: center;
				border: 2rpx solid #00CC99;
				background-color: white;
				height: 60rpx;
				width: 160rpx;
				border-radius: 30rpx;
				line-height: 60rpx;
			}
		}

		.cell-mid {
			padding-top: 16rpx;
			padding-bottom: 16rpx;
			margin-left: 16rpx;
			margin-right: 16rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			border-bottom: 1rpx solid #EEE;

			text {
				padding-bottom: 10rpx;
			}

			.price {
				color: #ff442f;
			}
		}

		.cell-top {
			padding-top: 16rpx;
			padding-bottom: 16rpx;
			margin-left: 16rpx;
			margin-right: 16rpx;
			display: flex;
			justify-content: space-between;
			border-bottom: 1rpx solid #EEE;

			text:nth-child(2) {
				color: #ff442f;
			}
		}

		.cell-goods {
			padding-top: 16rpx;
			padding-bottom: 16rpx;
			margin-left: 16rpx;
			margin-right: 16rpx;
			display: flex;
			border-bottom: 1rpx solid #EEE;

			.goods-left {
				image {
					width: 200rpx;
					height: 180rpx;
					border-radius: 16rpx;
				}
			}

			.goods-right {
				flex: 1;
				margin-left: 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;

				.title {
					font-weight: 600;
					overflow: hidden;
					-webkit-line-clamp: 2;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
				}

			}
		}
	}
</style>