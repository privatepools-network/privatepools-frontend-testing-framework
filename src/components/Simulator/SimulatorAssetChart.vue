<template>
  <div class="chart-filters" v-if="isLoading == false">
    <div class="chart-filters__el"
      :class="{ 'chart-filters__el_active': item.isSelected, 'chart-filters__el_opened': item.isOptionsOpened }"
      v-for="item in data" :key="item.title">
      <div class="chart-filters__title" @click="toggleFullData(item)">
        {{ item.title }}
        <svg xmlns="http://www.w3.org/2000/svg" class="chart-filters__dropdown-icon" v-if="item.isSolo == false"
          width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <div class="chart-filters__options" v-if="item.isOptionsOpened == true">
        <div class="chart-filters__toggling">
          <div class="chart-filters__toggler" @click="toggleFullData(item), toggleFullData(item)">
            Clear
          </div>
          <div class="chart-filters__toggler" @click="toggleEveryOption(item)">
            Toggle All
          </div>
        </div>
        <div class="chart-filters__option" v-for="denomination in item.denominations"
          :class="{ 'chart-filters__option_selected': item.selectedDenominations.indexOf(denomination) != -1 }"
          :key="denomination" @click="toggleOneData(item, denomination)">
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
  <div class="chart-filters" v-else>
    <div class="chart-filters__el chart-filters__el_progress" v-for="item in preFiltersList" :key="item">
      <div class="chart-filters__title">
        {{ item.title }}
        <svg xmlns="http://www.w3.org/2000/svg" class="chart-filters__dropdown-icon" v-if="item.isSolo == false"
          width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
  </div>
  <div class="chart-wrapper">
    <div class="chart-equivalent">
      <div class="chart-equivalent__el" v-for="eq in equivalents" :key="eq.name"
        :class="{ 'chart-equivalent__el_active': currentEquivalent.name == eq.name }" @click="changeEquivalent(eq)">
        {{ eq.name }}
      </div>
    </div>
    <div class="chart-timeline">
      <div class="chart-equivalent">
        <div class="chart-equivalent__el" v-for="timeline in timelines" :key="timeline.name"
          :class="{ 'chart-equivalent__el_active': currentTimeline.name == timeline.name }"
          @click="changeTimeline(timeline)">
          {{ timeline.name }}
        </div>
        <div class="chart-equivalent__el" :class="{ 'chart-equivalent__el_active': isCumulativeMode == true }"
          @click="acummulateData(false)">
          Cumulative
        </div>
      </div>
    </div>
  </div>
  <div class="chart_inside">
            <img :src="logo" alt="D3" class="chart-logo" />
            <v-chart :option="option" autoresize v-show="isLoading == false" ref="chartInstance"></v-chart>
          </div>
  <!-- <div class="chart-loading" v-show="isLoading">
    <img :src="logo" alt="D3" class="chart-loading__img">
  </div> -->
</template>
<script setup>
import VChart from 'vue-echarts'
import { computed, ref, defineProps, toRefs, watch } from 'vue'
import { use } from "echarts/core";
import logo from '@/assets/images/d3v.png'
import * as echarts from 'echarts';
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkPointComponent,
  TitleComponent,
  TooltipComponent
} from "echarts/components";
import { excludeKeyFromObject, generatePairCombinations } from "@/lib/utils/index"

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


const isLoading = ref(true)

const props = defineProps(['chartData', 'tokens', 'preFiltersList'])

const { tokens, chartData, preFiltersList } = toRefs(props)
const data = computed(() => chartData.value && chartData.value.timestamps ? excludeKeyFromObject(chartData.value, 'timestamps') : [])
const cachedData = ref()
const dateData = computed(() => chartData.value && chartData.value.timestamps && currentTimeline.value.name == 'Hourly' ? chartData.value.timestamps : [])

const tokensPairs = computed(() =>
  generatePairCombinations(tokens.value))

//Array of data used in the chart
const finalData = ref([])

const firstDataElement = computed(() => {
  let firstEl
  for (let key in data.value) {
    firstEl = key
    break
  }
  return firstEl
})

//Equivalents for displaying data
const equivalents = computed(() => [{
  name: 'USD',
  cost: 1
}, ...tokens.value.map((t) => {
  return {
    name: t,
    cost: 0
  }
})])

const currentEquivalent = ref(equivalents.value[0])

