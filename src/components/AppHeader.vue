<template>
  <CHeader
    position="static"
    :class="
      isHeaderBg
        ? `header_main ${isDark ? 'header_main_bg' : 'header_main_bg-white'} `
        : 'header_main'
    "
    ref="headRef"
  >
    <CContainer fluid class="header_container">
      <HeaderNavigation :address="address" />

      <HeaderSearchbar
        :selectOptions="selectOptions"
        :handleInput="handleInput"
        :searchInput="searchInput"
      />

      <div v-if="!address">
        <div class="connect_wallet" @click="$emit('toggleSidebar')">
          <!-- <svg
          class="blink-1"
            width="22"
            height="22"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="16" fill="#FF9B40" fill-opacity="0.2" />
            <circle cx="16" cy="16" r="6" fill="#FF9B40" />
          </svg> -->
          <span class="pulse_orange"></span>
          {{ $t('connect') }}
        </div>
      </div>
      <div
        v-else-if="address && address !== ''"
        class="d-flex align-items-center gap-2"
      >
        <RewardsDropdown />
        <!-- <TokenDropdown /> -->

        <div
          class="wallet_address dark:!bg-[#02031C] bg-[#DCEEF6] text-black dark:!text-white"
          @click="$emit('toggleSidebar')"
        >
          <span class="pulse_green"></span>
          {{ computedAddress }}
        </div>
      </div>
    </CContainer>
  </CHeader>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
  watch,
  defineEmits,
  defineProps,
  toRefs,
watchEffect,
} from 'vue'
import HeaderNavigation from '@/components/Header/HeaderNavigation.vue'
import HeaderSearchbar from '@/components/Header/HeaderSearchbar.vue'
import RewardsDropdown from '@/components/Header/RewardsDropdown.vue'
import TokenDropdown from '@/components/Header/TokenDropdown.vue'
import binance_network from '@/assets/icons/networks/binance.svg'
import arbitrum_network from '@/assets/icons/networks/arbitrum.svg'
import polygon_network from '@/assets/icons/networks/polygon.svg'
import connectWalletIcon from '@/assets/icons/sidebarIcons/connectWalletIcon.svg'
import { Network, setNetworkId } from '@/composables/useNetwork'
import { ethers } from 'ethers'
import { setMetamaskProvider } from '@/composables/useMetamaskProvider'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'
import 'vue3-toastify/dist/index.css'
import { useDark } from '@vueuse/core'
import { getHeaderData } from '@/composables/data/headerData'
const isDark = useDark()

const emit = defineEmits(['toggleSidebar', 'setAddress'])
const props = defineProps(['address'])
const topTradedTokens = ref([])
const topPools = ref([])
const visibleOptions = ref(null)
const tokensOptions = computed(() => {
  let result = []
  result.push({
    firstToken: true,
    id: 'a b c d e f g h i j k l m n o p q r s t u v w x y z',
  })
  result.push(
    ...topTradedTokens.value.map((item) => ({
      id: `${item.name} ${item.symbol}`,
      label: item.name,
      img: item.symbol,
      price: `${item.price.toFixed(2)}$`,
      price_ETH: `${item.price_ETH.toFixed(5)} ETH`,
      price_BTC: `${item.price_BTC.toFixed(5)} BTC`,
      percentChange: `${item.priceChange.toFixed(2)}%`,
      tokens: true,
    })),
  )
  result.push({
    firstPool: true,
    id: 'a b c d e f g h i j k l m n o p q r s t u v w x y z',
  })
  result.push(
    ...topPools.value.map((item) => ({
      id: `${item.tokens.map((token) => token.symbol).join('/')} ${item.type}`,
      poolId: item.id,
      chainId: item.chainId,
      type: item.type,
      label: item.type,
      img: item.tokens.map((token) => token.symbol),
      desc: item.tokens.map((token) => token.symbol).join('/'),
      percentChange: '0%',
      price: `${parseFloat(item.totalLiquidity).toFixed(2)}$`,
      price_ETH: `${parseFloat(item.totalLiquidity_ETH).toFixed(5)} ETH`,
      price_BTC: `${parseFloat(item.totalLiquidity_BTC).toFixed(5)} BTC`,
      pools: true,
    })),
  )
  return result
})

const visibleOptionsComputed = computed(() => {
  if (tokensOptions.value.length <= 2) {
    return []
  }
  let result = tokensOptions.value.slice(0, 3)
  let index = tokensOptions.value.findIndex((item) => item.firstPool)
  result.push(...tokensOptions.value.slice(index, index + 3))
  return result
})

const selectOptions = computed(() =>
  visibleOptions.value ? visibleOptions.value : tokensOptions.value,
)

watch(visibleOptionsComputed, () => {
  if (visibleOptionsComputed.value)
    visibleOptions.value = [...visibleOptionsComputed.value]
})

const isHeaderBg = ref(false)

const networks = [
  process.env.VUE_APP_KEY_ARBITRUM ? Network.ARBITRUM : undefined,
  process.env.VUE_APP_KEY_BINANCE ? Network.BINANCE : undefined,
  process.env.VUE_APP_KEY_POLYGON ? Network.POLYGON : undefined,
].filter((n) => n != undefined)

