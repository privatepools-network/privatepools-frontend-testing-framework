<template>
  <div class="results-data__el">
    <div class="results-data__title">
      {{ item.label }}
    </div>
    <div class="results-data__param">
      {{ item.value }}
    </div>
  </div>
</template>
<script setup>
import {toRefs, defineProps} from "vue";

const props = defineProps({
  item: Object
})
const { item } = toRefs(props)
</script>
