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
    "label": "套餐名称"
  },
  "unit": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "份",
            "value": 0
          },
          {
            "text": "千斤",
            "value": 1
          },
          {
            "text": "克",
            "value": 2
          },
          {
            "text": "只",
            "value": 3
          }
        ]
      }
    ],
    "label": "计量单位",
    "defaultValue": 0
  },
  "image": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "label": "套餐主图"
  },
  "image_content": {
    "rules": [
      {
        "format": "array"
      },
      {
        "arrayType": "file"
      }
    ],
    "label": "展示图片"
  },
  "sku": {
    "rules": [
      {
        "format": "array"
      },
      {
        "arrayType": "object"
      }
    ],
    "label": "套餐规格"
  },
  "price_sell": {
    "rules": [
      {
        "format": "double",
        "errorMessage": "{label}应该大于 {minimum} ，小于 {maximum} "
      },
      {
        "minimum": 0,
        "maximum": 1000000,
        "errorMessage": "{label}应该大于 {minimum} ，小于 {maximum} "
      }
    ],
    "label": "售价"
  },
  "expiry": {
    "rules": [
      {
        "format": "int",
        "errorMessage": "{label}应该大于 {minimum} ，小于 {maximum} "
      },
      {
        "minimum": 0,
        "maximum": 1000000,
        "errorMessage": "{label}应该大于 {minimum} ，小于 {maximum} "
      }
    ],
    "label": "保质期"
  },
  "reserve_begin": {
    "rules": [
      {
        "format": "date"
      }
    ],
    "label": "预定开始时间"
  },
  "reserve_end": {
    "rules": [
      {
        "format": "date"
      }
    ],
    "label": "预定结束时间"
  },
  "delivery": {
    "rules": [
      {
        "format": "object"
      }
    ],
    "label": "配送信息"
  },
  "description": {
    "rules": [
      {
        "format": "string"
      },
      {
        "maxLength": 200
      }
    ],
    "label": "产品描述"
  }
}

const enumConverter = {
  "unit_valuetotext": {
    "0": "份",
    "1": "千斤",
    "2": "克",
    "3": "只"
  }
}

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