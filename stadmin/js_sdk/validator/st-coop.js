// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
	"coop_name": {
		"rules": [{
				"required": true
			},
			{
				"format": "string"
			}
		],
		"label": "合作社名称"
	},
	"contact_name": {
		"rules": [{
			"format": "string"
		}],
		"label": "联系人姓名"
	},
	"contact_phone": {
		"rules": [{
				"format": "string"
			},
			{
				"pattern": "^1[34578][0-9]{9}$"
			}
		],
		"label": "联系人电话"
	},
	"map_address": {
		"rules": [{
			"format": "string"
		}],
		"label": "地图地址"
	},
	"address": {
		"rules": [{
			"format": "string"
		}],
		"label": "详细地址"
	},
	"longitude": {
		"rules": [{
			"format": "string"
		}],
		"label": "经度"
	},
	"latitude": {
		"rules": [{
			"format": "string"
		}],
		"label": "纬度"
	},
	"scope": {
		"rules": [{
				"format": "string"
			},
			{
				"maxLength": 200
			}
		],
		"label": "主营范围"
	},
	"image": {
		"rules": [{
			"format": "file"
		}],
		"label": "合作社图片"
	},
	"disabled": {
		"rules": [{
			"format": "bool"
		}],
		"label": "是否禁用",
		"defaultValue": false
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