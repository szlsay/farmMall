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
			{{cartList}}
			<view v-for="item in cartList" class="cart-list">
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
							<uni-number-box :min="0" :max="100" v-model="item.qty" @change="onChangeNum(item)"
								@blur="onChangeNum(item)" />
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
		onActivated,
		onMounted,
		computed
	} from "vue";
	const cart = useCartStore();
	const cartList = computed(() => cart.cartList.forEach(item => item.select))
	// const cartList = computed(() => cart.cartList)
	
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
	.address {
		.no-address{
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
