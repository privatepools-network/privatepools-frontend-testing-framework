<template>
  <MainCard>
    <div class="mb-4">
      <ChainSelector @updateChain="(newChain) => (chainSelected = newChain)" />
    </div>
    <CRow class="caption-row">
      <Title :title="caption" style="margin-bottom: 0 !important"></Title>
    </CRow>
    <CRow>
      <div class="d-flex justify-content-between mt-3 flex-wrap">
        <div v-if="width <= 768" @click="onClick" class="button">
          Compose Pool
        </div>
      </div>
      <div class="d-flex justify-content-between mt-3 mb-4 flex-wrap">
        <div class="d-flex align-items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style="cursor: pointer"
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            :class="{ 'view-mode__active': viewMode == 'cards' }"
            @click=";(viewMode = 'cards'), (perPage = 8)"
          >
            <path
              d="M5.18766 13H8.31266C8.88558 13 9.35433 12.5312 9.35433 11.9583V7.79167C9.35433 7.21875 8.88558 6.75 8.31266 6.75H5.18766C4.61475 6.75 4.146 7.21875 4.146 7.79167V11.9583C4.146 12.5312 4.61475 13 5.18766 13ZM5.18766 20.2917H8.31266C8.88558 20.2917 9.35433 19.8229 9.35433 19.25V15.0833C9.35433 14.5104 8.88558 14.0417 8.31266 14.0417H5.18766C4.61475 14.0417 4.146 14.5104 4.146 15.0833V19.25C4.146 19.8229 4.61475 20.2917 5.18766 20.2917ZM11.4377 20.2917H14.5627C15.1356 20.2917 15.6043 19.8229 15.6043 19.25V15.0833C15.6043 14.5104 15.1356 14.0417 14.5627 14.0417H11.4377C10.8647 14.0417 10.396 14.5104 10.396 15.0833V19.25C10.396 19.8229 10.8647 20.2917 11.4377 20.2917ZM17.6877 20.2917H20.8127C21.3856 20.2917 21.8543 19.8229 21.8543 19.25V15.0833C21.8543 14.5104 21.3856 14.0417 20.8127 14.0417H17.6877C17.1147 14.0417 16.646 14.5104 16.646 15.0833V19.25C16.646 19.8229 17.1147 20.2917 17.6877 20.2917ZM11.4377 13H14.5627C15.1356 13 15.6043 12.5312 15.6043 11.9583V7.79167C15.6043 7.21875 15.1356 6.75 14.5627 6.75H11.4377C10.8647 6.75 10.396 7.21875 10.396 7.79167V11.9583C10.396 12.5312 10.8647 13 11.4377 13ZM16.646 7.79167V11.9583C16.646 12.5312 17.1147 13 17.6877 13H20.8127C21.3856 13 21.8543 12.5312 21.8543 11.9583V7.79167C21.8543 7.21875 21.3856 6.75 20.8127 6.75H17.6877C17.1147 6.75 16.646 7.21875 16.646 7.79167Z"
              fill="#BDC2C4"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style="cursor: pointer"
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            :class="{ 'view-mode__active': viewMode == 'rows' }"
            @click=";(viewMode = 'rows'), (perPage = 10)"
          >
            <path
              d="M5.18766 15.0833H7.271C7.84391 15.0833 8.31266 14.6145 8.31266 14.0416V11.9583C8.31266 11.3853 7.84391 10.9166 7.271 10.9166H5.18766C4.61475 10.9166 4.146 11.3853 4.146 11.9583V14.0416C4.146 14.6145 4.61475 15.0833 5.18766 15.0833ZM5.18766 20.2916H7.271C7.84391 20.2916 8.31266 19.8228 8.31266 19.2499V17.1666C8.31266 16.5937 7.84391 16.1249 7.271 16.1249H5.18766C4.61475 16.1249 4.146 16.5937 4.146 17.1666V19.2499C4.146 19.8228 4.61475 20.2916 5.18766 20.2916ZM5.18766 9.87492H7.271C7.84391 9.87492 8.31266 9.40617 8.31266 8.83325V6.74992C8.31266 6.177 7.84391 5.70825 7.271 5.70825H5.18766C4.61475 5.70825 4.146 6.177 4.146 6.74992V8.83325C4.146 9.40617 4.61475 9.87492 5.18766 9.87492ZM10.396 15.0833H20.8127C21.3856 15.0833 21.8543 14.6145 21.8543 14.0416V11.9583C21.8543 11.3853 21.3856 10.9166 20.8127 10.9166H10.396C9.82308 10.9166 9.35433 11.3853 9.35433 11.9583V14.0416C9.35433 14.6145 9.82308 15.0833 10.396 15.0833ZM10.396 20.2916H20.8127C21.3856 20.2916 21.8543 19.8228 21.8543 19.2499V17.1666C21.8543 16.5937 21.3856 16.1249 20.8127 16.1249H10.396C9.82308 16.1249 9.35433 16.5937 9.35433 17.1666V19.2499C9.35433 19.8228 9.82308 20.2916 10.396 20.2916ZM9.35433 6.74992V8.83325C9.35433 9.40617 9.82308 9.87492 10.396 9.87492H20.8127C21.3856 9.87492 21.8543 9.40617 21.8543 8.83325V6.74992C21.8543 6.177 21.3856 5.70825 20.8127 5.70825H10.396C9.82308 5.70825 9.35433 6.177 9.35433 6.74992Z"
              fill="#BDC2C4"
            />
          </svg>
          <div class="d-flex align-items-center gap-2">
            <div style="cursor: pointer">
              <CFormSwitch
                size="md"
                v-model="hidePools"
                id="hidePools"
                style="background-color: #00c9ff"
              />
            </div>
            <div class="text-white" style="font-size: clamp(10px, 0.8vw, 14px)">
              Hide pools
            </div>
          </div>
        </div>
        <div class="manage-pools-filters">
          <div class="manage-pools-filters__el" id="manage-pools-filters__el">
            <!-- <div class="manage-pools-filters__title">SEARCH</div> -->
            <input
              placeholder="Search Pools..."
              class="manage-pools-filters__input"
              v-model="searchBy"
            />
          </div>

          <div v-if="width > 768">
          <div  class="button d-flex align-items-center gap-2" :style="composePoolDropdownOpen === true ? 'border-radius: 8px 8px 0px 0px;' : ''" @click="composePoolDropdownOpen = !composePoolDropdownOpen">
            Compose Pool
            <svg
              :style="composePoolDropdownOpen ? 'transform: rotate(180deg)' : ''"
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.22502 5.74172L4.99166 2.50836L1.75832 5.74172C1.43332 6.06672 0.908323 6.06672 0.583323 5.74172C0.258324 5.41672 0.258324 4.89169 0.583323 4.56669L4.40832 0.74169C4.73332 0.41669 5.25832 0.41669 5.58332 0.74169L9.40835 4.56669C9.73335 4.89169 9.73335 5.41672 9.40835 5.74172C9.08335 6.05839 8.55002 6.06672 8.22502 5.74172Z"
                fill="#00C9FF"
              />
            </svg>
          </div>
          <div v-if="composePoolDropdownOpen === true" class="compose_pool_dropdown">
    

            <div  @click="onClickConcentratedPool" class="compose_pool_dropdown_text">
              CL Pools
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 2.5V9.5"
                  stroke="#F8F8F8"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M2.5 6H9.5"
                  stroke="#F8F8F8"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <div @click="onClick" class="compose_pool_dropdown_text">
              Weighted Pools
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 2.5V9.5"
                  stroke="#F8F8F8"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M2.5 6H9.5"
                  stroke="#F8F8F8"
                  stroke-width="2"
                  stroke-linecap="round"
                />
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
          <div
            class="pools-row__col"
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
                  style="width: 20px"
                  v-if="
                    !['pool composition', 'actions'].includes(
                      headCaption.toLowerCase(),
                    ) && sortedHeader.caption !== headCaption
                  "
                >
                  <svg
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
                  </svg>
                </div>
                <div
                  @click="
                    $emit('table-header-click', headCaption, headCaptionIndex)
                  "
                  style="font-family: Inter; font-weight: 700; width: 20px"
                  v-else-if="
                    (sortedHeader && sortedHeader.caption == 'Time') ||
                    (headCaptionIndex != 0 &&
                      sortedHeader &&
                      sortedHeader.caption)
                  "
                >
                  {{
                    sortedHeader &&
                    sortedHeader.caption &&
                    sortedHeader.caption == headCaption
                      ? sortSymbol
                      : ''
                  }}
                </div>
                <div
                  @click="onDatatableHeaderClick(headCaption)"
                  :class="fontSizeTable"
                >
                  {{ headCaption.toUpperCase() }}
                </div>
                <div
                  v-if="periodsHeaders.includes(headCaption)"
                  style="margin-right: -15px"
                >
                  <div>
                    <multiselect
                      :modelValue="filtersSelected[headCaptionIndex]"
                      @update:modelValue="onFilterClick($event, headCaption),filtersSelected[headCaptionIndex] = $event
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
                </div>
                <div v-else-if="sortedHeader" style="width: 17px"></div>
              </div>
            </div>
          </div>
        </div>
        {{ console.log('pools.length', pools) }}
        <div
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
        <div v-else-if="pools.length === 0" class="no_results">No results.</div>
        <PoolRow
          v-else
          v-for="(pool, index) in filterByStatus"
          :poolsLength="filterByStatus.length"
          :perPage="perPage"
          :key="pool.name"
          :pool="pool"
          :inactive="isPoolInactive(pool)"
          :index="index"
          @goToPool="goToPool"
          :isActions="true"
        />
      </div>
      <div class="pools-cards" v-else-if="viewMode == 'cards'">
        <div
          v-if="poolsNoResult"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            margin-top: 20%;
            margin-bottom: 20%;
          "
        >
          <LoaderPulse />
        </div>
        <div v-else-if="pools.length === 0" class="no_results">No results.</div>
        <PoolCard
          v-for="(pool, index) in filterByStatus"
          :key="pool.name"
          :pool="pool"
          :index="index"
          @goToPool="goToPool"
          :inactive="isPoolInactive(pool)"
        />
      </div>
      <Pagination
        v-if="filterByStatus.length != 0"
        :perPage="perPage"
        :pools="pools"
        :currentPage="currentPage"
        @changePage="changePage"
        @changePerPage="changePerPage"
        :perPageOptions="perPageOptions"
      ></Pagination>
      <!--      <DataTable v-if="pools.length > 0" :data="pools" @table-row-click="onDatatableRowClick" :table_bg="'bg-primary'"-->
      <!--                 @table-header-click="onDatatableHeaderClick" :sortedHeader="sortedHeader">-->
      <!--        <template v-slot:default="{ dataCell, dataCellKey /*, tokenName, fieldName*/ }">-->
      <!--          <DataTableCellTokenNamePaired v-if="dataCellKey === 'Name'" :value="dataCell"/>-->
      <!--          <div v-else-if="dataCellKey === 'LP Price Change'"-->
      <!--               :class="`text-truncate file-table-cell ${parseFloat(dataCell) > 0 ? 'positive' : 'negative'}`"-->
      <!--               data-coreui-toggle="tooltip" data-coreui-placement="left" :title="dataCell">-->
      <!--            {{ dataCell }}-->
      <!--          </div>-->
      <!--          <div v-else class="text-truncate file-table-cell" data-coreui-toggle="tooltip" data-coreui-placement="left"-->
      <!--               :title="dataCell">-->
      <!--            {{ dataCell }}-->
      <!--          </div>-->
      <!--        </template>-->
      <!--      </DataTable>-->
    </CRow>
  </MainCard>

  <!--  <NetworkWarning :NetworkUnsupported="NetworkUnsupported" :visibleNetworkModal="visibleNetworkModal"-->
  <!--    @changeVisibleNetworkModal="changeVisibleNetworkModal" />-->
  <!--  <div class="manage-pools__warning" v-if="visibleNetworkModal">-->
  <!--    <Warning :NetworkUnsupported="NetworkUnsupported"></Warning>-->
  <!--  </div>-->
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
import {
  DisplayNetwork,
  Network,
  networkId,
  DisplayChain,
} from '@/composables/useNetwork'
// import Warning from "@/UI/Warning";
import { useDevice } from '@/composables/adaptive/useDevice'
import Multiselect from 'vue-multiselect'
const viewMode = ref('rows')
const { width } = useDevice()

