<template>
  <div class="h-[100vh] w-[100vw] terms_bg" v-if="signatureState">
    <div
      class="bg-[#02031C] rounded-[50px] text-[white] p-8 md:w-[40%] w-[100%]"
    >
      <div v-if="!signatureInProcess">
        <div @click="signatureState = false" class="w-full flex justify-end cursor-pointer"><img :src="close_modal_icon"></div>
        <div class="xl:text-[18px] text-[14px] font-semibold text-center mb-4">
          Terms & Conditions
        </div>
        <div class="xl:text-[13px] text-[10px] mb-4">
          By connecting a wallet, you acknowledge that you have read and
          understand the Private Pools Network
          <a class="text-[#00E0FF]">Protocol Disclaimer.</a>
        </div>
        <div
          class="bg-[#4545451F] rounded-[35px] text-[#C6C6C6] xl:text-[13px] text-[10px] p-6"
        >
          <div class="terms_text pr-2">
            <p>On-Chain Disclaimer for Early Users and Testers</p>
            <p>
              By interacting with this platform, you acknowledge and agree to
              the following terms and conditions:
            </p>
            <p>
              Use at Your Own Risk: This platform is provided on an "as is" and
              "as available" basis. It has not undergone any formal security
              audit. You are solely responsible for any risks associated with
              using this platform, including but not limited to the risk of loss
              of funds.
            </p>
            <p>
              No Liability: The developers, contributors, and affiliated parties
              of this platform shall not be held liable for any direct,
              indirect, incidental, special, consequential, or punitive damages,
              including but not limited to loss of funds, data, use, or other
              intangibles, arising out of or in connection with your use of the
              platform.
            </p>
            <p>
              No licensed activities or services. The platform allows you to
              interact with decentralized technologies under your own volition
              and at your own risk. The use of the platform is made outside any
              financial services or advice.
            </p>
            <p>
              Acceptance of Risk: By using this platform, you agree that you
              understand the experimental nature of the software and that you
              are fully aware of the risks involved. You accept full
              responsibility for any and all outcomes resulting from your use of
              the platform.
            </p>
            <p>
              No Warranties: There are no warranties or guarantees provided with
              this platform, either express or implied, including but not
              limited to warranties of merchantability, fitness for a particular
              purpose, or non-infringement.
            </p>
            <p>
              Assumption of Loss: You acknowledge that there is a possibility of
              significant financial loss when using this platform. You agree to
              hold harmless and indemnify the developers, contributors, and
              affiliated parties from any claims or damages resulting from your
              use of the platform.
            </p>
            <p>
              User Responsibility: You are responsible for conducting your own
              due diligence and understanding the risks before interacting with
              the platform. You should not use this platform unless you can
              afford to lose your entire investment.
            </p>
            <p>
              By proceeding to use this platform, you indicate that you have
              read, understood, and agreed to these terms and conditions.
            </p>
          </div>
        </div>
        <div
          class="referrals_button"
          @click="address ? signatureStart(address) : connectWallet()"
        >
          {{ address ? 'Sign and proceed' : 'Connect your wallet' }}
        </div>
      </div>
      <div v-else>
        <div class="xl:text-[18px] text-[14px] font-semibold text-center mb-4">
          Sign Terms & Conditions
        </div>
        <div class="flex items-center justify-center py-8">
          <span class="signature_loader"></span>
        </div>
        <div class="xl:text-[13px] text-[10px] mb-4 text-center">
          Please, sign meessage in your wallet. Signing is free and will not
          send a transaction.
        </div>
        <!-- <div class="referrals_button" 
        @click="signatureState = false"
        >
          Close
        </div> -->
      </div>
    </div>
  </div>

  <CHeader
    position="sticky"
    :class="
      isHeaderBg
        ? `header_main ${isDark ? 'header_main_bg' : 'header_main_bg-white'} `
        : 'header_main'
    "
    ref="headRef"
  >
    <CContainer fluid class="header_container">
      <HeaderNavigation
        :address="address"
        @toggleNavigation="toggleNavigation"
      />

      <HeaderSearchbar
        v-if="width > 768"
        :selectOptions="selectOptions"
        :handleInput="handleInput"
        :searchInput="searchInput"
      />

      <div v-if="!address" class="flex items-center gap-4">
        <!-- Search without connection don't have sense pools will be broken -->
        <!-- <div v-if="width < 768">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.9417 17.0583L14.7408 13.8575C15.8108 12.5883 16.4583 10.9525 16.4583 9.16667C16.4583 5.14583 13.1875 1.875 9.16667 1.875C5.14583 1.875 1.875 5.14583 1.875 9.16667C1.875 13.1875 5.14583 16.4583 9.16667 16.4583C10.9525 16.4583 12.5883 15.8108 13.8575 14.7408L17.0583 17.9417C17.18 18.0633 17.34 18.125 17.5 18.125C17.66 18.125 17.82 18.0642 17.9417 17.9417C18.1858 17.6983 18.1858 17.3025 17.9417 17.0583ZM3.125 9.16667C3.125 5.835 5.835 3.125 9.16667 3.125C12.4983 3.125 15.2083 5.835 15.2083 9.16667C15.2083 12.4983 12.4983 15.2083 9.16667 15.2083C5.835 15.2083 3.125 12.4983 3.125 9.16667Z"
              fill="#9B9B9B"
            />
          </svg>
        </div> -->
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
          <VTooltip :distance="0" :placement="'top'">
            <div style="cursor: help">
              <span
                :class="
                  status === null
                    ? 'pulse_white'
                    : status
                    ? 'pulse_green'
                    : 'pulse_orange'
                "
              ></span>
            </div>
            <template #popper>
              <div class="tooltip_container">
                <div
                  style="font-size: clamp(10px, 0.9vw, 16px)"
                  class="flex items-center gap-2"
                >
                  {{ console.log('status', status) }}
                  {{ $t('Trading engine Status') }}
                  <span
                    :class="
                      status === null
                        ? 'pulse_white'
                        : status
                        ? 'pulse_green'
                        : 'pulse_orange'
                    "
                  ></span>
                </div>
                <div class="tooltip_container_text mt-1">
                  <p v-if="status">
                    Everything is functioning normally. The trading engine is
                    operational.
                  </p>
                  <p v-else>
                    The trading engine is currently unavailable. We are aware of
                    the issue and are actively working to restore service. We
                    apologize for any inconvenience and appreciate your
                    patience.
                  </p>
                </div>
              </div>
            </template>
          </VTooltip>
          {{ $t('connect') }}
        </div>
      </div>
      <div
        v-else-if="address && address !== ''"
        class="d-flex align-items-center gap-2"
      >
        <div
          v-if="width < 768"
          @click="toggleSearhbarMobile"
          class="mobile_container"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.9417 17.0583L14.7408 13.8575C15.8108 12.5883 16.4583 10.9525 16.4583 9.16667C16.4583 5.14583 13.1875 1.875 9.16667 1.875C5.14583 1.875 1.875 5.14583 1.875 9.16667C1.875 13.1875 5.14583 16.4583 9.16667 16.4583C10.9525 16.4583 12.5883 15.8108 13.8575 14.7408L17.0583 17.9417C17.18 18.0633 17.34 18.125 17.5 18.125C17.66 18.125 17.82 18.0642 17.9417 17.9417C18.1858 17.6983 18.1858 17.3025 17.9417 17.0583ZM3.125 9.16667C3.125 5.835 5.835 3.125 9.16667 3.125C12.4983 3.125 15.2083 5.835 15.2083 9.16667C15.2083 12.4983 12.4983 15.2083 9.16667 15.2083C5.835 15.2083 3.125 12.4983 3.125 9.16667Z"
              fill="#9B9B9B"
            />
          </svg>
        </div>
        <RewardsDropdown />
        <!-- <TokenDropdown /> -->

        <div
          v-if="width > 768"
          class="wallet_address text-black dark:!text-white"
          @click="$emit('toggleSidebar')"
        >
          <VTooltip :distance="0" :placement="'top'">
            <div style="cursor: help">
              <span
                :class="
                  status === null
                    ? 'pulse_white'
                    : status
                    ? 'pulse_green'
                    : 'pulse_orange'
                "
              ></span>
            </div>
            <template #popper>
              <div class="tooltip_container">
                <div
                  style="font-size: clamp(10px, 0.9vw, 16px)"
                  class="flex items-center gap-2"
                >
                  {{ console.log('status', status) }}
                  {{ $t('Trading engine Status') }}
                  <span
                    :class="
                      status === null
                        ? 'pulse_white'
                        : status
                        ? 'pulse_green'
                        : 'pulse_orange'
                    "
                  ></span>
                </div>
                <div class="tooltip_container_text mt-1">
                  <p v-if="status">
                    Everything is functioning normally. The trading engine is
                    operational.
                  </p>
                  <p v-else>
                    The trading engine is currently unavailable. We are aware of
                    the issue and are actively working to restore service. We
                    apologize for any inconvenience and appreciate your
                    patience.
                  </p>
                </div>
              </div>
            </template>
          </VTooltip>

          {{ computedAddress }}

          <img :src="binance_network"/>
        </div>
        <div
          v-else
          class="mobile_wallet_container"
          @click="$emit('toggleSidebar')"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.41667 6.77087C4.62654 6.77087 3.86878 7.08475 3.31008 7.64345C2.75138 8.20215 2.4375 8.95992 2.4375 9.75004V19.5C2.4375 20.2902 2.75138 21.0479 3.31008 21.6066C3.86878 22.1653 4.62654 22.4792 5.41667 22.4792H20.5833C21.3735 22.4792 22.1312 22.1653 22.6899 21.6066C23.2486 21.0479 23.5625 20.2902 23.5625 19.5V9.75004C23.5625 8.95992 23.2486 8.20215 22.6899 7.64345C22.1312 7.08475 21.3735 6.77087 20.5833 6.77087H5.41667ZM17.875 13.2709C17.5159 13.2709 17.1714 13.4135 16.9175 13.6675C16.6635 13.9215 16.5208 14.2659 16.5208 14.625C16.5208 14.9842 16.6635 15.3286 16.9175 15.5826C17.1714 15.8365 17.5159 15.9792 17.875 15.9792C18.2341 15.9792 18.5786 15.8365 18.8325 15.5826C19.0865 15.3286 19.2292 14.9842 19.2292 14.625C19.2292 14.2659 19.0865 13.9215 18.8325 13.6675C18.5786 13.4135 18.2341 13.2709 17.875 13.2709Z"
              fill="#00DC3E"
            />
            <path
              d="M17.8588 3.32477C18.1795 3.2393 18.5156 3.22866 18.8411 3.29369C19.1666 3.35872 19.4729 3.49768 19.7362 3.69983C19.9994 3.90198 20.2128 4.16193 20.3597 4.45961C20.5065 4.75729 20.5831 5.08474 20.5833 5.41669H9.75L17.8588 3.32477Z"
              fill="#00DC3E"
            />
          </svg>
        </div>
      </div>
    </CContainer>

    <SidebarMobile
      :sidebarVisible="sidebarVisible"
      @toggleNavigation="toggleNavigation"
    />
    <SearchbarMobile
      :searchbarVisible="searchbarVisible"
      @toggleSearhbarMobile="toggleSearhbarMobile"
      :selectOptions="selectOptions"
      :handleInput="handleInput"
      :searchInput="searchInput"
    />
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
import binance_network from '@/assets/images/networks/binance.svg'
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
import { getStatus } from '@/composables/data/statusData'
import { useDevice } from '@/composables/adaptive/useDevice'
import MobileNavigation from '@/components/Header/MobileNavigation.vue'
import SidebarMobile from './SidebarMobile.vue'
import SearchbarMobile from './SearchbarMobile.vue'
import close_modal_icon from '@/assets/icons/arrow/close_modal_icon.svg'

