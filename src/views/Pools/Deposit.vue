<template>
  <MainCard>
    <ZapperModal
      :is-open="isZapperModalOpen"
      :from-amounts="fromAmounts"
      :to-amounts="toAmounts"
      :trade-tokens="
        pool?.tokens?.filter((token) => token.address !== zapToken.address)
      "
      :slippage-selected="slippageSelected"
      :zap-token="zapToken"
      @on-close="isZapperModalOpen = false"
      @on-accept-trade="onAcceptTrade"
    />

    <TokenSelectModal
      :is-open="isTokenSelectModalOpen"
      :possible-tokens="possibleTokens"
      @close="isTokenSelectModalOpen = false"
      @update-token="(token) => (zapToken = token)"
    />

    <div class="center_container dark:!bg-[#15151524] bg-white">
      <CRow class="mb-4">
        <div class="flex md:items-center items-start justify-between">
          <div class="caption-row">
            <div
              class="caption dark:!text-white text-black"
              style="font-size: clamp(10px, 0.9vw, 16px); font-weight: 700"
            >
              {{ pool?.tokens?.map((item) => item.symbol).join('/') }}
            </div>

            <div class="flex flex-wrap">
              <div
                v-for="(token, index) in pool?.tokens"
                :key="`pool-token-${index}`"
                class="big-chip dark:!bg-[#00000024] bg-white"
              >
                <CAvatar
                  :src="getTokenEntity(token.symbol, 'short').icon"
                  class="big-chip__image"
                />
                <div class="big-chip__text dark:!text-white text-black">
                  {{ token.symbol }}
                </div>
                <div class="big-chip__text dark:!text-white text-black">
                  {{ (token.weight * 100).toFixed(0) }}%
                </div>
              </div>
            </div>
          </div>
          <div class="back_button" @click="router.go(-1)">
            <img :src="CloseIcon" />
          </div>
        </div>
      </CRow>

      <!-- Loader -->
      <div
        v-if="Object.keys(balances).length === 0"
        class="my-24 flex justify-center items-center"
      >
        <BigLogoLoader />
      </div>
      <div v-else>
        <div class="flex justify-center md:flex-row flex-col gap-5">
          <div class="deposit_choose dark:!bg-[#00000024] bg-white">
            <div class="dark:!text-white text-black my-1">
              <div
                v-if="approveStep !== 5"
                class="flex items-center justify-between p-2"
                @click="approveStep !== 0 && approveStep--"
              >
                <div class="flex items-center gap-2">
                  <img
                    :src="ArrowBackIcon"
                    class="w-2 cursor-pointer"
                    v-if="approveStep !== 0"
                  />
                  <div class="text-[14px] text-white">Add Liquidity</div>
                </div>
                <div v-if="approveStep === 0" class="flex items-center gap-2">
                  <DepositMethodToggle
                    :deposit-method="depositMethod"
                    @toggle="(value) => (depositMethod = value)"
                  />

                  <DepositSlippageDropdown
                    :slippage-text="slippageSelected"
                    :slippage-value="slippage"
                    @change-slippage="
                      (text, value) => (
                        (slippageSelected = text),
                        value !== '-'
                          ? (slippage = value)
                          : (slippage = undefined)
                      )
                    "
                  />
                </div>
              </div>
            </div>
            <div v-if="approveStep === 0">
              <div
                class="d-flex flex-column gap-2"
                v-if="
                  balances != {} &&
                  lastTokenPrices != {} &&
                  lineNumbers.length > 0
                "
              >
                <div
                  v-if="depositMethod == 'zap'"
                  class="modal_stake_token dark:!bg-[#15151524] bg-white mb-4"
                >
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div
                      @click="() => tokenSelectModalOpen()"
                      class="d-flex flex-column gap-2"
                    >
                      <div
                        class="text-[14px] mb-0 dark:!text-white text-black flex items-center gap-1"
                      >
                        <img
                          :src="getTokenEntity(zapToken.symbol, 'short').icon"
                          width="18"
                        />
                        <span style="margin-left: 5px">
                          {{ zapToken.symbol }}
                        </span>
                        <img :src="ArrowDownIcon" />
                      </div>
                    </div>
                    <input
                      class="token-input dark:!text-[#A8A8A8] text-black font-['Roboto_Mono',_monospace]"
                      style="
                        font-size: clamp(10px, 0.8vw, 14px);
                        font-weight: 500;
                        text-align: right;
                      "
                      :value="zapToken.value"
                      @input="
                        (e) =>
                          (zapToken.value =
                            e.target.value > zapToken.balance
                              ? zapToken.balance
                              : e.target.value)
                      "
                      type="number"
                    />
                  </div>
                  <div>
                    <div
                      class="modal_balance_slider dark:!text-white text-black"
                    >
                      <div
                        class="value-label font-['Roboto_Mono',_monospace]"
                        ref="inputRefLabel"
                      >
                        {{ $t('balance') }}:
                        <span class="fw-bold font-['Roboto_Mono',_monospace]">
                          {{
                            zapToken.value >= zapToken.balance
                              ? 0
                              : zapToken.balance - zapToken.value
                          }}
                        </span>
                        <span
                          @click="() => (zapToken.value = zapToken.balance)"
                          class="fw-bold bg-transparent pl-1 cursor-pointer"
                        >
                          {{ $t('max') }}
                        </span>
                      </div>
                      <div class="font-['Roboto_Mono',_monospace]">
                        {{ currencySelected.symbol }}
                        {{ (zapToken.value * zapToken.price).toFixed(3) }}
                      </div>
                    </div>
                    <Slider
                      class="mt-2"
                      :tooltips="false"
                      :min="0"
                      :max="zapToken.balance"
                      :step="zapToken.balance / 100"
                      :lazy="false"
                      v-model="zapToken.value"
                    />
                  </div>
                </div>
                <div v-else>
                  <div
                    class="d-flex justify-content-between dark:!bg-[#00000024] bg-white currency_container"
                  >
                    <CurrencySelector
                      @updateCurrency="
                        (newCurrency) => (currencySelected = newCurrency)
                      "
                    />
                    <input
                      class="token-input dark:!text-[#A8A8A8] text-black font-['Roboto_Mono',_monospace]"
                      style="
                        font-size: clamp(10px, 0.8vw, 14px);
                        font-weight: 500;
                        text-align: right;
                      "
                      type="tel"
                      :placeholder="0"
                      @input="(e) => onCurrencyInput(e)"
                    />
                  </div>

                  <div
                    class="modal_stake_token dark:!bg-[#15151524] bg-white mb-2"
                    v-for="(token, tokenIndex) in pool?.tokens"
                    :key="`deposit-token-${token.address}`"
                  >
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <div
                        class="modal_stake_token_inner_name dark:!text-white text-black dark:!bg-[#4c4c4c24] bg-white"
                      >
                        <img
                          :src="getTokenEntity(token.symbol, 'short').icon"
                          width="20"
                        />
                        {{ token.symbol }}
                        {{ (token.weight * 100).toFixed(0) }}%
                      </div>
                      <input
                        class="token-input dark:!text-[#A8A8A8] text-black font-['Roboto_Mono',_monospace]"
                        style="
                          font-size: clamp(10px, 0.8vw, 14px);
                          font-weight: 500;
                          text-align: right;
                        "
                        :value="
                          lineNumbers[tokenIndex] > 0
                            ? lineNumbers[tokenIndex] / 1000
                            : lineNumbers[tokenIndex]
                        "
                        @input="(e) => onTokenInput(e, tokenIndex)"
                        type="number"
                      />
                    </div>
                    <div
                      class="modal_balance_slider dark:!text-white text-black"
                    >
                      <div
                        class="value-label font-['Roboto_Mono',_monospace]"
                        ref="inputRefLabel"
                      >
                        {{ $t('balance') }}:
                        <span class="fw-bold font-['Roboto_Mono',_monospace]">
                          {{ RemainingBalance(token, tokenIndex) }}
                        </span>
                        <span
                          @click="() => OnMaxClick(tokenIndex, token.address)"
                          class="fw-bold bg-transparent pl-1"
                          style="cursor: pointer"
                        >
                          {{ $t('max') }}
                        </span>
                      </div>
                      <div class="font-['Roboto_Mono',_monospace]">
                        {{ currencySelected.symbol }}
                        {{
                          (
                            (lineNumbers[tokenIndex] / 1000) *
                            lastTokenPrices[token.address]
                          ).toFixed(3)
                        }}
                      </div>
                    </div>
                    <Slider
                      class="mt-2"
                      @change="
                        (value) => OnSliderValueChange(tokenIndex, value)
                      "
                      :tooltips="false"
                      :min="0"
                      :max="maxBalances[token.address] * 1000"
                      :step="1"
                      :lazy="false"
                      v-model="lineNumbers[tokenIndex]"
                    />
                  </div>

                  <div
                    class="flex border-1 border-[#a3a4a533] rounded-2xl dark:!text-white text-black text-xs fw-bold align-items-center mt-4 divide-x divide-[#a3a4a533]"
                  >
                    <div class="w-25 p-2">
                      {{ $t('total') }}
                    </div>
                    <div
                      class="w-full p-2 flex justify-content-between align-items-center"
                    >
                      <div class="w-25 font-['Roboto_Mono',_monospace]">
                        {{ currencySelected.symbol }}{{ fiatTotal }}
                      </div>
                      <button
                        class="bg-[#FFFFFF] hover:bg-blue-500 text-black text-[10px] font-semibold border-none outline-none rounded-full px-2 py-1"
                        @click="OnAllMaxClick"
                      >
                        {{ $t('max') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="approveStep > 0 && approveStep < 5">
              <DepositModalV2
                @zapperModalOpen="zapperModalOpen"
                :pool="pool"
                :visibleDepositModal="visibleDepositModal"
                @changeVisibleDepositOpen="changeVisibleDepositClose"
                :total="
                  lineNumbers.reduce(
                    (sum, current, index) =>
                      sum + (current / 1000) * lastTokenPrices[tokens[index]],
                    0,
                  )
                "
                :account="account"
                :valueLoss="priceImpactFormatted"
                :bptOut="bptOut"
                :weeklyYield="totalWeeklyYield"
                :fiatTotal="fiatTotal"
                :tokens="
                  depositMethod === 'zap'
                    ? [
                        {
                          ...zapToken,
                          depositAmount: parseFloat(zapToken.value),
                          usdAmount: zapToken.value * zapToken.price,
                        },
                      ]
                    : pool?.tokens?.map((t, i) => ({
                        ...t,
                        depositAmount: formattedLineNumbers[i],
                        usdAmount:
                          formattedLineNumbers[i] * lastTokenPrices[t.address],
                      }))
                "
                :approveStep="approveStep"
                :depositMethod="depositMethod"
                @changeApproveStep="changeApproveStep"
                @explode="explode"
                @addedTXHash="addedTXHash"
              />
            </div>
            <div v-else-if="approveStep === 5">
              <div class="py-4 flex flex-col items-center justify-center mb-5">
                <ConfettiExplosion
                  v-if="confettiVisible"
                  :particleSize="8"
                  :duration="5000"
                  :colors="['#00E0FF', '#00c9ff', '#2E3191', '#41BBC7']"
                />
                <div class="text-[20px] text-white font-medium mb-3">
                  Liquidity added!
                </div>
                <svg
                  @click="explode"
                  class="mb-3"
                  width="74"
                  height="74"
                  viewBox="0 0 74 74"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M36.9987 0.333008C16.7587 0.333008 0.332031 16.7597 0.332031 36.9997C0.332031 57.2397 16.7587 73.6663 36.9987 73.6663C57.2387 73.6663 73.6654 57.2397 73.6654 36.9997C73.6654 16.7597 57.2387 0.333008 36.9987 0.333008ZM27.062 52.7297L13.8987 39.5663C13.5592 39.2269 13.29 38.8239 13.1062 38.3803C12.9225 37.9368 12.828 37.4614 12.828 36.9813C12.828 36.5013 12.9225 36.0259 13.1062 35.5824C13.29 35.1388 13.5592 34.7358 13.8987 34.3963C14.2382 34.0569 14.6412 33.7876 15.0847 33.6039C15.5282 33.4202 16.0036 33.3256 16.4837 33.3256C16.9638 33.3256 17.4392 33.4202 17.8827 33.6039C18.3262 33.7876 18.7292 34.0569 19.0687 34.3963L29.6654 44.9563L54.892 19.7297C55.5776 19.0441 56.5075 18.6589 57.477 18.6589C58.4466 18.6589 59.3764 19.0441 60.062 19.7297C60.7476 20.4153 61.1328 21.3451 61.1328 22.3147C61.1328 23.2842 60.7476 24.2141 60.062 24.8997L32.232 52.7297C31.8928 53.0696 31.4899 53.3393 31.0463 53.5233C30.6028 53.7073 30.1272 53.802 29.647 53.802C29.1668 53.802 28.6913 53.7073 28.2477 53.5233C27.8042 53.3393 27.4012 53.0696 27.062 52.7297Z"
                    fill="#00E0FF"
                  />
                </svg>
                <div class="text-[15px] text-[#888888] font-medium">
                  Successfully added liquidity.
                </div>
              </div>

              <div class="flex justify-evenly mb-3">
                <a
                  :href="`https://bscscan.com/tx/${txHash}`"
                  class="text-decoration-none"
                  target="_blank"
                >
                  <div class="compose_pool_connect_wallet flex items-center">
                    Receipt
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_558_15327)">
                        <path
                          d="M10.5 7.58333V11.0833C10.5 11.3928 10.3771 11.6895 10.1583 11.9083C9.9395 12.1271 9.64275 12.25 9.33333 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V4.66667C1.75 4.35725 1.87292 4.0605 2.09171 3.84171C2.3105 3.62292 2.60725 3.5 2.91667 3.5H6.41667"
                          stroke="#05061B"
                          stroke-width="1.16667"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M8.75 1.75H12.25V5.25"
                          stroke="#05061B"
                          stroke-width="1.16667"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M5.83203 8.16667L12.2487 1.75"
                          stroke="#05061B"
                          stroke-width="1.16667"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_558_15327">
                          <rect width="14" height="14" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </a>
                <a
                  :href="`/pools/details/${poolId}/BNB/info`"
                  class="text-decoration-none"
                >
                  <div class="compose_pool_connect_wallet">View Pool</div>
                </a>
              </div>
            </div>

            <div
              class="compose_pool_connect_wallet"
              v-if="approveStep === 0"
              @click="approveStep = 1"
            >
              {{ $t('preview') }}
            </div>
          </div>

          <WalletInfo
            :tokens="pool?.tokens"
            :balances="balances"
            :line-numbers="lineNumbers"
            :last-token-prices="lastTokenPrices"
          />
        </div>
      </div>
    </div>
  </MainCard>
</template>
<script setup>
import { onMounted, computed, nextTick, ref } from 'vue'
import Slider from '@vueform/slider'
import ConfettiExplosion from 'vue-confetti-explosion'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import MainCard from '@/UI/MainCard.vue'
import CurrencySelector from '@/UI/CurrencySelector.vue'
import Toast from '@/UI/Toast.vue'
import ZapperModal from '@/components/modals/ZapperModal.vue'
import DepositModalV2 from '@/components/modals/DepositModalV2.vue'
import TokenSelectModal from '@/components/modals/TokenSelectModal.vue'
import BigLogoLoader from '@/components/loaders/BigLogoLoader.vue'
import DepositMethodToggle from '@/components/Pool/Deposit/DepositMethodToggle.vue'
import DepositSlippageDropdown from '@/components/Pool/Deposit/DepositSlippageDropdown.vue'
import WalletInfo from '@/components/Pool/Deposit/WalletInfo.vue'
import ArrowBackIcon from '@/assets/icons/arrow/arrow_back.svg'
import ArrowDownIcon from '@/assets/icons/arrow/arrow_down.svg'
import CloseIcon from '@/assets/icons/arrow/close_modal_icon.svg'

import router from '@/router'
import { getTokenEntity } from '@/lib/helpers/util'
import { usePoolActionBalances } from '@/composables/balances/usePoolActionBalances'
import useInvestFormMath from '@/composables/math/investMath/useInvestMath'
import { getSinglePoolDetails } from '@/composables/data/detailsData'
import {
  useTrades,
  useZapper,
} from '@/composables/poolActions/deposit/useZapper'
import { useFetchTokens } from '@/composables/tokens/useFetchTokens'

const isZapperModalOpen = ref(false)
const tradeTokens = ref([])
const tradeDatas = ref([])
const fromAmounts = ref([])
const toAmounts = ref([])
const amounts = ref([])

const pool = ref(null)
const approveStep = ref(0)
const depositMethod = ref('zap')
const slippageSelected = ref('Auto')
const slippage = ref()

const confettiVisible = ref(false)

const tokens = ref([])
const currencySelected = ref({ name: 'USD', code: 'USD', symbol: '$' })
const lineNumbers = ref([])
const balances = ref({})

const allLastTokenPrices = ref({})

const account = ref('')

const zapToken = ref({ symbol: 'WBNB', depositAmount: 0, value: 0 })

// hardcoded tx
const txHash = ref('')

const lastDepositChanged = ref(0)

const visibleDepositModal = ref(false)

const poolId = router.currentRoute.value.params['id']

const isTokenSelectModalOpen = ref(false)

const lastTokenPrices = computed(
  () => allLastTokenPrices.value[currencySelected.value.code],
)

const usdValues = computed(() => {
  if (lineNumbers.value.length > 0) {
    return pool.value.tokens.map(
      (t) => balances.value[t.address] * lastTokenPrices.value[t.address],
    )
  }
  return []
})

const leastBalanceIndex = computed(() => {
  const minValue = Math.min(...usdValues.value)
  let index = usdValues.value.indexOf(minValue)
  return index == -1 ? 0 : index
})

const leastBalanceValue = computed(() => {
  if (usdValues.value.length > 0) {
    return usdValues.value[leastBalanceIndex.value]
  }
  return 0
})

const maxBalances = computed(() => {
  const result = {}
  let iterator = 0
  for (const [key] of Object.entries(balances.value)) {
    if (iterator != leastBalanceIndex.value) {
      let toOptimizeUsdAmount =
        (leastBalanceValue.value /
          pool.value.tokens[leastBalanceIndex.value].weight) *
        pool.value.tokens[iterator].weight
      result[key] = toOptimizeUsdAmount / lastTokenPrices.value[key]
    } else {
      result[key] = leastBalanceValue.value / lastTokenPrices.value[key]
    }
    iterator++
  }
  return result
})

const formattedLineNumbers = computed(() =>
  lineNumbers.value.map((ln) => ln / 1000),
)

const amountMap = computed(() => {
  const amountMap = {}
  fullAmounts.value.forEach((amount, i) => {
    amountMap[tokens.value[i]] = parseFloat(amount)
  })
  return amountMap
})

const fiatAmountMap = computed(() => {
  if (Object.keys(lastTokenPrices.value).length > 0) {
    const fiatAmountMap = {}
    Object.keys(amountMap.value).forEach((address) => {
      fiatAmountMap[address] =
        lastTokenPrices.value[address] * amountMap.value[address]
    })
    return fiatAmountMap
  }
  return {}
})

const fiatTotal = computed(() =>
  parseFloat(
    lineNumbers.value.reduce(
      (sum, current, index) =>
        sum + (current / 1000) * lastTokenPrices.value[tokens.value[index]],
      0,
    ),
  ).toFixed(3),
)

const priceImpactFormatted = computed(() =>
  priceImpact.value ? (priceImpact.value * 100).toFixed(1) : 0,
)

const totalWeeklyYield = computed(() => pool.value['30dAPR'])

const { tokens: possibleTokens } = useFetchTokens(56)

const { priceImpact, fullAmounts, bptOut } = useInvestFormMath(
  pool,
  pool.value ? pool.value.tokens : [],
  balances,
  formattedLineNumbers,
  true,
)

function tokenSelectModalOpen() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
  isTokenSelectModalOpen.value = true
}

