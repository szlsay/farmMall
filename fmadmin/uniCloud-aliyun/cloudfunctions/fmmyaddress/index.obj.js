// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const dbCollectionName = 'fm-my-address';
module.exports = {
	_before: function() { // 通用预处理器

	},
	update: async function(id, value) {
		if (value.is_default) {
			const defaultData = await db.collection(dbCollectionName).where({
				'is_default': value.is_default
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