// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "receive_name": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "收货人姓名"
  },
  "receive_mobile": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      },
      {
        "pattern": "^1[34578][0-9]{9}$"
      }
    ],
    "label": "手机号码"
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
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "所在地区"
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
  "address": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "详细住址"
  },
  "full_address": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "is_default": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "label": "是否为默认地址",
    "defaultValue": false
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
