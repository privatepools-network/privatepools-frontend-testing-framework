<template>
  <Drawer :is-open="sidebarWalletOpen" :speed="500" @close="closeSidebar">
    <div style="height: 100%;">
      <ConnectedSidebar @setAddress="(addr) => address = addr" :address="address"
        v-if="address && sidebarWalletState !== 'Settings'" :isConnectedToWeb3="address != null && address != ''"
        @toggleSettings="toggleSettings" @toggleToWallets="toggleToWallets" />
      <ConnectWalletsDrawer v-else-if="sidebarWalletState === 'Connect wallet'" @toggleSettings="toggleSettings"
        @setAddress="(addr) => address = addr" @toggleSidebar="toggleSidebar" />
      <SettingsDrawer v-else-if="sidebarWalletState === 'Settings'" @toggleToWallets="toggleToWallets" />
    </div>
  </Drawer>
  <main class="main_containter">
    <div class="app_container bg-white dark:!bg-[#171717]">
      <div class="wrapper d-flex flex-column min-vh-100">
        <AppHeader @setAddress="(addr) => address = addr" :address="address" @toggleSidebar="toggleSidebar" />
        <div class="body flex-grow-1 px-1 px-md-3 pt-1" style="
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          ">
          <router-view />
        </div>
        <AppFooter />
      </div>

    </div>
  </main>
</template>
<script setup>
import AppHeader from '@/components/AppHeader.vue'
import ConnectWalletsDrawer from '@/components/Drawer/ConnectWalletsDrawer.vue'
import SettingsDrawer from '@/components/Drawer/SettingsDrawer.vue'
import ConnectedSidebar from '@/components/Drawer/ConnectedSidebar.vue'
import Drawer from '@/UI/Drawer.vue'
import { watch, ref } from 'vue'
import AppFooter from '@/components/AppFooter.vue'

const sidebarWalletOpen = ref(false)
const sidebarWalletState = ref('Connect wallet')

const address = ref(null)

function toggleSidebar() {
  sidebarWalletOpen.value = !sidebarWalletOpen.value
}
function closeSidebar() {
  sidebarWalletOpen.value = false
}


function toggleSettings() {
  sidebarWalletState.value = 'Settings'
}
function toggleToWallets() {
  sidebarWalletState.value = 'Connect wallet'
}


watch(address, () => {
  if (address.value) {
    sidebarWalletState.value = 'Connected'
  }
})


</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';



.main_containter {
  background-size: cover;

  backdrop-filter: blur(136px);
  position: relative;
}

.app_container {
  // background: #171717;
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
