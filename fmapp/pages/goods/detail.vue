<template>
  <view class="container">
    <unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="options" :collection="collectionList" :getone="true" :manual="true">
      <view v-if="error">{{error.message}}</view>
      <view v-else-if="loading">
        <uni-load-more :contentText="loadMore" status="loading"></uni-load-more>
      </view>
      <view v-else-if="data">
        <view>
          <text>商品主图</text>
          <uni-file-picker v-if="data.image && data.image.fileType == 'image'" :value="data.image" :file-mediatype="data.image && data.image.fileType" return-type="object" readonly></uni-file-picker>
          <uni-link v-else-if="data.image" :href="data.image.url" :text="data.image.url"></uni-link>
          <text v-else></text>
        </view>
        <view>
          <text>商品名称</text>
          <text>{{data.name}}</text>
        </view>
        <view>
          <text>省</text>
          <text>{{data.province_code}}</text>
        </view>
        <view>
          <text>市</text>
          <text>{{data.city_code}}</text>
        </view>
        <view>
          <text>省市区</text>
          <text>{{data.area_code && data.area_code[0] && data.area_code[0].text}}</text>
        </view>
        <view>
          <text>省</text>
          <text>{{data.province_name}}</text>
        </view>
        <view>
          <text>市</text>
          <text>{{data.city_name}}</text>
        </view>
        <view>
          <text>区</text>
          <text>{{data.area_name}}</text>
        </view>
        <view>
          <text>商品产地</text>
          <text>{{data.producer}}</text>
        </view>
        <view>
          <text>计量单位</text>
          <text>{{options.unit_valuetotext[data.unit]}}</text>
        </view>
        <view>
          <text>成本价</text>
          <text>{{data.price_cost}}</text>
        </view>
        <view>
          <text>原价</text>
          <text>{{data.price_original}}</text>
        </view>
        <view>
          <text>售价</text>
          <text>{{data.price_sell}}</text>
        </view>
        <view>
          <text>商品来源</text>
          <text>{{options.source_type_valuetotext[data.source_type]}}</text>
        </view>
        <view>
          <text>库存</text>
          <text>{{data.stock}}</text>
        </view>
        <view>
          <text>存储条件</text>
          <text>{{data.storage}}</text>
        </view>
        <view>
          <text>保质期</text>
          <text>{{data.expiry}}</text>
        </view>
        <view>
          <text>最小起购</text>
          <text>{{data.buy_min}}</text>
        </view>
        <view>
          <text>最大起购</text>
          <text>{{data.buy_max}}</text>
        </view>
        <view>
          <text>商品描述</text>
          <text>{{data.description}}</text>
        </view>
        <view>
          <text>展示图片</text>
          <template v-for="(file, j) in data.image_content">
            <uni-file-picker v-if="file.fileType == 'image'" :value="file" :file-mediatype="file.fileType" return-type="object" readonly></uni-file-picker>
            <uni-link v-else :href="file.url" :text="file.url"></uni-link>
          </template>
        </view>
      </view>
    </unicloud-db>
    <view class="btns">
      <button type="primary" @click="handleUpdate">修改</button>
      <button type="warn" class="btn-delete" @click="handleDelete">删除</button>
    </view>
  </view>
</template>

<script>
  // 由schema2code生成，包含校验规则和enum静态数据
  import { enumConverter } from '@/js_sdk/validator/fm-goods.js'
  const db = uniCloud.database()

  export default {
    data() {
      return {
        queryWhere: '',
        collectionList: [ db.collection('fm-goods').field('image,name,province_code,city_code,area_code,province_name,city_name,area_name,producer,unit,price_cost,price_original,price_sell,source_type,stock,storage,expiry,buy_min,buy_max,description,image_content').getTemp(),db.collection('opendb-city-china').field('code, name as text, eq(type, 2) as isleaf').getTemp() ],
        loadMore: {
          contentdown: '',
          contentrefresh: '',
          contentnomore: ''
        },
        options: {
          // 将scheme enum 属性静态数据中的value转成text
          ...enumConverter
        }
      }
    },
    onLoad(e) {
      this._id = e.id
    },
    onReady() {
      if (this._id) {
        this.collectionList = [ db.collection('fm-goods').where('_id=="' + this._id + '"').field('image,name,province_code,city_code,area_code,province_name,city_name,area_name,producer,unit,price_cost,price_original,price_sell,source_type,stock,storage,expiry,buy_min,buy_max,description,image_content').getTemp(),db.collection('opendb-city-china').field('code, name as text, eq(type, 2) as isleaf').getTemp() ]
      }
    },
    methods: {
      handleUpdate() {
        // 打开修改页面
        uni.navigateTo({
          url: './edit?id=' + this._id,
          events: {
            // 监听修改页面成功修改数据后, 刷新当前页面数据
            refreshData: () => {
              this.$refs.udb.loadData({
                clear: true
              })
            }
          }
        })
      },
      handleDelete() {
        this.$refs.udb.remove(this._id, {
          success: (res) => {
            // 删除数据成功后跳转到list页面
            uni.navigateTo({
              url: './list'
            })
          }
        })
      }
    }
  }
</script>

<style>
  .container {
    padding: 10px;
  }

  .btns {
    margin-top: 10px;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
  }

  .btns button {
    flex: 1;
  }

  .btn-delete {
    margin-left: 10px;
  }
</style>
