<template>
  <MainCard>
    <!-- <div class="mb-4">
      <ChainSelector @updateChain="(newChain) => (chainSelected = newChain)" />
    </div> -->
    <CRow class="caption-row">
      <Title :title="caption" style="margin-bottom: 0 !important"></Title>
    </CRow>
    <CRow>
      <!-- <div class="d-flex justify-content-between mt-3 flex-wrap">
        <div v-if="width <= 768" @click="onClick" class="button">
          Compose Pool
        </div>
      </div> -->
      <div class="d-flex justify-content-between mt-3 mb-4 flex-wrap">
        <div class="d-flex align-items-center gap-3">
          <div v-click-away="onClickAway">
            <div class="filter_button" style="width: 140px;" :style="selectTokenDropdownOpen === true
              ? 'border-radius: 16px 16px 0px 0px;'
              : ''
              " @click="selectTokenDropdownOpen = !selectTokenDropdownOpen">
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.005 0.00292969C17.08 0.00292969 22.005 2.68893 22.005 6.00293V10.0029C22.005 13.3169 17.08 16.0029 11.005 16.0029C5.038 16.0029 0.181005 13.4119 0.0100049 10.1799L0.00500488 10.0029V6.00293C0.00500488 2.68893 4.93001 0.00292969 11.005 0.00292969ZM11.005 12.0029C7.285 12.0029 3.995 10.9949 2.005 9.45293V10.0029C2.005 11.8849 5.888 14.0029 11.005 14.0029C16.015 14.0029 19.843 11.9729 20 10.1209L20.005 10.0029L20.006 9.45293C18.016 10.9949 14.726 12.0029 11.005 12.0029ZM11.005 2.00293C5.888 2.00293 2.005 4.12093 2.005 6.00293C2.005 7.88493 5.888 10.0029 11.005 10.0029C16.122 10.0029 20.005 7.88493 20.005 6.00293C20.005 4.12093 16.122 2.00293 11.005 2.00293Z"
                  fill="#F8F8F8" />
              </svg>
              Select token
            </div>
            <div v-if="selectTokenDropdownOpen === true" class="select_token_dropdown">
              <div v-for="(item, i) in optionsTokens" :key="`${i}-tokens-search`">
                <div @click="item.selected = !item.selected"
                  class="select_token_dropdown_text d-flex justify-content-between align-items-center">
                  <div>
                    <img :src="getTokenEntity(item.code, 'short').icon" width="17" />
                    {{ item.name }}
                  </div>
                  <div>
                    <div :class="item.selected === true
                      ? 'checkbox_custom_selected'
                      : 'checkbox_custom'
                      ">
                      <svg v-if="item.selected === true" xmlns="http://www.w3.org/2000/svg" width="8" height="8"
                        viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" style="margin-top: -11px">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-click-away="onClickAwayFilters">
            <div class="filter_button" style="width: 140px;" :style="moreFiltersDropdownOpen === true
              ? 'border-radius: 16px 16px 0px 0px;'
              : ''
              " @click="moreFiltersDropdownOpen = !moreFiltersDropdownOpen">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.6666 2H1.33331L6.66665 8.30667V12.6667L9.33331 14V8.30667L14.6666 2Z" stroke="white"
                  stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              More filters
            </div>
            <div v-if="moreFiltersDropdownOpen === true" class="select_token_dropdown">
              <div style="font-size: 13px; font-weight: 700; color: white;">Pool Type</div>
              <div v-for="(item, i) in optionsPoolType" :key="`${i}-pooltype-search`">
                <div @click="item.selected = !item.selected"
                  class="select_token_dropdown_text d-flex justify-content-between align-items-center">
                  <div>

                    {{ item.name }}
                  </div>
                  <div>
                    <div :class="item.selected === true
                      ? 'checkbox_custom_selected'
                      : 'checkbox_custom'
                      ">
                      <svg v-if="item.selected === true" xmlns="http://www.w3.org/2000/svg" width="8" height="8"
                        viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" style="margin-top: -11px">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div style="font-size: 13px; font-weight: 700; color: white;">Pool attributes</div>
              <div v-for="(item, i) in optionsPoolAttribute" :key="`${i}-pooltype-search`">
                <div @click="item.selected = !item.selected"
                  class="select_token_dropdown_text d-flex justify-content-between align-items-center">
                  <div>

                    {{ item.name }}
                  </div>
                  <div>
                    <div :class="item.selected === true
                      ? 'checkbox_custom_selected'
                      : 'checkbox_custom'
                      ">
                      <svg v-if="item.selected === true" xmlns="http://www.w3.org/2000/svg" width="8" height="8"
                        viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" style="margin-top: -11px">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2">
            <div style="cursor: pointer; height: 30px">
              <CFormSwitch size="lg" v-model="hidePools" id="hidePools" />
            </div>
            <div class="text-white" style="font-size: clamp(12px, 0.8vw, 16px)">
              Staked only
            </div>
          </div>
        </div>
        <div class="manage-pools-filters">
          <div v-if="width > 768">
            <div class="button d-flex align-items-center justify-content-evenly gap-2" :style="composePoolDropdownOpen === true
              ? 'border-radius: 8px 8px 0px 0px;'
              : ''
              " @click="composePoolDropdownOpen = !composePoolDropdownOpen">
              Compose Pool
              <svg :style="composePoolDropdownOpen ? 'transform: rotate(180deg)' : ''
                " width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.22502 5.74172L4.99166 2.50836L1.75832 5.74172C1.43332 6.06672 0.908323 6.06672 0.583323 5.74172C0.258324 5.41672 0.258324 4.89169 0.583323 4.56669L4.40832 0.74169C4.73332 0.41669 5.25832 0.41669 5.58332 0.74169L9.40835 4.56669C9.73335 4.89169 9.73335 5.41672 9.40835 5.74172C9.08335 6.05839 8.55002 6.06672 8.22502 5.74172Z"
                  fill="#00C9FF" />
              </svg>
            </div>
            <div v-if="composePoolDropdownOpen === true" class="compose_pool_dropdown">
              <div @click="onClickConcentratedPool" class="compose_pool_dropdown_text">
                CL Pools
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2.5V9.5" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" />
                  <path d="M2.5 6H9.5" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>
              <div @click="onClick" class="compose_pool_dropdown_text">
                Weighted Pools
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2.5V9.5" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" />
                  <path d="M2.5 6H9.5" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CRow>
    <CRow>
      <div class="pools-rows" v-if="viewMode == 'rows'">
        <div class="pools-row pools-row_header">
          <div class="pools-row__col" v-for="(headCaption, headCaptionIndex) in headers" :key="headCaption">
            <div class="file-table-header-cell">
              <div class="d-flex align-items-center gap-1" :class="headCaptionIndex !== 0 ? header_cells_inside : ''"
                style="cursor: pointer; height: 20px">
                <div style="" v-if="!['pool composition', 'actions', 'tokens'].includes(
                  headCaption.toLowerCase(),
                ) && sortedHeader.caption !== headCaption
                  ">
                  <!-- <svg
                    @click="
                      $emit('table-header-click', headCaption, headCaptionIndex)
                    "
                    width="11"
                    height="20"
                    viewBox="0 0 11 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.2975 8.72852L6.09047 5.00977C5.99867 4.90332 5.82192 4.90332 5.72914 5.00977L2.52211 8.72852C2.40297 8.86719 2.51039 9.07031 2.70278 9.07031H9.11684C9.30922 9.07031 9.41664 8.86719 9.2975 8.72852Z"
                      fill="#808080"
                    />
                    <path
                      d="M9.11684 10.9297H2.70278C2.51039 10.9297 2.40297 11.1328 2.52211 11.2715L5.72914 14.9902C5.82094 15.0967 5.9977 15.0967 6.09047 14.9902L9.2975 11.2715C9.41664 11.1328 9.30922 10.9297 9.11684 10.9297Z"
                      fill="#808080"
                    />
                  </svg> -->
                </div>
                <div style="
                    width: 20px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                  " v-if="['tokens'].includes(headCaption.toLowerCase()) &&
                    sortedHeader.caption !== headCaption
                    ">
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_156_47)">
                      <g clip-path="url(#clip1_156_47)">
                        <path
                          d="M7.5 15C11.366 15 14.5 11.866 14.5 8C14.5 4.13401 11.366 1 7.5 1C3.63401 1 0.5 4.13401 0.5 8C0.5 11.866 3.63401 15 7.5 15Z"
                          stroke="white" />
                        <path
                          d="M16.5 15C20.366 15 23.5 11.866 23.5 8C23.5 4.13401 20.366 1 16.5 1C12.634 1 9.5 4.13401 9.5 8C9.5 11.866 12.634 15 16.5 15Z"
                          stroke="white" />
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_156_47">
                        <rect width="24" height="15" fill="white" transform="translate(0 0.5)" />
                      </clipPath>
                      <clipPath id="clip1_156_47">
                        <rect width="24" height="15" fill="white" transform="translate(0 0.5)" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>

                <div @click="onDatatableHeaderClick(headCaption)" :class="'head_caption_text'">
                  {{ headCaption }}
                </div>
                <div @click="
                  $emit('table-header-click', headCaption, headCaptionIndex)
                  " style="font-family: Inter; font-weight: 700; width: 20px" v-if="(sortedHeader && sortedHeader.caption == 'Time') ||
    (headCaptionIndex != 0 &&
      sortedHeader &&
      sortedHeader.caption)
    ">
                  {{
                    sortedHeader &&
                    sortedHeader.caption &&
                    sortedHeader.caption == headCaption
                    ? sortSymbol
                    : ''
                  }}
                </div>
                <!-- <div
                  v-if="periodsHeaders.includes(headCaption)"
                  style="margin-right: -15px"
                >
                  <div>
                    <multiselect
                      :modelValue="filtersSelected[headCaptionIndex]"
                      @update:modelValue="
                        onFilterClick($event, headCaption),
                          (filtersSelected[headCaptionIndex] = $event)
                      "
                      placeholder=""
                      openDirection="bottom"
                      label="title"
                      track-by="code"
                      :options="filterOptions[headCaptionIndex]"
                      :option-height="104"
                      :show-labels="false"
                      :searchable="false"
                      :allow-empty="false"
                      :close-on-select="true"
                      :multiple="false"
                      :taggable="true"
                    >
                      <template v-slot:selection="">
                        <div style="display: flex; align-items: center"></div>
                      </template>
                      <template v-slot:option="{ option }">
                        <div
                          class="multiselect-tag is-user"
                          style="
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 0px 8px 0px 0px;
                            gap: 6px;
                            font-size: clamp(10px, 0.9vw, 12px);
                          "
                        >
                          <div style="display: flex; align-items: center">
                            {{ option.code }}
                          </div>
                        </div>
                      </template>
                    </multiselect>
                  </div>
                </div> -->
                <!-- <div v-else-if="sortedHeader" style="width: 17px"></div> -->
              </div>
            </div>
          </div>
        </div>
        {{ console.log('filterByStatus', filterByStatus) }}
        <!-- <div
          v-if="poolsNoResult"
          style="
            display: flex;
            justify-content: center;
            margin-top: 20%;
            margin-bottom: 20%;
          "
        >
          <LoaderPulse />
        </div>
        <div v-else-if="pools.length === 0" class="no_results">No results.</div> -->
        <PoolRow v-for="(pool, index) in all_pools" :poolsLength="filterByStatus.length" :perPage="perPage"
          :key="pool.name" :pool="pool" :inactive="isPoolInactive(pool)" :index="index" @goToPoolWithdraw="goToPoolWithdraw" @goToCLPool="goToCLPool" @goToPool="goToPool" @goToPoolDeposit="goToPoolDeposit"
          @goToCL="goToCL" :isActions="true" />
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
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'

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
import PoolCard from '@/components/Manage/Pool/PoolCard.vue'
import Pagination from '@/components/Manage/Pool/Pagination.vue'
import MainCard from '@/UI/MainCard.vue'
import ChainSelector from '@/UI/ChainSelectorV2.vue'
import Title from '@/UI/Title'
import { GetHistoricalTvl } from '@/composables/pools/snapshots/usePoolHistoricalTvl'
import { isRightChainName } from '@/composables/pools/usePoolSwapsStats'
import { useUniswapPools } from "@/composables/concentrated-liquidity/useUniswapPools"
import {
  DisplayNetwork,
  Network,
  networkId,
  DisplayChain,
} from '@/composables/useNetwork'
// import Warning from "@/UI/Warning";
import { useDevice } from '@/composables/adaptive/useDevice'
import {
  isTimestampWithinLast7Days,
} from '@/lib/utils'
import Multiselect from 'vue-multiselect'
import { getTokenEntity } from '@/lib/helpers/util'
const viewMode = ref('rows')
const { width } = useDevice()

