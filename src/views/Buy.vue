<template>
  <MainCard>
    <TokenSelectModal
      :is-open="isTokenSelectModalOpen"
      :possible-tokens="possibleTokens"
      @close="isTokenSelectModalOpen = false"
      @updateToken="onTokenSelect"
    />

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
                  @click="() => (isTokenSelectModalOpen = true)"
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
                    <span style="margin-left: 5px">{{
                      tokenCurrency.symbol
                    }}</span>
                    <svg
                      style="margin-left: 10px"
                      width="9"
                      height="6"
                      viewBox="0 0 9 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.36011 0.0750122V1.95001L4.61011 5.92501L0.860107 1.95001V0.0750122H8.36011Z"
                        fill="#848E9C"
                      />
                    </svg>
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
                  @click="() => tokenSelectModalOpen()"
                  class="d-flex flex-column gap-2"
                >
                  <div style="color: #7d7d7d; font-size: 12px">
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
                    <span style="margin-left: 5px">{{
                      tokenCurrency.symbol
                    }}</span>
                    <svg
                      style="margin-left: 10px"
                      width="9"
                      height="6"
                      viewBox="0 0 9 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.36011 0.0750122V1.95001L4.61011 5.92501L0.860107 1.95001V0.0750122H8.36011Z"
                        fill="#848E9C"
                      />
                    </svg>
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
              <div class="referrals_button" @click="onBuyClick()">
                {{ selectedTab === 'Sell' ? $t('sell') : $t('buy') }}
              </div>
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
            ></apexchart>
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
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8 15.5C8.98491 15.5 9.96018 15.306 10.8701 14.9291C11.7801 14.5522 12.6069 13.9997 13.3033 13.3033C13.9997 12.6069 14.5522 11.7801 14.9291 10.8701C15.306 9.96018 15.5 8.98491 15.5 8C15.5 7.01509 15.306 6.03982 14.9291 5.12987C14.5522 4.21993 13.9997 3.39314 13.3033 2.6967C12.6069 2.00026 11.7801 1.44781 10.8701 1.0709C9.96018 0.693993 8.98491 0.5 8 0.5C6.01088 0.5 4.10322 1.29018 2.6967 2.6967C1.29018 4.10322 0.5 6.01088 0.5 8C0.5 9.98912 1.29018 11.8968 2.6967 13.3033C4.10322 14.7098 6.01088 15.5 8 15.5ZM6.95833 5.08333V3H9.04167V5.08333H6.95833ZM6.95833 13V7.16667H9.04167V13H6.95833Z"
                      fill="#848E9C"
                    />
                  </svg>
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
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8 15.5C8.98491 15.5 9.96018 15.306 10.8701 14.9291C11.7801 14.5522 12.6069 13.9997 13.3033 13.3033C13.9997 12.6069 14.5522 11.7801 14.9291 10.8701C15.306 9.96018 15.5 8.98491 15.5 8C15.5 7.01509 15.306 6.03982 14.9291 5.12987C14.5522 4.21993 13.9997 3.39314 13.3033 2.6967C12.6069 2.00026 11.7801 1.44781 10.8701 1.0709C9.96018 0.693993 8.98491 0.5 8 0.5C6.01088 0.5 4.10322 1.29018 2.6967 2.6967C1.29018 4.10322 0.5 6.01088 0.5 8C0.5 9.98912 1.29018 11.8968 2.6967 13.3033C4.10322 14.7098 6.01088 15.5 8 15.5ZM6.95833 5.08333V3H9.04167V5.08333H6.95833ZM6.95833 13V7.16667H9.04167V13H6.95833Z"
                      fill="#848E9C"
                    />
                  </svg>
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
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8 15.5C8.98491 15.5 9.96018 15.306 10.8701 14.9291C11.7801 14.5522 12.6069 13.9997 13.3033 13.3033C13.9997 12.6069 14.5522 11.7801 14.9291 10.8701C15.306 9.96018 15.5 8.98491 15.5 8C15.5 7.01509 15.306 6.03982 14.9291 5.12987C14.5522 4.21993 13.9997 3.39314 13.3033 2.6967C12.6069 2.00026 11.7801 1.44781 10.8701 1.0709C9.96018 0.693993 8.98491 0.5 8 0.5C6.01088 0.5 4.10322 1.29018 2.6967 2.6967C1.29018 4.10322 0.5 6.01088 0.5 8C0.5 9.98912 1.29018 11.8968 2.6967 13.3033C4.10322 14.7098 6.01088 15.5 8 15.5ZM6.95833 5.08333V3H9.04167V5.08333H6.95833ZM6.95833 13V7.16667H9.04167V13H6.95833Z"
                      fill="#848E9C"
                    />
                  </svg>
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
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8 15.5C8.98491 15.5 9.96018 15.306 10.8701 14.9291C11.7801 14.5522 12.6069 13.9997 13.3033 13.3033C13.9997 12.6069 14.5522 11.7801 14.9291 10.8701C15.306 9.96018 15.5 8.98491 15.5 8C15.5 7.01509 15.306 6.03982 14.9291 5.12987C14.5522 4.21993 13.9997 3.39314 13.3033 2.6967C12.6069 2.00026 11.7801 1.44781 10.8701 1.0709C9.96018 0.693993 8.98491 0.5 8 0.5C6.01088 0.5 4.10322 1.29018 2.6967 2.6967C1.29018 4.10322 0.5 6.01088 0.5 8C0.5 9.98912 1.29018 11.8968 2.6967 13.3033C4.10322 14.7098 6.01088 15.5 8 15.5ZM6.95833 5.08333V3H9.04167V5.08333H6.95833ZM6.95833 13V7.16667H9.04167V13H6.95833Z"
                      fill="#848E9C"
                    />
                  </svg>
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
import { ref, onMounted, computed, watch } from 'vue'
import { Token } from '@uniswap/sdk-core'
import { SwapType } from '@wavelength/sdk'

