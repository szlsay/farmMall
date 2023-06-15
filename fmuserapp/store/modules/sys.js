export default {
	namespaced: true,
	state: {
		dicts: [],
		measure_units: [],
		delivery_ratios: [],
		product_units: [],
		ad_types: [],
		tags: [],
		home_headers: []
	},
	mutations: {
		SET_DICTS: (state, dicts) => {
			state.dicts = dicts
			state.measure_units = dicts.filter(item => item.type === "measure_unit")[0]["enum"]
			state.delivery_ratios = dicts.filter(item => item.type === "delivery_ratio")[0]["enum"]
			state.product_units = dicts.filter(item => item.type === "product_unit")[0]["enum"]
			state.ad_types = dicts.filter(item => item.type === "ad_type")[0]["enum"]
		},
		SET_TAGS: (state, tags) => {
			state.tags = tags
			state.home_headers = tags.filter(item => item.type === "home_header")[0]["enum"]
		}
	},
	actions: {
		async getDicts({
			commit
		}) {
			const fmdict = uniCloud.importObject("fm-dict")
			const result = await fmdict.getList()
			if (result.data && result.data.length > 0) {
				commit("SET_DICTS", result.data)
			}
		},
		async getTags({
			commit
		}) {
			const db = uniCloud.database();
			const {
				result
			} = await db.collection("fm-tag").get()
			if (result.data && result.data.length > 0) {
				commit("SET_TAGS", result.data)
			}
		}
	}
}