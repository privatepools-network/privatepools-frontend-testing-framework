<template>
  <div class="loading_pulse">
    <!-- <img :src="spinner" alt="D3" class="loading_pulse__img"> -->
    <span class="loader"></span>
  </div>
</template>
<script setup>
// import spinner from '@/assets/images/loader.svg'
</script>
<style scoped lang="scss">
.loading_pulse {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    filter: drop-shadow(0 0 0.3rem #00C9FF);
    // &__img {
    //   width: 100px;
    // }
  }

.loader {
  
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  border-top: 3px solid #00C9FF;
  border-right: 3px solid transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} 
</style>
