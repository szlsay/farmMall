<template>
	<view class="container">
		<view v-for="item in cartStore.list" class="cart-list">
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
						<uni-number-box :min="0" :max="100" v-model="item.qty" @input="onInputNum(item)" />
					</view>
				</view>
			</view>
		</view>
		<view class="footer" v-if="cartStore.list.length > 0">
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
		computed,
		ref,
		nextTick
	} from "vue";
	import {
		onLoad
	} from '@dcloudio/uni-app'

	const fmcart = uniCloud.importObject("fm-cart")
	const cartStore = useCartStore();
	const selectAll = computed(() => !cartStore.list.some(item => item.select == false))
	const priceAll = computed(() => {
		let number = 0
		cartStore.list.forEach(item => {
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
			cartStore.list.map(item => {
				item.select = selectValue
			})
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

	function onClickBuy() {
		if (cartStore.list.some(item => item.select)) {
			uni.navigateTo({
				url: "/pages/order/confirm?from=cart"
			})
		} else {
			uni.showToast({
				icon: 'none',
				title: '您还没选择商品哦'
			})
		}
	}

	onLoad(() => {
		cartStore.getList()
	})
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