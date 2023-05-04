<template>
  <view class="container">
    <unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}" :collection="collectionList">
      <view v-if="error">{{error.message}}</view>
      <view v-else-if="data">
        <uni-list>
          <uni-list-item v-for="(item, index) in data" :key="index" showArrow :clickable="true" @click="handleItemClick(item._id)">
            <template v-slot:body>
              <text>
                <!-- 此处默认显示为_id，请根据需要自行修改为其他字段 -->
                <!-- 如果使用了联表查询，请参考生成的 admin 项目中 list.vue 页面 -->
                {{item._id}}
              </text>
            </template>
          </uni-list-item>
        </uni-list>
      </view>
      <uni-load-more :status="loading?'loading':(hasMore ? 'more' : 'noMore')"></uni-load-more>
    </unicloud-db>
		<view class="footer">
			<view class="btn-add" @click="onClickAdd">
				新增收货地址
			</view>
		</view>
    <!-- <uni-fab ref="fab" horizontal="right" vertical="bottom" :pop-menu="false" @fabClick="fabClick" /> -->
  </view>
</template>

<script>
  const db = uniCloud.database()
  export default {
    data() {
      return {
        collectionList: [ db.collection('fm-my-address').field('receive_name,receive_mobile,province_code,city_code,area_code,province_name,city_name,area_name,address,full_address,is_default').getTemp(),db.collection('opendb-city-china').field('code, name as text, eq(type, 2) as isleaf').getTemp() ],
        loadMore: {
          contentdown: '',
          contentrefresh: '',
          contentnomore: ''
        }
      }
    },
    onPullDownRefresh() {
      this.$refs.udb.loadData({
        clear: true
      }, () => {
        uni.stopPullDownRefresh()
      })
    },
    onReachBottom() {
      this.$refs.udb.loadMore()
    },
    methods: {
      handleItemClick(id) {
        uni.navigateTo({
          url: './detail?id=' + id
        })
      },
      onClickAdd() {
        // 打开新增页面
        uni.navigateTo({
          url: './add',
          events: {
            // 监听新增数据成功后, 刷新当前页面数据
            refreshData: () => {
              this.$refs.udb.loadData({
                clear: true
              })
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
	.footer{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 10rpx 32rpx 10rpx;
		background-color: white;
		.btn-add{
			width: 100%;
			height: 80rpx;
			background-color: #00CC99;
			border-radius: 40rpx;
			color: white;
			text-align: center;
			line-height: 80rpx;
		}
	}
</style>
