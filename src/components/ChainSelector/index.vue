<template>
  <multiselect :modelValue="chainSelected" @update:modelValue="$emit('updateChain', $event)" placeholder="" label="title"
    track-by="code" :options="chainOptions" :option-height="104" :show-labels="true" :searchable="false"
    :allow-empty="false" :hide-selected="true" :close-on-select="true" :taggable="false" :showLabels="false">
    <template v-slot:singleLabel="{ option }">
      <div style="display: flex; align-items: center">
        <img style="width: 20px; height: 20px; margin-right: 5px" :src="option.img" /><span> {{ option.name }}</span>
        <span style="color: rgba(108, 114, 132, 1); margin-left: 2.5px">({{ option.code }})</span>
      </div>
    </template>
    <template v-slot:option="{ option }">
      <div style="display: flex; align-items: center">
        <img style="width: 20px; height: 20px; margin-right: 5px" :src="option.img" /><span> {{ option.name }}</span>
        <span style="color: rgba(108, 114, 132, 1); margin-left: 2.5px">({{ option.code }})</span>
      </div>
    </template>
  </multiselect>
</template>

<script setup>
import { defineProps } from 'vue'
import { toRefs } from "vue"
import Multiselect from 'vue-multiselect'

const props = defineProps(['chainSelected', 'chainOptions'])
const { chainSelected } = toRefs(props)

</script>
<style scoped lang="scss">
:deep(.multiselect__tags) {
  background: none !important;
  border-color: #00C9FF !important;
}
:deep(.multiselect__content-wrapper) {
  border-color: #00C9FF !important;
}
:deep(.multiselect__single) {
  background: none !important;
  color: white !important;
}
:deep(.multiselect__option) {
  background: rgb(15, 17, 19) !important;
  color: white !important;
}
:deep(.multiselect__option:hover) {
  background: rgba(1, 180, 126, 0.884) !important;
}
:deep(.multiselect__tags) {
  min-width: 100%;
  max-width: 100%;
  display: block;
  border-radius: 1px !important;
  border: 1px solid #00C9FF !important;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