const chainSelected = ref({ name: 'All Chains', code: 'ALL', img: '' })
const composePoolDropdownOpen = ref(false)
const selectTokenDropdownOpen = ref(false)
const moreFiltersDropdownOpen = ref(false)

const headers = [
  'Tokens',
  'Composition',
  'ROI',
  'TVL',

  'Volume (24h)',

  'APR',

  'Actions',
]
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

const optionsTokens = ref([
  { name: 'Ether', code: 'WETH', selected: false },
  { name: 'USDT', code: 'USDT', selected: false },
  { name: 'WBTC', code: 'BTC', selected: false },
  {
    name: 'MATIC',
    code: 'WMATIC',
    selected: false,
  },

  {
    name: 'WBNB',
    code: 'WBNB',
    selected: false,
  },
  {
    name: 'AVAX',
    code: 'AVAX',
    selected: false,
  },
])
const optionsPoolType = ref([
  { name: 'Weighted', selected: false },
  { name: 'Stable', selected: false },
  { name: 'CLP', selected: false },
])
const optionsPoolAttribute = ref([
  { name: 'New', selected: false },

])

const poolsMock = [
  {
    id: '0x88e6378567c912e346e22e5de18ab417e5c8d9a3000100000000000000000007',
    'Pool Name': [['WMATIC', 'WBTC', 'AVAX', 'SOL']],
    'Pool Weight': [
      [
        {
          token: 'WMATIC',
          weight: '20%',
        },
        {
          token: 'WBTC',
          weight: '20%',
        },
        {
          token: 'AVAX',
          weight: '20%',
        },
        {
          token: 'SOL',
          weight: '20%',
        },
      ],
    ],
    Liquidity: 1000,
    LiquidityType: 'WP',
    Composition: '1111',
    ROI: '2.54%',

    Volume: '3840.915',
    TVL: '52514.92940',
    APR: '6.410',
    Blockchain: 'Binance',
  },
  {
    id: '0xdb13210d52a2d9bbc12fd4444e05f74d5f906d24000100000000000000000014',
    'Pool Name': [['AVAX', 'SOL']],
    'Pool Weight': [
      [
        {
          token: 'AVAX',
          weight: '',
        },
        {
          token: 'SOL',
          weight: '',
        },
   
      ],
    ],
    LiquidityType: 'CL',
    ROI: '2.54%',
    Liquidity: 1000,

    Volume: '0.000',
    TVL: '1191.83091',
    APR: '0.000',
    Blockchain: 'Binance',
  },
  {
    id: '0x68aba87382af2ec495c5b0694f0a7984988b5fc7000100000000000000000004',
    'Pool Name': [['WMATIC', 'LINK', 'WETH', 'LDO']],
    'Pool Weight': [
      [
        {
          token: 'WMATIC',
          weight: '20%',
        },
        {
          token: 'LINK',
          weight: '20%',
        },
        {
          token: 'WETH',
          weight: '20%',
        },
        {
          token: 'LDO',
          weight: '20%',
        },
      ],
    ],
    LiquidityType: 'WP',
    ROI: '2.54%',
    Liquidity: 0,

    Volume: '0.000',
    TVL: '1064.64254',
    APR: '0.000',
    Blockchain: 'Binance',
  },

  {
    id: '0x68aba87382af2ec495c5b0694f0a7984988b5fc7000100000000000000000004',
    'Pool Name': [['WMATIC', 'LINK']],
    'Pool Weight': [
      [
        {
          token: 'WMATIC',
          weight: '',
        },
        {
          token: 'LINK',
          weight: '',
        },
  
      ],
    ],
    LiquidityType: 'CL',
    ROI: '2.54%',
    Liquidity: 0,

    Volume: '0.000',
    TVL: '1064.64254',
    APR: '0.000',
    Blockchain: 'Binance',
  },
]

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
  filterTvl()
})

