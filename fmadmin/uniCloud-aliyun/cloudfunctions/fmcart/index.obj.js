// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const dbJql = uniCloud.databaseForJQL();
const dbCollectionName = 'fm-cart';
// 云对象代码传入clientInfo
const uniID = require('uni-id-common')
module.exports = {
	_before: async function() { // 通用预处理器
		const clientInfo = this.getClientInfo()
		this.uniID = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
			clientInfo
		})
		this.token = this.getUniIdToken()
		if (this.token) {
			this.userInfo = await this.uniID.checkToken(this.token);
		} else {
			return
		}
	},
	async add(goods_id) {
		const value = {
			goods_id,
			uid: this.userInfo.uid
		}
		let result = await db.collection(dbCollectionName).where({
			goods_id: value.goods_id,
			uid: this.userInfo.uid
		}).get()
		if (result.data && result.data.length === 1) {
			let cartData = result.data[0]
			cartData.qty += 1
			return db.collection(dbCollectionName).doc(cartData._id).update({
				qty: cartData.qty,
				update_time: Date.now()
			})
		} else {
			value.create_time = Date.now()
			value.update_time = Date.now()
			value.qty = 1
			value.select = false
			return db.collection(dbCollectionName).add(value)
		}
	},
	async updateQty(_id, qty) {
		return await dbJql.collection(dbCollectionName).doc(_id).update({
			qty,
			update_time: Date.now()
		})
	},
	async updateSelect(_id, select) {
		return await dbJql.collection(dbCollectionName).doc(_id).update({
			select,
			update_time: Date.now()
		})
	},
	async updateAllSelect(select) {
		return await dbJql.collection(dbCollectionName).where({
			uid: this.userInfo.uid
		}).update({
			select,
			update_time: Date.now()
		})
	},
	async getList() {
		const cart_data = await dbJql.collection(dbCollectionName).where({
			uid: this.userInfo.uid
		}).getTemp()
		const result = await dbJql.collection(cart_data, 'fm-goods').field(
			'goods_id{image, name, price_sell, producer}, qty, select').get()
		if (result.data && result.data.length > 0) {
			result.data.map(item => {
				if (item.goods_id && item.goods_id.length > 0) {
					let goods_id = item.goods_id[0]
					item.image = goods_id.image
					item.name = goods_id.name
					item.price_sell = goods_id.price_sell
					item.producer = goods_id.producer
				}
			})
		}
		return result
	}
}