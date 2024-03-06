<template>
  <MainCard>
    <SpecificTopPortfolio v-if="specificTopPortfolioOpen" @changeToSpecificPortfolio="changeToSpecificPortfolio"/>
    <div v-else>
    <div style="color: white; font-size: 20px; font-weight: 700" class="my-3">
      Users Analytics
    </div>
    <!-- <GeneralAnalyticsChart @changeToDepositView="changeToDepositView" :poolTokenPrices="tokenPrices" :tokenPrices="historicalPrices" :pool="pool"
        :swapsData="poolSwapsData" :chainSelected="chainSelected.chain" :all_chart_data="chartData"
        :historical_tvl="historical_tvl" :symbol="currencySymbol" :currencySelected="currencySelected" /> -->
    <div class="track_info_container">
      <GeneralBotCard
        :currencySelected="currencySelected"
        :chainSelected="chainSelected"
        :allTableData="allPoolsTableData"
        :tokensData="tokensData"
        :poolSwapsData="poolSwapsData"
      />
      <TrackingInfoChart
        :historicalPrices="historicalPrices"
        :chartData="chartData"
        :chainSelected="chainSelected"
        :tokensData="tokensData"
        :symbol="currencySymbol"
      />
    </div>

    <div
      style="color: white; font-size: 18px; font-weight: 700"
      class="mt-5 mb-3"
    >
      Top Portfolios
    </div>
    <UserAnalyticsPortfoliosTable @changeToSpecificPortfolio="changeToSpecificPortfolio"/>

    <div
      style="color: white; font-size: 18px; font-weight: 700"
      class="mt-5 mb-3"
    >
      Top Referrals
      <svg
      @click="router.push('/referrals')"
      style="cursor: pointer;"
        width="11"
        height="11"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_463_87)">
          <mask
            id="mask0_463_87"
            style="mask-type: luminance"
            maskUnits="userSpaceOnUse"
            x="0"
            y="-1"
            width="16"
            height="16"
          >
            <path d="M16 -1H0V15H16V-1Z" fill="white" />
          </mask>
          <g mask="url(#mask0_463_87)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.598864 15C0.147435 14.8583 -0.00113632 14.5394 6.53456e-06 14.0811C0.00800654 10.3131 0.00457796 6.54399 0.00457796 2.77484C0.00457796 2.19199 0.282292 1.91199 0.862864 1.91199H7.92229C8.32915 1.91199 8.60229 2.10399 8.70058 2.4537C8.81486 2.85827 8.54172 3.28799 8.12686 3.35084C8.03544 3.36456 7.94058 3.36913 7.84801 3.36913C5.78058 3.36913 3.71429 3.37142 1.64801 3.36684C1.50058 3.36684 1.45601 3.39656 1.45601 3.55199C1.46058 6.82056 1.46058 10.0903 1.45601 13.36C1.45601 13.5108 1.49486 13.5497 1.64572 13.5486C4.91429 13.544 8.18286 13.544 11.4526 13.5486C11.608 13.5486 11.6389 13.5028 11.6389 13.3577C11.6343 11.2754 11.6354 9.1931 11.6354 7.11084C11.6354 6.71084 11.7989 6.43999 12.1063 6.32456C12.5463 6.1577 13.016 6.43884 13.0834 6.91199C13.0949 6.98856 13.0926 7.06742 13.0926 7.14513C13.0926 9.4571 13.0869 11.768 13.0971 14.0788C13.0994 14.536 12.9509 14.856 12.5006 15H0.598864Z"
              fill="#B9B9B9"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16.0035 5.69028C15.9486 5.79542 15.9178 5.91085 15.8389 6.00457C15.7477 6.11595 15.6256 6.19792 15.4879 6.2402C15.3503 6.28249 15.2032 6.28321 15.0652 6.24228C14.9299 6.20169 14.8097 6.12177 14.72 6.01269C14.6302 5.90361 14.575 5.77029 14.5612 5.62971C14.553 5.54692 14.5492 5.46376 14.5498 5.38057L14.5486 1.70971V1.53028C14.4675 1.54514 14.4355 1.60228 14.3955 1.64342C11.9791 4.05673 9.56382 6.4712 7.14976 8.88685C6.93947 9.0983 6.70862 9.2309 6.3989 9.1634C6.2789 9.1378 6.16741 9.0821 6.07498 9.0014C5.98255 8.92066 5.91224 8.81771 5.8707 8.70225C5.82917 8.5868 5.81777 8.46265 5.83761 8.34157C5.85744 8.22048 5.90784 8.10645 5.98405 8.01028C6.03547 7.94514 6.0949 7.88685 6.15319 7.82743L13.3532 0.62742C13.3966 0.58514 13.4538 0.55428 13.5246 0.504C13.4218 0.44685 13.3589 0.46057 13.3006 0.46057L9.58405 0.45942C9.43824 0.46866 9.29222 0.44523 9.15662 0.39085C9.01114 0.32411 8.89206 0.2108 8.81817 0.06882C8.74428 -0.073158 8.71981 -0.235707 8.74862 -0.393147C8.77528 -0.551026 8.85381 -0.695513 8.97179 -0.803762C9.08977 -0.912012 9.24046 -0.977848 9.40005 -0.990861C9.46176 -0.996576 9.52576 -0.995433 9.58747 -0.995433C11.4195 -0.995433 13.2515 -0.988575 15.0846 -1C15.5418 -1.00343 15.8618 -0.852576 16.0035 -0.401147V5.69028Z"
              fill="#B9B9B9"
            />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_463_87">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
    <TopReferralsPortfolioTable />

  </div>
  </MainCard>
