<template>
    <svg
      :width="width"
      :height="height"
      :viewBox="viewBox"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="cursor-pointer"
      @click="onClick"
    >
      <path :d="pathData" :fill="fillColor" />
    </svg>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    width: {
      type: String,
      default: '28',
    },
    height: {
      type: String,
      default: '22',
    },
    viewBox: {
      type: String,
      default: '0 0 28 22',
    },
    pathData: {
      type: String,
      required: true,
    },
    fillColor: {
      type: String,
      required: true,
    },
  });
  
  const emit = defineEmits(['click']);
  
  const onClick = () => {
    emit('click');
  };
  </script>