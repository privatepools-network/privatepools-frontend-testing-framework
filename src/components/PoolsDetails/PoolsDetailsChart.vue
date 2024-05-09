<template>
  <div class="pools_chart_container">
    <PoolDetailsArbitrageBot
      @changeToDepositView="changeToDepositView"
      @changeToWithdrawView="changeToWithdrawView"
      :chart_data="all_chart_data"
      :tokenPrices="poolTokenPrices"
      :currencySelected="currencySelected"
      :cryptocomparePrices="tokenPrices"
      :swapsData="swapsData"
      :pool="pool"
      :historical_tvl="FormatHistoricalTvl(historical_tvl)"
      :chainSelected="chainSelectedName"
      :userBalance="userBalance"
    />

    <div class="track_chart_card bg-white dark:!bg-[#22222224]">
      <div v-if="dataRevenues.length == 0" class="chart_inside">
        <LoaderPulse />
      </div>
      <div
        v-else-if="
          dataRevenues.length > 0 && selectedOverallTab === t('overall_view')
        "
        class="chart_inside"
      >
        <ChartTimeline
          :isCumulativeMode="isCumulativeMode"
          :currentTimeline="currentTimeline"
          :timelines="timelines"
          @changeCumulativeMode="changeCumulativeMode"
          @changeTimeline="changeTimeline"
        />
        <img :src="logo" alt="D3" class="chart-logo" height="40px" />
        <VChart
          ref="chart"
          class="chart"
          :option="optionObj"
          @legendselectchanged="legendSelectedChange"
          :autoresize="true"
          :notMerge="true"
          :lazyUpdate="true"
          :silent="true"
        />
      </div>
      <div
        v-else
        class="d-flex flex-column gap-2 justify-content-center align-items-center h-100"
      >
        <svg
          width="74"
          height="72"
          viewBox="0 0 74 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 51.4851L9.664 48.0541C12.2844 46.7035 15.1774 46 18.1111 46C21.0448 46 23.9378 46.7035 26.5582 48.0541L28.5529 49.083C31.1733 50.4337 34.0663 51.1372 37 51.1372C39.9337 51.1372 42.8267 50.4337 45.4471 49.083L47.4418 48.0541C50.0622 46.7035 52.9552 46 55.8889 46C58.8226 46 61.7156 46.7035 64.336 48.0541L71 51.4851M3 69L9.664 65.5651C12.2844 64.2145 15.1774 63.511 18.1111 63.511C21.0448 63.511 23.9378 64.2145 26.5582 65.5651L28.5529 66.594C31.1733 67.9447 34.0663 68.6481 37 68.6481C39.9337 68.6481 42.8267 67.9447 45.4471 66.594L47.4418 65.5651C50.0622 64.2145 52.9552 63.511 55.8889 63.511C58.8226 63.511 61.7156 64.2145 64.336 65.5651L71 69"
            stroke="#1E5973"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M37.5 18.525C48.2707 18.525 57 14.884 57 10.3974C57 5.91091 48.2707 2.2699 37.5 2.2699C26.7293 2.2699 18 5.91091 18 10.3974C18 14.884 26.7293 18.525 37.5 18.525ZM37.5 31.5199C30.058 31.5199 23.4768 29.7299 19.3254 26.9648C18.4799 27.8789 18 28.8615 18 29.8974C18 34.384 26.7293 38.025 37.5 38.025C48.2707 38.025 57 34.384 57 29.8974C57 28.8615 56.5201 27.8789 55.6746 26.9724C51.5232 29.7299 44.942 31.5199 37.5 31.5199ZM37.5 21.7699C30.058 21.7699 23.4768 19.9799 19.3254 17.2148C18.4799 18.1289 18 19.1115 18 20.1474C18 24.634 26.7293 28.275 37.5 28.275C48.2707 28.275 57 24.634 57 20.1474C57 19.1115 56.5201 18.1289 55.6746 17.2224C51.5232 19.9799 44.942 21.7699 37.5 21.7699Z"
            fill="#7D7D7D"
          />
        </svg>

        <div
          class="text-black dark:!text-white"
          style="font-size: 12px; text-align: center"
        >
          {{ $t('please_add_liq_to_see') }}
        </div>
        <div class="add_liq_btn_pools">
          <div class="d-flex gap-1">+ {{ $t('add_liquidity') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ChartTimeline from '@/UI/ChartTimeline.vue'
import {
  ref,
  computed,
  defineProps,
  toRefs,
  onMounted,
  watch,
  defineEmits,
} from 'vue'
import {
  TitleComponent,
  LegendComponent,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  MarkPointComponent,
} from 'echarts/components'
import * as echarts from 'echarts'
import { BarChart, CandlestickChart, LineChart } from 'echarts/charts'
import VChart from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { use } from 'echarts/core'
import logo from '@/assets/images/d3v.png'
import PoolDetailsArbitrageBot from '@/components/PoolsDetails/PoolDetailsArbitrageBot.vue'
import { DisplayNetwork } from '@/composables/useNetwork'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import { FormatHistoricalTvl } from '@/lib/formatter/poolTvlFormatter'
import {
  sumFields,
  groupTimestampsByDayWithIndexes,
  groupTimestampsByWeekWithIndexes,
  groupTimestampsByMonthWithIndexes,
  stringToColor,
} from '@/lib/utils'
import {
  CalculateAvgApr,
  CalculateVolatilityIndex,
  CalculateSharpeRatio,
  CalculateSortinoRatio,
} from '@/composables/math/chartMath/trackingInfoMath.js'
import { InitTreasuryYields } from '@/composables/api/useTreasuryYields'
import { addEmptyDays } from '@/lib/formatter/chart/chartFormatter'
import { isRightChainName } from '@/composables/pools/usePoolSwapsStats'
import { t } from 'i18next'
import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'
import router from '@/router'

const settingsStore = useSettings();

const { currentCurrency } = storeToRefs(settingsStore)
use([
  CanvasRenderer,
  CandlestickChart,
  TitleComponent,
  LineChart,
  BarChart,
  LegendComponent,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  MarkPointComponent,
])
const chart = ref(null)
const props = defineProps([
  'changeToDepositView',
  'changeToWithdrawView',
  'historical_tvl',
  'tokenPrices',
  'pool',
  'swapsData',
  'chainSelected',
  'all_chart_data',
  'poolTokenPrices',
  'symbol',
  'chainSelected',
  'currencySelected',
  'selectedOverallTab',
  'userBalance',
])
const {
  historical_tvl,
  poolTokenPrices,
  tokenPrices,
  pool,
  swapsData,
  chainSelected,
  all_chart_data,
  userBalance,
} = toRefs(props)
const chainSelectedName = computed(() => DisplayNetwork[chainSelected.value])

const filteredData = computed(() =>
  all_chart_data.value && all_chart_data.value.length > 0
    ? getFilteredData()
    : [],
)

const preFiltersList = computed(() =>
  props.selectedOverallTab === t('overall_view')
    ? [
        {
          title: 'Revenue',
          code: 'Revenue',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Revenue',
          code: 'Revenue_ETH',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Revenue',
          code: 'Revenue_BTC',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Gas Fees',
          code: 'Gas Fees',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Gas Fees',
          code: 'Gas Fees_ETH',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Gas Fees',
          code: 'Gas Fees_BTC',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Trades',
          code: 'Trades',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Volume',
          code: 'Volume',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Volume',
          code: 'Volume_ETH',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Volume',
          code: 'Volume_BTC',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'TVL',
          code: 'TVL',
          isSolo: true,
          selected: true,
          cumulable: false,
        },
        {
          title: 'TVL',
          code: 'TVL_ETH',
          isSolo: true,
          selected: true,
          cumulable: false,
        },
        {
          title: 'TVL',
          code: 'TVL_BTC',
          isSolo: true,
          selected: true,
          cumulable: false,
        },

        {
          title: 'Average APR',
          code: 'Average APR',
          isSolo: true,
          selected: true,
          cumulable: false,
        },

        {
          title: 'Profit',
          code: 'Profits',
          isSolo: true,
          selected: true,
          cumulable: false,
        },
        {
          title: 'Profit',
          code: 'Profits_ETH',
          isSolo: true,
          selected: true,
          cumulable: false,
        },
        {
          title: 'Profit',
          code: 'Profits_BTC',
          isSolo: true,
          selected: true,
          cumulable: false,
        },
        {
          title: 'Capital Gains',
          code: 'Capital Gains',
          isSolo: true,
          selected: true,
          cumulable: false,
        },
        {
          title: 'PNL',
          code: 'PNL',
          isSolo: true,
          selected: true,
          cumulable: false,
        },
        {
          title: 'Volatility Index',
          code: 'Volatility Index',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
      ]
    : [
        {
          title: 'Revenue',
          code: 'Revenue',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Revenue',
          code: 'Revenue_ETH',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Revenue',
          code: 'Revenue_BTC',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Gas Fees',
          code: 'Gas Fees',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Gas Fees',
          code: 'Gas Fees_ETH',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Gas Fees',
          code: 'Gas Fees_BTC',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Trades',
          code: 'Trades',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Volume',
          code: 'Volume',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Volume',
          code: 'Volume_ETH',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Volume',
          code: 'Volume_BTC',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'TVL',
          code: 'TVL',
          isSolo: true,
          selected: true,
          cumulable: false,
        },
        {
          title: 'TVL',
          code: 'TVL_ETH',
          isSolo: true,
          selected: true,
          cumulable: false,
        },
        {
          title: 'TVL',
          code: 'TVL_BTC',
          isSolo: true,
          selected: true,
          cumulable: false,
        },

        {
          title: 'Average APR',
          code: 'Average APR',
          isSolo: true,
          selected: true,
          cumulable: false,
        },

        {
          title: 'Profit',
          code: 'Profit',
          isSolo: true,
          selected: true,
          cumulable: false,
        },
        {
          title: 'Profit',
          code: 'Profit_ETH',
          isSolo: true,
          selected: true,
          cumulable: false,
        },
        {
          title: 'Profit',
          code: 'Profit_BTC',
          isSolo: true,
          selected: true,
          cumulable: false,
        },
        {
          title: 'Capital Gains',
          code: 'Capital Gains',
          isSolo: true,
          selected: true,
          cumulable: false,
        },
        {
          title: 'PNL',
          code: 'PNL',
          isSolo: true,
          selected: true,
          cumulable: false,
        },
        {
          title: 'ROI',
          code: 'ROI',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Token Incentives',
          code: 'Token Incentives',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Volatility Index',
          code: 'Volatility Index',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
        {
          title: 'Pool percentage',
          code: 'Pool percentage',
          isSolo: true,
          selected: true,
          cumulable: true,
        },
      ],
)
const filters = ref({
  Revenue: true,
  ['Gas Fees']: true,
  ['Trades']: true,
  Volume: true,
  TVL: true,
  ['Average APR']: true,
  ['Profit']: true,
  ['Capital Gains']: true,
  ['PNL']: true,
  ['ROI']: true,
  ['Token Incentives']: true,
  ['Pool Percentage']: true,
  ['Rewards']: true,
  ['Staked Liquidity']: true,
})
const assets = computed(() =>
  pool.value ? Array.from(new Set(pool.value.tokens.map((t) => t.symbol))) : [],
)


function legendSelectedChange(e) {
  for (const [key, value] of Object.entries(e.selected)) {
    filters.value[key] = value
  }
}

const filterKeys = computed(() => Object.keys(filters.value))

const timelines = [
  // {
  //   name: 'All-time',
  // },
  {
    name: t('daily'),
  },
  {
    name: t('weekly'),
  },
  {
    name: t('monthly'),
  },
]

const isCumulativeMode = ref(false)
const currentTimeline = ref(timelines[0])

function changeTimeline(tl) {
  currentTimeline.value = tl
}
function changeCumulativeMode() {
  isCumulativeMode.value = !isCumulativeMode.value
}

const postfix = computed(() => currentCurrency.value == "USD" ? "" : `_${currentCurrency.value}`)

const dates = computed(() => {
  return filteredData.value.map((v) => v.Date)
})
const dataGasFees = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Gas Fees').selected)
    return filteredData.value.map((v) => v[`Gas Fees${postfix.value}`])
  return []
})
const dataRevenues = computed(() => {
  return filteredData.value.map((v) => v[`Revenue${postfix.value}`])
})

const dataVolumes = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Volume').selected)
    return filteredData.value.map((v) => v[`Volume${postfix.value}`])
  return []
})
const dataTrades = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Trades').selected)
    return filteredData.value.map((v) => v['Trades'])
  return []
})