watch(hidePools, () => {
  filterTvl()
})
const poolsData = ref([])

const historicValues = ref([])
const poolSwapsData = ref([])
const historicTvl = ref([])

const pools = ref([])
const poolsNoResult = ref(true)
const defaultPools = ref([])
const cl_pools = ref([])
const cl_snapshots = ref([])
watch(defaultPools, () => {
  console.log(defaultPools.value)
  pools.value = FormatAllToDisplay(defaultPools.value, chainSelected.value.name)
  console.log("POOLS - ", pools.value)
  filterTvl()
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
    name: 'Concentrated liquidity Preselected',
    params: {
      // id: filterByStatus.value[args.index].id,
      // id: poolsMock[args.index].id,
      onMountedActivity: args.onMountedActivity,
      // chainSelected: DisplayChain[networkId.value],
    },
  })
}

// const optionsTokens = ref([
//   {name: 'Arbitrum Token', code: 'ARB', img: getTokenEntity("ARB", 'short').icon},
//   {name: 'GMX Token', code: 'GMX', img: getTokenEntity("GMX", 'short').icon},
//   {name: 'Ether', code: 'WETH', img: getTokenEntity("WETH", 'short').icon},
//   {name: 'USD Coin', code: 'USDC', img: getTokenEntity("USDC", 'short').icon},
//   {name: 'Tether USD', code: 'USDT', img: getTokenEntity("USDT", 'short').icon},
//   {name: 'Wrapped BTC', code: 'BTC', img: getTokenEntity("WBTC", 'short').icon},
//   {name: 'Magic', code: 'MAGIC', img: getTokenEntity("MAGIC", 'short').icon},
//   {name: 'Pendle', code: 'PENDLE', img: getTokenEntity("PENDLE", 'short').icon},
//   {name: 'RDNT', code: 'RDNT', img: getTokenEntity("RDNT", 'short').icon},
//   {name: 'Wrapped MATIC', code: 'WMATIC', img: getTokenEntity("MATIC", 'short').icon},
//   {name: 'Stargate Finance', code: 'STG', img: getTokenEntity("STG", 'short').icon},
//   {name: 'Wrapped BNB', code: 'WBNB', img: getTokenEntity("WBNB", 'short').icon},
// ])

