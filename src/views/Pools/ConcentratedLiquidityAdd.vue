<template>
  <Modal v-if="positionSelectModal" @close="positionSelectModalClose">
    <template #body>
      <SelectPositionModal
        :selectPositionModalState="positionSelectModal"
        :positions="selectPositions"
        @selectPositionHandler="(index) => selectPositionFunc(index)"
      />
    </template>
  </Modal>
  <MainCard>
    <div class="center_container bg-white dark:!bg-[#15151524]">
      <div class="d-flex justify-content-end w-100 mb-4">
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
      <div
        v-if="selectedPosition === null"
        class="my-24 flex justify-center items-center"
      >
        <svg
          class="rotate_and_transist"
          width="220"
          height="303"
          viewBox="0 0 320 403"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M160.003 258.305L160.003 3.05176e-05H163.782C250.017 3.05176e-05 320.003 70.2329 320.003 156.771V258.305H160.003Z"
            fill="url(#paint0_linear_329_3142)"
          />
          <path
            d="M160.003 0L160.003 403H156.223C69.9893 403 0.00292969 332.767 0.00292969 246.229L0.00292969 0L160.003 0Z"
            fill="url(#paint1_linear_329_3142)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_329_3142"
              x1="239.981"
              y1="258.305"
              x2="239.981"
              y2="3.05176e-05"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#00E0FF" stop-opacity="0" />
              <stop offset="1" stop-color="#00E0FF" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_329_3142"
              x1="79.9812"
              y1="0"
              x2="79.9812"
              y2="403"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#00E0FF" stop-opacity="0" />
              <stop offset="1" stop-color="#00E0FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="d-flex gap-5" v-else>
        <div class="w-50">
          <div
            class="compose_text dark:!text-white text-black dark:!bg-[#DCEEF605] bg-white compose_add_position text-uppercase fw-bolder d-flex align-items-center justify-content-between"
          >
            <div class="d-flex align-items-center gap-1">
              <img
                class="pair_avatars_manage_pool"
                v-for="(tokenEntity, tokenEntityIndex) in selectPositions[
                  selectedPositionIndex
                ].tokens"
                :key="`token-entity-key-${tokenEntityIndex}`"
                :title="tokenEntity"
                :src="getTokenEntity(tokenEntity, 'short').icon"
              />
              <span class="liquidity_title dark:!text-white text-black">{{
                selectPositions[selectedPositionIndex].name
              }}</span>
            </div>
            <div
              class="d-flex align-items-center gap-1"
              style="cursor: pointer"
              @click="positionSelectModalOpen()"
            >
              {{ selectPositions[selectedPositionIndex].CLP }}
              <svg
                width="13"
                height="8"
                viewBox="0 0 13 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.61182 1.5L6.61182 6.5L11.6118 1.5"
                  class="dark:!stroke-white stroke-black"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>

          <div class="concentrated_card dark:!bg-[#DCEEF605] bg-white">
            <div class="compose_text dark:!text-white text-black mb-3">
              {{ $t('manage_position') }}
            </div>

            <div class="mb-5">
              <apexchart
                type="radialBar"
                height="350"
                :options="chartOptions"
                :series="[0, 0]"
              ></apexchart>
              <img :src="grid" style="width: 100%; margin-top: -30px" />
            </div>

            <div class="tabs_container dark:!bg-[#22222224] bg-white">
              <div
                class="tabs_button dark:!text-white text-black"
                :class="
                  liquidityActionTab === 'Add' ? 'tabs_button_selected' : ''
                "
                @click="liquidityActionTab = 'Add'"
              >
                {{ $t('increase_liquidity') }}
              </div>
              <div
                class="tabs_button dark:!text-white text-black"
                :class="
                  liquidityActionTab === 'Withdraw'
                    ? 'tabs_button_selected'
                    : ''
                "
                @click="liquidityActionTab = 'Withdraw'"
              >
                {{ $t('remove_liquidity') }}
              </div>
            </div>
            <div v-if="liquidityActionTab === 'Add'">
              <div
                class="compose_text dark:!text-white text-black fw-light mt-3"
              >
                {{ $t('increase_liquidity') }}
              </div>
              <div class="price_range_container dark:!bg-[#02031C24] bg-white">
                <div class="d-flex flex-column gap-4 position-relative">
                  <!-- Add liquidity to singe comp on refactor week -->

                  <div
                    class="d-flex dark:!bg-[#02031C24] bg-white"
                    style="
                      /* background: #22222224; */
                      box-shadow: 0px 4px 4px 0px #00000040;

                      border-radius: 16px;
                    "
                  >
                    <div
                      class="balance_container dark:!bg-[#DCEEF605] bg-white"
                    >
                      <div
                        class="d-flex flex-column justify-content-around h-100"
                      >
                        <div class="d-flex align-items-center gap-2">
                          <img
                            :src="
                              pairToken1.img ||
                              getTokenEntity(pairToken1.symbol, 'short').icon
                            "
                            width="24"
                          />

                          <h4
                            style="font-size: 21px; margin-bottom: 0"
                            class="dark:!text-white text-black"
                          >
                            {{ pairToken1.symbol }}
                          </h4>
                        </div>
                        <div class="balance_text dark:!text-white text-black">
                          {{ $t('balance') }}:
                          <span class="font-['Roboto_Mono',_monospace]">
                            {{
                              (
                                (pairToken1.balance || 0) - depositAmount1
                              ).toFixed(2)
                            }}
                          </span>
                        </div>
                      </div>
                      <div
                        class="max_button dark:!bg-[#22222224] bg-white dark:!text-[#2ABDFF] text-[#2ABDFF]"
                        @click="depositAmount1 = pairToken1.balance"
                      >
                        {{ $t('max') }}
                      </div>
                    </div>
                    <div>
                      <div
                        class="d-flex flex-column gap-2 p-3 font-['Roboto_Mono',_monospace]"
                      >
                        <input
                          type="number"
                          style="
                            background: none;
                            border: none;
                            outline: none;
                            width: 180px;
                            /* color: #c1c8ce; */
                            font-weight: 600;
                            font-size: 20px;
                          "
                          class="dark:!text-white text-black"
                          v-model="depositAmount1"
                          @blur="updateDepositAmount2"
                        />
                        <div
                          style="font-size: 12px"
                          class="dark:!text-white text-[#858c90]"
                        >
                          ≈${{
                            (depositAmount1 * (pairToken1.price || 0)).toFixed(
                              2,
                            )
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="d-flex dark:!bg-[#02031C24] bg-white"
                    style="
                      /* background: #22222224; */
                      box-shadow: 0px 4px 4px 0px #00000040;
                      border-radius: 16px;
                    "
                  >
                    <div
                      class="balance_container dark:!bg-[#DCEEF605] bg-white"
                    >
                      <div
                        class="d-flex flex-column justify-content-around h-100"
                      >
                        <div class="d-flex align-items-center gap-2">
                          <img
                            :src="
                              pairToken2.img ||
                              getTokenEntity(pairToken2.symbol, 'short').icon
                            "
                            width="24"
                          />

                          <h4
                            style="font-size: 21px; margin-bottom: 0"
                            class="dark:!text-white text-black"
                          >
                            {{ pairToken2.symbol }}
                          </h4>
                        </div>
                        <div class="balance_text dark:!text-white text-black">
                          {{ $t('balance') }}:
                          <span class="font-['Roboto_Mono',_monospace]">
                            {{
                              (
                                (pairToken2.balance || 0) - depositAmount2
                              ).toFixed(2)
                            }}
                          </span>
                        </div>
                      </div>
                      <div
                        class="max_button dark:!bg-[#22222224] bg-white dark:!text-[#2ABDFF] text-[#2ABDFF]"
                        @click="depositAmount2 = pairToken2.balance"
                      >
                        {{ $t('max') }}
                      </div>
                    </div>
                    <div>
                      <div
                        class="d-flex flex-column gap-2 p-3 font-['Roboto_Mono',_monospace]"
                      >
                        <input
                          type="number"
                          style="
                            background: none;
                            border: none;
                            outline: none;
                            width: 180px;
                            /* color: #c1c8ce; */
                            font-weight: 600;
                            font-size: 20px;
                          "
                          class="dark:!text-white text-black"
                          v-model="depositAmount2"
                          @blur="updateDepositAmount1"
                        />
                        <div
                          style="font-size: 12px"
                          class="dark:!text-white text-[#858c90]"
                        >
                          ≈${{
                            (depositAmount2 * (pairToken2.price || 0)).toFixed(
                              2,
                            )
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="add_liquidity_button bg-[#00E0FF] rounded-full">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_1807_18018)">
                        <g clip-path="url(#clip1_1807_18018)">
                          <g clip-path="url(#clip2_1807_18018)">
                            <path
                              d="M6.58 0.000427246C6.42536 0.000427246 6.3 0.125787 6.3 0.280427V6.30043H0.28C0.12536 6.30043 0 6.42579 0 6.58043V7.42043C0 7.57506 0.12536 7.70043 0.28 7.70043H6.3V13.7204C6.3 13.8751 6.42536 14.0004 6.58 14.0004H7.42C7.57463 14.0004 7.7 13.8751 7.7 13.7204V7.70043H13.72C13.8746 7.70043 14 7.57506 14 7.42043V6.58043C14 6.42579 13.8746 6.30043 13.72 6.30043H7.7V0.280427C7.7 0.125787 7.57463 0.000427246 7.42 0.000427246H6.58Z"
                              fill="black"
                            />
                          </g>
                        </g>
                      </g>
                      <defs>
                        <clipPath id="clip0_1807_18018">
                          <rect
                            width="14"
                            height="14"
                            fill="black"
                            transform="translate(0 0.000427246)"
                          />
                        </clipPath>
                        <clipPath id="clip1_1807_18018">
                          <rect
                            width="14"
                            height="14"
                            fill="black"
                            transform="translate(0 0.000427246)"
                          />
                        </clipPath>
                        <clipPath id="clip2_1807_18018">
                          <rect
                            width="14"
                            height="14"
                            fill="black"
                            transform="translate(0 0.000427246)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
              <button
                :class="'concentrated_button mt-4'"
                v-if="concentratedLiquidityStep < 3"
                @click="addLiquidityHandler"
              >
                {{ $t('add_liquidity') }}
              </button>
              <div
                :class="'concentrated_button mt-4'"
                v-if="concentratedLiquidityStep === 3"
                @click="addLiquidityHandler"
              >
                {{ $t('approving_all_tokens_for_minting') }}
                <span class="button_loader pl-2"></span>
              </div>
              <div
                :class="'concentrated_button mt-4'"
                v-if="concentratedLiquidityStep === 4"
                @click="addLiquidityHandler"
              >
                {{ $t('minting_liquidity') }}
                <span class="button_loader pl-2"></span>
              </div>
            </div>
            <div v-else-if="liquidityActionTab === 'Withdraw'">
              <div
                class="compose_text dark:!text-white text-black fw-light mt-3"
              >
                {{ $t('withdraw_liquidity') }}
              </div>
              <div class="liquidity_slider dark:!bg-[#DCEEF605] bg-white">
                <div class="fee_tier_container dark:!bg-[#DCEEF605] bg-white">
                  <div
                    :class="
                      type.selected
                        ? 'fee_tier_container_card fee_tier_container_card__selected'
                        : 'fee_tier_container_card'
                    "
                    v-for="(type, i) in withdrawPercents"
                    :key="`tiers-${i}`"
                    @click="selectRange(type)"
                  >
                    <div class="dark:!text-white text-[#858c90]">
                      {{ type.name }}%
                    </div>
                  </div>
                </div>
                <div class="mt-3 p-2" style="pointer-events: none">
                  <Slider
                    v-model="lineNumberPercent"
                    :tooltips="false"
                    :min="0"
                    :max="100"
                    :step="1"
                    :value="80"
                    lazy="false"
                  />
                </div>
              </div>
              <div
                class="compose_text dark:!text-white text-black fw-light mt-3"
              >
                {{ $t('withdraw_tokens') }}
              </div>
              <div
                style="
                  /* background: #22222224; */
                  border-radius: 16px;
                  box-shadow: 0px 4px 4px 0px #00000040;
                  padding: 8px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
                class="dark:!bg-[#DCEEF605] bg-white"
              >
                <div class="d-flex gap-2 align-items-center">
                  <div>
                    <img
                      :src="getTokenEntity(pairToken1.symbol, 'short').icon"
                      width="40"
                    />
                  </div>
                  <div class="d-flex flex-column gap-1">
                    <div class="dark:!text-white text-black">
                      {{ pairToken1.symbol }}
                    </div>
                    <div style="color: #a3a3a3" class="font-['Roboto_Mono',_monospace]">
                      {{
                        (
                          (selectedPosition.amountReadable0 / 100) *
                          lineNumberPercent
                        ).toFixed(2)
                      }}
                    </div>
                  </div>
                </div>
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 12.998H13V18.998H11V12.998H5V10.998H11V4.99805H13V10.998H19V12.998Z"
                      fill="#00e0ff"
                    />
                  </svg>
                </div>
                <div class="d-flex gap-2 align-items-center">
                  <div class="d-flex flex-column gap-1">
                    <div class="dark:!text-white text-black">
                      {{ pairToken2.symbol }}
                    </div>
                    <div style="color: #a3a3a3" class="font-['Roboto_Mono',_monospace]">
                      {{
                        (
                          (selectedPosition.amountReadable1 / 100) *
                          lineNumberPercent
                        ).toFixed(2)
                      }}
                    </div>
                  </div>
                  <div>
                    <img
                      :src="getTokenEntity(pairToken2.symbol, 'short').icon"
                      width="40"
                    />
                  </div>
                </div>
              </div>

              <button
                :class="'concentrated_button mt-4'"
                @click="removeLiquidityHandler"
              >
                {{ $t('remove_liquidity') }}
              </button>
            </div>
          </div>
        </div>

        <div class="w-50">
          <ChartAndPoolInfo
            :token0="pairToken1"
            :token1="pairToken2"
            :minPriceRange="priceRange1"
            :maxPriceRange="priceRange2"
            :price="relativePrice"
            :concentratedLiquidityStep="concentratedLiquidityStep"
            :poolInfo="selectedPosition.pool"
            :tvl="poolTvl"
            :poolApr="poolApr"
          />
        </div>
      </div>
    </div>
  </MainCard>
</template>

<script setup>
import MainCard from '@/UI/MainCard.vue'
import grid from '@/assets/images/grid.png'
import ChartAndPoolInfo from '@/components/ComposePool/ChartAndPoolInfo.vue'
import not_found from '@/assets/icons/not_found.svg'
import { ref, onMounted, watch, computed } from 'vue'
import { fetchUniswapTokens } from '@/composables/tokens/useUniswapTokens'
import { networkId } from '@/composables/useNetwork'
import useBalance from '@/composables/useBalance'
import { ethers } from 'ethers'
import { fetchDataAndMerge } from '@/composables/pools/trades/fetch/useFetchTrades'
import Slider from '@vueform/slider'
import SelectPositionModal from '@/components/modals/SelectPositionModal.vue'
import {
  RemoveLiquidityFromPosition,
  fetchPositions,
  AddLiquidityToPosition,
  getPoolInfo,
} from '@/composables/concentrated-liquidity/cl'
import { getTokenEntity } from '@/lib/helpers/util'
import Modal from '@/UI/Modal.vue'
import { getSinglePrice } from '@/composables/data/pricesData'
import {
  getCLSinglePoolDetails,
  getCLTvls,
} from '@/composables/data/detailsData'
import { CalculateAvgApr } from '@/composables/math/chartMath/trackingInfoMath'
import { usePool30dProfit } from '@/composables/pools/usePoolSwapsStats'
import router from '@/router'
import { InitializeMetamask } from '@/lib/utils/metamask'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
const liquidityActionTab = ref('Add')
const lineNumberPercent = ref(100)

const positionSelectModal = ref(false)

function positionSelectModalClose() {
  positionSelectModal.value = false
}
function positionSelectModalOpen() {
  positionSelectModal.value = true
}

const positions = ref([])

const withdrawPercents = ref([
  {
    name: 25,
    selected: false,
  },
  {
    name: 50,
    selected: false,
  },
  {
    name: 75,
    selected: false,
  },
  {
    name: 100,
    selected: false,
  },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'radialBar',
    offsetY: -10,
    sparkline: {
      enabled: true,
    },
  },
  colors: ['#30DEFF'],
  plotOptions: {
    radialBar: {
      hollow: {
        margin: 15,
        size: '70%',
        dropShadow: {
          enabled: true,
          top: 0,
          left: 0,
          blur: 3,
          opacity: 0.5,
        },
      },
      startAngle: -100,
      endAngle: 100,
      track: {
        background: '#777',
        strokeWidth: '27%',
        margin: 10,
      },
      dataLabels: {
        name: {
          show: true,
          fontSize: '20px',

          fontWeight: 700,
          color: '#30DEFF',
          offsetY: -40,
        },
        value: {
          color: '#999',
          fontSize: '60px',
          fontFamily: 'Roboto Mono',
          show: true,
          fontWeight: 600,
        },
        total: {
          show: true,
          label: 'My APR',
          color: '#30DEFF',
          fontSize: '20px',
          
          fontWeight: 700,
          formatter: function (w) {
            // console.log('w', w)
            return `${w.globals.seriesTotals[0]}%`
          },
        },
      },
    },
  },
  grid: {
    padding: {
      top: -10,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      shadeIntensity: 0.4,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 53, 91],
    },
  },
  stroke: {
    lineCap: 'round',
  },
  labels: ['My APR'],
}))

