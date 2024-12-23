<template>
  <MainCard>
    <CRow class="d-flex align-items-center">
      {{ console.log('account!!!!', account) }}
      <div class="portfolio mt-4">
        <PortfolioBalance :account="account" :performers="performers" :balanceUsd="balanceData.total ?? 0"
          :balance_ETH="balanceData.total_ETH ?? 0" :balance_BTC="balanceData.total_BTC ?? 0"
          :rewardsData="rewardsData ? Object.values(rewardsData).flatMap((item) => item.formatted_rewards) : []" />

        <div class="portfolio-chart">
          <PortfolioChart :all_chart_data="portfolioData.chart" :networks_data="portfolioData.cardStats"
            :tokensData="tokensData" :chainSelected="chainSelected.name" :rewardsData="rewardsData" />
        </div>

        <SectionsTabs :filterEye="true" style="margin-bottom: 44px" :tabsOptions="currentVersion === 'pro'
          ? [
            t('investments'),
            t('financial_statement'),
            t('statistics'),
            // 'Pairs & Tokens',
          ]
          : [t('investments')]
          " :selectedTab="activeTab" @changeTab="changeActiveTab" />

        <div class="portfolio-statistics" v-if="activeTab == t('statistics')">
          <PortfolioStatistics :historical_tvl="historical_tvl" :tokensData="portfolioData && portfolioData.pools
            ? portfolioData.pools.flatMap((p) =>
              p.tokens.map((t) => ({
                ...t,
                Blockchain: chainSelected.name,
              })),
            )
            : []
            " :drawdownKey="'User Liquidity'" :poolSwapsData="poolSwapsData" :chainSelected="chainSelected"
            :chartData="portfolioData.chart" :historicalPrices="historicalPrices" :userFirstTimestamp="historical_tvl.length > 0
              ? historical_tvl[historical_tvl.length - 1].timestamp * 1000
              : Date.now()
              " :tokenPairs="chainPairs" :statistics="portfolioData.statistics">
          </PortfolioStatistics>
        </div>
        <div class="portfolio-financial-statement" v-else-if="activeTab == t('financial_statement')">
          <PoolDetailsFinancialStatement :all_data="portfolioData.financialStatement" :poolSwapsData="poolSwapsData"
            :chainSelected="chainSelected" :historical_tvl="historical_tvl" :historicalPrices="historicalPrices"
            :symbol="currencySymbol" :decimals="currencyDecimals">
          </PoolDetailsFinancialStatement>
        </div>
        <div class="portfolio-table" v-else-if="activeTab == t('investments')">
          <div class="text-black dark:!text-white fw-medium fs-6 mb-3">
            {{ $t('investments') }}
          </div>
          {{ console.log('loader', loader) }}
          <InvestmentsTable :user_staked_pools="selectedInvestmentData" :all_pools="selectedInvestmentData"
            :rewardsData="rewardsData" :loader="loader" />
        </div>

        <div class="portfolio-table mt-5" v-if="activeTab == t('investments')">
          <div class="text-black dark:!text-white fw-medium fs-6 mb-3">
            {{ $t('portfolio_activity') }}
          </div>
          <PrivatePoolsTable :loader="loader" :all_activities="portfolioData.activity ? portfolioData.activity : []
            " />
        </div>
      </div>
    </CRow>
  </MainCard>

