// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "oid": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "订单id"
  },
  "create_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "label": "创建时间"
  },
  "update_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "label": "更新时间"
  },
  "cancel_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "label": "取消时间"
  },
  "price_amount_total": {
    "rules": [
      {
        "format": "double"
      }
    ],
    "label": "总合计"
  },
  "state": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "待支付",
            "value": 1
          },
          {
            "text": "待发货",
            "value": 2
          },
          {
            "text": "待收货",
            "value": 3
          }
        ]
      }
    ],
    "title": "订单类型",
    "defaultValue": 1,
    "label": "订单类型"
  },
  "order_goodslist": {
    "rules": [
      {
        "format": "array"
      },
      {
        "arrayType": "object"
      }
    ],
    "label": "商品列表"
  },
  "order_delivery": {
    "rules": [
      {
        "format": "object"
      }
    ]
  }
}

const enumConverter = {
  "state_valuetotext": {
    "1": "待支付",
    "2": "待发货",
    "3": "待收货"
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
