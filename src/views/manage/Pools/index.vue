<template>
  <MainCard>
    <Title :title="'Private Pools'" />

    <div class="d-flex justify-content-between mt-3 mb-4 flex-wrap">
      <PoolFilters
        :hidePools="hidePools"
        :optionsPoolType="optionsPoolType"
        :optionsPoolAttribute="optionsPoolAttribute"
        :optionsTokens="optionsTokens"
      />
    </div>

    <div class="pools-rows">
      <div class="pools-row pools-row_header">
        <div
          class="pools-row__col"
          :class="
            // Table headers positioning by header names
            headCaption === 'Composition' || headCaption === 'Tokens'
              ? 'justify-content-start'
              : 'justify-content-center'
          "
          v-for="(headCaption, headCaptionIndex) in headers"
          :key="headCaption"
        >
          <div class="file-table-header-cell">
            <div
              class="d-flex align-items-center gap-1"
              :class="headCaptionIndex !== 0 ? header_cells_inside : ''"
              style="cursor: pointer; height: 20px"
            >
              <div :class="'head_caption_text'">
                {{ headCaption }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CRow>
      <div class="pools-rows" v-if="viewMode == 'rows'">
        <div class="pools-row pools-row_header">
          <div
            class="pools-row__col"
            :class="
              headCaption === 'Composition' || headCaption === 'Tokens'
                ? 'justify-content-start'
                : 'justify-content-center'
            "
            v-for="(headCaption, headCaptionIndex) in headers"
            :key="headCaption"
          >
            <div class="file-table-header-cell">
              <div
                class="d-flex align-items-center gap-1"
                :class="headCaptionIndex !== 0 ? header_cells_inside : ''"
                style="cursor: pointer; height: 20px"
              >
                <div
                  style=""
                  v-if="
                    !['pool composition', 'actions', 'tokens'].includes(
                      headCaption.toLowerCase(),
                    ) && sortedHeader.caption !== headCaption
                  "
                ></div>
                <div
                  style="
                    width: 20px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                  "
                  v-if="
                    ['tokens'].includes(headCaption.toLowerCase()) &&
                    sortedHeader.caption !== headCaption
                  "
                >
                  <svg
                    width="24"
                    height="16"
                    viewBox="0 0 24 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_156_47)">
                      <g clip-path="url(#clip1_156_47)">
                        <path
                          d="M7.5 15C11.366 15 14.5 11.866 14.5 8C14.5 4.13401 11.366 1 7.5 1C3.63401 1 0.5 4.13401 0.5 8C0.5 11.866 3.63401 15 7.5 15Z"
                          stroke="white"
                        />
                        <path
                          d="M16.5 15C20.366 15 23.5 11.866 23.5 8C23.5 4.13401 20.366 1 16.5 1C12.634 1 9.5 4.13401 9.5 8C9.5 11.866 12.634 15 16.5 15Z"
                          stroke="white"
                        />
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_156_47">
                        <rect
                          width="24"
                          height="15"
                          fill="white"
                          transform="translate(0 0.5)"
                        />
                      </clipPath>
                      <clipPath id="clip1_156_47">
                        <rect
                          width="24"
                          height="15"
                          fill="white"
                          transform="translate(0 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="all_pools.length === 0" class="my-5">
        <LoaderPulse />
      </div>
      <PoolRow
        v-for="(pool, index) in all_pools.slice(0, sliceNumber)"
        :key="pool.name"
        :pool="pool"
        :inactive="isPoolInactive(pool)"
        :index="index"
        @goToPoolWithdraw="goToPoolWithdraw"
        @goToCLPool="goToCLPool"
        @goToPool="goToPool"
        @goToPoolDeposit="goToPoolDeposit"
        @goToCL="goToCL"
        :isActions="true"
      />

      {{ console.log('all_pools', all_pools) }}
      <div
        @click="all_pools.slice(0, (sliceNumber = sliceNumber + 5))"
        class="load_more"
      >
        Load More
        <!-- <img :src="arrow_bottom" /> -->
      </div>

      <!-- <Pagination
        v-if="filterByStatus.length != 0"
        :perPage="perPage"
        :pools="pools"
        :currentPage="currentPage"
        @changePage="changePage"
        @changePerPage="changePerPage"
        :perPageOptions="perPageOptions"
      ></Pagination> -->
    </CRow>
  </MainCard>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import router from '@/router'
import ComposePoolDropdown from '@/components/Pool/ComposePoolDropdown.vue'
import PoolFilters from '@/components/Pool/PoolFilters.vue'

import { useRoute } from 'vue-router'
import { GetPools } from '@/composables/pools/usePools.js'
import {
  FormatAllPoolForTrackingPage,
  FormatAllToDisplay,
} from '@/lib/formatter/poolsFormatter'
// import NetworkWarning from '@/components/modals/NetworkWarning.vue'
import { ethers } from 'ethers'
import { GetPoolSwapsData } from '@/composables/pools/charts/usePoolSwapsData'
import { GetPoolHistoricValues } from '@/composables/pools/charts/usePoolHistoricValues'
import PoolRow from '@/components/Manage/Pool/PoolRow.vue'
import MainCard from '@/UI/MainCard.vue'
import Title from '@/UI/Title'
import { GetHistoricalTvl } from '@/composables/pools/snapshots/usePoolHistoricalTvl'
import { isRightChainName } from '@/composables/pools/usePoolSwapsStats'
import { useUniswapPools } from '@/composables/concentrated-liquidity/useUniswapPools'
import {
  DisplayNetwork,
  Network,
  networkId,
  DisplayChain,
} from '@/composables/useNetwork'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { useWalletPools } from '@/composables/wallet/useWalletPools'
import { useDevice } from '@/composables/adaptive/useDevice'
import { isTimestampWithinLast7Days } from '@/lib/utils'
import { useUniswapTvlSnapshots } from '@/composables/concentrated-liquidity/useUniswapTvlSnapshots'
import { CalculateCLAPR } from '@/composables/math/chartMath/trackingInfoMath'
const viewMode = ref('rows')
const { width } = useDevice()

const chainSelected = ref({ name: 'All Chains', code: 'ALL', img: '' })
const composePoolDropdownOpen = ref(false)
const selectTokenDropdownOpen = ref(false)
const moreFiltersDropdownOpen = ref(false)
const sliceNumber = ref(10)

const headers = [
  'Tokens',
  'Composition',
  'ROI',
  'TVL',

  'Volume (24h)',

  'APR',

  'Actions',
]

const route = useRoute()
// const periodsHeaders = [
//   'Revenue',
//   'Fees',
//   'Trades',
//   'Volume',
//   'TVL',
//   'APR',
//   'Profit',
// ]
const onClickAway = (event) => {
  selectTokenDropdownOpen.value = false
}
const onClickAwayFilters = (event) => {
  moreFiltersDropdownOpen.value = false
}

const optionsTokens = ref([])
const optionsPoolType = ref([
  { name: 'Weighted', selected: false },
  { name: 'CLP', selected: false },
])
const optionsPoolAttribute = ref([{ name: 'New', selected: false }])

const filterOptions = computed(() =>
  headers.map((h) => {
    return [
      { name: 'All Time', code: `${h} All Time` },
      { name: '24 H', code: `${h} 24 H` },
      { name: '7 D', code: `${h} 7 D` },
      { name: '30 D', code: `${h} 30 D` },
    ]
  }),
)
const filtersSelected = ref(filterOptions.value.map((h) => h[0]))

const sortedHeader = ref({})
const sortSymbol = computed(() => {
  if (!sortedHeader.value || !sortedHeader.value.caption) return ''
  if (sortedHeader.value.direction == 'asc') {
    return '↓'
  }
  return '↑'
})

const perPage = ref(10)
const perPageOptions = computed(() => {
  if (viewMode.value == 'rows') {
    return [10, 25, 50]
  } else {
    return [8, 16, 32]
  }
})

function changePerPage(v1) {
  perPage.value = Number(v1)
  currentPage.value = 1
}

const currentPage = ref(1)

function changePage(args) {
  if (args.isEquating == false) {
    currentPage.value = currentPage.value + args.num
  } else {
    currentPage.value = args.num
  }
}

const filterByStatus = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = currentPage.value * perPage.value
  const result = pools.value
    .filter((pool) =>
      isRightChainName(pool.Blockchain, chainSelected.value.name),
    )
    .sort(function (a, b) {
      return parseInt(b.TVL) - parseInt(a.TVL)
    })
    .slice(start, end)
  return result
})

