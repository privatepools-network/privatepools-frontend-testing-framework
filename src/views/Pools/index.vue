<template>
  <MainCard>
    <Title :title="'Private Pools'" />

    <div class="d-flex justify-content-between mt-3 mb-4 flex-wrap">
      <div class="flex gap-4">
        <PoolFilters
          :hidePools="hidePools"
          :optionsPoolType="optionsPoolType"
          :optionsPoolAttribute="optionsPoolAttribute"
          :optionsTokens="optionsTokens"
        />

        <div class="flex items-center gap-2">
          <label class="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              class="sr-only peer"
              :value="hidePools"
              @click="hidePools = !hidePools"
              :checked="hidePools"
            />
            <div
              class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-[#D1D1D6] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
          </label>
          <div
            class="dark:!text-white text-black"
            style="font-size: clamp(12px, 0.8vw, 16px)"
          >
            Staked only
          </div>
        </div>
      </div>

      <ComposePoolDropdown />

      {{ console.log('hidePools', hidePools) }}
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
              <div :class="'head_caption_text text-black dark:!text-white'">
                {{ headCaption }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="user_staked_pools.length === 0 && hidePools" class="my-5 text-center text-black dark:!text-white">
        <div>No Results</div>
        <div>Chose a pool to invest or create a pool to get started.</div>
      </div>
      <div v-else-if="all_pools.length === 0" class="my-5">
        <LoaderPulse />
      </div>
     

      {{ console.log('user_staked_pools', user_staked_pools.length) }}

      <PoolRow
        v-for="(pool, index) in all_pools.slice(0, sliceNumber)"
        :key="pool.name"
        :pool="pool"
        :userPools="user_staked_pools"
        :inactive="isPoolInactive(pool)"
        :index="index"
        @goToPoolWithdraw="goToPoolWithdraw"
        @goToCLPool="goToCLPool"
        @goToPool="goToPool"
        @goToPoolDeposit="goToPoolDeposit"
        @goToPoolManage="goToPoolManage"
        @goToCL="goToCL"
        :isActions="true"
      />

      {{ console.log('all_pools', all_pools) }}
      <div
        @click="all_pools.slice(0, (sliceNumber = sliceNumber + 5))"
        class="load_more text-black dark:!text-white"
      >
        Load More
        <img :src="arrow_bottom" />
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
import MainCard from '@/UI/MainCard.vue'
import Title from '@/UI/Title'
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
import Toggler from '@/UI/Toggler.vue'

const chainSelected = ref({ name: 'All Chains', code: 'ALL', img: '' })

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

const optionsTokens = ref([])
const optionsPoolType = ref([
  { name: 'Weighted', selected: false },
  { name: 'CLP', selected: false },
])
const optionsPoolAttribute = ref([{ name: 'New', selected: false }])

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
    let address = await mmProvider.getSigner().getAddress() //'0x759ee62a73a8a0690a0e20fc489d3f462b4385c0' //
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
  if (all_pools.value[args.index].type != 'CL') {
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
        tokens: all_pools.value[args.index].tokens,
        fee: all_pools.value[args.index].fee,
      },
    })
  }
}
function goToPoolManage(args) {
  if (all_pools.value[args.index].type == 'WP') {
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
      tokens: all_pools.value[args.index].tokens,
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
})

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
  return result.toSorted((a, b) => b.TVL - a.TVL)
})
</script>

<style lang="scss">
@import '@/styles/_variables.scss';

.head_caption_text {
  font-family: Poppins;
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
    // background: linear-gradient(0deg,
    //     rgba(255, 255, 255, 2%),
    //     rgba(255, 255, 255, 0%));
    box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
    margin-bottom: 30px;

    @media all and (max-width: $lg) {
      overflow-x: auto;
    }
  }
}

.load_more {
  display: flex;
  justify-content: center;
  font-family: Poppins;
  font-size: clamp(12px, 0.8vw, 14px);
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: center;
  // color: #7d7d7d;
  padding: 15px;
  border-top: 1px solid #7d7d7d2d;

  &:hover {
    color: #00affe;
    cursor: pointer;
    background: #ffffff0e;
  }
}
</style>
