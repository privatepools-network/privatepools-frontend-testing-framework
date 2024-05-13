<template>
  <div class="pools_chart_container">
    <PortfolioArbitrageBot :networks_data="networks_data" :chainSelected="chainSelected" :rewardsData="rewardsData" />

    <div class="track_chart_card bg-[white] dark:!bg-[#22222224]">

      <div v-if="filteredData === null" class="chart_inside">
        <LoaderPulse />
      </div>
      <div v-if="filteredData.length === 0"
        class="d-flex flex-column gap-2 justify-content-center align-items-center h-100">
        <svg width="42" height="44" viewBox="0 0 42 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M31.2356 42.9592L36.0985 38.0985M36.0985 38.0985L40.9591 33.2356M36.0985 38.0985L31.2333 33.2333M36.0962 38.0963L40.9568 42.9569M1.16663 7.75V21.5C1.16663 21.5 1.16663 28.375 17.2083 28.375C33.25 28.375 33.25 21.5 33.25 21.5V7.75"
            stroke="#F8F8F8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M17.2083 42.125C1.16663 42.125 1.16663 35.25 1.16663 35.25V21.5M17.2083 0.875C33.25 0.875 33.25 7.75 33.25 7.75C33.25 7.75 33.25 14.625 17.2083 14.625C1.16663 14.625 1.16663 7.75 1.16663 7.75C1.16663 7.75 1.16663 0.875 17.2083 0.875Z"
            stroke="#F8F8F8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <div class="text-black dark:!text-white" style="font-size: 14px; text-align: center">
          {{ $t('no_data_available') }}
        </div>
        <div class="text-black dark:!text-white" style="font-size: 12px; text-align: center">
          {{ $t('invest_to_start_pool') }}
        </div>
        <div class="add_liq_btn_pools">
          <div class="d-flex gap-1">+ {{ $t('add_liquidity') }}</div>
        </div>
      </div>
      <div v-else class="chart_inside">
        <ChartTimeline :isCumulativeMode="isCumulativeMode" :currentTimeline="currentTimeline" :timelines="timelines"
          @changeCumulativeMode="changeCumulativeMode" @changeTimeline="changeTimeline" />
        <img :src="logo" alt="D3" class="chart-logo" height="40px" />
        <VChart class="chart" :option="optionObj" :autoresize="true" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, defineProps, toRefs, watch, defineEmits } from 'vue'
import {
  TitleComponent,
  LegendComponent,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  MarkPointComponent,
} from 'echarts/components'
import { FormatTokenSnapshots } from '@/lib/formatter/tokenSnapshotsFormatter'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import { FormatHistoricalTvl } from '@/lib/formatter/poolTvlFormatter'
import * as echarts from 'echarts'
import { BarChart, CandlestickChart, LineChart } from 'echarts/charts'
import VChart from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { use } from 'echarts/core'
import logo from '@/assets/images/d3v.png'
import PortfolioArbitrageBot from '@/components/portfolio/PortfolioArbitrageBot.vue'
import { FormatTrackingInfoChart } from '@/lib/formatter/trackingInfoChartFormatter'
import {
  sumFields,
  groupTimestampsByDayWithIndexes,
  groupTimestampsByWeekWithIndexes,
  groupTimestampsByMonthWithIndexes,
  calculateAverage,
  formatSimpleTimestamp,
} from '@/lib/utils'
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
import { Network, DisplayNetwork } from '@/composables/useNetwork'
import { isRightChainName } from '@/composables/pools/usePoolSwapsStats'
import { networkId } from '@/composables/useNetwork'
import ChartTimeline from '@/UI/ChartTimeline.vue'
import { t } from 'i18next'

const props = defineProps(['networks_data', 'chainSelected', 'all_chart_data', 'rewardsData'])
const { networks_data, chainSelected, rewardsData } = toRefs(props)

const allChartData = ref([])
const filteredData = computed(() => getFilteredData())

const filters = ref({
  PNL: true,
  Rewards: true,
  'Average APR': true,
  ROI: true,
  'Staked Liquidity': true,
  Volume: true,
  'Number of Trades': true,
  'Capital Gains': true,
})
const preFiltersList = ref([
  {
    title: 'Staked Liquidity',
    code: 'Staked Liquidity',
    selected: true,
    cumulable: false,
    isSolo: true,
  },
  {
    title: 'PNL',
    code: 'PNL',
    selected: true,
    cumulable: true,
    isSolo: true,
  },
  {
    title: 'Average APR',
    code: 'Average APR',
    selected: true,
    cumulable: false,
    isSolo: true,
  },
  {
    title: 'Rewards',
    code: 'Rewards',
    selected: true,
    cumulable: true,
    isSolo: true,
  },
  {
    title: 'Volume',
    code: 'Volume',
    selected: true,
    cumulable: true,
    isSolo: true,
  },
  {
    title: 'Number of Trades',
    code: 'Trades',
    selected: true,
    cumulable: true,
    isSolo: true,
  },
  {
    title: 'ROI',
    code: 'ROI',
    selected: true,
    cumulable: false,
    isSolo: true,
  },
  {
    title: 'Capital Gains',
    code: 'Capital Gains',
    selected: true,
    cumulable: false,
    isSolo: true,
  },
])

