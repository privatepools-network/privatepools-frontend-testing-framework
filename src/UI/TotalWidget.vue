<template>
    <div class="widget_container">
        <slot></slot>
    </div>
  </template>
  <script setup>
  import { defineProps } from 'vue'
  
  defineProps([])
  </script>
  <style scoped lang="scss">
  @import '@/styles/_variables.scss';
  
  .widget_container {
    width: 20vw;
    /* height: 110px; */
    display: flex;
    justify-content: space-between;
    /* border: 0.5px solid #a3a4a538; */
    margin-bottom: 1.5vw;
    align-items: center;
    background: linear-gradient(152.97deg, #121B198F 18.75%, rgba(0, 0, 0, 0) 100%);
    color:white;
    font-size: clamp(10px, 0.8vw, 14px);
   
    border-radius: 15px;
    padding: 15px;
    font-family: Poppins;
    letter-spacing: 0em;
  }
  
  .totals_loader {
    margin-left: 20px;
    margin-top: 8px;
  }
  .widget_text_container {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .widget_text_header {
    font-weight: 500;
    line-height: 12px;
    font-size: clamp(10px, 0.8vw, 14px);
    color: #a0aec0;
  }
  .widget_text_value {
    font-size: clamp(13px, 0.9vw, 22px);
    font-weight: 700;
    line-height: 25px;
    color: #ffffff;
  }
  
  .widget_image {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #00C9FF;
    box-shadow: 0px 3.500000238418579px 5.500000476837158px 0px #00000005;
    width: 45px;
    height: 45px;
    border-radius: 12px;
    &_icon {
      width: 22px;
      height: 22px;
    }
  }
  
  @media (min-width: 2500px) {
    .widget_container {
      width: 11vw;
      padding: 11px;
    }
  }
  @media (min-width: 2000px) {
    .widget_container {
      width: 11vw;
      padding: 11px;
    }
  }
  
  @media (max-width: $xxl) {
    .widget_container {
      width: 19vw;
      border-radius: 15px;
      /* padding: 8px 11px 4px 11px; */
    }
  
    .widget_image {
      width: 30px;
      height: 30px;
      &_icon {
        width: 18px;
        height: 18px;
      }
    }
  }
  
  @media (max-width: $lg) {
    .widget_container {
      width: 100%;
    }
  }
  @media (max-width: $lg) {
    .widget_container {
      width: 100%;
    }
  }
  
  @media (max-width: $md) {
    .widget_container {
      width: 100%;
      /* padding: 8px 11px 8px 11px; */
    }
    .widget_image {
      width: 47px;
      height: 47px;
      border-radius: 12px;
      &_icon {
        width: 27px;
        height: 27px;
      }
    }
    .widget_text_header {
  
      font-size: 12px;
    }
    .widget_text_value {
      font-size: 16px;
  
    }
  }
  </style>
  