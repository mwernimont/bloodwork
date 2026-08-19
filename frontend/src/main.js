import { createApp } from 'vue'
import { plugin as formkitPlugin, defaultConfig as formkitDefaultConfig } from '@formkit/vue'
import App from './App.vue'
import router from './router'
import './assets/styles/global.scss'

const app = createApp(App)

app.use(router)
app.use(formkitPlugin, formkitDefaultConfig())

app.mount('#app')
