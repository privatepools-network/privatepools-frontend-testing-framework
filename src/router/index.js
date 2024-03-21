import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/pools',
    children: [
      {
        path: '/general',
        name: 'General',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/Analytics/General.vue'),
      },
      {
        path: '/user_analytics',
        name: 'UserAnalytics',
        component: () => import('@/views/Analytics/UserAnalytics.vue'),
      },
      {
        path: '/pools',
        name: 'Manage Pools',
        component: () => import('@/views/Pools/index.vue'),
      },
      {
        path: '/pools/compose',
        name: 'Compose Pool',
        component: () => import('@/views/Pools/Compose.vue'),
      },
      {
        path: '/pools/concentrated_pool',
        name: 'Concentrated liquidity',
        component: () => import('@/views/Pools/ConcentratedLiquidity.vue'),
      },
      {
        path: '/pools/concentrated_pool/add/:onMountedActivity',
        name: 'Concentrated liquidity Add',
        component: () => import('@/views/Pools/ConcentratedLiquidityAdd.vue'),
      },
      {
        path: '/pools/concentrated_pool/add_position',
        name: 'Concentrated liquidity Preselected',
        component: () =>
          import('@/views/Pools/ConcentratedLiquidityPreselected.vue'),
      },

      {
        path: '/pools/details/:id/:chainSelected/:onMountedActivity',
        name: 'Pool Details',
        component: () => import('@/views/Pools/Details.vue'),
        props: true,
      },
      {
        path: '/pools/CLdetails/:id/:chainSelected/:onMountedActivity',
        name: 'Pool CL Details',
        component: () => import('@/views/Pools/CLDetails.vue'),
        props: true,
      },

      {
        path: '/pools/:id/:chainSelected/deposit',
        name: 'Pool Deposit',
        component: () => import('@/views/Pools/Deposit.vue'),
      },
      {
        path: '/pools/:id/:chainSelected/withdraw',
        name: 'Pool Withdraw',
        component: () => import('@/views/Pools/Withdraw.vue'),
      },

      {
        path: '/referrals',
        name: 'Referrals',
        component: () => import('@/views/Referrals.vue'),
      },
      {
        path: '/buy',
        name: 'Buy',
        component: () => import('@/views/Buy.vue'),
      },
      {
        path: '/portfolio/investments/details/:id',
        name: 'Investment Details',
        component: () => import('@/views/portfolio/Details.vue'),
        props: true,
      },
      {
        path: '/portfolio',
        name: 'Portfolio',
        component: () => import('@/views/portfolio/index.vue'),
      },
    ],
  },
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
