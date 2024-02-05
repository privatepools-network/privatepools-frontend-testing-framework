<template>
  <div>
    <div class="d-flex align-items-center gap-2 mb-3">
      <div
        style="
            color: rgba(243, 244, 246, 1);
            font-weight: 400;
            font-size: clamp(10px, 0.9vw, 15px);
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
            data.labels,
            data.colors)"
        :series="data.series"
        width="390"
        height="390"
      />
    </div>
  </div>
</template>
<script setup>
import info from '@/assets/images/info.svg'
import {toRefs,defineProps} from "vue";

const props = defineProps({
  data: Object
})
const {data} = toRefs(props)
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
