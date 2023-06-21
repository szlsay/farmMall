<template>
	<view class="my-page">
		<view class="my-bg"></view>
		<view class="my-info">
			<image src="@/static/imgs/user-circle.png" class="nologin-icon"></image>
			<view class="login-btn">登录</view>
		</view>
		<view class="my-menu">
			<view class="menu-item" v-for="(item, index) in menus" :key="index">
				<text>{{item}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menus: ["收货地址", "我的收藏", "设置"]
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.my-page {
		position: relative;
	}

	.my-menu {
		background: #fff;
		box-shadow: 0px 3px 6px 0px rgba(173, 174, 179, 0.09), 0px -3px 6px 0px rgba(173, 174, 179, 0.09);
		border-radius: 20rpx;
		margin: 40rpx;
		padding-left: 32rpx;
		padding-right: 32rpx;

		.menu-item {
			padding-top: 32rpx;
			padding-bottom: 32rpx;
			border-bottom: 1rpx solid #eee;
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
		margin-top: 40rpx;
		margin-left: 40rpx;
		margin-right: 40rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 32rpx;
		margin-bottom: 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.nologin-icon {
			width: 100rpx;
			height: 100rpx;
		}

		.login-btn {
			width: 160rpx;
			color: #999;
			font-size: 28rpx;
			text-align: center;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 30rpx;
			border: 1rpx solid #999;
		}
	}
</style>