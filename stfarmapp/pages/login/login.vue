<template>
	<view>
		<view class="bg">
			<image src="@/static/login-bg.webp" mode="heightFix" class="move-animation"></image>
		</view>
		<view class="login-container">
		</view>
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
	.bg {
		height: 100vh;
		position: relative;

		image {
			height: 100%;
			position: absolute;
			top: 0;
			right: 0;
		}

		.move-animation {
			animation-name: move;
			animation-duration: 30s;
			animation-timing-function: linear;
			animation-iteration-count: infinite;
		}

		@keyframes move {
			from {
				transform: translateX(0);
			}

			to {
				transform: translateX(50%);
			}
		}
	}
</style>