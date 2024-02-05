<template>
  <div class="results-data__el">
    <div class="results-data__title" style="padding: 9px 12px">
      {{ filtersOptions[i].label }}
    </div>
    <div class="results-data__value">{{item.data}}</div>
  </div>

</template>
<script setup>
import {toRefs, defineProps} from "vue";
const props = defineProps({
  item: Object,
  i: Number,
  filtersOptions: Array,
  filtersSelected: Array
})
const {item, i, filtersOptions} = toRefs(props)
</script>


