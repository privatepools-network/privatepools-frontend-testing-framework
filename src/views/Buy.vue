<template>
  <MainCard>
    <Modal
      v-if="isTokenSelectModalOpen"
      @close="isTokenSelectModalOpen = false"
      size="lg"
    >
      <template #body>
        <TokenSelectModal
          :tokenSelectModal="isTokenSelectModalOpen"
          @tokenSelectModalClose="isTokenSelectModalOpen = false"
          :pairIndex="pairIndex"
          @updateToken="onTokenSelect"
          :possibleComposeTokens="possibleTokens"
        />
      </template>
    </Modal>

    <div class="buy_container">
      <HowToBuyPPNTokens />

      <div class="buy_container_section_1">
        <div style="margin-top: -60px">
          <div class="my-4 text-black dark:!text-white font-medium text-3xl">
            {{ $t('trade_ppn_tokens') }}
          </div>
          <div class="buy_token_container bg-white dark:!bg-[#22222224]">
            <div class="d-flex">
              <div
                @click="selectedTab = 'Buy'"
                :class="
                  selectedTab === 'Sell'
                    ? 'buy_tab dark:!text-[#5e6673] text-black dark:!bg-[#02031C] bg-[#CBCBCB]'
                    : 'buy_tab_active dark:!text-[#02031C] text-black bg-white dark:!bg-[#00E0FF]'
                "
              >
                {{ $t('buy') }}
              </div>
              <div
                @click="selectedTab = 'Sell'"
                :class="
                  selectedTab === 'Buy'
                    ? 'buy_tab dark:!text-[#eaecef] text-black dark:!bg-[#02031C] bg-[#CBCBCB]'
                    : 'buy_tab_active dark:!text-[#02031C] text-black bg-white dark:!bg-[#00E0FF]'
                "
              >
                {{ $t('sell') }}
              </div>
            </div>
            <div class="d-flex flex-column gap-3 p-4">
              <div
                class="selector_button dark:!bg-[#22222224] bg-white dark:!text-[#eaecef] text-black"
              >
                <div class="d-flex flex-column gap-2">
                  <div>{{ $t('spend') }}</div>
                  <input
                    v-if="selectedTab === 'Buy'"
                    type="number"
                    placeholder="0.00"
                    style="
                      background: none;
                      border: none;
                      outline: none;
                      width: 180px;
                      color: rgb(193, 200, 206);
                      font-weight: 600;
                      font-size: 20px;
                    "
                    v-model="token0Amount"
                    @blur="onToken0Blur"
                    @focus="onToken0Focus"
                  />
                  <input
                    v-else
                    type="number"
                    placeholder="0.00"
                    style="
                      background: none;
                      border: none;
                      outline: none;
                      width: 180px;
                      color: rgb(193, 200, 206);
                      font-weight: 600;
                      font-size: 20px;
                    "
                    v-model="token1Amount"
                    @blur="onToken1Blur"
                    @focus="onToken1Focus"
                  />
                </div>
                <div
                  @click="onTokenSelectModalOpen"
                  class="d-flex flex-column gap-2"
                >
                  <div style="color: #7d7d7d; font-size: 12px">
                    {{ $t('balance') }}:
                    {{
                      selectedTab === 'Buy'
                        ? `${tokenCurrency.balance.toFixed(4)} ${
                            tokenCurrency.symbol
                          }`
                        : `${tokenPPN.balance.toFixed(4)} ${tokenPPN.symbol}`
                    }}
                  </div>
                  <div
                    v-if="selectedTab === 'Buy'"
                    class="text-[14px] mb-0 dark:!text-white text-black flex items-center gap-1"
                  >
                    <img
                      :src="getTokenEntity(tokenCurrency.symbol, 'short').icon"
                      width="18"
                    />
                    <span style="margin-left: 5px">
                      {{ tokenCurrency.symbol }}
                    </span>
                    <img :src="ArrowDownIcon" />
                  </div>
                  <div
                    v-else
                    class="text-[14px] mb-0 dark:!text-white text-black flex items-center gap-1"
                  >
                    <img :src="walletPoolsImg" />
                    <span style="margin-left: 5px">{{ tokenPPN.symbol }}</span>
                  </div>
                </div>
              </div>
              <div
                class="selector_button dark:!bg-[#22222224] bg-white dark:!text-[#eaecef] text-black"
              >
                <div class="d-flex flex-column gap-2">
                  <div>{{ $t('receive') }}</div>
                  <input
                    v-if="selectedTab == 'Buy'"
                    type="number"
                    placeholder="0.00"
                    style="
                      background: none;
                      border: none;
                      outline: none;
                      width: 180px;
                      color: rgb(193, 200, 206);
                      font-weight: 600;
                      font-size: 20px;
                    "
                    v-model="token1Amount"
                    @blur="onToken1Blur"
                    @focus="onToken1Focus"
                  />
                  <input
                    v-else
                    type="number"
                    placeholder="0.00"
                    style="
                      background: none;
                      border: none;
                      outline: none;
                      width: 180px;
                      color: rgb(193, 200, 206);
                      font-weight: 600;
                      font-size: 20px;
                    "
                    v-model="token0Amount"
                    @blur="onToken0Blur"
                    @focus="onToken0Focus"
                  />
                </div>
                <div
                  @click="isTokenSelectModalOpen = true"
                  class="d-flex flex-column gap-2"
                >
                  <div class="text-[#7d7d7d] text-[12px]">
                    {{ $t('balance') }}:
                    {{
                      selectedTab === 'Sell'
                        ? `${tokenCurrency.balance.toFixed(4)} ${
                            tokenCurrency.symbol
                          }`
                        : `${tokenPPN.balance.toFixed(4)} ${tokenPPN.symbol}`
                    }}
                  </div>
                  <div
                    v-if="selectedTab === 'Sell'"
                    class="text-[14px] mb-0 dark:!text-white text-black flex items-center gap-1"
                  >
                    <img
                      :src="getTokenEntity(tokenCurrency.symbol, 'short').icon"
                      width="18"
                    />
                    <span style="margin-left: 5px">
                      {{ tokenCurrency.symbol }}
                    </span>
                    <img :src="ArrowDownIcon" />
                  </div>
                  <div
                    v-else
                    class="text-[14px] mb-0 dark:!text-white text-black flex items-center gap-1"
                  >
                    <img :src="walletPoolsImg" />
                    <span style="margin-left: 5px">{{ tokenPPN.symbol }}</span>
                  </div>
                </div>
              </div>
              <button
                class="referrals_button flex flex-row items-center justify-center gap-1"
                @click="() => onBuyClick()"
              >
                {{ selectedTab === 'Sell' ? $t('sell') : $t('buy') }}
                <span v-if="isTrading" class="button_loader ml-0"></span>
              </button>
            </div>
          </div>
        </div>
        <div class="chart_container">
          <div
            class="d-flex justify-content-between dark:!text-white text-black"
          >
            <div>PPN/USDC</div>
            <div>${{ ppnInfo.priceUsd }}</div>
          </div>
          <div class="d-flex justify-content-between">
            <div class="flex items-center gap-2">
              <img :src="walletPoolsImg" width="18" />
              <img :src="getTokenEntity('USDC', 'short').icon" width="18" />
            </div>
            <div :class="priceChange < 0 ? 'text-danger' : 'text-success'">
              {{ priceChange }}%
            </div>
          </div>
          <div class="d-flex justify-content-end mt-4">
            <ChartTimeline
              :currentTimeline="currentTimeline"
              :timelines="timelines"
              @changeTimeline="(value) => (currentTimeline = value)"
            />
          </div>
          <div style="backdrop-filter: blur(10px)">
            <apexchart
              type="area"
              height="350"
              :options="chartOptions"
              :series="series"
            />
          </div>
        </div>
      </div>

      <div
        class="mt-[160px] mb-4 dark:!text-white text-black text-3xl font-normal"
      >
        {{ $t('private_pool_network_token') }}
      </div>
      <div class="flex gap-5">
        <div
          class="buy_balance_container w-full dark:!bg-[#22222224] bg-white dark:!text-white text-black"
        >
          <div class="text-lg font-bold">$PPN {{ $t('token') }}</div>
          <div class="d-flex justify-content-between mt-3">
            <div class="flex justify-between w-full md:flex-row flex-col gap-3">
              <div>
                <div
                  class="text-[10px] dark:!text-[#b7bdc6] text-black flex items-center gap-1"
                >
                  PPN {{ $t('price') }}
                  <img :src="InformationIcon" />
                </div>
                <div class="text-lg font-semibold dark:!text-white text-black">
                  ${{ ppnInfo.priceUsd }}
                </div>
              </div>

              <div>
                <div
                  class="text-[10px] dark:!text-[#b7bdc6] text-black flex items-center gap-1"
                >
                  {{ $t('market_cap') }}
                  <img :src="InformationIcon" />
                </div>
                <div class="text-lg font-semibold dark:!text-white text-black">
                  ${{ ppnInfo.marketCap }}
                </div>
              </div>

              <div>
                <div
                  class="text-[10px] dark:!text-[#b7bdc6] text-black flex items-center gap-1"
                >
                  {{ $t('volume') }}
                  <img :src="InformationIcon" />
                </div>
                <div class="text-lg font-semibold dark:!text-white text-black">
                  ${{ ppnInfo.totalVolume }}
                </div>
              </div>

              <div>
                <div
                  class="text-[10px] dark:!text-[#b7bdc6] text-black flex items-center gap-1"
                >
                  {{ $t('circulating_supply') }}
                  <img :src="InformationIcon" />
                </div>
                <div class="text-lg font-semibold dark:!text-white text-black">
                  {{ ppnInfo.circulatingSupply }}
                </div>
              </div>
            </div>
          </div>
          <div class="ppn_token_desc dark:!text-[#b7bdc6] text-black">
            {{ $t('ppn_is_desription_buy_page') }}
          </div>
        </div>
      </div>
    </div>
  </MainCard>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

