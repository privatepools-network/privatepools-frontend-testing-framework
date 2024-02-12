<template>
  <div class="chart_inside">
    <div class="timeline_container">
      <div class="chart-timeline">
        <div class="chart-equivalent">
          <div
            class="chart-equivalent__el"
            v-for="timeline in timelines"
            :key="timeline.name"
            :class="{
              'chart-equivalent__el_active':
                currentTimeline.name == timeline.name,
            }"
            @click="changeTimeline(timeline)"
          >
            {{ timeline.name }}
          </div>
          <div
            class="chart-equivalent__el"
            :class="{
              'chart-equivalent__el_active': isCumulativeMode == true,
            }"
            @click="isCumulativeMode = !isCumulativeMode"
          >
            Cumulative
          </div>
        </div>
      </div>
    </div>
    <img :src="logo" alt="D3" class="chart-logo" />
    <VChart class="chart" :option="optionObj" :autoresize="true" />
  </div>
</template>
<script setup>
import VChart from 'vue-echarts'
import { computed, ref } from 'vue'
import { use } from 'echarts/core'
import logo from '@/assets/images/d3v.png'
import * as echarts from 'echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkPointComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import {cryptoData} from '@/lib/test.js'

use([
  CanvasRenderer,
  TitleComponent,
  LineChart,
  BarChart,
  LegendComponent,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  MarkPointComponent,
])

const filters = ref({
  Profits: true,
  TVL: true,
  ['BTC/ETH Profits']: true,
  ['BTC Price']: true,
  ['ETH Price']: true,
  ['ETH Reserve']: true,

  ['BTC Reserve']: true,
  ['BTC/ETH Ratio']: true,
  ['BTC/ETH Reserve']: true,

})

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

const dates = cryptoData?.data.map(function (item) {
  return item.Date
})
const dataTVL = cryptoData?.data.map(function (item) {
  return +item.TVL
})
const dataVolume = cryptoData?.data.map(function (item) {
  return +item.Price
})
const dataFees = cryptoData?.data.map(function (item) {
  return +item.Fees
})
const dataRevenue = cryptoData?.data.map(function (item) {
  return +item.Revenue
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
    width: '70%',

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
      console.log(params)
      return `
      ${params[0].name} <br />
                ${params
                  .map((el) =>
                    el.seriesName === 'Revenue' ||
                    el.seriesName === 'Profits' ||
                    el.seriesName === 'TVL' ||
                    el.seriesName === 'Avg Gas Fee per Trade' ||
                    el.seriesName === 'Avg Profit per Trade' ||
                    el.seriesName === 'Volume'
                      ? `$${el.marker} ${el.seriesName}: ${
                          el.value ? el.value.toFixed(3) : 0
                        } <br />`
                      : el.seriesName === 'Volatility Index'
                      ? `${el.marker} ${el.seriesName}: ${
                          el.value ? el.value.toFixed(3) : 0
                        }% <br />`
                      : el.seriesName === 'Number of Trades'
                      ? `${el.marker} ${el.seriesName}: ${
                          el.value ? el.value.toFixed(0) : 0
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
      gridIndex: 0,
      splitLine: {
        lineStyle: {
          color: 'rgba(51,51,51, 0.35)',
        },
      },
    },
   
    {
      type: 'value',
      name: 'TVL',
      position: 'right',
      offset: 0,
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
      right: '5%',
      top: 80,
      bottom: 85,
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
      bottom: 15,
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
    name: 'Profits',
    data: dataFees.reverse(),
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
    data: dataTVL,
    color: '#f07e07',
    sampling: 'lttb',
    xAxisIndex: 0,
    yAxisIndex: 1,
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
    name: 'BTC/ETH Profits',
    type: 'line',
    data: dataTVL,
    color: 'rgba(255, 201, 37, 1)',

    sampling: 'lttb',
    lineStyle: {
      width: 1,
      color: 'rgba(255, 201, 37, 1)',
    },
    smooth: true,
    showSymbol: false,
  
    emphasis: {
      focus: 'series',
      blurScope: 'coordinateSystem',
    },
  },
  {
    name: 'BTC Price',
    type: 'line',
    data: dataRevenue.reverse(),
    color: 'rgba(255, 143, 214, 1)',
    sampling: 'lttb',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: 'rgba(255, 143, 214, 1)',
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
      color: 'rgba(255, 143, 214, 1)',
    },
    emphasis: {
      focus: 'series',
      blurScope: 'coordinateSystem',
    },
  },

  {
    name: 'ETH Price',
    type: 'line',
    data: dataFees.reverse(),
    color: 'rgba(158, 0, 255, 1)',
    sampling: 'lttb',
    areaStyle: {},

    smooth: true,
    showSymbol: false,
    lineStyle: {
      width: 1,
      color: 'rgba(158, 0, 255, 1)',
    },
    emphasis: {
      focus: 'series',
      blurScope: 'coordinateSystem',
    },
  },
  {
    type: 'line',
    name: 'BTC Reserve',
    data: dataRevenue.reverse(),
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
    name: 'ETH Reserve',
    data: dataTVL.reverse(),
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
    name: 'BTC/ETH Ratio',
    data: dataVolume.reverse(),
    color: 'rgba(0, 255, 56, 1)',
    sampling: 'lttb',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: 'rgba(0, 255, 56, 1)',
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
      color: 'rgba(0, 255, 56, 1)',
      type: 'dashed',
    },
    emphasis: {
      focus: 'series',
      blurScope: 'coordinateSystem',
    },
  },
  {
    type: 'line',
    name: 'BTC/ETH Reserve',
    data: dataVolume.reverse(),
    color: '#6e27b2',
    sampling: 'lttb',
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: '#6e27b2',
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
      color: '#6e27b2',
      type: 'dashed',
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
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.track_info_container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  /* gap: 10px; */
}

