<template>
  <MainCard>
    <div class="center_container dark:!bg-[#15151524] bg-white">
      <CRow class="mb-5">
        <div class="flex md:items-center items-start justify-between">
          <div class="md:w-auto w-[80%]">
            <div
              style="
                font-size: 20px;

                font-weight: 700;
                text-transform: uppercase;
              "
              class="dark:!text-white text-black"
            >
              {{ $t('Compounder') }}
            </div>
            <div style="font-size: 15px; color: #858c90; font-weight: 400">
              {{
                $t(
                  'The compounder is a feature designed to maximize your earnings by  reinvesting your rewards.',
                )
              }}
            </div>
          </div>
          <div class="back_button" @click="router.go(-1)">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18"
                stroke="#FFFFFF"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="#FFFFFF"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </CRow>
      <div class="flex justify-center gap-24 md:flex-row flex-col">
        <div class="flex flex-col gap-4 md:w-[25%] w-full">
          <ConfettiExplosion v-if="confettiVisible" :particleSize="8" :duration="5000"
          :colors="['#00E0FF', '#00c9ff', '#2E3191', '#41BBC7']" />
          <ComposePoolSteps :activeStep="activeStep" :isCompounder="true" />
        </div>
        <div class="compose_choose dark:!bg-[#DCEEF605] bg-white">
          <div class="compose_network_text">
            <!-- {{ DisplayNetwork[networkId] }} -->
            Coumpounder
          </div>
          <div class="compose_text dark:!text-white text-black my-1">
            {{ $t('Preview Compoundable Rewards') }}
          </div>

          <div>
            <div class="compose_third_step my-6 dark:!bg-[#DCEEF605] bg-white">
              <div class="compose_text dark:!text-white text-black">
                {{ $t('Compoundable Tokens') }}
              </div>
              <hr class="compose_hr" />
              <div>
                <div>
                  <!-- TokensData to actual pool tokens -->
                  <div
                    v-for="(token, index) in tokensData"
                    :key="`tokens-key-${index}`"
                    class="d-flex align-items-center justify-content-between pt-3 p-1 gap-2 compose_text dark:!text-white text-black"
                  >
                    <div class="d-flex align-items-center">
                      <img
                        :src="getTokenEntity(token.symbol, 'short').icon"
                        width="40"
                        class="p-1"
                      />
                      <div class="d-flex flex-column">
                        <div>0.0024 {{ token.symbol }}</div>
                      </div>
                    </div>
                    <div
                      class="d-flex flex-column align-items-end dark:!text-white text-black"
                    >
                      <div>$123,67</div>
                      <!-- <div>${{ token.usdAmount }}</div> -->
                    </div>
                  </div>
                </div>
                <!-- <hr class="compose_hr" /> -->
              </div>
            </div>
          </div>

          <div
            class="my-3 d-flex justify-content-center position-relative"
          >
            <div class="flex gap-1">
              <Step
                :activeStep="activeStep"
                :displayedActiveStep="1"
                :mmActive="mmActive"
                :stepText="'Claim'"
              />

              <div class="w-12 mt-1">
                <ProgressLoader v-if="mmActive && activeStep === 2" />
                <span v-else class="progress_loader_still"></span>
              </div>
              <Step
                :activeStep="activeStep"
                :displayedActiveStep="2"
                :mmActive="mmActive"
                :stepText="'Approve'"
                v-if="!tokensApproved"
              />
              <Step
                :activeStep="activeStep"
                :displayedActiveStep="1"
                :mmActive="mmActive"
                :stepText="'Approve'"
                v-else
              />
              <div class="w-12 mt-1">
                <ProgressLoader v-if="mmActive && activeStep === 3" />
                <span v-else class="progress_loader_still"></span>
              </div>
              <Step
                :activeStep="activeStep"
                :displayedActiveStep="3"
                :mmActive="mmActive"
                :stepText="'Deposit'"
              />
            </div>
          </div>

          <button
            class="compose_pool_connect_wallet"
            v-if="activeStep === 1"
            @click="onStep1Click"
          >
           {{mmActive ? 'Claiming...' : 'Claim'}} <span v-if="mmActive" class="button_loader pl-2"></span>
          </button>
          <div
            class="compose_pool_connect_wallet"
            v-else-if="activeStep === 2"
            @click="onStep2Click"
          >
            {{ mmActive ? 'Approving...' : $t('Approve Tokens') }}
            <span v-if="mmActive" class="button_loader pl-2"></span>
          </div>
          <div
            class="compose_pool_connect_wallet"
            v-else-if="activeStep === 3"
            @click="onStep3Click"
          >
            {{
              mmActive
                ?  $t('Depositing...')
                :'Deposit Tokens'
            }}
            <span v-if="mmActive" class="button_loader pl-2"></span>
          </div>
          <ConfettiExplosion v-if="confettiVisible" :particleSize="8" :duration="5000"
          :colors="['#00E0FF', '#00c9ff', '#2E3191', '#41BBC7']" />
        
        </div>
      </div>
    </div>
  </MainCard>
  <!-- <div class="" v-if="visibleNetworkModal && visibleNetworkModal != 'closed'">
    <Warning :NetworkUnsupported="NetworkUnsupported" :closable="true" @closeWarning="closeWarning"></Warning>
  </div> -->
  {{ console.log('activeStep', activeStep) }}