const searchBy = ref('')

watch(searchBy, (_new) => {
  if (_new.length > 0) {
    let foundPools = []
    pools.value.forEach((pool) => {
      pool['Name'][0].forEach((name) => {
        const lowerCaseName = name.toLowerCase()
        const lowerCaseSearchTerm = _new.toLowerCase()
        const nameArr = lowerCaseName.split('')
        const searchTermArr = lowerCaseSearchTerm.split('')
        if (
          nameArr.splice(0, searchTermArr.length).join('') ==
          lowerCaseSearchTerm
        ) {
          foundPools.push(pool)
        }
      })
    })
    pools.value = foundPools
  } else {
    pools.value = [...defaultPools.value.map((item) => ({ ...item }))]
  }
})

const hidePools = ref(false)

watch(chainSelected, () => {
  pools.value = FormatAllToDisplay(defaultPools.value, chainSelected.value.name)
})

watch(networkId, async () => {
  await InitUserStakedPools()
})

async function InitUserStakedPools() {
  if (networkId.value) {
    let mmProvider = await InitializeMetamask()
    //DELETE
    let address = await mmProvider.getSigner().getAddress() //'0x759ee62a73a8a0690a0e20fc489d3f462b4385c0'
    user_staked_pools.value = await useWalletPools(
      address,
      networkId.value,
      false,
    )
  }
}

