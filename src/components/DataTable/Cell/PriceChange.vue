<template>
  <div class="price-change" :class="{'--negative': isNegative}">
    <div class="d-flex">
      <div style="font-family: Inter; font-weight: 700;">{{ textPrepend }}</div>
      <div>{{ numberAbsValue }}%</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
const props = defineProps(['value'])

const numberSignedValue = computed(() => parseFloat(props.value))
const numberAbsValue = computed(() => Math.abs(parseFloat(props.value)))
const isNegative = computed(() => parseFloat(props.value) < 0)

const textPrepend = computed(() => {
  if(numberSignedValue.value === 0) {
    return ''
  } else if(numberSignedValue.value < 0) {
    return '↓'
  } else {
    return '↑'
  }
})
</script>

<style lang="scss" scoped>
.price-change {
  display: inline-block;
  color: #27AE60;
  padding: 0;
  margin-left: 5px;
  &.--negative {
    color: #FD4040;
  }
}
</style>
