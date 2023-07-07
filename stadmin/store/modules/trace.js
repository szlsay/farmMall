export default {
	namespaced: true,
	state: {
		cate_list: []
	},
	mutations: {
		SET_CateList: (state, cate_list) => {
			state.cate_list = cate_list
		}
	},
	actions: {
		async getCateList({
			commit
		}) {
			const result = await uniCloud.importObject("st-product-cate").getListApi()
			console.log(result)
			if (result.data && result.data.length > 0) {
				result.data.map(item => {
					item.text = item.label
					item.value = item._id
				})
			}
			commit("SET_CateList", result.data)
		}
	}
}