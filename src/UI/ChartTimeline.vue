<template>
  <div class="timeline_container">
    <div class="flex items-center gap-2">
      <VTooltip :distance="0" :placement="'left'">
        <div style="cursor: help" v-if="$router.currentRoute.value.path.includes('/pool') && chartData.every(obj => obj.Trades === 0) || $router.currentRoute.value.path.includes('/portfolio')">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.25 4.25H8.75V5.75H7.25V4.25ZM7.25 7.25H8.75V11.75H7.25V7.25ZM8 0.5C3.86 0.5 0.5 3.86 0.5 8C0.5 12.14 3.86 15.5 8 15.5C12.14 15.5 15.5 12.14 15.5 8C15.5 3.86 12.14 0.5 8 0.5ZM8 14C4.6925 14 2 11.3075 2 8C2 4.6925 4.6925 2 8 2C11.3075 2 14 4.6925 14 8C14 11.3075 11.3075 14 8 14Z"
              fill="#F07E07"
            />
          </svg>
        </div>
        <template #popper>
          <div class="tooltip_container">
            
            <div class="tooltip_container_text">
              {{ $router.currentRoute.value.path.includes('/portfolio') ? 
            'The displayed data is based on the historical performance of the liquidity pools in which you have invested.'
            : 'The pool chart is currently displaying only the Total Value Locked (TVL) data. Additional data, including trading metrics, will become available after the first trade is executed. Please check back later for a complete data set.'  
            }}
              
            </div>
          </div>
        </template>
      </VTooltip>

      <div class="chart-timeline">
        <div class="chart-equivalent bg-white dark:!bg-[#22222224]">
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
            v-if="isCumulativeMode !== undefined"
            class="chart-equivalent__el"
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
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
defineProps(['isCumulativeMode', 'currentTimeline', 'timelines', 'chartData'])
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
        background: rgba(#00c9ff, 0.3);
      }

      &_active {
        background: #00e0ff;
        color: #000000;

        &:hover {
          background: #00c9ff;
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
