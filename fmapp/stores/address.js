import {
	defineStore
} from 'pinia';
const db = uniCloud.database()
export const useCartStore = defineStore('address', {
	state: () => {
		return {
			list: [],
			selectId: ''
		};
	},
	getters: {
		getSelect: (state) => state.list.find(item => item._id === state.selectId)
	},
	actions: {
		async getList() {
			const fmcart = uniCloud.importObject("fm-address")
			let result = await fmcart.getList()
			if (result.data) {
				this.list = result.data
			}
		}
	},
});