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
import { Chains, createWeb3Auth } from '@kolirt/vue-web3-auth'

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
app.use(createWeb3Auth({
    projectId: 'c028041a7b7cb50cd2eab4fd1bb982a3', // generate here https://cloud.walletconnect.com/ and turn on 'Supports Sign v2'
    chains: [
      Chains.bsc,
    //   Chains.mainnet,
    //   Chains.polygon
    ]
  }))

// TODO Fix for sidebar 
app.use(VueClickAway)

app.mount('#app')

// *Analytics
inject()