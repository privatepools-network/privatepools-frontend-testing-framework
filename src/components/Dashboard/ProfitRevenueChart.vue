<template>
  <div class="d-flex gap-2 mt-md-0 mt-3 mt-xxl-4  align-items-center">
    <div class="d-flex align-items-center gap-1">
      <Title :title="'Revenue/Profit Overview'"> 

    </Title>
    <VTooltip :distance="0" :placement="'right'">
        <div style="cursor: help">
          <img :src="info" class="info_icon" />
        </div>
        <template #popper>
          <div style="
            background: linear-gradient(
              rgba(89, 89, 89, 0.75),
              rgba(73, 73, 73, 0.15)
            );
            backdrop-filter: blur(10px);
            padding: 10px;
            border-radius: 4px;
            width: 400px;
          ">
            <div style="font-size: clamp(10px, 0.9vw, 16px)">Information</div>
            <div style="
              display: flex;
              flex-direction: column;
              font-size: clamp(10px, 0.8vw, 14px);
            ">
              <p>
                Explore the interplay between Profit and Revenue over time.
                Presented as a line chart, you can analyze both metrics on a
                daily, weekly, or monthly basis.
              </p>
            </div>
          </div>
        </template>
      </VTooltip>
    </div>
    
  </div>
  <div class="track_chart_card">
    <div v-if="width > 768" class="d-flex flex-column justify-content-end flex-lg-row" style="margin-top: -35px">
      <div class="chart-equivalent">
        <div class="chart-equivalent__el" v-for="eq in timelines" :key="eq.name" :class="{
          'chart-equivalent__el_active': currentEquivalent.name == eq.name,
        }" @click="changeEquivalent(eq)">
          {{ eq.name }}
        </div>
      </div>
    </div>

    <div class="chart_inside">
      <LoaderPulse v-if="!data" />
      <apexchart v-else-if="data" type="area" height="350" :options="chartOptions" :series="selectedSeries"></apexchart>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, defineProps, toRefs, watch } from 'vue'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import Title from "@/UI/Title.vue";
import { useDevice } from '@/composables/adaptive/useDevice'
import info from '@/assets/images/info.svg'
import btcSymbol from '@/assets/images/tokens/btcSymbol.png'
import ethSymbol from '@/assets/images/tokens/ethSymbol.png'

const props = defineProps(['data', 'dates', 'symbol'])
const { data, dates, symbol } = toRefs(props)
const { width } = useDevice()

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

const currentEquivalent = ref(timelines[0])

const selectedSeries = computed(() => data.value[currentEquivalent.value.name])
const selectedDates = computed(() => dates.value[currentEquivalent.value.name])

function changeEquivalent(eq) {
  currentEquivalent.value = eq
}

const chartOptions = computed(() => ({
  chart: {
    height: 350,
    type: 'area',
    toolbar: false,
    dropShadow: {
      enabled: true,
      top: 2,
      left: 1,
      blur: 5,
      color: '#58B90A',
      opacity: 0.65,
    },
  },
  colors: ['rgba(1, 180, 126, 1)', 'rgba(2, 176, 7, 0.5)'],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },
  yAxis: {
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

  xaxis: {
    type: 'string',
    categories: selectedDates.value,
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
      offsetY: 0
    },
  },
  grid: {
    show: true,
    strokeDashArray: 5,
    borderColor: 'rgba(86, 87, 122, 0.4)',
    position: 'back',
    xaxis: {
      lines: {
        show: false,
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
      opacityFrom: 0.7,
      opacityTo: 0.2,
    },
  },

  tooltip: {
    theme: false,
    enabled: true,
    backgroundColor: 'rgba(89, 89, 89, 1), rgba(73, 73, 73, 0.45)',
    // eslint-disable-next-line
    custom({ series, dataPointIndex, w }) {
      return (
        '<div style="backdrop-filter: blur(10px); background: linear-gradient(rgba(89, 89, 89, 1), rgba(73, 73, 73, 0.45)); color:white; padding: 10px;font-size: clamp(10px, 0.8vw, 14px)"">' +
        '<span style="font-weight:700">' +
        `Revenue: ${symbol.value !== '$' ? `<span style="margin-right: 2px"><img src="${symbol.value === '₿' ? btcSymbol : ethSymbol}" width='9'/></span>` : `<span style="margin-right: 2px">$</span>`}` +
        series[0][dataPointIndex] +
        '</span>' +
        '<br/>' +

        '<div style="display:flex; flex-direction:column; font-size: clamp(10px, 0.8vw, 14px)">' +
        '<span>' +
        '<span style="font-weight:700">' +
        `Profit: ${symbol.value !== '$' ? `<span style="margin-right: 2px"><img src="${symbol.value === '₿' ? btcSymbol : ethSymbol}" width='9'/></span>` : `<span style="margin-right: 2px">$</span>`}` +
        series[1][dataPointIndex] +
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
          height: 220,
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
          categories: selectedDates.value,
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

watch(data, () => {
  currentEquivalent.value = timelines[1]
  if (data.value && data.value['Daily'].length > 0) {
    currentEquivalent.value = timelines[0]
  }
})
</script>
<style lang="scss">
@import '@/styles/_variables.scss';

.header_text {
  color: rgb(255, 255, 255);
  font-family: Poppins;
  font-size: clamp(10px, 0.9vw, 18px);
  font-weight: 700;
  line-height: 25px;
  letter-spacing: 0em;
}

.chart {
  &-equivalent {
    color: #7ef6b2;
    font-size: clamp(8px, 0.5vw, 12px);
    margin-right: 15px;
    display: flex;
    justify-self: flex-start;
    border-radius: 12px;
    border: 1px solid #01b47e;
    width: fit-content;
    position: relative;
    top: 35px;
    z-index: 7;

    &__el {
      padding: 8px;
      cursor: pointer;
      border-radius: 10px;

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

.track_chart_card {
  border: 0.5px solid #a3a4a52d;
  border-radius: 20px;
  padding: 15px;
}

.timeline_container {
  width: fit-content;
}

.chart_inside {
  width: 100%;

  height: 350px;
}

@media (max-width: $xxl) {
  .track_chart_card {
    width: 100%;
  }

  .chart_inside {
    width: 100%;
    height: 237px;
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
      padding: 4px;
      color: #fff;
      font-size: 14px;
      margin-right: 15px;
      display: flex;
      flex-direction: column;
      border-radius: 12px;
      border: 1px solid #01b47e;
    }
  }
}
</style>
