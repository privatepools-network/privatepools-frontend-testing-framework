<template>
  <MainCard>
    <DepositModalV2 :pool="pool" :visibleDepositModal="visibleDepositModal" @changeVisibleDeposit="changeVisibleDeposit"
      :total="lineNumbers.reduce(
        (sum, current, index) =>
          sum + (current / 1000) * lastTokenPrices[tokens[index]],
        0,
      )
        " :account="account" :valueLoss="priceImpactFormatted" :bptOut="bptOut" :weeklyYield="totalWeeklyYield"
      :fiatTotal="fiatTotal" :tokens="pool.tokens.map((t, i) => ({
        ...t,
        depositAmount: formattedLineNumbers[i],
        usdAmount: formattedLineNumbers[i] * lastTokenPrices[t.address],
      }))
        " />
    <CRow class="mb-4">
      <div class="d-flex align-items-center justify-content-between">
        <!-- <div class="caption" style="font-size:clamp(10px, 0.9vw, 16px); font-weight: 700">
          {{ pool?.tokens?.map((tokenEntity) => tokenEntity.symbol).join('/') }}
        </div> -->
        <div class="caption-row">
          <div v-for="(poolToken, poolTokenIndex) in pool.tokens" :key="`pool-token-${poolTokenIndex}`" class="big-chip">
            <CAvatar :src="getTokenEntity(poolToken.symbol, 'short').icon" class="big-chip__image" />
            <div class="big-chip__text">{{ poolToken.symbol }}</div>
            <div class="big-chip__text">{{ poolToken.weight }}%</div>
          </div>
        </div>
        <div class="back_button" @click="$emit('changeToDepositView')">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 6L18 18" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </CRow>

    <div class="d-flex align-items-start gap-5">
      <div class="deposit_choose">
        <div class="deposit_network_text">{{ chainSelected }}</div>
        <div class="deposit_text my-1">Set initial liquidity</div>

        <div class="d-flex justify-content-between currency_container">
          <CurrencySelector />
          <div>
            <input class="token-input" style="
                color: rgb(168, 168, 168);
                font-size: clamp(10px, 0.8vw, 14px);
                font-weight: 500;
                text-align: right;
              " type="number" placeholder="0" />
          </div>
        </div>

        <div class="d-flex flex-column gap-2" v-if="balances != {} && lastTokenPrices != {} && lineNumbers.length > 0
          ">
          <div class="modal_stake_token" v-for="(token, tokenIndex) in pool.tokens"
            :key="`deposit-token-${token.address}`">
            <div>
              <div class="d-flex justify-content-between align-items-center">
                <div class="modal_stake_token_inner_name">
                  <img :src="getTokenEntity(token.symbol, 'short').icon" width="20" />
                  {{ token.symbol }} {{ token.weight }}%
                </div>
                <input class="token-input" style="
                    color: rgb(168, 168, 168);
                    font-size: clamp(10px, 0.8vw, 14px);
                    font-weight: 500;
                    text-align: right;
                  " :value="lineNumbers[tokenIndex] > 0
                      ? lineNumbers[tokenIndex] / 1000
                      : lineNumbers[tokenIndex]
                    " @input="(e) => onTokenInput(e, tokenIndex)" type="number" />
              </div>
              <div>
                <div class="modal_balance_slider">
                  <div class="value-label" ref="inputRefLabel">
                    Balance:
                    <span class="fw-bold">{{
                      RemainingBalance(token, tokenIndex)
                    }}</span><span @click="() => OnMaxClick(tokenIndex, token.address)" class="fw-bold bg-transparent"
                      style="cursor: pointer">
                      Max</span>
                  </div>
                  <div style="rgba(51, 51, 51, 1)">
                    ${{
                      (
                        (lineNumbers[tokenIndex] / 1000) *
                        lastTokenPrices[token.address]
                      ).toFixed(3)
                    }}
                  </div>
                </div>
                <div class="mt-2">
                  <Slider @change="(value) => OnSliderValueChange(tokenIndex, value)" :tooltips="false" :min="0"
                    :max="balances[token.address] * 1000" :step="1" v-model="lineNumbers[tokenIndex]" lazy="false" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="modal_total_container mt-4">
              <table style="
                  color: white;
                  width: 100%;
                  border-collapse: separate;
                  border-spacing: 0;
                  overflow: hidden;
                ">
                <tr style="
                    border: 1px solid rgba(163, 164, 165, 0.2);
                    border-top-left-radius: 15px;
                  ">
                  <td class="w-25 fw-bold" style="
                      border-right: 1px solid rgba(163, 164, 165, 0.2);
                      border-bottom: 1px solid rgba(163, 164, 165, 0.2);
                      padding: 8px;
                    ">
                    Total
                  </td>
                  <td style="
                      padding: 8px;
                      border-bottom: 1px solid rgba(163, 164, 165, 0.2);
                    ">
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="w-25 fw-bold">
                        ${{
                          lineNumbers.reduce(
                            (sum, current, index) =>
                              sum +
                              (current / 1000) * lastTokenPrices[tokens[index]],
                            0,
                          )
                        }}
                      </div>
                      <div class="optimize" @click="OnAllMaxClick">Max</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="
                      border-right: 1px solid rgba(163, 164, 165, 0.2);
                      padding: 8px;
                    " class="w-25">
                    Value loss
                  </td>
                  <td style="padding: 8px">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        {{ priceImpactFormatted }}%
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clip-path="url(#clip0_1904_24663)">
                            <path
                              d="M6.78125 11.4932C9.54267 11.4932 11.7812 9.25459 11.7812 6.49316C11.7812 3.73174 9.54267 1.49316 6.78125 1.49316C4.01983 1.49316 1.78125 3.73174 1.78125 6.49316C1.78125 9.25459 4.01983 11.4932 6.78125 11.4932Z"
                              stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M6.78125 8.49316V6.49316" stroke="white" stroke-linecap="round"
                              stroke-linejoin="round" />
                            <path d="M6.78125 4.49316H6.78625" stroke="white" stroke-linecap="round"
                              stroke-linejoin="round" />
                          </g>
                          <defs>
                            <clipPath id="clip0_1904_24663">
                              <rect width="12" height="12" fill="white" transform="translate(0.78125 0.493164)" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <div class="optimize" @click="OnOptimizeClick">
                        Optimize
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="compose_pool_connect_wallet" @click="changeVisibleDeposit">
          Preview
        </div>
      </div>

      <div style="
          border: 1px solid rgba(163, 164, 165, 0.2);
          border-radius: 20px;
          color: white;
          font-size: clamp(10px, 0.8vw, 14px);
          height: fit-content;
          width: 200px;
        ">
        <div class="fw-bold p-2" style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)">
          My wallet
        </div>
        <div class="d-flex flex-column p-2" style="
            font-size: clamp(10px, 0.8vw, 14px);
            color: rgba(221, 221, 221, 1);
          " v-if="balances != {} && lastTokenPrices != {} && lineNumbers.length > 0
            ">
          <div class="d-flex justify-content-between align-items-center" v-for="(token, index) in pool.tokens"
            :key="`wallet-${index}`">
            <div>
              <img :src="getTokenEntity(token.symbol, 'short').icon" width="23" class="p-1" />
            </div>
            <div>
              {{ parseFloat(balances[token.address]).toFixed(2) }} ({{
                (
                  balances[token.address] * lastTokenPrices[token.address]
                ).toFixed(2)
              }}$)
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainCard>
</template>
<script setup>
import MainCard from '@/UI/MainCard.vue'
import DepositModalV2 from '@/components/modals/DepositModalV2.vue'
import { getTokenEntity } from '@/lib/helpers/util'
// import router from '@/router'
import { ref, defineProps } from 'vue'
import Slider from '@vueform/slider'
import CurrencySelector from '@/UI/CurrencySelector.vue'
import { onMounted, toRef, computed } from 'vue'
import { usePoolActionBalances } from '@/composables/balances/usePoolActionBalances'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'
import 'vue3-toastify/dist/index.css'

