<template>
	<view class="container">
		<unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}" :collection="collectionList"
			:where="where">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="data">
				<uni-list>
					<uni-list-item v-for="(item, index) in data" :key="index" showArrow :clickable="true"
						@click="handleItemClick(item._id)">
						<template v-slot:body>
							<view class="item">
								<view class="user">
									<text>{{item.receive_name}}</text>
									<text>{{item.receive_mobile}}</text>
								</view>
								<view class="address">
									<text class="default" v-if="item.is_default">默认</text>
									<text>收货地址：{{item.full_address}}</text>
								</view>
							</view>
						</template>
					</uni-list-item>
				</uni-list>
			</view>
			<uni-load-more :status="loading?'loading':(hasMore ? 'more' : 'noMore')"></uni-load-more>
		</unicloud-db>
		<view class="footer">
			<view class="btn-add" @click="onClickAdd">
				新增收货地址
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				collectionList: [db.collection('fm-my-address').field(
						'receive_name,receive_mobile,province_code,city_code,area_code,province_name,city_name,area_name,address,full_address,is_default,uid'
					).getTemp(), db.collection('opendb-city-china').field('code, name as text, eq(type, 2) as isleaf')
					.getTemp()
				],
				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				},
				where: ''
			}
		},
		onLoad() {
			this.where = "uid=='" + uniCloud.getCurrentUserInfo().uid + "'"
			this.$nextTick(() => {
				this.$refs.udb.loadData()
			})
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
					url: './edit?id=' + id,
					events: {
						// 监听新增数据成功后, 刷新当前页面数据
						refreshData: () => {
							this.$refs.udb.loadData({
								clear: true
							})
						}
					}
				})
			},
			onClickAdd() {
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
	.item {
		.user {
			text {
				font-size: 32rpx;
				font-weight: bold;
			}

			text:nth-child(2) {
				margin-left: 20rpx;
			}
		}

		.address {
			margin-top: 10rpx;

			.default {
				background-color: #00CC99;
				padding: 2rpx 8rpx 2rpx;
				color: white;
				border-radius: 8rpx;
				font-size: 24rpx;
				margin-right: 16rpx;
			}
		}
	}

	.footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 10rpx 32rpx 10rpx;
		background-color: white;

		.btn-add {
			width: 100%;
			height: 80rpx;
			background-color: #00CC99;
			border-radius: 40rpx;
			color: white;
			text-align: center;
			line-height: 80rpx;
		}
	}

	.container {
		padding-bottom: 100rpx;
	}

	page {
		background-color: white;
	}
</style>