async function zapperModalOpen() {
  const {
    oneInchDatas,
    oneInchDescs,
    fromAmounts: amountsIn,
    toAmounts: amountsOut,
    amounts: amountsForLPT,
  } = await useTrades(
    pool.value,
    zapToken.value.address,
    zapToken.value.value,
    slippage.value,
  )

  tradeDatas.value = oneInchDatas
  tradeTokens.value = oneInchDescs
  fromAmounts.value = amountsIn
  toAmounts.value = amountsOut
  amounts.value = amountsForLPT

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
  isZapperModalOpen.value = true
}

async function onAcceptTrade() {
  await useZapper(
    pool.value,
    zapToken.value.address,
    zapToken.value.value,
    amounts.value,
    tradeDatas.value,
    tradeTokens.value,
  )
}

const explode = async () => {
  confettiVisible.value = false
  await nextTick()
  confettiVisible.value = true
}

function changeApproveStep(step) {
  approveStep.value = step
}

function addedTXHash(hash) {
  txHash.value = hash
}

// const totalWeeklyYield = computed(() =>
//   weeklyYieldForAPR(`${pool.apr.total}`),
// )

// function weeklyYieldForAPR(apr) {
//   return bnum(apr).times(fiatTotal.value).div(52).toString()
// }

function OnSliderValueChange(index, value) {
  if (balances.value[tokens.value[index].address] * 1000 < value) {
    lineNumbers.value[index] =
      balances.value[tokens.value[index].address] * 1000
  }
  lineNumbers.value[index] = value
  if (value > 0) lastDepositChanged.value = index
  OnOptimizeClick()
}