const headRef = ref(null) // obtain the reference

onMounted(async () => {
  window.addEventListener('scroll', () => {
    var curr = window.pageYOffset

    if (curr >= 50) {
      isHeaderBg.value = true
    } else {
      isHeaderBg.value = false
    }
  })
  const data = await getHeaderData(56)
  topTradedTokens.value = data.search.tokens
  topPools.value = data.search.pools
})

const searchInput = ref('')
function handleInput(event) {
  searchInput.value = event.target.value
  let _search = searchInput.value.toLowerCase()
  visibleOptions.value = searchInput.value
    ? [
        ...tokensOptions.value.filter((item) =>
          checkInputSearchItem(_search, item),
        ),
      ]
    : [...visibleOptionsComputed.value]
}

function checkInputSearchItem(_search, item) {
  if (item.firstPool || item.firstToken) return true

  let result =
    (item.desc && item.desc.toLowerCase().includes(_search)) ||
    (item.label && item.label.toLowerCase().includes(_search))
  return result
}

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
      tx_link: '',
      speedUp: '',
    },
  })
}

const isMetamaskSupported = ref(false)
const isConnectedToWeb3 = ref(localStorage.getItem('isConnectedToWeb3'))
const accountData = ref()
const ethereumNetwork = ref('')

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
  console.log('MM SUPPORTED - ', isMetamaskSupported)
  if (isMetamaskSupported.value) {
    await connectWallet()
  } else {
    notify(
      'error',
      'Metamask is not installed!',
      'Please install Metamask browser extension.',
    )
  }
})
let provider = new ethers.providers.Web3Provider(window.ethereum)