let firstLoading = true
watch(chartData, (_new) => {
  initYAxis()
  InitFinalDataFormat()
  // changeTimeline(timelines[3])
  isLoading.value = false
  if (_new[firstDataElement.value]) {
    toggleFullData(_new[firstDataElement.value])
  }
  if (firstLoading) {
    cachedData.value = JSON.parse(JSON.stringify(data.value))
    firstLoading = false
  }
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

function changeEquivalent(eq) {
  currentEquivalent.value = eq
  yAxis.value.forEach((item) => {
    item.axisLabel.formatter = `{value} ${currentEquivalent.value.name}`
  })
  updateFinalData()
}

const legends = ref([])

// Initialization of vertical axis for different filter selections
const yAxis = ref([
  {
    type: 'value',
    title: computed(() => data.value[firstDataElement.value] ? data.value[firstDataElement.value].name : ''),
    boundaryGap: [0, '100%'],
    position: 'left',
    smooth: true,
    axisLine: {
      show: false,
    },
    splitLine: {
        lineStyle: {
          color: 'rgba(51,51,51, 0.35)',
        },
      },
    axisLabel: {
      formatter: `{value} ${currentEquivalent.value.name}`,
      color: '#fff'
    },
  },
])

function initYAxis() {
  for (let key in chartData.value) {
    let item = chartData.value[key]
    if (item.name && item.name != data.value[firstDataElement.value].name) {
      createYAxis(item)
    }
  }
}

function createYAxis(item) {
  yAxis.value.push(
    {
      type: 'value',
      title: item.name,
      boundaryGap: 0,
      position: 'right',
      smooth: true,
      offset: 70,
      splitLine: {
        lineStyle: {
          color: 'rgba(51,51,51, 0)',
        },
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: item.color
        }
      },
      axisLabel: {
        formatter: function (value) {
    return convertFromNumber(value) + ' ' + currentEquivalent.value.name;
},
        textStyle: {
          color: item.color,
          fontSize:11
        },
      },
    },
  )
}

function initYAxisPosition() {
  let yaxisindex = 0
  yAxis.value.forEach((item, i) => {
    if (data.value[item.title].isSelected && item.title != data.value[firstDataElement.value].name) {
      yAxis.value[i].offset = yaxisindex * 70
      yaxisindex++
    }
  })
}

// Initialization of the data format in charts and filters for them
function InitFinalDataFormat() {
  for (let key in chartData.value) {
    let item = chartData.value[key]
    if (item.isPair && !item.isSolo) {
      tokensPairs.value.forEach((pair) => {
        createSeries(item, pair)
      })

      item.denominations = tokensPairs
    } else if (!item.isPair && !item.isSolo && item.name) {
      tokens.value.forEach((token) => {
        createSeries(item, token)
      })
      item.denominations = tokens.value
    } else if (item.isSolo) {
      createSeries(item, 'USD')
    }

  }
}

function createSeries(item, token) {
  let yAxisIndex = 0
  yAxis.value.forEach((yAxi, i) => {
    if (yAxi.title == item.name) {
      yAxisIndex = i
    }
  })
  const dataDisplayType = computed(() => {
    return item.cumulable && isCumulativeMode.value == false ? 'bar' : 'line'
  })
  finalData.value.push(
    {
      name: `${item.title} ${token}`,
      title: item.name,
      token: token,
      yAxisIndex: yAxisIndex,
      type: dataDisplayType,
      symbol: 'none',
      smooth: true,
      sampling: 'lttb',
      splitLine: {
        lineStyle: {
          color: 'rgba(51,51,51, 0.15)',
        },
      },
      markLine: {
        silent: true,
        lineStyle: {
          color: '#333'
        }
      },
      itemStyle: {
        color: item.color,
        borderRadius: [5, 5, 0, 0],
      },
      // barWidth: '20%',
      // roundCap: true,
      areaStyle:  {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: item.color
          },
          {
            offset: 1,
            color: 'transparent'
          }
        ])
      },
      data: [],
      large: true,
      isPair: item.isPair,
      isSolo: item.isSolo,
      labelLayout: {
        moveOverlap: 'shiftY'
      },
      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
    },
  )
}

const chartLeftPadding = ref('20')

