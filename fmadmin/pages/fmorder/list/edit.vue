<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="oid" label="订单id">
        <uni-easyinput placeholder="订单id" v-model="formData.oid"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="uid" label="用户id">
        <uni-easyinput placeholder="用户的唯一id" v-model="formData.uid"></uni-easyinput>
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
      <uni-forms-item name="order_delivery" label="">
        <undefined v-model="formData.order_delivery"></undefined>
      </uni-forms-item>
      <uni-forms-item name="order_goodslist" label="商品列表">
        <uni-data-checkbox :multiple="true" v-model="formData.order_goodslist"></uni-data-checkbox>
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
  import { validator } from '@/js_sdk/validator/fm-order.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'fm-order';

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
        "oid": "",
        "uid": "",
        "create_time": null,
        "update_time": null,
        "cancel_time": null,
        "price_amount_total": null,
        "state": 1,
        "order_delivery": null,
        "order_goodslist": []
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
        db.collection(dbCollectionName).doc(id).field("oid,uid,create_time,update_time,cancel_time,price_amount_total,state,order_delivery,order_goodslist").get().then((res) => {
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