async function connectWallet() {
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(async (res) => {
      // Request MetaMask to connect
      await window.ethereum.enable()
      setMetamaskProvider(provider)
      const network = await provider.getNetwork()

      isConnectedToWeb3.value = true
      localStorage.setItem('isConnectedToWeb3', true)

      // isConnectedToWeb3LocalStorage = true

      // console.log('res', res)
      console.log(res)
      const walletData = res
      accountData.value = walletData
      emit('setAddress', res[0])
      console.log('APP HEADER')
      ethereumNetwork.value = network

      localStorage.setItem('ethereumNetwork', JSON.stringify(network))

      console.log(
        window.ethereum.networkVersion,
        'window.ethereum.networkVersion',
      )
      setNetworkId(network.chainId)
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('accountsChanged', function (accounts) {
        emit('setAddress', accounts[0])
        localStorage.setItem('account', accounts[0])
      })
    })
    .catch((err) => {
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
  console.log('newNetwork.chainId!!!', newNetwork.chainId)
  window.location.reload()
}

const computedAddress = computed(() =>
  props.address
    ? props.address.substring(0, 6) +
      '....' +
      props.address.substring(props.address.length - 4)
    : '',
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
  margin-bottom: 10px;
  background: #0c0c0cbe;
  backdrop-filter: blur(10px);
  &_bg {
    background: #0c0c0c3d;
    backdrop-filter: blur(10px);
  }

  &_bg-white {
    background: linear-gradient(
      356.2deg,
      rgba(221, 221, 221, 0.955) 0%,
      #ffffff 105.42%
    ) !important;
    // -webkit-backdrop-filter: blur(60px);
    // backdrop-filter: blur(60px);
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
  z-index: 100;

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
    background: radial-gradient(
      50% 50% at 26.04% 40.42%,
      rgba(0, 201, 255, 0.13) 0%,
      rgba(0, 201, 255, 0) 100%
    );
    background-color: #1f1f1f;
    color: #fff;
    font-size: 14px;
    font-family: 'Montserrat';

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
    background: radial-gradient(
      50% 50% at 26.04% 40.42%,
      rgba(0, 201, 255, 0.13) 0%,
      rgba(0, 201, 255, 0) 100%
    );
    background-color: #1f1f1f;
    color: #fff;
    font-size: 14px;
    font-family: 'Montserrat';

    &:hover {
      color: #fff;
    }
  }

  &__popup {
    width: 200px;
    border-radius: 16px;
    box-shadow: 0px 4px 8.9px 0px #02031cb5;

    z-index: 1000;
    display: flex;
    flex-direction: column;
    border: 0.5px solid #dceef60d;
    padding: 13px 8px;
    color: #fff;
    position: relative;
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
        background: conic-gradient(
          from 180deg at 51.95% 49.81%,
          rgba(0, 255, 178, 0) -2.11deg,
          rgba(1, 180, 126, 0) 131.45deg,
          #7ef6b2 175.58deg,
          rgba(51, 255, 96, 0) 252.32deg,
          rgba(8, 182, 129, 0) 310.85deg,
          rgba(0, 255, 178, 0) 357.89deg,
          rgba(1, 180, 126, 0) 491.45deg
        );
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
        background: conic-gradient(
          from 180deg at 51.95% 49.81%,
          rgba(1, 180, 126, 0) 0deg,
          #7ef6b2 148.33deg,
          rgba(8, 182, 129, 0) 225.21deg,
          rgba(51, 255, 96, 0) 268.33deg,
          rgba(0, 255, 178, 0) 357.89deg,
          rgba(1, 180, 126, 0) 360deg
        );
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
          background: conic-gradient(
            from 180deg at 51.95% 49.81%,
            rgba(1, 180, 126, 0) 0deg,
            #c6ffdf 148.33deg,
            rgba(8, 182, 129, 0) 225.21deg,
            rgba(51, 255, 96, 0) 268.33deg,
            rgba(0, 255, 178, 0) 357.89deg,
            rgba(1, 180, 126, 0) 360deg
          );
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
    background: conic-gradient(
      from 180deg at 51.95% 49.81%,
      rgba(0, 255, 178, 0) -2.11deg,
      rgba(1, 180, 126, 0) 131.45deg,
      #7ef6b2 175.58deg,
      rgba(51, 255, 96, 0) 252.32deg,
      rgba(8, 182, 129, 0) 310.85deg,
      rgba(0, 255, 178, 0) 357.89deg,
      rgba(1, 180, 126, 0) 491.45deg
    );
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
      background: conic-gradient(
        from 180deg at 51.95% 49.81%,
        rgba(0, 255, 178, 0) -2.11deg,
        rgba(1, 180, 126, 0) 131.45deg,
        #c7e7d4 175.58deg,
        rgba(51, 255, 96, 0) 252.32deg,
        rgba(8, 182, 129, 0) 310.85deg,
        rgba(0, 255, 178, 0) 357.89deg,
        rgba(1, 180, 126, 0) 491.45deg
      );
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
    background: conic-gradient(
      from 180deg at 51.95% 49.81%,
      rgba(1, 180, 126, 0) 0deg,
      #7ef6b2 118.33deg,
      rgba(51, 255, 96, 0) 270.21deg,
      rgba(8, 182, 129, 0) 311.46deg,
      rgba(0, 255, 178, 0) 357.89deg,
      rgba(1, 180, 126, 0) 360deg
    );
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

@media (max-width: $md) {
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

.arrow-downward {
  display: none !important;
}

.vue-select {
  // background: linear-gradient(0deg, #090909, #090909),
  //   linear-gradient(0deg, rgba(115, 115, 115, 0.06), rgba(115, 115, 115, 0.06));
  // background: #171717;
  border: 1px solid #22222273;
  border-radius: 20px;
  width: 500px;

  @media (max-width: 1300px) {
    width: 370px;
  }

  &:hover {
    // border: 1px solid #00c8ffb7;
    // filter: drop-shadow(0 0 0.3rem #00c8ff63);
  }
}

.vue-input {
  padding-left: 35px;

  font-size: clamp(10px, 0.8vw, 15px);
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0em;
  color: #7d7d7d;
  height: 38px;
}

.vue-input input {
  background: transparent;
  // color: white;
}
.vue-input input::placeholder {
  background: transparent;
  color: transparent;
}
.vue-dropdown {
  // background: #171717;
  background: linear-gradient(356.2deg, #02031c, #000000 105.42%);

  border: 1px solid #222222c9;
  // color: white;
  // -webkit-backdrop-filter: blur(50px);
  // backdrop-filter: blur(50px);
}

/* Scrollbar */
.vue-dropdown::-webkit-scrollbar {
  height: 0px;
  width: 4px;
}

.vue-dropdown::-webkit-scrollbar {
  background: transparent;
}

.vue-dropdown::-webkit-scrollbar-thumb {
  background-color: #00e0ff9e;
  border-radius: 8px;
}

.vue-dropdown-item.highlighted {
  background: #99a1bd14;
}

.vue-dropdown-item.selected.highlighted {
  background: #00c8ff13;
}

.vue-dropdown-item.selected {
  background: transparent;
}

.vue-select[data-is-focusing='false'][aria-disabled='false'] .vue-input input,
input[readonly] {
  cursor: text;
}

.search_groups {
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
  letter-spacing: 0em;
  // color: #7d7d7d;
  padding: 8px;
}

.connect_wallet {
  display: flex;
  align-items: center;
  gap: 6px;

  border-radius: 100px;
  // background: linear-gradient(0deg, #090909, #090909),
  //   linear-gradient(0deg, rgba(42, 189, 255, 0.62), rgba(42, 189, 255, 0.62));
  border: 1px solid #fb800f;
  // box-shadow: 0px 4px 4px 0px #fb800f;
  color: #ff9b40;
  //
  font-size: clamp(10px, 0.8vw, 15px);
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: center;
  padding: 10px 20px;

  &:hover {
    // background: #00e0ff;
    color: white;
    cursor: pointer;
  }
}

.wallet_address {
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

  &:hover {
    background: #2abcff36;

    cursor: pointer;
  }
}

.pair_avatars_manage_pool {
  width: 38px;
  margin-right: -18px;
}
</style>
