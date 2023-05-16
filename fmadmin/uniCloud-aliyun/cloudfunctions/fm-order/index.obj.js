// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const dbJql = uniCloud.databaseForJQL();
const dbCollectionName = 'fm-order';
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
	async get(id) {
		if (this.userInfo.errCode) {
			return this.userInfo
		}
		const result = await db.collection(dbCollectionName).doc(id).get()
		console.log('get---', result)
		if (result.data && result.data.length > 0) {
			result.data.map(item =>
				item.surplus_time = item.cancel_time - Date.now()
			)
		}
		return result
	},
	async add(value, from) {
		if (this.userInfo.errCode) {
			return this.userInfo
		}
		value.create_time = Date.now()
		value.oid = '' + (Math.floor(Math.random() * 900) + 100) + Date.now()
		value.uid = this.userInfo.uid
		value.cancel_time = value.create_time + 10800000
		value.update_time = Date.now()
		value.state = 1
		if (from === 'cart') {
			const cartList = await dbJql.collection('fm-cart').where({
				uid: this.userInfo.uid,
				select: true
			}).get()
			const cartIds = []
			if (cartList && cartList.data && cartList.data.length > 0) {
				cartList.data.forEach(item => {
					cartIds.push(item._id)
				})
			}
			const transaction = await db.startTransaction()
			try {
				let deleteNum = 0
				for (let index = 0; index < cartIds.length; index++) {
					const deleteCart = await transaction.collection('fm-cart').doc(cartIds[index]).remove()
					if (deleteCart && deleteCart.deleted) {
						deleteNum += 1
					}
				}
				const addNew = await transaction.collection(dbCollectionName).add(value)
				if (deleteNum === cartIds.length && addNew.id) {
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
	},
}