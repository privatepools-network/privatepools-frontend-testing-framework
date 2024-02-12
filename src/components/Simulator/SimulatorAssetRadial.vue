<template>
  <div class="results-el">
    <svg class="progress-ring" viewBox="0 0 500 500">
      <path class="progress-ring__bg" d="M100,480 A245,250 0 1 1 400,480" />
      <path class="progress-ring__quarters" ref="quarters" d="M100,480 A245,250 0 1 1 400,480" />
      <path class="progress-ring__end" ref="end" d="M100,480 A245,250 0 1 1 400,480" />
      <path class="progress-ring__main" ref="circle" d="M100,480 A245,250 0 1 1 400,480" />
    </svg>
    <div class="results-el__data">
      <div class="results-el__title">{{ result.title }}</div>
      <div class="results-el__value">{{ formatBigNumber(result.value) }}</div>
      <div class="results-el__equivalent">{{ result.equivalent }}</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs, defineProps, watch } from "vue";
import { formatBigNumber } from "@/lib/utils";
const props = defineProps({
  result: Object
})
const { result } = toRefs(props)
const circle = ref(null)
const end = ref(null)
const quarters = ref(null)
function setProgress(percent) {
  const total = circle.value.getTotalLength()
  if (percent > 0) {
    let dash = total * percent / 100
    let gap = total - dash
    circle.value.style.strokeDasharray = dash + " " + gap
    end.value.style.strokeDasharray = 4 + " " + (dash + 4) + " " + 4 + " " + gap
  }
  if (percent == 0) {
    circle.value.style.display = 'none'
    end.value.style.stroke = '#fff'
    end.value.style.strokeDasharray = 2 + " " + total
    end.value.style.strokeDashoffset = '0'
    end.value.style.strokeWidth = '14'
    end.value.style.transform = 'scale(0.98)'
  } else if (percent < 15) {
    circle.value.style.stroke = '#F84747'
    end.value.style.stroke = '#F84747'
  } else if (percent < 50) {
    circle.value.style.stroke = '#E6B10C'
    end.value.style.stroke = '#E6B10C'
  } else {
    circle.value.style.stroke = '#00C9FF'
    end.value.style.stroke = '#00C9FF'
  }
}
function getProgressPercent() {
  return (result.value.value / result.value.maxValue) * 100
}
onMounted(() => {
  setProgress(getProgressPercent())
})

watch(result, () => {
  setProgress(getProgressPercent())
})
</script>

<style lang="sass">
.results-el
  position: relative
  display: flex
  justify-content: center
  align-items: center
  padding: 24px 12px 32px 12px
  margin-bottom: 10px
  width: 23%
  @media all and (max-width: 768px)
    width: 49%
  &:nth-child(n+5)
    @media all and (min-width: 768px)
      margin-top: 50px
  &__data
    position: absolute
    text-align: center
    color: #fff
    margin-top: 30px
  &__title
    font-size: 12px
    margin-bottom: 8px
  &__value
    font-size: 32px
    margin-bottom: 6px
    line-height: 30px
  &__equivalent
    font-size: 20px
.progress-ring
  transform-origin: center
  display: block
  width: 170px
  path
    width: 100%
    height: 100%
  &__bg
    fill: transparent
    stroke: #fff
    stroke-width: 2
    stroke-dasharray: 1 10
    transform-origin: center
    transform: scale(0.997)
  &__main
    fill: transparent
    stroke: #E6B10C
    stroke-width: 12
  &__end
    fill: transparent
    stroke: #E6B10C
    stroke-width: 22
    transform-origin: center
    transform: scale(0.97)
    stroke-dashoffset: 12
  &__quarters
    fill: transparent
    stroke: #fff
    stroke-width: 22px
    stroke-dasharray: 1 147 1 785
    transform-origin: center
    transform: scale(0.97)
    stroke-dashoffset: -74
</style>
