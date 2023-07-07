<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<!-- 基本信息 -->
			<view class="st-box">
				<view class="st-card-header">基本信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="land_name" label="地块名称" required :label-width="labelWidth"
							label-align="right">
							<uni-easyinput placeholder="例如：一号地块、一号大棚" v-model="formData.land_name" trim="both"
								maxlength="20"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="land_type" label="地块类型" required :label-width="labelWidth"
							label-align="right">
							<uni-data-select placeholder="请选择地块类型" v-model="formData.land_type"
								:localdata="$store.state.sys.land_types"></uni-data-select>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="contact_name" label="负责人姓名" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请输入负责人姓名" v-model="formData.contact_name" trim="both"
								maxlength="20"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="12">
						<uni-forms-item name="contact_phone" label="负责人电话" :label-width="labelWidth"
							label-align="right">
							<uni-easyinput placeholder="请输入负责人电话" v-model="formData.contact_phone" trim="both"
								maxlength="11"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-forms-item name="image_content" label="地块实景" :label-width="labelWidth" label-align="right">
						<uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="array"
							v-model="formData.image_content" limit="6" :image-styles="imageStyles"></uni-file-picker>
						<text style="color: red; font-size: 14px;"
							class="title-alert">用于地块的详情展示，最多六张。格式：jpg,png,webp</text>
					</uni-forms-item>
				</uni-row>
				<uni-row>
					<uni-forms-item name="video" label="实景视频" :label-width="labelWidth" label-align="right">
						<uni-file-picker file-mediatype="file" return-type="object"
							v-model="formData.video"></uni-file-picker>
					</uni-forms-item>
				</uni-row>
				<uni-row>
					<uni-forms-item name="disabled" label="是否禁用" :label-width="labelWidth" label-align="right">
						<switch @change="binddata('disabled', $event.detail.value)" :checked="formData.disabled">
						</switch>
					</uni-forms-item>
				</uni-row>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="map_address" label="地图选址" :label-width="labelWidth" label-align="right">
							<uni-easyinput type="textarea" placeholder="请从地图上选址" v-model="formData.map_address"
								trim="both" disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="address" label="详细地址" :label-width="labelWidth" label-align="right">
							<uni-easyinput type="textarea" placeholder="请填写详细地址" v-model="formData.address"
								trim="both"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="longitude" label="经度" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请选择经度" v-model="formData.longitude" trim="both"
								disabled></uni-easyinput>
						</uni-forms-item>
						<uni-forms-item name="latitude" label="纬度" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请选择纬度" v-model="formData.latitude" trim="both"
								disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
				</uni-row>
			</view>

			<!-- 位置信息 -->
			<view class="st-box">
				<view class="st-card-header">位置信息</view>
				<uni-row :gutter="20">
					<uni-col :xs="24" :sm="6">
						<view class="map-search">
							<input class="uni-search" type="text" v-model="queryMap" @confirm="onSearch"
								placeholder="请输入搜索地址" />
							<button class="uni-button" type="default" size="mini" @click="onSearch">搜索</button>
						</view>
						<view class="map-list" v-for="item in searchList" @click="onClickMap(item)">
							{{item.name}}
						</view>
					</uni-col>
					<uni-col :xs="24" :sm="18">
						<view id="map">
							<view class="input-card">
								<!-- <button class="uni-button" type="default" size="mini" @click="createPolygon">新建</button> -->
								<button class="uni-button" type="primary" size="mini" @click="openPolygon">编辑圈地</button>
								<button class="uni-button" type="warn" size="mini" @click="closePolygon">保存圈地</button>
							</view>
						</view>
					</uni-col>
				</uni-row>
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
	import {
		validator
	} from '@/js_sdk/validator/st-land.js';
	//引入 amap-jsapi-loader
	import AMapLoader from "@amap/amap-jsapi-loader";
	//安全密钥引入
	window._AMapSecurityConfig = {
		securityJsCode: "6a80c5d3ba9586cdb3434946a291aecf",
	};

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
				"land_name": "",
				"land_type": "",
				"contact_name": "",
				"contact_phone": "",
				"map_address": "",
				"address": "",
				"longitude": "",
				"latitude": "",
				"image_content": [],
				"video": null,
				"disabled": false
			}
			return {
				path: [],
				polygon: null,
				isPolyEditor: false,
				polyEditor: null,
				searchList: [],
				autoComplete: null,
				queryMap: null,
				map: null, //高德实例
				marker: null, //点标记 Marker
				geocoder: null, //逆向地理
				labelWidth: 90,
				imageStyles: {
					width: 100,
					height: 100,
				},
				formData,
				formOptions: {},
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
		},
		methods: {
			createPolygon() {
				this.isPolyEditor = true
				this.polyEditor.close();
				this.polyEditor.setTarget();
				this.polyEditor.open();
			},
			openPolygon() {
				this.isPolyEditor = true
				this.polyEditor.open()
			},
			closePolygon() {
				this.isPolyEditor = false
				this.polyEditor.close()
			},
			onClickMap(item) {
				this.map.setCenter([item.location.lng, item.location.lat])
			},
			onSearch() {
				if (!this.queryMap) {
					uni.showToast({
						title: "请输入搜索地址",
						icon: "none"
					})
					return
				} else {
					const that = this
					this.autoComplete.search(this.queryMap, function(status, result) {
						if (status === "complete" && result.info == "OK") {
							that.searchList = result.tips
						}
					})
				}
			},
			//初始化
			initMap() {
				AMapLoader.load({
						key: "902207ba23e27ca1ead75ebca4694010", // 申请好的Web端开发者Key，首次调用 load 时必填
						version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
						plugins: ["AMap.AutoComplete", "AMap.CitySearch",
							"AMap.Geocoder", "AMap.PolygonEditor"
						], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
					}).then((AMap) => {
						// 实例化
						const lng = parseFloat(this.formData.longitude)
						const lat = parseFloat(this.formData.latitude)

						if (lng > 1 && lat > 1) {
							this.loadMap([lng, lat])
							this.updateMap(this.formData.map_address + this.formData.address, [lng, lat])
						} else {
							// 自动获取用户IP，返回当前城市
							let citysearch = new AMap.CitySearch();
							citysearch.getLocalCity((status, result) => {
								if (status === "complete" && result.info === "OK") {
									const lat = (result.bounds.northEast.lat + result.bounds.southWest.lat) / 2
									const lng = (result.bounds.northEast.lng + result.bounds.southWest.lng) / 2
									this.loadMap([lng, lat])
								} else {
									this.loadMap()
								}
							});
						}
					})
					.catch((e) => {
						console.log(e);
					});
			},
			loadMap(center = [118.84164, 35.586807]) {
				const satellite = new AMap.TileLayer.Satellite()
				const roadNet = new AMap.TileLayer.RoadNet();
				// 实例化
				this.map = new AMap.Map("map", { //设置地图容器id
					viewMode: "3D", //是否为3D地图模式
					zoom: 32, //初始化地图级别
					layers: [
						satellite,
						roadNet
					],
					mapStyle: "amap://styles/darkblue",
					features: ['bg', 'road', 'building', 'point'],
					center //初始化地图中心点位置
				});
				// 地图点击事件--点标记标注
				this.map.on("click", this.handleClick);

				if (this.path && this.path.length > 0) {
					this.polygon = new AMap.Polygon({
						path: this.path,
						fillColor: '#00CC9933', // 多边形填充颜色
						borderWeight: 1, // 线条宽度，默认为 1
						strokeColor: '#00CC99', // 线条颜色
					});
					//多边形 Polygon对象添加到 Map
					this.map.add(this.polygon);
					// 缩放地图到合适的视野级别
					this.map.setFitView([this.polygon])
					this.polyEditor = new AMap.PolygonEditor(this.map, this.polygon);
				} else {
					this.polyEditor = new AMap.PolygonEditor(this.map);
				}
				const that = this
				this.polyEditor.on('add', function(data) {
					console.log(data);
					const polygon = data.target;
					that.polyEditor.addAdsorbPolygons(polygon);
					polygon.on('dblclick', () => {
						that.polyEditor.setTarget(polygon);
						that.polyEditor.open();
					})
				})

				this.polyEditor.on('end', function(data) {
					that.path = data.target._opts.path
					if (this.polygon) {
						that.map.remove(this.polygon)
					}
					this.polygon = new AMap.Polygon({
						path: data.target._opts.path,
						fillColor: '#00CC9933', // 多边形填充颜色
						borderWeight: 1, // 线条宽度，默认为 1
						strokeColor: '#00CC99', // 线条颜色
					});
					that.polyEditor.addAdsorbPolygons(this.polygon);
					that.map.add([this.polygon])
				})
				// 逆向地理编码插件
				this.geocoder = new AMap.Geocoder({
					// city: "010", //城市设为北京，默认：“全国”
					radius: 1000, //范围，默认：500
				});

				const autoOptions = {
					city: '全国'
				}
				this.autoComplete = new AMap.AutoComplete(autoOptions);
			},
			// 地图点击之后更新点标记
			handleClick(e) {
				if (this.isPolyEditor) {
					return
				}
				let longitude = e.lnglat.getLng(); //经度
				let latitude = e.lnglat.getLat(); //纬度
				this.formData.longitude = longitude.toString()
				this.formData.latitude = latitude.toString()
				// 逆向地理编码
				this.geocoder.getAddress([longitude, latitude], (status, result) => {
					if (status === "complete" && result.info == "OK") {
						let address = result.regeocode.formattedAddress;
						this.formData.map_address = address
						// 更新点标记
						this.updateMap(address, [longitude, latitude]);
					} else {
						console.log("定位失败，请稍后重试");
					}
				});
			},
			// 更新点标记
			updateMap(address, lnglat) {
				// 移除已创建的 marker
				if (this.marker) this.map.remove(this.marker);
				// 同时设置地图中心点和缩放级别
				this.map.setZoomAndCenter(16, lnglat);
				// 自定义标记点
				this.marker = new AMap.Marker({
					position: lnglat,
					// icon: "http://vdata.amap.com/icons/b18/1/2.png",
					anchor: "top-center",
					offset: new AMap.Pixel(0, -30),
				});
				// 添加到实例
				this.marker.setMap(this.map);
				// 设置label标签，label默认蓝框白底左上角显示，样式className为：amap-marker-label
				const content =
					"<div style='height: 20px; line-height: 20px; border-radius:14px; padding-left: 12px; padding-right: 12px; font-size: 16px; font-weight: 700; color: white; border: 2px solid #00CC99; text-shadow: 1px 1px 2px #000;'>" +
					address + "</div>"
				this.marker.setLabel({
					direction: "top-center",
					offset: new AMap.Pixel(10, 0), //设置文本标注偏移量
					content //设置文本标注内容
				});
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
				if (!value.video) {
					value.video = {
						url: ''
					}
				}
				if (this.path) {
					value.path = JSON.parse(JSON.stringify(this.path))
				} else {
					value.path = null
				}
				const stland = uniCloud.importObject("st-land")
				stland.update(this.formDataId, value).then((res) => {
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
				const db = uniCloud.database();
				const dbCollectionName = 'st-land';
				db.collection(dbCollectionName).doc(id).field(
					"land_name,land_type,contact_name,contact_phone,path,map_address,address,longitude,latitude,image_content,video,disabled"
				).get().then((res) => {
					const data = res.result.data[0]
					if (data) {
						this.formData = data
						if (this.formData.video && this.formData.video.url === '') {
							this.formData.video = null
						}
						this.path = data.path
						this.initMap();
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
<style lang="scss" scoped>
	#map {
		width: 100%;
		height: 400px;
		border-radius: 20rpx;
		position: relative;
	}

	.input-card {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 1;

		button:first-child {
			margin-right: 10px;
		}
	}

	.map-search {
		display: flex;

		button {
			margin-left: 8px;
			min-width: 70px;
		}
	}

	.map-list {
		box-sizing: border-box;
		border: 1px solid #00CC99;
		border-radius: 14px;
		padding-left: 8px;
		font-size: 12px;

		height: 28px;
		margin-top: 8px;
		cursor: pointer;

		display: flex;
		align-items: center;
	}

	.map-list:hover {
		background-color: #00CC99;
	}
</style>