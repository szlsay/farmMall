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
				field="is_delete,name,raw_name,unit,image,raw_cost,yield_ratio,processing_cost,finish_cost,transport_cost,reproduct_cost,sideline_income,quality_ratio,quality_cost,sum_cost,fixed_ratio,market_price,pack_fee,delivery_fee,branch_fee,market_fee,platform_fee,gp_price,product_bonus,market_bonus,develop_bonus,ni_price"
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
							<view class="item-fee">
								<text>原料成本: <text class="text-green">{{item.raw_cost}}</text>元</text>
								<text>出成率:<text class="text-red">{{item.yield_ratio}}</text></text>
								<text>成品成本:<text class="text-green">{{item.finish_cost}}</text>元</text>
								<text>加工成本:<text class="text-green">{{item.processing_cost}}</text>元</text>
								<text>运储成本:<text class="text-green">{{item.transport_cost}}</text>元</text>
								<text>再生产成本:<text class="text-green">{{item.reproduct_cost}}</text>元</text>
								<text>副产品收入:<text class="text-green">{{item.sideline_income}}</text>元</text>
								<text>质信金率:<text class="text-red">{{item.quality_ratio}}</text></text>
								<text>质信金:<text class="text-green">{{item.quality_cost}}</text>元</text>
								<text>成本小计:<text class="text-green">{{item.sum_cost}}</text>元</text>
							</view>
						</uni-td>
						<uni-td align="center">
							<view class="item-fee">
								<text>定倍率:<text class="text-red">{{item.fixed_ratio}}</text></text>
								<text>营销价格:<text class="text-green">{{item.market_price}}</text>元</text>
								<text>包装费:<text class="text-green">{{item.pack_fee}}</text>元</text>
								<text>配送费:<text class="text-green">{{item.delivery_fee}}</text>元</text>
								<text>网点提成:<text class="text-green">{{item.branch_fee}}</text>元</text>
								<text>营销费:<text class="text-green">{{item.market_fee}}</text>元</text>
								<text>平台佣金:<text class="text-green">{{item.platform_fee}}</text>元</text>
							</view>
						</uni-td>
						<uni-td align="center">
							<view class="item-fee">
								<text>毛利润:<text class="text-green">{{item.gp_price}}</text>元</text>
								<text>生产奖励:<text class="text-green">{{item.product_bonus}}</text>元</text>
								<text>营销奖励:<text class="text-green">{{item.market_bonus}}</text>元</text>
								<text>发展基金:<text class="text-green">{{item.develop_bonus}}</text>元</text>
								<text>净利润:<text class="text-green">{{item.ni_price}}</text>元</text>
							</view>
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
	import {
		cloneObject
	} from '@/utils/util.js'
	const db = uniCloud.database()
	// 表查询配置
	const dbOrderBy = '' // 排序字段
	const dbSearchFields = ['name'] // 模糊搜索字段，支持模糊搜索的字段列表。联表查询格式: 主表字段名.副表字段名，例如用户表关联角色表 role.role_name
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
				where: 'is_delete == false',
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
					"filename": "产品列表.xls",
					"type": "xls",
					"fields": {
						"产品名称": "name",
						"原材料名称": "raw_name",
						"计量单位": "unit",
						"原材料成本(元)": "raw_cost",
						"出成率(%)": "yield_ratio",
						"加工成本(元)": "processing_cost",
						"成品成本(元)": "finish_cost",
						"运储成本(元)": "transport_cost",
						"再生产成本(元)": "reproduct_cost",
						"副产品收入(元)": "sideline_income",
						"质信金率(%)": "quality_ratio",
						"质信金(元)": "quality_cost",
						"成本小计(元)": "sum_cost",
						"定倍率(%)": "fixed_ratio",
						"营销价格(元)": "market_price",
						"包装费(元)": "pack_fee",
						"配送费(元)": "delivery_fee",
						"网点提成(元)": "branch_fee",
						"营销费(元)": "market_fee",
						"平台佣金(元)": "platform_fee",
						"毛利润(元)": "gp_price",
						"生产奖励(元)": "product_bonus",
						"营销奖励(元)": "market_bonus",
						"发展基金(元)": "develop_bonus",
						"净利润(元)": "ni_price"
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
				const dataCopy = cloneObject(data)
				const that = this
				let tempData = dataCopy.map(item => {
					item.unit = that.getUnitText(item.unit)
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
				const newWhere = this.getWhere() + '&& is_delete == false'
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
					content: '确定要删除此产品？',
					success: function(res) {
						if (res.confirm) {
							that.onDelete(id)
						}
					}
				});
			},
			onDelete(id) {
				const fmproduct = uniCloud.importObject("fm-product")
				fmproduct.delete(id).then((res) => {
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

<style lang="scss" scoped>
	.item-fee {
		display: flex;
		flex-direction: column;
		align-items: flex-start;

		.text-red {
			color: #ff442f;
		}

		.text-green {
			color: #00CC99;
		}
	}
</style>