<template>
  <view class="container">
    <unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="options" :collection="collectionList" :getone="true" :manual="true">
      <view v-if="error">{{error.message}}</view>
      <view v-else-if="loading">
        <uni-load-more :contentText="loadMore" status="loading"></uni-load-more>
      </view>
      <view v-else-if="data">
        <view>
          <text>收货人姓名</text>
          <text>{{data.receive_name}}</text>
        </view>
        <view>
          <text>手机号码</text>
          <text>{{data.receive_mobile}}</text>
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
          <text>所在地区</text>
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
          <text>详细住址</text>
          <text>{{data.address}}</text>
        </view>
        <view>
          <text>full_address</text>
          <text>{{data.full_address}}</text>
        </view>
        <view>
          <text>是否为默认地址</text>
          <text>{{data.is_default == true ? '✅' : '❌'}}</text>
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
  import { enumConverter } from '@/js_sdk/validator/fm-my-address.js'
  const db = uniCloud.database()

  export default {
    data() {
      return {
        queryWhere: '',
        collectionList: [ db.collection('fm-my-address').field('receive_name,receive_mobile,province_code,city_code,area_code,province_name,city_name,area_name,address,full_address,is_default').getTemp(),db.collection('opendb-city-china').field('code, name as text, eq(type, 2) as isleaf').getTemp() ],
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
        this.collectionList = [ db.collection('fm-my-address').where('_id=="' + this._id + '"').field('receive_name,receive_mobile,province_code,city_code,area_code,province_name,city_name,area_name,address,full_address,is_default').getTemp(),db.collection('opendb-city-china').field('code, name as text, eq(type, 2) as isleaf').getTemp() ]
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