@media (min-width: $xl) {
  .track_info_container {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    /* gap: 15px; */
  }
}

@media (max-width: $xxl) {
}

@mixin trades-table {
  width: 100px;
  @media (max-width: $xxl) {
    width: 70px;
  }
  &:nth-child(1) {
    width: 250px;
    @media (max-width: $xxl) {
      width: 170px;
    }
  }

  &:nth-child(2) {
    width: 200px;
    @media (max-width: $xxl) {
      width: 130px;
    }
  }
  &:nth-child(8) {
    width: 100px;
    @media (max-width: $xxl) {
      width: 75px;
    }
  }

  &:nth-child(8) {
    width: 200px;
    @media (max-width: $xxl) {
      width: 120px;
    }
  }
}

.table-cell {
  @include trades-table;
}

:deep(.table-header-font-folder) {
  @include trades-table;
}

.table {
  &-row {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  &-body {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 626px;
    display: block;
    .table-row {
      width: calc(100% + 8px);
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
      background-color: #02120a;
      border-radius: 50px;
      margin-bottom: 10px;
    }

    &::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
      background: #02120a;
      border-radius: 50px;
    }

    &::-webkit-scrollbar-thumb {
      border: 2px solid #02120a;
      background: #00C9FF;
      border-radius: 21px;
    }
  }

  &-cell {
    text-align: center;
    font-weight: 400;
    white-space: nowrap;
    font-size: 14px;
    padding: 24px 0 24px 10px;
    @media (max-width: $xxl) {
      font-size: 10px;
      padding: 12px 0 12px 10px !important;
    }
    &:first-child {
      padding: 15px 0 15px 45px;
      text-align: left;
      @media (max-width: $xxl) {
        padding: 12px 0 12px 15px !important;
      }
    }

    &:last-child {
      padding: 15px 10px 15px 10px;
      @media (max-width: $xxl) {
        padding: 12px 10px 12px 10px !important;
      }
    }
  }
}

.chart-logo {
  display: block;
    position: relative;
    top: 49%;
    left: 48%;
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
  border: 1px solid rgba(163, 164, 165, 0.26);
  border-radius: 0px 20px 20px 0px;
  width: 100%;
  padding: 20px;
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
  height: 550px;
  padding-bottom: 20px;
}

@media (max-width: $xxl) {
  .track_chart_card {
    width: 100%;
  }

  .chart_inside {
    width: 100%;
    height: 450px;
  }

  .chart-filters {
    gap: 5px 2px;
  }
}

@media (max-width: $md) {
  .chart-logo {
  display: block;
    position: relative;
    top: 49%;
    left: 44%;
    opacity: 0.15;
    transform: scale(0.6)
}
  .timeline_container {

    margin-bottom: -20px !important;
  }

  .chart {
    &-equivalent {
      padding: 0px;
      color: #fff;
      font-size: clamp(8px, 0.5vw, 12px);
      margin-right: 15px;
      display: flex;
      flex-direction: column;
      border-radius: 20px;
      border: 1px solid #00C9FF;
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.reload_button:hover path {
  stroke: #00C9FF !important;
}

.filter_button:hover path {
  stroke: #00C9FF !important;
}

.reload_button__active {
  animation: rotate 2s linear infinite;
}

.filter_button__active {
  stroke: #ffffff !important;
}

.tracking_table {
  padding: 0;
  border-radius: 20px;
  outline: 0.5px solid rgba(163, 164, 165, 0.4);
  background: transparent;
  overflow-x: auto;
}

@media (min-width: $xl) {
  .tracking_table {
    overflow: auto;
  }
}

@media (min-width: $md) {
  /* .chart-logo {
    display: block;
    position: relative;
    top: 39%;
    left: 48%;
    opacity: 0.15;
  } */

  .filters_container {
    display: flex;
    align-items: flex-start;
    margin-top: 10px;
    margin-bottom: 40px;
    gap: 10px;
    flex-wrap: wrap;
  }
}

.transaction-link {
  text-decoration: none;
}

.transaction-link:hover {
  color: rgba(1, 180, 126, 0.884);
}

.text-green {
  color: rgb(74 222 128);
}

.border-dotted {
  border-bottom-style: dotted;
  border-bottom-width: 1px;
}

.portfolio {
  &-table {
    &__dropdown {
      position: relative;
      font-size: 14px;

      &__title {
        color: #fff;
        padding: 9px 13px;
        border-radius: 12px;
        border: 1px solid #7ef6b2;
        text-align: center;
        cursor: pointer;

        &_active {
          border-radius: 12px 12px 0 0;
          border-bottom: 1px solid #fff;

          svg {
            transition-duration: 0.3s;
            transform-origin: center;
            transform: rotate(180deg);
          }
        }
      }

      &__wrapper {
        padding: 7px;
        position: absolute;
        border-radius: 0 0 12px 12px;
        border: 1px solid #7ef6b2;
        border-top: none;
        background: #000;
        z-index: 101;
      }

      &__option {
        color: rgba(#fff, 0.6);
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        svg {
          min-width: 9px;
        }

        &_active {
          color: #fff;
        }
      }
    }
  }
}

@media (max-width: $xl) {
  .timeline_container {
    width: fit-content;
    display: flex;
    position: static;
    z-index: 30;
    margin-left: 0;
    margin-top: 0;
    margin-bottom: 20px;
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