const dataAvgApr = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Average APR').selected)
    return filteredData.value.map((v) => v['Average APR'])
  return []
})

const dataVolatilityIndexes = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Volatility Index').selected)
    return filteredData.value.map((v) => v['Volatility Index'])
  return []
})

const dataTvl = computed(() => {
  if (filteredData.value.length > 0 && filteredData.value[0].TVL)
    return filteredData.value.map((v) => v[`TVL${postfix.value}`][chainSelectedName.value])
  return []
})

const dataProfits = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Profits').selected)
    return filteredData.value.map((v) => v[`Profits${postfix.value}`])
  return []
})

const convertFromNumber = (str) => {
  let number = parseFloat(str)

  let suffix = ''
  if (number >= 1e9) {
    suffix = 'b'
    number /= 1e9
  } else if (number >= 1e6) {
    suffix = 'm'
    number /= 1e6
  } else if (number >= 1e3) {
    suffix = 'k'
    number /= 1e3
  }

  const result = number + suffix
  return result
}

const series = computed(() =>
  props.selectedOverallTab === t('overall_view')
    ? [
        {
          type: 'bar',
          name: 'Revenue',
          data: dataRevenues.value,
          color: router.currentRoute.value.path.includes('CLdetails') ? '#803D00' : '#01B47E',
          sampling: 'lttb',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: router.currentRoute.value.path.includes('CLdetails') ? '#803D00' : '#01B47E',
              },
              {
                offset: 1,
                color: 'transparent',
              },
            ]),
          },
          smooth: true,
          showSymbol: false,
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
            color: router.currentRoute.value.path.includes('CLdetails') ? '#803D00' : '#01B47E',
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },

        {
          name: 'Gas Fees',
          type: 'bar',
          data: dataGasFees.value,
          color: router.currentRoute.value.path.includes('CLdetails') ? '#4AFF7D' : '#4AFF7D',

          sampling: 'lttb',
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
            color: router.currentRoute.value.path.includes('CLdetails') ? '#4AFF7D' : '#4AFF7D',
          },
          smooth: true,
          showSymbol: false,

          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
        {
          name: 'Average APR',
          type: 'line',
          data: dataAvgApr.value,
          color: router.currentRoute.value.path.includes('CLdetails') ? '#00DC3E' : '#00DC3E',
          sampling: 'lttb',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: router.currentRoute.value.path.includes('CLdetails') ? '#00DC3E' : '#00DC3E',
              },
              {
                offset: 1,
                color: 'transparent',
              },
            ]),
          },
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
            color: router.currentRoute.value.path.includes('CLdetails') ? '#00DC3E' : '#00DC3E',
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
        {
          name: 'Volume',
          type: 'bar',
          data: dataVolumes.value,
          color: router.currentRoute.value.path.includes('CLdetails') ? '#8AFF42' : '#8AFF42',
          sampling: 'lttb',
          areaStyle: {},
          xAxisIndex: 0,
          yAxisIndex: 1,
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: router.currentRoute.value.path.includes('CLdetails') ? '#8AFF42' : '#8AFF42',
            borderRadius: [5, 5, 0, 0],
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
        {
          name: 'Trades',
          type: 'bar',
          data: dataTrades.value,
          color: router.currentRoute.value.path.includes('CLdetails') ? '#FB800F' : '#1AB401',
          sampling: 'lttb',
          areaStyle: {},

          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: router.currentRoute.value.path.includes('CLdetails') ? '#FB800F' : '#1AB401',
            borderRadius: [5, 5, 0, 0],
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
        {
          type: 'line',
          name: 'Volatility Index',
          data: dataVolatilityIndexes.value,
          color: '#FF8FD6',
          sampling: 'lttb',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#FF8FD6',
              },
              {
                offset: 1,
                color: 'transparent',
              },
            ]),
          },
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
            color: '#FF8FD6',
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
        {
          type: 'line',
          name: 'TVL',
          data: dataTvl.value,
          color: router.currentRoute.value.path.includes('CLdetails') ? '#B3F007' : '#B3F007',
          sampling: 'lttb',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: router.currentRoute.value.path.includes('CLdetails') ? '#B3F007' : '#B3F007',
              },
              {
                offset: 1,
                color: 'transparent',
              },
            ]),
          },
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
            color: router.currentRoute.value.path.includes('CLdetails') ? '#B3F007' : '#B3F007',
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
        {
          type: 'bar',
          name: 'Profit',
          data: dataProfits.value,
          color: router.currentRoute.value.path.includes('CLdetails') ? '#05FF00' : '#05FF00',
          sampling: 'lttb',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: router.currentRoute.value.path.includes('CLdetails') ? '#05FF00' : '#05FF00',
              },
              {
                offset: 1,
                color: 'transparent',
              },
            ]),
          },
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: router.currentRoute.value.path.includes('CLdetails') ? '#05FF00' : '#05FF00',
            borderRadius: [5, 5, 0, 0],
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        }
      ]
    : [
        {
          type: 'bar',
          name: 'PNL',
          data: dataTrades.value,
          color: router.currentRoute.value.path.includes('CLdetails') ? '#FB800F' : '#70FF00',
          sampling: 'lttb',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: router.currentRoute.value.path.includes('CLdetails') ? '#FB800F' : '#70FF00',
              },
              {
                offset: 1,
                color: 'transparent',
              },
            ]),
          },
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: router.currentRoute.value.path.includes('CLdetails') ? '#FB800F' : '#70FF00',
            borderRadius: [5, 5, 0, 0],
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
        {
          name: 'Trades',
          type: 'bar',
          data: dataTrades.value,
          color: router.currentRoute.value.path.includes('CLdetails') ? '#FB800F' : '#1AB401',
          sampling: 'lttb',
          areaStyle: {},

          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: router.currentRoute.value.path.includes('CLdetails') ? '#FB800F' : '#1AB401',
            borderRadius: [5, 5, 0, 0],
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
        {
          name: 'Volume',
          type: 'bar',
          data: dataVolumes.value,
          color: router.currentRoute.value.path.includes('CLdetails') ? '#8AFF42' : '#8AFF42',
          sampling: 'lttb',
          areaStyle: {},
          xAxisIndex: 0,
          yAxisIndex: 1,
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: router.currentRoute.value.path.includes('CLdetails') ? '#8AFF42' : '#8AFF42',
            borderRadius: [5, 5, 0, 0],
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
        {
          type: 'line',
          name: 'Staked Liquidity',
          data: dataRevenues.value,
          color: '#B3F007',
          sampling: 'lttb',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#B3F007',
              },
              {
                offset: 1,
                color: 'transparent',
              },
            ]),
          },
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
            color: '#B3F007',
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
        {
          name: 'Average APR',
          type: 'line',
          data: dataAvgApr.value,
          color: router.currentRoute.value.path.includes('CLdetails') ? '#00DC3E' : '#00DC3E',
          sampling: 'lttb',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: router.currentRoute.value.path.includes('CLdetails') ? '#00DC3E' : '#00DC3E',
              },
              {
                offset: 1,
                color: 'transparent',
              },
            ]),
          },
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
            color: router.currentRoute.value.path.includes('CLdetails') ? '#00DC3E' : '#00DC3E',
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
        {
          type: 'bar',
          name: 'Rewards',
          data: dataRevenues.value,
          color: router.currentRoute.value.path.includes('CLdetails') ? '#05FF00' : '#05FF00',
          sampling: 'lttb',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: router.currentRoute.value.path.includes('CLdetails') ? '#05FF00' : '#05FF00',
              },
              {
                offset: 1,
                color: 'transparent',
              },
            ]),
          },
          smooth: true,
          showSymbol: false,
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
            color: router.currentRoute.value.path.includes('CLdetails') ? '#05FF00' : '#05FF00',
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
        {
          type: 'bar',
          name: 'Capital Gains',
          data: dataVolatilityIndexes.value,
          color: '#F0DA0F',
          sampling: 'lttb',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#F0DA0F',
              },
              {
                offset: 1,
                color: 'transparent',
              },
            ]),
          },
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: '#F0DA0F',
            borderRadius: [5, 5, 0, 0],
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
        {
          type: 'line',
          name: 'ROI',
          data: dataVolatilityIndexes.value,
          color: router.currentRoute.value.path.includes('CLdetails') ? '#00DC3E' : '#432102',
          sampling: 'lttb',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: router.currentRoute.value.path.includes('CLdetails') ? '#00DC3E' : '#432102',
              },
              {
                offset: 1,
                color: 'transparent',
              },
            ]),
          },
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
            color: router.currentRoute.value.path.includes('CLdetails') ? '#00DC3E' : '#432102',
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
        {
          type: 'line',
          name: 'Pool Percentage',
          data: dataRevenues.value,
          color: '#FF8FD6',
          sampling: 'lttb',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#FF8FD6',
              },
              {
                offset: 1,
                color: 'transparent',
              },
            ]),
          },
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
            color: '#FF8FD6',
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
          },
        },
      ],
)

