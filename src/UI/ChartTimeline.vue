<template>
  <div class="timeline_container">
    <div class="chart-timeline">
      <div class="chart-equivalent bg-white dark:!bg-[#22222224]">
        <div
          class="chart-equivalent__el "
          v-for="timeline in timelines"
          :key="timeline.name"
          :class="{
            'chart-equivalent__el_active':
              currentTimeline.name == timeline.name,
          }"
          @click="emit('changeTimeline', timeline)"
        >
          {{ timeline.name }}
        </div>
        <div
        v-if="isCumulativeMode !== undefined"
          class="chart-equivalent__el "
          :class="{
            'chart-equivalent__el_active': isCumulativeMode == true,
          }"
          @click="$emit('changeCumulativeMode')"
        >
          {{ $t('cumulative') }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
defineProps(['isCumulativeMode', 'currentTimeline', 'timelines'])
const emit = defineEmits(['changeTimeline', 'changeCumulativeMode'])

</script>
<style lang="scss" scoped>
.chart {


  &-equivalent {
    padding: 0px;
    font-size: clamp(10px, 0.5vw, 14px);
    font-weight: 500;
    display: flex;
    justify-self: flex-start;
    border-radius: 16px;
    box-shadow: 0px 4px 4px 0px #00000040;



    &__el {
      padding: 8px 15px;
      cursor: pointer;
      border-radius: 16px;
      color: #fff;
      &:hover {
        background: rgba(#00C9FF, 0.3);
      }

      &_active {
        background: #00E0FF;
        color: #000000;

        &:hover {
          background: #00C9FF;
        }
      }
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

  
}
</style>