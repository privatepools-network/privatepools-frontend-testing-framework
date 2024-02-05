<template>
  <div class="dot-flashing"></div>
</template>
<script setup>
import { defineProps } from 'vue'

defineProps(['dots_size'])
</script>
<style scoped lang="scss">
@import '@/styles/_variables.scss';

.dot-flashing {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  background-color: #01b47e;
  color: #01b47e;
  animation: dot-flashing 1s infinite linear alternate;
  animation-delay: 0.5s;
  filter: drop-shadow(0 0 0.3rem #01b47e);
}
.dot-flashing::before,
.dot-flashing::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
}
.dot-flashing::before {
  left: -15px;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  background-color: #01b47e;
  color: #01b47e;
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 0s;
}
.dot-flashing::after {
  left: 15px;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  background-color: #01b47e;
  color: #01b47e;
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 1s;
}

@keyframes dot-flashing {
  0% {
    background-color: #01b47e;
  }
  50%,
  100% {
    background-color: rgba(1, 180, 126, 0.2);
  }
}

// @media (max-width: $xxl) {
//   .dot-flashing {
//     position: relative;
//     width: 5px;
//     height: 5px;
//     border-radius: 5px;
//     background-color: #01b47e;
//     color: #01b47e;
//     animation: dot-flashing 1s infinite linear alternate;
//     animation-delay: 0.5s;
//     filter: drop-shadow(0 0 0.3rem #01b47e);
//   }

//   .dot-flashing::before {
//   left: -15px;
//   width: 5px;
//   height: 5px;
//   border-radius: 5px;
//   background-color: #01b47e;
//   color: #01b47e;
//   animation: dot-flashing 1s infinite alternate;
//   animation-delay: 0s;
// }
// .dot-flashing::after {
//   left: 15px;
//   width: 5px;
//   height: 5px;
//   border-radius: 5px;
//   background-color: #01b47e;
//   color: #01b47e;
//   animation: dot-flashing 1s infinite alternate;
//   animation-delay: 1s;
// }
// }
</style>
