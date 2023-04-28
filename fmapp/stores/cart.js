// stores/cart.js
import {
	defineStore
} from 'pinia';
const db = uniCloud.database()
export const useCartStore = defineStore('cart', {
	state: () => {
		return {
			count: 0,
			cartList: []
		};
	},
	// 也可以这样定义
	// state: () => ({ count: 0 })
	actions: {
		increment() {
			this.count++;
		},
		async getCartList() {
			let {
				result
			} = await db.collection('fm-cart,fm-goods')
				.field('goods_id{image, name, price_sell, producer}, qty, select')
				.get()
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
				this.cartList = result.data
			} else {
				this.cartList = []
			}
		}
	},
});