const poolsData = ref([])

const historicValues = ref([])
const poolSwapsData = ref([])
const historicTvl = ref([])

const pools = ref([])
const user_staked_pools = ref([])
const poolsNoResult = ref(true)
const defaultPools = ref([])
const cl_pools = ref([])
const cl_snapshots = ref([])
watch(defaultPools, () => {
  console.log(defaultPools.value)
  pools.value = FormatAllToDisplay(defaultPools.value, chainSelected.value.name)
  console.log('POOLS - ', pools.value)
})

// const visibleNetworkModal = ref(false)
// const NetworkUnsupported = ref(false)
const networksSupported = ref(null)
const caption = ref('Private Pools')

const selectedTokens = ref([])

watch(networkId, () => {
  networksSupported.value = { chainId: networkId.value }
  if (networkId.value <= 0) networksSupported.value = false
  else networksSupported.value = true
})

function isPoolInactive(pool) {
  return (
    !networksSupported.value ||
    DisplayNetwork[networkId.value] != pool.Blockchain
  )
}

const onClick = () => {
  router.push('/pools/compose')
}
const onClickConcentratedPool = () => {
  router.push('/pools/concentrated_pool')
}

function goToPoolDeposit(args) {
  if (all_pools.value[args.index].LiquidityType == 'CL') {
    router.push({
      name: 'Concentrated liquidity',
      query: {
        tokens: all_pools.value[args.index].tokens,
        fee: all_pools.value[args.index].fee,
      },
    })
  } else {
    router.push({
      name: 'Pool Deposit',
      params: {
        // id: filterByStatus.value[args.index].id,
        id: all_pools.value[args.index].id,
        onMountedActivity: args.onMountedActivity,
        chainSelected: DisplayChain[networkId.value],
      },
    })
  }
}
function goToPoolWithdraw(args) {
  router.push({
    name: 'Pool Withdraw',
    params: {
      // id: filterByStatus.value[args.index].id,
      id: all_pools.value[args.index].id,
      onMountedActivity: args.onMountedActivity,
      chainSelected: DisplayChain[networkId.value],
    },
  })
}
function goToPool(args) {
  router.push({
    name: 'Pool Details',
    params: {
      // id: filterByStatus.value[args.index].id,
      id: all_pools.value[args.index].id,
      onMountedActivity: args.onMountedActivity,
      chainSelected: DisplayChain[networkId.value],
    },
  })
}
function goToCLPool(args) {
  router.push({
    name: 'Pool CL Details',
    params: {
      // id: filterByStatus.value[args.index].id,
      id: all_pools.value[args.index].id,
      onMountedActivity: args.onMountedActivity,
      chainSelected: DisplayChain[networkId.value],
    },
  })
}

function goToCL(args) {
  router.push({
    name: 'Concentrated liquidity',
    query: {
      tokens: all_pools.value[args.index].tokens,
      fee: all_pools.value[args.index].fee,
    },
    // chainSelected: DisplayChain[networkId.value],
  })
}

// function filterTvl() {
//   if (hidePools.value === false) {
//     pools.value = FormatAllToDisplay(
//       defaultPools.value,
//       chainSelected.value.name,
//     )
//   } else if (hidePools.value === true) {
//     pools.value = pools.value.filter((el) => Number(el.TVL) > 1000)
//   }
// }

watch(selectedTokens, () => {
  if (selectedTokens.value.length === 0) {
    pools.value = FormatAllToDisplay(
      defaultPools.value,
      chainSelected.value.name,
    )
  } else {
    if (selectedTokens.value.length !== 0) {
      pools.value = pools.value.filter((el) =>
        selectedTokens.value.find((element) =>
          el.Name[0].includes(element.code),
        ),
      )
    }
  }
})

