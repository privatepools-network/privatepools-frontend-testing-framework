<template>
  <CHeader position="static" :class="isHeaderBg ? 'header_main header_main_bg' : 'header_main'" ref="headRef">
    <CContainer fluid class="header_container">
      <!-- <CHeaderNav v-if="width > 768" class="d-flex me-auto">
        <AppBreadcrumb :title="true" />
      </CHeaderNav> -->

      <div class="d-flex align-items-center gap-4">
        <div @click="router.push('/dashboard')" :class="router.currentRoute.value.path === '/dashboard'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
          ">
          Home
        </div>
        <div @click="router.push('/pools')" :class="router.currentRoute.value.path === '/pools'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
          ">
          Pools
        </div>
        <div @click="router.push('/portfolio')" :class="router.currentRoute.value.path === '/portfolio'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
          ">
          Portfolio
        </div>
      </div>

      <div style="position: relative; cursor: text">
        <vue-select v-model="tokens" :options="tokensOptions" label-by="label" searchable
          search-placeholder="Search tokens and liquidity pools" placeholder="Search tokens and liquidity pools">
          <template #dropdown-item="{ option }">
            <div class="p-2 d-flex align-items-center justify-content-between gap-2" @click="reloadPage">
              <div class="d-flex align-items-center gap-2">
                <img :src="getTokenEntity(option.img, 'short').icon" width="38" />
                <div class="d-flex flex-column">
                  <div style="font-size: 12px; color: #ffffff">
                    {{ option.label }}
                  </div>
                  <div style="font-size: 10px; color: #8e8e8e">
                    {{ option.img }}
                  </div>
                </div>
              </div>
              <div>
                <div class="d-flex flex-column align-items-end">
                  <div style="font-size: 12px; color: #ffffff">
                    {{ option.price }}
                  </div>
                  <div style="font-size: 10px; color: #8e8e8e" class="d-flex align-items-center gap-1">
                    <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_74_4052)">
                        <path
                          d="M5.44288 3.82129C5.75064 4.35474 5.36567 5.02152 4.74981 5.02172L1.60344 5.02356C0.986982 5.02415 0.601322 4.3566 0.909584 3.82268L2.48436 1.09508C2.79262 0.561153 3.56357 0.561368 3.87129 1.09553L5.44288 3.82129Z"
                          fill="#40B66B" />
                      </g>
                      <defs>
                        <clipPath id="clip0_74_4052">
                          <rect width="5.12436" height="5.12436" fill="white"
                            transform="translate(4.4375 7) rotate(-150)" />
                        </clipPath>
                      </defs>
                    </svg>
                    {{ option.percentChange }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </vue-select>
        <div style="position: absolute; left: 7px; top: 6px; color: #858c90">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.9417 17.0583L14.7408 13.8575C15.8108 12.5883 16.4583 10.9525 16.4583 9.16667C16.4583 5.14583 13.1875 1.875 9.16667 1.875C5.14583 1.875 1.875 5.14583 1.875 9.16667C1.875 13.1875 5.14583 16.4583 9.16667 16.4583C10.9525 16.4583 12.5883 15.8108 13.8575 14.7408L17.0583 17.9417C17.18 18.0633 17.34 18.125 17.5 18.125C17.66 18.125 17.82 18.0642 17.9417 17.9417C18.1858 17.6983 18.1858 17.3025 17.9417 17.0583ZM3.125 9.16667C3.125 5.835 5.835 3.125 9.16667 3.125C12.4983 3.125 15.2083 5.835 15.2083 9.16667C15.2083 12.4983 12.4983 15.2083 9.16667 15.2083C5.835 15.2083 3.125 12.4983 3.125 9.16667Z"
              fill="#9B9B9B" />
          </svg>
        </div>
        <div style="position: absolute; right: 12px; top: 7px; color: #7d7d7d">
          <svg width="5" height="12" viewBox="0 0 5 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.35511 0.863636L1.54261 11.3125H0.191761L3.00426 0.863636H4.35511Z" fill="#7D7D7D" />
          </svg>
        </div>
      </div>

      <div>
        <div class="connect_wallet" @click="$emit('toggleSidebar')">
          {{ address && address != '' ? computedAddress : 'Connect' }}
        </div>
      </div>
    </CContainer>
  </CHeader>
</template>

<script setup>
// import AppBreadcrumb from './AppBreadcrumb'
// import polygon from '@/assets/images/networks/polygon.png'
// import arbitrum from '@/assets/images/networks/arbitrum.png'
// import binance from '@/assets/images/networks/binance.png'
import router from '@/router'
import { getTokenEntity } from '@/lib/helpers/util'

// import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'
import { computed, onMounted, ref, watch, defineEmits } from 'vue'
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
import {
  Network,
  ReversedDisplayNetwork,
  networkId,
  setNetworkId,
} from '@/composables/useNetwork'
import { ethers } from 'ethers'
import { setMetamaskProvider } from '@/composables/useMetamaskProvider'
import { useStore } from 'vuex'
import { useDevice } from '@/composables/adaptive/useDevice'
import SidebarMobile from '@/components/SidebarMobile'
import { capitalizeFirstLetter } from '@/lib/utils/index'
import { configService } from '@/services/config/config.service'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'
import VueSelect from 'vue-next-select'
import 'vue-next-select/dist/index.css'

import 'vue3-toastify/dist/index.css'
var emitter = require('tiny-emitter/instance')

defineEmits(['toggleSidebar'])

const { width } = useDevice()
function reloadPage() {
  window.location.reload()
}
const tokens = ref(null)

const tokensOptions = ref([
  {
    label: 'Bitcoin',
    img: 'BTC',
    price: '$51000',
    percentChange: '5.1%',
  },
  {
    label: 'Ethereum',
    img: 'ETH',
    price: '$2700',
    percentChange: '2.1%',
  },
  {
    label: 'Arbitrum',
    img: 'ARB',
    price: '$1.89',
    percentChange: '1.1%',
  },
  {
    label: 'Solana',
    img: 'SOL',
    price: '$115.54',
    percentChange: '11.1%',
  },
])

const isHeaderBg = ref(false)

const headRef = ref(null) // obtain the reference
onMounted(() => {
  window.addEventListener('scroll', () => {
    var curr = window.pageYOffset

    // You can style header-bg for style purpose

    if (curr >= 50) {
      isHeaderBg.value = true
    } else {
      isHeaderBg.value = false
    }
  })
})

const notify = (popupType, popupText, popupSubText) => {
  toast(Toast, {
    closeOnClick: true,
    theme: 'dark',
    type: popupType,
    autoClose: 5000,
    closeButton: false,
    position: toast.POSITION.TOP_RIGHT,
    data: {
      header_text: popupText,
      toast_text: popupSubText,
    },
  })
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
        } else {
          network.current = false
        }
      }
      if (!isConnectedToExistingChain) {
        notify(
          'error',
          'Wrong chain',
          'Please connect to one of the available chains',
        )
      }
    }
  },
)
const TWO_MINUTES_INTERVAL = 1000 * 60 * 2

