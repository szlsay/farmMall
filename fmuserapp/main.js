import App from './App'
import i18n from './lang/i18n'
import store from './store'
import {
	createSSRApp
} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	app.use(store)
	return {
		app
	}
}