import MainCard from '@/UI/MainCard.vue'
import Modal from '@/UI/Modal.vue'
import ChartTimeline from '@/UI/ChartTimeline.vue'
import TokenSelectModal from '@/components/modals/TokenSelectModal.vue'
import HowToBuyPPNTokens from '@/components/Buy/HowToBuyPPNTokens.vue'
import walletPoolsImg from '@/assets/icons/sidebarIcons/walletPoolsImage.svg'
import ArrowDownIcon from '@/assets/icons/arrow/arrow_down.svg'
import InformationIcon from '@/assets/icons/information.svg'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { getTokenEntity } from '@/lib/helpers/util'
import { useVaultPPNHistory } from '@/composables/weighted/useVaultPPNHistory'
import { usePPNInfo } from '@/composables/ppn/usePPNInfo'
import { useFetchTokens } from '@/composables/tokens/useFetchTokens'
import useBalance from '@/composables/useBalance'
import { notify } from '@/composables/notify'

const tokenPPN = ref({
  address: '0xC687E90f6a0a7e01d3fd03df2aABCeA7f323A845',
  symbol: 'PPN',
  balance: 0,
  decimals: 18,
})
const tokenCurrency = ref({
  address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  symbol: 'WBNB',
  balance: 0,
  decimals: 18,
})

