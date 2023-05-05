// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const dbCollectionName = 'fm-my-address';
// 云对象代码传入clientInfo
const uniID = require('uni-id-common')
module.exports = {
	_before: function() { // 通用预处理器
		const clientInfo = this.getClientInfo()
		this.uniID = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
			clientInfo
		})
	},
	add: async function(value) {
		const {
			uid
		} = await this.uniID.checkToken(this.getUniIdToken());
		value.uid = uid
		value.create_time = Date.now()
		value.update_time = Date.now()
		if (value.is_default) {
			const defaultData = await db.collection(dbCollectionName).where({
				'is_default': value.is_default,
				'uid': uid
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
		const {
			uid
		} = await this.uniID.checkToken(this.getUniIdToken());
		value.update_time = Date.now()
		if (value.is_default) {
			const defaultData = await db.collection(dbCollectionName).where({
				'is_default': value.is_default,
				'uid': uid
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

}