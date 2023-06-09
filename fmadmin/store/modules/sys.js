export default {
	namespaced: true,
	state: {
		dicts: [],
		measure_units: [],
		delivery_rates: [],
		priceRules: [],
		multiple_rules: [],
		credit_rules: []
	},
	mutations: {
		SET_DICTS: (state, dicts) => {
			state.dicts = dicts
			state.measure_units = dicts.filter(item => item.type === "measure_unit")[0]["enum"]
			state.delivery_rates = dicts.filter(item => item.type === "delivery_rate")[0]["enum"]
		},
		SET_PriceRules: (state, priceRules) => {
			state.priceRules = priceRules
			state.multiple_rules = priceRules.filter(item => item.type === "multiple_rule")[0]["rules"]
			state.credit_rules = priceRules.filter(item => item.type === "credit_rule")[0]["rules"]
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
		},
		async getPriceRule({
			commit
		}) {
			const db = uniCloud.database();
			const dbCmd = db.command;
			const dbCollectionName = 'fm-price-rule';
			const result = await db.collection(dbCollectionName).get()
			if (result.data && result.data.length > 1) {
				commit("SET_PriceRules", result.data)
			}
			console.log('getPriceRule--', result)
		}
	}
}