const concentratedLiquidityStep = ref(1)

let selectedPosition = ref(null)
const additionalInfo1 = ref({})
const pairToken1 = computed(() => {
  if (!selectedPosition.value) {
    return {
      img: not_found,
      symbol: '',
    }
  }
  return { ...selectedPosition.value.token0, ...additionalInfo1.value }
})
const additionalInfo2 = ref({})
const pairToken2 = computed(() => {
  if (!selectedPosition.value) {
    return {
      img: not_found,
      symbol: '',
    }
  }
  return { ...selectedPosition.value.token1, ...additionalInfo2.value }
})

const depositAmount1 = ref(0)
const depositAmount2 = ref(0)

const priceRange1 = ref(0)
const priceRange2 = ref(0)

const mmProvider = computed(
  () => new ethers.providers.Web3Provider(window.ethereum),
)

const relativePrice = computed(() =>
  pairToken1.value.price && pairToken2.value.price
    ? pairToken1.value.price / pairToken2.value.price
    : 0,
)

function selectPositionFunc(index) {
  selectedPosition.value = positions.value[index]
  positionSelectModal.value = false
}

function selectRange(rng) {
  withdrawPercents.value.map((t) => (t.selected = false))
  rng.selected = true
  lineNumberPercent.value = rng.name
}

