<template>
  <div class="pools_chart_container">
    <PoolDetailsArbitrageBot :chart_data="all_chart_data" :tokenPrices="poolTokenPrices"
      :currencySelected="currencySelected" :cryptocomparePrices="tokenPrices" :swapsData="swapsData" :pool="pool"
      :historical_tvl="FormatHistoricalTvl(historical_tvl)" :chainSelected="chainSelectedName" />

    <div class="track_chart_card">





      <div v-if="dataRevenues.length == 0" class="chart_inside">
        <LoaderPulse />
      </div>
      <div v-else class="chart_inside">
        <div class="timeline_container">
          <div class="chart-timeline">
            <div class="chart-equivalent">
              <div class="chart-equivalent__el" v-for="timeline in timelines" :key="timeline.name" :class="{
                'chart-equivalent__el_active':
                  currentTimeline.name == timeline.name,
              }" @click="changeTimeline(timeline)">
                {{ timeline.name }}
              </div>
              <div class="chart-equivalent__el" :class="{
                'chart-equivalent__el_active': isCumulativeMode == true,
              }" @click="isCumulativeMode = !isCumulativeMode">
                Cumulative
              </div>
            </div>
          </div>
        </div>
        <img :src="logo" alt="D3" class="chart-logo" />
        <VChart class="chart" :option="optionObj" @legendselectchanged="legendSelectedChange" :autoresize="true" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, defineProps, toRefs, onMounted, watch } from 'vue'
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
import { FormatHistoricalTvl } from "@/lib/formatter/poolTvlFormatter";
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
import { addEmptyDays } from "@/lib/formatter/chart/chartFormatter";
import {
  isRightChainName
} from '@/composables/pools/usePoolSwapsStats'
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

const props = defineProps(['historical_tvl', 'tokenPrices', 'pool', 'swapsData', 'chainSelected', 'all_chart_data', 'poolTokenPrices', 'symbol', 'chainSelected', 'currencySelected'])
const { historical_tvl, poolTokenPrices, tokenPrices, pool, swapsData, chainSelected, all_chart_data } = toRefs(props)
const chainSelectedName = computed(() => DisplayNetwork[chainSelected.value])


const filteredData = computed(() => all_chart_data.value && all_chart_data.value.length > 0 ? getFilteredData() : [])

