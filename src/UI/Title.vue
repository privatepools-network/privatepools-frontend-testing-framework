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
  font-family: Inter;

font-weight: 400;
line-height: 32px;
color: #FFFFFF;

  font-size: clamp(14px, 0.9vw, 28px);

}
@media (max-width: $md) {
  .header_text {

    font-size: 14px;

  }
}
</style>