function OnAllMaxClick() {
  for (let i = 0; i < tokens.value.length; i++) {
    OnMaxClick(i, tokens.value[i])
  }
}

function OnMaxClick(index, address) {
  OnSliderValueChange(index, balances.value[address] * 1000)
}

// WETH-60/USDT-40

// 600$ worth of WETH
// 1000$ / 100 * 40

// 60-40 = +20%

function OnOptimizeClick() {
  if (lastDepositChanged.value == -1) return
  let token = tokens.value[lastDepositChanged.value]
  let usdAmount =
    (lineNumbers.value[lastDepositChanged.value] / 1000) *
    lastTokenPrices.value[token]
  usdAmount = Math.min(usdAmount, leastBalanceValue.value)
  for (let i = 0; i < lineNumbers.value.length; i++) {
    // let toOptimize = pool.value.tokens[i]
    // let weightDiff = toOptimize.weight / pool.value.tokens[lastDepositChanged.value].weight
    // let sumDiff = usdAmount * weightDiff
    // let toOptimizeUsdAmount = usdAmount + sumDiff
    // let newValue = toOptimizeUsdAmount / lastTokenPrices.value[tokens.value[i]]
    let toOptimizeUsdAmount =
      (usdAmount / pool.value.tokens[lastDepositChanged.value].weight) *
      pool.value.tokens[i].weight
    let newValue =
      toOptimizeUsdAmount / lastTokenPrices.value[pool.value.tokens[i].address]
    lineNumbers.value[i] = newValue * 1000
  }
}

