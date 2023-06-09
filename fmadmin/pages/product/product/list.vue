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
				field="name,raw_name,unit,image,raw_cost,yield_ratio,processing_cost,finish_cost,transport_cost,reproduct_cost,sideline_income,quality_ratio,sum_cost,fixed_ratio,market_price,pack_fee,delivery_fee,branch_fee,market_fee,platform_fee,gp_price,product_bonus,market_bonus,develop_bonus,ni_price"
				:where="where" page-data="replace" :orderby="orderby" :getcount="true" :page-size="options.pageSize"
				:page-current="options.pageCurrent" v-slot:default="{data,pagination,loading,error,options}"
				:options="options" loadtime="manual" @load="onqueryload">
				<uni-table ref="table" :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe
					type="selection" @selection-change="selectionChange">
					<uni-tr>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'name')"
							sortable @sort-change="sortChange($event, 'name')">产品名称</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'raw_name')"
							sortable @sort-change="sortChange($event, 'raw_name')">原材料名称</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'unit')"
							sortable @sort-change="sortChange($event, 'unit')">计量单位</uni-th>
						<uni-th align="center">产品主图</uni-th>
						<uni-th align="center">生产环节</uni-th>
						<uni-th align="center">营销环节</uni-th>
						<uni-th align="center">结算环节</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in data" :key="index">
						<uni-td align="center">{{item.name}}</uni-td>
						<uni-td align="center">{{item.raw_name}}</uni-td>
						<uni-td align="center">{{getUnitText(item.unit)}}</uni-td>
						<uni-td align="center">
							<image style="width: 60px; height: 60px;"
								v-if="item.image && item.image.fileType == 'image'" :src="item.image.url"></image>
						</uni-td>
						<uni-td align="center">
							<text>原料成本:{{item.raw_cost}}元</text>
							<text>出成率:{{item.yield_ratio}}</text>
							<text>成品成本:{{item.finish_cost}}元</text>
							<text>加工成本:{{item.processing_cost}}元</text>
							<text>运储成本:{{item.transport_cost}}元</text>
							<text>再生产成本:{{item.reproduct_cost}}元</text>
							<text>副产品收入:{{item.sideline_income}}元</text>
							<text>质信金率:{{item.quality_ratio}}</text>
							<text>成本小计:{{item.sum_cost}}元</text>
						</uni-td>
						<uni-td align="center">
							<text>定倍率:{{item.fixed_ratio}}</text>
							<text>营销价格:{{item.market_price}}元</text>
							<text>包装费:{{item.pack_fee}}元</text>
							<text>配送费:{{item.delivery_fee}}元</text>
							<text>网点提成:{{item.branch_fee}}元</text>
							<text>营销费:{{item.market_fee}}元</text>
							<text>平台佣金:{{item.platform_fee}}元</text>
						</uni-td>
						<uni-td align="center">
							<text>毛利润:{{item.gp_price}}元</text>
							<text>生产奖励:{{item.product_bonus}}元</text>
							<text>营销奖励:{{item.market_bonus}}元</text>
							<text>发展基金:{{item.develop_bonus}}元</text>
							<text>净利润:{{item.ni_price}}元</text>
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
	} from '@/js_sdk/validator/fm-product.js';

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
				collectionList: "fm-product",
				query: '',
				where: '',
				orderby: dbOrderBy,
				orderByFieldName: "",
				selectedIndexs: [],
				options: {
					pageSize,
					pageCurrent,
					...enumConverter
				},
				imageStyles: {
					width: 64,
					height: 64
				},
				exportExcel: {
					"filename": "fm-product.xls",
					"type": "xls",
					"fields": {
						"产品名称": "name",
						"原材料名称": "raw_name",
						"计量单位": "unit",
						"原材料成本": "raw_cost",
						"出成率": "yield_ratio",
						"加工成本": "processing_cost",
						"成品成本": "finish_cost",
						"运储成本": "transport_cost",
						"再生产成本": "reproduct_cost",
						"副产品收入": "sideline_income",
						"质信金": "quality_ratio",
						"成本小计": "sum_cost",
						"定倍率": "fixed_ratio",
						"营销价格": "market_price",
						"包装费": "pack_fee",
						"配送费": "delivery_fee",
						"网点提成": "branch_fee",
						"营销费": "market_fee",
						"平台佣金": "platform_fee",
						"毛利润": "gp_price",
						"生产奖励": "product_bonus",
						"营销奖励": "market_bonus",
						"发展基金": "develop_bonus",
						"净利润": "ni_price"
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
			getUnitText(value) {
				const result = this.$store.state.sys.measure_units.filter(item => item.value === value)
				if (result && result.length > 0) {
					return result[0].text
				} else {
					return ''
				}
			},
			onqueryload(data) {
				this.exportExcelData = data
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