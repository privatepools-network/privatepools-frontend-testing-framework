<template>
  <div class="assets-select__wrapper">

    <multiselect
      track-by="id" label="name" v-model="token"
      :options="simulatorTokensOptions" :searchable="false"
      :allow-empty="false" :close-on-select="true" :show-labels="true" :taggable="false" :hide-selected="true"
      @update:modelValue="(v1) => $emit('onSelect', {v1,selectNum})">
      <template v-slot:singleLabel="{ option }">
        <div class="select__el select__el_selected">
          <div class="assets-select__avatar">
            <img class="assets-select__img" :src="option.img" alt="Token icon">
            <div class="assets-select__label">
            <span class="assets-select__name">
              {{ option.name }}
            </span>
              <span class="assets-select__symbol">
              {{ option.symbol }}
            </span>
            </div>
          </div>
          <div class="select__dropdown-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
              <path d="M1 1L7 7L13 1" stroke="#C1C1D1" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </template>
      <template v-slot:option="{option}">
        <div class="select__el">
          <div class="assets-select__avatar">
            <img class="assets-select__img" :src="option.img" alt="Token icon">
            <div class="assets-select__label">
            <span class="assets-select__name">
              {{ option.name }}
            </span>
              <span class="assets-select__symbol">
              {{ option.symbol }}
            </span>
            </div>
          </div>
        </div>
      </template>
    </multiselect>
    <div class="assets-select__amount">
<!--      <span>%</span>-->
<!--      <input v-model="token.amount"/>-->
      <div class="range-slider__container">
        <div class="value-label" ref="inputRefLabel">{{ Number(token.amount).toFixed(0) }}%</div>
        <input class="range-slider" ref="range_test" type="range" min="1" @input="onInput" max="100" v-model="token.amount" />

      </div>
    </div>
  </div>
</template>

<script setup>
import Multiselect from "vue-multiselect";
import {defineProps, onMounted, ref, toRefs} from 'vue'

const props = defineProps({
  token: Object,
  simulatorTokensOptions: Array,
  selectNum: Number
})
const {simulatorTokensOptions, token, selectNum} = toRefs(props)
// defineExpose({
//   calculatePool
// })
// function calculatePool() {
//   token.value.amount = 100 / props.tokensData.length
//   console.log("range_test", range_test.value)
//   range_test.value[0].style.background = `linear-gradient(to right, #01B47E ${weight.value}%, #ffffff29 ${weight.value}%)`
//   return (weight.value).toFixed(0)
// }
const range_test = ref(null)
const inputRefLabel = ref()

function onLoadRange(target, co) {
  console.log(co)
  range_test.value.style.background = `linear-gradient(to right, #01B47E ${target}%, #ffffff29 ${target}%)`
  inputRefLabel.value.style.left = `${target*range_test.value.clientWidth/100 - 22 * (target/76)}px`
}


onMounted(()=>{
  onLoadRange(token.value.amount)
})

const onInput = async ({ target }) => {
  onLoadRange(target.value)

}
</script>

<style lang="sass">
.range-slider__container
  position: relative
  width: 100%
  .value-label
    position: absolute
    background: #01B47E
    border-radius: 4px
    padding: 2px 4px
    bottom: 30px
    font-size: 10px
    font-weight: 500
    line-height: 16px
    letter-spacing: 0em
    color: #ffffff
    &:after
      content: ''
      width: 8px
      height: 8px
      position: absolute
      background: #01B47E
      left: 50%
      margin-left: -4px
      transform: rotate(45deg)
      border-radius: 2px
      bottom: -3px
.range-slider
  width: 100% !important
  background: transparent
  border-radius: 8px
  padding: 0
  -webkit-appearance: none
  appearance: none
  height: 12px
  outline: none
  transition: opacity 0.2s
  position: relative
  /* Styling the track */
  &::-webkit-slider-runnable-track
    height: 12px
    background: #ffffff29
    border-radius: 8px

  &::-moz-range-track
    height: 12px
    background: #ffffff29
    border-radius: 8px

  &::-moz-range-progress
    background-color: #01b47e
    height: 12px
    border-radius: 8px 0 0 8px

  &::-ms-track
    height: 12px
    background: #ffffff29
    border-radius: 8px

  /* Styling the thumb */
  &::-webkit-slider-thumb
    width: 14px
    height: 14px
    background: #c1c1d1
    border-radius: 50%
    cursor: pointer
    -webkit-appearance: none
    margin-top: -1px
  /* necessary to center the thumb in the track */

  &::-moz-range-thumb
    width: 14px
    height: 14px
    background: #c1c1d1
    border-radius: 50%
    cursor: pointer

  &::-ms-thumb
    width: 14px
    height: 14px
    background: #c1c1d1
    border-radius: 50%
    cursor: pointer
    margin-top: 0


.assets
  &-select
    &__wrapper
      width: 49%
      margin-bottom: 20px
      position: relative
      @media all and (max-width: 768px)
        width: 100% !important
    &__avatar
      display: flex
      align-items: center

    &__img
      margin-right: 8px
      width: 40px
      padding: 8px
    &__label
      display: flex
      flex-direction: column

    &__name, &__amount
      color: #ffffff

    &__symbol
      font-size: 12px
      color: #6B7280
    &__amount
      height: 26px
      position: absolute
      z-index: 49
      top: 42px
      margin-top: -13px
      right: 20px
      width: 43%
      @media (max-width: 1200px)
        width: 55%
.assets-select__wrapper
  .multiselect--active ~ .assets-select__amount
    z-index: 51
  .multiselect--active
    .multiselect__tags
      border-width: 1px 1px 0 1px !important
      border-radius: 20px 20px 0 0 !important

  .multiselect__tags
    background: transparent !important
    border-color: rgba(1, 180, 126, 1) !important
    padding: 0 !important
    border-width: 1px !important
    border-radius: 20px !important

  .multiselect__option--highlight
    background: linear-gradient(0deg, #181C1F 0%, #181C1F 100%) !important

  .multiselect__content-wrapper
    border-color: rgba(1, 180, 126, 1) !important
    &::-webkit-scrollbar-track
      -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3)
      background-color: #02120a

    &::-webkit-scrollbar
      width: 8px !important
      background: #02120a
      border-radius: 50px

    &::-webkit-scrollbar-thumb
      border: 2px solid #02120a
      background: rgb(1, 180, 126)
      border-radius: 21px

  .multiselect__single
    background: transparent !important
    color: white !important
    padding: 0 !important
    margin: 0 !important
    border-radius: 20px !important
    .select__el
      padding: 20px 6px 20px 6px !important
  .multiselect__option
    background: #02120a !important
    padding: 0 !important
    color: white !important

    &:after
      display: none
  .multiselect__option--highlight
    background: #02120a !important
  .multiselect__option:hover
    background: lighten(#02120a, .9) !important

  .multiselect__select
    display: none !important
  .select__el
    justify-content: left !important
    display: flex
    align-items: center
    border-radius: 20px
    padding: 4px 8px !important
    cursor: pointer
    &_selected
      border-radius: 20px 20px 0 0
      background: linear-gradient(91deg, rgba(53, 192, 157, 0.05) 0.36%, rgba(24, 239, 51, 0.02) 99.41%)
    .select__dropdown-icon
      margin-left: 8px
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
