<template>
  <CHeader position="static" class="header_main">
    <CContainer fluid class="header_container">
      <CHeaderNav v-if="width > 768" class="d-flex me-auto">
        <AppBreadcrumb :title="true" />
      </CHeaderNav>
      <CHeaderNav>
        <div class="header_main_container">
          <div v-if="width < 768">
            <button class="sidemenu__btn" v-on:click="navOpen = !navOpen" v-bind:class="{ active: navOpen }">
              <span class="top"></span>
              <span class="mid"></span>
              <span class="bottom"></span>
            </button>

            <SidebarMobile @closeNav="closeNav" :navOpen="navOpen" :computedAddress="computedAddress" />
          </div>
          <div class="right_sidebar">
            <div>
              <div v-if="isConnectedToWeb3 && computedNetwork !== 'Unsupported network'
                ">
                <Dropdown :distance="3" :skidding="-10" :placement="'bottom-end'">
                  <div class="bell_container">
                    <img :src="computedNetworkImage" alt="network" />
                  </div>
                  <template #popper>
                    <div class="header__popup">
                      <h6 style="font-size: 14px; margin-left: 4px;">Select Network</h6>
                      <hr />
                      <div class="d-flex flex-column gap-1">
                        <div class="network_item" v-for="(network, index) in networksList"
                          :key="`notification-key-${index}`">
                          <div class="d-flex justify-content-between align-items-center w-100"
                            @click="selectANetwork(network.chainId, index)">
                            <div class="d-flex align-items-center gap-1">
                              <img :src="network.image" />
                              {{ network.name }}
                            </div>
                            <div v-if="network.current === true">
                              <svg width="18" height="13" viewBox="0 0 18 13" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M6.29448 13L0 6.83784L1.57362 5.2973L6.29448 9.91892L16.4264 0L18 1.54054L6.29448 13Z"
                                  fill="#A39F9F" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </Dropdown>
              </div>
            </div>

            <!-- <div v-if="width > 768">
              <Dropdown :distance="3" :skidding="-10" :placement="'bottom-end'">
                <div class="bell_container">
                  <div>
                    <img class="bell_icon" :src="bell" />
                    <div class="badge">
                      <div class="message-count">{{ notifications.length }}</div>
                    </div>
                  </div>
                </div>
                <template #popper>
                  <div class="header__popup header-notifications">
                    <h6 style="font-size: 14px; margin-left: 4px;">Recent Activities</h6>
                    <hr />
                    <div class="d-flex flex-column gap-2 header-notifications__wrapper">
                      <div class="p-3 d-flex justify-content-center" v-if="!notifications.length">
                        Empty
                      </div>
                      <div class="header-notifications__el" v-for="(notification, index) in notifications"
                        :key="`notification-key-${index}`">
                        <div class="d-flex flex-column">
                          <div class="d-flex align-items-center gap-1" style="font-size: 12px;">
                            {{ notification.type }}
                            <a :href="getNotificationLink(notification)" target="_blank">
                              <svg v-if="notification.status !== 'Warning'" width="8" height="8" viewBox="0 0 8 8"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.5 6.91667L6.91667 1.5M6.91667 1.5V6.7M6.91667 1.5H1.71667" stroke="#F8F8F8"
                                  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </a>

                          </div>
                          <div style="
                          color: rgba(115, 128, 137, 0.81);
                          font-size: 10px;
                        ">
                            {{ notification.value }}
                          </div>
                        </div>
                        <div>
                          <svg v-if="notification.status === 'Success'" width="18" height="18" viewBox="0 0 18 18"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="9" r="8.5" fill="#01B47E" stroke="#01B47E" />
                            <path
                              d="M7.70625 12.9516L4.5 9.74531L5.30156 8.94375L7.70625 11.3484L12.8672 6.1875L13.6687 6.98906L7.70625 12.9516Z"
                              fill="#F8F8F8" />
                          </svg>
                          <svg v-else-if="notification.status === 'Unsuccess'" width="18" height="18" viewBox="0 0 18 18"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="9" r="8.5" fill="#F84747" stroke="#F84747" />
                            <path
                              d="M4.28999 4.29C4.39546 4.18466 4.53843 4.12549 4.68749 4.12549C4.83656 4.12549 4.97952 4.18466 5.08499 4.29L8.99999 8.205L12.915 4.29C12.9837 4.21595 13.0712 4.16183 13.1681 4.13332C13.2651 4.1048 13.3679 4.10297 13.4658 4.128C13.5637 4.15303 13.653 4.204 13.7244 4.27554C13.7957 4.34708 13.8465 4.43654 13.8712 4.5345C13.8963 4.63228 13.8946 4.73501 13.8662 4.83188C13.8378 4.92875 13.7839 5.01619 13.71 5.085L9.79499 9L13.71 12.915C13.784 12.9838 13.8382 13.0712 13.8667 13.1681C13.8952 13.2651 13.897 13.3679 13.872 13.4658C13.847 13.5637 13.796 13.653 13.7245 13.7244C13.6529 13.7957 13.5635 13.8465 13.4655 13.8712C13.3677 13.8963 13.265 13.8946 13.1681 13.8662C13.0712 13.8378 12.9838 13.7839 12.915 13.71L8.99999 9.795L5.08499 13.71C4.9783 13.8093 4.83726 13.8634 4.69152 13.8609C4.54578 13.8583 4.4067 13.7994 4.30349 13.6965C4.20056 13.5933 4.14164 13.4542 4.13913 13.3085C4.13661 13.1627 4.19069 13.0217 4.28999 12.915L8.20499 9L4.28999 5.085C4.18466 4.97953 4.12549 4.83656 4.12549 4.6875C4.12549 4.53843 4.18466 4.39547 4.28999 4.29Z"
                              fill="#F8F8F8" />
                          </svg>
                          <svg v-else-if="notification.status === 'Warning'" xmlns="http://www.w3.org/2000/svg" width="18"
                            height="18" viewBox="0 0 18 18" fill="none">
                            <circle cx="9" cy="9" r="8.5" fill="#FF9C07" stroke="#FF9C07" />
                            <path d="M9 4.00005L9 8.80005" stroke="white" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round" />
                            <path d="M9 12.4L9 13" stroke="white" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round" />
                          </svg>
                          <img :src="NetworkImages[notification.network.toLowerCase()]"
                            v-else-if="notification.network && notification.status === 'Traded'" style="width: 18px">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div @click="clearNotifications" style="
                  background: rgba(3, 22, 3, 0.81);
                  color: white;
                  padding: 3px 11px;
                  font-size: 12px;
                  cursor: pointer;
                  border: 1px solid rgba(3, 22, 3, 0.81);
                  border-radius: 0 0 20px 20px;
                  backdrop-filter: blur(10px);
                ">
                    Clear Activities
                  </div>
                </template>
              </Dropdown>
            </div> -->

            <CNavItem>
              <div v-if="isConnectedToWeb3">
                <Dropdown :distance="3" :placement="'bottom-end'">
                  <CButton v-if="width > 768" color="success" variant="standard" class="header-button">
                    <div class="d-flex align-items-center gap-2">
                      <CIcon :icon="cilUser" size="lg" /> {{ computedAddress }}
                    </div>
                  </CButton>
                  <div v-else class="bell_container">
                    <CIcon class="bell_icon" icon="cil-wallet" size="xl" />
                  </div>
                  <template #popper>
                    <div class="header__popup header-account">
                      <div class="d-flex justify-content-between align-items-center header-account__header">
                        <div style="font-size: 14px; margin-left: 4px;">Account</div>
                        <div class="header-account__button" @click="disconnectFromWallet">
                          <!--                      <CButton @click="disconnectFromWallet" style="border-radius: 20px; color: white" color="success"-->
                          <!--                        variant="standard">Disconnect-->
                          <!--                      </CButton>-->
                          Disconnect
                        </div>
                      </div>
                      <div class="d-flex flex-column gap-2">
                        <div class="d-flex align-items-center justify-content-between">
                          <div class="d-flex align-items-center gap-2">
                            <div>
                              <CIcon :icon="cilUser" size="" />
                            </div>
                            <div style="font-size: 12px;">
                              {{ computedAddress }}
                            </div>
                          </div>
                          <span style="font-size: 12px" v-if="copied">Copied</span>
                          <div class="d-flex align-items-center gap-2">
                            <div class="account_icon" @click="copy(address)">
                              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M3.80469 2.03126C3.80469 1.50801 4.22935 1.08334 4.7526 1.08334H10.9688C11.492 1.08334 11.9167 1.50801 11.9167 2.03126V8.25934C11.9167 8.51075 11.8168 8.75185 11.639 8.92962C11.4613 9.10739 11.2202 9.20726 10.9688 9.20726H4.7526C4.5012 9.20726 4.26009 9.10739 4.08233 8.92962C3.90456 8.75185 3.80469 8.51075 3.80469 8.25934V2.03126ZM4.7526 1.89584C4.71669 1.89584 4.68225 1.91011 4.65685 1.93551C4.63145 1.9609 4.61719 1.99535 4.61719 2.03126V8.25934C4.61719 8.33464 4.67785 8.39476 4.7526 8.39476H10.9688C11.0047 8.39476 11.0391 8.38049 11.0645 8.3551C11.0899 8.3297 11.1042 8.29526 11.1042 8.25934V2.03126C11.1042 1.99535 11.0899 1.9609 11.0645 1.93551C11.0391 1.91011 11.0047 1.89584 10.9688 1.89584H4.7526Z"
                                  fill="#F8F8F8" />
                                <path
                                  d="M1.08057 5.82236C1.0805 5.69783 1.10496 5.57451 1.15257 5.45944C1.20017 5.34437 1.26998 5.23981 1.35801 5.15173C1.44604 5.06365 1.55056 4.99378 1.66561 4.94611C1.78065 4.89844 1.90396 4.8739 2.02848 4.8739H2.84369C2.95144 4.8739 3.05477 4.9167 3.13095 4.99289C3.20714 5.06908 3.24994 5.17241 3.24994 5.28015C3.24994 5.3879 3.20714 5.49123 3.13095 5.56741C3.05477 5.6436 2.95144 5.6864 2.84369 5.6864H2.02848C1.99257 5.6864 1.95812 5.70067 1.93273 5.72606C1.90733 5.75146 1.89307 5.7859 1.89307 5.82182L1.89577 10.9687C1.89577 11.0435 1.9559 11.1042 2.03119 11.1042H7.17702C7.21294 11.1042 7.24738 11.0899 7.27278 11.0645C7.29817 11.0391 7.31244 11.0046 7.31244 10.9687V10.1508C7.31244 10.0431 7.35524 9.93974 7.43143 9.86356C7.50762 9.78737 7.61095 9.74457 7.71869 9.74457C7.82644 9.74457 7.92977 9.78737 8.00595 9.86356C8.08214 9.93974 8.12494 10.0431 8.12494 10.1508V10.9687C8.12494 11.2201 8.02507 11.4612 7.8473 11.639C7.66953 11.8168 7.42843 11.9167 7.17702 11.9167H2.03119C1.77979 11.9167 1.53868 11.8168 1.36091 11.639C1.18314 11.4612 1.08327 11.2201 1.08327 10.9687L1.08057 5.82236Z"
                                  fill="#F8F8F8" />
                              </svg>
                            </div>
                            <a :href="`https://blockscan.com/address/${address}`" target="_blank">
                              <div class="account_icon">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3.25 10.2917L10.2917 3.25M10.2917 3.25V10.01M10.2917 3.25H3.53167"
                                    stroke="#F8F8F8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                              </div>
                            </a>
                          </div>
                        </div>
                        <div class="d-flex align-items-center justify-content-between">
                          <div class="d-flex align-items-center gap-2">
                            <div>
                              <img :src="meatamask_without_bg" alt="meatamask_without_bg" width="16" height="14" />
                            </div>
                            <div style="font-size: 12px;">Metamask</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="header-account__footer">
                      <div class="d-flex flex-column gap-2">
                        <div>Network</div>
                        <div class="d-flex align-items-center gap-1">
                          <div>
                            <svg width="16" height="16" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="3.75" cy="3.75" r="3.75" :fill="computedNetwork === 'Unsupported network'
                                ? 'rgba(248, 71, 71, 1)'
                                : '#01B47E'
                                " />
                            </svg>
                          </div>
                          <div v-if="computedNetwork === 'Unsupported network'">
                            {{ computedNetwork }}
                          </div>
                          <div v-else>Connected to {{ computedNetwork }}</div>
                        </div>
                      </div>
                    </div>
                  </template>
                </Dropdown>
              </div>
              <div v-else>
                <div v-if="isMetamaskSupported">
                  <Dropdown :distance="4" :placement="'bottom-end'">
                    <div class="d-flex">
                      <div class="header-network-button">
                        <img :src="arbIcon" alt="network" width="30" />
                      </div>

                      <CButton color="success" variant="standard" class="header-button" style="margin-left: 16px;">
                        <div class="d-flex align-items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                            <path
                              d="M14 6V3C14 2.73478 13.8946 2.48043 13.7071 2.29289C13.5196 2.10536 13.2652 2 13 2H3C2.46957 2 1.96086 2.21071 1.58579 2.58579C1.21071 2.96086 1 3.46957 1 4M1 4C1 4.53043 1.21071 5.03914 1.58579 5.41421C1.96086 5.78929 2.46957 6 3 6H15C15.2652 6 15.5196 6.10536 15.7071 6.29289C15.8946 6.48043 16 6.73478 16 7V10M1 4V16C1 16.5304 1.21071 17.0391 1.58579 17.4142C1.96086 17.7893 2.46957 18 3 18H15C15.2652 18 15.5196 17.8946 15.7071 17.7071C15.8946 17.5196 16 17.2652 16 17V14"
                              stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                              d="M17 10V14H13C12.4696 14 11.9609 13.7893 11.5858 13.4142C11.2107 13.0391 11 12.5304 11 12C11 11.4696 11.2107 10.9609 11.5858 10.5858C11.9609 10.2107 12.4696 10 13 10H17Z"
                              stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          </svg> Connect Wallet
                        </div>
                      </CButton>
                    </div>

                    <template #popper>
                      <div class="header__popup">
                        <h4 style="font-size: 14px;margin-left: 12px; margin-bottom: 30px;">
                          Select wallet
                        </h4>
                        <div class="wallet_container" @click="connectWallet">
                          <img :src="metamask" alt="Metamask" width="32" />
                          <div>Metamask</div>
                        </div>
                      </div>
                    </template>
                  </Dropdown>
                </div>
                <a v-else href="https://metamask.io/download/" target="_blank">
                  <CButton color="warning" variant="standard">Metamask not found</CButton>
                </a>
              </div>
            </CNavItem>
          </div>
        </div>
        <!-- <AppHeaderDropdownAccnt /> -->
      </CHeaderNav>
    </CContainer>
  </CHeader>
