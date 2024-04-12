<template>
  <MainCard>
    <CRow class="d-flex align-items-center">
      <div class="portfolio mt-4">
        <PortfolioBalance :performers="performers" />

        <div class="portfolio-chart">
          <PortfolioChart
            :chart_data="all_chart_data"
            :networks_data="networks_data"
            :tokensData="tokensData"
            :chainSelected="chainSelected.name"
            @updateChart="(chart_data) => (all_chart_data = chart_data)"
          />
        </div>
        <Tabs
          :filterEye="true"
          style="margin-bottom: 44px"
          :tabsOptions="['Investments', 'Statistics', 'Financial Statement']"
          :selectedTab="activeTab"
          @changeTab="changeActiveTab"
        ></Tabs>
        <div class="portfolio-statistics" v-if="activeTab == 'Statistics'">
          <PortfolioStatistics
            :historical_tvl="historical_tvl"
            :tokensData="tokensData"
            :poolSwapsData="poolSwapsData"
            :chainSelected="chainSelected"
            :chartData="all_chart_data"
            :historicalPrices="historicalPrices"
            :userFirstTimestamp="firstUserTimestamp"
            :tokenPairs="chainPairs"
          >
          </PortfolioStatistics>
        </div>
        <div
          class="portfolio-financial-statement"
          v-else-if="activeTab == 'Financial Statement'"
        >
          <PoolDetailsFinancialStatement
            :poolSwapsData="poolSwapsData"
            :chainSelected="chainSelected"
            :historical_tvl="historical_tvl"
            :historicalPrices="historicalPrices"
            :poolId="'0x631b9f9996c30ce37c2d57d1704fdc568429ef41'"
            :symbol="'$'"
            :decimals="2"
          >
          </PoolDetailsFinancialStatement>

          <!-- <PortfolioFinancialStatement
            :poolSwapsData="poolSwapsData"
            :chainSelected="chainSelected"
            :historical_tvl="historical_tvl"
            :historicalPrices="historicalPrices"
            :pools="pools.map((p) => p.id)"
            :user="account"
          >
          </PortfolioFinancialStatement> -->
        </div>
        <div class="portfolio-table" v-else-if="activeTab == 'Investments'">
          <div class="text-black dark:!text-white fw-medium fs-6 mb-3">
            My Investments
          </div>
          <div class="portfolio-table__header">
            <div
              class="portfolio-table__header__left"
              style="justify-content: space-between; width: 100%"
            >
              <Tabs
                :selectedTab="selectedInvestmentsMode"
                :tabsOptions="investementModes"
                @changeTab="changeInvestmentMode"
              ></Tabs>
            </div>
          </div>

          {{ console.log('selectedInvestmentData', selectedInvestmentData) }}

          <div
            class="portfolio-table__wrapper dark:!bg-[#22222224] bg-white py-20"
          >
            <div v-if="selectedInvestmentData === null">
              <LoaderPulse />
            </div>
            <div
              v-else-if="selectedInvestmentData.length === 0"
              class="d-flex flex-column gap-2 justify-content-center align-items-center h-100 py-20"
            >
              <div
                class="text-black dark:!text-white"
                style="font-size: 14px; text-align: center"
              >
                No pools yet
              </div>
              <div
                class="text-black dark:!text-white"
                style="font-size: 12px; text-align: center"
              >
                Choose a pool to invest or create a pool to get started.
              </div>
              <div class="add_liq_btn_pools">
                <div class="d-flex gap-1">+ Add liquidity</div>
              </div>
            </div>
            <DataTable
              v-else
              :data="selectedInvestmentData"
              :default_head_captions="investmentHeadCaptions"
              @table-row-click="onDatatableRowClick"
              :table_bg="'bg-primary'"
              @table-header-click="onDatatableHeaderClick"
              :sortedHeader="sortedHeader"
              :isFullTable="true"
              :displayTable="selectedInvestmentData"
              :sortIcons="true"
            >
              <template v-slot:default="{ dataCell, dataCellKey }">
                <div>
                  <DataTableCellTokenNamePaired
                    v-if="dataCellKey === 'Name'"
                    :value="dataCell"
                  />
                  <StandardCell
                    v-else-if="
                      ['% of Pool', 'Avg APR', 'Avg Profit Per Trade'].includes(
                        dataCellKey,
                      )
                    "
                    :value="`${dataCell.amount}%`"
                  />
                  <StandardCell
                    v-else-if="['Fees'].includes(dataCellKey)"
                    :value="`$${dataCell.amount}`"
                  />
                  <StandardCell v-else :value="`${dataCell.amount}`" />
                </div>
              </template>
            </DataTable>
          </div>
        </div>
        <div class="portfolio-table mt-5" v-if="activeTab == 'Investments'">
          <div class="text-black dark:!text-white fw-medium fs-6 mb-3">
            Portfolio Activity
          </div>

          <!-- <PortfolioActivityTable :displayActivities="displayActivities" :account="account" :filteredActivities="filteredActivities" /> -->
          <PrivatePoolsTable :clActivity="clActivity" :wpActivity="joinExits" />
        </div>
      </div>
    </CRow>
  </MainCard>