const preFiltersList = computed(() => [
  {
    title: 'Revenue',
    code: 'Revenue',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: 'Profits',
    code: 'Profits',
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
    title: 'TVL',
    code: 'TVL',
    isSolo: true,
    selected: true,
    cumulable: false,
  },
  {
    title: 'Volume',
    code: 'Volume',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: `Token Profits`,
    code: `Token Profits`,
    isSolo: false,
    selected: true,
    cumulable: false,
    isOpened: false,
    denominations: assets,
    selectedDenominations: [],
  },
  {
    title: 'Assets',
    code: 'Assets',
    isSolo: false,
    selected: true,
    cumulable: false,
    isOpened: false,
    denominations: assets,
    selectedDenominations: [],
  },
  {
    title: 'Average APR',
    code: 'Average APR',
    isSolo: true,
    selected: true,
    cumulable: false,
  },
  {
    title: 'Volatility Index',
    code: 'Volatility Index',
    isSolo: true,
    selected: true,
    cumulable: false,
  },
  {
    title: 'Sharpe Ratio',
    code: 'Sharpe Ratio',
    isSolo: true,
    selected: true,
    cumulable: false,
  },
  {
    title: 'Sortino Ratio',
    code: 'Sortino Ratio',
    isSolo: true,
    selected: true,
    cumulable: false,
  },
  {
    title: 'Trades',
    code: 'Trades',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
])
const filters = ref({
  Revenue: false,
  Profits: false,
  ['Gas Fees']: false,
  ['Trades']: false,
  Volume: false,
  TVL: true,
  ['Average APR']: true,
  ['Volatility Index']: false,
  ['Sortino Ratio']: false,
  ['Sharpe Ratio']: false,
}
)
const assets = computed(() =>
  pool.value
    ? Array.from(new Set(pool.value.tokens.map((t) => t.symbol)))
    : [],
)

watch(assets, () => {
  filters.value = {
    Revenue: false,
    Profits: false,
    ['Gas Fees']: false,
    ['Trades']: false,
    Volume: false,
    TVL: true,
    ['Average APR']: true,
    ['Volatility Index']: false,
    ['Sortino Ratio']: false,
    ['Sharpe Ratio']: false,
  }
  for (let i = 0; i < assets.value.length; i++) {
    filters.value[`Token Profits ${assets.value[i]}`] = false
    filters.value[`TVL ${assets.value[i]}`] = false
  }
})

function legendSelectedChange(e) {
  for (const [key, value] of Object.entries(e.selected)) {
    filters.value[key] = value
  }
}

const filterKeys = computed(() => Object.keys(filters.value))

const timelines = [
  {
    name: 'Daily',
  },
  {
    name: 'Weekly',
  },
  {
    name: 'Monthly',
  },
]

const isCumulativeMode = ref(false)
const currentTimeline = ref(timelines[0])

function changeTimeline(tl) {
  currentTimeline.value = tl
}


const dates = computed(() => {
  return filteredData.value.map((v) => v.Date)
})
const dataGasFees = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Gas Fees').selected)
    return filteredData.value.map((v) => v['Gas Fees'])
  return []
})
const dataRevenues = computed(() => {
  return filteredData.value.map((v) => v.Revenue)
})
const dataProfits = computed(() => {
  return filteredData.value.map((v) => v.Profits)
})
const dataTokenProfits = computed(() => {
  return filteredData.value.map((v) => v['Token Profits'])
})
const dataTokenAssets = computed(() => {
  return filteredData.value.map((v) => v['Assets'])
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
const dataTvl = computed(() => {
  if (filteredData.value.length > 0 && filteredData.value[0].TVL)
    return filteredData.value.map((v) => v.TVL[chainSelectedName.value])
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
const dataSharpeRatios = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Sharpe Ratio').selected)
    return filteredData.value.map((v) => v['Sharpe Ratio'])
  return []
})
const dataSortinoRatios = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Sortino Ratio').selected)
    return filteredData.value.map((v) => v['Sortino Ratio'])
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
  [
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
      type: 'bar',
      name: 'Profits',
      data: dataProfits.value,
      color: '#02B007',
      sampling: 'lttb',

      smooth: true,
      showSymbol: false,
      itemStyle: {
        color: '#02B007',
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
      data: dataTvl.value,
      color: '#f07e07',
      sampling: 'lttb',
      xAxisIndex: 0,
      yAxisIndex: 2,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#f07e07',
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
        color: '#f07e07',
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
      xAxisIndex: 0,
      yAxisIndex: 1,
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
      color: '#ff8fd6',
      sampling: 'lttb',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#ff8fd6',
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
        color: '#ff8fd6',
      },
      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
    },
    {
      type: 'line',
      name: 'Sharpe Ratio',
      data: dataSharpeRatios.value,
      color: '#BC5F04',
      sampling: 'lttb',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#BC5F04',
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
        color: '#C7B446',
        type: 'dashed',
      },
      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
    },
    {
      type: 'line',
      name: 'Sortino Ratio',
      data: dataSortinoRatios.value,
      color: '#874000',
      sampling: 'lttb',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#874000',
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
        color: '#874000',
        type: 'dashed',
      },
      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
    },
    ...assets.value.map((asset) => ({
      type: 'bar',
      name: `Token Profits ${asset}`,
      data: dataTokenProfits.value.map((t) => t[asset]),
      color: stringToColor(asset),
      sampling: 'lttb',

      smooth: true,
      showSymbol: false,
      itemStyle: {
        color: stringToColor(asset),
        borderRadius: [5, 5, 0, 0],
      },
      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
    })),
    ...assets.value.map((asset) => ({
      type: 'line',
      name: `TVL ${asset}`,
      data: dataTokenAssets.value.map((t) => t[asset]),
      color: stringToColor(`TVL ${asset}`),
      sampling: 'lttb',
      xAxisIndex: 0,
      yAxisIndex: 2,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: stringToColor(`TVL ${asset}`),
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
        color: stringToColor(`TVL ${asset}`),
      },
      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
    })),
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
      fontFamily: 'Poppins',
      fontWeight: 700,
    },
  },
  axisPointer: {
    label: {
      fontSize: 8
    }
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
                ${params.map((el) =>
        el.seriesName === 'Revenue' ||
          el.seriesName === 'Profits' ||
          el.seriesName === 'TVL' ||
          el.seriesName === 'Gas Fees' ||
          el.seriesName === 'Volume'
          ? `${el.marker} ${el.seriesName}: ${props.symbol}${el.value ? el.value.toFixed(3) : 0} <br />`
          : el.seriesName === 'Average APR' ||
            el.seriesName === 'Volatility Index'
            ? `${el.marker} ${el.seriesName}: ${el.value ? el.value.toFixed(3) : 0}% <br />`
            : el.seriesName === 'Trades'
              ? `${el.marker} ${el.seriesName}: ${el.value ? el.value.toFixed(3) : 0} Trades  <br />`
              : `${el.marker} ${el.seriesName}: ${el.value ? el.value.toFixed(3) : 0} <br />`,
      ).join('')}
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
        lineStyle: { color: '#FF4242' },
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
        lineStyle: { color: '#f07e07' },
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
            fontSize: 12
          }
        },
        yAxis: {
          axisLabel: {
            fontSize: 12
          }
        }
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



