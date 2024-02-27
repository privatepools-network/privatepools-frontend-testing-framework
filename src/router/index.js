import { h, resolveComponent } from 'vue'
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
        path: '/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
      },
      {
        path: '/track',
        meta: { isDisabled: true },
        name: 'Track',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/track',
        children: [
          {
            path: '/track/trades',
            name: 'Track Trades',
            component: () => import('@/views/track/Trades.vue'),
          },
          {
            path: '/track/opportunities',
            name: 'Missed Opportunities',
            component: () => import('@/views/track/Opportunities.vue'),
          },
          {
            path: '/track/tracking_info',
            name: 'Tracking Info',
            component: () => import('@/views/track/TrackingInfo.vue'),
          },
          // {
          //   path: '/track/pools',
          //   name: 'Track Pools',
          //   component: () => import('@/views/track/Pools.vue'),
          // },
        ],
      },

      {
        path: '/pools',
        name: 'Manage Pools',
        component: () => import('@/views/manage/Pools/index.vue'),
      },
      {
        path: '/pools/compose',
        name: 'Compose Pool',
        component: () => import('@/views/manage/Pools/Compose.vue'),
      },
      {
        path: '/pools/concentrated_pool',
        name: 'Concentrated liquidity',
        component: () =>
          import('@/views/manage/Pools/ConcentratedLiquidity.vue'),
      },
      {
        path: '/pools/concentrated_pool/add/:onMountedActivity',
        name: 'Concentrated liquidity Add',
        component: () =>
          import('@/views/manage/Pools/ConcentratedLiquidityAdd.vue'),
      },
      {
        path: '/pools/concentrated_pool/add_position',
        name: 'Concentrated liquidity Preselected',
        component: () =>
          import('@/views/manage/Pools/ConcentratedLiquidityPreselected.vue'),
      },

      {
        path: '/pools/details/:id/:chainSelected/:onMountedActivity',
        name: 'Pool Details',
        component: () => import('@/views/manage/Pools/Details.vue'),
        props: true,
      },
      {
        path: '/pools/:id/:chainSelected/deposit',
        name: 'Pool Deposit',
        component: () => import('@/views/manage/Pools/Deposit.vue'),
      },
      {
        path: '/pools/:id/:chainSelected/withdraw',
        name: 'Pool Withdraw',
        component: () => import('@/views/manage/Pools/Withdraw.vue'),
      },

      {
        path: '/rewards',
        name: 'Rewards',
        component: () => import('@/views/Rewards.vue'),
        props: true,
      },
      {
        path: '/changelog',
        name: 'Changelog',
        component: () => import('@/views/Changelog.vue'),
        props: true,
      },
      {
        path: '/changelog/:id',
        name: 'Changelog / Article',
        component: () => import('@/views/ChangelogArticle.vue'),
        props: true,
      },

      {
        path: '/admin',
        name: 'Admin',
        meta: { isDisabled: true },
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/admin',
        children: [
          // {
          //   path: '/admin/bot',
          //   name: 'Manage Bot',
          //   component: () => import('@/views/manage/Bot.vue'),
          // },
          {
            path: '/admin/1inch',
            name: 'Manage 1INCH',
            component: () => import('@/views/manage/OneInch.vue'),
          },
          {
            path: '/admin/firebird',
            name: 'Manage Firebird',
            component: () => import('@/views/admin/Firebird.vue'),
          },

          {
            path: '/admin/swap',
            name: 'Swap',
            component: () => import('@/views/admin/Swap.vue'),
          },
          {
            path: '/botLiveFeed',
            name: 'Bot Live Feed',
            component: () => import('@/views/botLiveFeed/index.vue'),
          },
          {
            path: '/botLiveFeed/details',
            name: 'Bot Live Feed Details',
            component: () => import('@/views/botLiveFeed/Details.vue'),
          },
          {
            path: '/whitelist',
            name: 'Whitelist',
            component: () => import('@/views/Whitelist.vue'),
          },
          // {
          //   path: '/manage/funds',
          //   name: 'Manage Funds',
          //   component: () => import('@/views/manage/Funds.vue'),
          // },
          // {
          //   path: '/manage/dp',
          //   name: 'Button Groups',
          //   component: () => import('@/views/manage/Dp.vue'),
          // },
        ],
      },
      // {
      //   path: '/manage/pools/compose',
      //   name: 'Compose Pool',
      //   component: () => import('@/views/manage/Pools/Compose.vue'),
      // },
      // {
      //   path: '/manage/pools/details/:id/:onMountedActivity/:chainSelected',
      //   name: 'Pool Details',
      //   component: () => import('@/views/manage/Pools/Details.vue'),
      //   props: true,
      // },
      {
        path: '/simulator',
        name: 'Simulator',
        component: () => import('@/views/Simulator.vue'),
      },
      {
        path: '/portfolio',
        name: 'Portfolio',
        component: () => import('@/views/portfolio/index.vue'),
      },
      {
        path: '/portfolio/investments/details/:id',
        name: 'Investment Details',
        component: () => import('@/views/portfolio/Details.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
    ],
  },
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
