<template>
	<view class="container">
		<view class="delivery-order" v-if="dataOrder.data.order_delivery">
			<view class="left">
				<i class="iconfont fm-map" style="color: #00CC99; font-size: 40rpx;"></i>
			</view>
			<view class="right">
				<text>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：<text
						class="info">{{dataOrder.data.order_delivery.receive_name}}</text></text>
				<text>联系方式：<text class="info"> {{dataOrder.data.order_delivery.receive_mobile}}</text></text>
				<text>收货地址：<text class="info"> {{dataOrder.data.order_delivery.full_address}}</text></text>
			</view>
		</view>
		<view class="goods-order" v-for="goods in dataOrder.data.order_goodslist" :key="goods.goods_id">
			<view class="left">
				<image :src="goods.image_url" mode="aspectFill"></image>
			</view>
			<view class="right">
				<text class="title">{{goods.name}}</text>
				<text>{{goods.producer}}</text>
			</view>
		</view>
		<view class="price-order" v-if="dataOrder.data.price_amount_total != null">
			<view class="title">
				<text>应付金额</text>
				<text>￥{{formatPrice(dataOrder.data.price_amount_total)}}</text>
			</view>
			<view class="detail">
				<text>商品金额</text>
				<text>￥{{formatPrice(dataOrder.data.price_amount_total)}}</text>
			</view>
			<view class="detail">
				<text>运费金额</text>
				<text>￥{{formatPrice(dataOrder.data.price_amount_total)}}</text>
			</view>
		</view>
		<view class="info-order" v-if="dataOrder.data.oid != null">
			<view class="title">
				<text>订单信息</text>
			</view>
			<view class="detail">
				<text>订单编号</text>
				<text>{{dataOrder.data.oid}}</text>
			</view>
			<view class="detail">
				<text>创建时间</text>
				<text>{{formatDate(dataOrder.data.create_time)}}</text>
			</view>
			<view class="detail">
				<text>修改时间</text>
				<text>{{formatDate(dataOrder.data.update_time)}}</text>
			</view>
		</view>
		<view class="footer-order">
		</view>
	</view>

</template>

<script setup>
	import {
		formatPrice,
		formatDate
	} from '@/utils/util.js';
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

	.info-order {
		background-color: #FFF;
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-bottom: 20rpx;
		display: flex;
		flex-direction: column;

		.title {
			padding-top: 20rpx;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #EEE;
			display: flex;

			text {
				font-size: 32rpx;
			}
		}

		.detail {
			padding-top: 20rpx;
			display: flex;
			text:nth-child(2){
				margin-left: 16rpx;
			}
		}
	}

	.price-order {
		background-color: #FFF;
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-bottom: 20rpx;
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: column;

		.title {
			padding-top: 20rpx;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #EEE;
			display: flex;
			justify-content: space-between;

			text {
				font-size: 32rpx;
			}

			text:nth-child(2) {
				color: #ff442f;
			}
		}

		.detail {
			padding-top: 20rpx;
			display: flex;
			justify-content: space-between;
		}
	}

	.goods-order {
		padding: 20rpx;
		margin-bottom: 20rpx;
		display: flex;
		background-color: #FFF;

		.left {
			image {
				width: 200rpx;
				height: 180rpx;
				border-radius: 16rpx;
			}
		}

		.right {
			flex: 1;
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;

			.title {
				font-weight: 600;
				overflow: hidden;
				-webkit-line-clamp: 2;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
			}

		}
	}

	.delivery-order {
		background-color: white;
		padding: 32rpx 32rpx 32rpx;
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;

		.left {
			width: 60rpx;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			line-height: 40rpx;

			.info {
				font-weight: 700;
			}
		}
	}
</style>