</template>

<script setup>
import AppBreadcrumb from './AppBreadcrumb'
// import polygon from '@/assets/images/networks/polygon.png'
// import arbitrum from '@/assets/images/networks/arbitrum.png'
// import binance from '@/assets/images/networks/binance.png'

// import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'
import { computed, onMounted, ref, watch } from 'vue'
import { cilUser } from '@coreui/icons'
import { Dropdown } from 'floating-vue'
import metamask from '@/assets/images/metamask.png'
// import bell from '@/assets/images/bell.svg'
import binance_network from '@/assets/icons/networks/binance.svg'
import arbitrum_network from '@/assets/icons/networks/arbitrum.svg'
import unsupported_network from '@/assets/icons/networks/unsupported.svg'
import polygon_network from '@/assets/icons/networks/polygon.svg'
import meatamask_without_bg from '@/assets/images/meatamask_without_bg.png'
import { useClipboard } from '@vueuse/core'
import { Network, ReversedDisplayNetwork, networkId, setNetworkId } from '@/composables/useNetwork'
import { ethers } from 'ethers'
import { setMetamaskProvider } from '@/composables/useMetamaskProvider';
import { useStore } from 'vuex'
import { useDevice } from '@/composables/adaptive/useDevice'
import SidebarMobile from '@/components/SidebarMobile'
import { capitalizeFirstLetter } from "@/lib/utils/index"
import { configService } from '@/services/config/config.service'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue';
import arbIcon from '@/assets/images/tokens/arb.png'

