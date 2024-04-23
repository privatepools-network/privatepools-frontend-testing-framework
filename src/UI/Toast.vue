<script setup>
import { defineProps } from 'vue'
defineProps(['closeToast', 'toastProps'])
</script>

<template>
  <div class="toast_container">
    <div class="d-flex align-items-center justify-content-between">
      <div class="toast_header">{{ toastProps.data.header_text }}</div>
      <div class="d-flex align-items-center gap-3" style="z-index: 9999">
        <a
          v-if="toastProps.data.tx_link != ''"
          :href="toastProps.data.tx_link"
          target="_blank"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.109713 8.22573L9.44969 3.00087L2.74511 1.09939L2.94975 0.377851L10.8867 2.62885L8.63572 10.5658L7.91418 10.3612L9.81586 3.65588L0.465345 8.86294L0.109713 8.22573Z"
              fill="#666666"
            />
          </svg>
        </a>
        <a
          v-if="toastProps.data.speedUp != ''"
          target="_blank"
          @click="
            ($event) => {
              closeToast && closeToast($event)
            }
          "
        >
          <svg
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.62383 15.6911C4.5646 15.7329 4.49504 15.7576 4.42274 15.7625C4.35045 15.7674 4.27818 15.7524 4.21383 15.7191C4.14948 15.6858 4.09551 15.6354 4.05781 15.5735C4.0201 15.5116 4.00011 15.4406 4 15.3681V7.39605C3.99996 7.32352 4.01985 7.25237 4.0575 7.19037C4.09515 7.12838 4.1491 7.07792 4.21348 7.0445C4.27786 7.01109 4.35018 6.99601 4.42255 7.0009C4.49491 7.0058 4.56454 7.03048 4.62383 7.07226L10.2708 11.0583C10.3226 11.0949 10.3648 11.1433 10.394 11.1996C10.4232 11.2559 10.4384 11.3183 10.4384 11.3817C10.4384 11.4451 10.4232 11.5075 10.394 11.5638C10.3648 11.6201 10.3226 11.6685 10.2708 11.7051L4.62383 15.6911ZM11.125 7.39605C11.125 7.32352 11.1449 7.25237 11.1825 7.19037C11.2201 7.12838 11.2741 7.07792 11.3385 7.0445C11.4029 7.01109 11.4752 6.99601 11.5475 7.0009C11.6199 7.0058 11.6895 7.03048 11.7488 7.07226L17.3958 11.0583C17.4476 11.0949 17.4898 11.1433 17.519 11.1996C17.5482 11.2559 17.5634 11.3183 17.5634 11.3817C17.5634 11.4451 17.5482 11.5075 17.519 11.5638C17.4898 11.6201 17.4476 11.6685 17.3958 11.7051L11.7488 15.6911C11.6896 15.7329 11.62 15.7576 11.5477 15.7625C11.4754 15.7674 11.4032 15.7524 11.3388 15.7191C11.2745 15.6858 11.2205 15.6354 11.1828 15.5735C11.1451 15.5116 11.1251 15.4406 11.125 15.3681V7.39605Z"
              fill="#666666"
            />
          </svg>
        </a>
        <div
          @click="
            ($event) => {
              closeToast && closeToast($event)
            }
          "
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 9L9 1M1 1L9 9"
              stroke="#666666"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="toast_text">{{ toastProps.data.toast_text }}</div>
  </div>
</template>

<style lang="scss">
.toast_container {
}

.toast_header {
  font-family: Poppins;
  font-size: 14px;
  font-weight: 500;
  line-height: 15px;
}

.toast_text {
  margin-top: 10px;
  font-family: Poppins;
  font-size: 10px;
  font-weight: 400;
  line-height: 20px;
}

.Toastify__toast-body {
  align-items: start !important;
  display: flex;
  flex: 1 1 auto;
  margin: auto 0;
  padding: 6px;
  white-space: pre-wrap;
}
</style>
