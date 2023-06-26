export default {
	namespaced: true,
	state: {
		addressList: [],
	},
	mutations: {
		SET_AddressList: (state, list) => {
			state.addressList = list
		},
	},
	actions: {
		async getAddressList({
			commit
		}) {
			const fmaddress = uniCloud.importObject("fm-address")
			const result = await fmaddress.getList()
			if (result.data && result.data.length > 0) {
				commit("SET_AddressList", result.data)
			}
		}
	}
}