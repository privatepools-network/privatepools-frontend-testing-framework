<template>
  <div class="results-charts">
    <div class="results-charts__header">
      <div class="text-white fw-medium">
        Select Year
      </div>
      <div class="results-charts__select">
        <multiselect v-model="selectedYear" :options="yearOptions" :searchable="false" :allow-empty="false"
          :close-on-select="true" :show-labels="true" :taggable="false" :hide-selected="true"
          @update:modelValue="(v1) => $emit('update:selectedYear', v1)">
          <template v-slot:singleLabel="{ option }">
            <div class="select__el select__el_selected">
              {{ option }}
              <div class="select__dropdown-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                  <path d="M1 1L7 7L13 1" stroke="#C1C1D1" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </div>
            </div>
          </template>
          <template v-slot:option="{ option }">
            <div class="select__el">
              {{ option }}
            </div>
          </template>
        </multiselect>
      </div>
    </div>
    <div class="results-charts__wrapper">
      <SimulatorAssetRadial v-for="item in results" :key="item.id" :result="item"></SimulatorAssetRadial>
    </div>
  </div>
</template>
<script setup>
import SimulatorAssetRadial from "@/components/Simulator/SimulatorAssetRadial.vue";
import Multiselect from "vue-multiselect";
import { defineProps, toRefs } from "vue";
const props = defineProps({
  selectedYear: String,
  yearOptions: Array,
  results: Array,
  liquidityInfo: Object,
})
const { selectedYear, yearOptions, results } = toRefs(props)
</script>
<style lang="sass">
.results
  &-charts
    padding: 18px 31px
    border-radius: 20px
    border: 0.2px solid rgba(163, 164, 165, 0.40)
    width: 55%
    @media all and (max-width: 1500px)
      width: 63%
    @media all and (max-width: 1199px)
      width: 100%
    &__header
      display: flex
      align-items: center
      margin-bottom: 30px
    &__select
      margin-left: 10px
      width: 150px
      .multiselect__tags
        border: 0.2px solid #1B1F22
        background: linear-gradient(91deg, rgba(53, 192, 157, 0.05) 0.36%, rgba(24, 239, 51, 0.02) 99.41%) !important
        padding: 0 !important
        border-radius: 20px
      .multiselect__single
        min-height: 40px !important
        background: transparent !important
        color: white !important
        padding: 0 15px 0 10px !important
        margin: 0 !important
        border-radius: 20px !important
        .select
          &__el
            margin-top: 6px
            display: flex
            justify-content: space-between
            align-items: center
            border-radius: 20px
            padding: 4px 8px !important
            cursor: pointer
    &__wrapper
      display: flex
      flex-wrap: wrap
      justify-content: space-around
  &-summ
    display: flex
    justify-content: space-around
    flex-wrap: wrap
    width: 100%
    margin-top: 20px
    &__el
      display: flex
      align-items: center
      color: #fff
    &__title
      margin-right: 10px
      font-size: 14px
    &__value
      font-size: 20px
      font-weight: 700


</style>
