<template>
	<view class="fix-top-window">
		<view class="uni-header">
			<uni-stat-breadcrumb class="uni-stat-breadcrumb-on-phone" />
			<view class="uni-group">
				<view class="uni-sub-title hide-on-phone"></view>
			</view>
		</view>
		<view class="uni-container">

			<view class="fm-box">
				<view class="fm-card-header">设备概览</view>
				<uni-table :loading="loading" border stripe emptyText="暂无数据">
					<uni-tr>
						<!-- <uni-th align="center">操作</uni-th> -->
						<block v-for="(mapper, index) in deviceTableFields" :key="index">
							<uni-th v-if="mapper.title" :key="index" align="center">
								{{mapper.title}}
							</uni-th>
						</block>
					</uni-tr>
					<uni-tr v-for="(item ,i) in deviceTableData" :key="i">
						<block v-for="(mapper, index) in deviceTableFields" :key="index">
							<uni-td v-if="mapper.field === 'appid'" align="center">
								<view v-if="item.appid" @click="navTo('/pages/uni-stat/device/overview/overview', item.appid)"
									class="link-btn-color">
									{{item[mapper.field] !== undefined ? item[mapper.field] : '-'}}
								</view>
								<view v-else @click="navTo('/pages/system/app/add')" class="link-btn-color">
									需添加此应用的 appid
								</view>
							</uni-td>
							<uni-td v-else :key="index" align="center">
								{{item[mapper.field] !== undefined ? item[mapper.field] : '-'}}
							</uni-td>
						</block>
					</uni-tr>
				</uni-table>
			</view>
			<view class="fm-box">
				<view class="fm-card-header">注册用户概览</view>
				<uni-table :loading="loading" border stripe emptyText="暂无数据">
					<uni-tr>
						<block v-for="(mapper, index) in userTableFields" :key="index">
							<uni-th v-if="mapper.title" :key="index" align="center">
								{{mapper.title}}
							</uni-th>
						</block>
					</uni-tr>
					<uni-tr v-for="(item ,i) in userTableData" :key="i">
						<block v-for="(mapper, index) in userTableFields" :key="index">
							<uni-td v-if="mapper.field === 'appid'" align="center">
								<view v-if="item.appid" @click="navTo('/pages/uni-stat/user/overview/overview', item.appid)"
									class="link-btn-color">
									{{item[mapper.field] !== undefined ? item[mapper.field] : '-'}}
								</view>
								<view v-else @click="navTo('/pages/system/app/add')" class="link-btn-color">
									需添加此应用的 appid
								</view>
							</uni-td>
							<uni-td v-else :key="index" align="center">
								{{item[mapper.field] !== undefined ? item[mapper.field] : '-'}}
							</uni-td>
						</block>
					</uni-tr>
				</uni-table>
			</view>
			<view class="fm-box">
				<view class="fm-card-header">实时概况</view>
				<uni-row>
					<uni-col :xs="12" :sm="6">
						<view class="summary-wrap">
							<view class="summary-title">
								<view class="title">
									今日订单数
								</view>
								<uni-tooltip content="统计时间内,订单数量">
									<uni-icons type="info" color="#00CC99" size="22"></uni-icons>
								</uni-tooltip>
							</view>
							<view class="summary-num">
								12
							</view>
							<view class="summary-title">
								昨日：88
							</view>
							<view class="summary-title">
								订单总数
							</view>
							<view class="summary-num">
								1542
							</view>
						</view>
					</uni-col>
					<uni-col :xs="12" :sm="6">
						<view class="summary-wrap">
							<view class="summary-title">
								<view class="title">
									今日销售额
								</view>
								<uni-tooltip content="统计时间内,订单销售金额">
									<uni-icons type="info" color="#00CC99" size="22"></uni-icons>
								</uni-tooltip>
							</view>
							<view class="summary-num">
								12.00
							</view>
							<view class="summary-title">
								昨日：88.00
							</view>
							<view class="summary-title">
								订单总数
							</view>
							<view class="summary-num">
								1542.00
							</view>
						</view>
					</uni-col>
					<uni-col :xs="12" :sm="6">
						<view class="summary-wrap">
							<view class="summary-title">
								<view class="title">
									今日新增用户
								</view>
								<uni-tooltip content="统计时间内,新增加的用户数量">
									<uni-icons type="info" color="#00CC99" size="22"></uni-icons>
								</uni-tooltip>
							</view>
							<view class="summary-num">
								3
							</view>
							<view class="summary-title">
								昨日：6
							</view>
							<view class="summary-title">
								用户总数
							</view>
							<view class="summary-num">
								885
							</view>
						</view>
					</uni-col>
					<uni-col :xs="12" :sm="6">
						<view class="summary-wrap">
							<view class="summary-title">
								<view class="title">
									今日浏览量
								</view>
								<uni-tooltip content="统计时间内,用户的浏览量">
									<uni-icons type="info" color="#00CC99" size="22"></uni-icons>
								</uni-tooltip>
							</view>
							<view class="summary-num">
								4
							</view>
							<view class="summary-title">
								昨日：156
							</view>
							<view class="summary-title">
								总浏览量
							</view>
							<view class="summary-num">
								9875
							</view>
						</view>
					</uni-col>
				</uni-row>
			</view>
			<view class="fm-box">
				<view class="fm-card-header">待办事项</view>
				<uni-row>
					<uni-col :xs="8" :sm="4">
						<view class="summary-wrap">
							<view class="summary-title">
								<view class="title">
									待付款订单
								</view>
					<!-- 			<uni-tooltip content="线上订单未支付订单数">
									<uni-icons type="info" color="#00CC99" size="22"></uni-icons>
								</uni-tooltip> -->
							</view>
							<view class="summary-num">
								12
							</view>
						</view>
					</uni-col>
					<uni-col :xs="8" :sm="4">
						<view class="summary-wrap">
							<view class="summary-title">
								<view class="title">
									待发货订单
								</view>
							</view>
							<view class="summary-num">
								4
							</view>
						</view>
					</uni-col>
					<uni-col :xs="8" :sm="4">
						<view class="summary-wrap">
							<view class="summary-title">
								<view class="title">
									退款中订单
								</view>
							</view>
							<view class="summary-num">
								1
							</view>
						</view>
					</uni-col>
					<uni-col :xs="8" :sm="4">
						<view class="summary-wrap">
							<view class="summary-title">
								<view class="title">
									库存警告
								</view>
							</view>
							<view class="summary-num">
								0
							</view>
						</view>
					</uni-col>
					<uni-col :xs="8" :sm="4">
						<view class="summary-wrap">
							<view class="summary-title">
								<view class="title">
									出售中商品
								</view>
							</view>
							<view class="summary-num">
								8
							</view>
						</view>
					</uni-col>
					<uni-col :xs="8" :sm="4">
						<view class="summary-wrap">
							<view class="summary-title">
								<view class="title">
									仓库中商品
								</view>
							</view>
							<view class="summary-num">
								9
							</view>
						</view>
					</uni-col>
				</uni-row>
			</view>
			<view class="fm-box">
				<view class="fm-card-header">常用功能</view>
			</view>
		</view>
		<!-- #ifndef H5 -->
		<fix-window />
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		stringifyQuery,
		stringifyField,
		stringifyGroupField,
		getTimeOfSomeDayAgo,
		division,
		format,
		parseDateTime,
		getFieldTotal,
		debounce
	} from '@/js_sdk/uni-stat/util.js'

	import {
		deviceFeildsMap,
		userFeildsMap
	} from './fieldsMap.js'

	export default {
		data() {
			return {
				query: {
					platform_id: '',
					start_time: [getTimeOfSomeDayAgo(1), new Date().getTime()]
				},
				deviceTableData: [],
				userTableData: [],
				// panelData: panelOption,
				// 每页数据量
				pageSize: 10,
				// 当前页
				pageCurrent: 1,
				// 数据总量
				total: 0,
				loading: false,
				complete: false,
				statSetting: {
					mode: "",
					day: 7
				},
				statModeList: [{
						"value": "open",
						"text": "开启"
					},
					{
						"value": "close",
						"text": "关闭"
					},
					{
						"value": "auto",
						"text": "节能"
					},
				],
				showAddAppId: false
			}
		},
		onReady() {

			this.debounceGet = debounce(() => {
				this.getAllData(this.queryStr);
			}, 300);

			this.debounceGet();
			this.checkAppId();
		},
		watch: {
			query: {
				deep: true,
				handler(newVal) {
					this.debounceGet(this.queryStr);
				}
			}
		},
		computed: {
			queryStr() {
				const defQuery = `(dimension == "hour" || dimension == "day")`
				return stringifyQuery(this.query) + ' && ' + defQuery
			},

			deviceTableFields() {
				return this.tableFieldsMap(deviceFeildsMap)
			},
			userTableFields() {
				return this.tableFieldsMap(userFeildsMap)
			}
		},
		methods: {
			getAllData(queryStr) {
				this.getApps(this.queryStr, deviceFeildsMap, 'device')
				this.getApps(this.queryStr, userFeildsMap, 'user')
			},
			tableFieldsMap(fieldsMap) {
				let tableFields = []
				const today = []
				const yesterday = []
				const other = []
				for (const mapper of fieldsMap) {
					if (mapper.field) {
						if (mapper.hasOwnProperty('value')) {
							const t = JSON.parse(JSON.stringify(mapper))
							const y = JSON.parse(JSON.stringify(mapper))
							if (mapper.field !== 'total_users' && mapper.field !== 'total_devices') {
								t.title = '今日' + mapper.title
								t.field = mapper.field + '_value'
								y.title = '昨日' + mapper.title
								y.field = mapper.field + '_contrast'
								today.push(t)
								yesterday.push(y)
							} else {
								t.field = mapper.field + '_value'
								other.push(t)
							}
						} else {
							tableFields.push(mapper)
						}
					}
				}
				tableFields = [...tableFields, ...today, ...yesterday, ...other]
				return tableFields
			},

			getApps(query, fieldsMap, type = "device") {
				this.loading = true
				const db = uniCloud.database()
				const appDaily = db.collection('uni-stat-result').where(query).getTemp();
				const appList = db.collection('opendb-app-list').getTemp()
				db.collection(appDaily, appList)
					.field(
						`${stringifyField(fieldsMap, '', 'value')},stat_date,appid,dimension`
					)
					.groupBy(`appid,dimension,stat_date`)
					.groupField(stringifyGroupField(fieldsMap, '', 'value'))
					.orderBy(`appid`, 'desc')
					.get()
					.then((res) => {
						let {
							data
						} = res.result
						//console.log('data: ', data)
						this[`${type}TableData`] = []
						if (!data.length) return
						let appids = [],
							todays = [],
							yesterdays = [],
							isToday = parseDateTime(getTimeOfSomeDayAgo(0), '', ''),
							isYesterday = parseDateTime(getTimeOfSomeDayAgo(1), '', '')
						for (const item of data) {
							const {
								appid,
								name
							} = item.appid && item.appid[0] || {}
							item.appid = appid
							item.name = name

							if (appids.indexOf(item.appid) < 0) {
								appids.push(item.appid)
							}
							if (item.dimension === 'hour' && item.stat_date === isToday) {
								todays.push(item)
							}
							if (item.dimension === 'day' && item.stat_date === isYesterday) {
								yesterdays.push(item)
							}
						}
						const keys = fieldsMap.map(f => f.field).filter(Boolean)
						for (const appid of appids) {
							const rowData = {}
							const t = todays.find(item => item.appid === appid)
							const y = yesterdays.find(item => item.appid === appid)
							for (const key of keys) {
								if (key === 'appid' || key === 'name') {
									rowData[key] = t && t[key]
								} else {
									const value = t && t[key]
									const contrast = y && y[key]
									rowData[key + '_value'] = format(value)
									rowData[key + '_contrast'] = format(contrast)
								}
							}
							if (appid) {
								rowData[`total_${type}s_value`] = "获取中...";
							}
							this[`${type}TableData`].push(rowData);
							if (appid) {
								// total_users 不准确，置空后由 getFieldTotal 处理, appid 不存在时暂不处理
								t[`total_${type}s`] = 0
								const query = JSON.parse(JSON.stringify(this.query))
								query.start_time = [getTimeOfSomeDayAgo(0), new Date().getTime()]
								query.appid = appid
								getFieldTotal.call(this, query, `total_${type}s`).then(total => {
									this[`${type}TableData`].find(item => item.appid === appid)[
										`total_${type}s_value`] = total
								})
							}
						}
					}).catch((err) => {
						console.error(err)
						// err.message 错误信息
						// err.code 错误码
					}).finally(() => {
						this.loading = false;
						this.complete = true;
					})
			},
			navTo(url, id) {
				if (url.indexOf('http') > -1) {
					window.open(url)
				} else {
					if (id) {
						url = `${url}?appid=${id}`
					}
					uni.navigateTo({
						url
					})
				}
			},
			toUrl(url) {
				// #ifdef H5
				window.open(url, "_blank");
				// #endif
			},
			toAddAppId() {
				this.showAddAppId = false;
				uni.navigateTo({
					url: "/pages/system/app/list",
					events: {
						refreshData: () => {
							this.checkAppId();
						}
					}
				})
			},
			async checkAppId() {
				const db = uniCloud.database();
				let res = await db.collection('opendb-app-list').count();
				this.showAddAppId = (!res.result || res.result.total === 0) ? true : false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.summary-wrap {
		padding-left: 8px;

		.summary-title {
			display: flex;
			color: #999999;
			margin-top: 8px;

			.title {
				color: #999999;
			}

			.uni-tooltip {
				flex: 1;
			}
		}

		.summary-num {
			margin: 8px 0 8px;
			color: #333333;
			font-size: 22px;
		}
	}
</style>