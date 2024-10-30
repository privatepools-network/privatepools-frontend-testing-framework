<template>
  <div class="loading_pulse">
    <!-- <img :src="spinner" alt="D3" class="loading_pulse__img"> -->
    <!-- <span class="loader"></span> -->
    <div class="flex justify-center items-center">
  

      <img :src="ppnLoader" class="loader" alt="loading">
    </div>
  </div>
</template>
<script setup>
import ppnLoader from '@/assets/icons/loader/PPNLoader.svg'
</script>
<style scoped lang="scss">
.loading_pulse {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  filter: drop-shadow(0 0 0.3rem #00c9ff);
  // &__img {
  //   width: 100px;
  // }
}

.loader {
  width: 48px;
  height: 48px;
  // border-radius: 50%;
  // display: inline-block;
  // border-top: 3px solid #00c9ff;
  // border-right: 3px solid transparent;
  // box-sizing: border-box;
  animation: pulse 2s linear infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.85);
    // box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }

  70% {
    transform: scale(1);
    // box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(0.85);
    // box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}
</style>
