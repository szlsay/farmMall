// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "name": {
    "rules": [
      {
        "format": "string"
      },
      {
        "maxLength": 10
      }
    ],
    "label": "商品名称"
  },
  "made_company": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      },
      {
        "maxLength": 50
      }
    ],
    "label": "生产企业"
  },
  "province_code": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "省"
  },
  "city_code": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "市"
  },
  "area_code": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "省市区"
  },
  "province_name": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "省"
  },
  "city_name": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "市"
  },
  "area_name": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "区"
  },
  "made_address": {
    "rules": [
      {
        "format": "string"
      },
      {
        "maxLength": 50
      }
    ],
    "label": "生产地址"
  },
  "create_time": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "timestamp"
      }
    ],
    "label": "生产批次"
  },
  "expire_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "有效期至",
    "label": "有效期至"
  },
  "image_produce": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "label": "生产许可证"
  },
  "image_report": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "label": "质检报告"
  }
}

const enumConverter = {}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
