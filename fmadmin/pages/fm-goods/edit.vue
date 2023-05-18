<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="image" label="商品主图">
        <uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object" v-model="formData.image"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="name" label="商品名称">
        <uni-easyinput placeholder="请填写商品名称" v-model="formData.name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="province_code" label="省">
        <uni-easyinput placeholder="省级编码" v-model="formData.province_code"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="city_code" label="市">
        <uni-easyinput placeholder="地级编码" v-model="formData.city_code"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="area_code" label="省市区">
        <uni-data-picker self-field="code" parent-field="parent_code" v-model="formData.area_code" collection="opendb-city-china" orderby="value asc" field="code as value, name as text, eq(type, 2) as isleaf"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="province_name" label="省">
        <uni-easyinput placeholder="省级名称" v-model="formData.province_name"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="city_name" label="市">
        <uni-easyinput placeholder="地级名称" v-model="formData.city_name"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="area_name" label="区">
        <uni-easyinput placeholder="区级名称" v-model="formData.area_name"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="producer" label="商品产地">
        <uni-easyinput placeholder="请填写商品产地" v-model="formData.producer" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="unit" label="计量单位">
        <uni-data-select placeholder="请选择计量单位" v-model="formData.unit" :localdata="formOptions.unit_localdata"></uni-data-select>
      </uni-forms-item>
      <uni-forms-item name="price_cost" label="成本价">
        <uni-easyinput placeholder="请填写成本价" type="number" v-model="formData.price_cost"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="price_original" label="原价">
        <uni-easyinput placeholder="请填写原价" type="number" v-model="formData.price_original"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="price_sell" label="售价">
        <uni-easyinput placeholder="请填写售价" type="number" v-model="formData.price_sell"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="source_type" label="商品来源">
        <uni-data-checkbox v-model="formData.source_type" :localdata="formOptions.source_type_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="stock" label="库存">
        <uni-easyinput placeholder="请填写库存" type="number" v-model="formData.stock"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="storage" label="存储条件">
        <uni-easyinput placeholder="请填写存储条件" v-model="formData.storage" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="expiry" label="保质期">
        <uni-easyinput placeholder="请填写保质期" type="number" v-model="formData.expiry"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="buy_min" label="最小起购">
        <uni-easyinput placeholder="请填写最小起购" type="number" v-model="formData.buy_min"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="buy_max" label="最大起购">
        <uni-easyinput placeholder="请填写最大起购" type="number" v-model="formData.buy_max"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="description" label="商品描述">
        <uni-easyinput placeholder="请填写商品描述" v-model="formData.description" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="image_content" label="展示图片">
        <uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="array" v-model="formData.image_content"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="sku" label="商品规格">
        <uni-data-checkbox :multiple="true" v-model="formData.sku"></uni-data-checkbox>
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
  import { validator } from '../../js_sdk/validator/fm-goods.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'fm-goods';

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
        "image": null,
        "name": "",
        "province_code": "",
        "city_code": "",
        "area_code": "",
        "province_name": "",
        "city_name": "",
        "area_name": "",
        "producer": "",
        "unit": 0,
        "price_cost": null,
        "price_original": null,
        "price_sell": null,
        "source_type": 0,
        "stock": null,
        "storage": "",
        "expiry": null,
        "buy_min": null,
        "buy_max": null,
        "description": "",
        "image_content": [],
        "sku": []
      }
      return {
        formData,
        formOptions: {
          "unit_localdata": [
            {
              "text": "斤",
              "value": 0
            },
            {
              "text": "吨",
              "value": 1
            },
            {
              "text": "只",
              "value": 2
            },
            {
              "text": "袋",
              "value": 3
            },
            {
              "text": "箱",
              "value": 4
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
        db.collection(dbCollectionName).doc(id).field("image,name,province_code,city_code,area_code,province_name,city_name,area_name,producer,unit,price_cost,price_original,price_sell,source_type,stock,storage,expiry,buy_min,buy_max,description,image_content,sku").get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
            
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
