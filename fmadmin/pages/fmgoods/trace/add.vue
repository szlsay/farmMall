<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="name" label="商品名称">
        <uni-easyinput placeholder="请填写商品名称" v-model="formData.name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="made_company" label="生产企业" required>
        <uni-easyinput placeholder="请填写生产企业" v-model="formData.made_company" trim="both"></uni-easyinput>
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
      <uni-forms-item name="made_address" label="生产地址">
        <uni-easyinput placeholder="请填写生产地址" v-model="formData.made_address" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="create_time" label="生产批次" required>
        <uni-datetime-picker return-type="timestamp" v-model="formData.create_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="expire_time" label="有效期至">
        <uni-datetime-picker return-type="timestamp" v-model="formData.expire_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="image_produce" label="生产许可证">
        <uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object" v-model="formData.image_produce"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="image_report" label="质检报告">
        <uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object" v-model="formData.image_report"></uni-file-picker>
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
  import { validator } from '@/js_sdk/validator/fm-goods-trace.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'fm-goods-trace';

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
        "made_company": "",
        "province_code": "",
        "city_code": "",
        "area_code": "",
        "province_name": "",
        "city_name": "",
        "area_name": "",
        "made_address": "",
        "create_time": null,
        "expire_time": null,
        "image_produce": null,
        "image_report": null
      }
      return {
        formData,
        formOptions: {},
        rules: {
          ...getValidator(Object.keys(formData))
        }
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
        return db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      }
    }
  }
</script>
