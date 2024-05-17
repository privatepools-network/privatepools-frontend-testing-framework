<template>
  <div class="chart_card bg-white dark:!bg-[#22222224]">
    <div class="d-flex justify-content-end"></div>
    <div v-if="filteredData.length === 0" class="chart_inside">
      <LoaderPulse />
    </div>
    <div v-else class="chart_inside">
      <div class="w-full flex justify-end">
        <ChartTimeline
          :isCumulativeMode="isCumulativeMode"
          :currentTimeline="currentTimeline"
          :timelines="timelines"
          @changeCumulativeMode="changeCumulativeMode"
          @changeTimeline="changeTimeline"
        />
      </div>
      <img :src="logo" alt="D3" class="chart-logo" height="40px" />
      <apexchart class="w-full" :height="height" :options="chartOptions" :series="series" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import ChartTimeline from './ChartTimeline.vue'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import logo from '@/assets/images/d3v.png'
import { t } from 'i18next'

defineProps(['height','filteredData','series', 'chartOptions', 'timelines', 'currentTimeline', 'isCumulativeMode','changeTimeline', 'changeCumulativeMode'])
// defineEmits(['changeTimeline', 'changeCumulativeMode'])




</script>

<style lang="scss" scoped>
.chart-logo {
  position: relative;
  top: 42%;
  left: 45%;
  opacity: 0.15;
  height: 40px;
}

.chart_card {
  border-radius: 0px 20px 20px 0px;
  width: 100%;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 4px 0px #00000040;
}

.chart_inside {
  width: 100%;
  height: 100%;
}

// :deep(.apexcharts-inner) {
//     filter: drop-shadow(0 0 0.35rem #00c8ff4b);
// }

:deep(.apexcharts-tooltip) {
  background: rgba(2, 3, 28, 0.65) !important;
  color: white;
  backdrop-filter: blur(10px);
}
</style>
