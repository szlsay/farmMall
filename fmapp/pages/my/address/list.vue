<template>
	<view class="container">
		<uni-list>
			<uni-list-item v-for="(item, index) in addressStore.list" :key="index" showArrow :clickable="true"
				@click="onClickItem(item._id)">
				<template v-slot:body>
					<view class="item">
						<view class="user">
							<text>{{item.receive_name}}</text>
							<text>{{item.receive_mobile}}</text>
						</view>
						<view class="address">
							<text class="default" v-if="item.is_default">默认</text>
							<text>收货地址：{{item.full_address}}</text>
						</view>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		<view v-if="addressStore.list.length === 0" class="nodata">
			<image src="@/static/default-nodata.png"></image>
			<text>亲，请添加收货地址~</text>
		</view>
		<view class="footer">
			<view class="btn-add" @click="onClickAdd">
				新增收货地址
			</view>
		</view>
	</view>
</template>
<script setup>
	import {
		useAddressStore
	} from '@/stores/address.js'

	import {
		onLoad
	} from '@dcloudio/uni-app'

	const addressStore = useAddressStore();

	function loadData() {
		addressStore.getList()
	}

	function onClickItem(id) {
		uni.navigateTo({
			url: './edit?id=' + id,
			events: {
				refreshData: () => {
					loadData()
				}
			}
		})
	}

	function onClickAdd() {
		uni.navigateTo({
			url: './add',
			events: {
				refreshData: () => {
					loadData()
				}
			}
		})
	}

	onLoad(() => {
		if (addressStore.list.length === 0) {
			loadData()
		}
	})
</script>


<style lang="scss" scoped>
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

	.item {
		.user {
			text {
				font-size: 32rpx;
				font-weight: bold;
			}

			text:nth-child(2) {
				margin-left: 20rpx;
			}
		}

		.address {
			margin-top: 10rpx;

			.default {
				background-color: #00CC99;
				padding: 2rpx 8rpx 2rpx;
				color: white;
				border-radius: 8rpx;
				font-size: 24rpx;
				margin-right: 16rpx;
			}
		}
	}

	.footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 10rpx 32rpx 10rpx;
		background-color: white;

		.btn-add {
			width: 100%;
			height: 80rpx;
			background-color: #00CC99;
			border-radius: 40rpx;
			color: white;
			text-align: center;
			line-height: 80rpx;
		}
	}

	.container {
		padding-bottom: 100rpx;
	}

	page {
		background-color: white;
	}
</style>