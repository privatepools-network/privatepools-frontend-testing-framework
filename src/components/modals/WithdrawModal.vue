<template>
  <CModal size="lg" alignment="center" :visible="visibleWithdrawModal" @close="$emit('changeVisibleWithdraw')">
    <CModalHeader :close-button="false">
      {{ console.log("visibleWithdrawModal", visibleWithdrawModal) }}
      <div class="d-flex justify-content-between w-100">
        <div style="cursor: pointer" @click="depositStep = 1">
          <img :src="arrow_back" />
        </div>
        <div style="cursor: pointer" @click="$emit('changeVisibleWithdraw')">
          <img :src="close_modal_icon" />
        </div>
      </div>
    </CModalHeader>
    <CModalBody>
      <div class="modal_body_inside">
        <div v-if="depositStep === 1">

          <div class="modal_body_header">
            <h3>Withdraw from pool</h3>
          </div>
          <div class="modal_stake_token">
            <div class="modal_stake_token_inner">
              <div class="d-flex justify-content-between align-items-center">
                <div v-if="optionsTokens !== undefined">
                  <multiselect :showLabels="false" v-model="selectedToken" @select="onSelect"
                    placeholder="Filter by Token..." label="name" track-by="symbol" :options="optionsTokens"
                    :allow-empty="false" :multiple="false" :taggable="true" :searchable="false">
                    <template v-slot:option="{ option }">
                      <div style="display: flex; align-items: center; gap:4px">
                        <img v-if="option.name !== 'All'" style="width: 25px; height: 25px"
                          :src="getTokenEntity(option.symbol, 'short').icon" />

                        <span>
                          {{ option.name }}
                        </span>
                        <!-- <span style="
                            color: rgba(108, 114, 132, 1);
                            margin-left: 2.5px;
                          ">({{ option.symbol }})</span> -->
                      </div>
                    </template>
                    <template v-slot:singleLabel="{ option }">
                      <div class="multiselect-tag is-user" style="
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          padding: 0px;
                          gap: 6px;
                        ">
                        <div>
                          <img v-if="option.name !== 'All'" :src="getTokenEntity(option.symbol, 'short').icon" />
                          <span>
                            {{ option.name }}
                          </span>
                        </div>

                      </div>
                    </template>
                  </multiselect>
                </div>

                <div style="color: white; font-size: 22px; font-weight: 500">
                  ${{ usdSummary }}
                </div>
              </div>
              <div style="font-size:14px">
                <div class="mt-4 text-white d-flex justify-content-between fw-bolder">
                  <div>Prorpotional withdraw</div>
                  <div>{{ lineNumberPercent }}%</div>
                </div>
                <div class="mt-2 text-white d-flex justify-content-between">
                  <div class="value-label">Min</div>
                  <div class="value-label">Max</div>
                </div>
                <div class="mt-2">
                  <Slider @change="onSliderChange" v-model="lineNumberPercent" :lazy="false" :tooltips="false" :min="0"
                    :max="100" />
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex flex-column mt-3" style="
              border: 1px solid rgba(163, 164, 165, 0.2);
              border-radius: 20px;
              color: white;
              ">
            <div v-for="(token, index) in allSelectedTokensDisplay " :key="`tokens-key-${index}`"
              class="d-flex align-items-center justify-content-between p-3 gap-3"
              style="border-bottom: 1px solid rgba(163, 164, 165, 0.2); border-radius: 20px;">
              <div class="d-flex align-items-center">
                <img :src="getTokenEntity(token.symbol, 'short').icon" width="50" class="p-1" />
                <div class="modal_body_header">{{ token.weight }}%</div>
              </div>
              <div class="d-flex flex-column align-items-end">
                <div>{{ token.withdrawAmount }} {{ token.symbol }}</div>
                <div>${{ token.usdAmount }}</div>
              </div>
            </div>
          </div>
          <div style="
              border: 1px solid rgba(163, 164, 165, 0.2);
              border-radius: 20px;
              color: white;
            " class="my-4">
            <div class="d-flex flex-column">
              <div class="d-flex justify-content-between align-items-center w-100">
                <div class="w-25 p-2">Value Loss</div>
                <div class="vr bg-success"></div>
                <div class="d-flex gap-1 w-75 justify-content-between align-items-center p-2">
                  <div class="d-flex align-items-center gap-2">
                    {{ (priceImpact * 100).toFixed(1) }}% <img :src="info" />
                  </div>
                  <div>
                    <div style="
                        background: rgba(59, 97, 65, 0.5);
                        padding: 4px 7px;
                        border-radius: 20px;
                        font-size: 13px;
                      ">
                      Optimize
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-3 w-100">
            <CButton @click="depositStep = 2" class="modal_preview_button">
              Preview
            </CButton>
          </div>
        </div>
        <div v-if="depositStep > 1">
          <div v-if="depositStep < 4" class="modal_body_header">
            <h3>Withdrawal preview</h3>

          </div>

          <div v-if="depositStep < 4" style="
              border: 1px solid rgba(163, 164, 165, 0.2);;
              border-radius: 20px;
              color: white;
            ">
            <div class="d-flex flex-column">
              <div v-for="( token, index ) in allSelectedTokensDisplay" :key="`tokens-key2-${index}`"
                class="d-flex align-items-center p-3 gap-3" style="border-bottom: 1px solid rgba(163, 164, 165, 0.2);">
                <div><img :src="getTokenEntity(token.symbol, 'short').icon" width="50" class="p-1" /></div>
                <div class="d-flex flex-column">
                  <div>{{ token.withdrawAmount }} {{ token.symbol }}</div>
                  <div class="fw-light">${{ token.usdAmount }}</div>
                </div>
              </div>

            </div>
          </div>
          <div v-if="depositStep < 4" style="
              border: 1px solid rgba(163, 164, 165, 0.2);
              border-radius: 20px;
              color: white;
            " class="my-4">
            <div class="fs-6 fw-bold p-2" style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)">
              Summary
            </div>
            <div class="d-flex flex-column p-2" style="font-size: 14px;">
              <div class="d-flex justify-content-between align-items-center">
                <div>Total</div>
                <div class="d-flex gap-1">
                  ${{ usdSummary }}
                  <img :src="info" />
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <div>Value Loss</div>
                <div class="d-flex gap-1">{{ (priceImpact * 100).toFixed(1) }}% <img :src="info" /></div>
              </div>
            </div>
          </div>
          <div class="w-100">
            <CButton v-if="depositStep === 2" @click="OnWithdrawClick" class="modal_preview_button">
              Withdraw
            </CButton>
            <CButton v-if="depositStep === 3" @click="depositStep = 4"
              class="modal_preview_button d-flex justify-content-center mt-3">
              <div class="d-flex align-items-center gap-3 ">
                <CSpinner size="sm" /> Confirm withdrawal in wallet
              </div>
            </CButton>
          </div>
          <div v-if="depositStep === 4" class="deposit-settled">
            <div class="text-white d-flex justify-content-center">
              <h5>Withdrawal Settled</h5>
            </div>
            <div class="py-4 d-flex justify-content-center">
              <img :src="depositSuccessIcon" />
            </div>
            <div class="py-4 d-flex justify-content-center" style="color: rgba(136, 136, 136, 1); font-weight: 500">
            </div>
            <div class="d-flex justify-content-evenly mt-5">
              <a target="_blank" :href="txLink" style="text-decoration: none;">
                <CButton style="width: 148px; border-radius: 10px;" v-if="depositStep === 4" color="success"
                  class="text-white fw-bold d-flex justify-content-center">
                  <div class="d-flex align-items-center gap-2">
                    <div>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10.5 7.58333V11.0833C10.5 11.3928 10.3771 11.6895 10.1583 11.9083C9.9395 12.1271 9.64275 12.25 9.33333 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V4.66667C1.75 4.35725 1.87292 4.0605 2.09171 3.84171C2.3105 3.62292 2.60725 3.5 2.91667 3.5H6.41667"
                          stroke="white" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.75 1.75H12.25V5.25" stroke="white" stroke-width="1.16667" stroke-linecap="round"
                          stroke-linejoin="round" />
                        <path d="M5.83203 8.16667L12.2487 1.75" stroke="white" stroke-width="1.16667"
                          stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div>Receipt</div>
                  </div>
                </CButton>
              </a>

              <CButton style="width: 148px; border-radius: 10px;" v-if="depositStep === 4" @click="() => {
                $emit('changeVisibleDeposit');
                depositStep = 1
              }
                " color="success" class="text-white fw-bold d-flex justify-content-center">
                <div>Close</div>
              </CButton>

            </div>
          </div>
        </div>
      </div>
    </CModalBody>
  </CModal>
