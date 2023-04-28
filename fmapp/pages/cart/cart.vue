<template>
	<view class="container">
		<uni-list v-for="item in cart.cartList">
			<uni-list-item>
				<template v-slot:body>
					<view class="body-content">
						<view class="item-left">
							<radio :checked="item.select" @click="onSelectItem(item)" />
							<image v-if="item.image && item.image.fileType == 'image'" :src="item.image.url" class="item-img"
								mode="aspectFill"></image>
						</view>
						<view class="item-right">
							<text class="title">{{item.name}}</text>
							<text>{{item.producer}}</text>
							<view class="price">
								<text class="num">价格：{{item.price_sell}}</text>
								<uni-number-box :min="0" :max="100" v-model="item.qty" />
							</view>
						</view>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		<view class="footer">
			<view class="select">
				<radio :checked="selectAll" @click="onSelectAll"></radio>
				<text>全选</text>
			</view>
			<view class="price">
				<text>合计：</text>
				<text>￥33333</text>
			</view>
			<view class="buy">
				去结算
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		useCartStore
	} from '@/stores/cart.js';
	import {
		onActivated,
		onMounted,
		ref
	} from "vue";
	const cart = useCartStore();
	const selectAll = ref(false);

	onActivated(() => {
		cart.getCartList()
		console.log("onActivated")
	})
	onMounted(() => {
		console.log("onMounted")
		cart.getCartList()
	})

	function onClickBuy() {

	}

	function onSelectAll() {
		selectAll = !selectAll
		cart.cartList.map(item => {
			item.select = selectAll
		})
	}

	function onSelectItem(data) {
		data.select = !data.select
		selectAll = !cart.cartList.some(item => item.select == false)
	}
</script>

<style lang="scss" scoped>
	.footer {
		position: fixed;
		bottom: 100rpx;
		right: 0;
		left: 0;
		background-color: white;

		padding: 20rpx;
		height: 100rpx;

		display: flex;
		justify-content: space-between;
		align-items: center;

		.select {
			text {
				margin-left: 8rpx;
			}
		}

		.price {
			text:nth-child(2) {
				color: #ff442f;
			}
		}

		.buy {
			width: 240rpx;
			height: 80rpx;
			border-radius: 40rpx;
			background-image: linear-gradient(90deg, #ffb401, #f80);

			font-size: 30rpx;
			color: #fff;
			line-height: 80rpx;
			text-align: center;
			font-weight: 500;
		}
	}

	.body-content {
		width: 100%;
		display: flex;
		// justify-content: space-between;
	}

	.item-left {
		display: flex;
		justify-content: center;
		align-items: center;

		.item-select {
			width: 40rpx;
			height: 40rpx;
		}

		.item-img {
			width: 200rpx;
			height: 180rpx;
			border-radius: 16rpx;
		}

	}
	.item-right {
		flex: 1;
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
				.title {
					font-weight: 600;
					overflow: hidden;
					-webkit-line-clamp: 2;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
				}
				.price{
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
	}
</style>