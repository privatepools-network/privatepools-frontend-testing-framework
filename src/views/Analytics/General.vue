<template>
  <MainCard>
    <div class="title text-black dark:!text-white my-3">
      {{ $t('Ecosystem Overview') }}
    </div>
    <GeneralOverview
      :overview="allData.overview"
      :generalOverviewLoader="generalOverviewLoader"
    />
    <div class="title text-black dark:!text-white mt-5 mb-3">
      {{ $t('analytics_chart') }}
    </div>

    <div class="track_info_container">
      <GeneralBotCard
        :currencySelected="currencySelected"
        :chainSelected="chainSelected"
        :allTableData="allPoolsTableData"
        :tokensData="tokensData"
        :poolSwapsData="poolSwapsData"
        :chains_data="allData.analytics"
      />

      {{ console.log('filteredData', filteredData) }}
      <!-- Test chart -->
      <MainChart
        :height="600"
        :series="series"
        :chartOptions="chartOptions"
        :filteredData="filteredData"
        :timelines="timelines"
        :currentTimeline="currentTimeline"
        :isCumulativeMode="isCumulativeMode"
        :changeTimeline="changeTimeline"
        :changeCumulativeMode="changeCumulativeMode"
      />
      <!-- <TrackingInfoChart 
        :chartData="allData.chart" 
        :chainSelected="chainSelected"
        /> -->
    </div>

    <div class="mt-5 mb-3 flex justify-between items-center">
      <div class="title text-black dark:!text-white">
        {{ $t('top_perfomance_pools') }}
      </div>
      <div>
        <!--  <Tabs :selectedTab="selectedTopPerformanceFilter" :tabsOptions="topPerformanceFilters"
          @changeTab="changeTopPerformanceFilter"></Tabs> -->
      </div>
    </div>
    {{ console.log('user_staked_pools!!!', user_staked_pools) }}
    <GeneralPerformanceTable
      :user_staked_pools="user_staked_pools"
      :all_pools="
        selectedTopPerformanceFilter === t('all')
          ? allData?.topPerformancePools
          : allData?.topPerformancePools?.filter(
              (el) => el.LiquidityType === selectedTopPerformanceFilter,
            )
      "
    />
    <div class="mt-5 mb-3 title text-black dark:!text-white">
      {{ $t('top_trading_tokens') }}
    </div>
    <TopTradingTokensTable :all_tokens="allData.topTradingTokens" />

    <div class="mt-5 mb-3 title text-black dark:!text-white">
      {{ $t('private_pools_activity') }}
    </div>

    <PrivatePoolsTable
      :clActivity="clActivity"
      :wpActivity="joinExits"
      :all_activities="allData.activities ? allData.activities : []"
    />
  </MainCard>
  {{ console.log('dates', dates) }}
</template>

<script setup>
import MainCard from '@/UI/MainCard.vue'
import GeneralBotCard from '@/components/General/GeneralBotCard.vue'
import TrackingInfoChart from '@/components/TrackInfo/TrackingInfoChart.vue'
import { ref, onBeforeMount, watch, computed, onMounted, watchEffect } from 'vue'
import { Network, DisplayNetwork, networkId } from '@/composables/useNetwork'
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
import {
  formatSimpleTimestamp,
  groupTimestampsByDayWithIndexes,
  groupTimestampsByMonthWithIndexes,
  groupTimestampsByWeekWithIndexes,
  trimZeros,
} from '@/lib/utils/index'
import { GetTokenPricesBySymbols } from '@/composables/balances/cryptocompare'
import {
  convertSwapsCurrency,
  isRightChainName,
} from '@/composables/pools/usePoolSwapsStats'
import { GetActiveUsers } from '@/composables/users/useActiveUsers'
import GeneralOverview from '@/components/General/GeneralOverview.vue'
import PrivatePoolsTable from '@/components/General/PrivatePoolsTable.vue'
import GeneralPerformanceTable from '@/components/General/GeneralPerformanceTable.vue'
import TopTradingTokensTable from '@/components/General/TopTradingTokensTable.vue'
import { GetUniswapActivity } from '@/composables/concentrated-liquidity/useUniswapActivity'
import { getGeneralData } from '@/composables/data/generalData'
import MainChart from '@/UI/MainChart.vue'
import { t } from 'i18next'
import { useWalletPools } from '@/composables/wallet/useWalletPools'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { sumFields } from '@/lib/utils'
import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'

const settingsStore = useSettings()

const { currentCurrency } = storeToRefs(settingsStore)

const postfix = computed(() =>
  currentCurrency.value == 'USD' ? '' : `_${currentCurrency.value}`,
)

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

