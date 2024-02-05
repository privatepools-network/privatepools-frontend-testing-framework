<template>
  <div class="loading_pulse">
    <img :src="spinner" alt="D3" class="loading_pulse__img">
  </div>
</template>
<script setup>
import spinner from '@/assets/images/loader.svg'

</script>
<style scoped lang="scss">
.loading_pulse {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    filter: drop-shadow(0 0 0.3rem #01B47E);
    &__img {
      width: 100px;
    }
  }


</style>
