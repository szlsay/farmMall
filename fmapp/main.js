import App from './App'
import i18n from './lang/i18n'
import * as Pinia from 'pinia';

import {createSSRApp} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	app.use(Pinia.createPinia());
	return {app, Pinia}
}
