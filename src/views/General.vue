<template>
  <MainCard>
    <div style="color: white; font-size: 20px; font-weight: 700" class="my-3">
      Private Pools Analytics
    </div>
    <!-- <GeneralAnalyticsChart @changeToDepositView="changeToDepositView" :poolTokenPrices="tokenPrices" :tokenPrices="historicalPrices" :pool="pool"
        :swapsData="poolSwapsData" :chainSelected="chainSelected.chain" :all_chart_data="chartData"
        :historical_tvl="historical_tvl" :symbol="currencySymbol" :currencySelected="currencySelected" /> -->
    <div class="track_info_container">
      <GeneralBotCard :currencySelected="currencySelected" :chainSelected="chainSelected"
        :allTableData="allPoolsTableData" :tokensData="tokensData" :poolSwapsData="poolSwapsData" />
      <TrackingInfoChart :historicalPrices="historicalPrices" :chartData="chartData" :chainSelected="chainSelected"
        :tokensData="tokensData" :symbol="currencySymbol" />
    </div>

    <div style="color: white; font-size: 18px; font-weight: 700" class="mt-5 mb-3">
      Overview
    </div>
    <GeneralOverview />
    <div style="color: white; font-size: 18px; font-weight: 700" class="mt-5 mb-3">
      Top Perfomance Pools
    </div>
    <GeneralPerformanceTable />
    <div style="color: white; font-size: 18px; font-weight: 700" class="mt-5 mb-3">
      Top Trading Tokens
    </div>
    <TopTradingTokensTable />


    <div style="color: white; font-size: 18px; font-weight: 700" class="mt-5 mb-3">
      Private Pools Activity
    </div>
    <GeneralPrivatePoolsTable :clActivity="clActivity" :wpActivity="joinExits" />

  </MainCard>
</template>

<script setup>
import GeneralAnalyticsChart from '@/components/PoolsDetails/GeneralAnalyticsChart.vue'
import MainCard from '../UI/MainCard.vue'
import GeneralBotCard from '@/components/General/GeneralBotCard.vue';
import TrackingInfoChart from '@/components/TrackInfo/TrackingInfoChart.vue';
import { ref, onBeforeMount, watch, computed, onMounted } from 'vue'
import { Network, DisplayNetwork } from '@/composables/useNetwork'
import { FormatAllPoolForTrackingPage } from '@/lib/formatter/poolsFormatter'
import { FormatAllPairsData } from '@/lib/formatter/trackPairsFormatter'
import { GetPools } from "@/composables/pools/usePools"
import { GetPoolSwapsData } from '@/composables/pools/charts/usePoolSwapsData'
import { FormatTrackingInfoChart } from '@/lib/formatter/trackingInfoChartFormatter'
import { GetHistoricalTvl } from "@/composables/pools/snapshots/usePoolHistoricalTvl"
import { FormatHistoricalTvl } from "@/lib/formatter/poolTvlFormatter"
import { GetTokenPairs, updateTokenPrices } from "@/composables/pools/useTokenPairs"
import { FormatTokenSnapshots } from '@/lib/formatter/tokenSnapshotsFormatter'
import { FormatAllTokensData } from '@/lib/formatter/trackTokensFormatter'
import { GetHistoricalTokenPrices } from '@/composables/balances/useHistoricalTokenPrices'
import { addEmptyDays } from '@/lib/formatter/chart/chartFormatter'
import Tabs from "@/UI/Tabs.vue";
import { InitTreasuryYields } from '@/composables/api/useTreasuryYields'
import { getTokensPricesForTimestamp } from '@/lib/formatter/financialStatement/financialStatementFormatter'
import { formatSimpleTimestamp } from '@/lib/utils/index'
import { GetTokenPricesBySymbols } from "@/composables/balances/cryptocompare"
import {
  convertSwapsCurrency
} from '@/composables/pools/usePoolSwapsStats'
import CurrencySelector from '@/UI/CurrencySelector.vue'
import { GetActiveUsers } from '@/composables/users/useActiveUsers'
import GeneralOverview from '@/components/General/GeneralOverview.vue';
import GeneralPrivatePoolsTable from '@/components/General/GeneralPrivatePoolsTable.vue';
import GeneralPerformanceTable from '@/components/General/GeneralPerformanceTable.vue';
import TopTradingTokensTable from '@/components/General/TopTradingTokensTable.vue';
import { GetUniswapActivity } from "@/composables/concentrated-liquidity/useUniswapActivity"


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
const clActivity = ref([])
const activeUsers = ref([])


