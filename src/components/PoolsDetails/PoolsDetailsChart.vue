<template>
  <div class="pools_chart_container">
    <PoolDetailsArbitrageBot @changeToDepositView="changeToDepositView" @changeToWithdrawView="changeToWithdrawView"
      :chart_data="all_chart_data" :tokenPrices="poolTokenPrices" :currencySelected="currencySelected"
      :cryptocomparePrices="tokenPrices" :swapsData="swapsData" :pool="pool"
      :historical_tvl="FormatHistoricalTvl(historical_tvl)" :chainSelected="chainSelectedName"
      :userBalance="userBalance" />

    <div class="track_chart_card bg-white dark:!bg-[#22222224]">
      <div v-if="dataRevenues.length == 0" class="chart_inside">
        <LoaderPulse />
      </div>
      <div v-else-if="
        dataRevenues.length > 0 && selectedOverallTab === t('overall_view')
      " class="chart_inside">
        <ChartTimeline :isCumulativeMode="isCumulativeMode" :currentTimeline="currentTimeline" :timelines="timelines"
          @changeCumulativeMode="changeCumulativeMode" @changeTimeline="changeTimeline" />
        <img :src="logo" alt="D3" class="chart-logo" height="40px" />
        <VChart ref="chart" class="chart mt-4" :option="optionObj" @legendselectchanged="legendSelectedChange"
          :autoresize="true" :notMerge="true" :lazyUpdate="true" :silent="true" />
      </div>
      <div v-else class="d-flex flex-column gap-2 justify-content-center align-items-center h-100">
        <svg width="74" height="72" viewBox="0 0 74 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 51.4851L9.664 48.0541C12.2844 46.7035 15.1774 46 18.1111 46C21.0448 46 23.9378 46.7035 26.5582 48.0541L28.5529 49.083C31.1733 50.4337 34.0663 51.1372 37 51.1372C39.9337 51.1372 42.8267 50.4337 45.4471 49.083L47.4418 48.0541C50.0622 46.7035 52.9552 46 55.8889 46C58.8226 46 61.7156 46.7035 64.336 48.0541L71 51.4851M3 69L9.664 65.5651C12.2844 64.2145 15.1774 63.511 18.1111 63.511C21.0448 63.511 23.9378 64.2145 26.5582 65.5651L28.5529 66.594C31.1733 67.9447 34.0663 68.6481 37 68.6481C39.9337 68.6481 42.8267 67.9447 45.4471 66.594L47.4418 65.5651C50.0622 64.2145 52.9552 63.511 55.8889 63.511C58.8226 63.511 61.7156 64.2145 64.336 65.5651L71 69"
            stroke="#1E5973" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M37.5 18.525C48.2707 18.525 57 14.884 57 10.3974C57 5.91091 48.2707 2.2699 37.5 2.2699C26.7293 2.2699 18 5.91091 18 10.3974C18 14.884 26.7293 18.525 37.5 18.525ZM37.5 31.5199C30.058 31.5199 23.4768 29.7299 19.3254 26.9648C18.4799 27.8789 18 28.8615 18 29.8974C18 34.384 26.7293 38.025 37.5 38.025C48.2707 38.025 57 34.384 57 29.8974C57 28.8615 56.5201 27.8789 55.6746 26.9724C51.5232 29.7299 44.942 31.5199 37.5 31.5199ZM37.5 21.7699C30.058 21.7699 23.4768 19.9799 19.3254 17.2148C18.4799 18.1289 18 19.1115 18 20.1474C18 24.634 26.7293 28.275 37.5 28.275C48.2707 28.275 57 24.634 57 20.1474C57 19.1115 56.5201 18.1289 55.6746 17.2224C51.5232 19.9799 44.942 21.7699 37.5 21.7699Z"
            fill="#7D7D7D" />
        </svg>

        <div class="text-black dark:!text-white" style="font-size: 12px; text-align: center">
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
import { strictCheckChartOffsetConditions } from '@/composables/chartLogic/strictCheckChartOffsetConditions'
import { checkGridByKeys } from '@/composables/chartLogic/checkGridByKeys'
import { useDevice } from '@/composables/adaptive/useDevice'