const allData = ref({})

const generalOverviewLoader = ref(true)

const topPerformanceFilters = [t('all'), 'WP', 'CL']

const selectedTopPerformanceFilter = ref(topPerformanceFilters[0])

///////////////////////////! TIMELINE

const timelines = [
  {
    name: t('daily'),
  },
  {
    name: t('weekly'),
  },
  {
    name: t('monthly'),
  },
]

const currentTimeline = ref(timelines[2])
const isCumulativeMode = ref(false)

const TimelineFilters = {
  // 'All-time': groupTimestampsByDayWithIndexes,
  [t('daily')]: groupTimestampsByDayWithIndexes,
  [t('weekly')]: groupTimestampsByWeekWithIndexes,
  [t('monthly')]: groupTimestampsByMonthWithIndexes,
}

function changeTimeline(tl) {
  currentTimeline.value = tl
}

function changeCumulativeMode() {
  isCumulativeMode.value = !isCumulativeMode.value
}

///////////////////////////!

const filteredData = computed(() =>
  allData.value.chart && allData.value.chart.length > 0
    ? getFilteredData()
    : [],
)

const dates = computed(() => {
  return filteredData.value.map((v) => v.Date)
})



const preFiltersList = ref([
  {
    title: 'Revenue',
    code: 'Revenue',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: 'Revenue',
    code: 'Revenue_ETH',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: 'Revenue',
    code: 'Revenue_BTC',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: 'Gas Fees',
    code: 'Gas Fees',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: 'Gas Fees',
    code: 'Gas Fees_ETH',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: 'Gas Fees',
    code: 'Gas Fees_BTC',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: 'Trades',
    code: 'Trades',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: 'Volume',
    code: 'Volume',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: 'Volume',
    code: 'Volume_ETH',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: 'Volume',
    code: 'Volume_BTC',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: 'TVL',
    code: 'TVL',
    isSolo: true,
    selected: true,
    cumulable: false,
  },
  {
    title: 'TVL',
    code: 'TVL_ETH',
    isSolo: true,
    selected: true,
    cumulable: false,
  },
  {
    title: 'TVL',
    code: 'TVL_BTC',
    isSolo: true,
    selected: true,
    cumulable: false,
  },

  {
    title: 'Average APR',
    code: 'Average APR',
    isSolo: true,
    selected: true,
    cumulable: false,
  },

  {
    title: 'Profits',
    code: 'Profits',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: 'Profits',
    code: 'Profits_ETH',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: 'Profits',
    code: 'Profits_BTC',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: 'Token Incentives',
    code: 'Token Incentives',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
  {
    title: 'Volatility Index',
    code: 'Volatility Index',
    isSolo: true,
    selected: true,
    cumulable: true,
  },
])

const dataGasFees = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Gas Fees').selected)
    return filteredData.value.map((v) => v[`Gas Fees${postfix.value}`])
  return []
})
const dataRevenues = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Revenue').selected)
    return filteredData.value.map((v) => v[`Revenue${postfix.value}`])
  return []
})

const dataTVL = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'TVL').selected)
    return filteredData.value.map((v) => v[`TVL${postfix.value}`]['Binance'])
  return []
})

const dataVolumes = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Volume').selected)
    return filteredData.value.map((v) => v[`Volume${postfix.value}`])
  return []
})
const dataTrades = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Trades').selected)
    return filteredData.value.map((v) => v['Trades'])
  return []
})

const dataAvgApr = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Average APR').selected)
    return filteredData.value.map((v) => v['Average APR'])
  return []
})

const dataVolatilityIndexes = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Volatility Index').selected)
    return filteredData.value.map((v) => v['Volatility Index'])
  return []
})
const dataProfits = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Profits').selected)
    return filteredData.value.map((v) => v[`Profits${postfix.value}`])
  return []
})

function yAxisEntity(seriesName, color, opposite, show) {
  return {
    min: 0,
    seriesName: seriesName,
    show: show,
    decimalsInFloat: 2,
    opposite: opposite,
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: true,
      color: color,
    },
    labels: {
      style: {
        colors: color,
        fontSize: '10px',
        fontFamily: 'Roboto Mono',
        fontWeight: 500,
      },
    },
    title: {
      text: seriesName,
      style: {
        color: color,
      },
    },
  }
}