</template>
<script setup>
import { CRow } from '@coreui/vue'
import StandardCell from '@/components/DataTable/Cell/StandardCell.vue'
import { computed, onMounted, ref, watch } from 'vue'
import DataTableCellTokenNamePaired from '@/components/DataTable/Cell/TokenNamePaired.vue'
import DataTable from '@/components/DataTable/index.vue'
import PortfolioChart from '@/components/portfolio/PortfolioChart.vue'
import PortfolioStatistics from '@/components/portfolio/PortfolioStatistics.vue'
// import PortfolioFinancialStatement from '@/components/portfolio/PortfolioFinancialStatement.vue'
import PoolDetailsFinancialStatement from '@/components/PoolsDetails/PoolDetailsFinancialStatement'
import router from '@/router'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { GetPortfolioActions } from '@/composables/portfolio/usePortfolioActions'
import { DisplayNetwork, networkId } from '@/composables/useNetwork'
import { FormatPortfolioActivity } from '@/lib/formatter/portfolioFormatter'
import { ethers } from 'ethers'
import MainCard from '@/UI/MainCard.vue'
import { GetHistoricalTokenPrices } from '@/composables/balances/useHistoricalTokenPrices'
import Tabs from '@/UI/Tabs.vue'
import { GetUserPools } from '@/composables/portfolio/useUserPools'
import { GetPoolSwapsData } from '@/composables/pools/charts/usePoolSwapsData'
import { FormatPoolsData } from '@/lib/formatter/poolsFormatter'
import { FormatPortfolioPools } from '@/lib/formatter/portfolio/portfolioPoolsFormatter'
import { FormatPortfolioPairs } from '@/lib/formatter/portfolio/portfolioPairsFormatter'
import { GetPoolHistoricValues } from '@/composables/pools/charts/usePoolHistoricValues'
import { GetHistoricalTvl } from '@/composables/pools/snapshots/usePoolHistoricalTvl'
import { GetTokenPairs } from '@/composables/pools/useTokenPairs'
import { GetTokenPricesBySymbols } from '@/composables/balances/cryptocompare'
import {
  excludeKeysFromObject,
  combineArrayObjects,
  median,
  calculatePercentageDifference,
} from '@/lib/utils'
import { FormatHistoricalTvl } from '@/lib/formatter/poolTvlFormatter'
import { Network } from '@/composables/useNetwork'
import { isRightChainName } from '@/composables/pools/usePoolSwapsStats'
import { GetUserHistoricalBalances } from '@/composables/portfolio/usePortfolioHistoricalBalances'
import { GetActivePeriodsSwapsData } from '@/lib/formatter/portfolio/portfolioSwapsFormatter'
import { InitTreasuryYields } from '@/composables/api/useTreasuryYields'
import { GetUserUniswapPools } from '@/composables/wallet/useWalletPools'
import PortfolioBalance from '@/components/portfolio/PortfolioBalance.vue'
import PrivatePoolsTable from '@/components/General/PrivatePoolsTable.vue'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'

