<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="crop_name" label="品种名称">
        <uni-easyinput placeholder="请输入品种名称" v-model="formData.crop_name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="cate_id" label="种类" required>
        <uni-easyinput placeholder="请选择种类" v-model="formData.cate_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="land_id" label="地块" required>
        <uni-easyinput placeholder="请选择地块" v-model="formData.land_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="standard_type" label="种植标准" required>
        <uni-easyinput placeholder="请选择种植标准" v-model="formData.standard_type"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="plant_num" label="数量">
        <uni-easyinput placeholder="请输入数量" type="number" v-model="formData.plant_num"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="plant_start_time" label="开始时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.plant_start_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="pick_time" label="收获时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.pick_time"></uni-datetime-picker>
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
  import { validator } from '@/js_sdk/validator/st-crop.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'st-crop';

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
        "crop_name": "",
        "cate_id": "",
        "land_id": "",
        "standard_type": "",
        "plant_num": null,
        "plant_start_time": null,
        "pick_time": null
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
