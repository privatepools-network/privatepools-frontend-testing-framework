<template>
  <div class="flex items-center">
    {{ currency
    }}<count-up
      :start-val="0"
      :end-val="value ? parseFloat(value) : 0"
      :duration="3"
      :options="{ separator: '\'' }"
    ></count-up>
  </div>
</template>
<script setup>
import CountUp from 'vue-countup-v3'
import { defineProps } from 'vue'
defineProps(['value', 'currency'])
</script>
