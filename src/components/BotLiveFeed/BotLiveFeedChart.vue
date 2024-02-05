<template>
  <div class="life_feed_card">
    <div class="life_feed_chart_header">
      <div class="tabs_container">
        <Tabs
          :selectedTab="selectedChartType"
          :tabsOptions="chartTypes"
          @changeTab="changeChartType"
        ></Tabs>
      </div>
      <div class="d-flex gap-2">
        <div class="life_feed_chart_btn">Bitcoin/Ethereum - 1D - Binance</div>
        <div class="chart-equivalent">
          <div
            class="chart-equivalent__el"
            v-for="eq in timelines"
            :key="eq.name"
            :class="{
              'chart-equivalent__el_active': currentEquivalent.name == eq.name,
            }"
            @click="changeEquivalent(eq)"
          >
            {{ eq.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="chart_inside">
      <!-- <LoaderPulse v-if="!data" /> -->
      <apexchart
        type="area"
        height="350"
        :options="chartOptions"
        :series="selectedChartType === 'Depth' ? selectedDepth : selectedLines"
      ></apexchart>
    </div>
  </div>
</template>
<script setup>
import Tabs from '@/UI/Tabs.vue'
import { ref, computed } from 'vue'

const chartTypes = ['Candle Line', 'Depth']

const selectedChartType = ref(chartTypes[0])

function changeChartType(_new) {
  selectedChartType.value = _new
}

//timelines for displaying data
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

const currentEquivalent = ref(timelines[1])

function changeEquivalent(eq) {
  currentEquivalent.value = eq
}

const selectedDepth = ref([
  {
    name: 'Buy Strike Price',
    type: 'area',
    data: [
      { x: 479, y: 5840 },
      { x: 480, y: 4840 },
      { x: 486, y: 3840 },
      { x: 490, y: 3440 },
      { x: 491, y: 3240 },
      { x: 492, y: 2740 },
      { x: 493, y: 1740 },
      { x: 494, y: 1440 },
      { x: 496, y: 1140 },
      { x: 497, y: 340 },
      { x: 498, y: 190 },
      { x: 499, y: 170 },
      { x: 500, y: 100 },
      { x: 501, y: null },
      { x: 502, y: null },
      { x: 503, y: null },
      { x: 504, y: null },
      { x: 510, y: null },
      { x: 511, y: null },
      { x: 513, y: null },
      { x: 514, y: null },
      { x: 517, y: null },
      { x: 520, y: null },
    ],
  },
  {
    name: 'Sell Strike Price',
    type: 'area',
    data: [
      { x: 479, y: null },
      { x: 480, y: null },
      { x: 486, y: null },
      { x: 490, y: null },
      { x: 491, y: null },
      { x: 492, y: null },
      { x: 493, y: null },
      { x: 494, y: null },
      { x: 496, y: null },
      { x: 497, y: null },
      { x: 498, y: null },
      { x: 499, y: null },
      { x: 500, y: null },
      { x: 501, y: 9 },
      { x: 502, y: 184 },
      { x: 503, y: 1184 },
      { x: 504, y: 1909 },
      { x: 510, y: 2009 },
      { x: 511, y: 2459 },
      { x: 513, y: 3809 },
      { x: 514, y: 4109 },
      { x: 517, y: 5109 },
      { x: 520, y: 6109 },
    ],
  },
])
const selectedLines = ref([
  {
    name: 'Buy Strike Price',
    type: 'line',
    data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
  
  },
  {
    name: 'Sell Strike Price',
    type: 'line',
    data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16].reverse(),
  },
  {
    name: 'LP Price',
    type: 'line',
    data: [26, 33, 31, 23, 44, 25, 11, 44, 23, 21, 15, 22],
  },
])

const chartOptions = computed(() => ({
  chart: {
    height: 550,

    toolbar: false,
    // dropShadow: {
    //   enabled: true,
    //   top: 2,
    //   left: 1,
    //   blur: 5,
    //   color: '#58B90A',
    //   opacity: 0.65,
    // },
  },
  //   colors: ['rgba(1, 180, 126, 1)', 'rgba(2, 176, 7, 0.5)'],
  dataLabels: {
    enabled: false,
  },
  colors: ['rgba(2, 176, 7, 1)', 'rgba(196, 63, 243, 1)', 'rgba(0, 117, 255, 1)'],
  stroke: {
    curve: 'smooth',
    width: 1,
  },
  yaxis: {
    opposite: true,
    labels: {
      show: true,
      formatter: (value) => { return `${value} ETH` },

      style: {
        colors: '#fff',
        fontSize: '10px',
        fontFamily: 'Poppins',
        fontWeight: 700,
      },
    },
  },

  xaxis: {
    type: 'string',
    categories: [
      '01 Jan 2001',
      '02 Jan 2001',
      '03 Jan 2001',
      '04 Jan 2001',
      '05 Jan 2001',
      '06 Jan 2001',
      '07 Jan 2001',
      '08 Jan 2001',
      '09 Jan 2001',
      '10 Jan 2001',
      '11 Jan 2001',
      '12 Jan 2001',
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: true,

      style: {
        colors: '#fff',
        fontSize: '10px',
        fontFamily: 'Poppins',
        fontWeight: 700,
      },
    },
  },
  legend: {
    show: true,

    position: 'top',
    horizontalAlign: 'left',

    fontSize: '12px',
    fontFamily: 'Poppins',
    fontWeight: 400,

    labels: {
      colors: '#fff',
      useSeriesColors: false,
    },
    markers: {
      width: 9,
      height: 9,

      radius: 12,

      offsetX: 0,
      offsetY: 0,
    },
  },
  grid: {
    show: true,
    strokeDashArray: 5,
    borderColor: 'rgba(86, 87, 122, 0.4)',
    position: 'back',
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      position: 'back',
      lines: {
        show: true,
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0,
      opacityFrom: 0.9,
      opacityTo: 0.7,
    },
  },

  tooltip: {
    theme: false,
    enabled: true,
    backgroundColor: 'rgba(89, 89, 89, 1), rgba(73, 73, 73, 0.45)',
    // eslint-disable-next-line
    custom({ series, dataPointIndex, w }) {
      console.log(w)
      return (
        '<div style="backdrop-filter: blur(10px); background: linear-gradient(rgba(89, 89, 89, 1), rgba(73, 73, 73, 0.45)); color:white; padding: 10px;">' +
        '<div style="display:flex; flex-direction:column; font-size: clamp(10px, 0.8vw, 14px)">' +
        '<span>' +
        '<span style="font-weight:700">' +
        'Buy Strike Price: ' +
        series[0][dataPointIndex] +
        ' ' +
        (series[0][dataPointIndex] === 1 ? '$' : '$') +
        '</span>' +
        '<br/>' +
        '<span style="font-weight:700">' +
        'Sell Strike Price: ' +
        series[1][dataPointIndex] +
        ' ' +
        (series[1][dataPointIndex] === 1 ? '$' : '$') +
        '</span>' +
        '<br/>' +
        '<span style="font-weight:700">' +
        'LP Price: ' +
        series[2][dataPointIndex] +
        ' ' +
        (series[2][dataPointIndex] === 1 ? '$' : '$') +
        '</span>' +

        '</div>' +
        '</div>'
      )
    },
  },
  responsive: [
    {
      breakpoint: 1400,
      options: {
        chart: {
          height: 400,
        },
        yAxis: {
          labels: {
            show: true,

            style: {
              fontSize: '8px',
            },
          },
        },

        xaxis: {
          type: 'string',
          axisBorder: {
            show: false,
          },

          labels: {
            show: true,

            style: {
              fontSize: '8px',
            },
          },
        },
        legend: {
          fontSize: '10px',
        },
      },
    },
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 250,
        },
      },
    },
  ],
}))
</script>
<style lang="scss" scoped>
.life_feed_card {
  border: 1px solid rgba(163, 164, 165, 0.26);
  border-radius: 20px;
  width: 100%;
  padding: 20px;
}
.tabs_container {
  width: fit-content;
}
.life_feed_chart_header {
  display: flex;
  justify-content: space-between;
}
.life_feed_chart_btn {
  border: 1px solid rgba(1, 180, 126, 1);
  border-radius: 20px;
  padding: 0px 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Poppins;
  font-size: 10px;
  font-weight: 400;
  line-height: 15px;
  letter-spacing: 0em;
  color: white;
}

.chart {
  &-equivalent {
    color: #7ef6b2;
    font-size: clamp(8px, 0.5vw, 12px);

    display: flex;
    justify-self: flex-start;
    border-radius: 20px;
    border: 1px solid #01b47e;
    width: fit-content;

    z-index: 7;

    &__el {
      padding: 0px 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border-radius: 20px;

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
}
</style>
