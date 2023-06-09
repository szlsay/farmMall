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
      <unicloud-db ref="udb" :collection="collectionList" field="name,raw_name,unit,unit_title,image,image_content,raw_cost,yield_ratio,processing_cost,finish_cost,transport_cost,reproduct_cost,sideline_income,quality_ratio,sum_cost,fixed_ratio,market_price,pack_fee,delivery_fee,branch_fee,market_fee,platform_fee,gp_price,product_bonus,market_bonus,develop_bonus,ni_price" :where="where" page-data="replace"
        :orderby="orderby" :getcount="true" :page-size="options.pageSize" :page-current="options.pageCurrent"
        v-slot:default="{data,pagination,loading,error,options}" :options="options" loadtime="manual" @load="onqueryload">
        <uni-table ref="table" :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe type="selection" @selection-change="selectionChange">
          <uni-tr>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'name')" sortable @sort-change="sortChange($event, 'name')">产品名称</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'raw_name')" sortable @sort-change="sortChange($event, 'raw_name')">原材料名称</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'unit')" sortable @sort-change="sortChange($event, 'unit')">计量单位</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'unit_title')" sortable @sort-change="sortChange($event, 'unit_title')">计量单位</uni-th>
            <uni-th align="center" sortable @sort-change="sortChange($event, 'image')">产品主图</uni-th>
            <uni-th align="center" sortable @sort-change="sortChange($event, 'image_content')">展示图片</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'raw_cost')" sortable @sort-change="sortChange($event, 'raw_cost')">原材料成本</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'yield_ratio')" sortable @sort-change="sortChange($event, 'yield_ratio')">出成率</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'processing_cost')" sortable @sort-change="sortChange($event, 'processing_cost')">加工成本</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'finish_cost')" sortable @sort-change="sortChange($event, 'finish_cost')">成品成本</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'transport_cost')" sortable @sort-change="sortChange($event, 'transport_cost')">运储成本</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'reproduct_cost')" sortable @sort-change="sortChange($event, 'reproduct_cost')">再生产成本</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'sideline_income')" sortable @sort-change="sortChange($event, 'sideline_income')">副产品收入</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'quality_ratio')" sortable @sort-change="sortChange($event, 'quality_ratio')">质信金</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'sum_cost')" sortable @sort-change="sortChange($event, 'sum_cost')">成本小计</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'fixed_ratio')" sortable @sort-change="sortChange($event, 'fixed_ratio')">定倍率</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'market_price')" sortable @sort-change="sortChange($event, 'market_price')">营销价格</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'pack_fee')" sortable @sort-change="sortChange($event, 'pack_fee')">包装费</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'delivery_fee')" sortable @sort-change="sortChange($event, 'delivery_fee')">配送费</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'branch_fee')" sortable @sort-change="sortChange($event, 'branch_fee')">网点提成</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'market_fee')" sortable @sort-change="sortChange($event, 'market_fee')">营销费</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'platform_fee')" sortable @sort-change="sortChange($event, 'platform_fee')">平台佣金</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'gp_price')" sortable @sort-change="sortChange($event, 'gp_price')">毛利润</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'product_bonus')" sortable @sort-change="sortChange($event, 'product_bonus')">生产奖励</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'market_bonus')" sortable @sort-change="sortChange($event, 'market_bonus')">营销奖励</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'develop_bonus')" sortable @sort-change="sortChange($event, 'develop_bonus')">发展基金</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'ni_price')" sortable @sort-change="sortChange($event, 'ni_price')">净利润</uni-th>
            <uni-th align="center">操作</uni-th>
          </uni-tr>
          <uni-tr v-for="(item,index) in data" :key="index">
            <uni-td align="center">{{item.name}}</uni-td>
            <uni-td align="center">{{item.raw_name}}</uni-td>
            <uni-td align="center">{{item.unit}}</uni-td>
            <uni-td align="center">{{item.unit_title}}</uni-td>
            <uni-td align="center">
              <uni-file-picker v-if="item.image && item.image.fileType == 'image'" :value="item.image" :file-mediatype="item.image && item.image.fileType" return-type="object" :imageStyles="imageStyles" readonly></uni-file-picker>
              <uni-link v-else :href="item.image && item.image.url" :text="item.image && item.image.url"></uni-link>
            </uni-td>
            <uni-td align="center">
              <template v-for="(file, j) in item.image_content">
                <uni-file-picker v-if="file.fileType == 'image'" :value="file" :file-mediatype="file.fileType" :imageStyles="imageStyles" readonly></uni-file-picker>
                <uni-link v-else :href="file.url" :text="file.url"></uni-link>
              </template>
            </uni-td>
            <uni-td align="center">{{item.raw_cost}}</uni-td>
            <uni-td align="center">{{item.yield_ratio}}</uni-td>
            <uni-td align="center">{{item.processing_cost}}</uni-td>
            <uni-td align="center">{{item.finish_cost}}</uni-td>
            <uni-td align="center">{{item.transport_cost}}</uni-td>
            <uni-td align="center">{{item.reproduct_cost}}</uni-td>
            <uni-td align="center">{{item.sideline_income}}</uni-td>
            <uni-td align="center">{{item.quality_ratio}}</uni-td>
            <uni-td align="center">{{item.sum_cost}}</uni-td>
            <uni-td align="center">{{item.fixed_ratio}}</uni-td>
            <uni-td align="center">{{item.market_price}}</uni-td>
            <uni-td align="center">{{item.pack_fee}}</uni-td>
            <uni-td align="center">{{item.delivery_fee}}</uni-td>
            <uni-td align="center">{{item.branch_fee}}</uni-td>
            <uni-td align="center">{{item.market_fee}}</uni-td>
            <uni-td align="center">{{item.platform_fee}}</uni-td>
            <uni-td align="center">{{item.gp_price}}</uni-td>
            <uni-td align="center">{{item.product_bonus}}</uni-td>
            <uni-td align="center">{{item.market_bonus}}</uni-td>
            <uni-td align="center">{{item.develop_bonus}}</uni-td>
            <uni-td align="center">{{item.ni_price}}</uni-td>
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
  import { enumConverter, filterToWhere } from '../../js_sdk/validator/fm-product.js';

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
          filterData: {
            "yield_ratio_data": numberRange(0, 1),
            "yield_ratio_index": null,
            "quality_ratio_data": numberRange(0, 1),
            "quality_ratio_index": null,
            "fixed_ratio_data": numberRange(0, 10),
            "fixed_ratio_index": null,
            "platform_fee_data": numberRange(0, 1),
            "platform_fee_index": null
          },
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
            "计量单位": "unit_title",
            "产品主图": "image",
            "展示图片": "image_content",
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