</template>
<script setup>
import { CRow } from '@coreui/vue'
import { computed, onMounted, ref, watch } from 'vue'
import PortfolioChart from '@/components/portfolio/PortfolioChart.vue'
import InvestmentsTable from '@/components/General/InvestmentsTable.vue'
import PortfolioStatistics from '@/components/portfolio/PortfolioStatistics.vue'
// import PortfolioFinancialStatement from '@/components/portfolio/PortfolioFinancialStatement.vue'
import PoolDetailsFinancialStatement from '@/components/PoolsDetails/PoolDetailsFinancialStatement'
import router from '@/router'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { DisplayNetwork, networkId } from '@/composables/useNetwork'
import { ethers } from 'ethers'
import MainCard from '@/UI/MainCard.vue'
import { GetUserPools } from '@/composables/portfolio/useUserPools'
import { GetPoolSwapsData } from '@/composables/pools/charts/usePoolSwapsData'
import { GetPoolHistoricValues } from '@/composables/pools/charts/usePoolHistoricValues'
import { GetHistoricalTvl } from '@/composables/pools/snapshots/usePoolHistoricalTvl'
import { GetTokenPairs } from '@/composables/pools/useTokenPairs'
import {
  excludeKeysFromObject,
  median,
  calculatePercentageDifference,
} from '@/lib/utils'
import { FormatHistoricalTvl } from '@/lib/formatter/poolTvlFormatter'
import { Network } from '@/composables/useNetwork'
import { isRightChainName } from '@/composables/pools/usePoolSwapsStats'
import { GetUserHistoricalBalances } from '@/composables/portfolio/usePortfolioHistoricalBalances'
import { GetActivePeriodsSwapsData } from '@/lib/formatter/portfolio/portfolioSwapsFormatter'
import { GetUserUniswapPools } from '@/composables/wallet/useWalletPools'
import PortfolioBalance from '@/components/portfolio/PortfolioBalance.vue'
import PrivatePoolsTable from '@/components/General/PrivatePoolsTable.vue'
import {
  getPortfolioData,
  getPortfolioBalance,
} from '@/composables/data/portfolioData'
import { getPoolsRewards } from '@/composables/data/rewardsData'
import { t } from 'i18next'
import SectionsTabs from '@/UI/SectionsTabs'

import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'

const settingsStore = useSettings()

const { currentCurrency, currentVersion } = storeToRefs(settingsStore)

const currencySymbol = computed(() =>
  currentCurrency.value == 'USD' ? '$' : currentCurrency.value,
)
const currencyDecimals = computed(() => (currentCurrency == 'USD' ? 2 : 5))

const NetworkUnsupported = ref(false)
const networksSupported = ref(false)

const chainSelected = ref({ name: 'All Chains', code: 'ALL', img: '' })

const onDatatableRowClick = (_, index) => {
  router.push({
    name: 'Investment Details',
    params: {
      id: pools.value[index].id,
    },
  })
}

const pools = ref(null)
const pairs = ref(null)
const activities = ref(null)
const hideSmallerThan10Pools = ref(false)
const loader = ref(false)

const investementModes = ['Pools']

const investmentDataMap = {
  Pools: pools,
  Pairs: pairs,
}

const selectedInvestmentData = computed(() => {
  if (!process.env.VUE_APP_LOCAL_API) {
    let data = investmentDataMap[selectedInvestmentsMode.value].value
    if (!data) return null
    if (hideSmallerThan10Pools.value) {
      data = data.filter((el) => el.TVL.fullAmount > 10)
    }
    let formatted = data.map((item) => excludeKeysFromObject(item, ['id']))
    return formatted
  } else {
    let data =
      selectedInvestmentsMode.value == 'Pools'
        ? portfolioData.value.pools
        : portfolioData.value.pairs
    if (!data) return []
    if (hideSmallerThan10Pools.value) {
      data = data.filter((el) => el.TVL.fullAmount > 10)
    }
    console.log('INVESTMENTS DATA ', data)
    return data
  }
})

const chain_swaps_data = computed(() => {
  if (!networks_data.value || networks_data.value.length == 0) return []

  let swaps_data = networks
    .map((n, i) =>
      isRightChainName(DisplayNetwork[n], chainSelected.value.name)
        ? networks_data.value[i][1]
        : [],
    )
    .flat()

  return swaps_data
})