//The function that is executed when the filter header is selected.
async function toggleFullData(item) {
  //The first click on the filter

  if (!item.isOptionsOpened && !item.isSelected) {
    item.isSelected = true

    if (!item.isSolo) {
      item.isOptionsOpened = true
    }
    for (let key in option.value.yAxis) {
      if (option.value.yAxis[key].title == item.name) {
        option.value.yAxis[key].axisLine.show = true
      }
    }
    if (item.cumulable && item.isSolo) {
      legends.value.push({
        name: `${item.title} USD`,
        icon: 'bar',
      })
    } else if ((item.cumulable && !item.isSolo) || (!item.cumulable && !item.isSolo)) {
      item.denominations.forEach(denomination => {
        legends.value.push({
          name: `${item.title} ${denomination}`,
        })
      })
    } else if (!item.cumulable && item.isSolo) {
      legends.value.push({
        name: `${item.title} USD`,
      })
    }
    //
    //
    // if (item.name != 'profitsPerPair' && item.name != 'profits' && item.name != 'TVL') {
    //   item.denominations.forEach(denomination => {
    //     legends.value.push({
    //       name: `${item.title} ${denomination}`,
    //     })
    //   })
    // } else if(item.name == 'profits'){
    //   legends.value.push({
    //     name: `${item.title} USD`,
    //     icon: 'bar',
    //   })
    // } else if(item.name == 'profitsPerPair') {
    //   item.denominations.forEach(denomination => {
    //     legends.value.push({
    //       name: `${item.title} ${denomination}`,
    //     })
    //   })
    // } else if(item.name == 'TVL') {
    //   legends.value.push({
    //     name: `${item.title} USD`,
    //   })
    // }

    initYAxisPosition()

    if (item.name == data.value[firstDataElement.value].name) {
      chartLeftPadding.value = '80'
    }

    let index = 0;
    finalData.value.forEach((finalDataItem) => {
      if (finalDataItem.title == item.name) {
        if (finalDataItem.data.length == 0) {
          const dataArr = item.data[index]
          item.selectedDenominations = item.denominations.slice(0)
          finalDataItem.data = formatChartData(dataArr)
        }
        index++
      }
    })

    chartInstance.value.setOption(option.value, { replaceMerge: ['series'] })
    updateFinalData()
    if (item.cumulable) {
      acummulateData(true)
    }
    //The second click on the filter, closing options
  } else if (item.isOptionsOpened && item.isSelected) {
    item.isOptionsOpened = false

    //The third click on the filter, disabling the filter and clearing unnecessary data
  } else {
    item.selectedDenominations = []
    item.isSelected = false
    finalData.value.forEach((finalDataItem) => {
      if (finalDataItem.title == item.name) {
        if (finalDataItem.data.length > 0) {
          finalDataItem.data = []
        }
      }
    })
    if (item.name == data.value[firstDataElement.value].name) {
      chartLeftPadding.value = '20'
    }
    for (let key in option.value.yAxis) {
      if (option.value.yAxis[key].title == item.name) {
        option.value.yAxis[key].axisLine.show = false
      }
    }
    legends.value.forEach((legend, i) => {
      if (item.isSolo) {
        if (legend.name == `${item.title} USD`) {
          legends.value[i] = {}
        }
      } else {
        item.denominations.forEach(denomination => {
          if (legend.name == `${item.title} ${denomination}`) {
            legends.value[i] = {}
          }
        })
      }
    })
    initYAxisPosition()
  }
}

function toggleEveryOption(item) {
  item.denominations.forEach((denomination) => {
    let index = 0
    finalData.value.forEach((finalDataItem) => {
      if (finalDataItem.title == item.name) {
        if (finalDataItem.token == denomination) {
          if (finalDataItem.data.length == 0) {
            const dataArr = item.data[index]
            item.selectedDenominations.push(denomination)
            finalDataItem.data = formatChartData(dataArr)
            chartInstance.value.setOption(option.value, { replaceMerge: ['series'] })
            legends.value.push({
              name: `${item.title} ${denomination}`,
            })
          }
        }
        index++
      }
    })
  })
}

//Changing data when clicking on the filter option
function toggleOneData(item, denomination) {
  let index = 0
  finalData.value.forEach((finalDataItem) => {
    if (finalDataItem.title == item.name) {
      if (finalDataItem.token == denomination) {
        if (finalDataItem.data.length == 0) {
          const dataArr = item.data[index]
          item.selectedDenominations.push(denomination)
          finalDataItem.data = formatChartData(dataArr)
          chartInstance.value.setOption(option.value, { replaceMerge: ['series'] })
          legends.value.push({
            name: `${item.title} ${denomination}`,
          })
        } else {
          const denominationIndex = item.selectedDenominations.indexOf(denomination)
          item.selectedDenominations.splice(denominationIndex, 1)
          if (item.selectedDenominations.length == 0) {
            item.isOptionsOpened = false
            item.isSelected = false
          }
          finalDataItem.data = []
          legends.value.forEach((legend, i) => {
            if (legend.name == `${item.title} ${denomination}`) {
              legends.value[i] = {}
            }
          })
        }
      }
      index++
    }
  })

}