const token0Amount = ref(0)
const token1Amount = ref(0)

const token0InitialAmount = ref(0)
const token1InitialAmount = ref(0)

const chartData = ref(null)
const priceChange = ref(0)

const ppnPool = ref(
  '0x6ed6da3cb4310efe95a315aacd934c5637d85407000200000000000000000009',
)

const timelines = [
  {
    name: '24H',
  },
  {
    name: '7D',
  },
  {
    name: '30D',
  },
  {
    name: '1Y',
  },
]

const currentTimeline = ref(timelines[1])

const series = computed(() => [
  {
    name: 'series1',
    data: chartData.value
      ? chartData.value[currentTimeline.value.name].data
      : [],
  },
])

const chartOptions = computed(() => ({
  chart: {
    // height: 250,
    type: 'area',
    toolbar: false,
  },
  dataLabels: {
    enabled: false,
  },
  colors: ['white'],
  stroke: {
    curve: 'smooth',
  },
  xaxis: {
    type: 'category',
    categories: chartData.value
      ? chartData.value[currentTimeline.value.name].dates
      : [],
    labels: {
      show: true,

      style: {
        colors: '#777',
        fontSize: '10px',
        fontFamily: 'Montserrat',
        fontWeight: 700,
      },
    },
  },
  yaxis: {
    opposite: true,
    labels: {
      show: true,
      formatter: (value) => {
        return `${value}K`
      },

      style: {
        colors: '#777',
        fontSize: '10px',
        fontFamily: 'Montserrat',
        fontWeight: 700,
      },
    },
  },
  tooltip: {
    theme: false,
    enabled: true,
    backgroundColor: 'rgba(89, 89, 89, 1), rgba(73, 73, 73, 0.45)',
    // eslint-disable-next-line
    custom({ series, dataPointIndex, w }) {
      return (
        '<div style="backdrop-filter: blur(10px); background: linear-gradient(rgba(89, 89, 89, 1), rgba(73, 73, 73, 0.45)); color:white; padding: 10px;">' +
        '<div style="display:flex; flex-direction:column; font-size: clamp(10px, 0.8vw, 14px)">' +
        '<span>' +
        '<span style="font-weight:700">' +
        'PPN Token Price ' +
        series[0][dataPointIndex] +
        ' ' +
        (series[0][dataPointIndex] === 1 ? '$' : '$') +
        '</span>' +
        '</div>' +
        '</div>'
      )
    },
  },
  grid: {
    show: true,
    borderColor: 'rgba(86, 87, 122, 0.4)',
    position: 'back',
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      position: 'back',
      lines: {
        show: true,
      },
    },
  },
}))

