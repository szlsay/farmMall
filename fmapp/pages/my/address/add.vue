<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="receive_name" label="收货人姓名" required>
        <uni-easyinput placeholder="收货人姓名" v-model="formData.receive_name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="receive_mobile" label="手机号码" required>
        <uni-easyinput placeholder="手机号码" v-model="formData.receive_mobile" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="province_code" label="省">
        <uni-easyinput placeholder="省级编码" v-model="formData.province_code"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="city_code" label="市">
        <uni-easyinput placeholder="地级编码" v-model="formData.city_code"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="area_code" label="所在地区" required>
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
      <uni-forms-item name="address" label="详细住址" required>
        <uni-easyinput placeholder="省市区后面的详细住址，包含街道小区房间号" v-model="formData.address" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="full_address" label="">
        <uni-easyinput placeholder="完整地址信息，包括省市区及街道小区房间号" v-model="formData.full_address" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="is_default" label="是否为默认地址">
        <switch @change="binddata('is_default', $event.detail.value)" :checked="formData.is_default"></switch>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '@/js_sdk/validator/fm-my-address.js';

  const db = uniCloud.database();
  const dbCollectionName = 'fm-my-address';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.indexOf(key) > -1) {
        result[key] = validator[key]
      }
    }
    return result
  }

  

  export default {
    data() {
      let formData = {
        "receive_name": "",
        "receive_mobile": "",
        "province_code": "",
        "city_code": "",
        "area_code": "",
        "province_name": "",
        "city_name": "",
        "area_name": "",
        "address": "",
        "full_address": "",
        "is_default": false
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
            icon: 'none',
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

<style>
  .uni-container {
    padding: 15px;
  }

  .uni-input-border,
  .uni-textarea-border {
    width: 100%;
    font-size: 14px;
    color: #666;
    border: 1px #e5e5e5 solid;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .uni-input-border {
    padding: 0 10px;
    height: 35px;

  }

  .uni-textarea-border {
    padding: 10px;
    height: 80px;
  }

  .uni-button-group {
    margin-top: 50px;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    justify-content: center;
  }

  .uni-button {
    width: 184px;
  }
</style>