async function InitPoolsData(network) {
  return await Promise.all([
    GetPools(network, null, true, true),
    GetPoolSwapsData(null, network),
    GetPoolHistoricValues(null, network),
    GetHistoricalTvl(network),
  ])
}

onMounted(async () => {
  const networks = [
    process.env.VUE_APP_KEY_ARBITRUM ? Network.ARBITRUM : undefined,
    process.env.VUE_APP_KEY_BINANCE ? Network.BINANCE : undefined,
    process.env.VUE_APP_KEY_POLYGON ? Network.POLYGON : undefined,
  ].filter((n) => n != undefined)

  const networksInfo = await Promise.all(
    networks.map((network) => InitPoolsData(network)),
  )
  console.log(networksInfo)
  poolsData.value = networks.map((n, index) => networksInfo[index][0]).flat()
  poolSwapsData.value = networks
    .map((n, index) => networksInfo[index][1])
    .flat()
  historicValues.value = networks
    .map((n, index) => networksInfo[index][2])
    .flat()
  historicTvl.value = networks.map((n, index) => networksInfo[index][3]).flat()
  console.log('HISTORICAL TVL - ', historicTvl.value)
  let _defaultPools = networks
    .map((n, index) =>
      FormatAllPoolForTrackingPage(
        networksInfo[index][0],
        networksInfo[index][1],
        networksInfo[index][2],
        networksInfo[index][3],
        n,
      ),
    )
    .flat()
  console.log(_defaultPools)
  defaultPools.value = _defaultPools
  let volume_7d_trades = poolSwapsData.value.filter((item) =>
    isTimestampWithinLast7Days(item.timestamp),
  )
  cl_snapshots.value = await useUniswapTvlSnapshots(null)
  cl_pools.value = (await useUniswapPools(56)).map((item) => ({
    id: item.id,
    address: item.id,
    'Pool Name': [[item.token0.symbol, item.token1.symbol]],
    'Pool Weight': [
      [
        { token: item.token0.symbol, weight: '50%' },
        { token: item.token1.symbol, weight: '50%' },
      ],
    ],
    tokens: [item.token0.id, item.token1.id],
    time_created: item.createdAtTimestamp,
    LiquidityType: 'CL',
    ROI: '-',
    Liquidity: item.totalValueLockedUSD,
    TVL: item.totalValueLockedUSD,
    Volume: volume_7d_trades
      .filter((trade) => trade.swaps[0].poolIdVault[0] == item.id)
      .reduce((sum, trade) => sum + trade.volumeUsd, 0)
      .toFixed(2),
    APR: CalculateCLAPR(
      cl_snapshots.value.filter((snapshot) => snapshot.pool.id == item.id),
      poolSwapsData.value,
      item.id,
    ),
    fee: item.feeTier,
    Blockchain: 'Binance',
  }))
  console.log('CL POOLS - ', cl_pools.value)
  let wp_symbols = _defaultPools
    .map((item) => item.tokens.map((item) => item.symbol))
    .flat()
  let cl_symbols = cl_pools.value.map((item) => item['Pool Name'][0]).flat()
  let all_token_symbols = Array.from(new Set(wp_symbols.concat(cl_symbols)))
  optionsTokens.value = all_token_symbols.map((item) => ({
    code: item,
    name: item,
    selected: item == route.query.token,
  }))
  await InitUserStakedPools()
  if (window.ethereum !== undefined && networkId.value > 0) {
    let provider = new ethers.providers.Web3Provider(window.ethereum)
    networksSupported.value = await provider.getNetwork()
  }

  if (
    window.ethereum === undefined ||
    window.ethereum?._state?.accounts?.length === 0 ||
    !localStorage.getItem('isConnectedToWeb3')
  ) {
    // NetworkUnsupported.value = false
    // changeVisibleNetworkModal()
  }
  if (
    window.ethereum !== undefined &&
    networkId.value > 0 &&
    window.ethereum?._state?.accounts?.length !== 0 &&
    networksSupported.value.chainId !== 42161 &&
    networksSupported.value.chainId !== 56 &&
    networksSupported.value.chainId !== 137
  ) {
    // NetworkUnsupported.value = true
    // changeVisibleNetworkModal()
  }

  setTimeout(() => {
    poolsNoResult.value = false
  }, 4000)
})

// function getClPoolApr(poolId) {
//   let formattedTvls = cl_snapshots.value.toReversed()
//   formattedTvls = formattedTvls.map((item) => ({
//     TVL: {
//       'All Chains': parseFloat(item.totalValueLockedUSD),
//       timestamp: item.timestamp,
//     },
//   }))
//   let pool_trades = trades.value.filter((item) =>
//     item.swaps[0].poolIdVault[0].includes(poolId.value),
//   )
//   let profit = usePool30dProfit(pool_trades).value
//   return CalculateAvgApr(
//     { Profits: profit },
//     formattedTvls,
//     'Monthly',
//     'All Chains',
//   )
// }

