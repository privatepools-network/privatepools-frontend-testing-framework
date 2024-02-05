<template>
  <main>
   
    <!-- <div v-if="newReleaseCheck === 'non_checked' || newReleaseCheck === null" class="app_release_container">
      <NewReleasesCard
        :newReleaseCheck="newReleaseCheck"
        
      />
    </div> -->

    <div  class="app_container">
      <AppSidebar />
      <div class="wrapper d-flex flex-column min-vh-100 bg--black">
        <AppHeader />

        <div class="body flex-grow-1 px-1 px-md-3 bg--black pt-1">
          <router-view />
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
// import NewReleasesCard from "@/UI/NewReleasesCard.vue";
// import { onMounted} from 'vue'

// import { useSwipe } from '@vueuse/core'

// const { isSwiping, direction } = useSwipe(document.body)
// {{ console.log(isSwiping) }}
// {{ console.log(direction) }}


// onMounted(() => {
//   console.log("localStorage.getItem('release')", localStorage.getItem('release'))
//   if (localStorage.getItem('release') === null) {
//     localStorage.setItem('release', 'non_checked')
//   }
// })


// const newReleaseCheck = localStorage.getItem('release')

</script>
<style lang="scss" scoped>
@import '../styles/_variables.scss';

.app_release_container {
  background: radial-gradient(#01b47e, #071027, #000000);
  background-size: 300% 300%;
  animation: gradient 15s ease infinite;
  height: 100vh;
}

.body {
  /* display: flex;
  justify-content: center; */
}

.app_container {
}

@media (max-width: $xxl) {
  html:not([dir='rtl']) .wrapper {
    padding-left: 33px;
  }
  .app_container {
  }
}
@media (max-width: $md) {
  html:not([dir='rtl']) .wrapper {
    padding-left: 0px;
  }
  .app_container {
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
