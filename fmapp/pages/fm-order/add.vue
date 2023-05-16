<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="oid" label="订单id">
        <uni-easyinput placeholder="订单id" v-model="formData.oid"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="create_time" label="创建时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.create_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="update_time" label="更新时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.update_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="cancel_time" label="取消时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.cancel_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="price_amount_total" label="总合计">
        <uni-easyinput placeholder="请填写总合计" type="number" v-model="formData.price_amount_total"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="state" label="订单类型">
        <uni-data-checkbox v-model="formData.state" :localdata="formOptions.state_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="order_goodslist" label="商品列表">
        <uni-data-checkbox :multiple="true" v-model="formData.order_goodslist"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="order_delivery" label="">
        <undefined v-model="formData.order_delivery"></undefined>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/fm-order.js';

  const db = uniCloud.database();
  const dbCollectionName = 'fm-order';

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
        "oid": "",
        "create_time": null,
        "update_time": null,
        "cancel_time": null,
        "price_amount_total": null,
        "state": 1,
        "order_goodslist": [],
        "order_delivery": null
      }
      return {
        formData,
        formOptions: {
          "state_localdata": [
            {
              "text": "待支付",
              "value": 1
            },
            {
              "text": "待发货",
              "value": 2
            },
            {
              "text": "待收货",
              "value": 3
            }
          ]
        },
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