if (window.Worker) {
  const myWorker = new Worker(new URL('@/worker', import.meta.url), {
    type: 'module',
  })
  setInterval(
    () =>
      myWorker.postMessage({
        method: 'update',
        data: JSON.parse(localStorage.getItem('notifications')) || '[]',
      }),
    TWO_MINUTES_INTERVAL,
  )
  emitter.on('addNotification', (notification) => {
    myWorker.postMessage({
      method: 'add',
      data: {
        all_notifications: JSON.parse(
          localStorage.getItem('notifications') || '[]',
        ),
        newNotification: notification,
      },
    })
  })

  myWorker.onmessage = function (e) {
    let newNotifications = e.data.filter(
      (item1) =>
        !clearedNotifications.value.some(
          (item2) => item2.hash && item2.hash === item1.hash,
        ),
    )

    localStorage.setItem('notifications', JSON.stringify(newNotifications))
    notifications.value = newNotifications
    console.log('Message received from worker')
  }
}
const notifications = ref(
  JSON.parse(localStorage.getItem('notifications')) || [],
)

const networksList = ref(
  [
    process.env.VUE_APP_KEY_ARBITRUM
      ? {
        name: 'Arbitrum',
        chainId: '0xa4b1',
        decimalChainId: 42161,
        image: arbitrum_network,
        current: false,
      }
      : undefined,
    process.env.VUE_APP_KEY_BINANCE
      ? {
        name: 'Binance',
        chainId: '0x38',
        decimalChainId: 56,
        image: binance_network,
        current: false,
      }
      : undefined,
    process.env.VUE_APP_KEY_POLYGON
      ? {
        name: 'Polygon',
        chainId: '0x89',
        decimalChainId: 137,
        image: polygon_network,
        current: false,
      }
      : undefined,
  ].filter((item) => item != undefined),
)