const optionObj = ref({
  legend: {
    data: filterKeys,
    selected: filters,
    top: -5,
    left: 10,
    bottom: 30,
    width: '50%',
    inactiveColor: '#777',
    textStyle: {
      color: '#ccc',
      fontSize: '10px',
      fontFamily: 'Montserrat',
      fontWeight: 700,
    },
  },
  axisPointer: {
    label: {
      fontSize: 8,
    },
  },
  tooltip: {
    backgroundColor: 'rgba(73, 73, 73, 0.65)',
    borderWidth: 0,
    textStyle: {
      color: 'white',
    },
    trigger: 'axis',
    confine: true,
    axisPointer: {
      type: 'cross',
      lineStyle: {
        color: '#f1f1f1',
        width: 1,
        opacity: 0.7,
      },
    },
    formatter: (params) => {
      return `
                ${params[0].name} <br />
                ${params
                  .map((el) =>
                    el.seriesName === 'Revenue' ||
                    el.seriesName === 'Profits' ||
                    el.seriesName === 'TVL' ||
                    el.seriesName === 'Gas Fees' ||
                    el.seriesName === 'Volume'
                      ? `${el.marker} ${el.seriesName}: ${props.symbol}${
                          el.value ? el.value.toFixed(3) : 0
                        } <br />`
                      : el.seriesName === 'Average APR' ||
                        el.seriesName === 'Volatility Index'
                      ? `${el.marker} ${el.seriesName}: ${
                          el.value ? el.value.toFixed(3) : 0
                        }% <br />`
                      : el.seriesName === 'Trades'
                      ? `${el.marker} ${el.seriesName}: ${
                          el.value ? el.value.toFixed(3) : 0
                        } Trades  <br />`
                      : `${el.marker} ${el.seriesName}: ${
                          el.value ? el.value.toFixed(3) : 0
                        } <br />`,
                  )
                  .join('')}
                `
    },
  },
  xAxis: [
    {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#8392A5' } },
    },
  ],
  yAxis: [
    {
      scale: true,
      axisLine: { lineStyle: { color: '#8392A5' } },
      min: 0,

      gridIndex: 0,
      splitLine: {
        lineStyle: {
          color: 'rgba(51,51,51, 0.35)',
        },
      },
      axisLabel: {
        formatter: function (value) {
          return `${convertFromNumber(value)}`
        },
      },
    },
    {
      type: 'value',
      name: 'Volume',
      gridIndex: 0,
      min: 0,

      position: 'right',
      alignTicks: true,
      axisTick: { show: false },
      splitLine: { show: false },
      axisLine: {
        show: true,
        lineStyle: { color: router.currentRoute.value.path.includes('CLdetails') ? '#8AFF42' : '#8AFF42' },
      },
      axisLabel: {
        formatter: function (value) {
          return convertFromNumber(value)
        },
      },
    },
    {
      type: 'value',
      name: 'TVL',
      min: 0,

      position: 'right',
      offset: 60,
      alignTicks: true,
      axisTick: { show: false },
      splitLine: { show: false },
      axisLine: {
        show: true,
        lineStyle: { color: router.currentRoute.value.path.includes('CLdetails') ? '#B3F007' : '#B3F007' },
      },

      axisLabel: {
        formatter: function (value) {
          return convertFromNumber(value)
        },
      },
      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
    },
  ],
  grid: [
    {
      left: '5%',
      right: '10%',
      top: 120,
      bottom: 155,
    },
  ],
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: 0,
      start: 90,
      end: 100,
    },
    {
      show: true,
      xAxisIndex: 0,
      type: 'slider',
      bottom: 70,
      start: 90,
      end: 100,
      selectedDataBackground: {
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: 'orange',
            },
            {
              offset: 1,
              color: 'transparent',
            },
          ]),
        },
      },
    },
  ],
  series: series,
  media: [
    {
      option: {
        tooltip: {
          textStyle: {
            fontSize: 14,
          },
        },
        legend: {
          itemWidth: 25,
          itemHeight: 14,
          textStyle: {
            fontSize: 14,
          },
        },
        xAxis: {
          axisLabel: {
            fontSize: 12,
          },
        },
        yAxis: {
          axisLabel: {
            fontSize: 12,
          },
        },
      },
    },
    {
      query: {
        maxWidth: 1400,
      },
      option: {
        tooltip: {
          textStyle: {
            fontSize: 9,
          },
        },
        legend: {
          itemWidth: 19,
          itemHeight: 10,
          textStyle: {
            fontSize: 10,
          },
        },
        xAxis: {
          axisLabel: {
            fontSize: 8,
          },
        },
        yAxis: [
          {
            nameTextStyle: {
              fontSize: 10,
            },
            axisLabel: {
              fontSize: 8,
            },
          },
          {
            nameTextStyle: {
              fontSize: 10,
            },
            axisLabel: {
              fontSize: 8,
            },
          },
          {
            nameTextStyle: {
              fontSize: 10,
            },
            axisLabel: {
              fontSize: 8,
            },
          },
        ],
      },
    },
  ],
})

