<template>
  <div
    class="dark:!text-white text-black dark:!bg-[#00000024] bg-white w-full rounded-2xl shadow-md shadow-[#000000b5] border-1 border-[#ffffff0d] md:w-[250px] h-fit"
  >
    <div class="fw-bold p-3 border-b border-[#4f4f4f57]">
      {{ $t('my_wallet') }}
    </div>
    <div
      class="d-flex flex-column p-2 dark:!text-[#dddddd] text-black"
      style="font-size: clamp(10px, 0.8vw, 14px)"
      v-if="balances != {} && lastTokenPrices != {} && lineNumbers.length > 0"
    >
      <div
        class="d-flex justify-content-between align-items-center"
        v-for="(token, index) in tokens"
        :key="`wallet-${index}`"
      >
        <img
          :src="getTokenEntity(token.symbol, 'short').icon"
          class="p-1 w-6"
        />
        <div class="font-['Roboto_Mono',_monospace]">
          {{ parseFloat(balances[token.address]).toFixed(6) }}
          ({{
            (balances[token.address] * lastTokenPrices[token.address]).toFixed(
              2,
            )
          }}$)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

import { getTokenEntity } from '@/lib/helpers/util'

const props = defineProps([
  'tokens',
  'balances',
  'lastTokenPrices',
  'lineNumbers',
])
</script>
