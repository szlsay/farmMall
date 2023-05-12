<template>
	<view class="container">
		<view v-for="item in cart.cartList" class="cart-list">
			<view class="cart-item">
				<view class="item-left">
					<radio color="#00CC99" :checked="item.select" @click="onSelectItem(item)" />
					<image v-if="item.image && item.image.fileType == 'image'" :src="item.image.url" class="item-img"
						mode="aspectFill"></image>
				</view>
				<view class="item-right">
					<text class="title">{{item.name}}</text>
					<text>{{item.producer}}</text>
					<view class="price">
						<text>￥{{item.price_sell}}</text>
						{{item.qty}}
						<uni-number-box :min="0" :max="100" v-model="item.qty" @change="onChangeNum(item)"/>
					</view>
				</view>
			</view>
		</view>
		<view class="footer" v-if="cart.cartList && cart.cartList.length > 0">
			<view class="select">
				<radio color="#00CC99" :checked="selectAll" @click="onSelectAll"></radio>
				<text>全选</text>
			</view>
			<view class="price">
				<text>合计：</text>
				<text>￥{{priceAll}}</text>
			</view>
			<view class="buy" @click="onClickBuy">
				去结算
			</view>
		</view>
		<view v-else class="nodata">
			<image src="@/static/default-nodata.png"></image>
			<text>亲，购物车空空如也~</text>
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
		computed,
		ref,
		nextTick
	} from "vue";

	const fmcart = uniCloud.importObject("fm-cart")
	const cart = useCartStore();
	const selectAll = computed(() => !cart.cartList.some(item => item.select == false))
	const priceAll = computed(() => {
		let number = 0
		cart.cartList.forEach(item => {
			if (item.select) {
				number += item.price_sell * item.qty
			}
		})
		return number
	})
	const tempQty = ref(null)
	async function onSelectItem(data) {
		const result = await fmcart.updateSelect(data._id, !data.select)
		if (result.updated && result.updated > 0) {
			data.select = !data.select
		}
	}

	async function onSelectAll() {
		const selectValue = !selectAll.value
		const result = await fmcart.updateAllSelect(selectValue)
		if (result.updated && result.updated > 0) {
			cart.cartList.map(item => {
				item.select = selectValue
			})
		}
	}

	onActivated(() => {
		cart.getCartList()
		console.log("onActivated")
	})

	onMounted(async () => {
		console.log("onMounted")
		cart.getCartList()
	})

	function onClickBuy() {
		if (cart.cartList.some(item => item.select)) {
			uni.navigateTo({
				url: "/pages/order/confirm"
			})
		} else {
			uni.showToast({
				icon: 'none',
				title: '您还没选择商品哦'
			})
		}
	}

	function onChangeNum(data) {
		console.log("onChangeNum---", data)
		setTimeout(() => {
			const findData = cart.cartList.find(item => item._id === data._id)
			console.log("onChangeNum---setTimeout", data.qty, findData)
		}, 1000)
		// tempQty.value = data.qty
		// console.log('updateQty000---', tempQty)
		// const that = this
		// setTimeout(() => {
		// 	that.updateQty(data)
		// })
	}

	function onInputNum(data) {
		console.log("onInputNum", data)
		setTimeout(() => {
			const findData = cart.cartList.find(item => item._id === data._id)
			console.log("onInputNum---setTimeout", data.qty, findData)
		}, 1000)
	}

	// function blur(data) {
	// 	console.log("blur", data)
	// 	setTimeout(() => {
	// 		console.log("blur---setTimeout", data.qty)
	// 	}, 300)
	// }
	
	// function focus(data) {
	// 	console.log("focus", data)
	// 	setTimeout(() => {
	// 		console.log("focus---setTimeout", data.qty)
	// 	}, 300)
	// }
	async function updateQty(data) {
		console.log('updateQty111---', data)
		fmcart.updateQty(data._id, data.qty).then(res => {
			console.log('updateQty222---', data)
		}).catch(err => {
			console.log('updateQty333---', data)
			data.qty = tempQty.value
		})
		// if (result)
		// console.log('updateQty222---', result)

	}
</script>

<style lang="scss" scoped>
	.container {
		padding-bottom: 180rpx;
	}

	.nodata {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 400rpx;
		;

		image {
			width: 160rpx;
			height: 160rpx;
		}

		text {
			margin-top: 20rpx;
		}
	}

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

	.cart-list {
		display: flex;
		flex-direction: column;

		.cart-item {
			display: flex;
			padding: 32rpx;
			background-color: white;
			margin: 32rpx;
			margin-bottom: 0;
			border-radius: 16rpx;
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