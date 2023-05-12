<template>
	<view class="container">
		<view class="address" @click="onSelectAddress">
			<view class="" v-if="addressStore.getSelect">
				<view class="data-address">
					<view class="left">
						<i class="iconfont fm-map" style="color: #00CC99; font-size: 40rpx;"></i>
					</view>
					<view class="middle">
						<view class="user">
							<text>{{addressStore.getSelect.receive_name}}</text>
							<text>{{addressStore.getSelect.receive_mobile}}</text>
						</view>
						<view class="full">
							<text>收货地址：{{addressStore.getSelect.full_address}}</text>
						</view>
					</view>
					<view class="right">
						<i class="iconfont fm-arrowright" style="color: #00CC99; font-size: 40rpx;"></i>
					</view>
				</view>
			</view>
			<view class="no-address" v-else>
				<view class="no-btn">
					添加收货地址
				</view>
			</view>
		</view>
		<view class="goods">
			<view v-for="item in goodsList.data" class="cart-list">
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
								<uni-number-box :min="0" :max="100" v-model="item.qty" @input="onInputNum(item)" />
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
			<view class="price">
				<text>合计：</text>
				<text>￥{{formatPrice(priceAll)}}</text>
			</view>
			<view class="buy" @click="onSubmit">
				提交订单
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		useCartStore
	} from '@/stores/cart.js';
	import {
		useAddressStore
	} from '@/stores/address.js';
	import {
		formatPrice
	} from '@/utils/util.js';
	import {
		computed,
		ref,
		reactive
	} from "vue";
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app';
	import {
		useRouter,
		useRoute
	} from 'vue-router';

	const fmcart = uniCloud.importObject("fm-cart")
	const cart = useCartStore();
	const router = useRouter()
	const route = useRoute()

	const goodsList = reactive({
		data: []
	})
	const priceAll = computed(() => {
		let number = 0
		goodsList.data.forEach(item => {
			if (item.select) {
				number += item.price_sell * item.qty
			}
		})
		return number
	})
	const tempQty = ref(null)

	const addressStore = useAddressStore()
	// const addressId = ref('')
	// const addressData = reactive({})

	function onSelectAddress() {
		uni.navigateTo({
			url: '/pages/my/address/select'
		})
	}

	function onSubmit() {
		if (addressStore.selectId === '') {
			uni.showToast({
				icon: 'none',
				title: '请先选择收货地址'
			})
		} else {
			const value = {}
			value.order_delivery = addressStore.getSelect
			console.log('onSubmit---', value)
			// value.order_goodslist = ''
		}
	}

	function onInputNum(data) {
		tempQty.value = data.qty
		setTimeout(() => {
			fmcart.updateQty(data._id, data.qty).catch(err => {
				data.qty = tempQty.value
			})
		})
	}

	onLoad(() => {
		if (route.query && route.query.from === 'cart') {
			goodsList.data = cart.cartList
		}
		console.log(goodsList.data)
		if (addressStore.list.length === 0) {
			addressStore.getList()
		}
	})

	// onShow(async () => {
	// 	if (addressData.data == null) {
	// 		const fmmyaddress = uniCloud.importObject('fmmyaddress')
	// 		const result = await fmmyaddress.getDefault()
	// 		if (result.data.length === 1) {
	// 			addressData.data = result.data[0]
	// 		}
	// 	}
	// })
</script>

<style lang="scss" scoped>
	@import "@/static/css/iconfont.css";

	.footer {
		position: fixed;
		bottom: 0;
		right: 0;
		left: 0;
		background-color: white;

		padding: 20rpx;
		// height: 100rpx;

		display: flex;
		justify-content: space-between;
		align-items: center;



		.price {
			text:nth-child(2) {
				color: #ff442f;
			}
		}

		.buy {
			width: 240rpx;
			height: 80rpx;
			border-radius: 40rpx;
			background-color: #ff442f;
			font-size: 30rpx;
			color: #fff;
			line-height: 80rpx;
			text-align: center;
			font-weight: 500;
		}
	}

	.goods {
		padding-bottom: 140rpx;

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

			.cart-item {
				display: flex;

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
			}
		}
	}



	.address {
		.data-address {
			background-color: white;
			padding: 32rpx 32rpx 32rpx;
			display: flex;
			align-items: center;

			.left {
				width: 60rpx;
			}

			.right {
				width: 60rpx;
			}

			.middle {
				flex: 1;

				.user {
					text {
						font-size: 32rpx;
						font-weight: bold;
					}

					text:nth-child(2) {
						margin-left: 20rpx;
					}
				}

				.full {
					margin-top: 10rpx;
				}
			}

		}

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
</style>