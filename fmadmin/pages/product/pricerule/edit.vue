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
						<uni-forms-item :label="'档次：' + (index+1)" label-align="right">
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item label="起始值" :name="['rules',index,'start_value']" label-align="right">
							<uni-easyinput placeholder="请输入起始值" type="number"
								v-model="item.start_value"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item label="结束值" :name="['rules',index,'end_value']" label-align="right">
							<uni-easyinput placeholder="请输入结束值" type="number" v-model="item.end_value"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="6">
						<uni-forms-item label="比例" :name="['rules',index,'ratio']" label-align="right">
							<uni-easyinput placeholder="请输入比例" type="number" v-model="item.ratio"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="3">
						<button @click="onDeleteRule(index)" class="uni-button" size="mini" type="warn"
							style="margin-left: 40rpx; margin-top: 4rpx;">删除</button>
					</uni-col>
				</uni-row>
				<view class="uni-button-group" style="margin-top: 0;">
					<button type="primary" class="uni-button" style="width: 100px;" @click="onAddRule">新增规格</button>
					<button class="uni-button" style="margin-left: 15px;width: 112px;"
						@click="onChangeChart">生成曲线图</button>
				</view>
			</view>
			<view class="fm-box" v-if="chartData.categories && chartData.categories.length > 0">
				<view class="fm-card-header">规则曲线图</view>
				<view class="charts-box">
					<qiun-data-charts type="line" :opts="opts" :chartData="chartData" />
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
				chartData: {},
				//您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [15, 10, 0, 15],
					enableScroll: false,
					legend: {},
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						gridType: "dash",
						dashLength: 2
					},
					extra: {
						line: {
							type: "curve",
							width: 2,
							activeType: "hollow"
						}
					}
				},
				labelWidth: 80,
				formData,
				formOptions: {},
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
			onChangeChart() {
				const categories = this.formData.rules.map(item => {
					return item.start_value
				})
				const series_data = this.formData.rules.map(item => {
					return item.ratio
				})
				let res = {
					categories: categories,
					series: [{
						name: this.formData.title,
						data: series_data
					}]
				};
				this.chartData = JSON.parse(JSON.stringify(res));
			},
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
				db.collection(dbCollectionName).doc(id).field("title,type,rules").get().then((res) => {
					const data = res.result.data[0]
					if (data) {
						this.formData = data
						this.onChangeChart()
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