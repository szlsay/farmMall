<template>
	<view class="login-bg">
		<image src="https://mp-e548ea67-cedb-4a2f-b6fe-005d83c724b8.cdn.bspapp.com/images/login-bg.webp" mode="heightFix"
			class="move-animation"></image>
		<view class="mask">

		</view>
	</view>
</template>

<script>
	export default {
		name: "st-loginbg",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.login-bg {
		// position: fixed;
		// inset: 0;
		// z-index: -100;

		.mask {
			position: fixed;
			inset: 0;
			background-color: #00000090;
			z-index: -99;
		}

		image {
			height: 100%;
			position: absolute;
			top: 0;
			right: 0;
			z-index: -100;
		}

		.move-animation {
			animation-name: move;
			animation-delay: 100ms;
			animation-duration: 30s;
			animation-timing-function: linear;
			animation-iteration-count: infinite;
			animation-direction: alternate;
		}

		@keyframes move {
			from {
				transform: translateX(0%);
			}

			to {
				transform: translateX(50%);
			}
		}
	}
</style>