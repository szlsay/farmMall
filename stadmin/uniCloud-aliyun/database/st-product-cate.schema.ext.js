// schema扩展相关文档请参阅：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
module.exports = {
	trigger: {
		beforeRead: async function() {
			console.log("cate-beforeRead")
		},
		afterRead: async function() {
			console.log("cate-afterRead")
		},
		beforeDelete: async function(obj = {}) {
			let {
				collection,
				operation,
				where,
				field
			} = obj;
			console.log('cate-beforeDelete', collection, operation, where, field)
		},
		beforeCount: async function() {
			console.log("cate-beforeCount")
		},
		afterCount: async function() {
			console.log("cate-afterCount")
		},
		beforeUpdate: async function(obj = {}) {
			let {
				collection,
				operation,
				where,
				field
			} = obj;
			const db = uniCloud.database();
			const dataUpdata = {
				update_time: Date.now()
			}
			await uniCloud.database().collection(collection).where(where).update(dataUpdata)
		},
		afterUpdate: async function(obj = {}) {
			console.log("cate-afterUpdate", obj)
		},
	}
}
