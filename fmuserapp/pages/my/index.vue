<template>
	<view>
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
	.my-bg {}

	.my-info {
		margin: 40rpx;
		background: #fff;
		box-shadow: 0px 3px 6px 0px rgba(173, 174, 179, 0.09), 0px -3px 6px 0px rgba(173, 174, 179, 0.09);
		border-radius: 20rpx;
		padding: 32rpx;
		margin-bottom: 40rpx;
		display: flex;
	}
</style>