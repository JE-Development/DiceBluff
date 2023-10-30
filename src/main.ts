import './assets/main.css'
import './assets/view-design.css'
import VueCookies from 'vue-cookies'
import router from './router'
import Notifications from '@kyvg/vue3-notification'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(VueCookies)
app.use(router)
app.use(Notifications)
app.mount('#app')
