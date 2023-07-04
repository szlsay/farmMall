import App from './App'
import store from './store'
import plugin from './js_sdk/uni-admin/plugin'
import messages from './i18n/index.js'
const lang = uni.getLocale()
import { createSSRApp } from 'vue'
import { createI18n } from 'vue-i18n'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export function createApp() {
  const app = createSSRApp(App)
  const i18n = createI18n({
  	locale: lang,
  	messages
  })
  app.use(i18n)
  app.use(plugin)
  app.use(store)
	app.use(ElementPlus)
  return {
    app
  }
}
