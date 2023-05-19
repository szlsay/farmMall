<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">

			<view class="uni-stat--x p-m">
				<view class="card-header">订单信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<view style="padding: 8px 0 8px;">
							<text class="title">订单编号:</text>
							<text class="detail">{{formData.oid}}</text>
						</view>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<text class="title">订单编号:</text>
						<text class="detail">{{getStateValuetotext()}}</text>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<text class="title">创建时间:</text>
						<text class="detail">{{formatDate(formData.create_time)}}</text>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<view style="padding: 8px 0 8px;">
							<text class="title">收货人:</text>
							<text class="detail">{{formData.order_delivery.receive_name}}</text>
						</view>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<text class="title">收货电话:</text>
						<text class="detail">{{formData.order_delivery.receive_mobile}}</text>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<text class="title">收货地址:</text>
						<text class="detail">{{formData.order_delivery.full_address}}</text>
					</uni-col>
				</uni-row>
			</view>

			<view class="uni-stat--x p-m">
				<view class="card-header">商品信息</view>
				<uni-table border>
					<uni-tr>
						<uni-th align="center">商品图片</uni-th>
						<uni-th align="center">商品名称</uni-th>
						<uni-th align="center">产地</uni-th>
						<uni-th align="center">数量</uni-th>
						<uni-th align="center">价格</uni-th>
						<uni-th align="center">小计（元）</uni-th>
					</uni-tr>
					<uni-tr v-for="(goods, index) in formData.order_goodslist" :key="index">
						<uni-td align="center">
							<image style="width: 60px; height: 60px;" :src="goods.image_url"></image>
						</uni-td>
						<uni-td align="center"><text>{{goods.name}}</text></uni-td>
						<uni-td align="center"><text>{{goods.producer}}</text></uni-td>
						<uni-td align="center"><text>{{goods.qty}}</text></uni-td>
						<uni-td align="center"><text>{{goods.price_sell}}</text></uni-td>
						<uni-td align="center"><text style="color: #ff442f;">{{goods.price_amount}}</text></uni-td>
					</uni-tr>
				</uni-table>
				<view style="text-align: right; padding-top: 8px;">
					<text class="detail">订单共件商品,共计</text><text style="color: #ff442f; font-size: 14px;">￥{{formData.price_amount_total}}</text>
				</view>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		validator
	} from '@/js_sdk/validator/fm-order.js';
	import {
		formatDate
	} from '@/utils/util.js'

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'fm-order';

	function getValidator(fields) {
		let result = {}
		for (let key in validator) {
			if (fields.includes(key)) {
				result[key] = validator[key]
			}
		}
		return result
	}

	export default {
		data() {
			let formData = {
				"oid": "",
				"uid": "",
				"create_time": null,
				"update_time": null,
				"cancel_time": null,
				"price_amount_total": null,
				"state": 1,
				"order_delivery": null,
				"order_goodslist": []
			}
			return {
				formData,
				formOptions: {
					"state_localdata": [{
							"text": "待支付",
							"value": 1
						},
						{
							"text": "待发货",
							"value": 2
						},
						{
							"text": "待收货",
							"value": 3
						}
					]
				},
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		onLoad(e) {
			if (e.id) {
				const id = e.id
				this.formDataId = id
				this.getDetail(id)
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			formatDate(date) {
				return formatDate(date)
			},
			getStateValuetotext() {
				const state_valuetotext = {
					"1": "待支付",
					"2": "待发货",
					"3": "待收货"
				}
				return state_valuetotext[this.formData.state]
			},
			/**
			 * 验证表单并提交
			 */
			submit() {
				uni.showLoading({
					mask: true
				})
				this.$refs.form.validate().then((res) => {
					return this.submitForm(res)
				}).catch(() => {}).finally(() => {
					uni.hideLoading()
				})
			},

			/**
			 * 提交表单
			 */
			submitForm(value) {
				// 使用 clientDB 提交数据
				return db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
					uni.showToast({
						title: '修改成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				})
			},

			/**
			 * 获取表单数据
			 * @param {Object} id
			 */
			getDetail(id) {
				uni.showLoading({
					mask: true
				})
				db.collection(dbCollectionName).doc(id).field(
						"oid,uid,create_time,update_time,cancel_time,price_amount_total,state,order_delivery,order_goodslist").get()
					.then((res) => {
						const data = res.result.data[0]
						if (data) {
							this.formData = data

						}
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {
						uni.hideLoading()
					})
			}
		}
	}
</script>
<style lang="scss" scoped>
	::v-deep .uni-table-scroll {
		min-height: auto;
	}
	.card-header {
		display: flex;
		justify-content: space-between;
		color: #555;
		font-size: 15px;
		font-weight: 600;
		margin-bottom: 15px;
		padding-left: 10px;
		border-left: 4px solid #00CC99;
	}

	.title {
		color: #a4a4a4;
	}

	.detail {
		padding-left: 16px;
		color: #333;
	}
</style>