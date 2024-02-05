<template>
    <span v-if="symbol === '₿'">
        <img :src="btcSymbol" width="9" />
    </span>
    <span v-else-if="symbol === 'Ξ'">
        <img :src="ethSymbol" width="9" />
    </span>
    <span v-else>{{ symbol }} </span>
</template>
<script setup>
import { defineProps } from 'vue'
import btcSymbol from '@/assets/images/tokens/btcSymbol.png'
import ethSymbol from '@/assets/images/tokens/ethSymbol.png'
defineProps(['symbol'])

</script>