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
				<button class="uni-button" type="default" size="mini" :disabled="!selectedIndexs.length"
					@click="delTable">批量删除</button>
				<download-excel class="hide-on-phone" :fields="exportExcel.fields" :data="exportExcelData"
					:type="exportExcel.type" :name="exportExcel.filename">
					<button class="uni-button" type="primary" size="mini">导出 Excel</button>
				</download-excel>
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db ref="udb" :collection="collectionList"
				field="goods_name,made_company,made_address,create_time,expire_time,image_produce,image_report"
				:where="where" page-data="replace" :orderby="orderby" :getcount="true" :page-size="options.pageSize"
				:page-current="options.pageCurrent" v-slot:default="{data,pagination,loading,error,options}" :options="options"
				loadtime="manual" @load="onqueryload">
				<uni-table ref="table" :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe type="selection"
					@selection-change="selectionChange">
					<uni-tr>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'goods_name')" sortable
							@sort-change="sortChange($event, 'goods_name')">商品名称</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'made_company')" sortable
							@sort-change="sortChange($event, 'made_company')">生产企业</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'made_address')" sortable
							@sort-change="sortChange($event, 'made_address')">生产地址</uni-th>
						<uni-th align="center" filter-type="timestamp" @filter-change="filterChange($event, 'create_time')" sortable
							@sort-change="sortChange($event, 'create_time')">生产批次</uni-th>
						<uni-th align="center" filter-type="timestamp" @filter-change="filterChange($event, 'expire_time')" sortable
							@sort-change="sortChange($event, 'expire_time')">有效期至</uni-th>
						<uni-th align="center" sortable @sort-change="sortChange($event, 'image_produce')">生产许可证</uni-th>
						<uni-th align="center" sortable @sort-change="sortChange($event, 'image_report')">质检报告</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in data" :key="index">
						<uni-td align="center">{{item.goods_name}}</uni-td>
						<uni-td align="center">{{item.made_company}}</uni-td>
						<uni-td align="center">{{item.made_address}}</uni-td>
						<uni-td align="center">
							<uni-dateformat format="yyyy/MM/dd" :threshold="[0, 0]" :date="item.create_time"></uni-dateformat>
						</uni-td>
						<uni-td align="center">
							<uni-dateformat format="yyyy/MM/dd" :threshold="[0, 0]" :date="item.expire_time"></uni-dateformat>
						</uni-td>
						<uni-td align="center">
							<image style="width: 60px; height: 60px;" v-if="item.image_produce && item.image_produce.fileType == 'image'"
								:src="item.image_produce.url"></image>
						</uni-td>
						<uni-td align="center">
							<image style="width: 60px; height: 60px;" v-if="item.image_report && item.image_report.fileType == 'image'"
								:src="item.image_report.url"></image>
						</uni-td>
						<uni-td align="center">
							<view class="uni-group">
								<button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini"
									type="primary">修改</button>
								<button @click="confirmDelete(item._id)" class="uni-button" size="mini" type="warn">删除</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current" :total="pagination.count"
						@change="onPageChanged" />
				</view>
			</unicloud-db>
		</view>
	</view>
</template>

<script>
	import {
		enumConverter,
		filterToWhere
	} from '@/js_sdk/validator/fm-goods-trace.js';
	import {
		cloneObject,
		formatDate
	} from '@/utils/util.js'
	const db = uniCloud.database()
	// 表查询配置
	const dbOrderBy = '' // 排序字段
	const dbSearchFields = [] // 模糊搜索字段，支持模糊搜索的字段列表。联表查询格式: 主表字段名.副表字段名，例如用户表关联角色表 role.role_name
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
				collectionList: "fm-goods-trace",
				query: '',
				where: '',
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
					"filename": "fm-goods-trace.xls",
					"type": "xls",
					"fields": {
						"商品名称": "goods_name",
						"生产企业": "made_company",
						"生产地址": "made_address",
						"生产批次": "create_time",
						"有效期至": "expire_time",
						"生产许可证": "image_produce",
						"质检报告": "image_report"
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
					if (item.image_produce && item.image_produce.url) {
						item.image_produce = item.image_produce.url
					}
					if (item.image_report && item.image_report.url) {
						item.image_report = item.image_report.url
					}
					item.create_time = formatDate(item.create_time, "yyyy/MM/dd")
					item.expire_time = formatDate(item.expire_time, "yyyy/MM/dd")
					return item
				})
				this.exportExcelData = tempData
				
				// this.exportExcelData = data
			},
			getWhere() {
				const query = this.query.trim()
				if (!query) {
					return ''
				}
				const queryRe = new RegExp(query, 'i')
				return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
			},
			search() {
				const newWhere = this.getWhere()
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
			// 批量删除
			delTable() {
				this.$refs.udb.remove(this.selectedItems(), {
					success: (res) => {
						this.$refs.table.clearSelection()
					}
				})
			},
			// 多选
			selectionChange(e) {
				this.selectedIndexs = e.detail.index
			},
			confirmDelete(id) {
				this.$refs.udb.remove(id, {
					success: (res) => {
						this.$refs.table.clearSelection()
					}
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
				} else {
					this.where = ''
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