watch(assets, () => {
  // for (let i = 0; i < assets.value.length; i++) {
  //   let asset = assets.value[i]
  //   let found = optionObj.value.yAxis.find((axis) => axis.name == `TVL ${asset}`)
  //   if (!found) {
  //     optionObj.value.yAxis = [...optionObj.value.yAxis, {
  //       type: 'value',
  //       name: `${asset}`,
  //       min: 0,

  //       position: 'right',
  //       offset: 70 + 10 * i,
  //       alignTicks: true,
  //       axisTick: { show: false },
  //       splitLine: { show: false },
  //       axisLine: {
  //         show: true,
  //         lineStyle: { color: stringToColor(`TVL ${asset}`) },
  //       },

  //       axisLabel: {
  //         formatter: function (value) {
  //           return convertFromNumber(value)
  //         },
  //       },
  //       emphasis: {
  //         focus: 'series',
  //         blurScope: 'coordinateSystem',
  //       },
  //     },]
  //   }
  // }
})


const TimelineFilters = {
  Daily: groupTimestampsByDayWithIndexes,
  Weekly: groupTimestampsByWeekWithIndexes,
  Monthly: groupTimestampsByMonthWithIndexes,
}

function sumAssetsProfits(previous_items) {
  let token_profits = { ...previous_items[0]['Token Profits'] }
  for (let i = 1; i < previous_items.length; i++) {
    for (const [key, value] of Object.entries(previous_items[i]['Token Profits'])) {
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
  chart_data = addEmptyDays(chart_data)
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
    let profitItem = sumFields(notFilterdPreviousItems, ['Profits'])
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
      let isTvlLessThan1 = chart_data[indexes[i]].TVL[chainSelectedName.value] < 1

      if (assets.value.length > 0 && tokenPrices.value && tokenPrices.value.length > 0) {
        let volatility_index = null
        if (filter_code == 'Volatility Index') {
          result_item[filter_code] = !isTvlLessThan1 ? CalculateVolatilityIndex(
            chainSelectedName.value,
            notFilterdPreviousItems,
            tokenPrices.value,
            currentTimeline.value.name,
            assets.value,
          ) : 0
          volatility_index = result_item[filter_code]
        }

        if (filter_code == 'Sharpe Ratio') {
          result_item[filter_code] = !isTvlLessThan1 ? CalculateSharpeRatio(
            chainSelectedName.value,
            notFilterdPreviousItems,
            tokenPrices.value,
            currentTimeline.value.name,
            assets.value,
            avg_apr,
            result_item.timestamp,
            volatility_index,
          ) : 0
        }
        if (filter_code == 'Sortino Ratio') {
          result_item[filter_code] = !isTvlLessThan1 ? CalculateSortinoRatio(
            chainSelectedName.value,
            notFilterdPreviousItems,
            tokenPrices.value,
            currentTimeline.value.name,
            assets.value,
            avg_apr,
            result_item.timestamp,
            null,
          ) : 0
        }
      }

      // else {
      //   result_item['Blockchain'] = ''
      //   if (isCumulativeMode.value && selectedFilters[k].cumulable) {
      //     result_item[filter_code] =
      //       result.length == 0 ? 0 : result[result.length - 1][filter_code]
      //   } else result_item[filter_code] = 0
      // }
    }
    result.push(result_item)
  }
  console.log("result", result)
  return result
}

onMounted(() => {
  InitTreasuryYields()
})


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
  display: none;
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
        background-color: #01b47ecb;
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
          background: #01b47e;

          &:hover {
            background-color: rgba(#01b47e, 0.5);
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
      color: #01b47e;
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

      &:hover {
        background-color: rgba(#01b47e, 0.3);
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
        background-color: rgba(#01b47e, 0.3);
      }

      &_selected {
        svg {
          display: block;
        }

        &:hover {
          background-color: rgba(#01b47e, 0.3);
        }
      }
    }

    &__options {
      width: 100%;
      top: 100%;
      position: absolute;
      background: #000;
      z-index: 11;
      border: 1px solid #7ef6b2;
      border-top: none;
      border-radius: 0 0 12px 12px;
    }
  }

  &-equivalent {
    padding: 0px;
    color: rgba(126, 246, 178, 1);
    font-size: clamp(8px, 0.5vw, 12px);
    margin-right: 15px;
    display: flex;
    justify-self: flex-start;
    border-radius: 20px;
    border: 1px solid #01b47e;


    &__el {
      padding: 8px 15px;
      cursor: pointer;
      border-radius: 12px;

      &:hover {
        background: rgba(#01b47e, 0.3);
      }

      &_active {
        background: #01b47e;
        color: white;

        &:hover {
          background: #01b47e;
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

    &__img {
      animation: pulse 1.5s linear infinite;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
  }

  50% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.5);
  }
}

.track_chart_card {
  border: 1px solid rgba(163, 164, 165, 0.26);
  border-radius: 0px 20px 20px 0px;
  width: 100%;
  padding: 0px 20px;
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
      border: 1px solid #01b47e;
    }
  }
}
</style>