import 'vue3-toastify/dist/index.css';
var emitter = require('tiny-emitter/instance');
const { width } = useDevice()



const notify = (popupType, popupText, popupSubText) => {
  toast(Toast, {
    closeOnClick: true,
    theme: "dark",
    type: popupType,
    autoClose: 5000,
    closeButton: false,
    position: toast.POSITION.TOP_RIGHT,
    data: {
      header_text: popupText,
      toast_text: popupSubText,
    }

  });
}

// const NetworkImages = {
//   "polygon": polygon,
//   "arbitrum": arbitrum,
//   "binance": binance
// }

const navOpen = ref(false)
const isMetamaskSupported = ref(false)
const isConnectedToWeb3 = ref(localStorage.getItem('isConnectedToWeb3'))
// const isConnectedToWeb3LocalStorage = ref(false)
const accountData = ref()
const address = ref('')
const ethereumNetwork = ref('')
const store = useStore()
// eslint-disable-next-line
const { text, copy, copied, isSupported } = useClipboard({ address })

function closeNav() {
  navOpen.value = false
}
const clearedNotifications = ref([])

// function clearNotifications() {
//   clearedNotifications.value = [...notifications.value]
//   notifications.value = []
//   localStorage.removeItem("notifications")
// }

watch(
  () => ethereumNetwork.value,
  () => {
    if (ethereumNetwork.value.chainId) {
      let isConnectedToExistingChain = false
      for (let i = 0; i < networksList.value.length; i++) {
        let network = networksList.value[i]
        if (network.decimalChainId == ethereumNetwork.value.chainId) {
          network.current = true
          isConnectedToExistingChain = true
        }
        else {
          network.current = false
        }
      }
      if (!isConnectedToExistingChain) {
        notify("error", "Wrong chain", "Please connect to one of the available chains")
      }
    }
  },
)
const TWO_MINUTES_INTERVAL = 1000 * 60 * 2



