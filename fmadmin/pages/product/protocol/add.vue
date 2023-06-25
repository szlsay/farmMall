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
							<uni-data-select placeholder="请选择协议标题" v-model="type"
								:localdata="$store.state.sys.protocol_types" @change="onChange"></uni-data-select>
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
				"title": "",
				"content": ""
			}
			return {
				type: '',
				labelWidth: 80,
				formData,
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
			this.initEditor()
		},
		methods: {
			onChange(value) {
				console.log(value)
				if (value) {
					const protocol_types = this.$store.state.sys.protocol_types.filter(item => item.value === value)
					if (protocol_types.length > 0) {
						this.formData.title = protocol_types[0].text
					} else {
						this.formData.title = ''
					}
				} else {
					this.formData.title = ''
				}
			},
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
				// 使用 clientDB 提交数据
				return db.collection(dbCollectionName).add(value).then((res) => {
					uni.showToast({
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
				}).catch((err) => {
					if (err.code && err.code === 'DUPLICATE_KEY') {
						uni.showToast({
							title: '本协议已存在',
							icon: 'error'
						})
					} else {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}
				})
			}
		}
	}
</script>