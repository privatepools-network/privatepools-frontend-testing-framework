<template>
  <Modal v-if="tokenSelectModal" @close="tokenSelectModalClose" size="lg">
    <template #body>
      <TokenSelectModal
        :tokenSelectModal="tokenSelectModal"
        @tokenSelectModalClose="tokenSelectModalClose"
        :pairIndex="pairIndex"
        @updateToken="updateToken"
        :possibleComposeTokens="notSelectedPossibleComposeTokens"
        @addToken="onAddToken"
      />
    </template>
  </Modal>

  <MainCard>
    <div class="buy_container">
      <HowToBuyPPNTokens />

      <div class="buy_container_section_1">
        <div style="margin-top: -60px">
          <div
            style="
              color: white;
              font-size: clamp(24px, 0.8vw, 40px);
              font-weight: 700;
            "
            class="my-4"
          >
            Trade PPN Tokens
          </div>
          <div class="buy_token_container bg-white dark:!bg-[#171717]">
            <div class="d-flex">
              <div
                @click="selectedTab = 'Buy'"
                :class="selectedTab === 'Sell' ? 'buy_tab dark:!text-[#5e6673] text-black dark:!bg-[#2b3139] bg-[#CBCBCB]' : 'buy_tab_active dark:!text-white text-black bg-white dark:!bg-[#171717]'"
              >
                Buy
              </div>
              <div
                @click="selectedTab = 'Sell'"
                :class="selectedTab === 'Buy' ? 'buy_tab dark:!text-[#eaecef] text-black dark:!bg-[#2b3139] bg-[#CBCBCB]' : 'buy_tab_active dark:!text-white text-black bg-white dark:!bg-[#171717]'"
              >
                Sell
              </div>
            </div>
            <div class="d-flex flex-column gap-3 p-4">
              <div class="selector_button dark:!bg-[#22222224] bg-white dark:!text-[#eaecef] text-black">
                <div class="d-flex flex-column gap-2">
                  <div>Spend</div>
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
                  @click="() => tokenSelectModalOpen()"
                  class="d-flex flex-column gap-2"
                >
                  <div style="color: #7d7d7d; font-size: 12px">
                    Balance:
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
              <div class="selector_button dark:!bg-[#22222224] bg-white dark:!text-[#eaecef] text-black">
                <div class="d-flex flex-column gap-2">
                  <div>Receive</div>
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
                    Balance:
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
              <div class="referrals_button" @click="buyClick()">
                {{ selectedTab === 'Sell' ? 'Sell' : 'Buy' }}
              </div>
            </div>
          </div>
        </div>
        <div class="chart_container" style="width: 65%">
          <div class="d-flex justify-content-between dark:!text-white text-black">
            <div>PPN/USDC</div>
            <div>$65.62</div>
          </div>
          <div class="d-flex justify-content-between">
            <div class="flex items-center gap-2">
              <img :src="walletPoolsImg" width="18" />
              <img :src="getTokenEntity('USDC', 'short').icon" width="18" />
            </div>
            <div class="text-success">+0.59%</div>
          </div>
          <div class="d-flex justify-content-end mt-4">
            <ChartTimeline
              :currentTimeline="currentTimeline"
              :timelines="timelines"
              @changeTimeline="changeTimeline"
            />
          </div>
          <div>
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
        class=" mt-[160px] mb-5 dark:!text-white text-black text-3xl font-bold"
      >
        Private Pool Network Token
      </div>
      <div class="d-flex gap-5">
        <div class="buy_balance_container dark:!bg-[#22222224] bg-white dark:!text-white text-black">
          <div class="text-lg font-bold">$PPN Token</div>
          <div class="d-flex justify-content-between mt-3">
            <div class="d-flex justify-content-between w-100 gap-3">
              <div>
                <div class="text-[10px] dark:!text-[#b7bdc6] text-black flex items-center gap-1">
                  PPN Price
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
                <div class="text-lg font-semibold dark:!text-white text-black" >$65.62</div>
              </div>

              <div>
                <div class="text-[10px] dark:!text-[#b7bdc6] text-black flex items-center gap-1">
                  Market Cap
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
                  $1,997.25B
                </div>
              </div>

              <div>
                <div class="text-[10px] dark:!text-[#b7bdc6] text-black flex items-center gap-1">
                  Volume
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
                <div class="text-lg font-semibold dark:!text-white text-black">A$85.66B</div>
              </div>

              <div>
                <div class="text-[10px] dark:!text-[#b7bdc6] text-black flex items-center gap-1">
                  Circulation Supply
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
                <div class="text-lg font-semibold dark:!text-white text-black">19.65M</div>
              </div>
            </div>
          </div>
          <div class="ppn_token_desc   dark:!text-[#b7bdc6] text-black">
            PPN is a blockchain gaming ecosystem. Gamers can explore different
            type of games and have their experiences interact across each other
            on the Gala platform. The PPN token is the utility token and primary
            medium of exchange of the ecosystem. PPN is a blockchain gaming
            ecosystem. Gamers can explore different type of games and have their
            experiences interact across each other on the Gala platform. The PPN
            token is the utility token and primary medium of exchange of the
            ecosystem.
          </div>
        </div>
      </div>
    </div>
  </MainCard>
</template>