const notSelectedPossibleComposeTokens = ref([])

async function getTokenAdditionalInfo(token) {
  let user = await mmProvider.value.getSigner().getAddress()
  if (!mmProvider.value) {
    console.error('connect mm first')
    return
  }
  let price = await getSinglePrice(56, token.value.symbol)
  let balance = await useBalance(token.value.address, mmProvider.value, user)
  return { balance, price }
}

const poolInfo = ref(null)
const poolTvl = ref(0)
const poolSnapshots = ref([])
const trades = ref([])
const poolId = computed(() =>
  poolInfo.value ? poolInfo.value.address.toLowerCase() : '',
)
const poolApr = computed(() => {
  let formattedTvls = poolSnapshots.value.toReversed()
  formattedTvls = formattedTvls.map((item) => ({
    TVL: {
      'All Chains': parseFloat(item.totalValueLockedUSD),
      timestamp: item.timestamp,
    },
  }))
  let pool_trades = trades.value.filter((item) =>
    item.swaps[0].poolIdVault[0].includes(poolId.value),
  )
  let profit = usePool30dProfit(pool_trades).value
  return CalculateAvgApr(
    { Profits: profit },
    formattedTvls,
    'Monthly',
    'All Chains',
  )
})

watch(selectedPosition, async () => {
  if (selectedPosition.value) {
    additionalInfo1.value = {
      ...(await getTokenAdditionalInfo(pairToken1)),
      amount: selectedPosition.value.amountReadable0,
    }
    additionalInfo2.value = {
      ...(await getTokenAdditionalInfo(pairToken2)),
      amount: selectedPosition.value.amountReadable1,
    }
  }
})

