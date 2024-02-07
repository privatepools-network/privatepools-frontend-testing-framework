import { DashboardSvg } from '@/assets/icons/dashboardIcon'
import { TrackIcon } from '@/assets/icons/TrackIcon'
// import { LiquiditySvg } from '@/assets/icons/liquidityIcon'
import { ManageSvg } from './assets/icons/manage'
//import { AdminIcon } from './assets/icons/AdminIcon'
// import { BotSvg } from './assets/icons/bot'
import { MyPortfolioIcon } from './assets/icons/MyPortfolioIcon'
// import { SimulatorSvg } from './assets/icons/simulator'
// import { botLiveFeedSvg } from './assets/icons/botLiveFeed'

export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: DashboardSvg,
  },
  {
    component: 'CNavGroup',
    name: 'Track',
    to: '/track',
    icon: TrackIcon,
    items: [
      {
        component: 'CNavItem',
        name: 'Track Trades',
        to: '/track/trades',
      },
      // {
      //   component: 'CNavItem',
      //   name: 'Track Opportunities',
      //   to: '/track/opportunities',
      // },
      {
        component: 'CNavItem',
        name: 'Tracking Info',
        to: '/track/tracking_info',
      },
      // {
      //   component: 'CNavItem',
      //   name: 'Track Pools',
      //   to: '/track/pools',
      // },
      /* {
        component: 'CNavItem',
        name: 'Track Funds',
        to: '/track/funds',
      },*/
    ],
  },
  {
    component: 'CNavItem',
    name: 'Pools',
    to: '/pools',
    icon: ManageSvg,
    // items: [
    //   {
    //     component: 'CNavItem',
    //     name: 'Manage Pools',
    //     to: '/manage/pools',
    //   },
    // ],
  },
  // {
  //   component: 'CNavItem',
  //   name: 'Rewards',
  //   to: '/rewards',
  //   icon: MyPortfolioIcon,
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Changelog',
  //   to: '/changelog',
  //   icon: ManageSvg,
  // },
  {
    component: 'CNavItem',
    name: 'Portfolio',
    to: '/portfolio',
    icon: MyPortfolioIcon,
  },
  // {
  //   component: 'CNavItem',
  //   name: 'Simulator',
  //   to: '/simulator',
  //   icon: SimulatorSvg,
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Bot Live Feed',
  //   to: '/botLiveFeed',
  //   icon: botLiveFeedSvg,
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Manage Bot',
  //   to: '/admin/bot',
  //   icon: AdminIcon,
  // },
  //   {
  //   component: 'CNavItem',
  //   name: 'Whitelist',
  //   to: '/whitelist',
  //   icon: AdminIcon,
  // },
]
