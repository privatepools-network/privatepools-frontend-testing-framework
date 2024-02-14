<template>
  <main class="main_containter">
    <div class="app_container">
      <!-- <AppSidebar /> -->

      <div class="wrapper d-flex flex-column min-vh-100">
        <!-- <Drawer :is-open="sidebarWalletOpen" :speed="500" @close="closeSidebar">
          <div>
            <h4>Connect a wallet</h4>
          </div>
        </Drawer> -->
        <AppHeader @toggleSidebar="toggleSidebar" />
        <div
          class="body flex-grow-1 px-1 px-md-3 pt-1"
          style="
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          "
        >
          <router-view />
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import AppHeader from '@/components/AppHeader.vue'

// import AppSidebar from '@/components/AppSidebar.vue'
// import NewReleasesCard from "@/UI/NewReleasesCard.vue";
import { onMounted, ref } from 'vue'

// import { useSwipe } from '@vueuse/core'

const sidebarWalletOpen = ref(false)

function toggleSidebar() {
  sidebarWalletOpen.value = !sidebarWalletOpen.value
}
function closeSidebar() {
  sidebarWalletOpen.value = false
}

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
  background: radial-gradient(#00c9ff, #071027, #000000);
  background-size: 300% 300%;
  animation: gradient 15s ease infinite;
  height: 100vh;
}

.main_containter {
  background-image: URL('../assets/images/background-image.png');
  background-size: cover;

  backdrop-filter: blur(136px);
  position: relative;
}

.app_container {
  background: linear-gradient(
    159.02deg,
    #0f123b 0.25%,
    #090d2e 0.45%,
    rgb(41 43 56 / 50%) 60%
  );
  backdrop-filter: blur(65px);
}

@media (max-width: $xxl) {
  html:not([dir='rtl']) .wrapper {
    // padding-left: 33px;
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