const performers = computed(() => {
  if (!process.env.VUE_APP_LOCAL_API) {
    let pools_info = []
    if (chain_swaps_data.value.length == 0) return {}
    for (let i = 0; i < chain_swaps_data.value.length; i++) {
      let swap = chain_swaps_data.value[i]
      if (!swap) continue
      let poolId = swap['swaps'][0]['poolIdVault'][0]
      let poolInfo = pools_info.find((p) => p.id == poolId)
      if (!poolInfo) {
        poolInfo = { id: poolId, profit: 0 }
        pools_info.push(poolInfo)
      }
      let profit = parseFloat(swap.profitUsd)
      poolInfo.profit += profit
    }
    if (pools_info.length == 0) return {}
    let pools_median = median(pools_info.map((p) => p.profit))
    pools_info = pools_info.map((p) => ({
      ...p,
      diff: p.profit - pools_median,
      percent_diff: calculatePercentageDifference(pools_median, p.profit),
    }))
    pools_info.sort((a, b) => a.diff - b.diff)
    let lastIndex = pools_info.length - 1
    let best = {
      diff: pools_info[lastIndex].diff,
      percent_diff: pools_info[lastIndex].percent_diff,
      id: pools_info[lastIndex].id,
      tokens: FindPoolSymbols(pools_info[lastIndex].id),
    }
    let worst = {
      diff: pools_info[0].diff,
      percent_diff: pools_info[0].percent_diff,
      id: pools_info[0].id,
      tokens: FindPoolSymbols(pools_info[0].id),
    }
    return {
      best,
      worst,
    }
  } else {
    const pools = portfolioData.value.pools
    console.log('POOLS ', pools)
    if (!pools || pools.length == 0) {
      return {}
    }
    const median_profit = median(pools.map((item) => item['User Profits']))
    pools.sort((a, b) => b['User Profits'] - a['User Profits'])
    const last_index = pools.length - 1
    let best = {
      diff: pools[0]['User Profits'] - median_profit,
      percent_diff: calculatePercentageDifference(
        median_profit,
        pools[0]['User Profits'],
      ),
      id: pools[0].id,
      tokens: pools[0]['Pool Name'][0],
    }
    let worst = {
      diff: pools[last_index]['User Profits'] - median_profit,
      percent_diff: calculatePercentageDifference(
        median_profit,
        pools[last_index]['User Profits'],
      ),
      id: pools[last_index].id,
      tokens: pools[last_index]['Pool Name'][0],
    }
    console.log('BEST - ', best)
    return {
      best,
      worst,
    }
  }
})

function FindPoolSymbols(poolId) {
  for (let k = 0; k < networks_data.value.length; k++) {
    let network_data = networks_data.value[k][0]
    if (network_data) {
      let found = network_data.sharesOwned.find((p) => p.poolId.id == poolId)
      if (found) return found.poolId.tokens.map((t) => t.symbol)
    }
  }
  return []
}

const periodsOfData = [
  {
    number: 0,
    title: '24H',
  },
  {
    number: 1,
    title: '7D',
  },
  {
    number: 2,
    title: '1M',
  },
  {
    number: 3,
    title: '1Y',
  },
  {
    number: 4,
    title: 'All Time',
  },
]
const activitiesModes = ['All', 'Deposit', 'Swap', 'Harvest', 'Withdraw']
const selectedInvestmentsMode = ref(investementModes[0])

const sortedHeader = ref({})

const isCorrectNetwork = computed(() =>
  [42161, 56, 137].includes(networkId.value),
)

const account = ref('')

watch(networkId, async () => {
  const mmProvider = await InitializeMetamask()
  let previous_account = account.value
  account.value = '' //'0x75e89d5979e4f6fba9f97c104c2f0afb3f1dcb88'
  if (!mmProvider) {
    return
  }

  if (networkId.value > 0)
    account.value = await mmProvider.getSigner().getAddress()

  // hardcoded for testing
  //account.value = '0x67B27D5D938eE384917cfE5e2F1faee530468475'
})

// function onDatatableHeaderClick(caption) {
//   let data = investmentDataMap[selectedInvestmentsMode.value]
//   let sortedAsc = [...data.value].sort(function (a, b) {
//     var response = 0
//     if (a[caption].amount > b[caption].amount) {
//       response = 1
//     }
//     if (a[caption].amount < b[caption].amount) {
//       response = -1
//     }
//     if (a[caption].amount == b[caption].amount) {
//       response = 0
//     }
//     return response
//   })
//   let sortedDesc = [...data.value].sort(function (a, b) {
//     var response = 0
//     if (a[caption].amount > b[caption].amount) {
//       response = -1
//     }
//     if (a[caption].amount < b[caption].amount) {
//       response = 1
//     }
//     if (a[caption].amount == b[caption].amount) {
//       response = 0
//     }
//     return response
//   })

