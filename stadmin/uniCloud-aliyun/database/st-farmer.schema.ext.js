// schema扩展相关文档请参阅：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
module.exports = {
	trigger: {
		beforeCreate: async function(obj = {}) {
			obj.addDataList.map(item => item.create_time = Date.now())
		},
		beforeUpdate: async function(obj = {}) {
			obj.updateData.update_time = Date.now()
		}
	}
}