watch(poolInfo, async () => {
  let [poolDetails, snapshots] = await Promise.all([
    getCLSinglePoolDetails(networkId.value, poolId.value),
    getCLTvls(networkId.value, poolId.value),
  ])
  console.log('HERE', snapshots, poolDetails)
  poolTvl.value = poolDetails.totalValueLockedUSD
  poolSnapshots.value = snapshots
})

onMounted(async () => {
  trades.value = await fetchDataAndMerge()
  await Init()
})

const selectedPositionIndex = computed((item) =>
  positions.value.indexOf(selectedPosition.value),
)
watch(networkId, async () => {
  await Init()
})

async function Init() {
  if (networkId.value) {
    notSelectedPossibleComposeTokens.value = await fetchUniswapTokens(
      networkId.value,
    )
    console.log(notSelectedPossibleComposeTokens.value)
    let provider = await InitializeMetamask()
    let signer = provider.getSigner()
    positions.value = await fetchPositions(
      signer,
      notSelectedPossibleComposeTokens.value,
      networkId.value,
      null,
      router.currentRoute.value.params['poolId'],
    )
    if (positions.value.length > 0) {
      selectedPosition.value = positions.value[0]
      poolInfo.value = await getPoolInfo(
        mmProvider.value,
        selectedPosition.value.token0,
        selectedPosition.value.token1,
        0,
      )
    }
  }
}