<script setup>
import Tabs from '@/UI/Tabs.vue'
import { InitializeMetamask } from '@/lib/utils/metamask'
import MainCard from '../UI/MainCard.vue'
import { ref, onMounted, computed } from 'vue'
import { getTokenEntity } from '@/lib/helpers/util'
import TokenSelectModal from '@/components/modals/TokenSelectModal.vue'
import walletPoolsImg from '@/assets/icons/sidebarIcons/walletPoolsImage.svg'
import ChartTimeline from '@/UI/ChartTimeline.vue'
import HowToBuyPPNTokens from '@/components/Buy/HowToBuyPPNTokens.vue'
import useBalance from '@/composables/useBalance'
import useDecimals from '@/composables/useDecimals'
import { Token } from '@uniswap/sdk-core'
import {
  GetCLPoolInfo,
  quoteCL,
  SwapCLTokens,
} from '@/composables/poolActions/swap/cl/swap'
import { useUniswapPPNHistory } from '@/composables/concentrated-liquidity/useUniswapPPNHistory'
import Modal from '@/UI/Modal.vue'

const tokenPPN = ref({
  address: '0x0cfa47331af179f9b932ae87f447f675a2b500d1',
  symbol: 'PPN',
  balance: 0,
  decimals: 18,
})
// const tokenPPN = ref({
//   address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
//   symbol: "DAI",
//   balance: 0,
//   decimals: 18
// })
const tokenCurrency = ref({
  address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  symbol: 'WBNB',
  balance: 0,
  decimals: 18,
})

const convertedTokenPPN = computed(
  () =>
    new Token(
      56,
      tokenPPN.value.address,
      tokenPPN.value.decimals,
      tokenPPN.value.symbol,
      tokenPPN.value.symbol,
    ),
)
const convertedTokenCurrency = computed(
  () =>
    new Token(
      56,
      tokenCurrency.value.address,
      tokenCurrency.value.decimals,
      tokenCurrency.value.symbol,
      tokenCurrency.value.symbol,
    ),
)

const token0Amount = ref(0)
const token1Amount = ref(0)

const poolInfo = ref(null)
const chartData = ref(null)

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

function changeTimeline(tl) {
  currentTimeline.value = tl
}

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
    height: 250,
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
        fontFamily: 'Poppins',
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
        fontFamily: 'Poppins',
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
      console.log(w)
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

// function changeSelectedTab(_new) {
//   selectedTab.value = _new
// }

const tokenSelectModal = ref(false)
function tokenSelectModalClose() {
  tokenSelectModal.value = false
}
function tokenSelectModalOpen() {
  tokenSelectModal.value = true
}
const notSelectedPossibleComposeTokens = ref([])

const address = ref(null)

onMounted(async () => {
  const provider = await InitializeMetamask()
  if (provider) {
    const signer = provider.getSigner()
    address.value = await signer.getAddress()
    const [balance0, balance1] = await Promise.all([
      useBalance(tokenPPN.value.address, provider, address.value),
      useBalance(tokenCurrency.value.address, provider, address.value),
    ])
    tokenPPN.value.balance = parseFloat(balance0)
    tokenCurrency.value.balance = parseFloat(balance1)
    const [decimals1, decimals2] = await Promise.all([
      useDecimals(tokenPPN.value.address, signer),
      useDecimals(tokenCurrency.value.address, signer),
    ])
    tokenPPN.value.decimals = decimals1
    tokenCurrency.value.decimals = decimals2
    poolInfo.value = await GetCLPoolInfo(
      convertedTokenPPN.value,
      convertedTokenCurrency.value,
      500,
      signer,
    )
  }
  chartData.value = await useUniswapPPNHistory(56)
  console.log('DATA - ', chartData.value)
})

async function buyClick() {
  const provider = await InitializeMetamask()
  if (provider) {
    await SwapCLTokens(
      convertedTokenPPN.value,
      convertedTokenCurrency.value,
      poolInfo.value,
      selectedTab.value == 'Buy' ? token0Amount.value : token1Amount.value,
      provider.getSigner(),
      selectedTab.value == 'Buy' ? 'in' : 'out',
    )
  }
}

const token0InitialAmount = ref(0)
const token1InitialAmount = ref(0)

function onToken0Focus() {
  token0InitialAmount.value = token0Amount.value
  console.log(token0Amount.value)
}

function onToken1Focus() {
  token1InitialAmount.value = token1Amount.value
  console.log(token1Amount.value)
}

async function onToken0Blur() {
  if (token0InitialAmount.value == token0Amount.value) {
    return
  }
  const secondAmount = await quoteCL(
    convertedTokenPPN.value,
    convertedTokenCurrency.value,
    poolInfo.value,
    token0Amount.value,
    'in',
  )
  token1Amount.value = secondAmount
}
async function onToken1Blur() {
  if (token1InitialAmount.value == token1Amount.value) {
    return
  }
  const secondAmount = await quoteCL(
    convertedTokenPPN.value,
    convertedTokenCurrency.value,
    poolInfo.value,
    token1Amount.value,
    'out',
  )
  token0Amount.value = secondAmount
}
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

  &_section_1 {
    display: flex;
    justify-content: space-between;
    margin-top: 160px;
    gap: 30px;
  }
}

.buy_balance_container {
  // background: #22222224;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 4px 0px #00000040;
  border-radius: 16px;
  padding: 30px;
  font-family: Poppins;
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
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  border-radius: 20px;
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
  font-family: Poppins;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0em;
  // color: #eaecef;

  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
  border: 1px solid #ffffff0d;
  border-radius: 16px;
  padding: 15px;
  display: flex;
  gap: 10px;
  align-items: center;

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
  border-radius: 4px;
  font-family: Poppins;
  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  padding: 6px;
  background: linear-gradient(45deg, #00e0ff 0%, #0e3e9b 100%);
  box-shadow: 0px 4px 8.899999618530273px 0px #00aae01a;

  &:hover {
    filter: drop-shadow(0 0 0.7rem #00c9ff);
    background: #00e0ff;
  }
}

.chart_container {
  font-family: Poppins;
  font-size: clamp(16px, 0.8vw, 22px);
  font-weight: 700;
  letter-spacing: 0em;
  color: #eaecef;
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