onMounted(async () => {
  isMetamaskSupported.value = window.ethereum !== undefined
  if (isMetamaskSupported.value) {
    let _isConnected = localStorage.getItem('isConnectedToWeb3')
    window.ethereum?._state?.accounts?.length !== 0 && _isConnected
      ? connectWallet()
      : ''
    if (!_isConnected) {
      notify(
        'warning',
        'Wallet is not connected',
        'Please connect your wallet via Metamask',
      )
    }
  } else {
    notify(
      'error',
      'Metamask is not installed!',
      'Please install Metamask browser extension.',
    )
  }
})

// eslint-disable-next-line
function getNotificationLink(notification) {
  if (!notification.network) return '#'
  let config = configService.getNetworkConfig(
    ReversedDisplayNetwork[capitalizeFirstLetter(notification.network)],
  )
  return `${config.explorer}/tx/${notification.hash}`
}

async function connectWallet() {
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(async (res) => {
      // Request MetaMask to connect
      await window.ethereum.enable()
      let provider = new ethers.providers.Web3Provider(window.ethereum)
      setMetamaskProvider(provider)
      const network = await provider.getNetwork()

      isConnectedToWeb3.value = true
      localStorage.setItem('isConnectedToWeb3', true)

      // isConnectedToWeb3LocalStorage = true

      // console.log('res', res)
      const walletData = res
      accountData.value = walletData
      address.value = walletData[0]
      console.log(address.value)
      ethereumNetwork.value = network
      store.dispatch('setCurrentNetwork', network)
      localStorage.setItem('ethereumNetwork', JSON.stringify(network))

      console.log(
        window.ethereum.networkVersion,
        'window.ethereum.networkVersion',
      )
      setNetworkId(network.chainId)
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('accountsChanged', function (accounts) {
        address.value = accounts[0]
        localStorage.setItem("account", address.value)
      })
    })
    .catch((err) => {
      console.log(err)
      notify(
        'warning',
        'Wallet is not connected',
        'Please connect your wallet via Metamask',
      )
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
    method: 'eth_requestAccounts',
    params: [{ eth_accounts: {} }],
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
  align-items: center !important;
}

.header_main {
  position: sticky;
  top: 0;
  z-index: 12;
  margin-top: 10px;
  margin-bottom: 10px;

  &_bg {
    background: linear-gradient(356.2deg,
        rgba(0, 29, 37, 0.755) 0%,
        #000000 105.42%) !important;
    -webkit-backdrop-filter: blur(60px);
    backdrop-filter: blur(60px);
  }
}

.header_main_container {
  display: flex;
}

.right_sidebar {
  display: flex;
}

.header {
  border-bottom: none;
  padding: 16px 33px 16px 33px;
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
    box-shadow: 0px 6px 30px 0px #0000001f;
    box-shadow: 0px 16px 24px 0px #00000024;
    background: radial-gradient(50% 50% at 26.04% 40.42%,
        rgba(0, 201, 255, 0.13) 0%,
        rgba(0, 201, 255, 0) 100%);
    background-color: #1f1f1f;
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
    box-shadow: 0px 6px 30px 0px #0000001f;
    box-shadow: 0px 16px 24px 0px #00000024;
    background: radial-gradient(50% 50% at 26.04% 40.42%,
        rgba(0, 201, 255, 0.13) 0%,
        rgba(0, 201, 255, 0) 100%);
    background-color: #1f1f1f;
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
        background: conic-gradient(from 180deg at 51.95% 49.81%,
            rgba(0, 255, 178, 0) -2.11deg,
            rgba(1, 180, 126, 0) 131.45deg,
            #7ef6b2 175.58deg,
            rgba(51, 255, 96, 0) 252.32deg,
            rgba(8, 182, 129, 0) 310.85deg,
            rgba(0, 255, 178, 0) 357.89deg,
            rgba(1, 180, 126, 0) 491.45deg);
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
        background: conic-gradient(from 180deg at 51.95% 49.81%,
            rgba(1, 180, 126, 0) 0deg,
            #7ef6b2 148.33deg,
            rgba(8, 182, 129, 0) 225.21deg,
            rgba(51, 255, 96, 0) 268.33deg,
            rgba(0, 255, 178, 0) 357.89deg,
            rgba(1, 180, 126, 0) 360deg);
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
          background: conic-gradient(from 180deg at 51.95% 49.81%,
              rgba(1, 180, 126, 0) 0deg,
              #c6ffdf 148.33deg,
              rgba(8, 182, 129, 0) 225.21deg,
              rgba(51, 255, 96, 0) 268.33deg,
              rgba(0, 255, 178, 0) 357.89deg,
              rgba(1, 180, 126, 0) 360deg);
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
    background: conic-gradient(from 180deg at 51.95% 49.81%,
        rgba(0, 255, 178, 0) -2.11deg,
        rgba(1, 180, 126, 0) 131.45deg,
        #7ef6b2 175.58deg,
        rgba(51, 255, 96, 0) 252.32deg,
        rgba(8, 182, 129, 0) 310.85deg,
        rgba(0, 255, 178, 0) 357.89deg,
        rgba(1, 180, 126, 0) 491.45deg);
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
      background: conic-gradient(from 180deg at 51.95% 49.81%,
          rgba(0, 255, 178, 0) -2.11deg,
          rgba(1, 180, 126, 0) 131.45deg,
          #c7e7d4 175.58deg,
          rgba(51, 255, 96, 0) 252.32deg,
          rgba(8, 182, 129, 0) 310.85deg,
          rgba(0, 255, 178, 0) 357.89deg,
          rgba(1, 180, 126, 0) 491.45deg);
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
    background: conic-gradient(from 180deg at 51.95% 49.81%,
        rgba(1, 180, 126, 0) 0deg,
        #7ef6b2 118.33deg,
        rgba(51, 255, 96, 0) 270.21deg,
        rgba(8, 182, 129, 0) 311.46deg,
        rgba(0, 255, 178, 0) 357.89deg,
        rgba(1, 180, 126, 0) 360deg);
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
  border-radius: 20px;
}

.bell_container {
  cursor: pointer;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 12px;
  border-radius: 8px;
  box-shadow: 0 8px 10px 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 6px 30px 0 rgba(0, 0, 0, 0.122);
  box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0.141);
  background: radial-gradient(50% 50% at 26.04% 40.42%,
      rgba(0, 201, 255, 0.13) 0,
      rgba(0, 201, 255, 0) 100%);
  background-color: #1f1f1f;
  color: #fff;

  img {
    width: 24px;
  }
}

.bell_container:hover {
  background: radial-gradient(50% 50% at 26.04% 40.42%,
      rgba(0, 201, 255, 0.13) 0,
      rgba(0, 201, 255, 0) 100%);
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
      transition: all 0.4s ease;
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
    padding-bottom: 5px;
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
  background: #00c9ff;
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

.navigation_text {
  font-family: Inter;
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0em;
  text-align: center;
  color: #7d7d7d;

  &:hover {
    color: #2abdff;
    cursor: pointer;
  }

  &_selected {
    background: -webkit-linear-gradient(#2775ca, #2abdff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 0.7rem #00c9ff);
  }
}

.arrow-downward {
  display: none !important;
}

.vue-select {
  background: linear-gradient(0deg, #090909, #090909),
    linear-gradient(0deg, rgba(115, 115, 115, 0.06), rgba(115, 115, 115, 0.06));
  border: 1px solid #222222c9;
  border-radius: 16px;
  width: 400px;

  &:hover {
    border: 1px solid #00c8ffb7;
    filter: drop-shadow(0 0 0.3rem #00c8ff63);
  }
}

.vue-input {
  padding-left: 35px;
  font-family: Inter;
  font-size: 15px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0em;
  color: #7d7d7d;
  height: 38px;
}

.vue-input input {
  background: transparent;
  color: white;
}

.vue-dropdown {
  background: #090909;
  border: 1px solid #222222c9;
  color: white;
}

.vue-dropdown-item.highlighted {
  background: #00c8ff59;
}

.vue-dropdown-item.selected.highlighted {
  background: #00c8ff59;
}

.vue-dropdown-item.selected {
  background: transparent;
}

.vue-select[data-is-focusing='false'][aria-disabled='false'] .vue-input input,
input[readonly] {
  cursor: text;
}

.connect_wallet {
  border-radius: 16px;
  background: linear-gradient(0deg, #090909, #090909),
    linear-gradient(0deg, rgba(42, 189, 255, 0.62), rgba(42, 189, 255, 0.62));
  border: 1px solid #2abdff9e;
  box-shadow: 0px 4px 4px 0px #2abdff40;
  color: #2abdff;
  font-family: Inter;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: center;
  padding: 10px 20px;

  &:hover {
    background: #2abdff;
    color: white;
    cursor: pointer;
  }
}
</style>
