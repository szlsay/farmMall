<template>
	<view>
		<view class="uni-header">
			<view class="uni-group">
				<view class="uni-title"></view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="请输入搜索内容" />
				<button class="uni-button" type="default" size="mini" @click="search">搜索</button>
				<button class="uni-button" type="default" size="mini" @click="navigateTo('./add')">新增</button>
				<download-excel class="hide-on-phone" :fields="exportExcel.fields" :data="exportExcelData"
					:type="exportExcel.type" :name="exportExcel.filename">
					<button class="uni-button" type="primary" size="mini">导出 Excel</button>
				</download-excel>
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db ref="udb" :collection="collectionList"
				field="name,unit_title,image,sku,delivery_rate_title,price_sell,expiry,reserve_begin,reserve_end,is_delete"
				:where="where" page-data="replace" :orderby="orderby" :getcount="true" :page-size="options.pageSize"
				:page-current="options.pageCurrent" v-slot:default="{data,pagination,loading,error,options}"
				:options="options" loadtime="manual" @load="onqueryload">
				<uni-table ref="table" :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe
					type="selection" @selection-change="selectionChange">
					<uni-tr>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'name')"
							sortable @sort-change="sortChange($event, 'name')">套餐名称</uni-th>
						<uni-th align="center">套餐主图</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'unit_title')"
							sortable @sort-change="sortChange($event, 'unit_title')">计量单位</uni-th>
						<uni-th width="200" align="center" sortable
							@sort-change="sortChange($event, 'sku')">套餐规格</uni-th>
						<uni-th align="center" filter-type="search"
							@filter-change="filterChange($event, 'delivery_rate_title')" sortable
							@sort-change="sortChange($event, 'delivery_rate_title')">配送频率</uni-th>
						<uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'price_sell')"
							sortable @sort-change="sortChange($event, 'price_sell')">售价</uni-th>
						<uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'expiry')"
							sortable @sort-change="sortChange($event, 'expiry')">保质期</uni-th>
						<uni-th align="center" filter-type="timestamp"
							@filter-change="filterChange($event, 'reserve_begin')" sortable
							@sort-change="sortChange($event, 'reserve_begin')">预订开始时间</uni-th>
						<uni-th align="center" filter-type="timestamp"
							@filter-change="filterChange($event, 'reserve_end')" sortable
							@sort-change="sortChange($event, 'reserve_end')">预订结束时间</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in data" :key="index">
						<uni-td align="center">{{item.name}}</uni-td>
						<uni-td align="center">
							<image style="width: 60px; height: 60px;"
								v-if="item.image && item.image.fileType == 'image'" :src="item.image.url"></image>
						</uni-td>
						<uni-td align="center">{{item.unit_title}}</uni-td>
						<uni-td align="center">
							<view class="goods-list" v-for="(item, index) in item.sku" :key="index">
								{{item.goods_name}}{{item.qty}}{{item.unit_title}}
							</view>
						</uni-td>

						<uni-td align="center">{{item.delivery_rate_title}}</uni-td>
						<uni-td align="center">{{item.price_sell}}</uni-td>
						<uni-td align="center">{{item.expiry}}</uni-td>
						<uni-td align="center">
							<uni-dateformat format="yyyy/MM/dd" :threshold="[0, 0]"
								:date="item.reserve_begin"></uni-dateformat>
						</uni-td>
						<uni-td align="center">
							<uni-dateformat format="yyyy/MM/dd" :threshold="[0, 0]"
								:date="item.reserve_end"></uni-dateformat>
						</uni-td>
						<uni-td align="center">
							<view class="uni-group">
								<button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini"
									type="primary">修改</button>
								<button @click="confirmDelete(item._id)" class="uni-button" size="mini"
									type="warn">删除</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current"
						:total="pagination.count" @change="onPageChanged" />
				</view>
			</unicloud-db>
		</view>
	</view>
</template>

