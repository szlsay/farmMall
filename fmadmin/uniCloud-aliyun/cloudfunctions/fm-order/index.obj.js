// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const dbJql = uniCloud.databaseForJQL();
const dbCollectionName = 'fm-order';
// 云对象代码传入clientInfo
const uniID = require('uni-id-common')

module.exports = {
	_before: function() { // 通用预处理器
		this.token = this.getUniIdToken()
		if (this.token) {
			this.userInfo = await this.uniID.checkToken(this.token);
			if (this.userInfo.errCode) {
				return {
					errCode: this.userInfo.errCode,
					errMsg: this.userInfo.errMsg
				}
			} else {
				const clientInfo = this.getClientInfo()
				this.uniID = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
					clientInfo
				})
			}
		} else {
			throw new Error('token凭证不存在，请重新登录')
		}
	},
	async add(value) {
		value.create_time = Date.now()
		value.oid = '' + (Math.floor(Math.random() * 900) + 100) + Date.now()
		value.uid = this.uniID.uid
		value.cancel_time = value.create_time + 10800000
		value.update_time = Date.now()
		return db.collection(dbCollectionName).add(value)
	},
}