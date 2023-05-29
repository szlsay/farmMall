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
        <button class="uni-button" type="default" size="mini" :disabled="!selectedIndexs.length" @click="delTable">批量删除</button>
        <download-excel class="hide-on-phone" :fields="exportExcel.fields" :data="exportExcelData" :type="exportExcel.type" :name="exportExcel.filename">
          <button class="uni-button" type="primary" size="mini">导出 Excel</button>
        </download-excel>
      </view>
    </view>
    <view class="uni-container">
      <unicloud-db ref="udb" :collection="collectionList" field="is_delete,image,name,unit,price_cost,price_original,price_sell,source_type,stock,storage,expiry,buy_min,buy_max,description,image_content,create_uid,create_time,update_time,sku" :where="where" page-data="replace"
        :orderby="orderby" :getcount="true" :page-size="options.pageSize" :page-current="options.pageCurrent"
        v-slot:default="{data,pagination,loading,error,options}" :options="options" loadtime="manual" @load="onqueryload">
        <uni-table ref="table" :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe type="selection" @selection-change="selectionChange">
          <uni-tr>
            <uni-th align="center" sortable @sort-change="sortChange($event, 'is_delete')">是否删除</uni-th>
            <uni-th align="center" sortable @sort-change="sortChange($event, 'image')">套餐主图</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'name')" sortable @sort-change="sortChange($event, 'name')">套餐</uni-th>
            <uni-th align="center" filter-type="select" :filter-data="options.filterData.unit_localdata" @filter-change="filterChange($event, 'unit')">计量单位</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'price_cost')" sortable @sort-change="sortChange($event, 'price_cost')">成本价</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'price_original')" sortable @sort-change="sortChange($event, 'price_original')">原价</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'price_sell')" sortable @sort-change="sortChange($event, 'price_sell')">售价</uni-th>
            <uni-th align="center" filter-type="select" :filter-data="options.filterData.source_type_localdata" @filter-change="filterChange($event, 'source_type')">商品来源</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'stock')" sortable @sort-change="sortChange($event, 'stock')">库存</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'storage')" sortable @sort-change="sortChange($event, 'storage')">存储条件</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'expiry')" sortable @sort-change="sortChange($event, 'expiry')">保质期</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'buy_min')" sortable @sort-change="sortChange($event, 'buy_min')">最小起购</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'buy_max')" sortable @sort-change="sortChange($event, 'buy_max')">最大起购</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'description')" sortable @sort-change="sortChange($event, 'description')">产品描述</uni-th>
            <uni-th align="center" sortable @sort-change="sortChange($event, 'image_content')">展示图片</uni-th>
            <uni-th align="center" sortable @sort-change="sortChange($event, 'create_uid')">创建人用户id</uni-th>
            <uni-th align="center" filter-type="timestamp" @filter-change="filterChange($event, 'create_time')" sortable @sort-change="sortChange($event, 'create_time')">创建时间</uni-th>
            <uni-th align="center" filter-type="timestamp" @filter-change="filterChange($event, 'update_time')" sortable @sort-change="sortChange($event, 'update_time')">更新时间</uni-th>
            <uni-th align="center" sortable @sort-change="sortChange($event, 'sku')">套餐规格</uni-th>
            <uni-th align="center">操作</uni-th>
          </uni-tr>
          <uni-tr v-for="(item,index) in data" :key="index">
            <uni-td align="center">{{item.is_delete == true ? '✅' : '❌'}}</uni-td>
            <uni-td align="center">
              <uni-file-picker v-if="item.image && item.image.fileType == 'image'" :value="item.image" :file-mediatype="item.image && item.image.fileType" return-type="object" :imageStyles="imageStyles" readonly></uni-file-picker>
              <uni-link v-else :href="item.image && item.image.url" :text="item.image && item.image.url"></uni-link>
            </uni-td>
            <uni-td align="center">{{item.name}}</uni-td>
            <uni-td align="center">{{options.unit_valuetotext[item.unit]}}</uni-td>
            <uni-td align="center">{{item.price_cost}}</uni-td>
            <uni-td align="center">{{item.price_original}}</uni-td>
            <uni-td align="center">{{item.price_sell}}</uni-td>
            <uni-td align="center">{{options.source_type_valuetotext[item.source_type]}}</uni-td>
            <uni-td align="center">{{item.stock}}</uni-td>
            <uni-td align="center">{{item.storage}}</uni-td>
            <uni-td align="center">{{item.expiry}}</uni-td>
            <uni-td align="center">{{item.buy_min}}</uni-td>
            <uni-td align="center">{{item.buy_max}}</uni-td>
            <uni-td align="center">{{item.description}}</uni-td>
            <uni-td align="center">
              <template v-for="(file, j) in item.image_content">
                <uni-file-picker v-if="file.fileType == 'image'" :value="file" :file-mediatype="file.fileType" :imageStyles="imageStyles" readonly></uni-file-picker>
                <uni-link v-else :href="file.url" :text="file.url"></uni-link>
              </template>
            </uni-td>
            <uni-td align="center">{{item.create_uid}}</uni-td>
            <uni-td align="center">
              <uni-dateformat :threshold="[0, 0]" :date="item.create_time"></uni-dateformat>
            </uni-td>
            <uni-td align="center">
              <uni-dateformat :threshold="[0, 0]" :date="item.update_time"></uni-dateformat>
            </uni-td>
            <uni-td align="center">{{item.sku}}</uni-td>
            <uni-td align="center">
              <view class="uni-group">
                <button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini" type="primary">修改</button>
                <button @click="confirmDelete(item._id)" class="uni-button" size="mini" type="warn">删除</button>
              </view>
            </uni-td>
          </uni-tr>
        </uni-table>
        <view class="uni-pagination-box">
          <uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current" :total="pagination.count" @change="onPageChanged" />
        </view>
      </unicloud-db>
    </view>
  </view>
</template>

<script>
  import { enumConverter, filterToWhere } from '../../js_sdk/validator/fm-combo.js';

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
        collectionList: "fm-combo",
        query: '',
        where: '',
        orderby: dbOrderBy,
        orderByFieldName: "",
        selectedIndexs: [],
        options: {
          pageSize,
          pageCurrent,
          filterData: {
            "unit_localdata": [
              {
                "text": "份",
                "value": 0
              },
              {
                "text": "斤",
                "value": 1
              },
              {
                "text": "箱",
                "value": 2
              },
              {
                "text": "袋",
                "value": 3
              }
            ],
            "source_type_localdata": [
              {
                "text": "库存现货",
                "value": 0
              },
              {
                "text": "预售采购",
                "value": 1
              }
            ]
          },
          ...enumConverter
        },
        imageStyles: {
          width: 64,
          height: 64
        },
        exportExcel: {
          "filename": "fm-combo.xls",
          "type": "xls",
          "fields": {
            "是否删除": "is_delete",
            "套餐主图": "image",
            "套餐": "name",
            "计量单位": "unit",
            "成本价": "price_cost",
            "原价": "price_original",
            "售价": "price_sell",
            "商品来源": "source_type",
            "库存": "stock",
            "存储条件": "storage",
            "保质期": "expiry",
            "最小起购": "buy_min",
            "最大起购": "buy_max",
            "产品描述": "description",
            "展示图片": "image_content",
            "创建人用户id": "create_uid",
            "创建时间": "create_time",
            "更新时间": "update_time",
            "套餐规格": "sku"
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
          success:(res) => {
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
          success:(res) => {
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
