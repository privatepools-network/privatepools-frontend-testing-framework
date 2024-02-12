<template>
  <div class="assets-period">
    <div class="assets__title">
      Period of time
    </div>
    <div class="assets-period__wrapper">
      <div class="assets-period__el">
        <div class="assets-period__title">
          From:
        </div>
        <VueDatePicker v-model="periodStart"
                       utc dark="true" :enable-time-picker="false"
                       @update:modelValue="(v1) => $emit('update:periodStart', v1)">
          >
        </VueDatePicker>
      </div>
      <div class="assets-period__el">
        <div class="assets-period__title">
          To:
        </div>
        <VueDatePicker v-model="periodEnd"
                       utc dark="true" :enable-time-picker="false"
                       @update:modelValue="(v1) => $emit('update:periodEnd', v1)">
        </VueDatePicker>
      </div>
    </div>
  </div>
</template>
<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import {defineProps, toRefs} from "vue";

const props = defineProps({
  periodStart: Number,
  periodEnd: Number
})
const {periodStart, periodEnd} = toRefs(props)
</script>
<style lang="sass">
.assets
  &-period
    margin-bottom: 50px

    &__wrapper
      display: flex
      @media all and (max-width: 768px)
        flex-wrap: wrap

    &__el
      display: flex
      align-items: center
      color: #fff
      @media all and (max-width: 768px)
        width: 100%
        margin-bottom: 10px

      &:first-child
        margin-right: 60px
        @media all and (max-width: 768px)
          margin-right: 0

    &__title
      margin-right: 14px
      font-size: clamp(12px, 0.8vw, 14px)
      @media all and (max-width: 768px)
        width: 100px

    &__value
      font-size: 13px
      margin-right: 10px

.dp__theme_dark
  --dp-background-color: #02120A !important
  --dp-primary-color: #00C9FF !important
  --dp-highlight-color: #00c8ff42 !important
  --dp-border-color: #00C9FF !important
  --dp-menu-border-color: #00C9FF !important
  --dp-border-color-hover: #00C9FF !important
  --dp-border-radius: 12px !important
  --dp-action-buttons-padding: 3px 9px !important
  --dp-action-button-height: 32px !important

.dp__input
  background: transparent  !important
  border-radius: 20px !important
  color: #545454 !important
  font-size: clamp(12px, 0.8vw, 16px) !important
  @media (max-width: 1400px)
    padding: 4px 10px 4px 30px !important
</style>
