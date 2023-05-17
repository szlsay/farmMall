import App from './App'
import store from './store'
import plugin from './js_sdk/uni-admin/plugin'
import messages from './i18n/index.js'

import { createSSRApp } from 'vue'
import { createI18n } from 'vue-i18n'
export function createApp() {
  const app = createSSRApp(App)
  const i18n = createI18n({
  	locale: uni.getLocale(),
  	messages
  })
  app.use(i18n)
  app.use(plugin)
  app.use(store)
  return {
    app
  }
}
