<template>
  <div class="currency-selector-container">
    <multiselect :modelValue="chainSelected" @update:modelValue="chainSelected = $event" placeholder="" label="title"
      track-by="code" :options="chainOptions" :option-height="104" :show-labels="true" :searchable="false"
      :allow-empty="false" :hide-selected="true" :close-on-select="true" :taggable="false" :showLabels="false">
      <template v-slot:singleLabel="{ option }">
        <div style="display: flex; align-items: center; margin-top: 1px;">
          <img style="width: 22px; padding: 5px; margin-right: 5px" :src="option.img" /><span
            style="font-size: clamp(10px, 0.8vw, 14px);" class="text-black dark:!text-white"> {{ option.name }}</span>
          <!-- <span style="color: rgba(108, 114, 132, 1); margin-left: 2.5px"
              >({{ option.code }})</span
            > -->
        </div>
      </template>
      <template v-slot:option="{ option }">
        <div style="display: flex; align-items: center">
          <img style="width: 22px; padding: 5px; margin-right: 5px" :src="option.img" /><span
            style="font-size: clamp(10px, 0.8vw, 14px);" class="text-black dark:!text-white"> {{ option.name }}</span>
          <!-- <span style="color: rgba(108, 114, 132, 1); margin-left: 2.5px"
              >({{ option.code }})</span
            > -->
        </div>
      </template>
    </multiselect>
  </div>
</template>
<script setup>
import Multiselect from 'vue-multiselect'
import usdSymbol from '@/assets/images/tokens/usdSymbol.png'
import btc from '@/assets/images/tokens/btc.png'
import eth from '@/assets/images/tokens/ETH.png'
import { ref, defineEmits, watch } from 'vue'

const emit = defineEmits(["updateCurrency"])
const chainSelected = ref({ name: 'USD', code: 'USD', img: usdSymbol, symbol: "$" })
const chainOptions = ref([
  { name: 'USD', code: 'USD', img: usdSymbol, symbol: "$" },
  { name: 'BTC', code: 'BTC', img: btc, symbol: "₿" },
  { name: 'ETH', code: 'ETH', img: eth, symbol: "Ξ" },
])

emit("updateCurrency", chainSelected.value)
watch((chainSelected), () => {
  emit("updateCurrency", chainSelected.value)
})


</script>
<style lang="scss" scoped>
.currency-selector-container {
  // margin-bottom: 1.5vw;
}

:deep(.multiselect) {
  min-height: 0px !important;
}


:deep(.multiselect__tags) {
  background: none !important;
  border-color: #00C9FF !important;
  border-radius: 20px;
  padding: 0px 34px 0 8px !important;
  min-height: 10px;
}

:deep(.multiselect__content-wrapper) {
  border-color: #00C9FF !important;
}

:deep(.multiselect__single) {
  background: none !important;
  color: #777 !important;
  margin-bottom: 1px !important;
}

:deep(.multiselect__option) {
  background: transparent !important;
  color: #777 !important;
  min-height: 5px !important;
  padding: 0px !important;

}

:deep(.multiselect__option:hover) {
  background: #00c8ffc4 !important;
}

:deep(.multiselect__select) {
  width: 40px;
  height: 30px;
}

// @media (max-width: 1600px) {
//     :deep(.multiselect__select) {
//     width: 40px;
//     height: 38px;
// }
// }
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>