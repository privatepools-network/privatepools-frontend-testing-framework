<template>
  <MainCard maxWidth="74%">
    <div class="mb-5">
      <ChainSelector :excludeAll="true" @updateChain="(newChain) => (chainSelected = newChain)" />
    </div>
    <div class="d-flex flex-wrap justify-content-between gap-4 mb-xl-3 mb-2 mt-md-0 mt-2">
      <TotalWidget>
        <div class="d-flex justify-content-evenly w-100 align-items-center gap-1">
          <div>
            <div class="rewards_header">Total Value Lock</div>
            {{ console.log('tvls_widget', tvls_widget) }}
            <div v-if="tvls_widget.value === 0" class="totals_loader">
              <ThreeDots />
            </div>
            <div v-else class="fs-5">
              ${{ formatBigNumber(tvls_widget.value, 2) }}
            </div>
            <div class="d-flex align-items-center gap-1">
              <div className="rewards_percents">
                <div>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.3971 5.79989L11.7955 5.79989L11.7955 10.1983" stroke="#6BEBA4" stroke-width="1.02476"
                      stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.63628 11.959L11.7339 5.86139" stroke="#6BEBA4" stroke-width="1.02476"
                      stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div v-if="tvls_widget.value === 0" class="totals_loader_small">
                  <ThreeDots />
                </div>
                <div v-else>{{ tvls_widget.percent.toFixed(2) }}%</div>
              </div>
              <div class="rewards_text">from yesterday</div>
            </div>
          </div>
          <div>
            <CChart type="line" class="mt-2" style="
                height: 40px;
                width: 70px;
                filter: drop-shadow(0 0 0.5rem #01b47e);
              " :data="{
                labels: tvls_widget.chart.timestamps,
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(146, 254, 157, 0)',
                    borderColor: 'rgba(146, 254, 157, 1)',
                    data: tvls_widget.chart.data,
                    fill: true,
                    pointRadius: 0,
                    pointHitRadius: 0,
                  },
                ],
              }" :options="{
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false, // <-- this option disables tooltips
    },
  },

  maintainAspectRatio: false,
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
  elements: {
    line: {
      borderWidth: 2,
      tension: 0.4,
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
}" />
          </div>
        </div>
      </TotalWidget>
      <TotalWidget>
        <div class="d-flex justify-content-evenly w-100 align-items-center gap-1">
          <div>
            <div class="rewards_header">Total APR</div>
            <div v-if="tvls_widget.value === 0" class="totals_loader">
              <ThreeDots />
            </div>
            <div v-else class="fs-5">
              {{ formatBigNumber(totalAprWidget.value, 2) }}%
            </div>
            <div class="d-flex align-items-center gap-1">
              <div className="rewards_percents">
                <div>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.3971 5.79989L11.7955 5.79989L11.7955 10.1983" stroke="#6BEBA4" stroke-width="1.02476"
                      stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.63628 11.959L11.7339 5.86139" stroke="#6BEBA4" stroke-width="1.02476"
                      stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div v-if="tvls_widget.value === 0" class="totals_loader_small">
                  <ThreeDots />
                </div>
                <div v-else>
                  {{ formatBigNumber(totalAprWidget.percent, 2) }}%
                </div>
              </div>
              <div class="rewards_text">from yesterday</div>
            </div>
          </div>
          <div>
            <CChart type="line" class="mt-2" style="
                height: 40px;
                width: 70px;
                filter: drop-shadow(0 0 0.5rem #01b47e);
              " :data="{
                labels: totalAprWidget.chart.timestamps,
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(146, 254, 157, 0)',
                    borderColor: 'rgba(146, 254, 157, 1)',
                    data: totalAprWidget.chart.data,
                    fill: true,
                    pointRadius: 0,
                    pointHitRadius: 0,
                  },
                ],
              }" :options="{
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false, // <-- this option disables tooltips
    },
  },

  maintainAspectRatio: false,
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
  elements: {
    line: {
      borderWidth: 2,
      tension: 0.4,
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
}" />
          </div>
        </div>
      </TotalWidget>
      <TotalWidget>
        <div class="d-flex justify-content-evenly w-100 align-items-center gap-1">
          <div>
            <div class="rewards_header">Total Rewards</div>
            <div v-if="tvls_widget.value === 0" class="totals_loader">
              <ThreeDots />
            </div>
            <div v-else class="fs-5">
              ${{ formatBigNumber(totalRewardsWidget.value, 2) }}
            </div>
            <div class="d-flex align-items-center gap-1">
              <div className="rewards_percents">
                <div>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.3971 5.79989L11.7955 5.79989L11.7955 10.1983" stroke="#6BEBA4" stroke-width="1.02476"
                      stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.63628 11.959L11.7339 5.86139" stroke="#6BEBA4" stroke-width="1.02476"
                      stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div v-if="tvls_widget.value === 0" class="totals_loader_small">
                  <ThreeDots />
                </div>
                <div v-else>{{ totalRewardsWidget.percent }}%</div>
              </div>
              <div class="rewards_text">from yesterday</div>
            </div>
          </div>
          <div>
            <div class="rewards_button rewards_button_all" @click="claimRewards()">
              Claim Rewards
            </div>
          </div>
        </div>
      </TotalWidget>
    </div>

    <div class="mt-5">
      <div class="fs-5 text-white mb-3">Claim Rewards</div>
      <div class="d-flex flex-column gap-2">
        <div v-if="rewards.length === 0">
          <LoaderPulse />
        </div>
        <div v-else class="rewards_card" v-for="(item, i) in rewards" :key="`rewards-${i}`">
          <div class="d-flex align-items-center w-25">
            <img :src="getTokenEntity(item.symbol, 'short').icon" width="40" class="p-1" />

            <div class="d-flex flex-column">
              <div class="text-white">{{ item.name }}</div>
              <div class="rewards_card_symbol">{{ item.symbol }}</div>
            </div>
          </div>
          <div class="d-flex flex-column">
            <div class="rewards_card_header">Deposited Amount</div>
            <div class="rewards_card_value">{{ item['Deposited Amount'] }}</div>
          </div>
          <div class="d-flex flex-column">
            <div class="rewards_card_header">Total APR</div>
            <div class="rewards_card_value">
              {{ formatBigNumber(item.APR, 2) }}%
            </div>
          </div>
          <div class="d-flex flex-column">
            <div class="rewards_card_header">Rewards available</div>
            <div class="rewards_card_value">{{ item['Rewarded Amount'] }}</div>
          </div>
          <div>
            <div class="rewards_button rewards_button_single" @click="() => claimReward(item)">
              Claim Rewards
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainCard>
</template>
<script setup>
import MainCard from '@/UI/MainCard.vue'
import TotalWidget from '@/UI/TotalWidget.vue'
import { CChart } from '@coreui/vue-chartjs'
import ChainSelector from '@/UI/ChainSelectorV2.vue'
import { ref, onMounted, watch } from 'vue'
import { getTokenEntity } from '@/lib/helpers/util'
import { GetHistoricalTvl } from '@/composables/pools/snapshots/usePoolHistoricalTvl'
import { getTvlForTimestamp } from '@/lib/formatter/financialStatement/financialStatementFormatter'
import { calculatePercentageChange } from '@/composables/math/chartMath/trackingInfoMath'
import {
  DisplayNetwork,
  Network,
  ReversedDisplayNetwork,
} from '@/composables/useNetwork'
import { formatBigNumber } from '@/lib/utils'
import { GetPoolSwapsData } from '@/composables/pools/charts/usePoolSwapsData'
import { GetTokens } from '@/composables/tokens/useTokenSymbols'
import {
  isRightChain,
  isRightChainName,
} from '@/composables/pools/usePoolSwapsStats'
import { GetTokenPricesBySymbols } from '@/composables/balances/cryptocompare'
import { ethers } from 'ethers'
import { configService } from '@/services/config/config.service'
import { InitializeMetamask, selectNetwork } from '@/lib/utils/metamask'
import rewards_abi from '@/lib/abi/Rewards.json'
import { networkId } from '@/composables/useNetwork'
import { CalculateTotalTokenAPR } from '@/composables/math/chartMath/trackingInfoMath'
import { calculateAverage } from '@/lib/utils'
import ThreeDots from '@/components/loaders/ThreeDots.vue'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue';
import 'vue3-toastify/dist/index.css';


const popupType = ref("success")
const popupText = ref("Rewards claimed!")
const popupSubText = ref("Successfully claimed Rewards.")
const popupLink = ref("")

const notify = () => {
  toast(Toast, {
    closeOnClick: true,
    theme: "dark",
    type: popupType.value,
    autoClose: 5000,
    closeButton: false,
    position: toast.POSITION.TOP_RIGHT,
    data: {
      header_text: popupText.value,
      toast_text: popupSubText.value,
      tx_link: popupLink.value
    }

  });
}
// const notifyWalletNotConnected = () => {
//   toast(Toast, {
//     closeOnClick: true,
//     theme: "dark",
//     type: 'warning',
//     autoClose: false,
//     closeButton: false,
//     position: toast.POSITION.TOP_RIGHT,
//     data: {
//       header_text: 'Wallet not connected!',
//       toast_text: 'Please connect your wallet first.',
//       tx_link: popupLink.value
//     }
//   });
// }

// const notifyWrongNetwork = () => {
//   toast(Toast, {
//     closeOnClick: true,
//     theme: "dark",
//     type: 'warning',
//     autoClose: false,
//     closeButton: false,
//     position: toast.POSITION.TOP_RIGHT,
//     data: {
//       header_text: 'Wrong network!',
//       toast_text: 'You connected to wrong network.',
//       tx_link: popupLink.value
//     }

//   });
// }

const rewards = ref([])
const chainSelected = ref({})
const tvls_widget = ref({
  chart: {
    data: [],
    timestamps: [],
  },
  value: 0,
  percent: 0,
})
const totalRewardsWidget = ref({
  value: 0,
  percent: 0,
})
const totalAprWidget = ref({
  chart: {
    data: [],
    timestamps: [],
  },
  value: 0,
  percent: 0,
})

const tvls_data = ref([])
const swaps_data = ref([])
const tokens_data = ref([])
const prices = ref([])
async function InitRewardsData(network) {
  return await Promise.all([
    GetPoolSwapsData(null, network),
    GetTokens(network),
    GetHistoricalTvl(network, null),
  ])
}

onMounted(async () => {
  const networks = [
    process.env.VUE_APP_KEY_ARBITRUM ? Network.ARBITRUM : undefined,
    process.env.VUE_APP_KEY_BINANCE ? Network.BINANCE : undefined,
    process.env.VUE_APP_KEY_POLYGON ? Network.POLYGON : undefined,
  ].filter((n) => n != undefined)
  let data = await Promise.all(
    networks.map((network) => InitRewardsData(network)),
  )
  swaps_data.value = networks.map((n, i) => data[i][0]).flat()
  tokens_data.value = networks
    .map((n, i) =>
      data[i][1].map((item) => ({ ...item, Blockchain: DisplayNetwork[n] })),
    )
    .flat()
  tvls_data.value = networks
    .map((n, i) =>
      data[i][2].map((item) => ({ ...item, Blockchain: DisplayNetwork[n] })),
    )
    .flat()
  prices.value = await GetTokenPricesBySymbols(
    tokens_data.value
      .filter((item) => item.totalBalanceNotional > 0)
      .map((item) => item.symbol),
  )
  await UpdateStats()
})

watch(chainSelected, async () => {
  await UpdateStats()
})

watch(networkId, async () => {
  await UpdateStats()
})

async function UpdateStats() {
  rewards.value = []
  tvls_widget.value = {
    chart: {
      data: [],
      timestamps: [],
    },
    value: 0,
    percent: 0,
  }
  totalRewardsWidget.value = {
    value: 0,
    percent: 0,
  }
  totalAprWidget.value = {
    chart: {
      data: [],
      timestamps: [],
    },
    value: 0,
    percent: 0,
  }
  let filtered_tvls = tvls_data.value.filter((item) =>
    isRightChainName(item.Blockchain, chainSelected.value.name),
  )
  InitTvlWidget(filtered_tvls)
  let filtered_swaps = swaps_data.value.filter((item) =>
    isRightChain(item, chainSelected.value.name),
  )
  let filtered_tokens = tokens_data.value.filter((item) =>
    isRightChainName(item.Blockchain, chainSelected.value.name),
  )
  let conf = configService.getNetworkConfig(
    ReversedDisplayNetwork[chainSelected.value.name],
  )
  let provider = new ethers.providers.JsonRpcProvider(conf.rpc)
  let rewardsContract = null
  let available_tokens = []
  if (conf.addresses.rewards && provider) {
    rewardsContract = new ethers.Contract(
      conf.addresses.rewards,
      rewards_abi,
      provider,
    )
    let tokens = await rewardsContract.getTokens()
    if (filtered_tokens.length > 0)
      available_tokens = tokens.map(
        (t) =>
          filtered_tokens.find((item) => item.address == t.toLowerCase())
            .symbol,
      )
  }
  let results = []
  for (let i = 0; i < filtered_swaps.length; i++) {
    let swap = filtered_swaps[i]
    let found_token = filtered_tokens.find(
      (item) => item.address == swap.token.toLowerCase(),
    )
    let swap_symbol = found_token.symbol
    if (!available_tokens.includes(swap_symbol)) continue
    let found = results.find((item) => item.symbol == swap_symbol)
    if (!found) {
      found = {
        address: found_token.address,
        decimals: found_token.decimals,
        name: found_token.name,
        symbol: found_token.symbol,
        balance: found_token.totalBalanceNotional,
        profit: 0,
        profitUsd: 0,
        APR: 0,
        'Rewarded Amount': '0',
      }
      console.log(found)
      results.push(found)
    }
    found.profit += swap.profit
    found.profitUsd += swap.profitUsd
  }

  let token_rewards = Array(results.length).fill(0)
  if (rewardsContract) {
    let account = await rewardsContract.clientAdd() //'0xb51027d05ffbf77b38be6e66978b2c5b6467f615'//
    token_rewards = await Promise.all(
      results.map((r) => rewardsContract.tokenBalances(r.address, account)),
    )
  }
  results.forEach((item, index) => {
    item['price'] = prices.value[item['symbol']]
    item['Deposited Amount'] = `${formatBigNumber(item.balance, 4)} ${item.symbol
      } ($${formatBigNumber(item.balance * item.price, 2)})`
    let rewardAmount = ethers.utils.formatUnits(
      token_rewards[index],
      item.decimals,
    )
    let rewardUsd = rewardAmount * item.price
    item['Rewarded Amount'] = `${formatBigNumber(rewardAmount, 4)} ${item.symbol
      } ($${formatBigNumber(rewardUsd, 2)})`
    item['reward'] = rewardAmount
    item['rewardUsd'] = rewardUsd
    let token_related_tvls = filtered_tvls
      .filter((_item) =>
        _item.pool.tokens.map((t) => t.symbol).includes(item.symbol),
      )
      .reverse()
    item['APR'] = CalculateTotalTokenAPR(
      token_related_tvls,
      item,
      filtered_swaps,
      chainSelected.value.name,
    )
    item['APRYesterday'] = CalculateTotalTokenAPR(
      token_related_tvls,
      item,
      filtered_swaps,
      chainSelected.value.name,
      Date.now() / 1000 - 60 * 60 * 24,
    )
    item['PreviousAPRS'] = [item['APRYesterday']]
    for (let k = 2; k < 8; k++) {
      item['PreviousAPRS'].push(
        CalculateTotalTokenAPR(
          token_related_tvls,
          item,
          filtered_swaps,
          chainSelected.value.name,
          Date.now() / 1000 - 60 * 60 * 24 * k,
        ),
      )
    }
  })
  rewards.value = results
  totalRewardsWidget.value.value = rewards.value.reduce(
    (sum, value) => sum + value.rewardUsd,
    0,
  )
  totalAprWidget.value.value = calculateAverage(
    rewards.value.map((item) => item.APR),
  )
  let yesterdayApr = calculateAverage(
    rewards.value.map((item) => item.APRYesterday),
  )
  totalAprWidget.value.percent = calculatePercentageChange(
    yesterdayApr,
    totalAprWidget.value.value,
  )
  totalAprWidget.value.chart.data = []
  totalAprWidget.value.chart.timestamps = []
  let current_date = Date.now() / 1000
  for (let k = 1; k < 8; k++) {
    let ts = current_date - 60 * 60 * 24 * k
    let value = calculateAverage(
      rewards.value.map((item) => item['PreviousAPRS'][k - 1]),
    )
    totalAprWidget.value.chart.timestamps.push(ts)
    totalAprWidget.value.chart.data.push(value)
  }
  totalAprWidget.value.chart.timestamps =
    totalAprWidget.value.chart.timestamps.toReversed()
  totalAprWidget.value.chart.data = totalAprWidget.value.chart.data.toReversed()
}

function InitTvlWidget(historical_tvls) {
  tvls_widget.value = {
    chart: {
      data: [],
      timestamps: [],
    },
    value: 0,
    percent: 0,
  }
  let end = new Date() / 1000
  let tvl = getTvlForTimestamp(historical_tvls, end)
  tvls_widget.value.value = tvl
  let first = 0
  for (let i = 0; i < 7; i++) {
    let start = end - 60 * 60 * 24
    let tvl_for_day = getTvlForTimestamp(historical_tvls, start)
    tvls_widget.value.chart.data.push(tvl_for_day)
    tvls_widget.value.chart.timestamps.push(start)
    if (i == 0) first = tvl_for_day
    end -= 60 * 60 * 24
  }
  tvls_widget.value.chart.data = tvls_widget.value.chart.data.toReversed()
  tvls_widget.value.chart.timestamps =
    tvls_widget.value.chart.timestamps.toReversed()
  tvls_widget.value.percent = calculatePercentageChange(
    first,
    tvls_widget.value.value,
  )
}

async function claimRewards() {



  let conf = configService.getNetworkConfig(
    ReversedDisplayNetwork[chainSelected.value.name],
  )
  SetErrorTxPopup()
  if (conf.addresses.rewards) {
    let provider = await InitializeMetamask()
    await selectNetwork(ReversedDisplayNetwork[chainSelected.value.name])
    if (provider) {
      let signer = provider.getSigner()
      const rewardsContract = new ethers.Contract(
        conf.addresses.rewards,
        rewards_abi,
        signer,
      )
      try {

        let tx = await rewardsContract.withdrawAllRewards()
        let receipt = await tx.wait()
        if (receipt.status) {
          SetSuccessTxPopup(tx.hash)
        }
      }
      catch (e) {
        console.log("WITHDRAW ALL ERROR - ", e)
      }
    }
  }
  notify()
  // notifyWalletNotConnected()
  // notifyWrongNetwork()
}

function SetErrorTxPopup() {
  popupType.value = "error"
  popupText.value = "Error happened!"
  popupSubText.value = "Error happened during claiming rewards."
  popupLink.value = ``
}
function SetSuccessTxPopup(hash) {
  let conf = configService.getNetworkConfig(
    ReversedDisplayNetwork[chainSelected.value.name],
  )
  popupType.value = "success"
  popupText.value = "Rewards claimed!"
  popupSubText.value = "Successfully claimed Rewards."
  popupLink.value = `${conf.explorer}/tx/${hash}`
}

async function claimReward(item) {
  let conf = configService.getNetworkConfig(
    ReversedDisplayNetwork[chainSelected.value.name],
  )
  if (conf.addresses.rewards) {
    let provider = await InitializeMetamask()
    await selectNetwork(ReversedDisplayNetwork[chainSelected.value.name])
    if (provider) {
      let signer = provider.getSigner()
      const rewardsContract = new ethers.Contract(
        conf.addresses.rewards,
        rewards_abi,
        signer,
      )
      await rewardsContract.withdrawTokens(item.address)
    }
  }
  notify()
}
</script>
<style lang="scss" scoped>
.rewards_percents {
  display: flex;
  align-items: center;
  background-color: rgba(38, 102, 99, 0.2);
  padding: 0px 5px;
  border-radius: 10px;
  color: rgba(107, 235, 164, 1);
  font-weight: 600;
}

.rewards_header {
  font-family: Poppins;
  font-size: clamp(12px, 0.8vw, 16px);
  font-weight: 500;
}

.rewards_text {
  font-family: Poppins;
  font-size: clamp(8px, 0.7vw, 10px);
  font-weight: 300;
  line-height: 17px;
  letter-spacing: 0em;
  color: rgba(209, 209, 209, 1);
}

.rewards_button {
  font-size: clamp(8px, 0.7vw, 12px);
  font-weight: 600;
  line-height: 18px;
  text-align: center;
  color: #ffffff;

  border-radius: 111px;
  background: linear-gradient(214.25deg,
      rgba(18, 255, 113, 0.196) 6.73%,
      rgba(163, 164, 165, 0) 100.28%);
  box-shadow: 0px 9px 12px 0px #00000029;

  &_all {
    padding: 9px;
  }

  &_single {
    padding: 9px 22px;
  }

  &:hover {
    filter: drop-shadow(0 0 0.3rem #01b47e);
    cursor: pointer;
  }
}

.rewards_card {
  background: #121b198f;
  border-radius: 20px;

  padding: 12px 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  box-shadow: 0px 9px 12px 0px #00000029;

  &_symbol {
    font-size: clamp(8px, 0.8vw, 10px);
    font-weight: 600;
    line-height: 12px;
    color: #6c757d;
  }

  &_value {
    font-size: clamp(9px, 0.8vw, 11px);
    font-weight: 600;
    line-height: 12px;
    color: white;
  }

  &_header {
    font-size: clamp(12px, 0.8vw, 14px);
    font-weight: 600;
    line-height: 21px;
    letter-spacing: 0em;
    color: #343a40;
  }
}

.totals_loader {
  margin-left: 20px;
  margin-top: 8px;
  margin-bottom: 8px;

  &_small {
    transform: scale(0.3);
  }
}
</style>
