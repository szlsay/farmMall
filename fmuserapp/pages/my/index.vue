<template>
	<view class="my-page">
		<view class="my-bg"></view>
		<view class="box my-info">
			<view class="info-user">
				<image src="@/static/imgs/user-circle.png" class="nologin-icon"></image>
				<text style="margin-left: 16rpx;"
					v-if="hasLogin">{{userInfo.nickname||userInfo.username||userInfo.mobile}}</text>
			</view>
			<view v-if="!hasLogin">
				<button class="login-btn" @click="onClickLogin()">登录</button>
			</view>
		</view>
		<view class="box my-order">
			<view class="order-up">
				<text class="title-order">我的订单</text>
				<view class="all-order">
					<text>全部订单</text>
					<uni-icons type="right" size="16" color="#333333"></uni-icons>
				</view>
			</view>
			<view class="order-down">
				<view v-for="(item,index) in orderList" @click.native="onClickOrder(item.value)" :key="index"
					class="item-order">
					<uni-icons color="#00CC99" :type="item.icon" size="26"></uni-icons>
					<text>{{item.text}}</text>
				</view>
			</view>

		</view>
		<view class="box my-menu">
			<view class="menu-item" v-for="(item, index) in menuList" :key="index" @click="onClickMenu(item)">
				<text>{{item.title}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		store
	} from '@/uni_modules/uni-id-pages/common/store.js'
	export default {
		data() {
			return {
				menuList: [{
						"title": "收货地址",
						"event": 'onClickAddress',
					},
					{
						"title": "我的收藏",
						"event": 'onClickAddress',
					},
					{
						"title": "设置",
						"to": '/pages/ucenter/settings/settings',
					}
				],
				orderList: [{
						"text": "待支付",
						"icon": "email-filled",
						"value": 1
					},
					{
						"text": "待发货",
						"icon": "navigate-filled",
						"value": 2
					},
					{
						"text": "待收货",
						"icon": "cart-filled",
						"value": 3
					}
				]
			}
		},
		mounted() {},
		computed: {
			userInfo() {
				return store.userInfo
			},
			hasLogin() {
				return store.hasLogin
			}
		},
		methods: {
			onClickMenu(item) {
				console.log(item)
				if (item.event) {
					this[item.event]();
				}

				if (item.to) {
					uni.navigateTo({
						url: item.to
					})
				}
			},
			onClickAddress() {
				uni.navigateTo({
					url: '/pages/my/address/list'
				})
				console.log('onClickAddress');
			},
			onClickOrder(value) {
				console.log(value);
			},
			onClickLogin() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/common.css";

	.my-page {
		position: relative;
	}

	.my-order {
		display: flex;
		flex-direction: column;

		.order-down {
			display: flex;
			justify-content: space-between;
			padding: 32rpx 8rpx 0;

			.item-order {
				display: flex;
				flex-direction: column;

				text {
					font-size: 28rpx;
				}
			}
		}

		.order-up {
			display: flex;
			justify-content: space-between;

			.title-order {
				display: flex;
				justify-content: space-between;
			}

			.all-order {
				display: flex;
				align-items: center;
				font-size: 28rpx;
			}
		}
	}

	.my-menu {
		.menu-item {
			padding-top: 32rpx;
			padding-bottom: 32rpx;
			border-bottom: 1rpx solid #eee;
		}
		.menu-item:first-child {
			padding-top: 0;
		}
		
		.menu-item:last-child {
			padding-bottom: 0;
		}

		.menu-item:nth-last-child(1) {
			border-bottom: none;
		}
	}

	.my-bg {
		position: absolute;
		width: 100%;
		height: 400rpx;
		margin-top: -40rpx;
	}

	.my-bg::after {
		position: absolute;
		width: 140%;
		height: 400rpx;
		left: -20%;
		top: 0;
		z-index: -1;
		content: '';
		border-radius: 0 0 50% 50%;
		background-color: #00CC99;
	}

	.my-info {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.info-user {
			display: flex;
			align-items: center;
		}

		.nologin-icon {
			width: 100rpx;
			height: 100rpx;
		}

		.login-btn {
			width: 160rpx;
			color: #999;
			font-size: 28rpx;
			line-height: 60rpx;
			border-radius: 30rpx;
			border: 1rpx solid #999;
		}
	}
</style>