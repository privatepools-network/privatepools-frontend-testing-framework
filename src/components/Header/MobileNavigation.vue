<template>
  <div class="app-container">
    <div
      :class="sidebarClasses"
      class="transform transition-transform duration-300 ease-in-out"
    >
      <aside class="h-screen w-64 bg-gray-800 text-white">
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps(['sidebarVisible'])

// Example of dynamically adjusting sidebar classes based on visibility
const sidebarClasses = computed(() => {
  return props.sidebarVisible.value ? 'translate-x-0' : '-translate-x-full'
})
</script>

<style scoped>
.app-container {
  position: relative;
}
</style>
