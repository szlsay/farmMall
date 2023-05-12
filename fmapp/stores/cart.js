import {
	defineStore
} from 'pinia';
const db = uniCloud.database()
export const useCartStore = defineStore('cart', {
	state: () => {
		return {
			list: []
		};
	},
	actions: {
		async getList() {
			const fmcart = uniCloud.importObject("fm-cart")
			let result = await fmcart.getList()
			if (result.data && result.data.length > 0) {
				this.list = result.data
			} else {
				this.list = []
			}
		}
	},
});