const chainSelected = ref({ name: 'All Chains', code: 'ALL', img: '' })
const composePoolDropdownOpen = ref(false)

const headers = [
  'Pool Composition',
  'Revenue',
  'Fees',
  'Trades',
  'Volume',
  'TVL',
  'APR',
  'Profit',
  'Actions',
]
const periodsHeaders = [
  'Revenue',
  'Fees',
  'Trades',
  'Volume',
  'TVL',
  'APR',
  'Profit',
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

const hidePools = ref(true)

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

watch(defaultPools, () => {
  pools.value = FormatAllToDisplay(defaultPools.value, chainSelected.value.name)
  filterTvl()
})

// const visibleNetworkModal = ref(false)
// const NetworkUnsupported = ref(false)
const networksSupported = ref(null)
const caption = ref('Manage Pools')

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

function goToPool(args) {
  router.push({
    name: 'Pool Details',
    params: {
      id: filterByStatus.value[args.index].id,
      onMountedActivity: args.onMountedActivity,
      chainSelected: DisplayChain[networkId.value],
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
    border-color: rgba(1, 180, 126, 1) !important;
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
    color: rgb(1, 180, 126) !important;
  }

  :deep(.multiselect__option--selected:hover) {
    color: rgb(229, 83, 83) !important;
    background: rgb(15, 17, 19) !important;
  }
}

.pools {
  &-rows {
    padding: 0;
    border-radius: 24px;
    border: 1px solid rgba(49, 56, 61, 0.81);
    background: linear-gradient(152.97deg, #000000 0%, rgba(0, 0, 0, 0) 100%);

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
  border-radius: 8px;
  border: 1px solid #1f1f1f;
  background: #1f1f1f;
  color: #00c9ff;
  font-weight: 600;
  padding: 7px 13px;
  font-size: 13px;
  display: inline-block;
  cursor: pointer;

  @media (max-width: 1400px) {
    padding: 4px 10px;
    font-size: 10px;
    font-weight: 400;
    min-height: 25.33px;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    color: rgba(126, 246, 178, 1);
    font-family: Segoe UI;
    font-size: 12px;
    font-weight: 600;
    line-height: 19px;
    letter-spacing: 0em;
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
    font-size: 20px;
    font-weight: 600;
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
  --dp-primary-color: rgb(1, 180, 126);
  --dp-highlight-color: rgba(1, 180, 126, 0.384);
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
  border-color: rgba(1, 180, 126, 1) !important;
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
  color: rgb(1, 180, 126) !important;
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
  background: #1F1F1F;
  padding: 11.5px;
  font-family: Segoe UI;
font-size: 13px;
font-weight: 600;
line-height: 19px;
letter-spacing: 0em;
color: #FFFFFF;
border-radius: 0px 0px 8px 8px;

&_text {

&:hover {
  color: #00c9ff;
  cursor: pointer;
}
}
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
