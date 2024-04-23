import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vueQuery from '@/plugins/vueQuery.js'
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import VueApexCharts from 'vue3-apexcharts'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import { inject } from '@vercel/analytics'
import VueClickAway from 'vue3-click-away'
import { createPinia } from 'pinia'
import i18n from '../i18n'

const pinia = createPinia()
const app = createApp(App)

i18n(app)
app.use(pinia)
app.use(router)
app.use(vueQuery)
app.use(CoreuiVue)
app.use(VueApexCharts)
app.component('CIcon', CIcon)
app.component('apexchart', VueApexCharts)
app.use(FloatingVue)

// TODO Fix for sidebar 
app.use(VueClickAway)

app.mount('#app')

// *Analytics
inject()