<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<!-- 基本信息 -->
			<view class="fm-box">
				<view class="fm-card-header">基本信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="title" label="协议标题" required :label-width="labelWidth"
							label-align="right">
							<uni-easyinput placeholder="请填写协议标题" v-model="formData.title" trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="type" label="协议类型" required :label-width="labelWidth" label-align="right">
							<uni-data-select placeholder="请选择类型" v-model="formData.type"
								:localdata="formOptions.type_localdata"></uni-data-select>
						</uni-forms-item>
					</uni-col>
				</uni-row>
			</view>
			<!-- 协议信息 -->
			<view class="fm-box">
				<view class="fm-card-header">协议信息</view>
				<uni-forms-item name="content">
					<view id="wangeditor">
					</view>
				</uni-forms-item>
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
	import E from 'wangeditor'
	import {
		validator
	} from '@/js_sdk/validator/fm-protocol.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'fm-protocol';

	function getValidator(fields) {
		let result = {}
		for (let key in validator) {
			if (fields.includes(key)) {
				result[key] = validator[key]
			}
		}
		return result
	}

	let editor = null
	export default {
		data() {
			let formData = {
				"update_time": null,
				"title": "",
				"type": null,
				"content": ""
			}
			return {
				labelWidth: 80,
				formData,
				formOptions: {
					"type_localdata": [{
							"text": "用户服务协议",
							"value": 0
						},
						{
							"text": "用户授权协议",
							"value": 1
						},
						{
							"text": "隐私政策条款",
							"value": 2
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
			this.initEditor()
		},
		methods: {
			/**
			 * 初始化富文本编辑器
			 */
			initEditor() {
				editor = new E('#wangeditor')
				// 配置菜单栏，设置不需要的菜单
				editor.config.excludeMenus = [
					'emoticon',
					'image',
					'video'
				]
				editor.config.zIndex = 0
				// 取消自动 focus
				editor.config.focus = false
				editor.config.placeholder = '请填写协议内容'
				editor.config.onblur = function(newHtml) {
					console.log('onblur', newHtml) // 获取最新的 html 内容
				}
				editor.config.onfocus = function(newHtml) {
					console.log('onfocus', newHtml) // 获取最新的 html 内容
				}
				// 配置 onchange 回调函数
				const that = this
				editor.config.onchange = function(newHtml) {
					console.log("change 之后最新的 html", newHtml);
					that.formData.content = newHtml
				};
				// 配置触发 onchange 的时间频率，默认为 200ms
				editor.config.onchangeTimeout = 500; // 修改为 500ms
				editor.create()
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
				value.update_time = new Date().valueOf()
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
				db.collection(dbCollectionName).doc(id).field("create_time,update_time,title,type,content").get().then((
					res) => {
					const data = res.result.data[0]
					if (data) {
						this.formData = data
						editor.txt.html(this.formData.content)
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