<template>
  <div class="track_chart_card bg-white dark:!bg-[#22222224]">
    <div class="d-flex justify-content-end"></div>
    {{ console.log('allChartData', allChartData) }}
    {{ console.log('dataAvgApr', dataAvgApr) }}
    <div v-if="filteredData.length === 0" class="chart_inside">
      <LoaderPulse />
    </div>
    <div v-else class="chart_inside">
      <ChartTimeline
        :isCumulativeMode="isCumulativeMode"
        :currentTimeline="currentTimeline"
        :timelines="timelines"
        @changeCumulativeMode="changeCumulativeMode"
        @changeTimeline="changeTimeline"
      />
      <img :src="logo" alt="D3" class="chart-logo" height="40px" />
      <VChart
        class="chart mt-4"
        :option="optionObj"
        @legendselectchanged="legendSelectedChange"
        :autoresize="true"
      />
    </div>
  </div>
</template>
<script setup>
import VChart from 'vue-echarts'
import { ref, defineProps, toRefs, computed, watchEffect } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import * as echarts from 'echarts'
import { BarChart, CandlestickChart, LineChart } from 'echarts/charts'
import logo from '@/assets/images/d3v.png'
import {
  sumFields,
  groupTimestampsByDayWithIndexes,
  groupTimestampsByWeekWithIndexes,
  groupTimestampsByMonthWithIndexes,
} from '@/lib/utils'
import { addEmptyDays } from '@/lib/formatter/chart/chartFormatter'
// import Search from '@/assets/images/search.png'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'

import {
  TitleComponent,
  LegendComponent,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  MarkPointComponent,
} from 'echarts/components'
import {
  CalculateAvgApr,
  CalculateVolatilityIndex,
  CalculateSharpeRatio,
  CalculateSortinoRatio,
} from '@/composables/math/chartMath/trackingInfoMath.js'

import { isRightChainName } from '@/composables/pools/usePoolSwapsStats'
import ChartTimeline from '@/UI/ChartTimeline.vue'
import { useDark } from '@vueuse/core'
import { t } from 'i18next'
import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'
import { strictCheckChartOffsetConditions } from '@/composables/chartLogic/strictCheckChartOffsetConditions'
import { checkGridByKeys } from '@/composables/chartLogic/checkGridByKeys'
import { useDevice } from '@/composables/adaptive/useDevice'

const settingsStore = useSettings()
const { width } = useDevice()

const { currentCurrency } = storeToRefs(settingsStore)

const postfix = computed(() =>
  currentCurrency.value == 'USD' ? '' : `_${currentCurrency.value}`,
)

const isDark = useDark()

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
const props = defineProps(['chartData', 'chainSelected'])
const { chartData: allChartData, chainSelected } = toRefs(props)

const isCumulativeMode = ref(false)
function changeCumulativeMode() {
  isCumulativeMode.value = !isCumulativeMode.value
}
const filteredData = computed(() =>
  allChartData.value && allChartData.value.length > 0 ? getFilteredData() : [],
)

const ChainRelatedFields = [
  'Gas Fees',
  'Revenue',
  'Profits',
  'Volume',
  'Trades',
]

const chainsMap = ref(getDefaultChainsMapValue())

const preFiltersList = ref([
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
])

const dates = computed(() => {
  return filteredData.value.map((v) => v.Date)
})

const dataGasFees = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Gas Fees').selected)
    return filteredData.value.map((v) => v[`Gas Fees${postfix.value}`])
  return []
})
const dataTVL = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'TVL').selected)
    return filteredData.value.map((v) => v[`TVL${postfix.value}`]['Binance'])
  return []
})
const dataRevenues = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Revenue').selected)
    return filteredData.value.map((v) => v[`Revenue${postfix.value}`])
  return []
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
const dataProfits = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Profits').selected)
    return filteredData.value.map((v) => v[`Profits${postfix.value}`])
  return []
})

