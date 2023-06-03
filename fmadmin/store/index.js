import app from './modules/app.js'
import error from './modules/error.js'
import user from './modules/user.js'
import sys from './modules/sys.js'
import {
	createStore
} from 'vuex'

const store = createStore({
	modules: {
		app,
		error,
		user,
		sys
	}
})

export default store