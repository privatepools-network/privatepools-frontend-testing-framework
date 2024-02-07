<template>
  <div class="track_chart_card">
    <!-- <div class="chart-filters">
      <div :class="` chart-filters__el ${item.selected ? 'chart-filters__el_active' : ''
        } chart-filters__el_progress`" v-for="item in preFiltersList" :key="item"
        @click="(e) => onFilterClick(e, item)">
        <div class="chart-filters__title">
          {{ item.title }}
          <svg xmlns="http://www.w3.org/2000/svg" class="chart-filters__dropdown-icon" v-if="item.isSolo == false"
            width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <div class="chart-filters__options" v-if="item.isOpened == true">
            <div class="p-1 mt-2">
              <CInputGroup class="d-flex align-items-center justify-content-start search-chart-assets">
                <CAvatar :src="Search" style="width: 11px; margin-left: 10px" />
                <CFormInput type="text" placeholder="Search..." aria-label="Search..." class="search-input"
                  style="color: white; font-size: 10px" v-model="filterAssets" />
              </CInputGroup>
            </div>
            <div class="chart-filters__toggling">
              <div class="chart-filters__toggler" @click="onClearClick(item)">
                Clear
              </div>
              <div class="chart-filters__toggler" @click="onToggleAllClick(item)">
                Toggle All
              </div>
            </div>
            <div class="chart-filters__option" v-for="denomination in item.denominations.filter((word) =>
              word.toLowerCase().includes(filterAssets),
            )" :class="{
  'chart-filters__option_selected':
    item.selectedDenominations.indexOf(denomination) != -1,
}" :key="denomination" @click="onDenominationClick(item, denomination)">
              {{ denomination }}
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="7" viewBox="0 0 10 7" fill="none">
                <path
                  d="M3.20625 6.76406L0 3.55781L0.801563 2.75625L3.20625 5.16094L8.36719 0L9.16875 0.801563L3.20625 6.76406Z"
                  fill="#F8F8F8" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="d-flex justify-content-end"></div>
    <div v-if="filteredData.length === 0" class="chart_inside">
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
  'symbol'
])
const {
  chartData: allChartData,
  chainSelected,
  tokensData,
  historicalPrices,
} = toRefs(props)

const isCumulativeMode = ref(false)

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
  // {
  //   title: 'Assets',
  //   code: 'Assets',
  //   isSolo: false,
  //   selected: false,
  //   cumulable: false,
  //   isOpened: false,
  //   denominations: assets,
  //   selectedDenominations: [],
  // },
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
    return filteredData.value.map((v) => v.TVL[chainSelected.value.name])
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
const currentTimeline = ref(timelines[0])

function changeTimeline(tl) {
  currentTimeline.value = tl
}

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
    color: '#00C9FF',
    sampling: 'lttb',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: '#00C9FF',
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
      color: '#00C9FF',
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
    xAxisIndex: 0,
    yAxisIndex: 0,
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
])

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
                ${params
          .map((el) =>
            el.seriesName === 'Revenue' ||
              el.seriesName === 'Profits' ||
              el.seriesName === 'TVL' ||
              el.seriesName === 'Gas Fees' ||
              el.seriesName === 'Volume'
              ? `${el.marker} ${el.seriesName}: ${el.value ? el.value.toFixed(3) : 0
              }${props.symbol} <br />`
              : el.seriesName === 'Average APR' ||
                el.seriesName === 'Volatility Index'
                ? `${el.marker} ${el.seriesName}: ${el.value ? el.value.toFixed(3) : 0
                }% <br />`
                : el.seriesName === 'Trades'
                  ? `${el.marker} ${el.seriesName}: ${el.value ? el.value.toFixed(3) : 0
                  } Trades  <br />`
                  : `${el.marker} ${el.seriesName}: ${el.value ? el.value.toFixed(3) : 0
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
      name: 'Volume',
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
        lineStyle: { color: '#FF4242' },
      },
      axisLabel: {
        textStyle: {
          fontSize: '12px',
          fontFamily: 'Poppins',
        },
        formatter: function (value) {
          return convertFromNumber(value)
        },
      },
    },
    {
      type: 'value',
      name: 'TVL',
      position: 'right',
      min: 0,

      offset: 60,
      alignTicks: true,
      axisTick: { show: false },
      splitLine: { show: false },
      axisLine: {
        show: true,
        lineStyle: { color: '#f07e07' },
      },

      axisLabel: {
        textStyle: {
          fontSize: '12px',
          fontFamily: 'Poppins',
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
      right: '10%',
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
    {
      query: {
        maxWidth: 768,
      },
      option: {
        legend: {
          width: '100%',
          itemWidth: 19,
          itemHeight: 10,
          textStyle: {
            fontSize: 11,
          },
        },
        grid: [
          {
            left: '10%',
            right: '10%',
            top: 90,
            bottom: 160,
          },
        ],
        xAxis: {
          axisLabel: {
            fontSize: 11,
          },
        },
        yAxis: {
          axisLabel: {
            fontSize: 11,
          },
        },
      },
    },
  ],
})

const TimelineFilters = {
  Daily: groupTimestampsByDayWithIndexes,
  Weekly: groupTimestampsByWeekWithIndexes,
  Monthly: groupTimestampsByMonthWithIndexes,
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
        background-color: #00C9FFcb;
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
          background: #00C9FF;
          color: #fff;

          &:hover {
            background-color: rgba(#00C9FF, 0.5);
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
      color: #00C9FF;
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
        background-color: rgba(#00C9FF, 0.3);
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
        background-color: rgba(#00C9FF, 0.3);
      }

      &_selected {
        svg {
          display: block;
        }

        &:hover {
          background-color: rgba(#00C9FF, 0.3);
        }
      }
    }

    &__options {
      width: 120px;
      top: 100%;
      position: absolute;
      background: #000;
      z-index: 11;
      border: 1px solid #00C9FF;
      border-top: none;
      border-radius: 0 0 12px 12px;
    }
  }

  &-equivalent {
    padding: 0px;
    color: #00C9FF;
    font-size: clamp(8px, 0.5vw, 12px);
    margin-right: 15px;
    display: flex;
    justify-self: flex-start;
    border-radius: 20px;
    border: 1px solid #00C9FF;

    &__el {
      padding: 8px 15px;
      cursor: pointer;
      border-radius: 20px;

      &:hover {
        background: rgba(#00C9FF, 0.3);
      }

      &_active {
        background: #00C9FF;
        color: #fff;

        &:hover {
          background: #00C9FF;
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
  // border: 1px solid rgba(163, 164, 165, 0.26);
  border-radius: 0px 20px 20px 0px;
  width: 100%;
  padding: 20px;
  background: linear-gradient(361.2deg, #001b220e 0%, #000000 105.42%);
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
      border: 1px solid #00C9FF;
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
      border: 1px solid #00C9FF;
    }
  }
}
</style>
