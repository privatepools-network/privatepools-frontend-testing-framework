<template>
  <div class="mt-5">
    <div
      class="d-flex align-items-center mb-4"
      style="background: #2222225d; padding: 8px"
    >
      <div class="d-flex gap-2">
        <div
          style="
            color: rgba(243, 244, 246, 1);
            font-weight: 400;
            font-size: 15px;
          "
        >
            Portfolio Breakdown
        </div>
        <img :src="info" />
      </div>
    </div>

    <div class="d-flex justify-content-between flex-wrap">
    <div>
      <div class="d-flex align-items-center gap-2 mb-3">
        <div
          style="
            color: rgba(243, 244, 246, 1);
            font-weight: 400;
            font-size: 15px;
            padding-left: 25px;
          "
        >
          Assets Breakdown by Type
        </div>
        <img :src="info" />
      </div>
      <div class="diagram-container">
        <apexchart
          :options="dynamicDonut(
            ['Bitcoin (BTC)', 'Ethereum (ETH)', 'RWAs', 'LSDs', 'Stablecoins', 'Infrastructure', 'L1s', 'L2s', 'DeFi'],
            ['rgba(230, 177, 12, 1)', '#00C9FF', 'rgba(248, 71, 71, 1)', 'rgba(194, 119, 237, 1)', 'rgba(0, 199, 242, 1)', 'rgba(0, 252, 2, 1)', 'rgba(0, 252, 2, 1)', 'rgba(0, 252, 2, 1)', 'rgba(0, 252, 2, 1)'])"
          :series="[44, 55, 41, 17, 15, 22, 11, 8, 6]"
          :height="410"
          :width="415"
        />
      </div>
    </div>
    <div>
      <div class="d-flex align-items-center gap-2 mb-3">
        <div
          style="
            color: rgba(243, 244, 246, 1);
            font-weight: 400;
            font-size: 15px;
            padding-left: 25px;
          "
        >
        Investments Breakdown
        </div>
        <img :src="info" />
      </div>
      <div class="diagram-container">
        <apexchart
          :options="dynamicDonut(
            ['USDT/BTC/ETH', 'SUSHI/DAI/FRAX', 'USDT/USDC'],
            ['rgba(0, 199, 242, 1)', 'rgba(194, 119, 237, 1)', 'rgba(251, 198, 47, 1)'])"
          :series="[44, 55, 41]"
          :height="410"
          :width="415"
        />
      </div>
    </div>
    <div>
      <div class="d-flex align-items-center gap-2 mb-3">
        <div
          style="
            color: rgba(243, 244, 246, 1);
            font-weight: 400;
            font-size: 15px;
            padding-left: 25px;
          "
        >
        Assets Breakdown
        </div>
        <img :src="info" />
      </div>
      <div class="diagram-container">
        <apexchart
          :options="dynamicDonut(
            ['Bitcoin (BTC)', 'Ethereum (ETH)', 'Tether (USDT)', 'Sushiswap (SUSHI)', 'USD Coin (USDC)'],
            ['rgba(230, 177, 12, 1)', '#00C9FF', 'rgba(248, 71, 71, 1)', 'rgba(194, 119, 237, 1)', 'rgba(0, 199, 242, 1)'])"
          :series="[44, 15, 11, 6, 2]"
          :height="430"
          :width="430"
        />
      </div>
    </div>
    <div>
      <div class="d-flex align-items-center gap-2 mb-3">
        <div
          style="
            color: rgba(243, 244, 246, 1);
            font-weight: 400;
            font-size: 15px;
            padding-left: 25px;
          "
        >
        Pairs Breakdown
        </div>
        <img :src="info" />
      </div>
      <div class="diagram-container">
        <apexchart
          :options="dynamicDonut(
            ['BTC/ETH', 'SUSHI/USDT', 'USDT/USDC', 'BTC/USDT', 'ETH/USDC '],
            ['rgba(230, 177, 12, 1)', '#00C9FF', 'rgba(248, 71, 71, 1)', 'rgba(194, 119, 237, 1)', 'rgba(0, 199, 242, 1)'])"
          :series="[20, 20, 5, 3, 1]"
          :height="390"
          :width="390"
        />
      </div>
    </div>
    </div>
  </div>
</template>
<script setup>
import info from '@/assets/images/info.svg'

function dynamicDonut(labels, arrayOfColors) {
    return (
        {
  chart: {
    type: 'donut',

  },
    labels: labels,
  legend: {
    show: true,
    fontSize: '14px',
    // fontFamily: 'Lato',
    fontWeight: 600,
    labels: {
          colors: 'white',
          useSeriesColors: false
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
      },
    },
  },
  stroke: {
    show: true,
    width: 1,
    colors: ['#181C1F']

},
  tooltip: {
    enabled: true,
    // eslint-disable-next-line
    custom({ series, seriesIndex, dataPointIndex, w }) {

      return (
        '<div style="background: linear-gradient(rgba(89, 89, 89, 1), rgba(73, 73, 73, 0.45)); padding: 10px;">' +
        '<h6 style="opacity:50%">' + w.config.labels[seriesIndex]  + '</h6>' +
        '<div style="display:flex; flex-direction:column;">' +
        '<span>' +
        '<span style="font-weight:700">' + 'Invested:  :' + '</span>' + ' ' + '$1500' +
        '</span>' +
        '<span>' +
        '<span style="font-weight:700">' + 'Alocation:' + '</span>' + ' ' + '25%' +
        '</span>' +
        '<span>' +
        '<span style="font-weight:700">' + w.config.labels[seriesIndex] + ':' + '</span>' + ' ' + series[seriesIndex] +
        '</span>' +

        '</div>' +
        '</div>'
      )
    },
  },
//   responsive: [
//     {
//       breakpoint: 400,
//       options: {
//         chart: {
//           width: 400,
//         },
//         legend: {
//           position: 'bottom',
//         },
//       },
//     },
//   ],
}
    )
}

</script>
<style lang="scss" scoped>
.diagram-container {
  :deep(.apexcharts-inner) {
    filter: drop-shadow(0 0 0.55rem rgba(98, 104, 143, 1));
  }
}
</style>
