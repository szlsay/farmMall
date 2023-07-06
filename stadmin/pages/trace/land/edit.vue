<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="land_name" label="地块名称" required>
        <uni-easyinput placeholder="例如：一号地块、一号大棚" v-model="formData.land_name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="land_type" label="地块类型" required>
        <uni-easyinput placeholder="请选择地块类型" v-model="formData.land_type" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="contact_name" label="负责人姓名">
        <uni-easyinput placeholder="请输入负责人姓名" v-model="formData.contact_name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="contact_phone" label="负责人电话">
        <uni-easyinput placeholder="请输入负责人电话" v-model="formData.contact_phone" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="map_address" label="地图地址">
        <uni-easyinput placeholder="请填写地图地址" v-model="formData.map_address" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="address" label="详细地址">
        <uni-easyinput placeholder="请填写详细地址" v-model="formData.address" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="longitude" label="经度">
        <uni-easyinput placeholder="请选择经度" v-model="formData.longitude" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="latitude" label="纬度">
        <uni-easyinput placeholder="请选择纬度" v-model="formData.latitude" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="image_content" label="地块实景">
        <uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="array" v-model="formData.image_content"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="video" label="实景视频">
        <uni-file-picker file-mediatype="file" return-type="object" v-model="formData.video"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="disabled" label="是否禁用">
        <switch @change="binddata('disabled', $event.detail.value)" :checked="formData.disabled"></switch>
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
  import { validator } from '@/js_sdk/validator/st-land.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'st-land';

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
        "land_name": "",
        "land_type": "",
        "contact_name": "",
        "contact_phone": "",
        "map_address": "",
        "address": "",
        "longitude": "",
        "latitude": "",
        "image_content": [],
        "video": null,
        "disabled": false
      }
      return {
        formData,
        formOptions: {},
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
        db.collection(dbCollectionName).doc(id).field("land_name,land_type,contact_name,contact_phone,map_address,address,longitude,latitude,image_content,video,disabled").get().then((res) => {
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
