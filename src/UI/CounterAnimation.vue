<template>
  <div class="flex items-center">
    <!-- {{ currency}} -->
    <CurrencySymbol v-if="!currency"/>
    <count-up
      :start-val="0"
      :end-val="value ? parseFloat(value) : 0"
      :duration="3"
      :options="{ separator: '\'' }"
      :decimal-places="decimalPlaces"
    ></count-up>
  </div>
</template>
<script setup>
import CountUp from 'vue-countup-v3'
import { defineProps } from 'vue'
import CurrencySymbol from '@/components/TrackInfo/CurrencySymbol.vue';
defineProps(['value', 'currency', 'decimalPlaces'])
</script>