import useInvestFormMath from '@/composables/math/investMath/useInvestMath'
import { bnum } from '@/lib/utils'
const props = defineProps([
  'visibleDepositModal',
  'changeVisibleDeposit',
  'pool',
  'tokens',
  'changeToDepositView',
  'chainSelected',
])
console.log('here')
const lineNumbers = ref([])
const balances = ref({})

const lastTokenPrices = ref({})
const formattedLineNumbers = computed(() =>
  lineNumbers.value.map((ln) => ln / 1000),
)
const { priceImpact, fullAmounts, bptOut } = useInvestFormMath(
  toRef(props.pool),
  props.pool.tokens,
  balances,
  formattedLineNumbers,
  true,
)

const amountMap = computed(() => {
  const amountMap = {}
  fullAmounts.value.forEach((amount, i) => {
    amountMap[props.tokens[i]] = parseFloat(amount)
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
  Object.values(fiatAmountMap.value).reduce(
    (total, amount) => bnum(total).plus(amount).toString(),
    '0',
  ),
)

const priceImpactFormatted = computed(() =>
  priceImpact.value ? (priceImpact.value * 100).toFixed(1) : 0,
)
// const totalWeeklyYield = computed(() =>
//   weeklyYieldForAPR(`${props.pool.apr.total}`),
// )
const account = ref('')
onMounted(async () => {
  console.log(props.tokens)
  const {
    balances: _balances,
    account: _account,
    lineNumbers: _lineNumbers,
    lastTokenPrices: _lastTokenPrices,
  } = await usePoolActionBalances(props.tokens, props.pool.tokens)
  console.log('CHAIN SELECTED - ', props.chainSelected)
  balances.value = _balances
  account.value = _account
  lineNumbers.value = _lineNumbers
  lastTokenPrices.value = _lastTokenPrices
})

// function weeklyYieldForAPR(apr) {
//   return bnum(apr).times(fiatTotal.value).div(52).toString()
// }

let lastDepositChanged = ref(0)
function OnSliderValueChange(index, value) {
  if (balances.value[props.tokens[index].address] * 1000 < value) {
    lineNumbers.value[index] =
      balances.value[props.tokens[index].address] * 1000
  }
  lineNumbers.value[index] = value
  if (value > 0) lastDepositChanged.value = index
}

function OnAllMaxClick() {
  for (let i = 0; i < props.tokens.length; i++) {
    OnMaxClick(i, props.tokens[i])
  }
}
function OnMaxClick(index, address) {
  OnSliderValueChange(index, balances.value[address] * 1000)
}

function OnOptimizeClick() {
  if (lastDepositChanged.value == -1) return
  let token = props.tokens[lastDepositChanged.value]
  let usdAmount =
    (lineNumbers.value[lastDepositChanged.value] / 1000) *
    lastTokenPrices.value[token]
  for (let i = 0; i < lineNumbers.value.length; i++) {
    if (i != lastDepositChanged.value) {
      let newValue = usdAmount / lastTokenPrices.value[props.tokens[i]]
      lineNumbers.value[i] = newValue * 1000
    }
  }
}

const totalWeeklyYield = computed(() =>
  weeklyYieldForAPR(`${props.pool.apr.total}`),
)
function weeklyYieldForAPR(apr) {
  return bnum(apr).times(fiatTotal.value).div(52).toString()
}

function onTokenInput(event, tokenIndex) {
  let result_value = event.target.value
  console.log(result_value)
  if (parseFloat(result_value) != 0) {
    result_value = parseFloat(event.target.value) * 1000
  }
  if (isNaN(parseFloat(result_value))) {
    result_value = 0
  }
  lineNumbers.value[tokenIndex] = result_value
}

const visibleDepositModal = ref(false)

function changeVisibleDeposit() {
  // let areBiggerThanZero = true

  let areBiggerThanZero = lineNumbers.value.some(function(ele) {
    return ele <= 0;
});

 

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
        toast_text: 'Please make sure that you have an input amount for every token!',
        tx_link: '',
        speedUp: '',
      },
    })
  } else {
    visibleDepositModal.value = !visibleDepositModal.value
  }
}

