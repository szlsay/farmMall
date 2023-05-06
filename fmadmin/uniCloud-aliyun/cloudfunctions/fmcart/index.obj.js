// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const dbJql = uniCloud.databaseForJQL();
// const dbCollectionName = 'fm-cart';
// 云对象代码传入clientInfo
const uniID = require('uni-id-common')
module.exports = {
	_before: function() { // 通用预处理器
		const clientInfo = this.getClientInfo()
		this.uniID = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
			clientInfo
		})
	},
	async getList() {
		const {
			uid
		} = await this.uniID.checkToken(this.getUniIdToken());
		const cart_data = await dbJql.collection('fm-cart').where({
			uid
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