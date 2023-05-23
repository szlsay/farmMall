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
			<uni-row :gutter="20">
				<uni-col :xs="24" :sm="12">
					<view class="fm-box">
						<view class="fm-card-header">
							订单趋势（近六个月）
						</view>
						<qiun-data-charts type="line" :opts="opts" :chartData="chartData" :ontouch="true" />
					</view>
				</uni-col>
				<uni-col :xs="24" :sm="12">
					<view class="fm-box">
						<view class="fm-card-header">
							消费商品占比
						</view>
						<qiun-data-charts type="pie" :opts="optsGoods" :chartData="chartDataGoods" />
					</view>
				</uni-col>
			</uni-row>
<!-- 			<view class="fm-box">
				<view class="fm-card-header">常用功能</view>
			</view> -->
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
				chartDataGoods: {},
				optsGoods: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
					padding: [5, 5, 5, 5],
					enableScroll: false,
					extra: {
						pie: {
							activeOpacity: 0.5,
							activeRadius: 10,
							offsetAngle: 0,
							labelWidth: 15,
							border: true,
							borderWidth: 3,
							borderColor: "#FFFFFF"
						}
					}
				},
				chartData: {},
				opts: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
					padding: [15, 0, 0, 0],
					enableScroll: true,
					legend: {},
					xAxis: {
						disableGrid: true,
						scrollShow: true,
						itemCount: 6
					},
					yAxis: {
						gridType: "dash",
						dashLength: 2
					},
					extra: {
						line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
						}
					}
				},
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
			this.getServerData();
			this.getServerDataGoods();
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
			getServerDataGoods() {
				setTimeout(() => {
					let res = {
						series: [{
							data: [{
								"name": "鸡蛋",
								"value": 38,
								"labelText":"鸡蛋:38%"
							}, {
								"name": "西瓜",
								"value": 22,
								"labelText":"西瓜:22%"
							}, {
								"name": "羊肉",
								"value": 20,
								"labelText":"羊肉:20%"
							}, {
								"name": "柴鸡",
								"value": 15,
								"labelText":"柴鸡:15%"
							}, {
								"name": "其他",
								"value": 5,
								"labelText":"其他:5%"
							}]
						}]
					};
					this.chartDataGoods = JSON.parse(JSON.stringify(res));
				}, 500);
			},
			getServerData() {
				//模拟从服务器获取数据时的延时
				setTimeout(() => {
					//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
					let res = {
						categories: ["2023/01", "2023/02", "2023/03", "2023/04", "2023/05", "2023/06"],
						series: [{
								name: "农产品成交量",
								data: [853, 986, 1052, 768, 1475, 656]
							},
							{
								name: "合作社成交量",
								data: [125, 254, 785, 456, 457, 321]
							},
							{
								name: "第三方成交量",
								data: [89, 105, 98, 98, 104, 132]
							}
						]
					};
					this.chartData = JSON.parse(JSON.stringify(res));
				}, 500);
			},
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