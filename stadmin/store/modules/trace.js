export default {
	namespaced: true,
	state: {
		basic: [],
		land_types: []
	},
	mutations: {
		SET_Basic: (state, basic) => {
			state.basic = basic
			state.land_types = basic.filter(item => item.value === "dikuaileixing")[0]["list"]
		}
	},
	actions: {
		async getBasic({
			commit
		}) {
			const {
				result
			} = await uniCloud.database().collection('st-basic').get()
			if (result.data && result.data.length > 0) {
				commit("SET_Basic", result.data)
			}
		}
	}
}