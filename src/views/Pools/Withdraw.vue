<template>
  <MainCard>
    <!-- <Modal
      v-if="visibleDepositModal"
      @close="changeVisibleDepositClose"
      size="xl"
    >
      <template #body>

      </template>
</Modal> -->

    <div class="center_container dark:!bg-[#15151524] bg-white">
      <CRow class="mb-4">
        <div class="d-flex align-items-center justify-content-between">
          <div class="caption-row">
            <div class="caption dark:!text-white text-black"
              style="font-size: clamp(10px, 0.9vw, 16px); font-weight: 700">
              {{
                pool?.tokens?.map((tokenEntity) => tokenEntity.symbol).join('/')
              }}
            </div>
            <div v-for="(poolToken, poolTokenIndex) in allSelectedTokensDisplay" :key="`pool-token-${poolTokenIndex}`"
              class="big-chip dark:!bg-[#00000024] bg-white">
              <CAvatar :src="getTokenEntity(poolToken.symbol, 'short').icon" class="big-chip__image" />
              <div class="big-chip__text dark:!text-white text-black">
                {{ poolToken.symbol }}
              </div>
              <div class="big-chip__text dark:!text-white text-black">
                {{ poolToken.weight * 100 }}%
              </div>
            </div>
          </div>
          <div class="back_button" @click="router.go(-1)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6 6L18 18" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </CRow>

      <div v-if="Object.keys(balances).length === 0" class="my-24 flex justify-center items-center">
        <BigLogoLoader />
      </div>
      <div v-else class="flex justify-center gap-5">
        <div class="deposit_choose dark:!bg-[#00000024] bg-white">
          <div class="deposit_text dark:!text-white text-black my-1">
            {{ $t('withdraw_from_pool') }}
          </div>

          <div v-if="visibleDepositModal === false">
            <div class="d-flex flex-column gap-2 mt-4">
              <div class="deposit_text dark:!text-white text-black fw-bolder">
                {{ $t('you_provided') }}
              </div>

              <div class="modal_stake_token dark:!text-white text-black dark:!bg-[#15151524] bg-white">
                <div>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="modal_stake_token_inner_name dark:!text-white text-black">
                      <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11.5" cy="11.5" r="11.5" fill="#CFB428" />
                        <mask id="mask0_5890_7370" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0"
                          width="23" height="23">
                          <circle cx="11.5" cy="11.5" r="11.5" fill="#3E3E3E" />
                        </mask>
                        <g mask="url(#mask0_5890_7370)">
                          <rect x="-7.2627" y="4.27515" width="19.4451" height="19.4451"
                            transform="rotate(-30 -7.2627 4.27515)" fill="#2A5CA9" />
                        </g>
                      </svg>

                      {{
                        pool?.tokens
                          .map((t) => `${t.weight * 100}${t.symbol}`)
                          .join('-')
                      }}
                    </div>
              
                    <input v-if="
                      pool && poolShare.balance && !isNaN(poolShare.balance)
                    " class="token-input dark:!text-[#A8A8A8] text-black font-['Roboto_Mono',_monospace]" style="
                        font-size: clamp(10px, 0.8vw, 14px);
                        font-weight: 500;
                        text-align: right;
                      " @input="(e) => onShareInput(e)" :value="usdPoolShareValue.toFixed(4)" type="number" />
                  </div>
                  <div>
                    <div class="modal_balance_slider dark:!text-white text-black" v-if="
                      pool && poolShare.balance && !isNaN(poolShare.balance)
                    ">
                      <div class="value-label" ref="inputRefLabel">
                        {{ $t('balance') }}:
                        <span class="fw-bold font-['Roboto_Mono',_monospace]">{{
                          parseFloat(
                            poolShare.balance -
                            (poolShare.balance / 100) * lineNumberPercent,
                          ).toFixed(4)
                        }}</span><span class="fw-bold bg-transparent font-['Roboto_Mono',_monospace] pl-1"
                          style="cursor: pointer" @click="() => {
                              lineNumberPercent = 95
                              usdPoolShareValue =
                                poolShare.balance * pool.lpPrice
                            }
                            ">
                          {{ $t('max') }}</span>
                      </div>
                      <div class="font-['Roboto_Mono',_monospace]">
                        ${{
                          (
                            ((poolShare.balance * pool.lpPrice) / 100) *
                            lineNumberPercent
                          ).toFixed(4)
                        }}
                      </div>
                    </div>
                    <div class="mt-2">
                      <Slider v-model="lineNumberPercent" @change="(value) =>
                        (usdPoolShareValue =
                          ((poolShare.balance * pool.lpPrice) / 100) *
                          value)
                        " :tooltips="false" :min="0" :max="95" :step="1" :value="80" lazy="false" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="deposit_text dark:!bg-[#00000024] bg-white dark:!text-white text-black fw-bolder mt-3">
                {{ $t('you_receive') }}
              </div>
              <div>
                <div style="
                    border-radius: 16px;
                    box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
                    border: 1px solid #ffffff0d;
                    font-size: clamp(10px, 0.8vw, 14px);
                  ">
                  <div>
                    <div v-for="(token, index) in allSelectedTokensDisplay" :key="`tokens-key-${index}`"
                      class="d-flex align-items-center justify-content-between px-3 gap-3">
                      <!-- <div class="d-flex flex-column align-items-start text-white">
                    <div>{{ token.withdrawAmount }} {{ token.symbol }}</div>
                    <div>${{ token.usdAmount }}</div>
                  </div>
                  <div class="d-flex align-items-center">
                    <img :src="getTokenEntity(token.symbol, 'short').icon" width="60" class="p-3" />
               
                  </div> -->

                      <div class="p-2 d-flex align-items-center justify-content-between gap-2 w-100">
                        <div class="d-flex align-items-center gap-2">
                          <img :src="getTokenEntity(token.symbol, 'short').icon" width="38" />
                          <div class="d-flex flex-column dark:!text-white text-black">
                            <div style="font-size: 12px">
                              {{ token.symbol }} {{ token.weight * 100 }}%
                            </div>
                            <div style="font-size: 10px" class="dark:!text-white text-black">
                              {{ token.symbol }}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="d-flex flex-column align-items-end">
                            <div style="font-size: 12px"
                              class="dark:!text-white text-black font-['Roboto_Mono',_monospace]">
                              {{ token.withdrawAmount }}
                            </div>
                            <div style="font-size: 10px"
                              class="d-flex align-items-center gap-1 dark:!text-white text-black font-['Roboto_Mono',_monospace]">
                              ${{ token.usdAmount }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="my-4">
                <!-- <div class="modal_total_container my-4">
                  <table
                    style="
                      color: white;
                      width: 100%;
                      border-collapse: separate;
                      border-spacing: 0;
                      overflow: hidden;
                    "
                  >
                    <tr
                      style="
                        border: 1px solid rgba(163, 164, 165, 0.2);
                        border-top-left-radius: 15px;
                      "
                    >
                      <td
                        class="w-25 fw-bold dark:!text-white text-black"
                        style="
                          border-right: 1px solid rgba(163, 164, 165, 0.2);
                          padding: 8px;
                        "
                      >
                        {{ $t('price_impact') }}
                      </td>
                      <td style="padding: 8px">
                        <div
                          class="d-flex justify-content-between align-items-center"
                        >
                          <div
                            class="w-25 fw-bold dark:!text-white text-black font-['Roboto_Mono',_monospace]"
                          >
                            {{ ((priceImpact ?? 0) * 100).toFixed(1) }}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div> -->
              </div>
            </div>
            <button class="compose_pool_connect_wallet" :disabled="!poolShare || !poolShare.balance"
              @click="changeVisibleDeposit">
              {{ $t('preview') }}
            </button>
          </div>
          <div v-else>
            <WithdrawModalV2 v-if="pool" :pool="pool" :visibleDepositModal="visibleDepositModal"
              @changeVisibleDeposit="changeVisibleDeposit" @changeVisibleDepositBack="changeVisibleDepositBack"
              :usdSummary="pool
                  ? (usdPoolShareValue > pool.totalShares * pool.lpPrice
                    ? pool.totalShares * pool.lpPrice
                    : usdPoolShareValue
                  ).toFixed(4)
                  : 0
                " :priceImpact="((priceImpact ?? 0) * 100).toFixed(1)" :bptIn="bptIn" :bptBalance="bptBalance"
              :allPossibleTokens="allSelectedTokensDisplay" :allSelectedTokens="allSelectedTokens" :account="account"
              :lineNumberPercent="lineNumberPercent" :exactOut="exactOut" :poolShare="poolShare"
              :getTokenWithdrawAmount="getTokenWithdrawAmount" :init="init" />
          </div>
        </div>
      </div>
    </div>
  </MainCard>
</template>
<script setup>
import MainCard from '@/UI/MainCard.vue'
import { getTokenEntity } from '@/lib/helpers/util'
import { nextTick, ref } from 'vue'
import Slider from '@vueform/slider'

import WithdrawModalV2 from '@/components/modals/WithdrawModalV2.vue'
import { computed, onBeforeMount, watch } from 'vue'
import useWithdrawMath from '@/composables/math/withdrawMath/useWithdrawMath'
import { usePoolActionBalances } from '@/composables/balances/usePoolActionBalances'
import { GetPoolShares } from '@/composables/pools/usePoolShares'
import useDecimals from '@/composables/useDecimals'
import { bnum, groupBy } from '@/lib/utils'
import { formatUnits, parseUnits } from '@ethersproject/units'
import BigNumber from 'bignumber.js'
import { getJsonRpcProvider } from '@/composables/useProvider'
import { networkId } from '@/composables/useNetwork'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'
import 'vue3-toastify/dist/index.css'
import router from '@/router'
import { getSinglePoolDetails } from '@/composables/data/detailsData'
import Modal from '@/UI/Modal.vue'
import BigLogoLoader from '@/components/loaders/BigLogoLoader.vue'

const poolId = router.currentRoute.value.params['id']
const pool = ref(null)


const tokens = ref([])

const poolToken = ref({})
const balances = ref({})
const account = ref({})
const lineNumbers = ref([])
const lastTokenPrices = ref([])
const usdPoolShareValue = ref(0.1)


const poolShare = ref({})

const allTokens = computed(() =>
  poolToken.value && pool.value && poolToken.value[pool.value.address]
    ? Object.assign({}, groupBy(pool.value.tokens, ({ address }) => address), poolToken.value)
    : {},
)

const lineNumberPercent = ref(0)

const allOption = computed(() => ({
  name: 'All',
  symbol: pool.value?.tokens.map((t) => t.symbol).join('/'),
}))
const allSelectedTokens = ref(getAllSelectedTokens(allOption.value))
const allSelectedTokensDisplay = computed(() => {
  if (allSelectedTokens.value.length > 0) {
    return allSelectedTokens.value.map((t) => ({
      ...t,
      usdAmount: getUsdAmount(t),
      withdrawAmount: getTokenWithdrawAmount(t),
    }))
  }
  return []
})
//const optionsTokens = ref([allOption, ...pool.value?.tokens])
const isProportional = computed(() => allSelectedTokens.value.length > 1)
const tokenOut = computed(() =>
  !isProportional.value && allSelectedTokens.value.length > 0
    ? allSelectedTokens.value[0].address
    : null,
)
const tokenOutAmount = computed(() =>
  !isProportional.value && allSelectedTokens.value.length > 0
    ? getTokenWithdrawAmount(allSelectedTokens.value[0])
    : null,
)
const tokenOutIndex = computed(() =>
  !isProportional.value && tokens.value
    ? tokens.value.findIndex((t) => t == tokenOut.value)
    : null,
)

const withdrawMath = computed(() =>
  pool.value
    ? useWithdrawMath(
      pool,
      allTokens,
      lastTokenPrices,
      account,
      balances,
      poolShare,
      isProportional,
      tokenOut,
      tokenOutIndex,
      tokenOutAmount,
    )
    : {}
)
const bptIn = computed(() =>
  withdrawMath.value ? withdrawMath.value.bptIn.value : 0,
)
const bptBalance = computed(() =>
  withdrawMath.value ? withdrawMath.value.bptBalance.value : 0,
)
const singleAssetMaxes = computed(() =>
  withdrawMath.value ? withdrawMath.value.singleAssetMaxes.value : [],
)
const proportionalPoolTokenAmounts = computed(() =>
  withdrawMath.value
    ? withdrawMath.value.proportionalPoolTokenAmounts.value
    : [],
)
const priceImpact = computed(() => 0) // computed(() => withdrawMath.value ? withdrawMath.value.priceImpact.value : 0)
const exactOut = computed(() =>
  withdrawMath.value ? withdrawMath.value.exactOut.value : 0,
)

onBeforeMount(async () => {
  await init()
})

async function init() {
  pool.value = await getSinglePoolDetails(56, poolId)
  tokens.value = pool.value?.tokens.map((t) => t.address)
  const poolAddress = pool.value.address
  const {
    balances: _balances,
    account: _account,
    lineNumbers: _lineNumbers,
    lastTokenPrices: _lastTokenPrices,
  } = await usePoolActionBalances(
    [...tokens.value, poolAddress],
    pool.value?.tokens,
    56,
  )
  balances.value = _balances
  let _provider = getJsonRpcProvider(networkId.value)
  const poolDecimals = await useDecimals(pool.value.address, _provider)
  poolToken.value[poolAddress] = {
    decimals: poolDecimals,
    balance: _balances[pool.value.address],
  }
  account.value = _account
  lineNumbers.value = _lineNumbers
  lastTokenPrices.value = _lastTokenPrices['USD']
  poolShare.value = await GetPoolShares(pool.value.id, account.value)
  usdPoolShareValue.value = poolShare.value.balance * pool.value.lpPrice

  allSelectedTokens.value = getAllSelectedTokens(allOption.value)
}

function getAllSelectedTokens(_selectedToken) {
  if (_selectedToken.name == 'All') return pool.value?.tokens ?? []
  return [_selectedToken]
}

function toFixedDown(number, digits) {
  const factor = Math.pow(10, digits);
  return Math.floor(number * factor) / factor;
}
function getTokenWithdrawAmount(token, slippage = false, decimals = null) {
  let return_value = 0
  if (allSelectedTokens.value.length == 1) {
    return_value = singleAssetMaxes.value
      ? singleAssetMaxes.value[
      pool.value?.tokens.findIndex((t) => t.address == token.address)
      ]
      : 0
  } else {
    return_value = proportionalPoolTokenAmounts.value
      ? proportionalPoolTokenAmounts.value[
      pool.value?.tokens.findIndex((t) => t.address == token.address)
      ]
      : 0
    if (slippage && decimals) {
      let amount = parseUnits(return_value, decimals).toString()
      amount = minusSlippageScaled(amount, decimals)

      return_value = formatUnits(amount, decimals)
    }
  }
  if (isNaN(return_value)) return_value = 0
  return ((parseFloat(return_value) / 100) * lineNumberPercent.value).toFixed(decimals ?? 8)
}

function minusSlippageScaled(amount, decimals) {
  const delta = bnum(amount).times(100).div(10000).dp(0, BigNumber.ROUND_UP)

  return bnum(amount).minus(delta).dp(decimals, BigNumber.ROUND_DOWN).toFixed()
}

function getUsdAmount(token) {
  let return_value =
    getTokenWithdrawAmount(token) * lastTokenPrices.value[token.address]
  if (isNaN(return_value)) return_value = 0
  return return_value.toFixed(4)
}

function onShareInput(e) {
  usdPoolShareValue.value = parseFloat(e.target.value)
  let percent =
    e.target.value / ((poolShare.value.balance * pool.value?.lpPrice) / 100)
  if (percent > 100) lineNumberPercent.value = 100
  else lineNumberPercent.value = percent
}

const visibleDepositModal = ref(false)

function changeVisibleDepositBack() {
  visibleDepositModal.value = false
}

function changeVisibleDeposit() {
  if (usdPoolShareValue.value === 0) {
    toast(Toast, {
      closeOnClick: true,
      theme: 'dark',
      type: 'warning',
      autoClose: 5000,
      closeButton: false,
      position: toast.POSITION.TOP_RIGHT,
      data: {
        header_text: 'Impossible to Withdraw!',
        toast_text:
          'Please make sure that you have selected and input amount to withdraw!',
        tx_link: '',
        speedUp: '',
      },
    })
  } else {
    visibleDepositModal.value = true
  }
}
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
}

.caption-row {
  flex-direction: row;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
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
  }

  &__text {
    font-size: clamp(10px, 0.9vw, 14px);
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0em;
    // color: #ffffff;

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
  background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
  border-radius: 16px;
  padding: 10px;

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

  @media (max-width:1400px) {
    width: 60%;
  }
}

.token-input {
  background-color: transparent;
  border: none;
  outline: none;
}

.deposit_network_text {
  font-size: 9px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  color: #b6b6b6;
}

.deposit_text {
  font-size: clamp(11px, 0.8vw, 15px);
  // color: white;
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
  gap: 4px;
  border-radius: 17px;
  border: 0.5px solid #00e0ff69;
  // color: white;
  font-size: clamp(10px, 0.8vw, 14px);
  padding: 4px 12px;
}

.modal_total_container {
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 15px;
  font-size: clamp(10px, 0.8vw, 14px);
}
</style>
