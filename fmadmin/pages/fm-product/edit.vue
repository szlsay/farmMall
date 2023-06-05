<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="name" label="产品名称">
        <uni-easyinput placeholder="请填写产品名称" v-model="formData.name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="raw_name" label="原材料名称">
        <uni-easyinput placeholder="请填写原材料名称" v-model="formData.raw_name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="unit" label="计量单位">
        <uni-data-select placeholder="请填写计量单位" v-model="formData.unit"></uni-data-select>
      </uni-forms-item>
      <uni-forms-item name="unit_title" label="计量单位">
        <uni-easyinput placeholder="请填写计量单位" v-model="formData.unit_title"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="image" label="产品主图">
        <uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="object" v-model="formData.image"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="image_content" label="展示图片">
        <uni-file-picker file-mediatype="image" file-extname="jpg,png,webp" return-type="array" v-model="formData.image_content"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="raw_cost" label="原材料成本">
        <uni-easyinput placeholder="请填写原材料成本" type="number" v-model="formData.raw_cost"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="yield" label="出成率">
        <picker @change="pickerChange($event, 'yield')" :range="formOptions.yield_data" :value="formOptions.yield_index">
          <view>{{formOptions.yield_data[formOptions.yield_index] || "请选择..."}}</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item name="processing_cost" label="加工成本">
        <uni-easyinput placeholder="请填写加工成本" type="number" v-model="formData.processing_cost"></uni-easyinput>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/fm-product.js';

  const db = uniCloud.database();
  const dbCollectionName = 'fm-product';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.indexOf(key) > -1) {
        result[key] = validator[key]
      }
    }
    return result
  }

  function numberRange(start, end) {
    return Array.from(new Array(end + 1).keys()).slice(start);
  }

  export default {
    data() {
      let formData = {
        "name": "",
        "raw_name": "",
        "unit": "",
        "unit_title": "",
        "image": null,
        "image_content": [],
        "raw_cost": null,
        "yield": null,
        "processing_cost": null
      }
      return {
        formData,
        formOptions: {
          "yield_data": numberRange(0, 1),
          "yield_index": null
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
      pickerChange(e, name) {
        this.formOptions[name + '_index'] = e.detail.value;
        this.formData[name] = this.formOptions[name + '_data'][e.detail.value];
        this.binddata(name, this.formData[name]);
      },
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
            icon: 'none',
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
        db.collection(dbCollectionName).doc(id).field("name,raw_name,unit,unit_title,image,image_content,raw_cost,yield,processing_cost").get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
            for (let key in this.formOptions) {
              let pickerIndex = key.lastIndexOf("_index")
              if (pickerIndex > -1) {
                let fieldName = key.substring(0, pickerIndex)
                let fieldData = this.formOptions[fieldName + "_data"];
                if (data[fieldName] && fieldData && fieldData.indexOf(data[fieldName]) > -1) {
                  this.formOptions[fieldName + "_index"] = fieldData.indexOf(data[fieldName])
                }
              }
            }
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
