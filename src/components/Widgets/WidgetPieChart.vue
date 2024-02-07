<template>
  <div>
    <div class="d-flex align-items-center gap-1">
      <Title :title="'Strategy'"> 

    </Title>
    <VTooltip :distance="0" :placement="'right'">
        <div style="cursor: help">
          <img :src="info" class="info_icon"/>
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
            <div style="font-size:clamp(10px, 0.9vw, 16px)">Information</div>
            <div style="display: flex; flex-direction: column; font-size: clamp(10px, 0.8vw, 14px);">
              <p>
                This pie chart showcases the total trades made and provides a detailed breakdown of how often each strategy was employed. Get a visual insight into which strategies dominate and how they contribute to the overall trading activity over the entire history of the protocol.
              </p>
            </div>
          </div>
        </template>
      </VTooltip>
    </div>
  

    <div class="chart_container">
      <LoaderPulse v-if="data.series.length === 0" />
      <apexchart v-else :options="dynamicDonut" :series="data.series" />
    </div>
  </div>
</template>
<script setup>
import info from '@/assets/images/info.svg'
import inchfusion from '@/assets/images/dexs/1inchfusion.png'
import { toRefs, defineProps, computed } from 'vue'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import Title from '@/UI/Title.vue'

const props = defineProps(['data'])
const { data } = toRefs(props)
const dynamicDonut = computed(() => {
  let arrayOfColors = data.value.colors
  let labels = data.value.labels
  return {
    chart: {
      type: 'donut',
      width: '100%',
      height: '100%',
    },
    colors: arrayOfColors,
    labels: labels,
    legend: {
      show: false,
      width: 125,
      fontSize: '12px',
      // fontFamily: 'Lato',
      fontWeight: 600,
      offsetX: 5,
      labels: {
        // colors: arrayOfColors,
        useSeriesColors: true,
      },
      markers: {
        fillColors: arrayOfColors,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
      colors: arrayOfColors,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
              fontFamily: 'Rubik',
              color: '#dfsda',
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '35px',
              fontFamily: 'Poppins',
              color: '#FFFFFF',
              offsetY: 13,
              formatter: function (val) {
                return val
              },
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '18px',
              fontFamily: 'Poppins',
              fontWeight: 400,
              color: '#FFFFFF',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => {
                  return a + b
                }, 0)
              },
            },
          },
        },
      },
    },
    stroke: {
      show: true,
      width: 0.5,
      colors: ['#181C1F'],
    },
    tooltip: {
      theme: false,
      enabled: true,
      // eslint-disable-next-line
      custom({ series, seriesIndex, dataPointIndex, w }) {
        console.log('!!!', w.globals.labels[seriesIndex])
        return (
          '<div style="background: linear-gradient(rgba(89, 89, 89, 1), rgba(73, 73, 73, 0.45)); color:white; padding: 10px;">' +
          '<div style="font-size:clamp(10px, 0.9vw, 16px)">' +
          'Strategy Usage' +
          '</div>' +
          '<div style="display:flex; flex-direction:column; font-size: clamp(10px, 0.8vw, 14px)">' +
          '<div style="display:flex; align-items: center">' +
          `<img style='margin-right: 5px;' src="${
            w.globals.seriesNames[seriesIndex]==='1Inch'
              ? 'https://cdn.1inch.io/liquidity-sources-logo/1inch_color.png'
              : w.globals.seriesNames[seriesIndex] === 'FireBird'
              ? 'https://cdn.1inch.io/liquidity-sources-logo/firebird_color.png'
              : w.globals.seriesNames[seriesIndex] === 'Odos'
              ? 'https://img.api.cryptorank.io/coins/150x150.odos1682151131117.png'
              : w.globals.seriesNames[seriesIndex] === '1Inch Fusion'
              ? inchfusion
              : info
          }" width='20' />` +
          w.globals.labels[seriesIndex] +
          ': ' +
          series[seriesIndex] +
          ' ' +
          (series[seriesIndex] === 1 ? 'Trade' : 'Trades') +
          '</div>' +
          '</div>' +
          '</div>'
        )
      },
    },
    responsive: [
      {
        breakpoint: 1700,
        options: {
          chart: {
            width: '100%',
            height: '100%',
          },
          legend: {
            //   position: 'bottom',
            show: false,
          },
        },
      },
      {
        breakpoint: 1400,
        options: {
          chart: {
            width: '180px',
            height: '180px',
          },
          legend: {
            //   position: 'bottom',
            show: false,
          },
          plotOptions: {
            pie: {
              donut: {
                size: '80%',
                background: 'transparent',
                labels: {
                  show: true,
                  name: {
                    show: true,
                    fontSize: '14px',
                    fontFamily: 'Rubik',
                    color: '#dfsda',
                    offsetY: -10,
                  },
                  value: {
                    show: true,
                    fontSize: '22px',
                    fontFamily: 'Poppins',
                    color: '#FFFFFF',
                    offsetY: 13,
                    formatter: function (val) {
                      return val
                    },
                  },
                  total: {
                    show: true,
                    label: 'Total',
                    fontSize: '12px',
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    formatter: function (w) {
                      return w.globals.seriesTotals.reduce((a, b) => {
                        return a + b
                      }, 0)
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            width: 250,
            height: 250,
          },
          plotOptions: {
            pie: {
              donut: {
                size: '75%',
                background: 'transparent',
              },
            },
          },
          legend: {
            position: 'bottom',
            show: true,
            horizontalAlign: 'center',
          },
        },
      },
    ],
  }
})
</script>
<style scoped lang="scss">
@import '@/styles/_variables.scss';

.header_text {
  color: rgb(255, 255, 255);
  font-family: Poppins;
  font-size: 18px;
  font-weight: 700;
  line-height: 25px;
  letter-spacing: 0em;
}

.chart_container {
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: 0.5px solid #a3a4a52d; */
  border-radius: 15px;
  padding: 5px 0px;
  height: 260px;
  background: linear-gradient(356.2deg, #00c8ff0e 0%, #000000 105.42%);

  :deep(.apexcharts-inner) {
    filter: drop-shadow(0 0 0.3rem #00C9FF);
  }
}

@media (min-width: 2000px) {
  .pie-component {
    width: auto;
  }
}

@media (max-width: $xxl) {
  .chart_container {
    height: 180px;
  }
}

@media (max-width: $md) {
  .chart_container {
    height: 100%;
  }
}
</style>
