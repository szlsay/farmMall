<template>
	<view class="uni-container">
		<view class="st-box-tow">
			<view class="st-box">
				<view class="st-card-header">分类列表</view>
				<view class="uni-group">
					<button class="uni-button" type="primary" size="mini" @click="onAddOne"
						:disabled="disabledOne">新增一级</button>
					<button class="uni-button" type="default" size="mini" @click="onAddTwo"
						:disabled="disabledTwo">新增下级</button>
				</view>
				<view class="cate-list" v-if="list && list.length > 0">
					<view class="cate-item" v-for="item in list" :key="item._id">
						<view class="level-1" :class="{ 'select-bg': item._id === selectId}" @click="onClickItem(item)">
							<uni-icons :type="item.isNext ? 'bottom': 'right'" size="20"
								:color="item.disabled ? '#ff442f' : ''"></uni-icons>
							<text :class="{ 'text-disabled': item.disabled}">{{item.label}}</text>
						</view>
						<view class="level-2" :class="{ 'select-bg': subItem._id === selectId}"
							v-for="subItem in item.children" :key="subItem._id" @click="onClickSubItem(subItem)"
							v-if="item.isNext">
							<image v-if="subItem.image && subItem.image.url" :src="subItem.image.url" mode="aspectFill"
								:class="{ 'image-disabled': subItem.disabled}"></image>
							<view class="word-img" :class="{ 'word-img-disabled': subItem.disabled}" v-else>
								{{subItem["pinyin"].slice(0, 1).toUpperCase()}}
							</view>
							<text :class="{ 'text-disabled': subItem.disabled}">{{subItem.label}}</text>
						</view>
					</view>
				</view>
				<view class="info-nodata" v-else>
					<image src="@/static/icon-nodata.png" mode=""></image>
					<text>分类列表暂未内容</text>
				</view>
			</view>
			<view class="st-box" style="margin-left: 10px;">
				<view class="st-card-header">{{cateTitle}}</view>
				<uni-forms ref="form" :model="formData" validateTrigger="bind" v-if="formData.level">
					<uni-forms-item name="label" label="标题" :label-width="labelWidth" label-align="right" required>
						<uni-easyinput placeholder="请输入标题" v-model="formData.label"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item name="image" label="分类图标" :label-width="labelWidth" label-align="right"
						v-if="formData.level === 2">
						<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object"
							v-model="formData.image" :image-styles="imageStyles"></uni-file-picker>
					</uni-forms-item>
					<uni-forms-item name="disabled" label="是否禁用" :label-width="labelWidth" label-align="right">
						<switch @change="binddata('disabled', $event.detail.value)" :checked="formData.disabled">
						</switch>
					</uni-forms-item>
					<uni-forms-item name="parent_id" :label="parentLabel" :label-width="labelWidth" label-align="right"
						v-if="formData.level === 2">
						<uni-easyinput placeholder="父级id，系统自动生成" v-model="formData.parent_id" disabled></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item name="level" label="级别" :label-width="labelWidth" label-align="right">
						<uni-easyinput placeholder="级别，系统自动生成" type="number" v-model="formData.level"
							disabled></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item name="pinyin" label="中文拼音" :label-width="labelWidth" label-align="right">
						<uni-easyinput placeholder="中文拼音，系统自动生成" v-model="formData.pinyin" disabled></uni-easyinput>
					</uni-forms-item>
					<view class="uni-button-group">
						<button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
						<button class="uni-button" style="width: 100px;margin-left: 15px;" @click="onClickDelete"
							v-if="isEdit">删除</button>
					</view>
				</uni-forms>
				<view class="info-nodata" v-else>
					<image src="@/static/icon-nodata.png" mode=""></image>
					<text>分类信息暂未内容</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		validator
	} from '@/js_sdk/validator/st-product-cate.js'
	import {
		cloneObject
	} from '@/utils'
	import {
		pinyin
	} from 'pinyin-pro'
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
				"disabled": false,
				"parent_id": "",
				"level": null,
				"pinyin": ""
			}
			return {
				parentLabel: '',
				disabledOne: false,
				disabledTwo: true,
				isEdit: false,
				selectId: null,
				list: [],
				labelWidth: 100,
				imageStyles: {
					width: 100,
					height: 100,
				},
				cateTitle: "分类信息",
				formData,
				formOptions: {},
				rules: {
					...getValidator(Object.keys(formData))
				},
				loadRule: false
			}
		},
		watch: {
			"formData.parent_id": function(value) {
				if (value) {
					const item = this.list.find(item => item._id === value)
					this.parentLabel = `父级id(${item.label})`
				} else {
					this.parentLabel = "父级id"
				}
			},
			"formData.level": function(value) {
				this.$nextTick(() => {
					if (value && !this.loadRule) {
						this.$refs.form.setRules(this.rules)
						this.loadRule = true
					}
				})
			},
			"formData.label": function(value) {
				this.$nextTick(() => {
					this.formData.pinyin = pinyin(value, {
						toneType: 'none',
						type: 'array',
						v: true
					}).join("")
				})
			}
		},
		onReady() {
			this.loadData()
		},
		methods: {
			onClickDelete() {
				if (this.formData.children && this.formData.children.length > 0) {
					uni.showToast({
						title: "请先删除下级",
						icon: "error"
					})
					return
				}
				const that = this
				uni.showModal({
					title: '提示',
					content: '确定要删除此分类？',
					success: function(res) {
						if (res.confirm) {
							that.onDelete()
						}
					}
				});
			},
			onDelete() {
				const stproductcate = uniCloud.importObject("st-product-cate")
				stproductcate.delete(this.selectId).then((res) => {
					this.refreshData("删除成功")
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				})
			},
			onClickItem(item) {
				item.isNext = !item.isNext
				this.disabledTwo = false
				this.isEdit = true
				this.cateTitle = "分类信息(编辑一级)"
				this.formData = cloneObject(item)
				if (this.formData.image && this.formData.image.url === '') {
					this.formData.image = null
				}
				this.selectId = item._id
			},
			onClickSubItem(item) {
				this.disabledTwo = true
				this.isEdit = true
				this.cateTitle = "分类信息(编辑下级)"
				this.formData = cloneObject(item)
				if (this.formData.image && this.formData.image.url === '') {
					this.formData.image = null
				}
				this.selectId = item._id
			},
			refreshData(title) {
				this.isEdit = false
				this.disabledTwo = true
				this.formData = {
					"label": "",
					"image": null,
					"disabled": false,
					"parent_id": "",
					"level": null,
					"pinyin": ""
				}
				this.cateTitle = "分类信息"
				uni.showToast({
					title
				})
				const that = this
				setTimeout(() => this.loadData(), 500)
			},
			loadData() {
				const stproductcate = uniCloud.importObject("st-product-cate")
				stproductcate.getList().then((res) => {
					res.map(item => item.isNext = false)
					this.list = res
				})
			},
			onAddOne() {
				this.isEdit = false
				this.formData = {
					"label": "",
					"image": null,
					"disabled": false,
					"parent_id": "",
					"level": 1,
					"pinyin": ""
				}
				this.cateTitle = "分类信息(新增一级)"
			},
			onAddTwo() {
				this.isEdit = false
				this.formData = {
					"label": "",
					"image": null,
					"disabled": false,
					"parent_id": this.selectId,
					"level": 2,
					"pinyin": ""
				}
				this.cateTitle = "分类信息(新增下级)"
			},
			submit() {
				if (!this.formData.label) {
					uni.showToast({
						title: "请输入标题",
						icon: "none"
					})
					return
				}
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
				if (!value.image) {
					value.image = {
						url: ''
					}
				}
				const stproductcate = uniCloud.importObject("st-product-cate")
				if (this.isEdit) {
					stproductcate.update(this.selectId, value).then((res) => {
						this.refreshData('编辑成功')
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					})
				} else {
					stproductcate.add(value).then((res) => {
						this.refreshData('新增成功')
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.st-box-tow {
		display: flex;
	}

	.info-nodata {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;

		image {
			width: 200px;
			height: 200px;
		}
	}

	.cate-list {
		// margin: 10px;

		.cate-item {
			display: flex;
			flex-direction: column;

			.level-1 {
				// padding: 8px;
				padding-top: 8px;
				padding-bottom: 8px;
				display: flex;
				align-items: center;

				&:hover {
					background-color: #ecf5ff;
				}

				text {
					margin-left: 8px;
				}
			}

			.level-2 {
				padding-top: 8px;
				padding-bottom: 8px;
				padding-left: 10px;
				display: flex;
				align-items: center;

				&:hover {
					background-color: #ecf5ff;
				}

				image {
					width: 30px;
					height: 30px;
					background-color: #00CC9966;
					border: 1px solid #00CC99;
					border-radius: 50%;
				}

				text {
					margin-left: 8px;
				}

				.image-disabled {
					background-color: #ff442f66;
					border: 1px solid #ff442f;
				}

				.word-img {
					width: 30px;
					height: 30px;
					background-color: #00CC9966;
					border: 1px solid #00CC99;
					border-radius: 50%;
					color: #333;
					font-size: 18px;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.word-img-disabled {
					background-color: #ff442f66;
					border: 1px solid #ff442f;
				}
			}

			.text-disabled {
				color: #ff442f;
			}
		}

		.select-bg {
			background-color: #ecf5ff;
		}

	}
</style>