const settingsStore = useSettings()
const { width } = useDevice()

const { currentCurrency, currentVersion } = storeToRefs(settingsStore)
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
        title: 'Average APR',
        code: 'Average APR',
        isSolo: true,
        selected: true,
        cumulable: false,
      },

      {
        title: 'Profits',
        code: 'Profits',
        isSolo: true,
        selected: true,
        cumulable: true,
      },
      {
        title: 'Profits',
        code: 'Profits_ETH',
        isSolo: true,
        selected: true,
        cumulable: true,
      },
      {
        title: 'Profits',
        code: 'Profits_BTC',
        isSolo: true,
        selected: true,
        cumulable: true,
      },
      {
        title: 'Volatility Index',
        code: 'Volatility Index',
        isSolo: true,
        selected: currentVersion.value === 'pro' ? true : false,
        cumulable: false,
      },
      {
        title: 'Impermanent Loss',
        code: 'Impermanent Loss',
        isSolo: true,
        selected: currentVersion.value === 'pro' ? true : false,
        cumulable: false,
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
        title: 'Profits',
        code: 'Profits',
        isSolo: true,
        selected: true,
        cumulable: false,
      },
      {
        title: 'Profits',
        code: 'Profit_ETH',
        isSolo: true,
        selected: true,
        cumulable: false,
      },
      {
        title: 'Profits',
        code: 'Profit_BTC',
        isSolo: true,
        selected: true,
        cumulable: false,
      },
     
      {
        title: 'Volatility Index',
        code: 'Volatility Index',
        isSolo: true,
        selected: currentVersion.value === 'pro' ? true : false,
        cumulable: false,
      },
      {
        title: 'Impermanent Loss',
        code: 'Impermanent Loss',
        isSolo: true,
        selected: currentVersion.value === 'pro' ? true : false,
        cumulable: false,
      },
      
    ],
)
console.log('currentVersion', currentVersion.value)
const filters = ref(currentVersion.value === 'pro' ? {
  TVL: true,
  Revenue: false,
  ['Gas Fees']: false,
  ['Trades']: false,
  Volume: false,
  ['Average APR']: false,
  ['Profits']: false,
  ['Capital Gains']: false,
  ['Volatility Index']: false,
  ['Impermanent Loss']: false,
  // ['PNL']: true,
  // ['ROI']: true,
  // ['Token Incentives']: true,
  // ['Pool Percentage']: true,
  // ['Rewards']: true,
  // ['Staked Liquidity']: true,
} :
{
  TVL: true,
  Revenue: false,
  ['Gas Fees']: false,
  ['Trades']: false,
  Volume: false,
  ['Average APR']: false,
  ['Profits']: false,
}
)
// const assets = computed(() =>
//   pool.value ? Array.from(new Set(pool.value.tokens.map((t) => t.symbol))) : [],
// )


const days_count = {
  [t('daily')]:1,
  [t('weekly')]:7,
  [t('monthly')]:30,
}

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

const postfix = computed(() =>
  currentCurrency.value == 'USD' ? '' : `_${currentCurrency.value}`,
)

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
const dataImpermanentLosses = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Impermanent Loss').selected)
    return filteredData.value.map((v) => v['Impermanent Loss'])
  return []
})