function onTokenInput(event, tokenIndex) {
  let result_value = event.target.value
  if (parseFloat(result_value) != 0) {
    result_value = parseFloat(event.target.value) * 1000
  }
  if (isNaN(parseFloat(result_value))) {
    result_value = 0
  }
  lineNumbers.value[tokenIndex] = result_value
}

function changeVisibleDepositOpen() {
  // let areBiggerThanZero = true

  let areBiggerThanZero = lineNumbers.value.some(function (ele) {
    return ele <= 0
  })

  if (areBiggerThanZero) {
    toast(Toast, {
      closeOnClick: true,
      theme: 'dark',
      type: 'warning',
      autoClose: 5000,
      closeButton: false,
      position: toast.POSITION.TOP_RIGHT,
      data: {
        header_text: 'Impossible to Deposit!',
        toast_text:
          'Please make sure that you have an input amount for every token!',
        tx_link: '',
        speedUp: '',
      },
    })
  } else {
    visibleDepositModal.value = true
  }
}

function changeVisibleDepositClose() {
  visibleDepositModal.value = false
}

function RemainingBalance(token, index) {
  let value1 = balances.value[token.address] * 1000
  let value2 = parseFloat(lineNumbers.value[index])
  let diff = (value1 - value2) / 1000
  return diff < 0 && diff > -1 ? 0 : diff.toFixed(4)
}

