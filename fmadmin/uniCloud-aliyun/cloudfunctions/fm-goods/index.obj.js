// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const dbJql = uniCloud.databaseForJQL();
const dbCollectionName = 'fm-goods';
// 云对象代码传入clientInfo
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
		} else {
			throw new Error('token凭证不存在，请重新登录')
		}
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
}