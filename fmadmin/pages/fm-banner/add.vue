<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="image" label="广告图片" required>
        <uni-file-picker file-mediatype="image" file-extname="jpeg,jpg,png,webp" return-type="object" v-model="formData.image"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="title" label="标题">
        <uni-easyinput placeholder="请填写标题" v-model="formData.title" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="sort" label="排序">
        <uni-easyinput placeholder="数字越小，排序越前" type="number" v-model="formData.sort"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="status" label="生效状态">
        <switch @change="binddata('status', $event.detail.value)" :checked="formData.status"></switch>
      </uni-forms-item>
      <uni-forms-item name="type" label="类型">
        <uni-easyinput placeholder="请选择类型" v-model="formData.type"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="value" label="目标值">
        <uni-easyinput placeholder="请填写目标值" v-model="formData.value"></uni-easyinput>
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
  import { validator } from '../../js_sdk/validator/fm-banner.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'fm-banner';

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
        "title": "",
        "sort": null,
        "status": true,
        "type": "",
        "value": ""
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
