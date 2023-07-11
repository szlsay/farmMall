// schema扩展相关文档请参阅：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
module.exports = {
	trigger: {
		beforeCreate: async function(obj = {}) {
			console.log('farm-beforeCreate', obj)
		},
		afterCreate: async function(obj = {}) {
			console.log('farm-afterCreate', obj)
		},
		beforeUpdate: async function(obj = {}) {
			console.log('farm-beforeUpdate', obj)
			// let {
			// 	collection,
			// 	operation,
			// 	where,
			// 	field
			// } = obj;
			// const db = uniCloud.database();
			// const dataUpdata = {
			// 	update_time: Date.now()
			// }
			// await uniCloud.database().collection(collection).where(where).update(dataUpdata)
		},
		afterUpdate: async function(obj = {}) {
			console.log('farm-afterUpdate', obj)
		}
	}
}