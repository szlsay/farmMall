<template>
	<view class="my-page">
		<view class="my-bg"></view>
		<view class="my-info">未登录</view>
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
		box-shadow: 0px 3px 6px 0px rgba(173, 174, 179, 0.09), 0px -3px 6px 0px rgba(173, 174, 179, 0.09);
		border-radius: 20rpx;
		padding: 32rpx;
		margin-bottom: 40rpx;
		display: flex;
	}
</style>