const selectedTab = ref('Buy')

const isTokenSelectModalOpen = ref(false)

const pairIndex = ref(1)

const isTrading = ref(false)

const { tokens: possibleTokens } = useFetchTokens(56)
const { tokens: ppnTokens, ppnInfo, fetchAmountOut, tradePPN } = usePPNInfo()

function onTokenSelectModalOpen() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })

  isTokenSelectModalOpen.value = true
}

function onTokenSelect(token, index) {
  const pool = ppnTokens.value.find((pool) =>
    pool.tokens.some((item) => item.address === token.address),
  )
  if (pool) {
    ppnPool.value = pool.id
    tokenCurrency.value = token
    isTokenSelectModalOpen.value = false
    pairIndex.value = index
  } else {
    isTokenSelectModalOpen.value = true
    notify('error', 'Wrong Token', 'There is not a pool for the token')
  }
}

async function onBuyClick() {
  const provider = await InitializeMetamask()
  if (token1InitialAmount.value == token1Amount.value || !provider) {
    return
  }
  if (isTrading.value) return

  isTrading.value = true
  const signer = provider.getSigner()
  await tradePPN(
    tokenCurrency,
    tokenPPN,
    selectedTab.value == 'Buy' ? token0Amount.value : token1Amount.value,
    ppnPool,
    signer,
  )
  isTrading.value = false
}

function onToken0Focus() {
  token0InitialAmount.value = token0Amount.value
}

function onToken1Focus() {
  token1InitialAmount.value = token1Amount.value
}

async function onToken0Blur() {
  const provider = await InitializeMetamask()
  if (token0InitialAmount.value == token0Amount.value || !provider) {
    return
  }

  token1Amount.value = await fetchAmountOut(
    tokenCurrency,
    tokenPPN,
    token0Amount,
    ppnPool,
  )
}

async function onToken1Blur() {
  const provider = await InitializeMetamask()
  if (token1InitialAmount.value == token1Amount.value || !provider) {
    return
  }

  token0Amount.value = await fetchAmountOut(
    tokenPPN,
    tokenCurrency,
    token1Amount,
    ppnPool,
  )
}

onMounted(async () => {
  const provider = await InitializeMetamask()
  if (provider) {
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    const [balance0, balance1] = await Promise.all([
      useBalance(tokenPPN.value.address, provider, address),
      useBalance(tokenCurrency.value.address, provider, address),
    ])

    tokenPPN.value.balance = parseFloat(balance0)
    tokenCurrency.value.balance = parseFloat(balance1)
  }
  chartData.value = await useVaultPPNHistory(56)
  // calcuate price change
  const timelineData = chartData.value[currentTimeline.value.name].data
  priceChange.value =
    timelineData[timelineData.length - 2] === 0
      ? timelineData[timelineData.length - 1] * 100
      : ((timelineData[timelineData.length - 1] -
          timelineData[timelineData.length - 2]) /
          timelineData[timelineData.length - 2]) *
        100
})
</script>
<style lang="scss" scoped>
@import '../styles/_variables.scss';

