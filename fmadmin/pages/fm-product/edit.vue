<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="name" label="产品名称">
        <uni-easyinput placeholder="请填写产品名称" v-model="formData.name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="raw_name" label="原材料名称">
        <uni-easyinput placeholder="请填写原材料名称" v-model="formData.raw_name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="unit" label="计量单位">
        <uni-data-select placeholder="请填写计量单位" v-model="formData.unit"></uni-data-select>
      </uni-forms-item>
      <uni-forms-item name="unit_title" label="计量单位">
        <uni-easyinput placeholder="请填写计量单位" v-model="formData.unit_title"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="image" label="产品主图">
        <uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object" v-model="formData.image"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="image_content" label="展示图片">
        <uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="array" v-model="formData.image_content"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="raw_cost" label="原材料成本">
        <uni-easyinput placeholder="请填写原材料成本" type="number" v-model="formData.raw_cost"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="yield_ratio" label="出成率">
        <picker @change="pickerChange($event, 'yield_ratio')" :range="formOptions.yield_ratio_data" :value="formOptions.yield_ratio_index">
          <view>{{formOptions.yield_ratio_data[formOptions.yield_ratio_index] || "请选择..."}}</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item name="processing_cost" label="加工成本">
        <uni-easyinput placeholder="请填写加工成本" type="number" v-model="formData.processing_cost"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="finish_cost" label="成品成本">
        <uni-easyinput placeholder="请填写成品成本" type="number" v-model="formData.finish_cost"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="transport_cost" label="运储成本">
        <uni-easyinput placeholder="请填写运储成本" type="number" v-model="formData.transport_cost"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="reproduct_cost" label="再生产成本">
        <uni-easyinput placeholder="请填写再生产成本" type="number" v-model="formData.reproduct_cost"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="sideline_income" label="副产品收入">
        <uni-easyinput placeholder="请填写副产品收入" type="number" v-model="formData.sideline_income"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="quality_ratio" label="质信金">
        <picker @change="pickerChange($event, 'quality_ratio')" :range="formOptions.quality_ratio_data" :value="formOptions.quality_ratio_index">
          <view>{{formOptions.quality_ratio_data[formOptions.quality_ratio_index] || "请选择..."}}</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item name="sum_cost" label="成本小计">
        <uni-easyinput placeholder="请填写成本小计" type="number" v-model="formData.sum_cost"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="fixed_ratio" label="定倍率">
        <picker @change="pickerChange($event, 'fixed_ratio')" :range="formOptions.fixed_ratio_data" :value="formOptions.fixed_ratio_index">
          <view>{{formOptions.fixed_ratio_data[formOptions.fixed_ratio_index] || "请选择..."}}</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item name="market_price" label="营销价格">
        <uni-easyinput placeholder="请填写营销价格" type="number" v-model="formData.market_price"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="pack_fee" label="包装费">
        <uni-easyinput placeholder="请填写包装费" type="number" v-model="formData.pack_fee"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="delivery_fee" label="配送费">
        <uni-easyinput placeholder="请填写配送费" type="number" v-model="formData.delivery_fee"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="branch_fee" label="网点提成">
        <uni-easyinput placeholder="请填写网点提成" type="number" v-model="formData.branch_fee"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="market_fee" label="营销费">
        <uni-easyinput placeholder="请填写营销费" type="number" v-model="formData.market_fee"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="platform_fee" label="平台佣金">
        <picker @change="pickerChange($event, 'platform_fee')" :range="formOptions.platform_fee_data" :value="formOptions.platform_fee_index">
          <view>{{formOptions.platform_fee_data[formOptions.platform_fee_index] || "请选择..."}}</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item name="gp_ratio" label="毛利润">
        <picker @change="pickerChange($event, 'gp_ratio')" :range="formOptions.gp_ratio_data" :value="formOptions.gp_ratio_index">
          <view>{{formOptions.gp_ratio_data[formOptions.gp_ratio_index] || "请选择..."}}</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item name="product_ratio" label="生产奖励">
        <picker @change="pickerChange($event, 'product_ratio')" :range="formOptions.product_ratio_data" :value="formOptions.product_ratio_index">
          <view>{{formOptions.product_ratio_data[formOptions.product_ratio_index] || "请选择..."}}</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item name="market_ratio" label="营销奖励">
        <picker @change="pickerChange($event, 'market_ratio')" :range="formOptions.market_ratio_data" :value="formOptions.market_ratio_index">
          <view>{{formOptions.market_ratio_data[formOptions.market_ratio_index] || "请选择..."}}</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item name="develop_ratio" label="发展基金">
        <picker @change="pickerChange($event, 'develop_ratio')" :range="formOptions.develop_ratio_data" :value="formOptions.develop_ratio_index">
          <view>{{formOptions.develop_ratio_data[formOptions.develop_ratio_index] || "请选择..."}}</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item name="ni_ratio" label="净利润">
        <picker @change="pickerChange($event, 'ni_ratio')" :range="formOptions.ni_ratio_data" :value="formOptions.ni_ratio_index">
          <view>{{formOptions.ni_ratio_data[formOptions.ni_ratio_index] || "请选择..."}}</view>
        </picker>
      </uni-forms-item>
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
  import { validator } from '../../js_sdk/validator/fm-product.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'fm-product';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.includes(key)) {
        result[key] = validator[key]
      }
    }
    return result
  }

  function numberRange(start, end) {
    return Array.from(new Array(end + 1).keys()).slice(start);
  }

  export default {
    data() {
      let formData = {
        "name": "",
        "raw_name": "",
        "unit": "",
        "unit_title": "",
        "image": null,
        "image_content": [],
        "raw_cost": 0,
        "yield_ratio": 0,
        "processing_cost": 0,
        "finish_cost": 0,
        "transport_cost": 0,
        "reproduct_cost": 0,
        "sideline_income": 0,
        "quality_ratio": 0,
        "sum_cost": 0,
        "fixed_ratio": 0,
        "market_price": 0,
        "pack_fee": 0,
        "delivery_fee": 0,
        "branch_fee": 0,
        "market_fee": 0,
        "platform_fee": 0.05,
        "gp_ratio": null,
        "product_ratio": 0,
        "market_ratio": 0,
        "develop_ratio": 0,
        "ni_ratio": null
      }
      return {
        formData,
        formOptions: {
          "yield_ratio_data": numberRange(0, 1),
          "yield_ratio_index": null,
          "quality_ratio_data": numberRange(0, 1),
          "quality_ratio_index": null,
          "fixed_ratio_data": numberRange(0, 1),
          "fixed_ratio_index": null,
          "platform_fee_data": numberRange(0, 1),
          "platform_fee_index": 0.05,
          "gp_ratio_data": numberRange(0, 1),
          "gp_ratio_index": null,
          "product_ratio_data": numberRange(0, 1),
          "product_ratio_index": null,
          "market_ratio_data": numberRange(0, 1),
          "market_ratio_index": null,
          "develop_ratio_data": numberRange(0, 1),
          "develop_ratio_index": null,
          "ni_ratio_data": numberRange(0, 1),
          "ni_ratio_index": null
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
      pickerChange(e, name) {
        this.formOptions[name + '_index'] = e.detail.value;
        this.formData[name] = this.formOptions[name + '_data'][e.detail.value];
        this.binddata(name, this.formData[name]);
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
        db.collection(dbCollectionName).doc(id).field("name,raw_name,unit,unit_title,image,image_content,raw_cost,yield_ratio,processing_cost,finish_cost,transport_cost,reproduct_cost,sideline_income,quality_ratio,sum_cost,fixed_ratio,market_price,pack_fee,delivery_fee,branch_fee,market_fee,platform_fee,gp_ratio,product_ratio,market_ratio,develop_ratio,ni_ratio").get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
            for (let key in this.formOptions) {
              let pickerIndex = key.lastIndexOf("_index")
              if (pickerIndex > -1) {
                let fieldName = key.substring(0, pickerIndex)
                let fieldData = this.formOptions[fieldName + "_data"];
                if (data[fieldName] && fieldData && fieldData.indexOf(data[fieldName]) > -1) {
                  this.formOptions[fieldName + "_index"] = fieldData.indexOf(data[fieldName])
                }
              }
            }
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