const selectPositions = computed(() =>
  positions.value.map((item, index) => ({
    tokens: [item.token0.symbol, item.token1.symbol],
    name: `CL-${item.token0.symbol}/${item.token1.symbol}`,
    fee: item.fee / 10000,
    positionSize: `${parseFloat(item.amountReadable0).toFixed(2)} ${
      item.token0.symbol
    } + ${parseFloat(item.amountReadable1).toFixed(2)} ${item.token1.symbol}`,
    CLP: `CLP #${index + 1}`,
  })),
)

const mountedModal = setInterval(() => {
  const onMountedActivity =
    router.currentRoute.value.params['onMountedActivity']

  console.log('onMountedActivity', onMountedActivity)
  console.log('router.currentRoute.value', router.currentRoute.value)
  if (onMountedActivity == 'deposit') {
    liquidityActionTab.value = 'Add'

    clearInterval(mountedModal)
  } else if (onMountedActivity == 'withdraw') {
    liquidityActionTab.value = 'Withdraw'
    clearInterval(mountedModal)
  } else {
    clearInterval(mountedModal)
  }
}, 100)

async function addLiquidityHandler() {
  try {
    if (!mmProvider.value) {
      console.error('Connect MM first')
      return
    }
    let signer = mmProvider.value.getSigner()
    await AddLiquidityToPosition(
      signer,
      selectedPosition.value,
      depositAmount1.value,
      depositAmount2.value,
      concentratedLiquidityStep,
    )
    concentratedLiquidityStep.value = 0
  } catch (e) {
    console.error(
      '[ADD LIQUIDITY ERROR] Error happened during adding liquidity ',
      e,
    )
  }
}
async function removeLiquidityHandler() {
  try {
    if (!mmProvider.value) {
      console.error('Connect MM first')
      return
    }
    let signer = mmProvider.value.getSigner()
    await RemoveLiquidityFromPosition(
      signer,
      selectedPosition.value,
      lineNumberPercent.value,
    )
    concentratedLiquidityStep.value = 3
  } catch (e) {
    console.error(
      '[REMOVE LIQUIDITY ERROR] Error happened during removing liquidity ',
      e,
    )
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.center_container {
  border: 1px solid #00e0ff24;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  margin: 1% 5% 5% 5%;
  padding: 2.5%;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.compose_text {
  font-size: clamp(11px, 0.8vw, 15px);
  // color: white;
}

.compose_add_position {
  // background: #DCEEF605;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  padding: 6px 12px;
  border-radius: 16px;
}

.concentrated_card {
  margin-top: 15px;
  // background: #DCEEF605;
  border: 1px solid #ffffff0d;
  border-radius: 16px;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  padding: 15px;
}

.liquidity_slider {
  border-radius: 16px;
  // background: #DCEEF605;
  padding: 16px;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
}

.price_range_container {
  // background: #DCEEF605;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  border-radius: 16px;
  padding: 8px;
}

.max_button {
  border-radius: 6px;
  box-shadow: 0px 4px 4px 0px #00000040;
  font-family: 'Syne', sans-serif;

  padding: 4px 8px;
  cursor: pointer;
}


.fee_tier_container {
  padding: 16px;
  border-radius: 16px;
  // background: #DCEEF605;

  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  width: 100%;
  display: flex;
  justify-content: space-between;

  &_card {
    width: 23%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 15px 5px;
    // background: #2f303230;
    
    font-size: clamp(8px, 0.7vw, 12px);
    font-weight: 400;
    line-height: 18px;
    text-align: center;
    border-radius: 10px;
    border: 1px solid #7c7c7ca6;
    cursor: pointer;

    &__selected {
      color: white;
      border: 1px solid #FFFFFF;
    }
  }
}

.price_range_container {
  // background: #DCEEF605;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  border-radius: 16px;
  padding: 8px;
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

.pair_avatars_manage_pool {
  width: 18px;
  margin-right: -2px;
}

.tabs_container {
  // background: #22222224;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 4px 0px #00000040;
  padding: 3px;
  display: flex;
  border-radius: 8px;
}

.tabs_button {
  border-radius: 6px;
  padding: 8px 12px;
  width: 50%;
  text-align: center;
  // color: #ffffff;
  
  font-size: 14px;
  font-weight: 500;

  &:hover {
    cursor: pointer;
    color: rgb(221, 221, 221);
  }

  &_selected {
    background: #00e0ff;
    color: #02031c !important;
    font-family: 'Syne', sans-serif;
  }
}

:deep(.apexcharts-radial-series) {
  filter: drop-shadow(0 0 0.35rem #00e0ff);
}

.liquidity_title {
  
  font-size: 20px;
  font-weight: 700;
  line-height: 33px;
  // color: #ffffff;
}

.balance_text {
  font-size: clamp(7px, 0.8vw, 12px);
}

.balance_container {
  width: 30%;
  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;

  border-radius: 16px;
  padding: 10px;
  // color: #c1c8ce;
  font-size: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

@media (max-width: $xxl) {
  .balance_container {
    width: 50%;
  }
}
</style>
