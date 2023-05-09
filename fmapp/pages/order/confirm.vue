<template>
	<view class="container">
		<view class="address">
			<view class="no-address">
				<view class="no-btn">
					添加收货地址
				</view>
			</view>
		</view>
		<view class="goods">
			<view v-for="item in cartList" class="cart-list">
				<view class="cart-cell">
					<view class="cart-item">
						<view class="item-left">
							<image v-if="item.image && item.image.fileType == 'image'" :src="item.image.url" class="item-img"
								mode="aspectFill"></image>
						</view>
						<view class="item-right">
							<text class="title">{{item.name}}</text>
							<text>{{item.producer}}</text>
							<view class="price">
								<text>￥{{item.price_sell}}</text>
								<uni-number-box :min="0" :max="100" v-model="item.qty" @change="onChangeNum(item)"
									@blur="onChangeNum(item)" />
							</view>
						</view>
					</view>
					<view class="cart-price">
						<view class="subtotal">
							<text>小计</text>
							<text>￥{{formatPrice(item.qty * item.price_sell)}}</text>
						</view>
						<view class="subtotal">
							<text>运杂费</text>
							<text></text>
						</view>
					</view>
				</view>

			</view>
		</view>
		<view class="footer">

		</view>
	</view>
</template>

<script setup>
	import {
		useCartStore
	} from '@/stores/cart.js';
	import {
		formatPrice
	} from '@/utils/util.js';
	import {
		onActivated,
		onMounted,
		computed
	} from "vue";

	const fmcart = uniCloud.importObject("fmcart")
	const cart = useCartStore();
	const cartList = computed(() => cart.cartList.filter(item => item.select))

	onActivated(() => {
		cart.getCartList()
		console.log("onActivated")
	})

	onMounted(async () => {
		console.log("onMounted")
		cart.getCartList()
	})

	function onChangeNum(data) {
		const that = this
		setTimeout(() => {
			that.updateQty(data)
		})
	}

	async function updateQty(data) {
		await fmcart.updateQty(data._id, data.qty)
		const result = await fmcart.updateSelect(data._id, data.select)
		console.log('onSelectItem--', result)
	}
</script>

<style lang="scss" scoped>
	.cart-price {
		.subtotal {
			padding-top: 16rpx;
			display: flex;
			justify-content: space-between;

			text:nth-child(2) {
				color: #ff442f;
			}
		}
	}

	.address {
		.no-address {
			background-color: white;
			padding: 32rpx 100rpx 32rpx;

			.no-btn {
				color: #00CC99;
				text-align: center;
				border: 2rpx solid #00CC99;
				background-color: white;
				height: 88rpx;
				border-radius: 44rpx;
				line-height: 88rpx;
			}
		}
	}

	.cart-list {
		display: flex;
		flex-direction: column;

		.cart-cell {
			padding: 32rpx;
			background-color: white;
			margin: 32rpx;
			margin-bottom: 0;
			border-radius: 16rpx;
		}

		.cart-item {
			display: flex;

		}
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

		.price {
			display: flex;
			justify-content: space-between;
			align-items: center;

			text:nth-child(1) {
				color: #ff442f;
			}
		}
	}
</style>