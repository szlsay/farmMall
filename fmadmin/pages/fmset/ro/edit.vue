<template>
	<view class="uni-container">
		<uni-forms ref="form" :model="formData" validateTrigger="bind">
			<view class="uni-stat--x p-m">
				<view class="card-header">基本信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="name" label="合作社名称" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请填写合作社名称" v-model="formData.name" trim="both" maxlength="20"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="mobile" label="手机号码" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="手机号码" v-model="formData.mobile" trim="both" maxlength="11"></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="8">
						<uni-forms-item name="start" label="星级" :label-width="labelWidth" label-align="right">
							<uni-data-select placeholder="请选择星级" v-model="formData.start"
								:localdata="formOptions.start_localdata"></uni-data-select>
						</uni-forms-item>
					</uni-col>
				</uni-row>
			</view>
			<view class="uni-stat--x p-m">
				<view class="card-header">位置信息</view>
				<uni-row>
					<uni-col :xs="24" :sm="11">
						<uni-forms-item name="address" label="详细地址" :label-width="labelWidth" label-align="right">
							<uni-easyinput type="textarea" placeholder="请填写详细地址" v-model="formData.address" trim="both"></uni-easyinput>
						</uni-forms-item>
		<uni-forms-item name="longitude" label="经度" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请选择经度" v-model="formData.longitude" trim="both" disabled></uni-easyinput>
						</uni-forms-item>
						<uni-forms-item name="latitude" label="纬度" :label-width="labelWidth" label-align="right">
							<uni-easyinput placeholder="请选择纬度" v-model="formData.latitude" trim="both" disabled></uni-easyinput>
						</uni-forms-item>
					</uni-col>
					<uni-col :xs="24" :sm="11" :push="1">
						<view id="map">
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
  import { validator } from '@/js_sdk/validator/fm-ro.js';
	//引入 amap-jsapi-loader
	import AMapLoader from "@amap/amap-jsapi-loader";
	//安全密钥引入
	window._AMapSecurityConfig = {
		securityJsCode: "6a80c5d3ba9586cdb3434946a291aecf",
	};
  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'fm-ro';

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
				"name": "",
				"mobile": "",
				"start": 0,
				"address": "",
				"longitude": "",
				"latitude": ""
			}
      return {
				map: null, //高德实例
				marker: null, //点标记 Marker
				geocoder: null, //逆向地理
				labelWidth: 90,
        formData,
        formOptions: {
          "start_localdata": [
            {
              "text": "无",
              "value": 0
            },
            {
              "text": "一星",
              "value": 1
            },
            {
              "text": "二星",
              "value": 2
            },
            {
              "text": "三星",
              "value": 3
            },
            {
              "text": "四星",
              "value": 4
            },
            {
              "text": "五星",
              "value": 5
            }
          ]
        },
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
      //初始化
      initMap() {
      	AMapLoader.load({
      			key: "902207ba23e27ca1ead75ebca4694010", // 申请好的Web端开发者Key，首次调用 load 时必填
      			version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      			plugins: ["AMap.CitySearch", "AMap.Geocoder"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      		}).then((AMap) => {
      			// 实例化
						const longitude = parseFloat(this.formData.longitude)
						const latitude = parseFloat(this.formData.latitude)
						const center = [longitude, latitude]
      			this.map = new AMap.Map("map", { //设置地图容器id
      				viewMode: "3D", //是否为3D地图模式
      				zoom: 16, //初始化地图级别
      				center
      			});
						this.updateMap(this.formData.address, center)
      			// 自动获取用户IP，返回当前城市
      			let citysearch = new AMap.CitySearch();
      			citysearch.getLocalCity((status, result) => {
      				if (status === "complete" && result.info === "OK") {
      					console.log(result);
      				}
      			});
      
      			// 地图点击事件--点标记标注
      			this.map.on("click", this.handleClick);
      
      			// 逆向地理编码插件
      			this.geocoder = new AMap.Geocoder({
      				// city: "010", //城市设为北京，默认：“全国”
      				radius: 1000, //范围，默认：500
      			});
      		})
      		.catch((e) => {
      			console.log(e);
      		});
      },
      // 地图点击之后更新点标记
      handleClick(e) {
      	let longitude = e.lnglat.getLng(); //经度
      	let latitude = e.lnglat.getLat(); //纬度
      	this.formData.longitude = longitude.toString()
      	this.formData.latitude = latitude.toString()
      	// 逆向地理编码
      	this.geocoder.getAddress([longitude, latitude], (status, result) => {
      		if (status === "complete" && result.info == "OK") {
      			let address = result.regeocode.formattedAddress;
      			this.formData.address = address
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
      	const content = "<div style='width:250px; font-size: 16px; font-weight: 700;'>" + address + "</div>"
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
        }).catch(() => {
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
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
        db.collection(dbCollectionName).doc(id).field("name,mobile,start,address,longitude,latitude").get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
            this.initMap()
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
		height: 300px;
		border-radius: 20rpx;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		color: #555;
		font-size: 14px;
		font-weight: 600;
		padding: 10px 0;
		margin-bottom: 15px;
	}
</style>