<template>
  <div style=" display: flex; flex-direction: column">
    <div
      class="d-flex align-items-center justify-content-between"
      style="background: #2222225d; padding: 8px"
    >
      <div class="d-flex gap-2">
        <div
          style="
                color: rgba(243, 244, 246, 1);
                font-weight: 500;
                font-size: clamp(10px, 0.9vw, 15px);
              "
        >
          {{title}}
        </div>
        <img :src="info" />
      </div>
      <div class="d-flex align-items-center gap-2">
        <img :src="calendar" />
        <img :src="riskMetrics" v-if="title == 'Risk Metrics'"/>
      </div>
    </div>
    <div
      v-for="item in data"
      :key="item"
      style="padding: 0px 8px"
    >
      <div
        class="d-flex align-items-center justify-content-between"
        style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            "
      >
        <div class="stats_text">{{ item.text }}</div>
        <div class="stats_value">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import info from "@/assets/images/info.svg";
import calendar from "@/assets/icons/statisticIcons/calendar.svg";
import riskMetrics from "@/assets/icons/statisticIcons/riskMetrics.svg";
import {toRefs,defineProps} from "vue";

const props = defineProps({
  data: Object,
  title: String
})
const {data, title} = toRefs(props)
</script>
<style lang="sass">
.stats_text
  color: rgba(243, 244, 246, 1)
  font-family: Montserrat
  font-size: clamp(10px, 0.8vw, 14px)
  font-weight: 400
  line-height: 21px
  letter-spacing: 0em
  text-align: left

.stats_value
  color: white
  font-family: Montserrat
  font-size: clamp(10px, 0.8vw, 13px)
  font-weight: 400
  line-height: 21px
  letter-spacing: 0em
  text-align: left
  margin-right: 15px

</style>