<script>
	import {
		enumConverter,
		filterToWhere
	} from '@/js_sdk/validator/fm-combo.js';
	import {
		formatDate,
		cloneObject
	} from "@/utils/util.js"
	const db = uniCloud.database()
	// 表查询配置
	const dbOrderBy = '' // 排序字段
	const dbSearchFields = ["name"] // 模糊搜索字段，支持模糊搜索的字段列表。联表查询格式: 主表字段名.副表字段名，例如用户表关联角色表 role.role_name
	// 分页配置
	const pageSize = 20
	const pageCurrent = 1

	const orderByMapping = {
		"ascending": "asc",
		"descending": "desc"
	}

	export default {
		data() {
			return {
				collectionList: "fm-combo",
				query: '',
				where: 'is_delete == false',
				orderby: dbOrderBy,
				orderByFieldName: "",
				selectedIndexs: [],
				options: {
					pageSize,
					pageCurrent,
					filterData: {},
					...enumConverter
				},
				imageStyles: {
					width: 64,
					height: 64
				},
				exportExcel: {
					"filename": "套餐列表.xls",
					"type": "xls",
					"fields": {
						"套餐名称": "name",
						"计量单位": "unit_title",
						"套餐规格": "sku",
						"配送频率": "delivery_rate_title",
						"售价": "price_sell",
						"保质期": "expiry",
						"预订开始时间": "reserve_begin",
						"预订结束时间": "reserve_end"
					}
				},
				exportExcelData: []
			}
		},
		onLoad() {
			this._filter = {}
		},
		onReady() {
			this.$refs.udb.loadData()
		},
		methods: {
			onqueryload(data) {
				const dataCopy = cloneObject(data)
				const that = this
				let tempData = dataCopy.map(item => {
					item.sku = item.sku.map(item => {
						return item.goods_name + item.qty + item.unit_title
					})
					item.reserve_begin = item.reserve_begin ? formatDate(item.reserve_begin, 'yyyy/MM/dd') : ''
					item.reserve_end = item.reserve_end ? formatDate(item.reserve_end, 'yyyy/MM/dd') : ''
					return item
				})
				this.exportExcelData = tempData
			},
			getWhere() {
				const query = this.query.trim()
				if (!query) {
					return 'is_delete == false'
				}
				const queryRe = new RegExp(query, 'i')
				return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
			},
			search() {
				const newWhere = this.getWhere() + ' && is_delete == false'
				this.where = newWhere
				this.$nextTick(() => {
					this.loadData()
				})
			},
			loadData(clear = true) {
				this.$refs.udb.loadData({
					clear
				})
			},
			onPageChanged(e) {
				this.selectedIndexs.length = 0
				this.$refs.table.clearSelection()
				this.$refs.udb.loadData({
					current: e.current
				})
			},
			navigateTo(url, clear) {
				// clear 表示刷新列表时是否清除页码，true 表示刷新并回到列表第 1 页，默认为 true
				uni.navigateTo({
					url,
					events: {
						refreshData: () => {
							this.loadData(clear)
						}
					}
				})
			},
			// 多选处理
			selectedItems() {
				var dataList = this.$refs.udb.dataList
				return this.selectedIndexs.map(i => dataList[i]._id)
			},
			// 多选
			selectionChange(e) {
				this.selectedIndexs = e.detail.index
			},
			confirmDelete(id) {
				const that = this
				uni.showModal({
					title: '提示',
					content: '确定要删除此套餐？',
					success: function(res) {
						if (res.confirm) {
							that.onDelete(id)
						}
					}
				});
			},
			onDelete(id) {
				const fmgoods = uniCloud.importObject("fm-combo")
				fmgoods.delete(id).then((res) => {
					this.$refs.table.clearSelection()
					this.$refs.udb.refresh()
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				})
			},
			sortChange(e, name) {
				this.orderByFieldName = name;
				if (e.order) {
					this.orderby = name + ' ' + orderByMapping[e.order]
				} else {
					this.orderby = ''
				}
				this.$refs.table.clearSelection()
				this.$nextTick(() => {
					this.$refs.udb.loadData()
				})
			},
			filterChange(e, name) {
				this._filter[name] = {
					type: e.filterType,
					value: e.filter
				}
				let newWhere = filterToWhere(this._filter, db.command)
				if (Object.keys(newWhere).length) {
					this.where = newWhere
					this.where.is_delete = false
				} else {
					this.where = 'is_delete == false'
				}
				this.$nextTick(() => {
					this.$refs.udb.loadData()
				})
			}
		}
	}
</script>

<style>
</style>