const item = ref(null)

watch(props, () => {
  console.log('props.selectedOverallTab', props.selectedOverallTab)

  // item.value = props.selectedOverallTab
  if (chart.value) {
    chart.value.setOption(optionObj.value, {
      replaceMerge: ['series'],
    })
  }
})

const TimelineFilters = {
  // 'All-time': groupTimestampsByDayWithIndexes,
  [t('daily')]: groupTimestampsByDayWithIndexes,
  [t('weekly')]: groupTimestampsByWeekWithIndexes,
  [t('monthly')]: groupTimestampsByMonthWithIndexes,
}

function sumAssetsProfits(previous_items) {
  let token_profits = { ...previous_items[0]['Token Profits'] }
  for (let i = 1; i < previous_items.length; i++) {
    for (const [key, value] of Object.entries(
      previous_items[i]['Token Profits'],
    )) {
      token_profits[key] += parseFloat(value)
    }
  }
  return token_profits
}

function getFilteredData() {
  let result = []
  let chart_data = all_chart_data.value.filter(
    (d) =>
      isRightChainName(d.Blockchain, chainSelectedName.value) ||
      d.Blockchain == '',
  )
  //chart_data = addEmptyDays(chart_data)
  let timestamps = chart_data.map((v) => v.timestamp)
  let indexes = TimelineFilters[currentTimeline.value.name](timestamps)
  indexes = indexes.sort((a, b) => a - b)
  let selectedFilters = preFiltersList.value.filter((v) => v.selected)
  let selectedCumulableCodes = selectedFilters
    .filter((v) => v.cumulable)
    .map((v) => v.code)
  for (let i = 0; i < indexes.length; i++) {
    let start_index = i == 0 ? 0 : indexes[i - 1] + 1
    let end_index = indexes[i] + 1
    let previousItems = chart_data.slice(start_index, end_index)
    let notFilterdPreviousItems = [...previousItems]
    previousItems = previousItems.filter(
      (p) =>
        p.Blockchain == '' ||
        isRightChainName(p.Blockchain, chainSelectedName.value),
    )
    let item = {
      ...chart_data[indexes[i]],
      ...sumFields(previousItems, selectedCumulableCodes),
    }
    item['Token Profits'] = sumAssetsProfits(previousItems)
    let profitItem = sumFields(notFilterdPreviousItems, [`Profits${postfix.value}`])
    let result_item = {
      Blockchain: item.Blockchain,
      timestamp: item.timestamp,
      Date: item.Date,
    }
    for (let k = 0; k < selectedFilters.length; k++) {
      let filter_code = selectedFilters[k].code
      if (Object.hasOwn(item, filter_code)) {
        if (isCumulativeMode.value && selectedFilters[k].cumulable) {
          let previous_value =
            result.length == 0 ? 0 : result[result.length - 1][filter_code]
          result_item[filter_code] = item[filter_code] + previous_value
        } else {
          result_item[filter_code] = item[filter_code]
        }
      }
      let avg_apr = CalculateAvgApr(
        profitItem,
        notFilterdPreviousItems,
        currentTimeline.value.name,
        chainSelectedName.value,
      )
      if (filter_code == 'Average APR') {
        result_item[filter_code] = avg_apr
      }
      let isTvlLessThan1 =
        chart_data[indexes[i]].TVL[chainSelectedName.value] < 1

      if (
        assets.value.length > 0 &&
        tokenPrices.value &&
        tokenPrices.value.length > 0
      ) {
        let volatility_index = null
        if (filter_code == 'Volatility Index') {
          result_item[filter_code] = !isTvlLessThan1
            ? CalculateVolatilityIndex(
                chainSelectedName.value,
                notFilterdPreviousItems,
                tokenPrices.value,
                currentTimeline.value.name,
                assets.value,
              )
            : 0
          volatility_index = result_item[filter_code]
        }

        if (filter_code == 'Sharpe Ratio') {
          result_item[filter_code] = !isTvlLessThan1
            ? CalculateSharpeRatio(
                chainSelectedName.value,
                notFilterdPreviousItems,
                tokenPrices.value,
                currentTimeline.value.name,
                assets.value,
                avg_apr,
                result_item.timestamp,
                volatility_index,
              )
            : 0
        }
        if (filter_code == 'Sortino Ratio') {
          result_item[filter_code] = !isTvlLessThan1
            ? CalculateSortinoRatio(
                chainSelectedName.value,
                notFilterdPreviousItems,
                tokenPrices.value,
                currentTimeline.value.name,
                assets.value,
                avg_apr,
                result_item.timestamp,
                null,
              )
            : 0
        }
      }
    }
    result.push(result_item)
  }
  console.log('result', result)
  return result
}
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.pools_chart_container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  /* gap: 10px; */
}

