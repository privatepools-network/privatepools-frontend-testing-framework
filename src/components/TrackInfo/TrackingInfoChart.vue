<template>
  <div class="track_chart_card bg-white dark:!bg-[#22222224]">
    <div class="d-flex justify-content-end"></div>
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
        class="chart"
        :option="optionObj"
        @legendselectchanged="legendSelectedChange"
        :autoresize="true"
      />
    </div>
  </div>
</template>
<script setup>
import VChart from 'vue-echarts'
import { ref, defineProps, toRefs, computed } from 'vue'
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
const props = defineProps([
  'chartData',
  'chainSelected',
  'tokensData',
  'historicalPrices',
  'symbol',
])
const {
  chartData: allChartData,
  chainSelected,
  tokensData,
  historicalPrices,
} = toRefs(props)

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

const assets = computed(() =>
  tokensData.value.length > 0
    ? Array.from(
        new Set(
          tokensData.value
            .filter((t) =>
              isRightChainName(t.Blockchain, chainSelected.value.name),
            )
            .map((t) => t.symbol),
        ),
      )
    : [],
)
const preFiltersList = ref([
  {
    title: 'Revenue',
    code: 'Revenue',
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
    title: 'TVL',
    code: 'TVL',
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
    title: 'Impermanent Loss',
    code: 'Impermanent Loss',
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
    return filteredData.value.map((v) => v['Gas Fees'])
  return []
})
const dataTVL = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'TVL').selected)
    return filteredData.value.map((v) => v['TVL'])
  return []
})
const dataRevenues = computed(() => {
  return filteredData.value.map((v) => v.Revenue)
})

const dataVolumes = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Volume').selected)
    return filteredData.value.map((v) => v.Volume)
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
  TVL: false,
  ['Average APR']: true,
  ['Profit']: false,
  ['Capital Gains']: false,
  ['PNL']: false,
  ['ROI']: false,
  ['Token Incentives']: false,
  ['Impermanent Loss']: false,
  ['Volatility Index']: false,
})

function legendSelectedChange(e) {
  for (const [key, value] of Object.entries(e.selected)) {
    filters.value[key] = value
  }
}

const filterKeys = computed(() => Object.keys(filters.value))

const series = computed(() => [
  {
    type: 'bar',
    name: 'Revenue',
    data: dataRevenues.value,
    color: '#01B47E',
    sampling: 'lttb',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: '#01B47E',
        },
        {
          offset: 1,
          color: 'transparent',
        },
      ]),
    },
    xAxisIndex: 0,
    yAxisIndex: 1,
    smooth: true,
    showSymbol: false,
    itemStyle: {
      borderRadius: [5, 5, 0, 0],
      color: '#01B47E',
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
    color: '#87F1FF',
    xAxisIndex: 0,
    yAxisIndex: 2,
    sampling: 'lttb',
    itemStyle: {
      borderRadius: [5, 5, 0, 0],
      color: '#87F1FF',
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
    color: '#ffc925',
    sampling: 'lttb',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: '#ffc925',
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
      color: '#ffc925',
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
    color: '#FF4242',
    sampling: 'lttb',
    areaStyle: {},
    // xAxisIndex: 0,
    // yAxisIndex: 1,
    smooth: true,
    showSymbol: false,
    itemStyle: {
      color: '#FF4242',
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
    color: '#6e27b2',
    sampling: 'lttb',
    areaStyle: {},

    smooth: true,
    showSymbol: false,
    itemStyle: {
      color: '#6e27b2',
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
    type: 'bar',
    name: 'Profit',
    data: dataVolatilityIndexes.value,
    color: '#00FF75',
    sampling: 'lttb',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: '#00FF75',
        },
        {
          offset: 1,
          color: 'transparent',
        },
      ]),
    },
    smooth: true,
    xAxisIndex: 0,
    yAxisIndex: 3,
    showSymbol: false,
    itemStyle: {
      color: '#00FF75',
      borderRadius: [5, 5, 0, 0],
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
    color: '#FAFF00',
    sampling: 'lttb',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: '#FAFF00',
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
      color: '#FAFF00',
      borderRadius: [5, 5, 0, 0],
    },
    emphasis: {
      focus: 'series',
      blurScope: 'coordinateSystem',
    },
  },
  {
    type: 'bar',
    name: 'PNL',
    data: dataVolatilityIndexes.value,
    color: '#FF00B8',
    sampling: 'lttb',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: '#FF00B8',
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
      color: '#FF00B8',
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
    color: '#8FBCFF',
    sampling: 'lttb',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: '#8FBCFF',
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
      color: '#8FBCFF',
    },
    emphasis: {
      focus: 'series',
      blurScope: 'coordinateSystem',
    },
  },
  {
    type: 'bar',
    name: 'Token Incentives',
    data: dataVolatilityIndexes.value,
    color: '#05FF00',
    sampling: 'lttb',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: '#05FF00',
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
      color: '#05FF00',
      borderRadius: [5, 5, 0, 0],
    },
    emphasis: {
      focus: 'series',
      blurScope: 'coordinateSystem',
    },
  },
  {
    type: 'line',
    name: 'TVL',
    data: dataTVL.value,
    color: '#F07E07',
    sampling: 'lttb',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: '#F07E07',
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
      color: '#F07E07',
    },
    emphasis: {
      focus: 'series',
      blurScope: 'coordinateSystem',
    },
  },
  // {
  //   type: 'line',
  //   name: 'Impermanent Loss',
  //   data: dataVolatilityIndexes.value,
  //   color: '#ff8fd6',
  //   sampling: 'lttb',
  //   areaStyle: {
  //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  //       {
  //         offset: 0,
  //         color: '#ff8fd6',
  //       },
  //       {
  //         offset: 1,
  //         color: 'transparent',
  //       },
  //     ]),
  //   },
  //   smooth: true,
  //   showSymbol: false,
  //   lineStyle: {
  //     width: 1,
  //     color: '#ff8fd6',
  //   },
  //   emphasis: {
  //     focus: 'series',
  //     blurScope: 'coordinateSystem',
  //   },
  // },
])

