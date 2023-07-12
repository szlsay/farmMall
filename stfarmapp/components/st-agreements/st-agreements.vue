<template>
	<view class="st-agreements">
		<uni-icons :type="isAgree ? 'checkbox' : 'circle'" size="24" :color="isAgree ? '#00cc99' : '#ffffff'" style="margin-right: 8rpx;" @click="onClickSelect"></uni-icons>
		<text class="text">登录表示同意</text>
		<text class="agreement text" @click="navigateTo(agreement)">《隐私政策条款》</text>
		<text class="text">和</text>
		<text class="agreement text" @click="navigateTo(agreement)">《用户服务协议》</text>
	</view>
</template>

<script>
	export default {
		name: "st-agreements",
		data() {
			return {
				isAgree: false,
			};
		},
		methods: {
			onClickSelect() {
				this.isAgree = !this.isAgree
			},
			navigateTo({
				url,
				title
			}) {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/common/webview/webview?url=' + url + '&title=' + title,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
		}
	}
</script>

<style lang="scss">
	.st-agreements {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.text {
		color: white;
		font-size: 28rpx;
	}
	
	.agreement{
		color: #00CC99;
		font-weight: bold;
	}
</style>