//   if (
//     JSON.stringify(sortedDesc) == JSON.stringify(data.value) &&
//     !(
//       sortedHeader.value.caption == caption &&
//       sortedHeader.value.direction == 'asc'
//     )
//   ) {
//     data.value = sortedAsc
//     sortedHeader.value = { caption, direction: 'asc' }
//   } else {
//     data.value = sortedDesc
//     sortedHeader.value = { caption, direction: 'desc' }
//   }
// }

const activeTab = ref(t('investments'))

function changeActiveTab(_new) {
  activeTab.value = _new
}

watch(activeTab, () => {
  console.log(activeTab.value)
})
const tokensData = ref([])
const historicalPrices = ref([])

async function InitUserData(user, network) {
  return await Promise.all([
    GetUserPools(user, network),
    GetPoolSwapsData(null, network),
    GetPoolHistoricValues(null, network),
    GetHistoricalTvl(network),
    GetTokenPairs(network),
    GetUserHistoricalBalances(user, network),
    GetUserUniswapPools(user, network),
  ])
}

const networks_data = ref([])
const tokenPrices = ref({})

const all_chart_data = ref([])

watch(all_chart_data, () => {
  console.log('UPDATES', all_chart_data.value)
})

const ChainSelectedIndex = {
  Arbitrum: 0,
  Binance: 1,
  Polygon: 2,
}
const networks = [
  process.env.VUE_APP_KEY_ARBITRUM ? Network.ARBITRUM : undefined,
  process.env.VUE_APP_KEY_BINANCE ? Network.BINANCE : undefined,
  process.env.VUE_APP_KEY_POLYGON ? Network.POLYGON : undefined,
].filter((n) => n != undefined)

const historical_tvl = ref([])
const poolSwapsData = ref([])
const chainPairs = ref([])

const portfolioData = ref({})
const balanceData = ref({})
const rewardsData = ref([])
onMounted(async () => {
  loader.value = true
  //InitTreasuryYields()
  if (window.ethereum !== undefined) {
    let provider = new ethers.providers.Web3Provider(window.ethereum)
    networksSupported.value = await provider.getNetwork()
    window.ethereum.on('accountsChanged', async function (accounts) {
      await InitPortfolio();
    })
  }

  if (
    window.ethereum === undefined ||
    window.ethereum?._state?.accounts?.length === 0 ||
    !localStorage.getItem('isConnectedToWeb3')
  ) {
    NetworkUnsupported.value = false
  }
  if (
    window.ethereum !== undefined &&
    window.ethereum?._state?.accounts?.length !== 0 &&
    networksSupported.value.chainId !== 42161 &&
    networksSupported.value.chainId !== 56 &&
    networksSupported.value.chainId !== 137
  ) {
    NetworkUnsupported.value = true
  }
  await InitPortfolio();
  loader.value = false
  //await InitInvestments()
})

async function InitPortfolio() {
  const mmProvider = await InitializeMetamask()
  if (mmProvider) {
    account.value = await mmProvider.getSigner().getAddress() //await mmProvider.getSigner().getAddress()//'0x282a2dfee159aa78ef4e28d2f9fdc9bd92a19b54'//
    if (process.env.VUE_APP_LOCAL_API) {
      const [_portfolio, _rewards, _balance] = await Promise.all([
        getPortfolioData(56, account.value),
        getPoolsRewards(account.value),
        getPortfolioBalance(56, account.value),
      ])
      portfolioData.value = _portfolio
      rewardsData.value = _rewards
      historicalPrices.value = portfolioData.value.historicalPrices
      historical_tvl.value = portfolioData.value.statistics.tvls
      balanceData.value = await _balance
      console.log('PORTFOLIO DATA - ', portfolioData.value)
    }
  }
}

