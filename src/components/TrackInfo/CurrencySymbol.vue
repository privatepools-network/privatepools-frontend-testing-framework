<template>
  <span v-if="currentCurrency === 'BTC'" class="w-[10px]">
    <img :src="btcSymbol" width="9" />
  </span>
  <span v-else-if="currentCurrency === 'ETH'" class="w-[10px]">
    <img :src="ethSymbol" width="9" />
  </span>
  <span v-else-if="currentCurrency === 'USD'">$</span>
</template>
<script setup>
import btcSymbol from '@/assets/images/tokens/btcSymbol.png'
import ethSymbol from '@/assets/images/tokens/ethSymbol.png'
import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'

const settingsStore = useSettings()

const { currentCurrency } = storeToRefs(settingsStore)
</script>