@media (min-width: $xl) {
  .pools_chart_container {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    /* gap: 15px; */
  }
}

.chart-logo {
  position: relative;
  top: 42%;
  left: 45%;
  opacity: 0.15;
  height: 40px;
}

.chart {
  &-filters {
    display: flex;
    align-items: flex-start;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 12px 5px;

    &__el {
      color: #fff;
      font-size: 12px;
      margin-right: 2px;
      display: flex;
      flex-direction: column;
      position: relative;
      cursor: pointer;

      @media all {
        /* margin-bottom: 10px; */
      }

      &:hover {
        background-color: #00c9ffcb;
        cursor: pointer;
        color: rgb(255, 255, 255);
        border-radius: 20px;
      }

      &_progress {
        /* cursor: progress; */
        /* opacity: 0.6; */

        .chart-filters__title {
          &:hover {
            background: none;
          }
        }
      }

      &_active {
        font-size: 12px;
        margin-right: 2px;

        .chart-filters__title {
          background: #00c9ff;
          color: #fff;

          &:hover {
            background-color: rgba(#00c9ff, 0.5);
            cursor: pointer;
            color: #fff;
          }
        }
      }

      &_opened {
        .chart-filters__title {
          border-bottom: 1px solid #fff;
          border-radius: 12px 12px 0 0;
          background: none;

          .chart-filters__dropdown-icon {
            transform-origin: center;
            transform: rotate(180deg);
          }
        }
      }
    }

    &__toggling {
      display: flex;
      justify-content: space-between;
      padding: 6px 7px 12px 6px;
    }

    &__toggler {
      color: #00c9ff;
      font-size: 11px;
      font-weight: 300;
      text-decoration-line: underline;
    }

    &__dropdown-icon {
      transition: 0.3s;
    }

    &__title {
      padding: 8px 10px;
      border-radius: 20px;
      border: 1px solid #7ef6b2;
      color: rgba(126, 246, 178, 1);

      &:hover {
        background-color: rgba(#00c9ff, 0.3);
      }
    }

    &__option {
      padding: 8px 6px;
      align-items: center;
      display: flex;
      justify-content: space-between;

      svg {
        margin-right: 10px;
        display: none;
      }

      &:last-child {
        border-radius: 0 0 12px 12px;
      }

      &:hover {
        background-color: rgba(#00c9ff, 0.3);
      }

      &_selected {
        svg {
          display: block;
        }

        &:hover {
          background-color: rgba(#00c9ff, 0.3);
        }
      }
    }

    &__options {
      width: 120px;
      top: 100%;
      position: absolute;
      background: #000;
      z-index: 11;
      border: 1px solid #00c9ff;
      border-top: none;
      border-radius: 0 0 12px 12px;
    }
  }

  &-equivalent {
    padding: 0px;
    color: #00c9ff;
    font-size: clamp(8px, 0.5vw, 12px);
    margin-right: 15px;
    display: flex;
    justify-self: flex-start;
    border-radius: 20px;
    border: 1px solid #00c9ff;

    &__el {
      padding: 8px 15px;
      cursor: pointer;
      border-radius: 20px;

      &:hover {
        background: rgba(#00c9ff, 0.3);
      }

      &_active {
        background: #00c9ff;
        color: #fff;

        &:hover {
          background: #00c9ff;
        }
      }
    }
  }

  &-wrapper {
    display: flex;
    width: 100%;
    margin-bottom: 14px;

    @media all and (max-width: 576px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &-timeline {
    width: 100%;
    margin-right: auto;

    @media all and (max-width: 576px) {
      margin-left: 0;
      margin-top: 10px;
    }
  }

  &-loading {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.track_chart_card {
  border-radius: 0px 20px 20px 0px;
  width: 100%;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 4px 0px #00000040;
}

.timeline_container {
  width: fit-content;
  display: block;
  position: relative;
  top: 25px;
  margin-left: auto;
  right: 0px;

  z-index: 11;
}

.chart_inside {
  width: 100%;
  height: 100%;
}

@media (max-width: $xxl) {
  .track_chart_card {
    width: 100%;
  }

  .chart_inside {
    width: 100%;
    height: 470px;
  }

  .chart-filters {
    gap: 5px 2px;
  }
}

@media (max-width: $sm) {
  .timeline_container {
    width: 100%;
  }

  .chart {
    &-equivalent {
      padding: 0px;
      color: #fff;
      font-size: clamp(8px, 0.7vw, 14px);
      margin-right: 15px;
      display: flex;
      flex-direction: column;
      border-radius: 20px;
      border: 1px solid #00c9ff;
    }
  }
}


</style>
