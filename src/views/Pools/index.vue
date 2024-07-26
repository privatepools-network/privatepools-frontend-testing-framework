<template>
  <MainCard>
    <!-- <div class="flex items-center gap-2">
      <img :src="logoImage" />
      <Title :title="'Private Pools'" />
    </div> -->

    <div class="flex md:flex-row flex-col justify-between mt-3 mb-5 flex-wrap">
      <div class="mb-3" v-if="width <= 768">
        <ComposePoolDropdown />
      </div>
      <div class="flex gap-4 flex-wrap md:flex-row flex-col">
        <PoolFilters
          :hidePools="hidePools"
          :optionsPoolType="optionsPoolType"
          :optionsPoolAttribute="optionsPoolAttribute"
          :optionsTokens="optionsTokens"
        />

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <svg
              @click="selectedView = 'Table'"
              class="cursor-pointer"
              width="28"
              height="22"
              viewBox="0 0 28 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.43815 14.0835H5.52148C6.3694 14.0835 7.06315 13.3897 7.06315 12.5418V9.4585C7.06315 8.61058 6.3694 7.91683 5.52148 7.91683H2.43815C1.59023 7.91683 0.896484 8.61058 0.896484 9.4585V12.5418C0.896484 13.3897 1.59023 14.0835 2.43815 14.0835ZM2.43815 21.7918H5.52148C6.3694 21.7918 7.06315 21.0981 7.06315 20.2502V17.1668C7.06315 16.3189 6.3694 15.6252 5.52148 15.6252H2.43815C1.59023 15.6252 0.896484 16.3189 0.896484 17.1668V20.2502C0.896484 21.0981 1.59023 21.7918 2.43815 21.7918ZM2.43815 6.37516H5.52148C6.3694 6.37516 7.06315 5.68141 7.06315 4.8335V1.75016C7.06315 0.902246 6.3694 0.208496 5.52148 0.208496H2.43815C1.59023 0.208496 0.896484 0.902246 0.896484 1.75016V4.8335C0.896484 5.68141 1.59023 6.37516 2.43815 6.37516ZM10.1465 14.0835H25.5632C26.4111 14.0835 27.1048 13.3897 27.1048 12.5418V9.4585C27.1048 8.61058 26.4111 7.91683 25.5632 7.91683H10.1465C9.29857 7.91683 8.60482 8.61058 8.60482 9.4585V12.5418C8.60482 13.3897 9.29857 14.0835 10.1465 14.0835ZM10.1465 21.7918H25.5632C26.4111 21.7918 27.1048 21.0981 27.1048 20.2502V17.1668C27.1048 16.3189 26.4111 15.6252 25.5632 15.6252H10.1465C9.29857 15.6252 8.60482 16.3189 8.60482 17.1668V20.2502C8.60482 21.0981 9.29857 21.7918 10.1465 21.7918ZM8.60482 1.75016V4.8335C8.60482 5.68141 9.29857 6.37516 10.1465 6.37516H25.5632C26.4111 6.37516 27.1048 5.68141 27.1048 4.8335V1.75016C27.1048 0.902246 26.4111 0.208496 25.5632 0.208496H10.1465C9.29857 0.208496 8.60482 0.902246 8.60482 1.75016Z"
                :fill="selectedView === 'Table' ? '#00E0FF' : 'white'"
              />
            </svg>
            <svg
              @click="selectedView = 'Cards'"
              class="cursor-pointer"
              width="28"
              height="22"
              viewBox="0 0 28 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.64706 10.1538H6.58824C7.49412 10.1538 8.23529 9.39231 8.23529 8.46154V1.69231C8.23529 0.761538 7.49412 0 6.58824 0H1.64706C0.741176 0 0 0.761538 0 1.69231V8.46154C0 9.39231 0.741176 10.1538 1.64706 10.1538ZM1.64706 22H6.58824C7.49412 22 8.23529 21.2385 8.23529 20.3077V13.5385C8.23529 12.6077 7.49412 11.8462 6.58824 11.8462H1.64706C0.741176 11.8462 0 12.6077 0 13.5385V20.3077C0 21.2385 0.741176 22 1.64706 22ZM11.5294 22H16.4706C17.3765 22 18.1176 21.2385 18.1176 20.3077V13.5385C18.1176 12.6077 17.3765 11.8462 16.4706 11.8462H11.5294C10.6235 11.8462 9.88235 12.6077 9.88235 13.5385V20.3077C9.88235 21.2385 10.6235 22 11.5294 22ZM21.4118 22H26.3529C27.2588 22 28 21.2385 28 20.3077V13.5385C28 12.6077 27.2588 11.8462 26.3529 11.8462H21.4118C20.5059 11.8462 19.7647 12.6077 19.7647 13.5385V20.3077C19.7647 21.2385 20.5059 22 21.4118 22ZM11.5294 10.1538H16.4706C17.3765 10.1538 18.1176 9.39231 18.1176 8.46154V1.69231C18.1176 0.761538 17.3765 0 16.4706 0H11.5294C10.6235 0 9.88235 0.761538 9.88235 1.69231V8.46154C9.88235 9.39231 10.6235 10.1538 11.5294 10.1538ZM19.7647 1.69231V8.46154C19.7647 9.39231 20.5059 10.1538 21.4118 10.1538H26.3529C27.2588 10.1538 28 9.39231 28 8.46154V1.69231C28 0.761538 27.2588 0 26.3529 0H21.4118C20.5059 0 19.7647 0.761538 19.7647 1.69231Z"
                :fill="selectedView === 'Cards' ? '#00E0FF' : 'white'"
              />
            </svg>
          </div>

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
                class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800/50 dark:bg-[#D1D1D6] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2ABDFF]"
              ></div>
            </label>
            <div
              class="dark:!text-white text-black"
              style="font-size: clamp(12px, 0.8vw, 16px)"
            >
              {{ $t('staked_only') }}
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="default-checkbox"
              type="checkbox"
              v-model="hideSmallPools"
              class="w-4 h-4 text-[#00e0ff] bg-gray-100 border-gray-300 rounded focus:ring-[#00e0ff] dark:focus:ring-[#00e0ff] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              for="default-checkbox"
              class="ms-2 dark:!text-white text-black"
              style="font-size: clamp(12px, 0.8vw, 16px)"
              >Hide small pools</label
            >
          </div>
        </div>
      </div>

      <ComposePoolDropdown v-if="width > 768" />

      <!-- {{ console.log('hidePools', hidePools) }} -->
    </div>

    <div v-if="selectedView === 'Table'">
      <div v-if="width > 768" class="pools-rows">
        <!-- Headers Desktop -->
        <div class="pools-row pools-row_header">
          <div
            class="pools-row__col"
            :class="
              // Table headers positioning by header names
              headCaptionIndex === 0 || headCaptionIndex === 1
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
                  v-if="headCaption === t('tokens')"
                  :class="'head_caption_text text-black dark:!text-white'"
                >
                  <svg
                    width="24"
                    height="15"
                    viewBox="0 0 24 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_1_2449)">
                      <path
                        d="M7.5 14.5C11.366 14.5 14.5 11.366 14.5 7.5C14.5 3.63401 11.366 0.5 7.5 0.5C3.63401 0.5 0.5 3.63401 0.5 7.5C0.5 11.366 3.63401 14.5 7.5 14.5Z"
                        stroke="white"
                      />
                      <path
                        d="M16.5 14.5C20.366 14.5 23.5 11.366 23.5 7.5C23.5 3.63401 20.366 0.5 16.5 0.5C12.634 0.5 9.5 3.63401 9.5 7.5C9.5 11.366 12.634 14.5 16.5 14.5Z"
                        stroke="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1_2449">
                        <rect width="24" height="15" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div
                  v-else-if="headCaption === t('volume')"
                  :class="'head_caption_text text-black dark:!text-white flex items-center gap-1'"
                >
                  <div
                    class="flex items-center gap-1"
                    @click="
                      ascendFilterBy = `${t('volume')}_${filterByTimeVolume}`
                    "
                  >
                    <img
                      :src="filterArrow"
                      :class="
                        ascendFilterBy ===
                        `${t('volume')}_${filterByTimeVolume}`
                          ? 'rotate-180'
                          : ''
                      "
                    />
                    {{ headCaption }} ({{ filterByTimeVolume }})
                  </div>
                  <img
                    :src="filterSVG"
                    @click="
                      filterByTimeVolume === '24H'
                        ? (filterByTimeVolume = '7D')
                        : filterByTimeVolume === '7D'
                        ? (filterByTimeVolume = '30D')
                        : filterByTimeVolume === '30D'
                        ? (filterByTimeVolume = 'ALL')
                        : filterByTimeVolume === 'ALL'
                        ? (filterByTimeVolume = '24H')
                        : (filterByTimeVolume = '24H')
                    "
                  />
                </div>
                <div
                  v-else-if="headCaption === 'APR'"
                  :class="'head_caption_text text-black dark:!text-white flex items-center gap-1'"
                >
                  <div
                    class="flex items-center gap-1"
                    @click="ascendFilterBy = `APR ${filterByTimeAPR}`"
                  >
                    <img
                      :src="filterArrow"
                      :class="
                        ascendFilterBy === `APR ${filterByTimeAPR}`
                          ? 'rotate-180'
                          : ''
                      "
                    />
                    {{ headCaption }} ({{ filterByTimeAPR }})
                  </div>
                  <img
                    :src="filterSVG"
                    @click="
                      filterByTimeAPR === '24H'
                        ? (filterByTimeAPR = '7D')
                        : filterByTimeAPR === '7D'
                        ? (filterByTimeAPR = '30D')
                        : filterByTimeAPR === '30D'
                        ? (filterByTimeAPR = 'ALL')
                        : filterByTimeAPR === 'ALL'
                        ? (filterByTimeAPR = '24H')
                        : (filterByTimeAPR = '24H')
                    "
                  />
                </div>
                <div
                  v-else
                  :class="'head_caption_text flex items-center gap-1 text-black dark:!text-white'"
                  @click="ascendFilterBy = headCaption"
                >
                  <img
                    :class="ascendFilterBy === headCaption ? 'rotate-180' : ''"
                    v-if="
                      !headCaption.includes(t('composition')) &&
                      !headCaption.includes(t('actions'))
                    "
                    :src="filterArrow"
                  />
                  {{ headCaption }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="all_pools.length === 0 && user_staked_pools === null"
          class="my-5"
        >
          <LoaderPulse />
        </div>
        <div
          v-else-if="user_staked_pools.length === 0 && hidePools"
          class="my-5 text-center text-black dark:!text-white"
        >
          <div>{{ $t('no_results') }}</div>
          <div>{{ $t('choose_a_pool') }}</div>
        </div>

        {{ console.log('all_pools', all_pools) }}
        <PoolRow
          v-for="(pool, index) in all_pools
            .slice(0, sliceNumber)
            .filter((item) => !hideSmallPools || item.TVL > minimalTVL)
            .toSorted((a, b) => Number(b[ascendFilterBy] - a[ascendFilterBy]))"
          :key="pool.name"
          :pool="pool"
          :filters="{ APR: filterByTimeAPR, Volume: filterByTimeVolume }"
          :userPools="user_staked_pools"
          :inactive="isPoolInactive(pool)"
          :index="index"
          @goToPoolWithdraw="goToPoolWithdraw"
          :rewardsData="rewardsData"
          @goToPoolCompound="goToPoolCompound"
          @goToCLPool="goToCLPool"
          @goToPool="goToPool"
          @goToPoolDeposit="goToPoolDeposit"
          @goToPoolManage="goToPoolManage"
          @goToCL="goToCL"
          :isActions="true"
        />
        <!-- <PoolsMobileTable v-else/> -->

        <div
          v-if="
            sliceNumber <
            all_pools.filter((item) => !hideSmallPools || item.TVL > minimalTVL)
              .length
          "
          @click="all_pools.slice(0, (sliceNumber = sliceNumber + 5))"
          class="load_more text-black dark:!text-white"
        >
          {{ $t('load_more') }}
          <img :src="arrow_bottom" />
        </div>
      </div>
      <div v-else>
        <div
          v-if="user_staked_pools?.length === 0 && hidePools"
          class="my-5 text-center text-black dark:!text-white"
        >
          <div>{{ $t('no_results') }}</div>
          <div>{{ $t('choose_a_pool') }}</div>
        </div>
        <div v-if="all_pools?.length === 0" class="my-5">
          <LoaderPulse />
        </div>
        <div class="mobile_table_container">
          <MobileAdvancedTable
            v-for="(pool, index) in all_pools
              .slice(0, sliceNumber)
              .filter((item) => !hideSmallPools || item.TVL > minimalTVL)
              .toSorted((a, b) =>
                Number(b[ascendFilterBy] - a[ascendFilterBy]),
              )"
            :key="pool.name"
            :pool="pool"
            :filters="{ APR: filterByTimeAPR, Volume: filterByTimeVolume }"
            :userPools="user_staked_pools"
            :inactive="isPoolInactive(pool)"
            :index="index"
            @goToPoolWithdraw="goToPoolWithdraw"
            :rewardsData="rewardsData"
            @goToPoolCompound="goToPoolCompound"
            @goToCLPool="goToCLPool"
            @goToPool="goToPool"
            @goToPoolDeposit="goToPoolDeposit"
            @goToPoolManage="goToPoolManage"
            @goToCL="goToCL"
            :isActions="true"
          />
          <div
            v-if="
              sliceNumber <
              all_pools.filter(
                (item) => !hideSmallPools || item.TVL > minimalTVL,
              ).length
            "
            @click="all_pools.slice(0, (sliceNumber = sliceNumber + 5))"
            class="load_more text-black dark:!text-white"
          >
            {{ $t('load_more') }}
            <img :src="arrow_bottom" />
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="selectedView === 'Cards'">
      <div class="flex flex-wrap gap-3">
        <PoolCard
          v-for="(pool, index) in poolsForCard
            // .slice(0, sliceNumber)
            .filter((item) => !hideSmallPools || item.TVL > minimalTVL)
            .toSorted((a, b) => Number(b[ascendFilterBy] - a[ascendFilterBy]))"
          :key="pool.name"
          :pool="pool"
          :filters="{ APR: filterByTimeAPR, Volume: filterByTimeVolume }"
          :userPools="user_staked_pools"
          :inactive="isPoolInactive(pool)"
          :index="index"
          @goToPoolWithdraw="goToPoolWithdraw"
          :rewardsData="rewardsData"
          @goToPoolCompound="goToPoolCompound"
          @goToCLPool="goToCLPool"
          @goToPool="goToPool"
          @goToPoolDeposit="goToPoolDeposit"
          @goToPoolManage="goToPoolManage"
          @goToCL="goToCL"
          :isActions="true"
        />
      </div>
      <div class="mt-[5%]">
        <Pagination
          :perPage="perPage"
          :pools="all_pools.filter((item) => !hideSmallPools || item.TVL > minimalTVL)"
          :currentPage="currentPage"
          @changePage="changePage"
          @changePerPage="changePerPage"
          :perPageOptions="[6, 12, 24]"
        ></Pagination>
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
import PoolCard from '@/components/Pool/PoolCard.vue'
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
import { getPoolsData } from '@/composables/data/poolsData'
import { t } from 'i18next'
import filterArrow from '@/assets/icons/arrow/filterArrow.svg'
import { useDevice } from '@/composables/adaptive/useDevice'
import { getPoolsRewards } from '@/composables/data/rewardsData'
import Pagination from '@/components/Pool/Pagination.vue'

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

const minimalTVL = ref(900)
const hideSmallPools = ref(true)
const selectedView = ref('Table')

const optionsTokens = ref([])
const optionsPoolType = ref([
  { name: 'WP', selected: false },
  //{ name: 'CLP', selected: false },
])
const optionsPoolAttribute = ref([{ name: t('new'), selected: false }])

const perPage = ref(6)
const currentPage = ref(1)

const poolsForCard = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return all_pools?.value.slice(start, end);
});

function changePage(args) {
  if (args.isEquating == false) {
    currentPage.value = currentPage.value + args.num
  } else {
    currentPage.value = args.num
  }
}

function changePerPage(v1) {
  perPage.value = Number(v1)
  currentPage.value = 1
}

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
    console.log('POOLS REWARDS DATA ', rewardsData.value)
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
const user_staked_pools = ref(null)
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
