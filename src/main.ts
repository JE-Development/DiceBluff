import './assets/main.css'
import './assets/view-design.css'
import VueCookies from 'vue-cookies'
import router from './router'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(VueCookies)
app.use(router)
app.mount('#app')
