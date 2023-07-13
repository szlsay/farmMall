<template>
	<view class="page-home">
		<view class="login-container">
			<text>请先进行登录</text>
		</view>
		<view class="work-container">
			<text class="title">信息操作</text>
			<view class="st-box" v-for="i in 4">
				<image src="../../static/home/home-map.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.page-home {
		background-color: #00CC99;
	}

	.title {
		color: #333;
		font-size: 36rpx;
		font-weight: bold;
		padding-bottom: 40rpx;
	}

	.st-box {
		border-radius: 8rpx;
		box-shadow: 2rpx 2rpx 10rpx 0 rgba(0, 0, 0, 0.1);
		margin-bottom: 40rpx;
		height: 150rpx;
		position: relative;
		overflow: hidden;

		image {
			position: absolute;
			bottom: -10rpx;
			right: -10rpx;
			opacity: 0.5;
			width: 128rpx;
			height: 128rpx;
		}
	}

	.login-container {
		padding: 40rpx 40rpx 0rpx;
		color: white;
	}

	.work-container {
		margin-top: 40rpx;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
		background-color: white;
		padding: 40rpx;
	}
</style>