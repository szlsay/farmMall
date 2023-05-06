import {
	defineStore
} from 'pinia';
const db = uniCloud.database()
export const useCartStore = defineStore('cart', {
	state: () => {
		return {
			cartList: []
		};
	},
	actions: {
		async getCartList() {
			const fmcart = uniCloud.importObject("fmcart")
			let result = await fmcart.getList()
			if (result.data && result.data.length > 0) {
				this.cartList = result.data
			} else {
				this.cartList = []
			}
		}
	},
});