</template>

<script setup>
import router from '@/router'
import Step from '@/UI/Step.vue'
import ProgressLoader from '@/UI/ProgressLoader.vue'
import MainCard from '@/UI/MainCard.vue'
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import ComposePoolSteps from '@/components/ComposePool/ComposePoolSteps.vue'
import TokenPrices from '@/components/ComposePool/TokenPrices.vue'
import info from '@/assets/images/info.svg'
import Slider from '@vueform/slider'
import metamask from '@/assets/icons/approveTokenSteps/metamask.svg'
import TokenSelectModal from '@/components/modals/TokenSelectModal.vue'
import { getTokenEntity } from '@/lib/helpers/util'
import {
  GetPossibleComposeTokens,
  checkErc20,
} from '@/composables/poolActions/compose/usePossibleComposeTokens'
import { PoolCreatorService } from '@/services/pool-creator.service'
import { DisplayNetwork, networkId } from '@/composables/useNetwork'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { configService } from '@/services/config/config.service'
import { ethers } from 'ethers'
import { useApproveTokens } from '@/composables/poolActions/deposit/useApproveTokens'
import useBalance from '@/composables/useBalance'
import erc20abi from '@/lib/abi/ERC20.json'
import { GetFilteredTokenPrices } from '@/composables/useTokenPrices'
import { SingleSwap } from '@/composables/admin/swap/useSingleSwap'
import {
  generatePairCombinations,
  stringToColor,
  removeDuplicates,
  formatNotificationDate,
} from '@/lib/utils'
import { GetTokenPriceUsd } from '@/composables/balances/cryptocompare'
import { useJoinPool } from '@/composables/poolActions/deposit/useJoinPool'
import { GetDisplayStringError } from '@/lib/utils/balancer/helpers/displayError'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'
import 'vue3-toastify/dist/index.css'
import Modal from '@/UI/Modal.vue'
import { t } from 'i18next'
import ConfettiExplosion from 'vue-confetti-explosion'
import { useSound } from '@vueuse/sound'
import successSound from '@/assets/sounds/success_sound.mp3'
import errorSound from '@/assets/sounds/error_sound.mp3'

const playSuccess = useSound(successSound, { volume: 1 })
const playError = useSound(errorSound, { volume: 1 })
//import { InitBalancer } from '@/composables/math/withdrawMath/balancer.sdk';

const confettiVisible = ref(false)

const explode = async () => {
  confettiVisible.value = false
  await nextTick()
  confettiVisible.value = true
}

const possibleComposeTokens = ref([])
const autoOptimizeLiq = ref(true)
const mmActive = ref(false)
const visibleNetworkModal = ref(false)
const activeStep = ref(1)

const tokensApproved = ref(false)

const txHash = ref('')

function changeVisibleNetworkModal() {
  visibleNetworkModal.value = !visibleNetworkModal.value
}

const lineNumbers = ref([])
const formattedLineNumbers = computed(() =>
  lineNumbers.value.map((ln) => ln / 1000),
)

let lastDepositChanged = ref(0)

const usdValues = computed(() => {
  if (lineNumbers.value.length > 0) {
    return tokensData.value.map((t) => t.balance * (t.price > 0 ? t.price : 1))
  }
  return []
})
const leastBalanceIndex = computed(() => {
  const minValue = Math.min(...usdValues.value)
  return usdValues.value.indexOf(minValue)
})

const leastBalanceValue = computed(() => {
  if (usdValues.value.length > 0) {
    return usdValues.value[leastBalanceIndex.value]
  }
  return 0
})

const isOptimizeChanging = ref(false)

const popupType = ref('error')
const popupText = ref('Error happened!')
const popupSubText = ref('')
const popupLink = ref('')
const notify = () => {
  toast(Toast, {
    closeOnClick: true,
    theme: 'dark',
    type: popupType.value,
    autoClose: 5000,
    closeButton: false,
    position: toast.POSITION.TOP_RIGHT,
    data: {
      header_text: popupText.value,
      toast_text: popupSubText.value,
      tx_link: popupLink.value,
    },
  })
}
function SetErrorTxPopup(subtext) {
  popupType.value = 'error'
  popupText.value = 'Error happened!'
  popupSubText.value = subtext
  popupLink.value = ``
}
function SetSuccessTxPopup(hash, subtext) {
  let conf = configService.getNetworkConfig(networkId.value)
  popupType.value = 'success'
  popupText.value = 'Tx confirmed!'
  popupSubText.value = subtext
  popupLink.value = `${conf.explorer}/tx/${hash}`
}