const clActivity = ref([
  {
    Actions: 'Swap',
    Details: [
      {
        action: 'Swap',
        ETH: '-0.00',
        USDT: '0.00',
      },
    ],
    Value: '0',
    Time: '1 month ago',
    Tx: '0x049538159d5f10f741626caaf6cef43a0c58f396286d96fa727116da20bdad5d',
    timestamp: '1708532754',
    chainId: 56,
    chain: 'Binance',
  },
  {
    Actions: 'Swap',
    Details: [
      {
        action: 'Swap',
        BTCB: '0.00',
        WBNB: '-0.02',
      },
    ],
    Value: '0',
    Time: '9 days ago',
    Tx: '0x085edbdad9c6d433d4cd3d006c088ada94f2994dd6a07cb0131827168833cd4e',
    timestamp: '1711363947',
    chainId: 56,
    chain: 'Binance',
  },
])
const joinExits = ref([
  {
    user: {
      id: '0x4bde150b69408dafbe4833f0d7b9689246a6597b',
    },
    amounts: [
      '13.465999999999999304',
      '0.001',
      '0.001',
      '0',
      '0.001',
      '0',
      '0.001',
      '0.001',
    ],
    pool: {
      tokens: [
        {
          symbol: 'Cake',
        },
        {
          symbol: 'AVAX',
        },
        {
          symbol: 'XRP',
        },
        {
          symbol: 'ETH',
        },
        {
          symbol: 'ADA',
        },
        {
          symbol: 'DOT',
        },
        {
          symbol: 'INJ',
        },
        {
          symbol: 'WBNB',
        },
      ],
    },
    valueUSD: '0',
    type: 'Join',
    timestamp: 1702503184,
    chain: 'Binance',
    chainId: 56,
  },
  {
    user: {
      id: '0x4bde150b69408dafbe4833f0d7b9689246a6597b',
    },
    amounts: [
      '7.554760289442242907',
      '3.770726094964460187',
      '0.006792699854304051',
      '1.176872358543111302',
    ],
    pool: {
      tokens: [
        {
          symbol: 'AVAX',
        },
        {
          symbol: 'SOL',
        },
        {
          symbol: 'BTCB',
        },
        {
          symbol: 'WBNB',
        },
      ],
    },
    valueUSD: '1137.184818600137953607662435191093',
    type: 'Exit',
    timestamp: 1702639931,
    chain: 'Binance',
    chainId: 56,
  },
  {
    user: {
      id: '0x4bde150b69408dafbe4833f0d7b9689246a6597b',
    },
    amounts: ['0.307402', '0.158687', '0.000289', '0.04967'],
    pool: {
      tokens: [
        {
          symbol: 'AVAX',
        },
        {
          symbol: 'SOL',
        },
        {
          symbol: 'BTCB',
        },
        {
          symbol: 'WBNB',
        },
      ],
    },
    valueUSD: '47.93505265238665018797586063640085',
    type: 'Exit',
    timestamp: 1702646626,
    chain: 'Binance',
    chainId: 56,
  },
  {
    user: {
      id: '0x4bde150b69408dafbe4833f0d7b9689246a6597b',
    },
    amounts: ['3.096000000000000085', '0', '0', '0'],
    pool: {
      tokens: [
        {
          symbol: 'AVAX',
        },
        {
          symbol: 'SOL',
        },
        {
          symbol: 'BTCB',
        },
        {
          symbol: 'WBNB',
        },
      ],
    },
    valueUSD: '41.84800387934665651679103821900545',
    type: 'Join',
    timestamp: 1702638092,
    chain: 'Binance',
    chainId: 56,
  },
  {
    user: {
      id: '0x4bde150b69408dafbe4833f0d7b9689246a6597b',
    },
    amounts: ['0.19', '1.8', '0.0003', '0.5'],
    pool: {
      tokens: [
        {
          symbol: 'SOL',
        },
        {
          symbol: 'DOT',
        },
        {
          symbol: 'BTCB',
        },
        {
          symbol: 'INJ',
        },
      ],
    },
    valueUSD: '0',
    type: 'Join',
    timestamp: 1702469234,
    chain: 'Binance',
    chainId: 56,
  },
  {
    user: {
      id: '0xdd2ee0c16f58dc53ebec021dae05cecf8051373f',
    },
    amounts: ['0.2', '3', '0.3', '0.005'],
    pool: {
      tokens: [
        {
          symbol: 'AVAX',
        },
        {
          symbol: 'USDT',
        },
        {
          symbol: 'SOL',
        },
        {
          symbol: 'WBNB',
        },
      ],
    },
    valueUSD: '3',
    type: 'Join',
    timestamp: 1702602127,
    chain: 'Binance',
    chainId: 56,
  },
  {
    user: {
      id: '0x4bde150b69408dafbe4833f0d7b9689246a6597b',
    },
    amounts: ['0.239010698854900089', '0.000005451740851665'],
    pool: {
      tokens: [
        {
          symbol: 'USDT',
        },
        {
          symbol: 'BTCB',
        },
      ],
    },
    valueUSD: '0.4730702492177080825503071512930907',
    type: 'Exit',
    timestamp: 1702647027,
    chain: 'Binance',
    chainId: 56,
  },
])

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
const hideSmallerThan10Pools = ref(true)

