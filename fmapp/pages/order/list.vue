<template>
	<view class="container">
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text"
			activeColor="#00CC99" style="background-color: #FFF;"></uni-segmented-control>
		<unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}" :collection="collectionList"
			field="oid,create_time,update_time,cancel_time,price_amount_total,state,order_goodslist,order_delivery">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="data">
				<view class="order-cell" v-for="(item, index) in data" :key="index">
					<view class="cell-top">
						<text>订单号：{{item.oid}}</text>
						<text>{{getStateText(item.state)}}</text>
					</view>
					<view class="cell-goods" v-for="goods in item.order_goodslist" :key="goods.goods_id">
						{{goods}}
					</view>
					<view class="cell-mid">
						{{item.order_delivery}}
					</view>
					<view class="cell-down">

					</view>
				</view>
			</view>
			<uni-load-more :status="loading?'loading':(hasMore ? 'more' : 'noMore')"></uni-load-more>
		</unicloud-db>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
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
	.order-cell {
		margin: 20rpx;
		background-color: white;
		border-radius: 16rpx;

		.cell-top {
			padding-top: 16rpx;
			padding-bottom: 16rpx;
			margin-left: 16rpx;
			margin-right: 16rpx;
			display: flex;
			justify-content: space-between;
			text:nth-child(2){
				color: #ff442f;
			}
			border-bottom: 1rpx solid #EEE;
		}
	}
</style>