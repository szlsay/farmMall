export default {
	namespaced: true,
	state: {
		dicts: [],
		measure_units: [],
		delivery_rates: []
	},
	mutations: {
		SET_DICTS: (state, dicts) => {
			state.dicts = dicts
			state.measure_units = dicts.filter(item => item.type === "measure_unit")[0]["enum"]
			state.delivery_rates = dicts.filter(item => item.type === "delivery_rate")[0]["enum"]
		},
	},
	actions: {
		async getDics({
			commit
		}) {
			const fmdict = uniCloud.importObject("fm-dict")
			const result = await fmdict.getList()
			if (result.data && result.data.length > 1) {
				commit("SET_DICTS", result.data)
			}
		}
	}
}