if (window.Worker) {
  const myWorker = new Worker(
    new URL('@/worker', import.meta.url),
    { type: 'module' }
  );
  setInterval(() => myWorker.postMessage({ method: "update", data: JSON.parse(localStorage.getItem('notifications')) || '[]' }), TWO_MINUTES_INTERVAL)
  emitter.on('addNotification', (notification) => {
    myWorker.postMessage({
      method: "add", data: {
        "all_notifications": JSON.parse(localStorage.getItem("notifications") || '[]'),
        newNotification: notification
      }
    })
  });

  myWorker.onmessage = function (e) {
    let newNotifications = e.data.filter(item1 => !clearedNotifications.value.some(item2 => item2.hash && item2.hash === item1.hash));

    localStorage.setItem('notifications', JSON.stringify(newNotifications))
    notifications.value = newNotifications
    console.log('Message received from worker');
  }
}
const notifications = ref(JSON.parse(localStorage.getItem("notifications")) || [])



const networksList = ref([
  process.env.VUE_APP_KEY_ARBITRUM ? {
    name: 'Arbitrum',
    chainId: '0xa4b1',
    decimalChainId: 42161,
    image: arbitrum_network,
    current: false,
  } : undefined,
  process.env.VUE_APP_KEY_BINANCE ? {
    name: 'Binance',
    chainId: '0x38',
    decimalChainId: 56,
    image: binance_network,
    current: false,
  } : undefined,
  process.env.VUE_APP_KEY_POLYGON ? {
    name: 'Polygon',
    chainId: '0x89',
    decimalChainId: 137,
    image: polygon_network,
    current: false,
  } : undefined,
].filter((item) => item != undefined))

