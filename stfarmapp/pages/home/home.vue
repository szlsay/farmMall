<template>
	<view class="page-home">
		<view class="login-container">
			<text>请先进行登录</text>
		</view>
		<view class="work-container">
			<text class="title">信息操作</text>
			<view class="st-box" v-for="(item, index) in menus" :key="index">
				<view class="left-item">
					<view class="left-up">
						<image :src="item.img" mode="" class="icon"></image>
						<text :style="{color: item.color}" class="text">{{item.text}}</text>
					</view>
					<view class="">
						<text :style="{color: item.color}" class="num">{{item.num}}</text>
						<text :style="{color: item.color}" class="type">个</text>
					</view>
				</view>
				<view class="right-item">
					<image :src="item.img" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menus: [{
					"img": "/static/home/home-map.png",
					"text": "圈地",
					"color": "#2294da",
					"num": "5",
					"to": ""
				}]
			}
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
		margin-top: 40rpx;
		margin-bottom: 40rpx;
		height: 200rpx;

		display: flex;
		justify-content: space-between;
	}

	.left-item {
		height: 100%;
		padding-left: 40rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;

		.left-up {
			display: flex;
			justify-content: center;

			.icon {
				width: 48rpx;
				height: 48rpx;
			}

			.text {
				font-size: 36rpx;
				font-weight: bold;
				margin-left: 10rpx;
			}

		}

		.num {
			font-size: 64rpx;
			font-weight: bold;
		}

		.type {
			margin-left: 6rpx;
			font-size: 30rpx;
		}
	}

	.right-item {
		height: 100%;
		// position: relative;
		// overflow: hidden;

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