function OnLineNumberChange(index) {
  if (isOptimizeChanging.value) {
    return
  }
  lastDepositChanged.value = index
  if (autoOptimizeLiq.value && tokensData.value.every((t) => t.price > 0)) {
    OptimizeValue()
  }
  isOptimizeChanging.value = false
}

function OptimizeValue() {
  if (lastDepositChanged.value == -1) return
  let token = tokensData.value[lastDepositChanged.value]
  let usdAmount =
    (lineNumbers.value[lastDepositChanged.value] / 1000) *
    (token.price > 0 ? token.price : 1)
  usdAmount = Math.min(usdAmount, leastBalanceValue.value)

  for (let i = 0; i < lineNumbers.value.length; i++) {
    let toOptimizeUsdAmount =
      (usdAmount / tokensData.value[lastDepositChanged.value].weight) *
      tokensData.value[i].weight
    let newValue =
      toOptimizeUsdAmount /
      (tokensData.value[i].price ? tokensData.value[i].price : 1)
    lineNumbers.value[i] = newValue * 1000
  }
}

function OnSliderValueChange(index, value) {
  console.log(value)
  let balance = tokensData.value[index].balance * 1000
  if (balance < value) {
    lineNumbers.value[index] = balance
  } else {
    lineNumbers.value[index] = value
  }
  console.log(lineNumbers.value[index] - balance)
  OnLineNumberChange(index)
}

const NetworkUnsupported = ref(false)
const networksSupported = ref(null)

const account = ref('')

onMounted(async () => {
  if (window.ethereum !== undefined && networkId.value > 0) {
    let provider = new ethers.providers.Web3Provider(window.ethereum)
    networksSupported.value = await provider.getNetwork()
  }

  if (
    window.ethereum === undefined ||
    window.ethereum?._state?.accounts?.length === 0 ||
    !localStorage.getItem('isConnectedToWeb3')
  ) {
    NetworkUnsupported.value = false
    changeVisibleNetworkModal()
  }
  console.log(networksSupported.value)
  if (
    window.ethereum !== undefined &&
    networkId.value > 0 &&
    window.ethereum?._state?.accounts?.length !== 0 &&
    networksSupported.value.chainId !== 42161 &&
    networksSupported.value.chainId !== 56 &&
    networksSupported.value.chainId !== 137
  ) {
    NetworkUnsupported.value = true
    changeVisibleNetworkModal()
    return
  }
  await InitTokens()
  account.value = await (await InitializeMetamask()).getSigner().getAddress()
})

const createdPoolId = ref('')

const poolCreationLink = ref('')

const tokensData = ref(
  possibleComposeTokens.value.length > 0
    ? [possibleComposeTokens.value[0]]
    : [],
)


const summarizedWeight = computed(() =>
  tokensData.value.reduce((sum, value) => sum + parseFloat(value.weight), 0),
)
const isPoolReady = computed(
  () =>
    tokensData.value.length > 1 &&
    summarizedWeight.value <= 100 &&
    ((tokensData.value.length % 2 == 1 && summarizedWeight.value >= 99) ||
      summarizedWeight.value == 100),
)
console.log('sum - ', summarizedWeight)
console.log('pool - ', isPoolReady)
watch(networkId, async () => {
  console.log('HERE' - networkId.value)

  networksSupported.value = { chainId: networkId.value }
  if (networkId.value <= 0) networksSupported.value = false
  else networksSupported.value = true
  await InitTokens()
})

async function InitTokens() {
  possibleComposeTokens.value = await GetPossibleComposeTokens(56)
  tokensData.value = [{ weight: 0, ...possibleComposeTokens.value[0] }]
  console.log('TOKENS DATA ', tokensData.value)
}

async function onStep1Click() {
  mmActive.value = true
  setTimeout(() => {
    mmActive.value = false
    activeStep.value = 2
  }, 1500);
}
async function onStep2Click() {
  mmActive.value = true
  setTimeout(() => {
    mmActive.value = false
    activeStep.value = 3
  }, 1500);
}
async function onStep3Click() {
  mmActive.value = true
  setTimeout(() => {
    mmActive.value = false
    explode()
    activeStep.value = 4
  }, 1500);
}



const existingTokenPrices = ref([])

watch(activeStep, async () => {
  if (activeStep.value === 4) {
    let addresses = tokensData.value.map((t) => t.address)
    existingTokenPrices.value = await GetFilteredTokenPrices(
      addresses,
      addresses,
    )
  }
})