onMounted(async () => {
  isMetamaskSupported.value = window.ethereum !== undefined
  if (isMetamaskSupported.value) {
    let _isConnected = localStorage.getItem('isConnectedToWeb3')
    window.ethereum?._state?.accounts?.length !== 0 &&
      _isConnected
      ? connectWallet()
      : ''
    if (!_isConnected) {
      notify("warning", "Wallet is not connected", "Please connect your wallet via Metamask")
    }
  }
  else {
    notify("error", "Metamask is not installed!", "Please install Metamask browser extension.")
  }
})

// eslint-disable-next-line
function getNotificationLink(notification) {
  if (!notification.network)
    return "#"
  let config = configService.getNetworkConfig(ReversedDisplayNetwork[capitalizeFirstLetter(notification.network)])
  return `${config.explorer}/tx/${notification.hash}`
}

async function connectWallet() {
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(async (res) => {
      // Request MetaMask to connect
      await window.ethereum.enable();
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      setMetamaskProvider(provider)
      const network = await provider.getNetwork()

      isConnectedToWeb3.value = true
      localStorage.setItem('isConnectedToWeb3', true)

      // isConnectedToWeb3LocalStorage = true

      // console.log('res', res)
      const walletData = res
      accountData.value = walletData
      address.value = walletData[0]
      ethereumNetwork.value = network
      store.dispatch('setCurrentNetwork', network)
      localStorage.setItem('ethereumNetwork', JSON.stringify(network))

      console.log(
        window.ethereum.networkVersion,
        'window.ethereum.networkVersion',
      )
      setNetworkId(network.chainId)
      window.ethereum.on('chainChanged', handleChainChanged)
    })
    .catch((err) => {
      console.log(err)
      notify("warning", "Wallet is not connected", "Please connect your wallet via Metamask")
    })
}