</template>

<script setup>

import info from '@/assets/images/info.svg'
import arrow_back from '@/assets/icons/arrow/arrow_back.svg'
import close_modal_icon from '@/assets/icons/arrow/close_modal_icon.svg'
import depositSuccessIcon from '@/assets/icons/deposit_success.svg'
import Slider from '@vueform/slider'
import { ref, defineProps, toRefs, computed, onBeforeMount, watch, watchEffect } from 'vue'
import Multiselect from 'vue-multiselect'
import { getTokenEntity } from '@/lib/helpers/util'
import useWithdrawMath from "@/composables/math/withdrawMath/useWithdrawMath"
import { usePoolActionBalances } from '@/composables/balances/usePoolActionBalances'
import { GetPoolShares } from "@/composables/pools/usePoolShares"
import useDecimals from "@/composables/useDecimals"
import { useExitPool } from "@/composables/poolActions/withdraw/useExitPool"
import { configService } from '@/services/config/config.service'
import { networkId, DisplayNetwork } from '@/composables/useNetwork'
import { bnum, formatNotificationDate } from '@/lib/utils'
import { formatUnits, parseUnits } from '@ethersproject/units'
import BigNumber from 'bignumber.js';
var emitter = require('tiny-emitter/instance');
const props = defineProps([
  'visibleWithdrawModal',
  'changeVisibleWithdraw',
  "pool", "tokens"
])

