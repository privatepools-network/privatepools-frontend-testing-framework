<template>
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
          @click="emit('changeTimeline', timeline)"
        >
          {{ timeline.name }}
        </div>
        <div
          class="chart-equivalent__el"
          :class="{
            'chart-equivalent__el_active': isCumulativeMode == true,
          }"
          @click="$emit('changeCumulativeMode')"
        >
          Cumulative
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
    color: #FFFFFF;
    font-size: clamp(8px, 0.5vw, 13px);
    margin-right: 15px;
    display: flex;
    justify-self: flex-start;
    border-radius: 16px;
    background: #22222224;
    box-shadow: 0px 4px 4px 0px #00000040;


    &__el {
      padding: 8px 15px;
      cursor: pointer;
      border-radius: 20px;

      &:hover {
        background: rgba(#00C9FF, 0.3);
      }

      &_active {
        background: linear-gradient(152.97deg, #002429 0%, #00C9FF 100%);
        color: #fff;

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