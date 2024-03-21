<template>
  <MainCard>
    <WithdrawModalV2
      :pool="pool"
      :visibleDepositModal="visibleDepositModal"
      @changeVisibleDeposit="changeVisibleDeposit"
      :usdSummary="
        (usdPoolShareValue > pool.totalShares * pool.lpPrice
          ? pool.totalShares * pool.lpPrice
          : usdPoolShareValue
        ).toFixed(4)
      "
      :priceImpact="(priceImpact * 100).toFixed(1)"
      :bptIn="bptIn"
      :bptBalance="bptBalance"
      :allPossibleTokens="allSelectedTokensDisplay"
      :allSelectedTokens="allSelectedTokens"
      :account="account"
      :lineNumberPercent="lineNumberPercent"
      :exactOut="exactOut"
      :poolShare="poolShare"
      :getTokenWithdrawAmount="getTokenWithdrawAmount"
      :init="init"
    />
    <div class="center_container">
      <CRow class="mb-4">
        <div class="d-flex align-items-center justify-content-between">
          <div class="caption-row">
            <div
              class="caption"
              style="
                font-size: clamp(10px, 0.9vw, 16px);
                font-weight: 700;
                color: white;
              "
            >
              {{
                pool?.tokens?.map((tokenEntity) => tokenEntity.symbol).join('/')
              }}
            </div>
            <div
              v-for="(poolToken, poolTokenIndex) in allSelectedTokensDisplay"
              :key="`pool-token-${poolTokenIndex}`"
              class="big-chip"
            >
              <CAvatar
                :src="getTokenEntity(poolToken.symbol, 'short').icon"
                class="big-chip__image"
              />
              <div class="big-chip__text">{{ poolToken.symbol }}</div>
              <div class="big-chip__text">{{ poolToken.weight }}%</div>
            </div>
          </div>
          <div class="back_button" @click="router.push('/pools')">
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

      <div class="d-flex align-items-start gap-5">
        <div class="deposit_choose">
          <div class="deposit_network_text">{{ chainSelected }}</div>
          <div class="deposit_text my-1">Withdraw from pool</div>

          <div class="d-flex flex-column gap-2 mt-4">
            <div class="deposit_text fw-bolder">You provided</div>

            <div class="modal_stake_token">
              <div>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="modal_stake_token_inner_name">
                    <svg
                      width="23"
                      height="23"
                      viewBox="0 0 23 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="11.5" cy="11.5" r="11.5" fill="#CFB428" />
                      <mask
                        id="mask0_5890_7370"
                        style="mask-type: alpha"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="23"
                        height="23"
                      >
                        <circle cx="11.5" cy="11.5" r="11.5" fill="#3E3E3E" />
                      </mask>
                      <g mask="url(#mask0_5890_7370)">
                        <rect
                          x="-7.2627"
                          y="4.27515"
                          width="19.4451"
                          height="19.4451"
                          transform="rotate(-30 -7.2627 4.27515)"
                          fill="#2A5CA9"
                        />
                      </g>
                    </svg>

                    {{
                      pool.tokens.map((t) => `${t.weight}${t.symbol}`).join('-')
                    }}
                  </div>
                  <input
                    v-if="poolShare.balance && !isNaN(poolShare.balance)"
                    class="token-input"
                    style="
                      color: rgb(168, 168, 168);
                      font-size: clamp(10px, 0.8vw, 14px);
                      font-weight: 500;
                      text-align: right;
                    "
                    @input="(e) => onShareInput(e)"
                    :value="usdPoolShareValue"
                    type="number"
                  />
                </div>
                <div>
                  <div
                    class="modal_balance_slider"
                    v-if="poolShare.balance && !isNaN(poolShare.balance)"
                  >
                    <div class="value-label" ref="inputRefLabel">
                      Balance:
                      <span class="fw-bold">{{
                        parseFloat(
                          poolShare.balance -
                            (poolShare.balance / 100) * lineNumberPercent,
                        ).toFixed(4)
                      }}</span
                      ><span
                        class="fw-bold bg-transparent"
                        style="cursor: pointer"
                        @click="
                          () => {
                            lineNumberPercent = 100
                            usdPoolShareValue = poolShare.balance * pool.lpPrice
                          }
                        "
                      >
                        Max</span
                      >
                    </div>
                    <div style="rgba(51, 51, 51, 1)">
                      ${{
                        (
                          ((poolShare.balance * pool.lpPrice) / 100) *
                          lineNumberPercent
                        ).toFixed(4)
                      }}
                    </div>
                  </div>
                  <div class="mt-2">
                    <Slider
                      v-model="lineNumberPercent"
                      @change="
                        (value) =>
                          (usdPoolShareValue =
                            ((poolShare.balance * pool.lpPrice) / 100) * value)
                      "
                      :tooltips="false"
                      :min="0"
                      :max="100"
                      :step="1"
                      :value="80"
                      lazy="false"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="deposit_text fw-bolder mt-3">You receive</div>
            <div>
              <div
                style="
                  border-radius: 16px;
                  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
                  background: #00000024;

                  border: 1px solid #ffffff0d;
                  color: white;
                  font-size: clamp(10px, 0.8vw, 14px);
                "
              >
                <div>
                  <div
                    v-for="(token, index) in allSelectedTokensDisplay"
                    :key="`tokens-key-${index}`"
                    class="d-flex align-items-center justify-content-between px-3 gap-3"
                  >
                    <!-- <div class="d-flex flex-column align-items-start text-white">
                    <div>{{ token.withdrawAmount }} {{ token.symbol }}</div>
                    <div>${{ token.usdAmount }}</div>
                  </div>
                  <div class="d-flex align-items-center">
                    <img :src="getTokenEntity(token.symbol, 'short').icon" width="60" class="p-3" />
               
                  </div> -->

                    <div
                      class="p-2 d-flex align-items-center justify-content-between gap-2 w-100"
                     
                    >
                      <div class="d-flex align-items-center gap-2">
                        <img
                          :src="getTokenEntity(token.symbol, 'short').icon"
                          width="38"
                        />
                        <div class="d-flex flex-column">
                          <div style="font-size: 12px; color: #ffffff">
                            {{ token.symbol }} 25%
                          </div>
                          <div style="font-size: 10px; color: #8e8e8e">
                            {{ token.symbol }}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="d-flex flex-column align-items-end">
                          <div style="font-size: 12px; color: #ffffff">
                            {{ token.withdrawAmount }}
                          </div>
                          <div
                            style="font-size: 10px; color: #8e8e8e"
                            class="d-flex align-items-center gap-1"
                          >
                            ${{ token.usdAmount }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div class="modal_total_container my-4">
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
                      class="w-25 fw-bold"
                      style="
                        border-right: 1px solid rgba(163, 164, 165, 0.2);
                        padding: 8px;
                      "
                    >
                      Price Impact
                    </td>
                    <td style="padding: 8px">
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <div class="w-25 fw-bold">
                          {{ (priceImpact * 100).toFixed(1) }}%
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div
            class="compose_pool_connect_wallet"
            @click="changeVisibleDeposit"
          >
            Preview
          </div>
        </div>
      </div>
    </div>
  </MainCard>
</template>
<script setup>
import MainCard from '@/UI/MainCard.vue'
import { getTokenEntity } from '@/lib/helpers/util'
import { ref } from 'vue'
import Slider from '@vueform/slider'

import WithdrawModalV2 from '@/components/modals/WithdrawModalV2.vue'
import { computed, onBeforeMount, watch } from 'vue'
import useWithdrawMath from '@/composables/math/withdrawMath/useWithdrawMath'
import { usePoolActionBalances } from '@/composables/balances/usePoolActionBalances'
import { GetPoolShares } from '@/composables/pools/usePoolShares'
import useDecimals from '@/composables/useDecimals'
import { bnum } from '@/lib/utils'
import { formatUnits, parseUnits } from '@ethersproject/units'
import BigNumber from 'bignumber.js'
import { getJsonRpcProvider } from '@/composables/useProvider'
import { networkId } from '@/composables/useNetwork'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'
import 'vue3-toastify/dist/index.css'
import router from '@/router'

const pool = ref({
    "id": "0xdb13210d52a2d9bbc12fd4444e05f74d5f906d24000100000000000000000014",
    "name": "25AVAX-25BTCB-25MATIC-25SOL",
    "address": "0xdb13210d52a2d9bbc12fd4444e05f74d5f906d24",
    "poolType": "Weighted",
    "swapFee": "0.01",
    "tokensList": [
        "0x1ce0c2827e2ef14d5c4f29a091d735a204794041",
        "0x570a5d26f7765ecb712c0924e4de545b89fd43df",
        "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
        "0xcc42724c6683b7e57334c4e856f4c9965ed682bd"
    ],
    "totalLiquidity": 1300.4913998702796,
    "totalSwapVolume": "6.67",
    "totalSwapFee": "0.07",
    "totalShares": "10.145521404190972448",
    "owner": "0x4bde150b69408dafbe4833f0d7b9689246a6597b",
    "factory": "0xda1116ec45ca0ae4874557a04875ada9e6eeca9b",
    "amp": null,
    "createTime": 1707950801,
    "swapEnabled": true,
    "volume24h": "0",
    "fees24h": "0",
    "apr": {
        "total": "0"
    },
    "tokens": [
        {
            "name": "Avalanche",
            "symbol": "AVAX",
            "decimals": 18,
            "address": "0x1ce0c2827e2ef14d5c4f29a091d735a204794041",
            "balance": "7.195153658952430465",
            "weight": 25,
            "id": "0x1ce0c2827e2ef14d5c4f29a091d735a204794041",
            "userBalance": "0.0"
        },
        {
            "name": "SOLANA",
            "symbol": "SOL",
            "decimals": 18,
            "address": "0x570a5d26f7765ecb712c0924e4de545b89fd43df",
            "balance": "2.625205516038463106",
            "weight": 25,
            "id": "0x570a5d26f7765ecb712c0924e4de545b89fd43df",
            "userBalance": "0.0"
        },
        {
            "name": "BTCB Token",
            "symbol": "BTCB",
            "decimals": 18,
            "address": "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
            "balance": "0.005930503974917702",
            "weight": 25,
            "id": "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
            "userBalance": "0.0"
        },
        {
            "name": "Matic Token",
            "symbol": "MATIC",
            "decimals": 18,
            "address": "0xcc42724c6683b7e57334c4e856f4c9965ed682bd",
            "balance": "369.659292532285235211",
            "weight": 25,
            "id": "0xcc42724c6683b7e57334c4e856f4c9965ed682bd",
            "userBalance": "0.0"
        }
    ],
    "mainIndex": null,
    "tokenRates": null,
    "holdersCount": "2",
    "swapsCount": "3",
    "linearPools": null,
    "createdAt": "Feb.15, 2024",
    "timeAgo": "12 days ago",
    "lpPrice": 128.18379145433224,
    "onchain": {
        "tokens": {
            "0x1CE0c2827e2eF14D5C4f29a091d735A204794041": {
                "decimals": 18,
                "balance": "7.195153658952430465",
                "weight": "0.25"
            },
            "0x570A5D26f7765Ecb712C0924E4De545B89fD43dF": {
                "decimals": 18,
                "balance": "2.625205516038463106",
                "weight": "0.25"
            },
            "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c": {
                "decimals": 18,
                "balance": "0.005930503974917702",
                "weight": "0.25"
            },
            "0xCC42724C6683B7E57334c4E856f4c9965ED682bD": {
                "decimals": 18,
                "balance": "369.659292532285235211",
                "weight": "0.25"
            }
        },
        "amp": "0",
        "swapEnabled": true,
        "totalSupply": "10.145521404190972448",
        "decimals": 18,
        "swapFee": "0.01"
    }
})

const tokens = [
    "0x1ce0c2827e2ef14d5c4f29a091d735a204794041",
    "0x570a5d26f7765ecb712c0924e4de545b89fd43df",
    "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
    "0xcc42724c6683b7e57334c4e856f4c9965ed682bd"
]



const poolToken = ref({})
const balances = ref({})
const account = ref({})
const lineNumbers = ref([])
const lastTokenPrices = ref([])
const usdPoolShareValue = ref(0.1)

// watchEffect(() => {
//   console.log('visibleWithdrawModal effect:', visibleWithdrawModal.value)
// })

const poolShare = ref({})

const allTokens = computed(() =>
  poolToken.value && poolToken.value[pool.value.address]
    ? Object.assign({}, pool.value.onchain.tokens, poolToken.value)
    : {},
)

const lineNumberPercent = ref(100)

const allOption = {
  name: 'All',
  symbol: pool.value.tokens.map((t) => t.symbol).join('/'),
}
const selectedToken = ref(allOption)
const allSelectedTokens = ref(getAllSelectedTokens(selectedToken.value))
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
//const optionsTokens = ref([allOption, ...pool.value.tokens])
const isProportional = computed(() => allSelectedTokens.value.length > 1)
const tokenOut = computed(() =>
  !isProportional.value ? allSelectedTokens.value[0].address : null,
)
const tokenOutAmount = computed(() =>
  !isProportional.value
    ? getTokenWithdrawAmount(allSelectedTokens.value[0])
    : null,
)
const tokenOutIndex = computed(() =>
  !isProportional.value
    ? tokens.findIndex((t) => t == tokenOut.value)
    : null,
)
const {
  bptIn,
  bptBalance,
  singleAssetMaxes,
  proportionalPoolTokenAmounts,
  priceImpact,
  exactOut,
} = useWithdrawMath(
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

onBeforeMount(async () => {
  await init()
})

// watch(visibleWithdrawModal, async () => {
//   await init()
//   console.log(lastTokenPrices.value)
// })
watch(allSelectedTokens, async () => {
  await init()
})

async function init() {
  const poolAddress = pool.value.address
  const {
    balances: _balances,
    account: _account,
    lineNumbers: _lineNumbers,
    lastTokenPrices: _lastTokenPrices,
  } = await usePoolActionBalances(
    [...tokens, poolAddress],
    pool.value.tokens,
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
  lastTokenPrices.value = _lastTokenPrices
  poolShare.value = await GetPoolShares(pool.value.id, account)
  usdPoolShareValue.value = poolShare.value.balance * pool.value.lpPrice

  allSelectedTokens.value = getAllSelectedTokens(selectedToken.value)
}

function getAllSelectedTokens(_selectedToken) {
  if (_selectedToken.name == 'All') return pool.value.tokens
  return [_selectedToken]
}

function getTokenWithdrawAmount(token, slippage = false, decimals = null) {
  let return_value = 0
  if (allSelectedTokens.value.length == 1) {
    return_value = singleAssetMaxes.value
      ? singleAssetMaxes.value[
          pool.value.tokens.findIndex((t) => t.address == token.address)
        ]
      : 0
  } else {
    return_value = proportionalPoolTokenAmounts.value
      ? proportionalPoolTokenAmounts.value[
          pool.value.tokens.findIndex((t) => t.address == token.address)
        ]
      : 0
    if (slippage && decimals) {
      let amount = parseUnits(return_value, decimals).toString()
      amount = minusSlippageScaled(amount, decimals)

      return_value = formatUnits(amount, decimals)
    }
  }
  if (isNaN(return_value)) return_value = 0
  return ((parseFloat(return_value) / 100) * lineNumberPercent.value).toFixed(6)
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
    e.target.value / ((poolShare.value.balance * pool.value.lpPrice) / 100)
  if (percent > 100) lineNumberPercent.value = 100
  else lineNumberPercent.value = percent
}

const visibleDepositModal = ref(false)

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
    visibleDepositModal.value = !visibleDepositModal.value
  }
}
</script>
<style lang="scss" scoped>
.center_container {
  background: #15151524;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  margin: 1% 10% 10% 10%;
  padding: 2.5%;
  border-radius: 16px;
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
  background: #22222224;
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
  background: #00000024;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
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
  padding: 15px;
  border-radius: 16px;
  background: #15151524;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
}

.modal_balance_slider {
  margin-top: 20px;
  color: white;
  font-size: clamp(10px, 0.8vw, 14px);
  display: flex;
  justify-content: space-between;
}

.modal_stake_token_inner_name {
  border-radius: 17px;
  background: rgba(76, 76, 76, 0.14);
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
  padding: 13px 8px;
  font-size: 12px;
  color: white;
  border: 0px;
  border-radius: 8px;
  background: linear-gradient(89deg, #00c9ff 1.58%, #0094ff 100.04%);
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.05),
    0px 4px 6px -1px rgba(0, 0, 0, 0.05);
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  // transition-duration: 0.3s;
  text-shadow: 1px 1px 2px black;

  &:hover {
    color: #fff;
    background: #00c9ff;
    box-shadow: 0px 12px 24px 0px rgba(#00c9ff, 0.2),
      0px 4px 8px 0px rgba(#00c9ff, 0.3);
  }
}
</style>
