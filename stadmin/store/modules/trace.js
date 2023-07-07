export default {
	namespaced: true,
	state: {
		cate_list: [],
		land_list: [],
	},
	mutations: {
		SET_CateList: (state, cate_list) => {
			state.cate_list = cate_list
		},
		SET_LandList: (state, land_list) => {
			state.land_list = land_list
		}
	},
	actions: {
		async getCateList({
			commit,
			state
		}) {
			if (state.cate_list.length > 0) return
			const result = await uniCloud.importObject("st-product-cate").getListApi()
			console.log(result)
			if (result.data && result.data.length > 0) {
				result.data.map(item => {
					item.text = item.label
					item.value = item._id
				})
			}
			commit("SET_CateList", result.data)
		},
		async getLandList({
			commit,
			state
		}) {
			if (state.land_list.length > 0) return
			const result = await uniCloud.importObject("st-land").getListApi()
			console.log(result)
			if (result.data && result.data.length > 0) {
				result.data.map(item => {
					item.text = item.land_name
					item.value = item._id
				})
			}
			commit("SET_LandList", result.data)
		}
	}
}
