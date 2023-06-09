const db = uniCloud.database();
const dbJql = uniCloud.databaseForJQL();
const dbCollectionName = 'fm-combo';

const uniID = require('uni-id-common')
module.exports = {
	_before: async function() {
		// 通用预处理器
		this.token = this.getUniIdToken()
		if (this.token) {
			const clientInfo = this.getClientInfo()
			this.uniID = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
				clientInfo
			})
			this.userInfo = await this.uniID.checkToken(this.token);
		}
		// else {
		// 	throw new Error('token凭证不存在，请重新登录')
		// }
	},
	add(value) {
		if (this.userInfo.errCode) {
			return this.userInfo
		}
		value.create_time = Date.now()
		value.update_time = Date.now()
		value.is_delete = false
		value.create_uid = this.userInfo.uid
		return db.collection(dbCollectionName).add(value)
	},
	update(_id, value) {
		if (this.userInfo.errCode) {
			return this.userInfo
		}
		value.update_time = Date.now()
		return dbJql.collection(dbCollectionName).doc(_id).update(value)
	},
	delete(_id) {
		if (this.userInfo.errCode) {
			return this.userInfo
		}
		return dbJql.collection(dbCollectionName).doc(_id).update({
			is_delete: true
		})
	},
	async getDicts() {
		const result = await dbJql.collection(dbCollectionName).where({
			is_delete: false
		}).field("_id, name").get()
		return result.data.map(item => {
			item.value = item._id
			item.text = item.name
			return item
		})
	},
	async get(_id) {
		const result = await dbJql.collection(dbCollectionName).doc(_id).get()
		const product_ids = result.data[0].sku.map(item => item.product_id)
		const productResult = await dbJql.collection("fm-product").where({
			_id: db.command.in(product_ids)
		}).field("image").get()
		result.data[0].sku.map(item => {
			const select = productResult.data.filter(product => product._id === item.product_id)
			if (select.length > 0) {
				item.image = select[0].image
			}
		})
		return result
	},
	getList() {
		return dbJql.collection(dbCollectionName).where({
			is_delete: false
		}).get()
	},
}