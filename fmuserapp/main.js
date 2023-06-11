import App from './App'
import i18n from './lang/i18n'

import {
	createSSRApp
} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	return {
		app
	}
}