const displayActivities = computed(() =>
  filteredActivities.value.map((item) =>
    excludeKeysFromObject(item, ['tx', 'timestamp', 'network']),
  ),
)

const filteredActivities = computed(() => {
  let output = []
  if (!activities.value || activities.value.length == 0) output = []
  else if (activitiesSelectedMode.value == 'All') {
    output = activities.value[actSelectedPeriodOfData.value.number]
  } else {
    let newData = []
    activities.value[actSelectedPeriodOfData.value.number].forEach((item) => {
      if (item['Actions'] == activitiesSelectedMode.value) {
        newData.push(item)
      }
    })
    output = newData
  }
  return output.filter(
    (item) =>
      chainSelected.value.name == 'All Chains' ||
      DisplayNetwork[item.network] == chainSelected.value.name,
  )
})

const investementModes = ['Pools', 'Pairs']

const investmentDataMap = {
  Pools: pools,
  Pairs: pairs,
}

const selectedInvestmentData = computed(() => {
  let data = investmentDataMap[selectedInvestmentsMode.value].value
  if (!data) return null
  if (hideSmallerThan10Pools.value) {
    data = data.filter((el) => el.TVL.fullAmount > 10)
  }
  let formatted = data.map((item) => excludeKeysFromObject(item, ['id']))
  return formatted
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
  console.log('HERE - ', pools_info)
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
const activitiesSelectedMode = ref(activitiesModes[0])
const actSelectedPeriodOfData = ref(periodsOfData[4])

const investmentHeadCaptions = computed(() => {
  {
    if (selectedInvestmentsMode.value == 'Pools') {
      return [
        'Name',
        'AVG APR',
        'Liquidity Deposited',
        '% Of Pool',
        'Returns Harvested',
        'TVL',
        'Volume',
        'Fees',
        'AVG Profit Per Trade',
        'Number Of Trades',
      ]
    } else {
      return [
        'Name',
        'Liquidity Deposited',
        '% Of Pool',
        'TVL',
        'Volume',
        'Fees',
        'AVG Profit Per Trade',
        'Number Of Trades',
      ]
    }
  }
})

function changeActivitiesMode(_new) {
  activitiesSelectedMode.value = _new
}

function changeActPeriodOfData(_new) {
  actSelectedPeriodOfData.value = _new
}

function changeInvestmentMode(_new) {
  selectedInvestmentsMode.value = _new
  sortedHeader.value = {}
}

const sortedHeader = ref({})

const isCorrectNetwork = computed(() =>
  [42161, 56, 137].includes(networkId.value),
)
const portfolioActions = ref([])
const firstUserTimestamp = computed(() =>
  portfolioActions.value.joinExits
    ? [...portfolioActions.value.joinExits].sort(
        (a, b) => a.timestamp - b.timestamp,
      )[0].timestamp * 1000
    : 0,
)
const account = ref('')

function clearUserData() {
  networks_data.value = []
  portfolioActions.value = []
}
watch(networkId, async () => {
  const mmProvider = await InitializeMetamask()
  let previous_account = account.value
  account.value = '' //'0xb51027d05ffbf77b38be6e66978b2c5b6467f615'
  if (!mmProvider) {
    clearUserData()
    return
  }

  if (networkId.value > 0)
    account.value = await mmProvider.getSigner().getAddress()
  if (previous_account != account.value) {
    clearUserData()
  }
  // hardcoded for testing
  //account.value = '0xb51027d05ffbf77b38be6e66978b2c5b6467f615'
  await InitInvestments()
  if (isCorrectNetwork.value) {
    if (portfolioActions.value.length == 0) await InitPortfolioActions()
    activities.value = FormatPortfolioActivity(portfolioActions.value)
  }
})

watch(chainSelected, () => {
  InitInvestments()
})

async function InitPortfolioActions() {
  let actions = await Promise.all(
    networks.map((n) => GetPortfolioActions(account.value.toLowerCase(), n)),
  )
  console.log(actions)
  portfolioActions.value = combineArrayObjects(actions)
}

function onDatatableHeaderClick(caption) {
  let data = investmentDataMap[selectedInvestmentsMode.value]
  let sortedAsc = [...data.value].sort(function (a, b) {
    var response = 0
    if (a[caption].amount > b[caption].amount) {
      response = 1
    }
    if (a[caption].amount < b[caption].amount) {
      response = -1
    }
    if (a[caption].amount == b[caption].amount) {
      response = 0
    }
    return response
  })
  let sortedDesc = [...data.value].sort(function (a, b) {
    var response = 0
    if (a[caption].amount > b[caption].amount) {
      response = -1
    }
    if (a[caption].amount < b[caption].amount) {
      response = 1
    }
    if (a[caption].amount == b[caption].amount) {
      response = 0
    }
    return response
  })

  if (
    JSON.stringify(sortedDesc) == JSON.stringify(data.value) &&
    !(
      sortedHeader.value.caption == caption &&
      sortedHeader.value.direction == 'asc'
    )
  ) {
    data.value = sortedAsc
    sortedHeader.value = { caption, direction: 'asc' }
  } else {
    data.value = sortedDesc
    sortedHeader.value = { caption, direction: 'desc' }
  }
}

const activeTab = ref('Investments')

function changeActiveTab(_new) {
  activeTab.value = _new
}

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
async function InitInvestments() {
  console.log('INIT INVESTMENTS')
  pairs.value = null
  pools.value = null
  if (networkId.value == 0) {
    return
  }
  console.log('INIT NETWORKS DATA')
  if (networks_data.value.length == 0) {
    await InitNetworksData()
  }
  pools.value = []
  pairs.value = []
  historical_tvl.value = []
  poolSwapsData.value = []
  console.log('NETWORKS DATA - ', networks_data)
  for (let i = 0; i < networks_data.value.length; i++) {
    if (
      chainSelected.value.name == 'All Chains' ||
      ChainSelectedIndex[chainSelected.value.name] == i
    ) {
      let [_user, _poolSwapsData, _historicValues, _historical_tvl, _pairs] =
        networks_data.value[i]

      if (!_user || _user.length == 0) {
        continue
      }
      let userPools = _user.sharesOwned.map((share) => share.poolId)
      let formatted_pools = FormatPoolsData(
        userPools,
        _poolSwapsData,
        _historicValues,
        true,
      )
      if (tokenPrices.value == {})
        tokenPrices.value = await GetTokenPricesBySymbols(
          _pairs.tokens.map((t) => t.symbol),
        )
      tokensData.value = [
        ...tokensData.value,
        ..._pairs.tokens.map((t) => ({
          ...t,
          Blockchain: DisplayNetwork[networks[i]],
        })),
      ]
      console.log('TOKENS DATA', tokensData.value)
      historicalPrices.value = [
        ...historicalPrices.value,
        ...(await GetHistoricalTokenPrices(
          Array.from(new Set([...tokensData.value.map((t) => t.symbol)])),
        )),
      ]
      historical_tvl.value = [...historical_tvl.value, ..._historical_tvl]
      poolSwapsData.value = [...poolSwapsData.value, ..._poolSwapsData]
      let formatted_historical_tvl = FormatHistoricalTvl(_historical_tvl)
      let formattedPools = FormatPortfolioPools(
        formatted_pools,
        _user,
        _poolSwapsData,
        formatted_historical_tvl,
        DisplayNetwork[networks[i]],
      )
      let formattedPairs = FormatPortfolioPairs(
        _user,
        _poolSwapsData,
        _pairs,
        tokenPrices.value,
      )
      pools.value = [...pools.value, ...formattedPools]
      pairs.value = [...pairs.value, ...formattedPairs]
      console.log(pools.value)
      console.log(pairs.value)
    }
  }
}
console.log('HERE')
const chainPairs = ref([])
async function InitNetworksData() {
  console.log('ACCOUNT - ', account.value)
  let chains_data = await Promise.all(
    networks.map((n) => InitUserData(account.value.toLowerCase(), n)),
  )
  let result = []
  for (let i = 0; i < chains_data.length; i++) {
    let [
      _user,
      _poolSwapsData,
      _historicValues,
      historical_tvl,
      _pairs,
      _historicalBalances,
      uniswap_pools,
    ] = chains_data[i]
    if (!_user || _user.length == 0) {
      result.push([null, null, null, null, null])
      continue
    }
    let userPools = _user.sharesOwned.map((share) => share.poolId)
    let userPoolIds = userPools.map((p) => p.id)
    let filteredPoolSwapsData = _poolSwapsData.filter(
      (item) =>
        item.swaps[0]['poolIdVault'].filter((poolId) =>
          userPoolIds.includes(poolId),
        ).length > 0,
    )
    filteredPoolSwapsData = GetActivePeriodsSwapsData(
      _historicalBalances,
      filteredPoolSwapsData,
    )
    let filteredHistoricalTvl = historical_tvl.filter((item) =>
      userPoolIds.includes(item.pool.id),
    )
    chainPairs.value = [
      ...chainPairs.value,
      ..._pairs.tokenPairs.map((p) => ({
        ...p,
        Blockchain: DisplayNetwork[networks[i]],
      })),
    ]
    result.push([
      _user,
      filteredPoolSwapsData,
      _historicValues,
      filteredHistoricalTvl,
      _pairs,
      _historicalBalances,
      uniswap_pools,
    ])
  }
  networks_data.value = result
}

onMounted(async () => {
  InitTreasuryYields()
  if (window.ethereum !== undefined) {
    let provider = new ethers.providers.Web3Provider(window.ethereum)
    networksSupported.value = await provider.getNetwork()
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
  const mmProvider = await InitializeMetamask()
  if (mmProvider) {
    account.value = await mmProvider.getSigner().getAddress()
  }
  await InitInvestments()
})
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
  // background: #22222224;
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
  text-align: left !important;
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
      font-size: clamp(14px, 0.9vw, 32px);
      font-weight: 600;
      margin-bottom: 8px;
    }
    &__variation {
      display: flex;
      align-items: center;

      &-amount {
        font-size: clamp(10px, 0.8vw, 14px);
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

.add_liq_btn_pools {
  padding: 8px;
  display: flex;
  justify-content: center;
  background: #00e0ff;
  border-radius: 5px;
  font-family: Poppins;
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0px 4px 4px 0px #00000040;

  text-align: center;
  color: white;

  &:hover {
    background: #1ab6ff;
    filter: drop-shadow(0 0 0.6rem #2abcff91);
    cursor: pointer;
  }
}
</style>