const isDark = useDark()
const { width } = useDevice()

const emit = defineEmits(['toggleSidebar', 'setAddress'])
const props = defineProps(['address'])
const topTradedTokens = ref([])
const topPools = ref([])
const visibleOptions = ref([])

const signatureState = ref(localStorage.getItem('signature') ? false : true)
const signatureInProcess = ref(false)

const sidebarVisible = ref(false)
const searchbarVisible = ref(false)

function toggleNavigation() {
  sidebarVisible.value = !sidebarVisible.value
}
function toggleSearhbarMobile() {
  searchbarVisible.value = !searchbarVisible.value
}

const tokensOptions = computed(() => {
  let result = []
  result.push({
    firstToken: true,
    id: 'a b c d e f g h i j k l m n o p q r s t u v w x y z',
  })
  result.push(
    ...topTradedTokens.value.map((item) => ({
      id: `${item.name} ${item.symbol} ${item.address}`,
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
      id: `${item.tokens.map((token) => token.symbol).join('/')} ${item.type} ${
        item.address
      }`,
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
  visibleOptions.value.length ? visibleOptions.value : tokensOptions.value,
)

watchEffect(() => {
  const visibleOptionsComputedValue = visibleOptionsComputed.value
  if (visibleOptionsComputedValue)
    visibleOptions.value = [...visibleOptionsComputedValue]
})

watchEffect(() => {
  console.log('signatureState', signatureState.value)

  document.body.style.overflow = signatureState.value ? 'hidden' : 'auto'
})

const isHeaderBg = ref(false)

const networks = [
  process.env.VUE_APP_KEY_ARBITRUM ? Network.ARBITRUM : undefined,
  process.env.VUE_APP_KEY_BINANCE ? Network.BINANCE : undefined,
  process.env.VUE_APP_KEY_POLYGON ? Network.POLYGON : undefined,
].filter((n) => n != undefined)

const headRef = ref(null) // obtain the reference
const status = ref(null)
onMounted(async () => {
  window.addEventListener('scroll', () => {
    var curr = window.pageYOffset

    if (curr >= 50) {
      isHeaderBg.value = true
    } else {
      isHeaderBg.value = false
    }
  })
  status.value = await getStatus()
  const data = await getHeaderData(56)
  topTradedTokens.value = data.search.tokens
  topPools.value = data.search.pools
})

const searchInput = ref('')
function handleInput(event) {
  searchInput.value = event.target.value
  let _search = searchInput.value.toLowerCase()
  visibleOptions.value = searchInput.value
    ? tokensOptions.value.filter((item) => checkInputSearchItem(_search, item))
    : [...visibleOptionsComputed.value]
}

function checkInputSearchItem(_search, item) {
  if (item.firstPool || item.firstToken) return true

  return (
    (item.desc && item.desc.toLowerCase().includes(_search)) ||
    (item.label && item.label.toLowerCase().includes(_search)) ||
    (item.id && item.id.toLowerCase().includes(_search))
  )
}

const notify = (popupType, popupText, popupSubText) => {
  toast(Toast, {
    closeOnClick: true,
    theme: 'dark',
    type: popupType,
    autoClose: 5000,
    closeButton: true,
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

async function signatureStart(accountData) {
  signatureInProcess.value = true
  await requestSignature(accountData)
}

onMounted(async () => {
  isMetamaskSupported.value = window.ethereum !== undefined
  console.log('MM SUPPORTED - ', isMetamaskSupported)

  const hasRabby = window.ethereum && window.ethereum.isRabby;
  const hasMetamask = window.ethereum && !window.ethereum.isRabby;
  const hasBrave = window.ethereum && window.ethereum.isBraveWallet; 
  const hasCoinbaseWallet = window.ethereum && window.ethereum.isCoinbaseWallet;

  if (hasCoinbaseWallet) {
    console.log('Coinbase Wallet detected');
    await connectCoinbaseWallet();
  }
  else if (hasBrave) {
    console.log('Brave Wallet detected');
    await connectBraveWallet();
  } else if (hasRabby) {
    console.log('Rabby Wallet detected');
    await connectRabbyWallet();
  } else if (hasMetamask) {
    console.log('MetaMask detected');
    await connectWallet();
  } else {
    notify(
      'error',
      'No Wallet Detected!',
      'Please install Brave Wallet, Rabby Wallet, Coinbase Wallet or MetaMask.',
    );
  }
});

// Create a message to be signed
function createMessage(userAddress) {
  const message = `Welcome to Private Pools!\n\nClick to sign in and accept the Private Pools Network Protocol Disclaimer (https://privatepools-shared-version.vercel.app/protocol_disclaimer)\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address:\n${userAddress}
  `
  return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message))
}

// Request signature
async function requestSignature(userAddress) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const messageHash = createMessage(userAddress)

  try {
    const signature = await signer.signMessage(
      ethers.utils.arrayify(messageHash),
    )
    localStorage.setItem('signature', JSON.stringify(signature))
    signatureState.value = false
    console.log(`Signature: ${signature}`)
    // You can now send the signature to your backend or use it as needed
  } catch (error) {
    console.error('Failed to sign message', error)
  }
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
      console.log(res)
      const walletData = res
      accountData.value = walletData
      emit('setAddress', res[0])
      console.log('accountData', accountData)
      ethereumNetwork.value = network

      localStorage.setItem('ethereumNetwork', JSON.stringify(network))

      console.log(
        window.ethereum.networkVersion,
        'window.ethereum.networkVersion',
      )
      setNetworkId(network.chainId)
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('accountsChanged', handleAccountsChanged)
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

async function connectRabbyWallet() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    const network = await provider.getNetwork();

    isConnectedToWeb3.value = true;
    localStorage.setItem('isConnectedToWeb3', true);

    setMetamaskProvider(provider);
    accountData.value = accounts;
    emit('setAddress', accounts[0]);
    ethereumNetwork.value = network;
    setNetworkId(network.chainId);

    notify('success', 'Rabby Wallet Connected!', `Connected account: ${accounts[0]}`);
  } catch (err) {
    console.error('Failed to connect Rabby Wallet', err);
    notify('error', 'Connection Failed', 'Unable to connect Rabby Wallet.');
  }
}


async function connectBraveWallet() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    const network = await provider.getNetwork();

    isConnectedToWeb3.value = true;
    localStorage.setItem('isConnectedToWeb3', true);

    setMetamaskProvider(provider); // Use the same logic as MetaMask to set the provider
    accountData.value = accounts;
    emit('setAddress', accounts[0]);
    ethereumNetwork.value = network;
    setNetworkId(network.chainId);

    notify('success', 'Brave Wallet Connected!', `Connected account: ${accounts[0]}`);
  } catch (err) {
    console.error('Failed to connect Brave Wallet', err);
    notify('error', 'Connection Failed', 'Unable to connect Brave Wallet.');
  }
}


async function connectCoinbaseWallet() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    const network = await provider.getNetwork();

    isConnectedToWeb3.value = true;
    localStorage.setItem('isConnectedToWeb3', true);

    setMetamaskProvider(provider);  
    accountData.value = accounts;
    emit('setAddress', accounts[0]);
    ethereumNetwork.value = network;
    
    localStorage.setItem('ethereumNetwork', JSON.stringify(network));
    console.log('Coinbase Wallet connected:', accounts[0]);

    notify('success', 'Coinbase Wallet Connected!', `Connected account: ${accounts[0]}`);
  } catch (err) {
    console.error('Failed to connect Coinbase Wallet', err);
    notify('error', 'Connection Failed', 'Unable to connect Coinbase Wallet.');
  }
}


