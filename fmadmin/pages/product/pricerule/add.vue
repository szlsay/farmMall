<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<view class="fm-box">
				<view class="fm-card-header">基本信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="title" label="标题" required :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请输入标题" v-model="formData.title" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="type" label="英文标识" required :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写英文标识" v-model="formData.type" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
			</view>


			<view class="fm-box">
				<view class="fm-card-header">规则信息</view>
				<uni-row v-for="(item, index) in formData.rules" :key="index" :gutter="10">
					<uni-col :xs="24" :sm="2">
						<uni-forms-item :label="'档次：' + index" label-align="center">
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item :name="['rules',index,'start_value']" label-align="right">
							<uni-easyinput placeholder="请输入起始值" type="number"
								v-model="item.start_value"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item :name="['rules',index,'end_value']" label-align="right">
							<uni-easyinput placeholder="请输入结束值" type="number" v-model="item.end_value"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item :name="['rules',index,'ratio']" label-align="right">
							<uni-easyinput placeholder="请输入比例" type="number" v-model="item.ratio"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="4">
						<button @click="onDeleteRule(index)" class="uni-button" size="mini" type="warn"
							style="margin-left: 40rpx; margin-top: 4rpx;">删除</button>
					</uni-col>
				</uni-row>
				<view class="uni-button-group" style="margin-top: 0;">
					<button type="primary" class="uni-button" style="width: 100px;" @click="onAddRule">新增规格</button>
				</view>
			</view>
			<view class="uni-button-group">
				<button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
				<navigator open-type="navigateBack" style="margin-left: 15px;">
					<button class="uni-button" style="width: 100px;">返回</button>
				</navigator>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		validator
	} from '@/js_sdk/validator/fm-price-rule.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'fm-price-rule';

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
				"title": "",
				"type": "",
				"rules": []
			}
			return {
				labelWidth: 80,
				formData,
				formOptions: {},
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
			this.onAddRule()
		},
		methods: {
			onAddRule() {
				const rule = {
					"start_value": null,
					"end_value": null,
					"ratio": null,
				}
				this.formData.rules.push(rule)
			},
			onDeleteRule(index) {
				this.formData.rules.splice(index, 1)
			},
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
				return db.collection(dbCollectionName).add(value).then((res) => {
					uni.showToast({
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				})
			}
		}
	}
</script>