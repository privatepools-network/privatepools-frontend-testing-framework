<template>
  <div style="height: 92%;">
    <div class="d-flex align-items-center justify-content-between">
      <div class="sidebar_header text-black dark:!text-white">Connect wallet</div>
      <div class="sidebar_settings_icon" @click="$emit('toggleSettings')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.9502 8.78334C13.9835 8.53334 14.0002 8.275 14.0002 8C14.0002 7.73334 13.9835 7.46667 13.9419 7.21667L15.6335 5.9C15.7064 5.83992 15.7563 5.75642 15.7745 5.66372C15.7927 5.57103 15.7783 5.47489 15.7335 5.39167L14.1335 2.625C14.0864 2.54131 14.0112 2.47698 13.9212 2.44343C13.8312 2.40987 13.7323 2.40925 13.6419 2.44167L11.6502 3.24167C11.2335 2.925 10.7919 2.65834 10.3002 2.45834L10.0002 0.341669C9.98546 0.246277 9.93698 0.159342 9.86358 0.0966492C9.79018 0.0339567 9.69674 -0.000334587 9.60021 2.46116e-06H6.40021C6.20021 2.46116e-06 6.04188 0.141669 6.00855 0.341669L5.70855 2.45834C5.21688 2.65834 4.76688 2.93334 4.35855 3.24167L2.36688 2.44167C2.18355 2.375 1.97521 2.44167 1.87521 2.625L0.283548 5.39167C0.183548 5.56667 0.216881 5.78334 0.383547 5.9L2.07521 7.21667C2.03355 7.46667 2.00021 7.74167 2.00021 8C2.00021 8.25834 2.01688 8.53334 2.05855 8.78334L0.366881 10.1C0.293984 10.1601 0.244176 10.2436 0.225941 10.3363C0.207707 10.429 0.222175 10.5251 0.266881 10.6083L1.86688 13.375C1.96688 13.5583 2.17521 13.6167 2.35855 13.5583L4.35021 12.7583C4.76688 13.075 5.20855 13.3417 5.70021 13.5417L6.00021 15.6583C6.04188 15.8583 6.20021 16 6.40021 16H9.60021C9.80021 16 9.96688 15.8583 9.99188 15.6583L10.2919 13.5417C10.7835 13.3417 11.2335 13.075 11.6419 12.7583L13.6335 13.5583C13.8169 13.625 14.0252 13.5583 14.1252 13.375L15.7252 10.6083C15.8252 10.425 15.7835 10.2167 15.6252 10.1L13.9502 8.78334ZM8.00021 11C6.35021 11 5.00021 9.65 5.00021 8C5.00021 6.35 6.35021 5 8.00021 5C9.65021 5 11.0002 6.35 11.0002 8C11.0002 9.65 9.65021 11 8.00021 11Z"
            fill="#797676" />
        </svg>
      </div>
    </div>
    <div class="d-flex flex-column justify-content-between h-100 gap-3 mt-3">
      <div class="wallet_container_sidebar bg-white dark:!bg-[#10101099] hover:!bg-[#1313134d]" @click="connectWallet(true)">
        <div><img :src="metamask" width="40" /></div>
        <div class="wallet_text">MetaMask</div>
      </div>
      <div class="wallet_bottom_text">
        By connecting a wallet, you agree to Private Pools <a class="wallet_link">Terms of Service</a> and consent to its
        <a class="wallet_link">Privacy Policy.</a>
      </div>
    </div>
  </div>
</template>
<script setup>
import metamask from '@/assets/images/metamask.png'
import { defineEmits, ref, onMounted } from 'vue'
import { setMetamaskProvider } from '@/composables/useMetamaskProvider'
import { ethers } from "ethers";
import { useStore } from 'vuex'
import { setNetworkId } from '@/composables/useNetwork';
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'

import 'vue3-toastify/dist/index.css'
const store = useStore()
const emit = defineEmits(['toggleSettings', "toggleSidebar", 'setAddress'])


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

const address = ref(null)
async function connectWallet(called_by_user = false) {
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(async (res) => {
      // Request MetaMask to connect
      await window.ethereum.enable()
      let provider = new ethers.providers.Web3Provider(window.ethereum)
      setMetamaskProvider(provider)
      const network = await provider.getNetwork()
      localStorage.setItem('isConnectedToWeb3', true)
      localStorage.setItem('address', res[0])
      // isConnectedToWeb3LocalStorage = true

      store.dispatch('setCurrentNetwork', network)
      localStorage.setItem('ethereumNetwork', JSON.stringify(network))
      console.log(res[0])
      console.log(
        window.ethereum.networkVersion,
        'window.ethereum.networkVersion',
      )
      emit("setAddress", res[0])
      console.log("HERE")
      setNetworkId(network.chainId)
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('accountsChanged', function (accounts) {
        address.value = accounts[0]
        localStorage.setItem("account", address.value)
      })
      if (called_by_user)
        emit('toggleSidebar')
    })
    .catch((err) => {
      localStorage.removeItem("account")
      console.error(err)
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


</script>
<style lang="scss" scoped>
.sidebar_header {
  font-family: Inter;
  font-size: 14px;
  font-weight: 600;
  line-height: 44px;
  letter-spacing: 0px;
  // color: #ffffff;
}

.sidebar_settings_icon {
  cursor: pointer;
}

.sidebar_settings_icon:hover svg path {
  fill: #00c9ff;
}

.wallet_container_sidebar {
  // background: #10101099;
  border-radius: 20px;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 15px 22px;

  &:hover {
    cursor: pointer;
    background: #1313134d;

  }
}

.wallet_text {
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  color: #717A8C;
}

.wallet_bottom_text {
  font-family: Inter;
  font-size: 13px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  color: #747474;
}

.wallet_link {
  cursor: pointer;
  text-decoration: underline;
  color: #747474;

}
</style>
