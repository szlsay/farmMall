<template>
	<view class="container">
		<view class="delivery" v-if="dataOrder.data.order_delivery">
			<view class="left">
				<i class="iconfont fm-map" style="color: #00CC99; font-size: 40rpx;"></i>
			</view>
			<view class="right">
				<text>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：<text class="info"> {{dataOrder.data.order_delivery.receive_name}}</text></text>
				<text>联系方式：<text class="info"> {{dataOrder.data.order_delivery.receive_mobile}}</text></text>
				<text>收货地址：<text class="info"> {{dataOrder.data.order_delivery.full_address}}</text></text>
			</view>
		</view>
		<view class="goods">

		</view>
		<view class="price">

		</view>
		<view class="info">

		</view>
		<view class="footer">

			{{dataOrder.data}}
		</view>
	</view>

</template>

<script setup>
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		reactive
	} from "vue";

	const dataOrder = reactive({
		data: {}
	})

	onLoad(async (query) => {
		console.log(query)
		const fmOrder = uniCloud.importObject('fm-order')
		const result = await fmOrder.get(query.id)
		if (result && result.data && result.data.length === 1) {
			dataOrder.data = result.data[0]
		}
	})
</script>

<style lang="scss" scoped>
	@import "@/static/css/iconfont.css";

	.delivery {
		background-color: white;
		padding: 32rpx 32rpx 32rpx;
		display: flex;
		align-items: center;

		.left {
			width: 60rpx;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			line-height: 40rpx;
			.info{
				font-weight: 700;
			}
		}
	}
</style>