const MIN_USD_SWAP = 0.01
const swaps = computed(() => {
  let _swaps = []
  if (activeStep.value === 4) {
    let addresses = tokensData.value.map((t) => t.address)
    let combinations = generatePairCombinations(addresses).map((t) =>
      t.split('/'),
    )
    combinations = combinations.filter(
      ([token0, token1]) =>
        !existingTokenPrices.value.find(
          (t) =>
            (t.pricingAsset == token0 && t.asset == token1) ||
            (t.pricingAsset == token1 && t.asset == token0),
        ),
    )
    _swaps = combinations.map(([token0, token1]) => {
      let token0Info = tokensData.value.find((t) => t.address == token0)
      let token1Info = tokensData.value.find((t) => t.address == token1)
      return {
        fromToken: token0Info,
        toToken: token1Info,
        amountIn: (MIN_USD_SWAP / token0Info.price).toFixed(
          token0Info.decimals,
        ),
        amountOut: (MIN_USD_SWAP / token1Info.price).toFixed(
          token1Info.decimals,
        ),
      }
    })
  }
  return _swaps
})
const finishedSwaps = ref([])

function setTxError(e) {
  let errorCode = e.error.data.message
  SetErrorTxPopup(GetDisplayStringError(errorCode))
}
</script>

<style lang="scss" scoped>
.center_container {
  // background: #15151524;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  margin: 1% 10% 10% 10%;
  padding: 2.5%;
  border-radius: 16px;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    margin: 0%;
  }
}

.compose_choose {
  height: fit-content;
  padding: 10px;
  width: 35%;
  border-radius: 16px;
  // background: #DCEEF605;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  @media (max-width: 768px) {
    margin-top: 24px;
    width: 100%;
  }
}

.modal_total_container {
  border-radius: 15px;
  font-size: clamp(10px, 0.8vw, 14px);
  background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
}

.compose_hr {
  border-bottom: 1px solid #00e1ff50;
  margin: 0px;
  margin-top: 5px;
  margin-right: -10px;
  margin-left: -10px;
}

.token-input {
  background-color: transparent;
  border: none;
  outline: none;
}

.compose_third_step {
  padding: 10px;
  width: 100%;
  height: fit-content;
  border-radius: 16px;
  // background: #DCEEF605;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
}

.compose_chart {
  padding: 10px;
  width: 25%;
  height: fit-content;
  border-radius: 16px;
  // background: #DCEEF605;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  @media (max-width: 768px) {
    margin-top: 24px;
    width: 100%;
  }
}

.chart_container {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0px;
  // border-radius: 20px;
  padding: 5px 0px;
  height: 260px;

  // :deep(.apexcharts-inner) {
  //   filter: drop-shadow(0 0 0.3rem #00C9FF);
  // }
}

.add_token_btn {
  padding: 4px 16px;
  background: none;
  border: 1px solid #00e0ff;
  border-radius: 16px;
  font-size: clamp(10px, 0.8vw, 14px);
  font-weight: 400;
  letter-spacing: -0.4000000059604645px;
  text-align: center;
  color: #00e0ff;
  background: #02031c;
}

.add_token_btn:hover {
  filter: drop-shadow(0 0 0.3rem #00c9ff);
  cursor: pointer;
  background: linear-gradient(89deg, #00c9ff 1.58%, #0094ff 100.04%);
  color: white;
}

.compose_choose_inner_container {
  padding: 10px;
  width: 100%;
  border-radius: 16px;
  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
}

.compose_network_text {
  font-size: 9px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  color: #b6b6b6;
}

.compose_text {
  font-size: clamp(11px, 0.8vw, 15px);
  // color: white;
}

.compose_token_btn {
  display: flex;
  align-items: center;
  border-radius: 8px;
  font-size: clamp(11px, 0.8vw, 15px);
  // color: white;
  padding: 10px;
  height: 30px;
  border-radius: 16px;
  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
}

.compose_token_btn:hover {
  cursor: pointer;
  opacity: 0.9;
}

.modal_stake_token {
  border-radius: 20px;
  padding: 15px;
  background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
}

.modal_balance_slider {
  margin-top: 20px;
  color: white;
  font-size: clamp(10px, 0.8vw, 14px);
  display: flex;
  justify-content: space-between;
}

.modal_stake_token_inner_name {
  background-color: rgba(59, 97, 65, 0.14);
  border-radius: 17px;
  color: white;
  font-size: clamp(10px, 0.8vw, 14px);
  padding: 4px 12px;
}

.circle_active {
  stroke: #00c9ff;
}

.weight_input {
  background: none;
  outline: none;
  border: none;
}

.delete_token:hover svg path {
  stroke: rgb(253, 24, 24);
}

.back_button {
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background: #dceef605;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  border: 1px solid #ffffff0d;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