const all_pools = computed(() => {
  let result = []
  let nonSelected =
    !optionsPoolType.value[0].selected && !optionsPoolType.value[1].selected
  if (nonSelected || optionsPoolType.value[0].selected) {
    result.push(...pools.value)
  }
  if (nonSelected || optionsPoolType.value[1].selected) {
    result.push(...cl_pools.value)
  }
  if (hidePools.value) {
    let user_pools_ids = user_staked_pools.value.map((item) => item.id)
    result = result.filter((item) => user_pools_ids.includes(item.id))
  }
  if (optionsPoolAttribute.value[0].selected) {
    let now = Date.now() / 1000
    result = result.filter(
      (item) => item.time_created >= now - 60 * 60 * 24 * 30,
    )
  }
  let selectedTokens = optionsTokens.value
    .filter((item) => item.selected)
    .map((item) => item.code)
  if (selectedTokens.length > 0) {
    console.log('OPTIONS TOKENS - ', optionsTokens.value)
    result = result.filter(
      (item) =>
        item['Pool Name'][0].filter((token) => selectedTokens.includes(token))
          .length > 0,
    )
  }
  console.log('ALL POOLS - ', result)
  return result.toSorted((a, b) => b.TVL - a.TVL)
})

function onDatatableHeaderClick(caption) {
  let availableFilterHeaders = [
    'Profit',
    'Revenue',
    'Trades',
    'Volume',
    'Fees',
    'TVL',
    'APR',
  ]
  if (
    availableFilterHeaders
      .map((t) => t.toLowerCase())
      .includes(caption.toLowerCase())
  ) {
    let sortedAsc = [...pools.value].sort((a, b) => a[caption] - b[caption])
    let sortedDesc = [...pools.value].sort((a, b) => b[caption] - a[caption])

    if (JSON.stringify(sortedDesc) == JSON.stringify(pools.value)) {
      pools.value = sortedAsc
      sortedHeader.value = { caption, direction: 'asc' }
    } else {
      pools.value = sortedDesc
      sortedHeader.value = { caption, direction: 'desc' }
    }
  }
}

function onFilterClick(filterValue, header) {
  pools.value.forEach((td) => {
    let found = defaultPools.value.find((dtd) => dtd.id == td.id)
    td[header] = found[filterValue.code]
  })
}

function filterPoolAmount() {
  return all_pools.value.slice(0, 10)
}
</script>

<style lang="scss">
@import '@/styles/_variables.scss';

.head_caption_text {
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
  line-height: 24px;
  color: white;
}

.pools-row {
  &_header {
    font-size: 10px;
    font-family: Poppins;
    font-weight: 600;

    @media (max-width: $xxl) {
      font-size: 8px;
    }
  }

  .multiselect__single {
    background: none;
  }

  :deep(.multiselect__tags) {
    background: none !important;
    border-color: rgba(0, 0, 0, 0) !important;
    padding: 8px 20px 0 8px !important;
  }

  :deep(.multiselect__content-wrapper) {
    border-color: #00c9ff !important;
    border-top: 1px solid;
    width: 190px;
    right: 0px;
  }

  .multiselect__single {
    background: none !important;
    color: white !important;
  }

  .multiselect__option {
    background: rgb(15, 17, 19) !important;
    color: white !important;
  }

  :deep(.multiselect__option:hover) {
    background: rgba(1, 180, 126, 0.884) !important;
  }

  :deep(.multiselect__option--selected) {
    color: #00c9ff !important;
  }

  :deep(.multiselect__option--selected:hover) {
    color: rgb(229, 83, 83) !important;
    background: rgb(15, 17, 19) !important;
  }
}

.pools {
  &-rows {
    padding: 0;
    border-radius: 16px;
    border: 1px solid #ffffff0d;
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 2%),
      rgba(255, 255, 255, 0%)
    );
    box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

    margin-bottom: 30px;

    @media all and (max-width: $lg) {
      overflow-x: auto;
    }
  }

  &-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 30px;

    @media all and (max-width: 992px) {
      justify-content: space-between;
    }
  }
}

.load_more {
  font-family: Inter;
  font-size: clamp(12px, 0.8vw, 14px);
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: center;
  color: #7d7d7d;
  padding: 15px;

  &:hover {
    color: #00affe;
    cursor: pointer;
    background: #ffffff0e;
  }
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
