<template>
  <div>
    <div class="d-flex align-items-center gap-1">
    <Title :title="'Amount Of Trades'">
    </Title>
     <VTooltip :distance="0" :placement="'right'">
        <div style="cursor: help">
          <img :src="info" class="info_icon" />
        </div>
        <template #popper>
          <div
            style="
              background: linear-gradient(
                rgba(89, 89, 89, 0.75),
                rgba(73, 73, 73, 0.15)
              );
              backdrop-filter: blur(10px);
              padding: 10px;
              border-radius: 4px;
              width: 400px;
            "
          >
            <div style="font-size: clamp(10px, 0.9vw, 16px)">Information</div>
            <div
              style="
                display: flex;
                flex-direction: column;
                font-size: clamp(10px, 0.8vw, 14px);
              "
            >
              <p>
                This bar chart displays the trades executed over the past week,
                including today.
                <br />Each bar represents a day's trading volume, broken down by
                chain.
              </p>
            </div>
          </div>
        </template>
      </VTooltip>
    </div>

    <div class="chart_container">
      <div class="chart_container_inside">
        <LoaderPulse v-if="!data" />
        <apexchart
          v-else-if="data"
          :options="chartOptions"
          :series="data"
          height="100%"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, defineProps, toRefs } from 'vue'
import info from '@/assets/images/info.svg'
import arb from '@/assets/images/networks/arbitrum.png'
import polygon from '@/assets/images/networks/polygon.png'
import binance from '@/assets/icons/networks/binance.svg'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import Title from '@/UI/Title.vue'

const props = defineProps(['data', 'dates', 'chainSelected'])
const { data, dates } = toRefs(props)

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'bar',

      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ['rgba(1, 180, 126, 1)'],
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        columnWidth: '12%',
        dataLabels: {
          show: false,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 0,
      colors: ['transparent'],
    },
    xaxis: {
      categories: dates.value,
      labels: {
        style: {
          colors: 'rgba(255, 255, 255, 1)',
          fontSize: '10px',
          fontWeight: 400,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      //   max: 100,
      labels: {
        style: {
          colors: 'rgba(255, 255, 255, 1)',
          fontSize: '10px',
          fontWeight: 400,
        },
        formatter: (value) => {
          return `${value.toFixed(0)}`
        },
      },
    },
    tooltip: {
      theme: false,
      enabled: true,
      // eslint-disable-next-line
      custom({ series, dataPointIndex, w }) {
        let infoText = ''
        for (let i = 0; i < data.value.length; i++) {
          let seriesIndex = i
          infoText +=
            '<span">' +
            `<img src="${
              w.globals.seriesNames[seriesIndex] === 'Arbitrum'
                ? arb
                : w.globals.seriesNames[seriesIndex] === 'Binance'
                ? binance
                : w.globals.seriesNames[seriesIndex] === 'Polygon'
                ? polygon
                : info
            }" width='17' />` +
            ' ' +
            w.globals.seriesNames[seriesIndex] +
            ':' +
            ' ' +
            series[seriesIndex][dataPointIndex] +
            ' ' +
            (series[seriesIndex][dataPointIndex] === 1 ? 'Trade' : 'Trades') +
            '</span> <br/>'
        }
        return (
          '<div style="backdrop-filter: blur(10px); background: linear-gradient(rgba(89, 89, 89, 1),rgba(73, 73, 73, 0.45)); color:white; padding: 10px;">' +
          '<div style="font-size:clamp(10px, 0.9vw, 16px)">' +
          'Amount of Trades' +
          '</div>' +
          '<div style="display:flex; flex-direction:column; font-size: clamp(10px, 0.8vw, 14px)">' +
          infoText +
          '</div>' +
          '</div>'
        )
      },
    },
    fill: {
      opacity: 1,
    },
    grid: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 1400,
        options: {
          xaxis: {
            categories: dates.value,
            labels: {
              style: {
                fontSize: '8px',
              },
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
          },
          yaxis: {
            //   max: 100,
            labels: {
              style: {
                fontSize: '8px',
              },
              formatter: (value) => {
                return `${value.toFixed(0)}`
              },
            },
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          xaxis: {
            labels: {
              style: {
                fontSize: '10px',
              },
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '10px',
              },
              formatter: (value) => {
                return `${value.toFixed(0)}`
              },
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              borderRadius: 5,
              borderRadiusApplication: 'end',
              borderRadiusWhenStacked: 'last',
              columnWidth: '42%',
              dataLabels: {
                show: false,
              },
            },
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
  border: 0.5px solid #a3a4a52d;
  border-radius: 20px;
  padding: 18px;
  height: 260px;
}

.chart_container_inside {
  background: linear-gradient(93.93deg, #011904 3.01%, #092009 100%);
  border-radius: 20px;

  height: 100%;
}

:deep(.apexcharts-bar-series) {
  filter: drop-shadow(0 0 0.3rem #58b90a);
}

@media (max-width: $xxl) {
  .chart_container {
    height: 180px;
  }
}
@media (max-width: $md) {
  .chart_container {
    height: 230px;
  }
}
</style>
