<template>
  <div class="flex justify-between items-center">
    <span class="text text-white">
      {{ isDark ? 'Dark' : 'Light' }} Mode
    </span>

   
    <label class="inline-flex items-center cursor-pointer" >
      <input type="checkbox" value="" class="sr-only peer"  v-model="isDark" :checked="isDark"/>
      <div
        class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
      ></div>
    </label>
  </div>
</template>

<script setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
<style lang="scss" scoped>
.text {
  font-family: Inter;
  font-size: 13px;
  font-weight: 400;
  line-height: 44px;
  letter-spacing: 0px;
}
</style>