</template>

<script setup>
import GeneralAnalyticsChart from '@/components/PoolsDetails/GeneralAnalyticsChart.vue'
import MainCard from '../UI/MainCard.vue'
import GeneralBotCard from '@/components/General/GeneralBotCard.vue'
import TrackingInfoChart from '@/components/TrackInfo/TrackingInfoChart.vue'
import { ref, onBeforeMount, watch, computed } from 'vue'
import { Network, DisplayNetwork } from '@/composables/useNetwork'
import { FormatAllPoolForTrackingPage } from '@/lib/formatter/poolsFormatter'
import { FormatAllPairsData } from '@/lib/formatter/trackPairsFormatter'
import { GetPools } from '@/composables/pools/usePools'
import { GetPoolSwapsData } from '@/composables/pools/charts/usePoolSwapsData'
import { FormatTrackingInfoChart } from '@/lib/formatter/trackingInfoChartFormatter'
import { GetHistoricalTvl } from '@/composables/pools/snapshots/usePoolHistoricalTvl'
import { FormatHistoricalTvl } from '@/lib/formatter/poolTvlFormatter'
import {
  GetTokenPairs,
  updateTokenPrices,
} from '@/composables/pools/useTokenPairs'
import { FormatTokenSnapshots } from '@/lib/formatter/tokenSnapshotsFormatter'
import { FormatAllTokensData } from '@/lib/formatter/trackTokensFormatter'
import { GetHistoricalTokenPrices } from '@/composables/balances/useHistoricalTokenPrices'
import { addEmptyDays } from '@/lib/formatter/chart/chartFormatter'
import { InitTreasuryYields } from '@/composables/api/useTreasuryYields'
import { getTokensPricesForTimestamp } from '@/lib/formatter/financialStatement/financialStatementFormatter'
import { formatSimpleTimestamp } from '@/lib/utils/index'
import { GetTokenPricesBySymbols } from '@/composables/balances/cryptocompare'
import { convertSwapsCurrency } from '@/composables/pools/usePoolSwapsStats'
import { GetActiveUsers } from '@/composables/users/useActiveUsers'
import UserAnalyticsPortfoliosTable from '@/components/General/UserAnalyticsPortfoliosTable.vue'
import SpecificTopPortfolio from './SpecificTopPortfolio.vue'
import TopReferralsPortfolioTable from '@/components/General/TopReferralsPortfolioTable.vue'
import router from '@/router'

const allPoolsTableData = ref([])
const allPairsTableData = ref([])
const chartData = ref([])
const tokensData = ref([])
const historicalPrices = ref([])
const historical_tvl = ref([])
const allTokensTableData = ref([])
const poolSwapsData = ref([])
const chainPairs = ref([])
const joinExits = ref([])
const activeUsers = ref([])

const chainSelected = ref({
  name: 'All Chains',
  code: 'ALL',
  img: '',
})

const specificTopPortfolioOpen = ref(false)