function handleAccountsChanged(accounts) {
  emit('setAddress', accounts[0])
  localStorage.setItem('account', accounts[0])

  // Trigger new signature request
  requestSignature(accounts[0])
  window.location.reload()
}

async function handleChainChanged() {
  let provider = new ethers.providers.Web3Provider(window.ethereum)
  const newNetwork = await provider.getNetwork()
  setNetworkId(newNetwork.chainId)
  const network = await provider.getNetwork()
  localStorage.setItem('ethereumNetwork', JSON.stringify(network))
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
  @media (min-width: 2000px) {
        padding: 1.3rem 15% !important;
}
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
.header.header-sticky {
  position: sticky;
  top: 0;
  z-index: 999 !important;
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
.referrals_button {
  width: 100%;
  cursor: pointer;
  margin-top: 25px;
  margin-bottom: 5px;
  border-radius: 16px;

  font-size: 15px;
  font-weight: 600;
  line-height: 24px;
  color: #02031c;
  text-align: center;
  padding: 6px;
  background: #00e0ff;

  &:hover {
    filter: drop-shadow(0 0 0.7rem #00e0ff);
  }
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

  @media (max-width: 768px) {
    width: 100%;
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
  background: linear-gradient(240.2deg, #007688, #02031c 65.42%);

  border: 1px solid #222222c9;

  // color: white;
  // -webkit-backdrop-filter: blur(50px);
  // backdrop-filter: blur(50px);
  @media (max-width: 768px) {
    max-height: 500px !important;
  }
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

.mobile_container {
  background: #02031c;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mobile_wallet_container {
  background: #00dc3e33;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
