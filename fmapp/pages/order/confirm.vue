<template>
	<view class="container">
		<view class="address" @click="onSelectAddress">
			<view class="" v-if="addressData.data">
				<view class="data-address">
					<view class="left">
						<i class="iconfont fm-map" style="color: #00CC99; font-size: 40rpx;"></i>
					</view>
					<view class="middle">
						<view class="user">
							<text>{{addressData.data.receive_name}}</text>
							<text>{{addressData.data.receive_mobile}}</text>
						</view>
						<view class="full">
							<text>收货地址：{{addressData.data.full_address}}</text>
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
		formatPrice
	} from '@/utils/util.js';
	import {
		onActivated,
		onMounted,
		computed,
		ref,
		reactive
	} from "vue";
	import {
		onShow
	} from '@dcloudio/uni-app'
	const fmcart = uniCloud.importObject("fmcart")
	const cart = useCartStore();
	const cartList = computed(() => cart.cartList.filter(item => item.select))
	const priceAll = computed(() => {
		let number = 0
		cart.cartList.forEach(item => {
			if (item.select) {
				number += item.price_sell * item.qty
			}
		})
		return number
	})
	const addressId = ref('')
	const addressData = reactive({})

	onShow(async () => {
		if (addressData.data == null) {
			const fmmyaddress = uniCloud.importObject('fmmyaddress')
			const result = await fmmyaddress.getDefault()
			if (result.data.length === 1) {
				addressData.data = result.data[0]
			}
		}
	})

	function onSelectAddress() {
		let id = ''
		if (addressData.data && addressData.data._id) {
			id = addressData.data._id
		}
		uni.navigateTo({
			url: '/pages/my/address/select?id=' + id,
			events: {
				// 监听新增数据成功后, 刷新当前页面数据
				selectData: (data) => {
					console.log('onSelectAddress-', data)
					addressData.data = data
				}
			}
		})
	}

	function onSubmit() {
		if (addressData.data == null) {
			uni.showToast({
				icon: 'none',
				title: '请先选择收货地址'
			})
		} else {
			const value = {}
			value.order_delivery = addressData.data
			value.order_goodslist = ''
		}
	}

	function onChangeNum(data) {
		const that = this
		setTimeout(() => {
			that.updateQty(data)
		})
	}

	async function updateQty(data) {
		await fmcart.updateQty(data._id, data.qty)
	}

	onActivated(() => {
		cart.getCartList()
		console.log("onActivated")
	})

	onMounted(async () => {
		console.log("onMounted")
		cart.getCartList()
	})
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