</script>
<style lang="scss">
@import '@/styles/_variables.scss';

.table-above {
  display: flex;
  align-items: center;

  &_toggler {
    margin-left: 5px;
    font-size: 12px;

    @media (max-width: $xxl) {
      font-size: 10px;
    }
  }
}

.portfolio-table__wrapper_activities {
  overflow-x: auto;

  .file-table-header-container {
    max-width: none !important;
    min-width: 200px !important;

    &:nth-child(2) {
      min-width: 300px !important;
    }
  }

  .table {
    min-width: 100% !important;
    width: auto;
  }

  .actions-cell {
    display: flex;
    align-items: center;

    &__text {
      font-size: 16px;
      font-weight: 300;
      line-height: 24px;
      letter-spacing: 0em;
      color: #ffffff;
      margin-left: 12px;
    }
  }

  .details-cell {
    display: flex;
    flex-wrap: wrap;

    &__token-entity {
      display: flex;

      &:not(:last-child) {
        margin-right: 12px;
      }

      &__icon {
        height: 24px;
        width: 24px;
        margin-right: 8px;
      }
    }
  }
}

.portfolio-table__wrapper {
  backdrop-filter: blur(10px);
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 4px 0px #00000040;

  .file-table-header-container {
    max-width: none !important;
    min-width: 200px !important;
  }

  .table {
    min-width: 100% !important;
    width: auto;
  }
}

@mixin cells-widths {
  width: 150px;

  @media (max-width: $xxl) {
    width: 100px;
  }

  &:nth-child(1) {
    width: 200px;

    @media (max-width: $xxl) {
      width: 130px;
    }
  }

  &:nth-child(2) {
    width: 600px;

    @media (max-width: $xxl) {
      width: 300px;
    }
  }
}

.table-header-font-folder {
  text-align: left;
  @include cells-widths;
}

.table {
  &-body {
    display: block;
    max-height: 500px;
    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
      background-color: #02120a;
      border-radius: 50px;
      margin-bottom: 10px;
    }

    &::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
      background: #02120a;
      border-radius: 50px;
    }

    &::-webkit-scrollbar-thumb {
      border: 2px solid #02120a;
      background: #00c9ff;
      border-radius: 21px;
    }
  }

  &-wrapper {
    padding: 0;
    outline: 0.5px solid rgba(163, 164, 165, 0.2196078431);
    width: 100%;
    overflow-x: auto;
    margin-bottom: 30px;
    border-radius: 15.289px;
    background: #22222224;
    border: 1px solid #ffffff0d;
    box-shadow: 0px 4px 4px 0px #00000040;
  }

  &-row {
    border-color: transparent;
    width: 100%;
    display: table;
    table-layout: fixed;
  }

  &-cell {
    padding: 24px 0 24px 10px !important;
    width: fit-content;
    font-weight: 400;
    white-space: nowrap;
    font-size: 14px;
    overflow: visible;
    @include cells-widths;

    @media (max-width: $xxl) {
      font-size: clamp(10px, 1vw, 14px);
      padding: 12px 0 12px 10px !important;
    }

    &:first-child {
      padding: 24px 0 24px 45px !important;
      text-align: left;

      @media (max-width: $xxl) {
        padding: 12px 0 12px 15px !important;
      }
    }

    &:last-child {
      padding: 24px 10px 24px 10px !important;

      @media (max-width: $xxl) {
        padding: 12px 10px 12px 10px !important;
      }
    }
  }
}

.actions-cell {
  display: flex;
  align-items: center;

  &__text {
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    letter-spacing: 0em;
    color: #ffffff;
    margin-left: 12px;

    @media (max-width: $xxl) {
      font-size: 12px;
    }
  }
}

.details-cell {
  display: flex;
  flex-wrap: wrap;

  &__token-entity {
    display: flex;
    background: none;

    &:not(:last-child) {
      margin-right: 12px;
    }

    &__icon {
      height: 24px;
      width: 24px;
      margin-right: 8px;

      @media (max-width: $xxl) {
        margin-right: 4px;
      }
    }
  }
}

