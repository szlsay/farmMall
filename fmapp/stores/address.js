import {
	defineStore
} from 'pinia';
const db = uniCloud.database()
export const useAddressStore = defineStore('address', {
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
			const fmaddress = uniCloud.importObject("fm-address")
			let result = await fmaddress.getList()
			console.log("getList-", result)
			if (result.data) {
				this.list = result.data
				if (this.selectId === '') {
					 const selectData = this.list.find(item => item.is_default === true)
					 if (selectData && selectData._id) {
						 this.selectId = selectData._id
					 }
				}
			}
		}
	},
});