const chainSelected = ref({
  "name": "All Chains",
  "code": "ALL",
  "img": ""
})
const currencySelected = ref({ "symbol": "$", "code": "USD" })
const currency = computed(() => currencySelected.value.code)
const currencySymbol = computed(() => currencySelected.value.symbol)
const currency_prices = ref(null)
const currencyDecimals = computed(() => currencySelected.value.code == "USD" ? 3 : 5)

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

  const networks = [process.env.VUE_APP_KEY_ARBITRUM ? Network.ARBITRUM : undefined, process.env.VUE_APP_KEY_BINANCE ? Network.BINANCE : undefined, process.env.VUE_APP_KEY_POLYGON ? Network.POLYGON : undefined].filter((n) => n != undefined)
  let data = await Promise.all(networks.map(n => InitPoolsData(n)))

  let poolsData = data.map(d => d[0])

  joinExits.value = networks
    .map((n, i) =>
      data[i][4].joinExtis.map((join) => ({
        ...join,
        chain: DisplayNetwork[n],
        chainId: n
      })),
    )
    .flat()
  clActivity.value = networks
    .map((n, i) =>
      data[i][5].map((item) => ({
        ...item,
        chain: DisplayNetwork[n],
        chainId: n
      })),
    )
    .flat()
  console.log("ACTIVITY - ", joinExits.value, clActivity)
  activeUsers.value = networks
    .map((n, i) =>
      data[i][4].activeUsers.map((user_info) => ({
        ...user_info,
        chain: DisplayNetwork[n],
      })),
    )
    .flat()
  if (!currency_prices.value)
    currency_prices.value = await GetTokenPricesBySymbols(["BTC", "ETH"])
  let _poolSwapsData = networks.map((n, i) => convertSwapsCurrency(data.map(d => d[1])[i], currency_prices.value, currency.value))
  historical_tvl.value = data.map(d => d[2]).flat().sort((a, b) => b.timestamp - a.timestamp)
  let tokenPairs = data.map(d => d[3])
  tokensData.value = networks.map((n, i) => (tokenPairs[i].tokens.flat().map((t) => ({ ...t, Blockchain: DisplayNetwork[n] })))).flat()

  let token_symbols = Array.from(new Set([...tokensData.value.map(t => t.symbol)]))
  historicalPrices.value = await GetHistoricalTokenPrices(token_symbols, true, 500, currency.value)
  let token_prices = getTokensPricesForTimestamp(token_symbols, historicalPrices.value, new Date().getTime() / 1000)
  // update prices to the api solution
  updateTokenPrices(tokenPairs, networks, token_prices)

  tokensData.value = networks.map((n, i) => (tokenPairs[i].tokens.flat().map((t) => ({ ...t, Blockchain: DisplayNetwork[n] })))).flat()

  chainPairs.value = networks.map((n, i) => (tokenPairs[i].tokenPairs.flat().map((t) => ({ ...t, Blockchain: DisplayNetwork[n] })))).flat()
  let notFlattedTokensData = networks.map((n, i) => (tokenPairs[i].tokens.flat().map((t) => ({ ...t, Blockchain: n }))))
  poolSwapsData.value = networks.map((_, i) => [..._poolSwapsData[i]]).flat()
  let tokenSnapshots = networks.map((n, i) => (tokenPairs[i].tokenSnapshots.flat().map((t) => ({ ...t, Blockchain: n })))).flat()
  let chart_data = networks.map((n, i) => (FormatTrackingInfoChart(_poolSwapsData[i], n))).flat()
  chart_data.sort((a, b) => a.timestamp - b.timestamp)
  let formatted_tvl = FormatHistoricalTvl(historical_tvl.value)
  let allPoolsData = networks.map((n, i) => FormatAllPoolForTrackingPage(poolsData[i], _poolSwapsData[i], [], historical_tvl.value, n, currencyDecimals.value)).flat()
  allPoolsTableData.value = allPoolsData
  let allPairsData = networks.map((n, i) => FormatAllPairsData(tokenPairs[i], [..._poolSwapsData[i]], n, currencyDecimals.value)).flat()
  let allTokensData = networks.map((n, i) => FormatAllTokensData(notFlattedTokensData[i], [..._poolSwapsData[i]], n, currencyDecimals.value)).flat()
  allTokensTableData.value = allTokensData
  allPairsTableData.value = allPairsData

  let formatted_token_snapshots = FormatTokenSnapshots(tokenSnapshots, tokensData.value)
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
        "Profits": 0,
        "Revenue": 0,
        "Assets": {},
        "Gas Fees": 0,
        "Volume": 0,
        'Trades': 0,
      }
      empty_tvl_element['TVL'] = formatted_tvl[i]
      if (index == -1) {
        chart_data.push(empty_tvl_element)
      } else {
        chart_data.splice(index, 0, empty_tvl_element)
      }
    }
  }
  let tokens = Object.keys(formatted_token_snapshots).filter((k) => k != 'timestamps' && k != 'Dates')
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
      let prices = getTokensPricesForTimestamp(tokens, historicalPrices.value, chart_data[i].timestamp / 1000)
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
        timestamp: chart_data[i].timestamp * 1000
      }
      chart_data[i].TVL[chainSelected.value.name] = tvl
      chart_data[i].TVL["All chains"] = tvl
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
  return await Promise.all([GetPools(network, null, true, true, currency.value), GetPoolSwapsData(null, network), GetHistoricalTvl(network, null, currency.value), GetTokenPairs(network), GetActiveUsers(network), GetUniswapActivity(network)])
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