const currencySelected = ref({ symbol: '$', code: 'USD' })
const currency = computed(() => currencySelected.value.code)
const currencySymbol = computed(() => currencySelected.value.symbol)
const currency_prices = ref(null)
const currencyDecimals = computed(() =>
  currencySelected.value.code == 'USD' ? 3 : 5,
)

function changeToSpecificPortfolio() {
  specificTopPortfolioOpen.value = !specificTopPortfolioOpen.value
}

onBeforeMount(async () => {
  InitTreasuryYields()
  await Init()
})

watch(currency, async () => {
  allPoolsTableData.value = []
  allPairsTableData.value = []
  chartData.value = []
  tokensData.value = []
  historical_tvl.value = []
  allTokensTableData.value = []
  poolSwapsData.value = []
  chainPairs.value = []
  await Init()
})

async function Init() {
  const networks = [
    process.env.VUE_APP_KEY_ARBITRUM ? Network.ARBITRUM : undefined,
    process.env.VUE_APP_KEY_BINANCE ? Network.BINANCE : undefined,
    process.env.VUE_APP_KEY_POLYGON ? Network.POLYGON : undefined,
  ].filter((n) => n != undefined)
  let data = await Promise.all(networks.map((n) => InitPoolsData(n)))

  let poolsData = data.map((d) => d[0])
  joinExits.value = networks
    .map((n, i) =>
      data[i][4].joinExtis.map((join) => ({
        ...join,
        chain: DisplayNetwork[n],
      })),
    )
    .flat()
  activeUsers.value = networks
    .map((n, i) =>
      data[i][4].activeUsers.map((user_info) => ({
        ...user_info,
        chain: DisplayNetwork[n],
      })),
    )
    .flat()
  if (!currency_prices.value)
    currency_prices.value = await GetTokenPricesBySymbols(['BTC', 'ETH'])
  let _poolSwapsData = networks.map((n, i) =>
    convertSwapsCurrency(
      data.map((d) => d[1])[i],
      currency_prices.value,
      currency.value,
    ),
  )
  historical_tvl.value = data
    .map((d) => d[2])
    .flat()
    .sort((a, b) => b.timestamp - a.timestamp)
  let tokenPairs = data.map((d) => d[3])
  tokensData.value = networks
    .map((n, i) =>
      tokenPairs[i].tokens
        .flat()
        .map((t) => ({ ...t, Blockchain: DisplayNetwork[n] })),
    )
    .flat()

  let token_symbols = Array.from(
    new Set([...tokensData.value.map((t) => t.symbol)]),
  )
  historicalPrices.value = await GetHistoricalTokenPrices(
    token_symbols,
    true,
    500,
    currency.value,
  )
  let token_prices = getTokensPricesForTimestamp(
    token_symbols,
    historicalPrices.value,
    new Date().getTime() / 1000,
  )
  // update prices to the api solution
  updateTokenPrices(tokenPairs, networks, token_prices)

  tokensData.value = networks
    .map((n, i) =>
      tokenPairs[i].tokens
        .flat()
        .map((t) => ({ ...t, Blockchain: DisplayNetwork[n] })),
    )
    .flat()

  chainPairs.value = networks
    .map((n, i) =>
      tokenPairs[i].tokenPairs
        .flat()
        .map((t) => ({ ...t, Blockchain: DisplayNetwork[n] })),
    )
    .flat()
  let notFlattedTokensData = networks.map((n, i) =>
    tokenPairs[i].tokens.flat().map((t) => ({ ...t, Blockchain: n })),
  )
  poolSwapsData.value = networks.map((_, i) => [..._poolSwapsData[i]]).flat()
  let tokenSnapshots = networks
    .map((n, i) =>
      tokenPairs[i].tokenSnapshots.flat().map((t) => ({ ...t, Blockchain: n })),
    )
    .flat()
  let chart_data = networks
    .map((n, i) => FormatTrackingInfoChart(_poolSwapsData[i], n))
    .flat()
  chart_data.sort((a, b) => a.timestamp - b.timestamp)
  let formatted_tvl = FormatHistoricalTvl(historical_tvl.value)
  let allPoolsData = networks
    .map((n, i) =>
      FormatAllPoolForTrackingPage(
        poolsData[i],
        _poolSwapsData[i],
        [],
        historical_tvl.value,
        n,
        currencyDecimals.value,
      ),
    )
    .flat()
  allPoolsTableData.value = allPoolsData
  let allPairsData = networks
    .map((n, i) =>
      FormatAllPairsData(
        tokenPairs[i],
        [..._poolSwapsData[i]],
        n,
        currencyDecimals.value,
      ),
    )
    .flat()
  let allTokensData = networks
    .map((n, i) =>
      FormatAllTokensData(
        notFlattedTokensData[i],
        [..._poolSwapsData[i]],
        n,
        currencyDecimals.value,
      ),
    )
    .flat()
  allTokensTableData.value = allTokensData
  allPairsTableData.value = allPairsData

  let formatted_token_snapshots = FormatTokenSnapshots(
    tokenSnapshots,
    tokensData.value,
  )
  formatChartData(formatted_tvl, formatted_token_snapshots, chart_data)

  chartData.value = addEmptyDays(chart_data)
}