function onCurrencyInput(e) {
  let possibleAmount =
    (e.target.value /
      lastTokenPrices.value[tokens.value[leastBalanceIndex.value]]) *
    pool.value.tokens[leastBalanceIndex.value].weight
  lineNumbers.value[leastBalanceIndex.value] =
    parseFloat(
      balances.value[pool.value.tokens[leastBalanceIndex.value].address],
    ) >= possibleAmount
      ? possibleAmount * 1000
      : balances.value[pool.value.tokens[leastBalanceIndex.value].address] *
        1000
  lastDepositChanged.value = leastBalanceIndex.value
  OnOptimizeClick()
}

onMounted(async () => {
  pool.value = await getSinglePoolDetails(56, poolId, true)
  tokens.value = pool.value.tokens.map((t) => t.address)
  const {
    balances: _balances,
    account: _account,
    lineNumbers: _lineNumbers,
    lastTokenPrices: _lastTokenPrices,
  } = await usePoolActionBalances(tokens.value, pool.value.tokens, 56)

  balances.value = _balances
  account.value = _account
  lineNumbers.value = _lineNumbers
  allLastTokenPrices.value = _lastTokenPrices
  zapToken.value = possibleTokens.value[0] || zapToken.value
})
</script>
<style lang="scss" scoped>
.center_container {
  // background: #15151524;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  margin: 1% 12% 12% 12%;
  padding: 2.5%;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  @media (max-width: 768px) {
    margin: 0%;
  }
}

