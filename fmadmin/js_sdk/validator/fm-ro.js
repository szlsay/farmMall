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
    "label": "合作社名称"
  },
  "mobile": {
    "rules": [
      {
        "format": "string"
      },
      {
        "maxLength": 11
      },
      {
        "pattern": "^1[34578][0-9]{9}$"
      }
    ],
    "label": "手机号码"
  },
  "start": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "无",
            "value": 0
          },
          {
            "text": "一星",
            "value": 1
          },
          {
            "text": "二星",
            "value": 2
          },
          {
            "text": "三星",
            "value": 3
          },
          {
            "text": "四星",
            "value": 4
          },
          {
            "text": "五星",
            "value": 5
          }
        ]
      }
    ],
    "label": "星级",
    "defaultValue": 0
  }
}

const enumConverter = {
  "start_valuetotext": {
    "0": "无",
    "1": "一星",
    "2": "二星",
    "3": "三星",
    "4": "四星",
    "5": "五星"
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
