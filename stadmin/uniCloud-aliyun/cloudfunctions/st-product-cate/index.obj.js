const db = uniCloud.database();
const dbJql = uniCloud.databaseForJQL();
const dbCollectionName = 'st-product-cate';
const uniID = require('uni-id-common')
module.exports = {
	_before: async function() { // 通用预处理器
		this.token = this.getUniIdToken()
		if (this.token) {
			const clientInfo = this.getClientInfo()
			this.uniID = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
				clientInfo
			})
			this.userInfo = await this.uniID.checkToken(this.token);
		}
	},
	add(value) {
		if (this.userInfo.errCode) {
			return this.userInfo
		}
		value.create_time = Date.now()
		return db.collection(dbCollectionName).add(value)
	},
	update(_id, value) {
		if (this.userInfo.errCode) {
			return this.userInfo
		}
		value.update_time = Date.now()
		return dbJql.collection(dbCollectionName).doc(_id).update(value)
	},
	getList() {
		return db.collection(dbCollectionName).get()
	},
	delete(_id) {
		if (this.userInfo.errCode) {
			return this.userInfo
		}
		return dbJql.collection(dbCollectionName).doc(_id).update({
			is_delete: true
		})
	}
}