// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "is_delete": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "label": "是否删除",
    "defaultValue": false
  },
  "image": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "label": "套餐主图"
  },
  "name": {
    "rules": [
      {
        "format": "string"
      },
      {
        "maxLength": 10
      }
    ],
    "label": "套餐"
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
            "text": "斤",
            "value": 1
          },
          {
            "text": "箱",
            "value": 2
          },
          {
            "text": "袋",
            "value": 3
          }
        ]
      }
    ],
    "label": "计量单位",
    "defaultValue": 0
  },
  "price_cost": {
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
    "label": "成本价"
  },
  "price_original": {
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
    "label": "原价"
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
  "source_type": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "库存现货",
            "value": 0
          },
          {
            "text": "预售采购",
            "value": 1
          }
        ]
      }
    ],
    "label": "商品来源",
    "defaultValue": 0
  },
  "stock": {
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
    "label": "库存"
  },
  "storage": {
    "rules": [
      {
        "format": "string"
      },
      {
        "maxLength": 200
      }
    ],
    "label": "存储条件"
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
  "buy_min": {
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
    "label": "最小起购"
  },
  "buy_max": {
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
    "label": "最大起购"
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
  "create_uid": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "创建人用户id"
  },
  "create_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "创建时间",
    "defaultValue": {
      "$env": "now"
    },
    "label": "创建时间"
  },
  "update_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "更新时间",
    "label": "更新时间"
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
  }
}

const enumConverter = {
  "unit_valuetotext": {
    "0": "份",
    "1": "斤",
    "2": "箱",
    "3": "袋"
  },
  "source_type_valuetotext": {
    "0": "库存现货",
    "1": "预售采购"
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