function RemainingBalance(token, index) {
  let value1 = balances.value[token.address] * 1000
  let value2 = parseFloat(lineNumbers.value[index])
  let diff = (value1 - value2) / 1000
  return diff < 0 && diff > -1 ? 0 : diff.toFixed(4)
}
</script>
<style lang="scss" scoped>
.caption-row {
  flex-direction: row;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.big-chip {
  background: none;

  padding-left: 5px;
  padding-right: 10px;
  border: 1px solid rgba(1, 180, 126, 1);
  border-radius: 20px;

  width: fit-content;
  display: flex;
  align-items: center;

  &__image {
    width: 1.4vw;
  }

  &__text {
    font-size: clamp(10px, 0.9vw, 14px);
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0em;
    color: #ffffff;

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
  background-color: #121b198f;
  padding: 10px;
  border-radius: 9px;
  box-shadow: 0px 9px 12px 0px #00000029;
  margin-top: 20px;
  margin-bottom: 20px;
}

.back_button {
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background-color: #041c13;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.deposit_choose {
  padding: 10px;
  width: 35%;
  background: linear-gradient(90.52deg,
      rgba(53, 185, 192, 0.05) 0.36%,
      rgba(53, 185, 192, 0.02) 0.36%);
  border: 1px solid #01b47e2f;
  border-radius: 10px;
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
  color: white;
}

.modal_stake_token {
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 20px;
  padding: 15px;
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

.modal_total_container {
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 15px;
  font-size: clamp(10px, 0.8vw, 14px);
}

.compose_pool_connect_wallet {
  margin-top: 8px;
  padding: 8px;
  font-size: 12px;
  color: white;
  border: 0px;
  background: linear-gradient(89.26deg, #01b47e 5.07%, #7ef6b2 99.37%);
  width: 100%;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  // transition-duration: 0.3s;
  text-shadow: 1px 1px 2px black;

  &:hover {
    color: #fff;
    background: #7ef6b2;
    box-shadow: 0px 12px 24px 0px rgba(#01b47e, 0.2),
      0px 4px 8px 0px rgba(#7ef6b2, 0.3);
  }
}

.optimize {
  background: rgba(59, 97, 65, 0.5);
  padding: 4px 7px;
  border-radius: 5px;

  &:hover {
    background: rgba(59, 97, 65, 0.7);
    cursor: pointer;
  }
}

:deep(.multiselect__option) {
  background: #121b19 !important;
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