const series = computed(() => [
  {
    name: 'Gas Fees',
    type: 'column',
    data: dataGasFees.value,
    color: '#008FFB',
  },
  {
    name: 'Revenue',
    type: 'column',
    data: dataRevenues.value,
    color: '#9f9fff',
  },
  {
    name: 'TVL',
    type: 'area',
    data: dataTVL.value,
    color: '#F07E07',
  },
  {
    name: 'Volume',
    type: 'column',
    data: dataVolumes.value,
    color: '#ff6464',
  },
  {
    name: 'Trades',
    type: 'column',
    data: dataTrades.value,
    color: '#6e27b2',
  },
  {
    name: 'APR',
    type: 'area',
    data: dataAvgApr.value,
    color: '#ffb6c1',
  },
  {
    name: 'Volatility Index',
    type: 'area',
    data: dataVolatilityIndexes.value,
    color: '#01B47E',
  },
  {
    name: 'Profits',
    type: 'column',
    data: dataProfits.value,
    color: '#00FF75',
  },
])

const chartOptions = ref({
  chart: {
    type: 'line',
    stacked: false,

    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: -20,
      tools: {
        download: true,
        // selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        // pan: true,
        reset: true,
      },

      autoSelected: 'zoom',
    },
  },

  dataLabels: {
    enabled: false,
  },

  xaxis: {
    // min: 1,
    // max: 10,
    // range: 10,
    // type: 'datetime',
    tooltip: { enabled: false },
    categories: dates,
    tickAmount: 12,
    labels: {
      // trim: false,
      // rotate: 0,
      // minHeight: 40,
      // hideOverlappingLabels: true,
      style: {
        colors: 'white',
        fontSize: '10px',
        fontFamily: 'Roboto Mono',
        fontWeight: 500,
      },
    },
  },
  yaxis: [
    yAxisEntity('Gas Fees', '#008FFB', true, true),
    yAxisEntity('Revenue', '#9f9fff', true, true),
    yAxisEntity('TVL', '#F07E07', false, true),
    yAxisEntity('Volume', '#ff6464', true, false),
    yAxisEntity('Trades', '#6e27b2', true, true),
    yAxisEntity('APR', '#ffb6c1', true, true),
    yAxisEntity('Volatility Index', '#01B47E', true, false),
    yAxisEntity('Profits', '#00FF75', true, false),
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
      borderRadiusApplication: 'end',
      columnWidth: '70%',
      barHeight: '70%',
    },
  },
  fill: {
    type: ['solid', 'solid', 'gradient', 'solid', 'solid', 'gradient'],
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0,
      opacityFrom: 0.9,
      opacityTo: 0.65,
      stops: [0, 20, 100],
    },
  },
  stroke: {
    curve: 'smooth',
    width: 1,
  },
  tooltip: {
    theme: false,

    fixed: {
      enabled: false,
      position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
      offsetY: 30,
      offsetX: 80,
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetX: 40,
    fontSize: '12px',
    fontFamily: 'Montserrat',
    fontWeight: 500,
    colors: 'white',
    labels: {
      colors: undefined,
      useSeriesColors: true,
    },
    markers: {
      width: 22,
      height: 12,
      radius: 4,
      offsetX: 0,
      offsetY: 1.5,
    },
  },
  grid: {
    show: true,
    borderColor: 'rgba(51,51,51, 0.35)',
    position: 'back',
  },
})

const chainSelected = ref({
  name: 'All Chains',
  code: 'ALL',
  img: '',
})
const currencySelected = ref({ symbol: '$', code: 'USD' })
const currency = computed(() => currencySelected.value.code)
const currencySymbol = computed(() => currencySelected.value.symbol)
const currency_prices = ref(null)
const currencyDecimals = computed(() =>
  currencySelected.value.code == 'USD' ? 3 : 5,
)
const user_staked_pools = ref([])

const ChainRelatedFields = [
  'Gas Fees',
  'Revenue',
  'Profits',
  'Volume',
  'Trades',
]

const chainsMap = ref(getDefaultChainsMapValue())

function getDefaultChainsMapValue() {
  return ChainRelatedFields.reduce(
    (acc, currentValue) => ({
      ...acc,
      [currentValue]: { Arbitrum: [], Binance: [], Polygon: [] },
    }),
    {},
  )
}

