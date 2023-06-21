<template>
	<view class="my-page">
		<view class="my-bg"></view>
		<view class="my-info">
			<image src="@/static/imgs/user-circle.png" class="nologin-icon"></image>
			<view class="login-btn">登录</view>
		</view>
		<view class="my-menu"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

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

	.my-bg {
		position: absolute;
		background-color: #00CC99;
		width: 100%;
		height: 300rpx;
		z-index: -1;
		margin-top: -40rpx;
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
		.login-btn{
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