//Calculating the number of selected filters to calculate the right margin for vertical axis
const selectedFiltersLength = computed(() => {
  let selectedFiltersLength = 0
  for (let key in data.value) {
    if (data.value[key].isSelected) {
      selectedFiltersLength++
    }
  }
  if (selectedFiltersLength == 0) {
    return 1
  } else {
    return selectedFiltersLength
  }
})

const option = computed(() => {
  return {

    responsive: true,
    series: finalData.value,
    grid: {
      left: chartLeftPadding.value + 'px',
      right: (selectedFiltersLength.value) * 60 + 'px',
      top: '13%',
      bottom: '20%'
    },
    legend: {
      data: legends.value,

      left: 0,
      inactiveColor: '#777',
    textStyle: {
      color: '#ccc',
      fontSize: '10px',
        fontFamily: 'Poppins',
        fontWeight: 700,
    },
    },
    tooltip: {
      backgroundColor: 'rgba(73, 73, 73, 0.65)',
      borderWidth: 0,
      textStyle: {
        color: 'white'
      },
      trigger: 'axis',
      confine: true,
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: '#f1f1f1',
          width: 2,
          opacity: 1,
        },
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date.value
    },
    yAxis: yAxis.value,

    dataZoom: [
    {
      type: 'inside',
      xAxisIndex: 0,
      start: 0,
      end: 100,
    },
      {
        type: 'slider',
        xAxisIndex: 0,
        bottom: '5%',
        start: 0,
        end: 100,
        selectedDataBackground: {
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: 'blue',
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

  }
})


//Data presentation options
const timelines = [
  {
    name: 'Hourly',
  },
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

// Why change of timeline broke all chart?
const currentTimeline = ref(timelines[0])
const chartInstance = ref()

//Changing the variable indicating the currently selected data display method (Hourly,Daily etc.)
function changeTimeline(tl) {
  currentTimeline.value = tl
  let timestampsIndexes = []
  if (tl.name == 'Hourly') {
    timestampsIndexes = [...Array(chartData.value.timestamps.length - 1)].map((_, i) => i)
    dateData.value = chartData.value.timestamps
  } else if (tl.name == 'Daily') {
    dateData.value = []
    chartData.value.timestamps.forEach((item, i) => {
      const timestampHour = new Date(item).getHours()
      if (timestampHour == 0) {
        timestampsIndexes.push(i)
        dateData.value.push(item)

      }
    })
  } else if (tl.name == 'Weekly') {
    dateData.value = []
    chartData.value.timestamps.forEach((item, i) => {
      const timestampHour = new Date(item).getHours()
      const timestampDay = new Date(item).getDay()
      if (timestampHour == 0 && timestampDay == 0) {
        timestampsIndexes.push(i)
        dateData.value.push(item)
      }
    })
  } else {
    dateData.value = []
    chartData.value.timestamps.forEach((item, i) => {
      let date = new Date(item)
      const timestampHour = date.getHours()
      const timestampDay = date.getDate()
      const monthLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
      if (timestampHour == 0 && timestampDay == monthLastDay) {
        timestampsIndexes.push(i)
        dateData.value.push(item)
      }
    })
  }

  for (let key in data.value) {
    if (data.value[key].cumulable == false) {
      data.value[key].data.forEach((item, i) => {

        const bufferData = []
        timestampsIndexes.forEach((item2) => {
          bufferData.push(cachedData.value[key].data[i][item2])
        })
        data.value[key].data[i] = bufferData

      })
    } else {
      data.value[key].data.forEach((item, i) => {
        const bufferData = []
        let lastItem = 0
        timestampsIndexes.forEach((item2) => {
          // bufferData.push(cachedData.value[key].data[i][item2])
          const chunkOfArr = cachedData.value[key].data[i].slice(lastItem, item2)
          lastItem = item2

          const sumOfItems = chunkOfArr.reduce((acc, number) => acc + number, 0);
          bufferData.push(sumOfItems)
        })
        data.value[key].data[i] = bufferData

      })
    }
  }

  chartInstance.value.setOption(option.value, { replaceMerge: ['series'] })
  updateFinalData()
}

// Function that executes and returns timestamps in the desired form
const date = computed(() => {
  let formattedDate = []
  dateData.value.forEach((item) => {
    const newDate = new Date(item).toLocaleString('en-GB', {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    })
    formattedDate.push(newDate)
  })
  return formattedDate
})

// The function returns the desired token object or token pair
function getSearchTokensArray(item) {
  if (item.isPair && !item.isSolo)
    return tokensPairs.value
  if (!item.isPair && !item.isSolo)
    return tokens.value
  return [item.token]
}

//A function that performs data reduction to the desired form
function formatChartData(dataArr) {
  if (currentEquivalent.value.name == "USD") {
    return dataArr.map((d) => parseFloat(d).toFixed(4))
  }
  let index = tokens.value.findIndex(t => t == currentEquivalent.value.name)
  let data = chartData.value.priceOfAssets.data[index]
  return dataArr.map((d, i) => (d / data[i]).toFixed(4))
}

//Variable means accumulation mode is enabled or not
const isCumulativeMode = ref(false)

// A function that performs the sequential addition
// of all elements in the data array formed in the function above
function acummulateData(isChangingFilter) {
  if (isChangingFilter == false) {
    isCumulativeMode.value = !isCumulativeMode.value
  }
  if (isCumulativeMode.value == true) {
    for (let i = 0; i < finalData.value.length; i++) {
      let item = finalData.value[i]
      if (item.cumulable) {
        if (item.data.length > 0) {
          let tokens = getSearchTokensArray(item)
          let foundIndex = tokens.findIndex(t => t == item.token)

          let dataArr = chartData.value[item.title].data[foundIndex]

          const foundData = formatChartData(dataArr)

          let cumulativeData = [];
          let accumulator = 0;
          for (let i = 0; i < foundData.length; i++) {
            accumulator += Number(foundData[i]);
            cumulativeData.push(accumulator);
          }
          item.data = cumulativeData
        }
      }
    }
    chartInstance.value.setOption(option.value, { replaceMerge: ['series'] })
  } else {
    updateFinalData()
  }


}

// A function for updating the finalData
// variable and then changing the data in the chart

function updateFinalData() {
  for (let i = 0; i < finalData.value.length; i++) {
    let item = finalData.value[i]
    if (item.data.length > 0) {
      let tokens = getSearchTokensArray(item)
      let foundIndex = tokens.findIndex(t => t == item.token)
      let dataArr = chartData.value[item.title].data[foundIndex]
      item.data = formatChartData(dataArr)
    }
  }
  if (isCumulativeMode.value == true) {
    acummulateData(true)
  }
}



</script>
<style lang="scss">

.chart_inside {
  width: 100%;
  height: 490px;
}

.chart-logo {
  position: relative;
  top: 42%;
  left: 48%;
  opacity: 0.15;
}
.chart {
  &-filters {
    display: flex;
    align-items: flex-start;
    margin-bottom: 24px;
    @media all and (max-width: 1200px) {
      flex-wrap: wrap;
      margin-bottom: 14px;
    }

    &__el {
      color: #fff;
      font-size: 14px;
      margin-right: 6px;
      display: flex;
      flex-direction: column;
      position: relative;
      cursor: pointer;
      @media all and (max-width: 1200px) {
        margin-bottom: 10px;
      }

      &_progress {
        cursor: progress;
        opacity: 0.6;

        .chart-filters__title {
          &:hover {
            background: none;
          }
        }
      }
      &_active {
        .chart-filters__title {
          background: #01B47E;

          &:hover {
            background-color: rgba(#01B47E, .7);
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
      color: #01B47E;
      font-size: 11px;
      font-weight: 300;
      text-decoration-line: underline;
    }
    &__dropdown-icon {
      transition: 0.3s;
    }
    &__title {
      padding: 8px 8px;
      border-radius: 20px;
      border: 1px solid #7EF6B2;
      &:hover {
        background-color: rgba(#01B47E, .3);
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
        background-color: rgba(#01B47E, .3);
      }
      &_selected {
        svg {
          display: block;
        }
        &:hover {
          background-color: rgba(#01B47E, .3);
        }
      }
    }
    &__options {
      width: 100%;
      top: 100%;
      position: absolute;
      background: #000;
      z-index: 11;
      border: 1px solid #7EF6B2;
      border-top: none;
      border-radius: 0 0 12px 12px;
    }
  }
  &-equivalent {
    padding: 0px;
    color: rgba(126, 246, 178, 1);
    font-size: 11px;
    margin-right: 15px;
    display: flex;
    justify-self: flex-start;
    border-radius: 20px;
    border: 1px solid #01b47e;

    &__el {
      padding: 8px 15px;
      cursor: pointer;
      border-radius: 20px;

      &:hover {
        background: rgba(#01b47e, 0.3);
      }

      &_active {
        background: #01b47e;
        color: #fff;
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
    margin-left: auto;
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
};
</style>
