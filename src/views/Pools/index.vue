<template>
  <MainCard>
    <!-- <div class="flex items-center gap-2">
      <img :src="walletPoolsImg" />
      <Title :title="'Private Pools'" />
    </div> -->

    <div class="flex md:flex-row flex-col justify-between mt-3 mb-5 flex-wrap">
      <div class="mb-3" v-if="width <= 768">
        <ComposePoolDropdown />
      </div>
      <div class="flex gap-4 flex-wrap md:flex-row flex-col">
        <PoolFilters :hidePools="hidePools" :optionsPoolType="optionsPoolType"
          :optionsPoolAttribute="optionsPoolAttribute" :optionsTokens="optionsTokens" />

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" :value="hidePools" @click="hidePools = !hidePools"
                :checked="hidePools" />
              <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800/50 dark:bg-[#D1D1D6] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2ABDFF]">
              </div>
            </label>
            <div class="dark:!text-white text-black" style="font-size: clamp(12px, 0.8vw, 16px)">
              {{ $t('staked_only') }}
            </div>
          </div>

          <div class="flex items-center">
            <input id="default-checkbox" type="checkbox" v-model="hideSmallPools"
              class="w-4 h-4 text-[#00e0ff] bg-gray-100 border-gray-300 rounded focus:ring-[#00e0ff] dark:focus:ring-[#00e0ff] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label for="default-checkbox" class="ms-2 dark:!text-white text-black"
              style="font-size: clamp(12px, 0.8vw, 16px)">Hide small pools</label>
          </div>
        </div>
      </div>

      <ComposePoolDropdown v-if="width > 768" />

      <!-- {{ console.log('hidePools', hidePools) }} -->
    </div>

    <!-- v-if="width > 768"  -->
    <div v-if="width > 768" class="pools-rows">
      <!-- Headers Desktop -->
      <div class="pools-row pools-row_header">
        <div class="pools-row__col" :class="
          // Table headers positioning by header names
          headCaptionIndex === 0 || headCaptionIndex === 1
            ? 'justify-content-start'
            : 'justify-content-center'
          " v-for="(headCaption, headCaptionIndex) in headers" :key="headCaption">
          <div class="file-table-header-cell">
            <div class="d-flex align-items-center gap-1" :class="headCaptionIndex !== 0 ? header_cells_inside : ''"
              style="cursor: pointer; height: 20px">
              <div v-if="headCaption === t('tokens')" :class="'head_caption_text text-black dark:!text-white'">
                <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_1_2449)">
                    <path
                      d="M7.5 14.5C11.366 14.5 14.5 11.366 14.5 7.5C14.5 3.63401 11.366 0.5 7.5 0.5C3.63401 0.5 0.5 3.63401 0.5 7.5C0.5 11.366 3.63401 14.5 7.5 14.5Z"
                      stroke="white" />
                    <path
                      d="M16.5 14.5C20.366 14.5 23.5 11.366 23.5 7.5C23.5 3.63401 20.366 0.5 16.5 0.5C12.634 0.5 9.5 3.63401 9.5 7.5C9.5 11.366 12.634 14.5 16.5 14.5Z"
                      stroke="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_2449">
                      <rect width="24" height="15" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div v-else-if="headCaption === t('volume')"
                :class="'head_caption_text text-black dark:!text-white flex items-center gap-1'">
                <div class="flex items-center gap-1" @click="
                  ascendFilterBy = `${t('volume')}_${filterByTimeVolume}`
                  ">
                  <img :src="filterArrow" :class="ascendFilterBy === `${t('volume')}_${filterByTimeVolume}`
                      ? 'rotate-180'
                      : ''
                    " />
                  {{ headCaption }} ({{ filterByTimeVolume }})
                </div>
                <img :src="filterSVG" @click="
                  filterByTimeVolume === '24H'
                    ? (filterByTimeVolume = '7D')
                    : filterByTimeVolume === '7D'
                      ? (filterByTimeVolume = '30D')
                      : filterByTimeVolume === '30D'
                        ? (filterByTimeVolume = 'ALL')
                        : filterByTimeVolume === 'ALL'
                          ? (filterByTimeVolume = '24H')
                          : (filterByTimeVolume = '24H')
                  " />
              </div>
              <div v-else-if="headCaption === 'APR'"
                :class="'head_caption_text text-black dark:!text-white flex items-center gap-1'">
                <div class="flex items-center gap-1" @click="ascendFilterBy = `APR ${filterByTimeAPR}`">
                  <img :src="filterArrow" :class="ascendFilterBy === `APR ${filterByTimeAPR}`
                      ? 'rotate-180'
                      : ''
                    " />
                  {{ headCaption }} ({{ filterByTimeAPR }})
                </div>
                <img :src="filterSVG" @click="
                  filterByTimeAPR === '24H'
                    ? (filterByTimeAPR = '7D')
                    : filterByTimeAPR === '7D'
                      ? (filterByTimeAPR = '30D')
                      : filterByTimeAPR === '30D'
                        ? (filterByTimeAPR = 'ALL')
                        : filterByTimeAPR === 'ALL'
                          ? (filterByTimeAPR = '24H')
                          : (filterByTimeAPR = '24H')
                  " />
              </div>
              <div v-else :class="'head_caption_text flex items-center gap-1 text-black dark:!text-white'"
                @click="ascendFilterBy = headCaption">
                <img :class="ascendFilterBy === headCaption ? 'rotate-180' : ''" v-if="
                  !headCaption.includes(t('composition')) &&
                  !headCaption.includes(t('actions'))
                " :src="filterArrow" />
                {{ headCaption }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="user_staked_pools.length === 0 && hidePools" class="my-5 text-center text-black dark:!text-white">
        <div>{{ $t('no_results') }}</div>
        <div>{{ $t('choose_a_pool') }}</div>
      </div>
      <div v-else-if="all_pools.length === 0" class="my-5">
        <LoaderPulse />
      </div>
      {{ console.log('all_pools', all_pools) }}
      <PoolRow v-for="(pool, index) in all_pools

        .slice(0, sliceNumber)
        .filter((item) => !hideSmallPools || item.TVL > minimalTVL)
        .toSorted((a, b) => Number(b[ascendFilterBy] - a[ascendFilterBy]))" :key="pool.name" :pool="pool"
        :filters="{ APR: filterByTimeAPR, Volume: filterByTimeVolume }" :userPools="user_staked_pools"
        :inactive="isPoolInactive(pool)" :index="index" @goToPoolWithdraw="goToPoolWithdraw"
        :rewardsData="rewardsData"
        @goToPoolCompound="goToPoolCompound" @goToCLPool="goToCLPool" @goToPool="goToPool"
        @goToPoolDeposit="goToPoolDeposit" @goToPoolManage="goToPoolManage" @goToCL="goToCL" :isActions="true" />
      <!-- <PoolsMobileTable v-else/> -->

      <div v-if="
        sliceNumber <
        all_pools.filter((item) => !hideSmallPools || item.TVL > minimalTVL)
          .length
      " @click="all_pools.slice(0, (sliceNumber = sliceNumber + 5))" class="load_more text-black dark:!text-white">
        {{ $t('load_more') }}
        <img :src="arrow_bottom" />
      </div>
    </div>
    <div v-else>
      <div v-if="user_staked_pools.length === 0 && hidePools" class="my-5 text-center text-black dark:!text-white">
        <div>{{ $t('no_results') }}</div>
        <div>{{ $t('choose_a_pool') }}</div>
      </div>
      <div v-else-if="all_pools.length === 0" class="my-5">
        <LoaderPulse />
      </div>
      <div v-else class="mobile_table_container">
        <MobileAdvancedTable v-for="(pool, index) in all_pools
          .slice(0, sliceNumber)
          .filter((item) => !hideSmallPools || item.TVL > minimalTVL)
          .toSorted((a, b) => Number(b[ascendFilterBy] - a[ascendFilterBy]))" :key="pool.name" :pool="pool"
          :filters="{ APR: filterByTimeAPR, Volume: filterByTimeVolume }" :userPools="user_staked_pools"
          :inactive="isPoolInactive(pool)" :index="index" @goToPoolWithdraw="goToPoolWithdraw" @goToCLPool="goToCLPool"
          @goToPool="goToPool" @goToPoolDeposit="goToPoolDeposit" @goToPoolManage="goToPoolManage" @goToCL="goToCL"
          :isActions="true" />
        <div v-if="
          sliceNumber <
          all_pools.filter((item) => !hideSmallPools || item.TVL > minimalTVL)
            .length
        " @click="all_pools.slice(0, (sliceNumber = sliceNumber + 5))" class="load_more text-black dark:!text-white">
          {{ $t('load_more') }}
          <img :src="arrow_bottom" />
        </div>
      </div>
    </div>
  </MainCard>
</template>

<script setup>
import { computed, ref, onMounted, watch, defineEmits } from 'vue'
import router from '@/router'
import ComposePoolDropdown from '@/components/Pool/ComposePoolDropdown.vue'
import { useRoute } from 'vue-router'
import { GetPools } from '@/composables/pools/usePools.js'
import {
  FormatAllPoolForTrackingPage,
  FormatAllToDisplay,
} from '@/lib/formatter/poolsFormatter'
import { ethers } from 'ethers'
import { GetPoolSwapsData } from '@/composables/pools/charts/usePoolSwapsData'
import { GetPoolHistoricValues } from '@/composables/pools/charts/usePoolHistoricValues'
import PoolRow from '@/components/Pool/PoolRow.vue'
import MobileAdvancedTable from '@/UI/MobileAdvancedTable.vue'
import MainCard from '@/UI/MainCard.vue'
import filterSVG from '@/assets/icons/filter.svg'
import { GetHistoricalTvl } from '@/composables/pools/snapshots/usePoolHistoricalTvl'
import { useUniswapPools } from '@/composables/concentrated-liquidity/useUniswapPools'
import {
  DisplayNetwork,
  Network,
  networkId,
  DisplayChain,
} from '@/composables/useNetwork'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { useWalletPools } from '@/composables/wallet/useWalletPools'
import { isTimestampWithinLast7Days } from '@/lib/utils'
import { useUniswapTvlSnapshots } from '@/composables/concentrated-liquidity/useUniswapTvlSnapshots'
import { CalculateCLAPR } from '@/composables/math/chartMath/trackingInfoMath'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import PoolFilters from '@/components/Pool/PoolFilters.vue'
import arrow_bottom from '@/assets/icons/arrow/arrow_loadmore.svg'
import walletPoolsImg from '@/assets/icons/sidebarIcons/walletPoolsImage.svg'
import { getPoolsData } from '@/composables/data/poolsData'
import { t } from 'i18next'
import filterArrow from '@/assets/icons/arrow/filterArrow.svg'
import { useDevice } from '@/composables/adaptive/useDevice'
import { getPoolsRewards } from "@/composables/data/rewardsData"
const chainSelected = ref({ name: 'All Chains', code: 'ALL', img: '' })
const { width } = useDevice()

const sliceNumber = ref(10)

const filterByTimeAPR = ref('24H')
const filterByTimeVolume = ref('30D')

const ascendFilterBy = ref('TVL')

const headers = [
  t('tokens'),
  t('composition'),
  // 'All Returns %',
  'TVL',
  t('volume'),
  'APR',
  t('actions'),
]

const route = useRoute()

const minimalTVL = ref(5)
const hideSmallPools = ref(true)

const optionsTokens = ref([])
const optionsPoolType = ref([
  { name: 'WP', selected: false },
  //{ name: 'CLP', selected: false },
])
const optionsPoolAttribute = ref([{ name: t('new'), selected: false }])

const hidePools = ref(false)

watch(chainSelected, () => {
  pools.value = FormatAllToDisplay(defaultPools.value, chainSelected.value.name)
})

watch(networkId, async () => {
  await InitUserStakedPools()
})
const rewardsData = ref([])
async function InitUserStakedPools() {
  if (networkId.value) {
    let mmProvider = await InitializeMetamask()
    let address = await mmProvider.getSigner().getAddress() //'0x759eE62a73A8A0690a0E20Fc489D3F462B4385c0' //' //
    user_staked_pools.value = await useWalletPools(address, 56, false)
    rewardsData.value = await getPoolsRewards(address)
    console.log("POOLS REWARDS DATA ", rewardsData.value)
    console.log(all_pools.value)
    console.log(user_staked_pools.value)
    console.log(
      'USER STAKED - ',
      all_pools.value.filter((item) =>
        user_staked_pools.value.map((p) => p.id).includes(item.id),
      ),
    )
  }
}

const poolsData = ref([])

const historicValues = ref([])
const poolSwapsData = ref([])
const historicTvl = ref([])

const pools = ref([])
const user_staked_pools = ref([])
const defaultPools = ref([])
const cl_pools = ref([])
const cl_snapshots = ref([])
watch(defaultPools, () => {
  console.log(defaultPools.value)
  pools.value = FormatAllToDisplay(defaultPools.value, chainSelected.value.name)
  console.log('POOLS - ', pools.value)
})

const networksSupported = ref(null)

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

function goToPoolDeposit(args) {
  if (all_pools.value[args.index].LiquidityType != 'CL') {
    router.push({
      name: 'Pool Deposit',
      params: {
        id: all_pools.value[args.index].id,
        onMountedActivity: args.onMountedActivity,
        chainSelected: DisplayChain[networkId.value],
      },
    })
  } else {
    router.push({
      name: 'Concentrated liquidity',
      query: {
        tokens: all_pools.value[args.index].tokens.map((t) => t.id),
        fee: all_pools.value[args.index].fee,
      },
    })
  }
}
function goToPoolManage(args) {
  if (all_pools.value[args.index].LiquidityType == 'WP') {
    router.push({
      name: 'Pool Deposit',
      params: {
        id: all_pools.value[args.index].id,
        onMountedActivity: args.onMountedActivity,
        chainSelected: DisplayChain[networkId.value],
      },
    })
  } else {
    router.push({
      name: 'Concentrated liquidity Add',
      params: {
        onMountedActivity: 'deposit',
        poolId: all_pools.value[args.index].id,
      },
    })
  }
}


function goToPoolWithdraw(args) {
  router.push({
    name: 'Pool Withdraw',
    params: {
      id: all_pools.value[args.index].id,
      onMountedActivity: args.onMountedActivity,
      chainSelected: DisplayChain[networkId.value],
    },
  })
}

function goToPoolCompound(args) {
  router.push({
    name: 'Pool Compound',
    params: {
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
      tokens: all_pools.value[args.index].tokens.map((t) => t.id),
      fee: all_pools.value[args.index].fee,
    },
  })
}

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
  if (!process.env.VUE_APP_LOCAL_API) {
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
    historicTvl.value = networks
      .map((n, index) => networksInfo[index][3])
      .flat()
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
    /* cl_snapshots.value = await useUniswapTvlSnapshots(null)
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
    })) */
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
  } else {
    const result = await getPoolsData(56)
    pools.value = result.table.filter((item) => item.LiquidityType == 'WP')
    // cl_pools.value = result.table.filter((item) => item.LiquidityType == 'CL')
    const symbols = result.table.map((item) => item['Pool Name'][0]).flat()
    let all_token_symbols = Array.from(new Set(symbols))
    optionsTokens.value = all_token_symbols.map((item) => ({
      code: item,
      name: item,
      selected: item == route.query.token,
    }))
    await InitUserStakedPools()
  }
  if (window.ethereum !== undefined && networkId.value > 0) {
    let provider = new ethers.providers.Web3Provider(window.ethereum)
    networksSupported.value = await provider.getNetwork()
  }
})

const all_pools = computed(() => {
  let result = []
  let nonSelected = !optionsPoolType.value[0].selected
  // && !optionsPoolType.value[1].selected
  if (nonSelected || optionsPoolType.value[0].selected) {
    result.push(...pools.value)
  }
  /* if (nonSelected || optionsPoolType.value[1].selected) {
    result.push(...cl_pools.value)
  } */
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
  return result.toSorted((a, b) => b.TVL - a.TVL)
})
</script>

<style lang="scss">
@import '@/styles/_variables.scss';

.head_caption_text {
  font-size: 12px;
  font-weight: 400;
  line-height: 24px;
  // color: white;
}

.pools {
  &-rows {
    padding: 0;
    border-radius: 16px;
    border: 1px solid #ffffff0d;
    background: #dceef605;
    backdrop-filter: blur(10px);
    box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
    margin-bottom: 30px;

    @media all and (max-width: $lg) {
      overflow-x: auto;
    }

    @media (max-width: 768px) {
      border: 0px;
    }
  }
}
</style>