function formatChartData(formatted_tvl, formatted_token_snapshots, chart_data) {
  for (let i = 0; i < formatted_tvl.length; i++) {
    let filtered = chart_data.filter(
      (item) => item.Blockchain != '' && item.Date == formatted_tvl[i].Date,
    )
    if (filtered.length > 0) {
      for (let k = 0; k < filtered.length; k++) {
        filtered[k].TVL = { ...formatted_tvl[i] }
      }
    } else {
      let index = chart_data.findIndex(
        (item) => item.timestamp > formatted_tvl[i].timestamp,
      )
      let empty_tvl_element = {
        Date: formatted_tvl[i].Date,
        Blockchain: '',
        timestamp: formatted_tvl[i].timestamp,
        Profits: 0,
        Revenue: 0,
        Assets: {},
        'Gas Fees': 0,
        Volume: 0,
        Trades: 0,
      }
      empty_tvl_element['TVL'] = formatted_tvl[i]
      if (index == -1) {
        chart_data.push(empty_tvl_element)
      } else {
        chart_data.splice(index, 0, empty_tvl_element)
      }
    }
  }
  let tokens = Object.keys(formatted_token_snapshots).filter(
    (k) => k != 'timestamps' && k != 'Dates',
  )
  let lastIndex = 0
  for (let i = 0; i < chart_data.length; i++) {
    let index = formatted_token_snapshots.Dates.findLastIndex(
      (s) => s == chart_data[i].Date,
    )
    index = index == -1 ? lastIndex : index
    lastIndex = index
    for (let k = 0; k < tokens.length; k++) {
      chart_data[i].Assets[tokens[k]] =
        formatted_token_snapshots[tokens[k]][index]
    }
    if (!chart_data[i].TVL) {
      let prices = getTokensPricesForTimestamp(
        tokens,
        historicalPrices.value,
        chart_data[i].timestamp / 1000,
      )
      let tvl = 0
      for (let k = 0; k < tokens.length; k++) {
        let assetTvl = prices[tokens[k]] * chart_data[i].Assets[tokens[k]]
        tvl += assetTvl
      }
      chart_data[i].TVL = {
        Arbitrum: 0,
        Binance: 0,
        Polygon: 0,
        'All Chains': 0,
        Date: formatSimpleTimestamp(chart_data[i].timestamp),
        timestamp: chart_data[i].timestamp * 1000,
      }
      chart_data[i].TVL[chainSelected.value.name] = tvl
      chart_data[i].TVL['All chains'] = tvl
    }
    // if (!chart_data[i].TVL && !nearestTvl) {
    //   nearestTvl = { ...chart_data.find((d) => d.TVL != null).TVL }
    //   chart_data[i].TVL = { ...nearestTvl }
    // } else if (!chart_data[i].TVL) {
    //   chart_data[i].TVL = { ...nearestTvl }
    // }
    // nearestTvl = { ...chart_data[i].TVL }
  }
}

async function InitPoolsData(network) {
  return await Promise.all([
    GetPools(network, null, true, true, currency.value),
    GetPoolSwapsData(null, network),
    GetHistoricalTvl(network, null, currency.value),
    GetTokenPairs(network),
    GetActiveUsers(network),
  ])
}
</script>
<style lang="scss">
@import '../styles/_variables.scss';

.track_info_container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  /* gap: 10px; */
}

@media (min-width: $xl) {
  .track_info_container {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    /* gap: 15px; */
  }
}
</style>