const filterKeys = computed(() => Object.keys(filters.value))

const timelines = [
  {
    name: t('all_time'),
  },
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

const dates = computed(() => {
  return filteredData.value.map((v) => v.Date)
})

const dataGasFees = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'PNL').selected)
    return filteredData.value.map((v) => v['PNL'])
  return []
})
const dataCapitalGains = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Capital Gains').selected)
    return filteredData.value.map((v) => v['Capital Gains'])
  return []
})
const dataRewards = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Rewards').selected)
    return filteredData.value.map((v) => v['Rewards'])
  return []
})
const dataAPR = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Average APR').selected)
    return filteredData.value.map((v) => v['Average APR'])
  return []
})
const dataROI = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'ROI').selected)
    return filteredData.value.map((v) => v['ROI'])
  return []
})

const dataVolume = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Volume').selected)
    return filteredData.value.map((v) => v['Volume'])
  return []
})

const dataTrades = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Trades').selected)
    return filteredData.value.map((v) => v['Trades'])
  return []
})
const dataTvl = computed(() => {
  if (filteredData.value.length > 0 && filteredData.value[0].TVL)
    return filteredData.value.map((v) => v.TVL[chainSelected.value])
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
      color: '#777',
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
      position: 'right',
      offset: 0,
      alignTicks: true,
      axisTick: { show: false },
      splitLine: { show: false },

      axisLine: {
        show: true,
        lineStyle: { color: '#8392A5' },
      },
      axisLabel: {
        fontSize: 10,
        formatter: function (value) {
          return `$${convertFromNumber(value)}`
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
      right: '5%',
      top: 80,
      bottom: 160,
    },
  ],
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: 0,
      start: 10,
      end: 100,
    },
    {
      show: true,
      xAxisIndex: 0,
      type: 'slider',
      bottom: 70,
      start: 10,
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
  series: [
    {
      type: 'bar',
      name: 'ROI',
      data: dataROI,

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
      data: dataCapitalGains,

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
      name: 'Volume',
      type: 'bar',
      data: dataVolume,
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
      name: 'PNL',
      type: 'bar',
      data: dataGasFees,
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
        color: '#00C9FF',
        borderRadius: [5, 5, 0, 0],
      },
      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
    },
    {
      name: 'Average APR',
      type: 'line',
      data: dataAPR,
      color: '#FFC925',
      sampling: 'lttb',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#FFC925',
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
        color: '#FFC925',
      },
      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
    },
    {
      type: 'line',
      name: 'Staked Liquidity',
      data: dataTvl,
      color: '#f07e07',
      sampling: 'lttb',
      xAxisIndex: 0,
      yAxisIndex: 1,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
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
      type: 'bar',
      name: 'Rewards',
      data: dataRewards,
      color: '#05FF00',
      sampling: 'lttb',
      xAxisIndex: 0,
      yAxisIndex: 1,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
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
      name: 'Number of Trades',
      type: 'bar',
      data: dataTrades,
      color: '#6E27B2',
      sampling: 'lttb',
      areaStyle: {},
      xAxisIndex: 0,
      yAxisIndex: 0,
      smooth: true,
      showSymbol: false,
      itemStyle: {
        color: '#6E27B2',
        borderRadius: [5, 5, 0, 0],
      },
      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
    },
  ],
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

const TimelineFilters = {
  [t('all_time')]: groupTimestampsByDayWithIndexes,
  [t('daily')]: groupTimestampsByDayWithIndexes,
  [t('weekly')]: groupTimestampsByWeekWithIndexes,
  [t('monthly')]: groupTimestampsByMonthWithIndexes,
}



function getFilteredData() {
  let result = []
  let chart_data = []
  console.log("BEFORE - ", props.all_chart_data)
  if (!process.env.VUE_APP_LOCAL_API)
    chart_data = [...allChartData.value]
  else if (props.all_chart_data)
    chart_data = [...props.all_chart_data]
  if (chart_data.length == 0) return []
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
    let item = {
      ...chart_data[indexes[i]],
      ...sumFields(previousItems, selectedCumulableCodes),
    }
    let result_item = {
      Blockchain: item.Blockchain,
      timestamp: item.timestamp,
      Date: item.Date,
    }
    let avg_profit = calculateAverage(
      previousItems.map((p_item) => p_item['Profits']),
    )
    let avg_fee = calculateAverage(
      previousItems.map((p_item) => p_item['Gas Fees']),
    )
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
      } else if (filter_code == 'Avg Profit per Trade') {
        result_item['Avg Profit per Trade'] = avg_profit
      } else if (filter_code == 'Avg Gas Fee per Trade') {
        result_item['Avg Gas Fee per Trade'] = avg_fee
      }
    }
    result.push(result_item)
  }
  console.log("RESULT CHART ", result)
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
      font-size: 11px;
      margin-right: 15px;
      display: flex;
      flex-direction: column;
      border-radius: 20px;
      border: 1px solid #00c9ff;
    }
  }
}
</style>