.portfolio {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;

  &-header {
    color: #fff;
    margin-bottom: 29px;

    &__amount-percents {
      font-family: 'Roboto Mono', monospace;

      font-size: clamp(10px, 0.8vw, 14px);
    }

    &__title {
      font-size: clamp(10px, 0.8vw, 14px);
      margin-bottom: 8px;

      span {
        margin-right: 8px;
      }

      svg {
        cursor: pointer;
      }
    }

    &__balance {
      font-family: 'Roboto Mono', monospace;
      font-size: clamp(20px, 1vw, 42px);
      z-index: 1;
      font-weight: 700;
      margin-bottom: 8px;
    }

    &__variation {
      display: flex;
      align-items: center;

      &-amount {
        font-size: clamp(10px, 0.8vw, 14px);
        font-family: 'Roboto Mono', monospace;

        margin-right: 8px;
      }

      &-period {
        font-size: clamp(9px, 0.7vw, 12px);
        padding: 2px 6px;
        background: #1a1d1e;
        border-radius: 5px;
      }
    }
  }

  &-stats {
    display: flex;
    margin-bottom: 28px;
    flex-wrap: wrap;

    &__el {
      display: flex;
      align-items: center;
      margin-right: 48px;
      margin-bottom: 10px;
      font-family: 'Roboto Mono', monospace;
    }

    &__icon {
      margin-right: 4px;
      height: 20px;
    }

    &__title {
      // color: #e1e1e1;
      font-size: clamp(10px, 0.8vw, 14px);
      margin-bottom: 4px;
    }

    &__amount {
      font-family: 'Roboto Mono', monospace;

      svg {
        margin-right: 4px;
      }

      &_danger {
        color: #e55353;

        svg {
          transform: rotate(180deg);

          path {
            fill: #e55353;
          }
        }
      }

      &_success {
        color: #2dc24e;

        svg {
          transform-origin: center;

          path {
            fill: #2dc24e;
          }
        }
      }
    }
  }

  &-tabs {
    padding: 4px;
    margin-bottom: 50px;
    border-radius: 4px;
    border: 1px solid rgba(1, 180, 126, 0.1);
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: left;

    &__el {
      padding: 7px 12px;
      color: #fff;

      &_active {
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.15);
      }
    }
  }

  &-chart {
    margin-bottom: 50px;
    width: 100%;
  }

  &-table {
    width: 100%;

    &__wrapper {
      width: 100%;
      overflow-x: auto;

      &::-webkit-scrollbar {
        height: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(63, 67, 80, 0.24);
        border-radius: 3px;
      }
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 17px;
      flex-wrap: wrap;

      &__left {
        display: flex;
        flex-wrap: wrap;
      }
    }

    &__filter {
      display: flex;
      padding: 4px;
      border-radius: 12px;
      border: 1px solid #7ef6b2;
      margin-bottom: 10px;

      &:first-child {
        margin-right: 8px;
      }

      &__el {
        font-size: 14px;
        padding: 6px 8px;
        border-radius: 12px;
        color: rgba(#fff, 0.6);

        &_active {
          color: #fff;
          background: #00c9ff;
        }
      }
    }

    &__dropdown {
      position: relative;
      font-size: 14px;

      &__title {
        color: #fff;
        padding: 9px 13px;
        border-radius: 12px;
        border: 1px solid #7ef6b2;
        text-align: center;
        cursor: pointer;

        &_active {
          border-radius: 12px 12px 0 0;
          border-bottom: 1px solid #fff;

          svg {
            transition-duration: 0.3s;
            transform-origin: center;
            transform: rotate(180deg);
          }
        }
      }

      &__wrapper {
        padding: 7px;
        position: absolute;
        border-radius: 0 0 12px 12px;
        border: 1px solid #7ef6b2;
        border-top: none;
        background: #000;
      }

      &__option {
        color: rgba(#fff, 0.6);
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        svg {
          min-width: 9px;
        }

        &_active {
          color: #fff;
        }
      }
    }
  }

  &-financial-statement {
    width: 100%;
  }

  &-statistics {
    width: 100%;
  }
}
</style>