const timelines = [
  // {
  //     name: 'All-time',
  //   },
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
const currentTimeline = ref(timelines[0])

function changeTimeline(tl) {
  currentTimeline.value = tl
}

const filters = ref({
  Revenue: true,
  ['Gas Fees']: false,
  ['Trades']: true,
  Volume: true,
  TVL: true,
  ['Average APR']: true,
  ['Profits']: false,
  ['Volatility Index']: false,
})

// const yAxisOffset = ref({
//   Volume: 0,
//   RevenueProfits: 60,
//   TradesGasFees: 120,
//   APRVolatility: 180,
// })

const currentGridToRight = ref(240)

const showVolume = ref(true)
const showRevenueProfits = ref(true)
const showTradesGasFees = ref(true)
const showAPRVolatility = ref(true)

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

  if (e.name === 'Average APR' || e.name === 'Volatility Index') {
    if (
      e.selected['Average APR'] === false &&
      e.selected['Volatility Index'] === false
    ) {
      showAPRVolatility.value = false
    } else if (
      e.selected['Average APR'] === true ||
      e.selected['Volatility Index'] === true
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
    yAxisInstance('APR / Volatility Index', width.value > 768 ? showAPRVolatility : false, 180, '#FFD700'),
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
      bottom:  width.value > 768 ? 70 : 90,
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

const TimelineFilters = {
  // 'All-time': groupTimestampsByDayWithIndexes,
  [t('daily')]: groupTimestampsByDayWithIndexes,
  [t('weekly')]: groupTimestampsByWeekWithIndexes,
  [t('monthly')]: groupTimestampsByMonthWithIndexes,
}

function getFilteredData() {
  let result = []
  let chart_data = allChartData.value.filter(
    (d) =>
      isRightChainName(d.Blockchain, chainSelected.value.name) ||
      d.Blockchain == '',
  )
  let timestamps = chart_data.map((v) => v.timestamp)
  let indexes = TimelineFilters[currentTimeline.value.name](timestamps,chart_data.map((v) => v.Date))
  indexes = indexes.sort((a, b) => a - b)
  let selectedFilters = preFiltersList.value.filter((v) => v.selected)
  let selectedCumulableCodes = selectedFilters
    .filter((v) => v.cumulable)
    .map((v) => v.code)
  chainsMap.value = getDefaultChainsMapValue()
  console.log(selectedFilters)
  for (let i = 0; i < indexes.length; i++) {
    let start_index = i == 0 ? 0 : indexes[i - 1] + 1
    let end_index = indexes[i] + 1
    let previousItems = chart_data.slice(start_index, end_index)
    let notFilterdPreviousItems = [...previousItems]

    previousItems = previousItems.filter(
      (p) =>
        p.Blockchain == '' ||
        isRightChainName(p.Blockchain, chainSelected.value.name),
    )
    let item = {
      ...chart_data[indexes[i]],
      ...sumFields(previousItems, selectedCumulableCodes),
    }
    let result_item = {
      Blockchain: item.Blockchain,
      timestamp: item.timestamp,
      Date: item.Date,
    }
    for (let k = 0; k < selectedFilters.length; k++) {
      let filter_code = selectedFilters[k].code
      if (
        !ChainRelatedFields.includes(filter_code) ||
        (ChainRelatedFields.includes(filter_code) &&
          isRightChainName(item.Blockchain, chainSelected.value.name))
      ) {
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
         
          result_item[filter_code] =
          Number.isFinite(((item[`Profits${postfix.value}`] * 365) /
              item[`TVL${postfix.value}`]['All Chains']) * 100) ? ((item[`Profits${postfix.value}`] * 365) /
              item[`TVL${postfix.value}`]['All Chains']) * 100 : 0
        }
        if (filter_code == 'Volatility Index') {
          result_item[filter_code] = item[filter_code]
        }
      } else {
        result_item['Blockchain'] = ''
        if (isCumulativeMode.value && selectedFilters[k].cumulable) {
          result_item[filter_code] =
            result.length == 0 ? 0 : result[result.length - 1][filter_code]
        } else result_item[filter_code] = 0
      }
    }
    result.push(result_item)
  }

  return result
}

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

function getDefaultChainsMapValue() {
  return ChainRelatedFields.reduce(
    (acc, currentValue) => ({
      ...acc,
      [currentValue]: { Arbitrum: [], Binance: [], Polygon: [] },
    }),
    {},
  )
}
</script>
<style scoped lang="scss">
@import '@/styles/_variables.scss';

.chart-logo {
  position: relative;
  top: 52%;
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
    padding: 2px;
    background: #22222224;

    font-size: clamp(8px, 0.5vw, 12px);
    margin-right: 15px;
    display: flex;
    justify-self: flex-start;
    border-radius: 20px;
    box-shadow: 0px 4px 4px 0px #00000040;
    color: white;

    &__el {
      padding: 8px 15px;
      cursor: pointer;
      border-radius: 20px;

      &:hover {
        background: rgba(#00c9ff, 0.3);
      }

      &_active {
        background: linear-gradient(152.97deg, #002429 0%, #00c9ff 100%);

        color: #fff;

        &:hover {
          background: #00c8ff60;
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
  backdrop-filter: blur(10px);
  border-radius: 0px 20px 20px 0px;
  width: 100%;
  padding: 20px;
  // background: #22222224;
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
    height: 100%;
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
      font-size: 11px;
      margin-right: 15px;
      display: flex;
      justify-self: flex-start;
      border-radius: 20px;
      border: 1px solid #00c9ff;
    }
  }
}

.search-chart-assets {
  background: #0f1113;

  border: 1px solid #c1c1d13d;
  border-radius: 12px;

  color: white;
}

@media (max-width: $xl) {
  .timeline_container {
    width: fit-content;
    display: flex;
    position: static;
    z-index: 30;
    margin-left: 0;
    margin-top: 0;
    margin-bottom: 0px;
  }

  .chart_inside {
    width: 100%;
    height: 450px;
  }

  .track_chart_card {
    border: 1px solid rgba(163, 164, 165, 0.3);
    border-width: 0px 1px 1px 1px;
    border-radius: 0px 0px 20px 20px;
  }

  .chart {
    &-equivalent {
      padding: 0px;
      color: rgba(126, 246, 178, 1);
      font-size: clamp(8px, 0.5vw, 12px);
      margin-right: 15px;
      display: flex;
      flex-direction: row;
      border-radius: 20px;
      border: 1px solid #00c9ff;
    }
  }
}
</style>