function filterTvl() {
  if (hidePools.value === false) {
    pools.value = FormatAllToDisplay(
      defaultPools.value,
      chainSelected.value.name,
    )
  } else if (hidePools.value === true) {
    pools.value = pools.value.filter((el) => Number(el.TVL) > 1000)
  }
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
  let volume_7d_trades = poolSwapsData.value.filter((item) => isTimestampWithinLast7Days(item.timestamp))
  cl_pools.value = (await useUniswapPools(56)).map((item) => ({
    id: item.id,
    'Pool Name': [[item.token0.symbol, item.token1.symbol]],
    'Pool Weight': [[{ token: item.token0.symbol, weight: '50%' }, { token: item.token1.symbol, weight: '50%' }]],
    LiquidityType: "CL",
    ROI: "-",
    Liquidity: item.totalValueLockedUSD,
    TVL: item.totalValueLockedUSD,
    Volume: volume_7d_trades.filter((trade) => trade.swaps[0].poolIdVault[0] == item.id).reduce((sum, trade) => sum + trade.volumeUsd, 0).toFixed(2),
    APR: '0',
    Blockchain: "Binance",
  }))
  console.log("CL POOLS - ", cl_pools)
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

const all_pools = computed(() => pools.value.concat(cl_pools.value))

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
    background: linear-gradient(0deg,
        rgba(255, 255, 255, 2%),
        rgba(255, 255, 255, 0%));
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

#manage-pools-filters__el {
  .multiselect {
    min-height: 35.5px;

    @media (max-width: $xxl) {
      min-height: 24px !important;
    }
  }

  .multiselect__placeholder {
    color: rgba(255, 255, 255, 0.61) !important;
    font-size: 13px !important;
    margin-bottom: 0 !important;
    line-height: 19.5px !important;

    @media (max-width: $xxl) {
      font-size: 10px !important;
      line-height: normal !important;
    }
  }

  .multiselect__tags {
    padding: 5px 40px 7px 13px !important;
    border-radius: 20px !important;
    border: 1px solid #00c9ff !important;
    background: transparent !important;
    color: #fff !important;
    min-width: 170px !important;
    height: 35.5px !important;
    min-height: 35.5px !important;

    @media (max-width: $xxl) {
      min-height: 24px !important;
      padding: 0px 10px 5px 10px !important;
      min-width: 190px;
      height: 24px !important;
    }
  }

  .multiselect__select {
    @media (max-width: $xxl) {
      width: 24px;
      height: 28px;
    }
  }

  .multiselect--active {
    .multiselect__tags {
      border-radius: 20px 20px 0 0 !important;
    }
  }

  .multiselect__content-wrapper {
    border-radius: 0 0 20px 20px !important;
    border: 1px solid #00c9ff !important;
    border-top: none !important;
    background: #02120a !important;
  }

  .multiselect__option {
    color: #a3a4a5 !important;
    background: #02120a !important;

    &:hover {
      color: #00c9ff !important;
      background: lighten(#02120a, 0.7) !important;
    }
  }

  .multiselect__single {
    background: #02120a !important;
    margin-bottom: 0 !important;
  }
}

.manage-pools {
  &-filters {
    display: flex;
    align-items: end;
    gap: 16px;

    @media all and (max-width: 767px) {
      width: 100%;
      margin-top: 20px;
      align-items: flex-start;
    }

    &__title {
      font-size: 12px;
      font-weight: 700;
      font-family: Poppins;
      color: #fff;

      @media (max-width: $xxl) {
        font-size: 10px;
      }
    }

    &__input {
      border-radius: 8px;
      border: 1px solid #1f1f1f;
      background: #1f1f1f;
      padding: 0 13px;
      min-height: 35.5px;
      font-size: 13px;
      line-height: 24px;
      // background: transparent;
      color: #fff;
      outline: none;

      &::placeholder {
        color: rgba(255, 255, 255, 0.61);
      }

      @media (max-width: $xxl) {
        min-height: 24px;
        font-size: 10px;
      }
    }
  }

  &__warning {
    position: absolute;
    width: 660px;
    height: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.button {
  border-radius: 16px;
  border: 1px solid #2abdff;
  box-shadow: 0px 0px 4.600000381469727px 0px #00affe;
  width: 143px;
  color: white;
  font-weight: 600;
  padding: 7px 13px;
  font-size: 12px;
  display: inline-block;
  cursor: pointer;

  @media (max-width: 1400px) {
    // padding: 4px 10px;
    // font-size: 10px;
    // font-weight: 400;
    // min-height: 25.33px;
  }

  @media (max-width: 768px) {
    // padding: 6px 12px;
    // // color: rgba(126, 246, 178, 1);
    // font-family: Segoe UI;
    // font-size: 12px;
    // font-weight: 600;
    // line-height: 19px;
    // letter-spacing: 0em;
  }
}

.view-mode__active {
  path {
    fill: #00c9ff;
  }
}

.positive {
  color: #17eb5f !important;
}

.negative {
  color: #feb2b2 !important;
}

.filter_button__active {
  stroke: #ffffff !important;
}

.caption-row {
  justify-content: space-between;

  .caption {
    font-family: Inter;
    font-size: 24px;
    font-weight: 400;
    line-height: 32px;

    color: #ffffff;
  }

  .button {
    width: fit-content;
    font-size: 16px;
    font-weight: 600;
    line-height: 19px;
    letter-spacing: 0em;
    color: #ffffff;
    text-wrap: nowrap;

    background: transparent;

    padding-left: 16px;
    padding-right: 16px;
    height: 40px;

    border: 1px #00c9ff solid;
    border-radius: 10px;
  }
}

:deep(.tag_close:hover) {
  color: rgb(255, 146, 146);
  cursor: pointer;
}

.dp__theme_dark {
  --dp-background-color: rgba(15, 17, 19, 1);
  --dp-primary-color: #00c9ff;
  --dp-highlight-color: #00c8ff42;
}

.dp__input {
  min-height: 41.5px;
  min-width: 265px !important;
  max-width: 265px !important;
}

.filters_container {
  display: flex;
  align-items: flex-start;
  margin-top: 20px;
  margin-bottom: 20px;
  gap: 20px;
  flex-wrap: wrap;
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

  @media (max-width: $md) {
    border-radius: 20px;
  }
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

.no_results {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 20%;
  margin-bottom: 20%;
  font-family: Poppins;
  font-size: 18px;
  font-weight: 600;
  line-height: 25px;
  color: rgb(255 255 255 / 95%);
}

.compose_pool_dropdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
  position: absolute;
  background: black;
  padding: 11.5px;
  font-family: Segoe UI;
  font-size: 13px;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: 0em;
  color: #ffffff;
  border-radius: 0px 0px 8px 8px;
  border: 1px solid #2abdff;
  box-shadow: 0px 0px 4.600000381469727px 0px #00affe;

  &_text {
    &:hover {
      color: #00c9ff;
      cursor: pointer;
    }
  }
}

.select_token_dropdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
  position: absolute;
  background: black;
  padding: 11.5px;
  width: 140px;
  font-family: Segoe UI;
  font-size: 13px;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: 0em;
  color: #ffffff;
  border-radius: 0px 0px 16px 16px;
  border: 1px solid #3737374a;
  box-shadow: 0px 4px 4px 0px #15151540;

  &_text {
    &:hover {
      color: #00c9ff;
      cursor: pointer;
    }
  }
}

.checkbox_custom {
  width: 10px;
  height: 10px;
  border: 1px solid #1f1f1f;
}

.checkbox_custom_selected {
  width: 10px;
  height: 10px;
  border: 1px solid #1f1f1f;
  background: #00affe;
}

.filter_button {
  background: linear-gradient(0deg, #090909, #090909),
    linear-gradient(0deg, rgba(55, 55, 55, 0.29), rgba(55, 55, 55, 0.29));
  border-radius: 16px;
  border: 1px solid #3737374a;
  box-shadow: 0px 4px 4px 0px #15151540;
  cursor: pointer;
  padding: 8px 12px;
  color: white;
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
