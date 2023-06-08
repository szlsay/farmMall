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
      <uni-forms-item name="yield_cost" label="出成率">
        <picker @change="pickerChange($event, 'yield_cost')" :range="formOptions.yield_cost_data" :value="formOptions.yield_cost_index">
          <view>{{formOptions.yield_cost_data[formOptions.yield_cost_index] || "请选择..."}}</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item name="processing_cost" label="加工成本">
        <uni-easyinput placeholder="请填写加工成本" type="number" v-model="formData.processing_cost"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="finish_cost" label="成品成本">
        <uni-easyinput placeholder="请填写成品成本" type="number" v-model="formData.finish_cost"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="transport_cose" label="运储成本">
        <uni-easyinput placeholder="请填写运储成本" type="number" v-model="formData.transport_cose"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="reproduct_cose" label="再生产成本">
        <uni-easyinput placeholder="请填写再生产成本" type="number" v-model="formData.reproduct_cose"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="sideline_income" label="副产品收入">
        <uni-easyinput placeholder="请填写副产品收入" type="number" v-model="formData.sideline_income"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="quality_fund" label="质信金">
        <picker @change="pickerChange($event, 'quality_fund')" :range="formOptions.quality_fund_data" :value="formOptions.quality_fund_index">
          <view>{{formOptions.quality_fund_data[formOptions.quality_fund_index] || "请选择..."}}</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item name="sum_cose" label="成本小计">
        <uni-easyinput placeholder="请填写成本小计" type="number" v-model="formData.sum_cose"></uni-easyinput>
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
        "yield_cost": 0,
        "processing_cost": 0,
        "finish_cost": 0,
        "transport_cose": 0,
        "reproduct_cose": 0,
        "sideline_income": 0,
        "quality_fund": 0,
        "sum_cose": 0
      }
      return {
        formData,
        formOptions: {
          "yield_cost_data": numberRange(0, 1),
          "yield_cost_index": null,
          "quality_fund_data": numberRange(0, 1),
          "quality_fund_index": null
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
        db.collection(dbCollectionName).doc(id).field("name,raw_name,unit,unit_title,image,image_content,raw_cost,yield_cost,processing_cost,finish_cost,transport_cose,reproduct_cose,sideline_income,quality_fund,sum_cose").get().then((res) => {
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
