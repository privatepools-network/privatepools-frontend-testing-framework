<template>
     <div class="app_release_container">
      <NewReleasesCard
        :newReleaseCheck="newReleaseCheck"
        
      />
    </div>
</template>
<script setup>
import NewReleasesCard from "@/UI/NewReleasesCard.vue";

</script>
<style lang="scss" scoped>
.app_release_container {
  background: radial-gradient(#01b47e, #071027, #000000);
  background-size: 300% 300%;
  animation: gradient 15s ease infinite;
  height: 100vh;
}
</style>