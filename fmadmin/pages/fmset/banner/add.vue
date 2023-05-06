<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="image" label="广告图片" required :label-width="labelWidth" label-align="right">
        <uni-file-picker file-mediatype="image" file-extname="jpeg,jpg,png,webp" return-type="object" v-model="formData.image" :image-styles="imageStyles"></uni-file-picker>
								<text style="color: red; font-size: 14px;">请选择上传尺寸600*300，格式jpeg、jpg、png、webp，小于100KB的图片</text>
      </uni-forms-item>
      <uni-forms-item name="open_url" label="目标地址" :label-width="labelWidth" label-align="right">
        <uni-easyinput placeholder="点击跳转目标地址。如果是web地址则使用内置web-view打开；如果是本地页面则跳转本地页面；如果是schema地址则打开本地的app" v-model="formData.open_url" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="title" label="标题" :label-width="labelWidth" label-align="right">
        <uni-easyinput placeholder="请填写标题" v-model="formData.title" trim="both" maxlength="20"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="sort" label="排序" :label-width="labelWidth" label-align="right">
        <uni-easyinput placeholder="数字越小，排序越前" type="number" v-model="formData.sort"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="status" label="生效状态" :label-width="labelWidth" label-align="right">
        <switch @change="binddata('status', $event.detail.value)" :checked="formData.status"></switch>
      </uni-forms-item>
      <uni-forms-item name="description" label="备注" :label-width="labelWidth" label-align="right">
        <uni-easyinput type="textarea" placeholder="请填写备注" v-model="formData.description" trim="both"  maxlength="100"></uni-easyinput>
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
  import { validator } from '@/js_sdk/validator/fm-banner.js';

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
        "open_url": "",
        "title": "",
        "sort": null,
        "status": false,
        "description": ""
      }
      return {
				labelWidth: 80,
				imageStyles: {
					width: 300,
					height: 150,
				},
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
