<template>
  <div class="d-flex align-items-center gap-2 my-xxl-3 my-2">
    <div class="header_text">{{ title }}</div>
    <slot></slot>
  </div>
</template>
<script setup>
import { defineProps, toRefs } from 'vue'

const props = defineProps({
  title: String,
})

const { title } = toRefs(props)
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.header_text {
  color: rgb(255, 255, 255);
  font-family: Poppins;
  font-size: clamp(10px, 0.9vw, 18px);
  font-weight: 700;
  line-height: 25px;
  letter-spacing: 0em;
}
@media (max-width: $md) {
  .header_text {

    font-size: 14px;

  }
}
</style>