function getFilteredData() {
  let result = []
  let chart_data = allData.value.chart.filter(
    (d) =>
      isRightChainName(d.Blockchain, chainSelected.value.name) ||
      d.Blockchain == '',
  )
  let timestamps = chart_data.map((v) => v.timestamp)
  let indexes = TimelineFilters[currentTimeline.value.name](timestamps)
  indexes = indexes.sort((a, b) => a - b)
  let selectedFilters = preFiltersList.value.filter((v) => v.selected)
  let selectedCumulableCodes = selectedFilters
    .filter((v) => v.cumulable)
    .map((v) => v.code)
  chainsMap.value = getDefaultChainsMapValue()
  console.log(selectedFilters)
  for (let i = 0; i < indexes.length; i++) {
    let start_index = i == 0 ? 0 : indexes[i - 1] + 1
    let end_index = indexes[i] + 1
    let previousItems = chart_data.slice(start_index, end_index)

    previousItems = previousItems.filter(
      (p) =>
        p.Blockchain == '' ||
        isRightChainName(p.Blockchain, chainSelected.value.name),
    )
    let item = {
      ...chart_data[indexes[i]],
      ...sumFields(previousItems, selectedCumulableCodes),
    }
    let result_item = {
      Blockchain: item.Blockchain,
      timestamp: item.timestamp,
      Date: item.Date,
    }
    for (let k = 0; k < selectedFilters.length; k++) {
      let filter_code = selectedFilters[k].code
      if (
        !ChainRelatedFields.includes(filter_code) ||
        (ChainRelatedFields.includes(filter_code) &&
          isRightChainName(item.Blockchain, chainSelected.value.name))
      ) {
        if (Object.hasOwn(item, filter_code)) {
          if (isCumulativeMode.value && selectedFilters[k].cumulable) {
            let previous_value =
              result.length == 0 ? 0 : result[result.length - 1][filter_code]
            result_item[filter_code] = item[filter_code] + previous_value
          } else {
            result_item[filter_code] = item[filter_code]
          }
        }
        if (filter_code == 'Average APR') {
          result_item[filter_code] = item[filter_code]
        }
        if (filter_code == 'Volatility Index') {
          result_item[filter_code] = item[filter_code]
        }
      } else {
        result_item['Blockchain'] = ''
        if (isCumulativeMode.value && selectedFilters[k].cumulable) {
          result_item[filter_code] =
            result.length == 0 ? 0 : result[result.length - 1][filter_code]
        } else result_item[filter_code] = 0
      }
    }
    result.push(result_item)
  }

  return result
}

onBeforeMount(async () => {
  generalOverviewLoader.value = true
  if (!process.env.VUE_APP_LOCAL_API) {
    InitTreasuryYields()
    await Init()
  } else {
    allData.value = await getGeneralData(56)
    generalOverviewLoader.value = false
    // historicalPrices.value = await GetHistoricalTokenPrices(allData.value.topTradingTokens.map((item) => item.symbol), true, 500, currency.value)
    console.log(allData.value)
  }
})
watch(networkId, async () => {
  if (networkId.value) {
    let mmProvider = await InitializeMetamask()
    if (mmProvider) {
      let address = await mmProvider.getSigner().getAddress() //'0x282a2dfee159aa78ef4e28d2f9fdc9bd92a19b54' //

      user_staked_pools.value = await useWalletPools(address, 56, false)
    }
  }
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
        chainId: n,
      })),
    )
    .flat()
  clActivity.value = networks
    .map((n, i) =>
      data[i][5].map((item) => ({
        ...item,
        chain: DisplayNetwork[n],
        chainId: n,
      })),
    )
    .flat()
  console.log('ACTIVITY - ', joinExits.value, clActivity)
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

  chartData.value = chart_data //addEmptyDays(chart_data)
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
  }
}

async function InitPoolsData(network) {
  return await Promise.all([
    GetPools(network, null, true, true, currency.value),
    GetPoolSwapsData(null, network),
    GetHistoricalTvl(network, null, currency.value),
    GetTokenPairs(network),
    GetActiveUsers(network),
    GetUniswapActivity(network),
  ])
}

watch(filteredData, async () => {
  if (filteredData.value !== 0) {

    console.log('chartOptions.value', chartOptions.value)

    // Animated filtration by time
    // setTimeout(() => {
    //   const legendItems = document.querySelectorAll('.apexcharts-legend-text')
    //   legendItems[3].dispatchEvent(new Event('click'))
    // }, 50)
    // setTimeout(() => {
    //   const legendItems = document.querySelectorAll('.apexcharts-legend-text')
    //   legendItems[4].dispatchEvent(new Event('click'))
    // }, 50)
    // setTimeout(() => {
    //   const legendItems = document.querySelectorAll('.apexcharts-legend-text')
    //   legendItems[6].dispatchEvent(new Event('click'))
    // }, 50)
    // setTimeout(() => {
    //   const legendItems = document.querySelectorAll('.apexcharts-legend-text')
    //   legendItems[7].dispatchEvent(new Event('click'))
    // }, 50)
  }
})

</script>
<style lang="scss">
@import '@/styles/_variables.scss';

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
  }
}

.title {
  font-size: 18px;
  font-weight: 700;
}
</style>