async function handleChainChanged() {
  let provider = new ethers.providers.Web3Provider(window.ethereum)
  const newNetwork = await provider.getNetwork()
  setNetworkId(newNetwork.chainId)
}

async function disconnectFromWallet() {
  isConnectedToWeb3.value = localStorage.removeItem('isConnectedToWeb3')
  await window.ethereum.request({
    method: "eth_requestAccounts",
    params: [{ eth_accounts: {} }]
  })
  networkId.value = Network.NONE
}

async function selectANetwork(chainId) {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: chainId }],
  })
  let decimal_chain_id = parseInt(chainId, 16)
  setNetworkId(decimal_chain_id)
  ethereumNetwork.value = { chainId: decimal_chain_id }
  // .then(() => {
  //   window.location.reload()
  // });


  // networksList.value.forEach((element) => element.current = false);
  // networksList.value[index].current = true
}

const computedAddress = computed(
  () =>
    address.value.substring(0, 6) +
    '....' +
    address.value.substring(address.value.length - 4),
)

const computedNetwork = computed(() =>
  ethereumNetwork.value.chainId === 42161
    ? 'Arbitrum'
    : // : ethereumNetwork.value.chainId === 1
    // ? 'Ethereum'
    ethereumNetwork.value.chainId === 56
      ? 'Binance'
      : ethereumNetwork.value.chainId === 137
        ? 'Polygon'
        : 'Unsupported network',
)

const computedNetworkImage = computed(() =>
  ethereumNetwork.value.chainId === 42161
    ? arbitrum_network
    : ethereumNetwork.value.chainId === 56
      ? binance_network
      : ethereumNetwork.value.chainId === 137
        ? polygon_network
        : unsupported_network,
)
</script>
<style lang="scss">
@import '@/styles/_variables.scss';

.header_container {
  align-items: flex-start !important;

}

.header_main {
  z-index: 12;
  margin-top: 10px;
  margin-bottom: 10px;
}

.header_main_container {
  display: flex;
}

.right_sidebar {
  display: flex;
}

