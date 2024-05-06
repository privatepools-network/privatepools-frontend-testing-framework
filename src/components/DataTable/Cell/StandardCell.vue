<template>
  <div
    class="text-truncate cell text-black dark:!text-white"
    data-coreui-toggle="tooltip"
    data-coreui-placement="left"
    :title="value"
  >
    {{  parseFloat(value).toFixed(3) }}
  </div>
</template>
<script setup>
import {defineProps} from 'vue'

defineProps(['value'])

</script>
<style lang="scss" scoped>
  .cell {
    font-size: clamp(10px, 0.8vw, 14px);
    text-align: center;
    font-weight: 400;
    letter-spacing: 0em;
    font-family: 'Roboto Mono', monospace;

  }
</style>