const dataTVL = computed(() => {
  if (filteredData.value.length > 0 && filteredData.value[0].TVL)
    return filteredData.value.map(
      (v) => v[`TVL${postfix.value}`][chainSelectedName.value],
    )
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

  const result = number.toFixed(2).replace(/(\.0+|0+)$/, '') + suffix
  return result
}

const currentGridToRight = ref(40)

const showVolume = ref(false)
const showRevenueProfits = ref(false)
const showTradesGasFees = ref(false)
const showAPRVolatility = ref(false)

function yAxisInstance(name, show, offset, color) {
  return {
    type: 'value',
    name: name,
    gridIndex: 0,
    min: 0,
    show: show,
    nameLocation: 'center',
    nameGap: 38,
    nameRotate: 270,
    position: 'right',
    offset: offset,
    alignTicks: true,
    axisTick: { show: true },
    splitLine: { show: false },
    axisLine: {
      show: true,
      lineStyle: {
        color: color,
      },
    },
    nameTextStyle: {
      fontFamily: 'Syne',
      fontWeight: '700',
    },
    axisLabel: {
      fontFamily: 'Roboto mono',
      fontWeight: '700',
      formatter: function (value) {
        return convertFromNumber(value)
      },
    },
  }
}

function seriesInstance(name, type, data, yAxisIndex, color) {
  return {
    type: type,
    name: name,
    data: data,
    color: color,
    sampling: 'lttb',
    areaStyle: {
      shadowColor: color,
      shadowBlur: 20,
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: color,
        },
        {
          offset: 1,
          color: 'transparent',
        },
      ]),
    },
    xAxisIndex: 0,
    yAxisIndex: yAxisIndex,
    smooth: true,
    showSymbol: false,
    itemStyle: {
      borderRadius: [10, 10, 0, 0],
      shadowColor: color,
      shadowBlur: 10,
      color: color,
    },
    emphasis: {
      focus: 'series',
      blurScope: 'coordinateSystem',
    },
  }
}

function legendSelectedChange(e) {
  console.log('EEEE', e)
  console.log('currentGridToRight', currentGridToRight.value)
  console.log('optionObj.value.yAxis', optionObj.value.yAxis)
  for (const [key, value] of Object.entries(e.selected)) {
    filters.value[key] = value
  }

  if (e.name === 'Volume') {
    showVolume.value = !showVolume.value
    // if (showVolume.value === true) {
    //   currentGridToRight.value = currentGridToRight.value + 55
    // } else {
    //   currentGridToRight.value = currentGridToRight.value - 55
    // }
  }

  if (e.name === 'Revenue' || e.name === 'Profits') {
    if (e.selected.Revenue === false && e.selected.Profits === false) {
      showRevenueProfits.value = false
    } else if (e.selected.Revenue === true || e.selected.Profits === true) {
      showRevenueProfits.value = true
    }
  }

  if (e.name === 'Gas Fees' || e.name === 'Trades') {
    if (e.selected['Gas Fees'] === false && e.selected.Trades === false) {
      showTradesGasFees.value = false
    } else if (e.selected['Gas Fees'] === true || e.selected.Trades === true) {
      showTradesGasFees.value = true
    }
  }

  if (e.name === 'Average APR' || e.name === 'Volatility Index' || e.name === "Impermanent Loss") {
    if (
      currentVersion.value === 'pro' ? e.selected['Average APR'] === false &&
      e.selected['Volatility Index'] === false && e.selected['Impermanent Loss'] === false : e.selected['Average APR'] === false
    ) {
      showAPRVolatility.value = false
    } else if (
      e.selected['Average APR'] === true ||
      e.selected['Volatility Index'] === true ||
      e.selected['Impermanent Loss'] === true
    ) {
      showAPRVolatility.value = true
    }
  }

  strictCheckChartOffsetConditions(
    showVolume,
    showRevenueProfits,
    showTradesGasFees,
    showAPRVolatility,
    optionObj,
  )

  ///////

  const trueKeys = {
    showVolume: showVolume.value,
    showRevenueProfits: showRevenueProfits.value,
    showTradesGasFees: showTradesGasFees.value,
    showAPRVolatility: showAPRVolatility.value,
  }
  const showTrueCount = Object.values(trueKeys).filter(
    (value) => value === true,
  ).length

  checkGridByKeys(showTrueCount, currentGridToRight)

  ///////
}

const filterKeys = computed(() => Object.keys(filters.value))

const series = computed(() => [
  seriesInstance('Revenue', 'bar', dataRevenues.value, 2, '#01B47E'),
  seriesInstance('Gas Fees', 'bar', dataGasFees.value, 3, '#87F1FF'),
  seriesInstance('Average APR', 'line', dataAvgApr.value, 4, '#FFD700'),
  seriesInstance('Volume', 'bar', dataVolumes.value, 1, '#FA5173'),
  seriesInstance('Trades', 'bar', dataTrades.value, 3, '#77aaff'),
  seriesInstance(
    'Volatility Index',
    'line',
    dataVolatilityIndexes.value,
    4,
    '#FFC374',
  ),
  seriesInstance(
    'Impermanent Loss',
    'line',
    dataImpermanentLosses.value,
    4,
    'red',
  ),
  seriesInstance('Profits', 'bar', dataProfits.value, 2, '#00FF75'),
  seriesInstance('TVL', 'line', dataTVL.value, 0, '#F07E07'),
])

