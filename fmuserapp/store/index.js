import sys from './modules/sys.js'
import user from './modules/user.js'
import {
	createStore
} from 'vuex'

const store = createStore({
	modules: {
		sys,
		user
	}
})

export default store