.caption-row {
  flex-direction: row;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: start;
    width: 90%;
  }
}

.big-chip {
  padding-left: 8px;
  padding-right: 10px;
  padding-top: 3px;
  padding-bottom: 3px;
  width: fit-content;
  display: flex;
  align-items: center;
  border-radius: 16px;
  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;

  backdrop-filter: blur(20.067087173461914px);

  &__image {
    width: 1.4vw;
    @media (max-width: 768px) {
      width: 15px;
    }
  }

  &__text {
    font-size: clamp(10px, 0.9vw, 14px);
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0em;
    font-family: 'Roboto Mono', monospace;

    &:nth-child(2) {
      margin-left: 4px;
      margin-right: 16px;
    }
  }

  &:not(:first-child) {
    margin-left: 12px;
  }
}

.currency_container {
  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;

  padding: 10px;
  border-radius: 16px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.back_button {
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background: #00000024;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  border: 1px solid #ffffff0d;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.deposit_choose {
  padding: 10px;
  width: 40%;
  border-radius: 16px;
  // background: #00000024;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  @media (max-width: 768px) {
    width: 100%;
  }
}

.token-input {
  background-color: transparent;
  border: none;
  outline: none;
}

.modal_stake_token {
  padding: 15px;
  border-radius: 16px;
  // background: #15151524;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
}

.modal_balance_slider {
  margin-top: 20px;
  // color: white;
  font-size: clamp(10px, 0.8vw, 14px);
  display: flex;
  justify-content: space-between;
}

.modal_stake_token_inner_name {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 17px;
  // background: rgba(76, 76, 76, 0.14);
  // color: white;
  font-size: clamp(10px, 0.8vw, 14px);
  padding: 4px 12px;
}

:deep(.multiselect__option) {
  background: #000000 !important;
  color: white !important;
  min-height: 5px !important;
  padding: 0px !important;
}

:deep(.multiselect__content-wrapper) {
  border-color: rgb(0 0 0) !important;
}

:deep(.multiselect__tags) {
  background: none !important;
  border-color: rgba(180, 1, 1, 0) !important;
  border-radius: 20px;
  padding: 0px 34px 0 8px !important;
  min-height: 10px;
}
</style>
