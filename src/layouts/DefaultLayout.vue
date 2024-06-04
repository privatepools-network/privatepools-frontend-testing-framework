<template>
  <Drawer :is-open="sidebarWalletOpen" @close="closeSidebar">
    <div style="height: 100%">
      <ConnectedSidebar
        @setAddress="(addr) => (address = addr)"
        :address="address"
        v-if="address && sidebarWalletState !== 'Settings'"
        :isConnectedToWeb3="address != null && address != ''"
        @toggleSettings="toggleSettings"
        @toggleToWallets="toggleToWallets"
      />
      <ConnectWalletsDrawer
        v-else-if="sidebarWalletState === 'Connect wallet'"
        @toggleSettings="toggleSettings"
        @setAddress="(addr) => (address = addr)"
        @toggleSidebar="toggleSidebar"
      />
      <SettingsDrawer
        v-else-if="sidebarWalletState === 'Settings'"
        @toggleToWallets="toggleToWallets"
      />
    </div>
  </Drawer>
  <main class="main_containter bg-[#DCEEF6] dark:!bg-[#02031C]">
    <div class="bottom-left-icon">
      <div
        
        class="bug_button dark:!bg-[#02031C] bg-[#DCEEF6] text-black dark:!text-white"
      >
        <img :src="shield_bug" /> <span v-if="width > 768">Bug Report</span>
      </div>
    </div>

    <div class="app_container">
      <div class="background">
        <div class="particles">
          <particles-bg
            v-if="currentParticles === 'on'"
            color="#00E0FF"
            type="cobweb"
            :num="width > 768 ? 80 : 30"
            :bg="false"
            class="!pointer-events-none"
          />
        </div>
      </div>

      <div class="wrapper d-flex flex-column min-vh-100">
        <AppHeader
          @setAddress="(addr) => (address = addr)"
          :address="address"
          @toggleSidebar="toggleSidebar"
        />
        <div class="body flex-grow-1 px-md-3 pt-1 md:px-[2.5rem] px-1">
          <router-view />
        </div>
        <AppFooter />
      </div>
    </div>
    <!-- <div class="background">
    <div class="particles"> -->

    <!-- </div> -->
    <!-- </div> -->
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
import { ParticlesBg } from 'particles-bg-vue'
import { useSettings } from '@/store/settings'
import { storeToRefs } from 'pinia'
import { useDevice } from '@/composables/adaptive/useDevice'
import shield_bug from '@/assets/icons/shield_bug.svg'

const settingsStore = useSettings()
const { width } = useDevice()

const { currentParticles } = storeToRefs(settingsStore)

const sidebarWalletOpen = ref(false)
const sidebarWalletState = ref('Connect wallet')

const address = ref(null)

function toggleSidebar() {
  sidebarWalletOpen.value = true
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

.background {
  // z-index: -1;
  pointer-events: none;
  // background-image: linear-gradient(55deg, #02031c 35%, #00e0ff);
  position: fixed;
  top: 0%;
  bottom: 0%;
  left: 0%;
  right: 0%;
}
.particles {
  // opacity: 0.25;
  pointer-events: none;
  width: 100%;
  height: 100svh;
  position: sticky;
  top: 0%;
  bottom: 0%;
  left: 0%;
  right: 0%;
}

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


.bottom-left-icon {
  position: fixed;
  bottom: 330px; /* Adjust based on your preference */
  right: 20px; /* Adjust based on your preference */
  z-index: 1000; /* Ensure it's above other content */
}

.bug_button {
  height: 40px;

  border: 1px solid #2abdff;

  border-radius: 100px;
  padding: 8px 25px;
  font-size: clamp(10px, 0.8vw, 15px);
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: center;

  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width:768px) {
    height: 100%;
    padding: 8px;
  }

  &:hover {
    background: #2abcff36;

    cursor: pointer;
  }
}
</style>