import MainCard from '@/UI/MainCard.vue'
import ChartTimeline from '@/UI/ChartTimeline.vue'
import TokenSelectModal from '@/components/modals/TokenSelectModal.vue'
import HowToBuyPPNTokens from '@/components/Buy/HowToBuyPPNTokens.vue'
import walletPoolsImg from '@/assets/icons/sidebarIcons/walletPoolsImage.svg'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { getTokenEntity } from '@/lib/helpers/util'
import { useVaultPPNHistory } from '@/composables/weighted/useVaultPPNHistory'
import { usePPNInfo } from '@/composables/ppn/usePPNInfo'
import { useFetchTokens } from '@/composables/tokens/useFetchTokens'
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
const ppnInfo = ref({
  priceUsd: 0,
  marketCap: 0,
  totalVolume: 0,
  circulatingSupply: 0,
})

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

const { tokens: possibleTokens } = useFetchTokens(56)
const { tokens: ppnTokens, fetchAmountOut } = usePPNInfo()

function onTokenSelect(token) {
  if (ppnTokens.value.some((item) => item.address === token.address)) {
    tokenCurrency.value = token
    isTokenSelectModalOpen.value = false
  } else {
    isTokenSelectModalOpen.value = true
    notify('error', 'Wrong Token', 'There is not a pool for the token')
  }
}

async function onBuyClick() {
  // const provider = await InitializeMetamask()
  // if (provider) {
  //   await swapPPNToken(
  //     convertedTokenCurrency.value,
  //     convertedTokenPPN.value,
  //     selectedTab.value == 'Buy' ? token0Amount.value : token1Amount.value,
  //     provider.getSigner(),
  //   )
  // }
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
  )
}

onMounted(async () => {
  chartData.value = await useVaultPPNHistory(56)
  // ppnInfo.value = await usePPNInfo()
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
