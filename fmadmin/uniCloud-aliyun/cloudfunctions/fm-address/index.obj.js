// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const dbCollectionName = 'fm-address';
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
	getDefault() {
		if (this.userInfo.errCode) {
			return this.userInfo
		}
		return db.collection(dbCollectionName).where({
			'is_default': true,
			uid: this.userInfo.uid
		}).get()
	},
	getList() {
		if (this.userInfo.errCode) {
			return this.userInfo
		}
		return db.collection(dbCollectionName).where({
			uid: this.userInfo.uid
		}).get()
	},
	add: async function(value) {
		if (this.userInfo.errCode) {
			return this.userInfo
		}
		value.uid = this.userInfo.uid
		value.create_time = Date.now()
		value.update_time = Date.now()
		if (value.is_default) {
			const defaultData = await db.collection(dbCollectionName).where({
				'is_default': value.is_default,
				'uid': this.userInfo.uid
			}).get()
			if (defaultData.data.length == 1) {
				const defaultId = defaultData.data[0]._id
				const transaction = await db.startTransaction()
				try {
					const updateOld = await transaction.collection(dbCollectionName).doc(defaultId).update({
						"is_default": false
					})
					const addNew = await transaction.collection(dbCollectionName).add(value)
					if (updateOld.updated && addNew.id) {
						await transaction.commit()
						return addNew
					} else {
						await transaction.rollback()
					}
				} catch (err) {
					await transaction.rollback()
				}
			} else {
				return db.collection(dbCollectionName).add(value)
			}
		} else {
			return db.collection(dbCollectionName).add(value)
		}
	},
	update: async function(id, value) {
		if (this.userInfo.errCode) {
			return this.userInfo
		}
		value.update_time = Date.now()
		if (value.is_default) {
			const defaultData = await db.collection(dbCollectionName).where({
				'is_default': value.is_default,
				'uid': this.userInfo.uid
			}).get()
			if (defaultData.data.length == 1) {
				const defaultId = defaultData.data[0]._id
				if (defaultId !== id) {
					const transaction = await db.startTransaction()
					try {
						const updateOld = await transaction.collection(dbCollectionName).doc(defaultId).update({
							"is_default": false
						})
						const updateNew = await transaction.collection(dbCollectionName).doc(id).update(value)
						if (updateOld.updated && updateNew.updated) {
							await transaction.commit()
							return updateNew
						} else {
							await transaction.rollback()
						}
					} catch (err) {
						await transaction.rollback()
					}
				} else {
					return db.collection(dbCollectionName).doc(id).update(value)
				}
			} else {
				return db.collection(dbCollectionName).doc(id).update(value)
			}
		} else {
			return db.collection(dbCollectionName).doc(id).update(value)
		}
	},
	delete: function(_id) {
		if (this.userInfo.errCode) {
			return this.userInfo
		}
		return db.collection(dbCollectionName).where({
			_id,
			uid: this.userInfo.uid
		}).remove()
	}

}