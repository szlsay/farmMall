<template>
	<view class="uni-container">
		<view class="st-box-tow">
			<view class="st-box">
				<view class="st-card-header">分类列表</view>
				<view class="uni-group">
					<button class="uni-button" type="default" size="mini" @click="onAddOne">新增一级</button>
					<button class="uni-button" type="default" size="mini" @click="onAddTwo">新增二级</button>
				</view>
			</view>
			<view class="st-box" style="margin-left: 10px;">
				<view class="st-card-header">{{cateTitle}}</view>
				<uni-forms ref="form" :model="formData" validateTrigger="bind" v-if="formData.level">
					<uni-forms-item name="label" label="标题" :label-width="labelWidth" label-align="right">
						<uni-easyinput placeholder="请输入标题" v-model="formData.label"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item name="image" label="类型图标" :label-width="labelWidth" label-align="right">
						<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object"
							v-model="formData.image" :image-styles="imageStyles"></uni-file-picker>
					</uni-forms-item>
					<uni-forms-item name="disabled" label="是否禁用" :label-width="labelWidth" label-align="right">
						<switch @change="binddata('disabled', $event.detail.value)" :checked="formData.disabled"></switch>
					</uni-forms-item>
					<uni-forms-item name="parent_id" label="" :label-width="labelWidth" label-align="right">
						<uni-easyinput placeholder="父类ID，系统自动生成" v-model="formData.parent_id"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item name="level" label="级别" :label-width="labelWidth" label-align="right">
						<uni-easyinput placeholder="级别，系统自动生成" type="number" v-model="formData.level"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item name="pinyin" label="中文拼音" :label-width="labelWidth" label-align="right">
						<uni-easyinput placeholder="中文拼音，系统自动生成" v-model="formData.pinyin"></uni-easyinput>
					</uni-forms-item>
					<view class="uni-button-group">
						<button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
						<navigator open-type="navigateBack" style="margin-left: 15px;">
							<button class="uni-button" style="width: 100px;">返回</button>
						</navigator>
					</view>
				</uni-forms>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		validator
	} from '@/js_sdk/validator/st-product-cate.js';

	const db = uniCloud.database();
	const dbCmd = db.command;
	const dbCollectionName = 'st-product-cate';

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
				"label": "",
				"image": null,
				"disabled": "false",
				"parent_id": "",
				"level": null,
				"pinyin": ""
			}
			return {
				labelWidth: 80,
				imageStyles: {
					width: 100,
					height: 100,
				},
				cateTitle: "分类信息",
				formData,
				formOptions: {},
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			onAddOne() {
				this.cateTitle = "分类信息(新增一级)"
			},
			onAddTwo() {
				this.cateTitle = "分类信息(新增二级)"
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

<style lang="scss" scoped>
	.st-box-tow {
		display: flex;
	}

	.st-box {
		flex: 1;
	}
</style>