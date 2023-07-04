<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="label" label="标题">
        <uni-easyinput placeholder="请输入标题" v-model="formData.label"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="image" label="类型图标">
        <uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object" v-model="formData.image"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="disabled" label="是否禁用">
        <switch @change="binddata('disabled', $event.detail.value)" :checked="formData.disabled"></switch>
      </uni-forms-item>
      <uni-forms-item name="parent_id" label="父类ID">
        <uni-easyinput placeholder="父类ID，系统自动生成" v-model="formData.parent_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="level" label="级别">
        <uni-easyinput placeholder="级别，系统自动生成" type="number" v-model="formData.level"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="pinyin" label="中文拼音">
        <uni-easyinput placeholder="中文拼音，系统自动生成" v-model="formData.pinyin"></uni-easyinput>
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
  import { validator } from '@/js_sdk/validator/st-product-cate.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'st-product-cate';

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
        "label": "",
        "image": null,
        "disabled": "false",
        "parent_id": "",
        "level": null,
        "pinyin": ""
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
