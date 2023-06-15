import sys from './modules/sys.js'
import {
	createStore
} from 'vuex'

const store = createStore({
	modules: {
		sys
	}
})

export default store