.buy_container {
  // display: flex;
  // justify-content: center;
  // width: 70%;
  padding-left: 200px;
  padding-right: 200px;

  @media (max-width: $xxl) {
    padding-left: 100px;
    padding-right: 100px;
  }
  @media (max-width: $md) {
    padding-left: 16px;
    padding-right: 16px;
  }

  &_section_1 {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 160px;
    gap: 30px;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
}

.buy_balance_container {
  // background: #22222224;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 4px 0px #00000040;
  border-radius: 16px;
  padding: 30px;
  backdrop-filter: blur(10px);
  font-size: clamp(10px, 0.8vw, 14px);
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0em;
  // color: white;
  height: fit-content;

  &_row {
    width: 150px;

    @media (max-width: $xxl) {
      width: 100px;
    }

    &_right {
      width: 150px;
      text-align: right;

      @media (max-width: $xxl) {
        width: 100px;
      }
    }
  }
}

.buy_token_container {
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 4px 0px #00000040;
  backdrop-filter: blur(10px);
  border-radius: 24px;
}

.buy_tab {
  width: 100%;
  border-radius: 16px 16px 0px 0px;
  // background: #2b3139;
  display: flex;
  justify-content: center;
  padding: 12px 60px;
  align-items: center;
  font-family: Arial;
  font-size: clamp(15px, 0.8vw, 19px);
  font-weight: 700;
  line-height: 28px;
  text-align: center;
  // color: #5e6673;

  &:hover {
    color: white;
    cursor: pointer;
  }
}

.buy_tab_active {
  width: 100%;
  border-radius: 16px 16px 0px 0px;
  font-size: clamp(15px, 0.8vw, 19px);
  position: relative;

  display: flex;
  justify-content: center;
  padding: 12px 60px;
  align-items: center;
  font-family: Arial;

  font-weight: 700;
  line-height: 28px;
  text-align: center;
  // color: #eaecef;
}

// .buy_tab_active:after {
//   background: #171717;
//   border-radius: 16px 16px 0px 0px;
//   bottom: 0;
//   content: ' ';
//   position: absolute;
//   right: -18px;
//   top: 0;
//   transform: skewX(11deg);
//   width: 24px;
// }

// .buy_tab_active:before {
//   background: #171717;
//   border-radius: 8px 16px 0px 0px;
//   bottom: 0;
//   content: ' ';
//   position: absolute;
//   left: -11px;
//   top: 0;
//   transform: skewX(171deg);
//   width: 24px;
// }

.selector_button {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0em;
  // color: #eaecef;

  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
  border: 1px solid #dceef633;
  border-radius: 30px;
  padding: 15px;
  display: flex;
  gap: 10px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0px;
  }
  &:hover {
    // background: #003e4f;
    cursor: pointer;
  }
}

.referrals_button {
  width: 100%;
  cursor: pointer;
  margin-top: 45px;
  margin-bottom: 5px;
  border-radius: 100px;
  box-shadow: 0px 2px 4px -1px #0000000d;

  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: #02031c;
  text-align: center;
  padding: 6px;
  background: #00e0ff;
  box-shadow: 0px 4px 8.899999618530273px 0px #00aae01a;

  &:hover {
    filter: drop-shadow(0 0 0.7rem #00c9ff);
    background: #00e0ff;
  }
}

.chart_container {
  font-size: clamp(16px, 0.8vw, 22px);
  font-weight: 700;
  width: 65%;
  letter-spacing: 0em;
  color: #eaecef;
  @media (max-width: 768px) {
    width: 100%;
  }
}

.ppn_token_desc {
  margin-top: 30px;
  margin-bottom: 30px;
  font-family: Arial;
  font-size: clamp(12px, 0.8vw, 16px);
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  // color: #b7bdc6;
}
</style>