console.log('isDark', isDark)

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
                      ? `${el.marker} ${el.seriesName}: ${
                          el.value ? el.value.toFixed(3) : 0
                        }${props.symbol} <br />`
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
      min: 0,

      axisLine: { lineStyle: { color: '#8392A5' } },
      gridIndex: 0,
      splitLine: {
        lineStyle: {
          color: 'rgba(51,51,51, 0.35)',
        },
      },
    },
    {
      type: 'value',
      name: 'Revenue',
      min: 0,
      nameTextStyle: {
        fontSize: 12,
      },
      gridIndex: 0,
      position: 'right',
      alignTicks: true,
      axisTick: { show: false },
      splitLine: { show: false },
      axisLine: {
        show: true,
        lineStyle: { color: '#01B47E' },
      },
      axisLabel: {
        textStyle: {
          fontSize: '12px',
          fontFamily: 'Montserrat',
        },
        formatter: function (value) {
          return convertFromNumber(value)
        },
      },
    },
    {
      type: 'value',
      name: 'Gas Fees',
      position: 'right',
      min: 0,

      offset: 60,
      alignTicks: true,
      axisTick: { show: false },
      splitLine: { show: false },
      axisLine: {
        show: true,
        lineStyle: { color: '#87F1FF' },
      },

      axisLabel: {
        textStyle: {
          fontSize: '12px',
          fontFamily: 'Montserrat',
        },
        formatter: function (value) {
          return convertFromNumber(value)
        },
      },
      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
    },
    {
      type: 'value',
      name: 'Profit',
      position: 'right',
      min: 0,

      offset: 120,
      alignTicks: true,
      axisTick: { show: false },
      splitLine: { show: false },
      axisLine: {
        show: true,
        lineStyle: { color: '#00FF75' },
      },

      axisLabel: {
        textStyle: {
          fontSize: '12px',
          fontFamily: 'Montserrat',
        },
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
      right: '17%',
      top: 120,
      bottom: 155,
    },
  ],
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: 0,
      start: 93,
      end: 100,
    },
    {
      show: true,
      xAxisIndex: 0,
      type: 'slider',
      bottom: 70,
      start: 93,
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
  chart_data = addEmptyDays(chart_data)
  let timestamps = chart_data.map((v) => v.timestamp)
  let indexes = TimelineFilters[currentTimeline.value.name](timestamps)
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
    if (chainSelected.value.name == 'All Chains') {
      mapValuesForEachChain(previousItems, selectedCumulableCodes)
    }
    previousItems = previousItems.filter(
      (p) =>
        p.Blockchain == '' ||
        isRightChainName(p.Blockchain, chainSelected.value.name),
    )
    let item = {
      ...chart_data[indexes[i]],
      ...sumFields(previousItems, selectedCumulableCodes),
    }
    let profitItem = sumFields(notFilterdPreviousItems, ['Profits'])
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
        let avg_apr = CalculateAvgApr(
          profitItem,
          notFilterdPreviousItems,
          currentTimeline.value.name,
          chainSelected.value.name,
        )
        if (filter_code == 'Average APR') {
          result_item[filter_code] = avg_apr
        }
        let volatility_index = null
        if (filter_code == 'Volatility Index') {
          result_item[filter_code] = CalculateVolatilityIndex(
            chainSelected.value.name,
            notFilterdPreviousItems,
            historicalPrices.value,
            currentTimeline.value.name,
            assets.value,
          )
          volatility_index = result_item[filter_code]
        }

        if (filter_code == 'Sharpe Ratio') {
          result_item[filter_code] = CalculateSharpeRatio(
            chainSelected.value.name,
            notFilterdPreviousItems,
            historicalPrices.value,
            currentTimeline.value.name,
            assets.value,
            avg_apr,
            result_item.timestamp,
            volatility_index,
          )
        }
        if (filter_code == 'Sortino Ratio') {
          result_item[filter_code] = CalculateSortinoRatio(
            chainSelected.value.name,
            notFilterdPreviousItems,
            historicalPrices.value,
            currentTimeline.value.name,
            assets.value,
            avg_apr,
            result_item.timestamp,
            volatility_index,
          )
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
  console.log(optionObj.value.legend.selected)

  return result
}

function mapValuesForEachChain(previousItems, selectedCumulableCodes) {
  let arbItems = previousItems.filter((v) => v.Blockchain == 'Arbitrum')
  let bnbItems = previousItems.filter((v) => v.Blockchain == 'Binance')
  let polygonItems = previousItems.filter((v) => v.Blockchain == 'Polygon')
  let sum_arb = sumFields(arbItems, selectedCumulableCodes)
  let sum_bnb = sumFields(bnbItems, selectedCumulableCodes)
  let sum_polygon = sumFields(polygonItems, selectedCumulableCodes)
  for (let j = 0; j < ChainRelatedFields.length; j++) {
    let key = ChainRelatedFields[j]
    if (selectedCumulableCodes.includes(key)) {
      chainsMap.value[key].Arbitrum.push(sum_arb[key] ? sum_arb[key] : 0)
      chainsMap.value[key].Binance.push(sum_bnb[key] ? sum_bnb[key] : 0)
      chainsMap.value[key].Polygon.push(sum_polygon[key] ? sum_polygon[key] : 0)
    }
  }
}

// function onFilterClick(e, item) {
//   if (item.isSolo) {
//     item.selected = !item.selected
//     if (item.selected) {
//       filters.value[item.title] = true
//     } else {
//       delete filters.value[item.title]
//     }
//   } else if (
//     typeof e.target.className != 'string' ||
//     e.target.className.includes('title')
//   ) {
//     item.isOpened = !item.isOpened
//   }
// }

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

// function updateTokenFilters(selected, all) {
//   for (const [key] of Object.entries(filters.value)) {
//     if (all.includes(key)) {
//       delete filters.value[key]
//     }
//   }
//   for (let k = 0; k < selected.length; k++) {
//     filters.value[selected[k]] = true
//   }
// }

// function onDenominationClick(item, denomination) {
//   if (item.selectedDenominations.includes(denomination)) {
//     item.selectedDenominations = item.selectedDenominations.filter(
//       (d) => d != denomination,
//     )
//   } else {
//     item.selectedDenominations.push(denomination)
//   }
//   item.selected = item.selectedDenominations.length > 0
//   updateTokenFilters(item.selectedDenominations, assets.value)
// }

// function onClearClick(item) {
//   item.selectedDenominations = []
//   item.selected = false
//   updateTokenFilters(item.selectedDenominations, assets.value)
// }
// function onToggleAllClick(item) {
//   item.selectedDenominations = [...item.denominations]
//   item.selected = true
//   updateTokenFilters(item.selectedDenominations, assets.value)
// }

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
  // border: 1px solid rgba(163, 164, 165, 0.26);
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

@media (max-width: $sm) {
  .timeline_container {
    width: 100%;
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