const { pool, visibleWithdrawModal } = toRefs(props)

const poolToken = ref({})
const balances = ref({})
const account = ref({})
const lineNumbers = ref([])
const lastTokenPrices = ref([])

watchEffect(() => {
  console.log('visibleWithdrawModal effect:', visibleWithdrawModal.value);
});

const poolShare = ref({})

const allTokens = computed(() => poolToken.value && poolToken.value[pool.value.address] ? Object.assign({}, pool.value.onchain.tokens, poolToken.value) : {})




const lineNumberPercent = ref(100)

const depositStep = ref(1)
const allOption = { name: "All", "symbol": pool.value.tokens.map(t => t.symbol).join("/") }
const selectedToken = ref(allOption)
const allSelectedTokens = ref(getAllSelectedTokens(selectedToken.value))
const allSelectedTokensDisplay = computed(() => {
  if (allSelectedTokens.value.length > 0) {
    return allSelectedTokens.value.map((t) => ({
      ...t,
      usdAmount: getUsdAmount(t),
      withdrawAmount: getTokenWithdrawAmount(t)
    }))
  }
  return []
})
const optionsTokens = ref([allOption, ...pool.value.tokens])
const isProportional = computed(() => allSelectedTokens.value.length > 1)
const tokenOut = computed(() => !isProportional.value ? allSelectedTokens.value[0].address : null)
const tokenOutAmount = computed(() => !isProportional.value ? getTokenWithdrawAmount(allSelectedTokens.value[0]) : null)
const tokenOutIndex = computed(() => !isProportional.value ? props.tokens.findIndex((t) => t == tokenOut.value) : null)
const { bptIn, bptBalance, singleAssetMaxes, proportionalPoolTokenAmounts, priceImpact, exactOut } = useWithdrawMath(pool, allTokens, lastTokenPrices, account, balances, poolShare, isProportional, tokenOut, tokenOutIndex, tokenOutAmount)
const txLink = ref('')
onBeforeMount(async () => {
  await init()
})

watch(visibleWithdrawModal, async () => {
  await init()
  console.log(lastTokenPrices.value)
})
watch(allSelectedTokens, async () => {
  await init()
})

async function init() {
  const poolAddress = pool.value.address
  const { balances: _balances, account: _account, lineNumbers: _lineNumbers, lastTokenPrices: _lastTokenPrices, provider } = await usePoolActionBalances([...props.tokens, poolAddress], pool.value.tokens)
  balances.value = _balances
  account.value = _account
  lineNumbers.value = _lineNumbers
  lastTokenPrices.value = _lastTokenPrices
  poolShare.value = await GetPoolShares(pool.value.id, account)
  const poolDecimals = await useDecimals(pool.value.address, provider)
  poolToken.value[poolAddress] = { decimals: poolDecimals, balance: _balances[pool.value.address] }
  allSelectedTokens.value = getAllSelectedTokens(selectedToken.value)

}