.header {
  border-bottom: none;
  padding: 16px 24px 0 24px;
  background-color: transparent;

  &-nav {
    display: flex;
    align-items: center;

    .nav-item {
      margin: 0;

      &:hover {
        background: transparent;
      }
    }
  }


  &-network-button {
    padding: 8px 8px;
    border-radius: 8px;
    box-shadow: 0px 8px 10px 0px #00000033;
    box-shadow: 0px 6px 30px 0px #0000001F;
    box-shadow: 0px 16px 24px 0px #00000024;
    background: radial-gradient(50% 50% at 26.04% 40.42%, rgba(0, 201, 255, 0.13) 0%, rgba(0, 201, 255, 0) 100%);
    background-color: #1F1F1F;
    color: #fff;
    font-size: 14px;
    font-family: 'Poppins';

    &:hover {
      color: #fff;
    }
  }

  &-button {
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0px 8px 10px 0px #00000033;
    box-shadow: 0px 6px 30px 0px #0000001F;
    box-shadow: 0px 16px 24px 0px #00000024;
    background: radial-gradient(50% 50% at 26.04% 40.42%, rgba(0, 201, 255, 0.13) 0%, rgba(0, 201, 255, 0) 100%);
    background-color: #1F1F1F;
    color: #fff;
    font-size: 14px;
    font-family: 'Poppins';

    &:hover {
      color: #fff;
    }
  }

  &__popup {
    width: 200px;
    border-radius: 20px;
    background: linear-gradient(142deg, #04412e 19.63%, #0c261b 83.01%);
    box-shadow: 0px 40px 40px 0px rgba(0, 0, 0, 0.25);
    padding: 13px 8px;
    color: #fff;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      background: linear-gradient(#065e41, #0c261b);
      background-blend-mode: overlay;
      z-index: -1;
      left: -1px;
      top: -1px;
      right: -1px;
      bottom: -1px;
      border-radius: 20px;
    }

    &:after {
      content: '';
      position: absolute;
      height: 1px;
      width: 100%;
      background: rgba(2, 73, 13, 0.81);
      top: 46px;
      left: 0;
    }

  }

  &-notifications {
    border-radius: 20px 20px 0 0;
    width: 250px;

    &:before {
      border-radius: 20px 20px 0 0;
    }

    &__wrapper {
      max-height: 300px;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 0px !important;
        height: 0px !important;
      }
    }

    &__el {
      position: relative;
      z-index: 2;
      padding: 3px 10px;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:before {
        content: '';
        position: absolute;
        z-index: -10;
        left: -1px;
        right: -1px;
        top: -1px;
        bottom: -1px;
        border-radius: 20px;
        background: conic-gradient(from 180deg at 51.95% 49.81%, rgba(0, 255, 178, 0) -2.11deg, rgba(1, 180, 126, 0) 131.45deg, #7EF6B2 175.58deg, rgba(51, 255, 96, 0) 252.32deg, rgba(8, 182, 129, 0) 310.85deg, rgba(0, 255, 178, 0) 357.89deg, rgba(1, 180, 126, 0) 491.45deg);
      }

      &:after {
        content: '';
        position: absolute;
        z-index: -9;
        left: 0;
        border-radius: 20px;
        width: 100%;
        height: 100%;
        background: linear-gradient(90.23deg, #04422f 0.28%, #0b231a 129.42%);
      }
    }
  }

  &-account {
    width: 300px;
    border-radius: 20px 20px 0 0;

    &:after {
      display: none;
    }

    &__header {
      margin-bottom: 20px;
    }

    &__button {
      position: relative;
      cursor: pointer;
      z-index: 2;
      padding: 6px 10px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      border-radius: 20px;

      &:before {
        content: '';
        position: absolute;
        z-index: -10;
        left: -1px;
        right: -1px;
        top: -1px;
        bottom: -1px;
        border-radius: 20px;
        background: conic-gradient(from 180deg at 51.95% 49.81%, rgba(1, 180, 126, 0) 0deg, #7EF6B2 148.33deg, rgba(8, 182, 129, 0) 225.21deg, rgba(51, 255, 96, 0) 268.33deg, rgba(0, 255, 178, 0) 357.89deg, rgba(1, 180, 126, 0) 360deg);


      }

      &:after {
        content: '';
        position: absolute;
        z-index: -9;
        border-radius: 20px;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90.23deg, #04422f 0.28%, #0b231a 129.42%);
      }

      &:hover {
        &:before {
          background: conic-gradient(from 180deg at 51.95% 49.81%, rgba(1, 180, 126, 0) 0deg, #c6ffdf 148.33deg, rgba(8, 182, 129, 0) 225.21deg, rgba(51, 255, 96, 0) 268.33deg, rgba(0, 255, 178, 0) 357.89deg, rgba(1, 180, 126, 0) 360deg);
        }
      }
    }

    &__footer {
      background: rgba(3, 22, 3, 0.81);
      color: white;
      padding: 3px 11px;
      font-size: 12px;
      cursor: pointer;
      border: 1px solid rgba(3, 22, 3, 0.81);
      border-radius: 0 0 20px 20px;
      backdrop-filter: blur(10px);
    }
  }
}

.wallet_container {
  position: relative;
  z-index: 2;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 20px;

  &:before {
    content: '';
    position: absolute;
    z-index: -10;
    left: -1px;
    right: -1px;
    top: -1px;
    bottom: -1px;
    border-radius: 20px;
    background: conic-gradient(from 180deg at 51.95% 49.81%, rgba(0, 255, 178, 0) -2.11deg, rgba(1, 180, 126, 0) 131.45deg, #7EF6B2 175.58deg, rgba(51, 255, 96, 0) 252.32deg, rgba(8, 182, 129, 0) 310.85deg, rgba(0, 255, 178, 0) 357.89deg, rgba(1, 180, 126, 0) 491.45deg);
  }

  &:after {
    content: '';
    position: absolute;
    z-index: -9;
    border-radius: 20px;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90.23deg, #04422f 0.28%, #0b231a 129.42%);
  }

  &:hover {
    &:before {
      background: conic-gradient(from 180deg at 51.95% 49.81%, rgba(0, 255, 178, 0) -2.11deg, rgba(1, 180, 126, 0) 131.45deg, #c7e7d4 175.58deg, rgba(51, 255, 96, 0) 252.32deg, rgba(8, 182, 129, 0) 310.85deg, rgba(0, 255, 178, 0) 357.89deg, rgba(1, 180, 126, 0) 491.45deg);
    }
  }
}

.v-popper__inner {
  overflow-y: visible !important;
}

.wallet_container:hover {
  cursor: pointer;
}

.account_icon {
  padding: 2px 7px;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  z-index: 2;

  &:before {
    content: '';
    position: absolute;
    z-index: -10;
    left: -1px;
    right: -1px;
    top: 1px;
    bottom: -1px;
    border-radius: 5px;
    background: conic-gradient(from 180deg at 51.95% 49.81%, rgba(1, 180, 126, 0) 0deg, #7EF6B2 118.33deg, rgba(51, 255, 96, 0) 270.21deg, rgba(8, 182, 129, 0) 311.46deg, rgba(0, 255, 178, 0) 357.89deg, rgba(1, 180, 126, 0) 360deg);

  }

  &:after {
    content: '';
    position: absolute;
    z-index: -9;
    border-radius: 5px;
    left: 0;
    width: 100%;
    height: 100%;
    background: #072b20;
  }
}

.account_icon:hover {
  background-color: #009065b2;
}

.network_item {
  display: flex;
  padding: 8px;
}

.network_item:hover {
  background: #009065b2;
  cursor: pointer;
  border-radius: 20px
}

.bell_container {

  cursor: pointer;
  margin-right: 10px;
  padding: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 17px;

  img {
    width: 24px;
  }
}

.bell_container:hover {
  border: 1px solid #009065;
}

.bell_icon {
  color: white;
}

.bell_container:hover .bell_icon {
  color: #009065;
}


@media (max-width: $md) {
  .sidemenu__btn {
    display: block;
    width: 36px;
    height: 36px;
    background: none;
    border: none;
    position: relative;
    z-index: 100;
    appearance: none;
    cursor: pointer;
    standard: none;

    span {
      display: block;
      width: 20px;
      height: 2px;
      margin: auto;
      background: white;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      transition: all .4s ease;
      border-radius: 10px;

      &.mid {
        width: 13px;
        margin-left: 8px;
      }

      &.top {
        transform: translateY(-8px);
      }

      &.bottom {
        transform: translateY(8px);
        width: 15px;
        margin-left: 8px;
      }
    }

    &.active {
      .top {

        transform: rotate(-45deg);
      }

      .mid {
        transform: translateX(-20px) rotate(360deg);
        opacity: 0;
      }

      .bottom {
        transform: rotate(45deg);
        width: 20px;
      }
    }

  }



  .header_main {
    padding-bottom: 5px
  }

  .header_main_container {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .header {
    border-bottom: none;
    padding: 10px;

    &-nav {
      width: 100%;

      display: flex;
      align-items: center;

      .nav-item {
        margin: 0;

        &:hover {
          background: transparent;
        }
      }
    }

    &-network-button {
      padding: 8px 8px;
      border-radius: 8px;
      color: #fff;
      font-size: 14px;

      &:hover {
        color: #fff;
      }
    }


    &-button {
      padding: 12px 16px;
      border-radius: 8px;
      color: #fff;
      font-size: 14px;

      &:hover {
        color: #fff;
      }
    }




  }
}


.badge {
  background: rgba(1, 180, 126, 1);
  margin-right: -20px;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  text-align: center;
  padding: 5%;
  position: relative;
  right: 16.8px;
  top: -3px;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-count {
  position: relative;
  color: white;
  font: bold 8px Helvetica, Verdana, Tahoma;
  text-align: center;


}
</style>
