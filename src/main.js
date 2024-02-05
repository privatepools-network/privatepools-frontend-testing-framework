import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vueQuery from '@/plugins/vueQuery.js'
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsExample from '@/components/DocsExample'
import VueApexCharts from 'vue3-apexcharts'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import { inject } from '@vercel/analytics'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(vueQuery)
app.use(CoreuiVue)
app.use(VueApexCharts)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsExample', DocsExample)
app.component('apexchart', VueApexCharts)
app.use(FloatingVue)

app.mount('#app')
inject()