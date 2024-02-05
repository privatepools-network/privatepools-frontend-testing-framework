<template>
  <div class="container">
    <div class="number">{{ number + 1 }}</div>
    <div class="name">{{ text }}</div>
    <CButton class="button" :disabled="disabled" @click="clickEvent">
      {{ text }}
    </CButton>
  </div>
</template>

<script setup>
import { defineProps, toRefs } from 'vue'
const props = defineProps(['number', 'text', 'disabled', 'clickEvent'])
const { disabled, clickEvent } = toRefs(props)
</script>

<style lang="scss" scoped>
@mixin text {
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0em;
  color: #ffffff;
}

.container {
  padding: 20px 21px 20px 12px;
  border-radius: 20px;
  border: 0.2px solid #01B47E;
  background: var(--Card-linear, linear-gradient(91deg, rgba(53, 185, 192, 0.05) 0.36%, rgba(53, 185, 192, 0.02) 99.41%));
  display: flex;
  align-items: center;

  .number {
    border: 1px solid #01b47e;
    border-radius: 16px;
    height: 100%;
    padding-left: 12px;
    padding-right: 12px;
    margin-right: 12px;

    display: flex;
    justify-content: space-around;
    align-items: center;

    @include text;
  }

  .name {
    @include text;
    margin-right: 8px;
  }

  .button {
    padding-top: 7px;
    padding-bottom: 7px;
    border-radius: 20px;
    background: linear-gradient(89deg, #01B47E 5.07%, #3B6141 99.37%);
    flex-grow: 1;
    border: none;
    @include text;
  }
}
</style>
