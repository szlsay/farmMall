// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
	"name": {
		"rules": [{
				"format": "string"
			},
			{
				"maxLength": 10
			}
		],
		"label": "产品名称"
	},
	"raw_name": {
		"rules": [{
				"format": "string"
			},
			{
				"maxLength": 10
			}
		],
		"label": "原材料名称"
	},
	"unit": {
		"rules": [{
			"format": "string"
		}],
		"label": "计量单位"
	},
	"image": {
		"rules": [{
			"format": "file"
		}],
		"label": "产品主图"
	},
	"image_content": {
		"rules": [{
				"format": "array"
			},
			{
				"arrayType": "file"
			}
		],
		"label": "展示图片"
	},
	"raw_cost": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 10000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "原材料成本"
	},
	"yield_ratio": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 1,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "出成率"
	},
	"processing_cost": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 1000000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "加工成本"
	},
	"finish_cost": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 1000000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "成品成本"
	},
	"transport_cost": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 1000000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "运储成本"
	},
	"reproduct_cost": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 1000000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "再生产成本"
	},
	"sideline_income": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 1000000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "副产品收入"
	},
	"quality_ratio": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 1,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "质信金"
	},
	"sum_cost": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 1000000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "成本小计"
	},
	"fixed_ratio": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 10,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "定倍率"
	},
	"market_price": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 1000000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "营销价格"
	},
	"pack_fee": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 1000000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "包装费"
	},
	"delivery_fee": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 1000000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "配送费"
	},
	"branch_fee": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 1000000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "网点提成"
	},
	"market_fee": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 1000000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "营销费"
	},
	"platform_fee": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 1,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "平台佣金"
	},
	"gp_price": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 10000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "毛利润"
	},
	"product_bonus": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 10000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "生产奖励"
	},
	"market_bonus": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 10000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "营销奖励"
	},
	"develop_bonus": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 10000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "发展基金"
	},
	"ni_price": {
		"rules": [{
				"format": "double",
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			},
			{
				"minimum": 0,
				"maximum": 10000,
				"errorMessage": "{label}在{minimum}与{maximum}之间"
			}
		],
		"label": "净利润"
	}
}

const enumConverter = {}

function filterToWhere(filter, command) {
	let where = {}
	for (let field in filter) {
		let {
			type,
			value
		} = filter[field]
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

export {
	validator,
	enumConverter,
	filterToWhere
}