function getAllSelectedTokens(_selectedToken) {
  if (_selectedToken.name == "All")
    return pool.value.tokens
  return [_selectedToken]
}

function onSelect(_selectedToken) {
  allSelectedTokens.value = getAllSelectedTokens(_selectedToken)
}


function getTokenWithdrawAmount(token, slippage = false, decimals = null) {
  let return_value = 0
  if (allSelectedTokens.value.length == 1) {
    return_value = singleAssetMaxes.value ? singleAssetMaxes.value[pool.value.tokens.findIndex((t) => t.address ==
      token.address)] : 0
  }
  else {
    return_value = proportionalPoolTokenAmounts.value ? proportionalPoolTokenAmounts.value[pool.value.tokens.findIndex((t) =>
      t.address == token.address)] : 0
    if (slippage && decimals) {
      let amount = parseUnits(return_value, decimals).toString();
      amount = minusSlippageScaled(amount, decimals);

      return_value = formatUnits(amount, decimals);
    }
  }
  if (isNaN(return_value))
    return_value = 0
  return ((parseFloat(return_value) / 100) * lineNumberPercent.value).toFixed(6)
}

function minusSlippageScaled(amount, decimals) {
  const delta = bnum(amount)
    .times(100)
    .div(10000)
    .dp(0, BigNumber.ROUND_UP);

  return bnum(amount)
    .minus(delta).dp(decimals, BigNumber.ROUND_DOWN)
    .toFixed();
}

function getUsdAmount(token) {
  let return_value = getTokenWithdrawAmount(token) * lastTokenPrices.value[token.address]
  if (isNaN(return_value))
    return_value = 0
  return return_value.toFixed(4)
}

const usdSummary = computed(() => getUsdSummary())

function getUsdSummary() {
  let sum = 0
  for (let i = 0; i < allSelectedTokens.value.length; i++) {
    let token = allSelectedTokens.value[i]
    sum += lastTokenPrices.value[token.address] * getTokenWithdrawAmount(token)
  }
  if (isNaN(sum))
    return 0
  return sum.toFixed(4)
}
function roundDown(number, decimals) {
  decimals = decimals || 0;
  return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals)).toString();
}

async function OnWithdrawClick() {
  txLink.value = ""
  depositStep.value = 3
  let amountsOut = []
  if (allSelectedTokens.value.length > 1)
    amountsOut = allSelectedTokens.value.map((t, i) => getTokenWithdrawAmount(t, true, pool.value.tokens[i].decimals))
  else
    amountsOut = pool.value.tokens.map(t => t.address == allSelectedTokens.value[0].address ? roundDown(parseFloat(getTokenWithdrawAmount(t)), 4) : '0')
  let tokensOut = props.tokens
  const fractionBasisPoints = (parseInt(`${lineNumberPercent.value}4`) / 1000) * 100000;
  let propBpt = bnum(bptBalance.value)
    .times(fractionBasisPoints)
    .div(100000)
    .toFixed(pool.value.onchain.decimals)
  if (lineNumberPercent.value == 100)
    propBpt = bptBalance.value.toString()
  let outIndex = null
  if (allSelectedTokens.value.length == 1) {
    console.log(bptIn.value)
    if (lineNumberPercent.value != 100)
      outIndex = tokensOut.findIndex((t) => t == allSelectedTokens.value[0].address)
    propBpt = parseFloat(formatUnits(bptIn.value, pool.value.onchain.decimals)).toFixed(pool.value.onchain.decimals)
  }
  console.log(propBpt)
  console.log(bptBalance)
  console.log(exactOut)
  let tx = await useExitPool(pool, account.value, amountsOut, tokensOut, propBpt, lineNumberPercent.value == 100, outIndex)
  if (tx) {
    depositStep.value = 4
    txLink.value = `${configService.getNetworkConfig(networkId.value).explorer}/tx/${tx.hash}`
    emitter.emit('addNotification', {
      type: 'Withdraw',
      value: `${getUsdSummary()} USD - ${formatNotificationDate(new Date().getTime())}`,
      status: 'Success',
      hash: tx.hash,
      network: DisplayNetwork[networkId.value]
    });
    await init()
  }
  else {
    depositStep.value = 2
  }
}

