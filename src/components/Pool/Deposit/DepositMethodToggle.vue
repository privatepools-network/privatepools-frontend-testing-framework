<template>
  <div class="flex items-center bg-[#22222224] p-1 shadow-sm rounded-2xl">
    <div
      :class="depositMethod == 'zap' && 'text-[#02031c] bg-[#00e0ff]'"
      class="px-2 py-1 text-[14px] rounded-full cursor-pointer"
      @click="$emit('toggle', 'zap')"
    >
      <span class="font-['Syne',_sans-serif] font-medium"> Zap </span>
    </div>
    <div
      :class="depositMethod == 'manual' && 'text-[#02031c] bg-[#00e0ff]'"
      class="px-2 py-1 text-[14px] rounded-full cursor-pointer"
      @click="$emit('toggle', 'manual')"
    >
      <span class="font-['Syne',_sans-serif] font-medium"> Manual </span>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps(['depositMethod'])
const emit = defineEmits(['toggle'])
</script>