const optionObj = ref({
  legend: {
    data: filterKeys,
    selected: filters,
    // type: 'scroll',
    top: -5,
    left: 10,
    bottom: 30,
    width: width.value > 768 ? '50%' : '100%',
    inactiveColor: '#777',
    textStyle: {
      color: '#ccc',
      fontSize: '11px',
      fontFamily: 'Montserrat',
      fontWeight: 700,
    },
  },
  axisPointer: {
    label: {
      fontSize: 10,
    },
  },
  tooltip: {
    backgroundColor: 'rgba(2, 3, 28, 0.65)',
    borderWidth: 0,
    textStyle: {
      color: 'white',
      fontSize: 10,
      fontFamily: 'Roboto mono',
    },
    valueFormatter: (value) => (value ? Number(value).toFixed(3) : '-'),
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
  },
  xAxis: [
    {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#8392A5' } },
      axisLabel: {
        fontFamily: 'Roboto mono',
        fontWeight: '700',

      },
    },
  ],
  yAxis: [
    {
      scale: true,
      axisLine: { lineStyle: { color: '#F07E07' } },
      min: 0,
      gridIndex: 0,
      splitLine: {
        lineStyle: {
          color: 'rgba(51,51,51, 0.35)',
        },
      },
      nameTextStyle: {
        fontFamily: 'Syne',
        fontWeight: '700',
      },
      axisLabel: {
        fontFamily: 'Roboto mono',
        fontWeight: '700',
        formatter: function (value) {
          return `${convertFromNumber(value)}`
        },
      },
    },
    yAxisInstance('Volume', width.value > 768 ? showVolume : false, 0, '#FA5173'),
    yAxisInstance('Revenue / Profits', width.value > 768 ? showRevenueProfits : false, 60, '#01B47E'),
    yAxisInstance('Trades / Gas Fees', width.value > 768 ? showTradesGasFees : false, 120, '#77aaff'),
    yAxisInstance(currentVersion.value === 'pro' ? 'APR / Volatility Index / Impermanent Loss' : 'APR', width.value > 768 ? showAPRVolatility : false, 180, '#FFD700'),
  ],
  grid: [
    {
      left: width.value > 768 ? '5%' : '9%',
      right: width.value > 768 ? currentGridToRight : 0,
      top: 120,
      bottom: 155,
    },
  ],
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: 0,
      start: 0,
      end: 100,
    },
    {
      show: true,
      xAxisIndex: 0,
      type: 'slider',
      bottom: width.value > 768 ? 70 : 90,
      start: 0,
      end: 100,
      selectedDataBackground: {
        lineStyle: {
          color: 'orange',
        },
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
      query: {
        maxWidth: 1920,
      },
    },
    {
      query: {
        maxWidth: 1200,
      },
      option: {
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
  ],
})

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
  let indexes = TimelineFilters[currentTimeline.value.name](timestamps, chart_data.map((v) => v.Date))
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
    let profitItem = sumFields(notFilterdPreviousItems, [
      `Profits${postfix.value}`,
    ])
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
      if (filter_code == 'Average APR') {
        result_item[filter_code] = result_item[filter_code] = ((item[`Profits${postfix.value}`] / item[`TVL${postfix.value}`]['All Chains']) * (365 / days_count[currentTimeline.value.name])) * 100
      }
      if (filter_code == 'Volatility Index' || filter_code == "Impermanent Loss") {
        result_item[filter_code] = item[filter_code]
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
  top: 65px;
  margin-left: auto;
  right: 5px;
  margin-top: -65px;
  z-index: 30;
}

.chart_inside {
  width: 100%;
  height: 100%;
  padding-bottom: 20px;

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

@media (max-width: $md) {
  .timeline_container {
    width: fit-content;
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