</script>
<style lang="scss" scoped>
.modal_body_header {
  font-family: Poppins;
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.5px;
  color: white
}

.deposit-settled {
  border: 1px solid rgba(1, 180, 126, 0.6);
  border-radius: 20px;
  width: 100%;
  height: 400px;
  margin-bottom: 30px;
  margin-top: 30px;
  padding: 30px 40px;
}

.modal_body_inside {
  padding: 0px 110px;
}

.value-label {
  font-family: Poppins;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  color: rgba(193, 193, 209, 1);
}

.modal_preview_button {
  color: white;
  width: 100%;
  background: linear-gradient(89.26deg, #01B47E 5.07%, #7EF6B2 99.37%);
  border-radius: 20px;
  transition: ease-in-out;

  &:hover {
    background: #01B47E;

  }
}

:deep(.range-slider) {
  background: transparent;
  border-radius: 8px;
  padding: 0;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 12px;
  outline: none;
  transition: opacity 0.2s;
  position: relative;

  /* Styling the track */
  &::-webkit-slider-runnable-track {
    height: 12px;
    background: rgba(59, 97, 65, 0.11);
    border-radius: 8px;
  }

  &::-moz-range-track {
    height: 12px;
    background: #ffffff29;
    border-radius: 8px;
  }

  &::-moz-range-progress {
    background-color: #01b47e;
    height: 12px;
    border-radius: 8px 0 0 8px;
  }

  &::-ms-track {
    height: 12px;
    background: #ffffff29;
    border-radius: 8px;
  }

  /* Styling the thumb */
  &::-webkit-slider-thumb {
    width: 14px;
    height: 14px;
    background: #c1c1d1;
    border-radius: 50%;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -1px;
    /* necessary to center the thumb in the track */
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: #c1c1d1;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-ms-thumb {
    width: 14px;
    height: 14px;
    background: #c1c1d1;
    border-radius: 50%;
    cursor: pointer;
    margin-top: 0;
  }
}

.modal_stake_token {
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 20px;
  padding: 15px;
}

.modal_stake_token_inner {}

.modal_stake_token_inner_name {
  background-color: rgba(59, 97, 65, 0.14);
  border-radius: 17px;
  color: white;
  font-size: 14px;
  padding: 2px 18px;
}

.multiselect-tag.is-user {
  margin-bottom: 0px;

  border-radius: 20px;
  background: none;
  color: #ffffff;
}

.multiselect-tag.is-user img {
  width: 30px;
  border-radius: 50%;
  height: 30px;
}

.multiselect-tag.is-user i:before {
  color: #ffffff;
  border-radius: 50%;
}

.user-image {
  margin: 0 6px 0 0;
  border-radius: 50%;
  height: 30px;
}

:deep(.multiselect__tags) {
  min-height: 40px;
  min-width: 265px;
  max-width: 265px;
  display: block;

  border-radius: 17px;
  background: rgba(10, 36, 13, 1) !important;
  border: none !important;

  font-size: 14px;
}

.multiselect__tags-wrap {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 5px !important;
}

.multiselect__option--highlight {
  background: rgb(1, 180, 126) !important;
}

:deep(.multiselect__option) {
  background: rgba(10, 36, 13, 1) !important;
  color: white !important;

  &:hover {
    background: rgb(25, 87, 32) !important;
  }
}

:deep(.multiselect__element) {
  background: rgba(10, 36, 13, 1) !important;
  color: white !important;
}

.multiselect__option:hover {
  color: rgb(1, 180, 126) !important;
}

:deep(.multiselect__content-wrapper) {
  border: 1px solid rgba(10, 36, 13, 1) !important;
  background: rgba(10, 36, 13, 1) !important;

}

.multiselect__option.multiselect__option--highlight::after {
  background: rgba(15, 17, 19, 1) !important;
}

.multiselect__option--selected.multiselect__option--highlight::after {
  background: rgba(15, 17, 19, 1) !important;
}

.multiselect__option--selected {
  color: rgb(1, 180, 126) !important;
}

.multiselect__option--selected:hover {
  color: rgb(229, 83, 83) !important;
}

.multiselect__option {
  color: rgba(108, 114, 132, 1);
}


.multiselect__single {
  background: none !important;
  color: white !important;
}

.tag_close:hover {
  color: rgb(255, 146, 146);
  cursor: pointer;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>