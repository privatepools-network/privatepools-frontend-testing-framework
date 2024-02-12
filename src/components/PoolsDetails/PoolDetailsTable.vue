<template>
  <div style="margin-bottom: 150px">
    <div style="
        font-family: Inter;
        font-size: clamp(12px, 0.8vw, 17px);
        font-weight: 700;
        line-height: 28px;
        letter-spacing: 0em;
        color: #fff;
      ">
      Pairs & Tokens
    </div>
    <div class="table_above">
      <div>
        <Tabs :selectedTab="selectedTab" :tabsOptions="available_tabs" @changeTab="changeTab"></Tabs>
      </div>
      <div class="table_above_sub">
        <div v-if="width > 768" class="d-flex align-items-center gap-2">
          <div class="text-white table_above_toggler">
            Hide {{ selectedTab.toLowerCase() }}
          </div>
          <div style="cursor: pointer">
            <CFormSwitch size="l" v-model="hideSmallerThan10Pools" id="hideSmallerThan10Pools" />
          </div>
        </div>
        <CInputGroup class="d-flex align-items-center justify-content-start search-input-group">
          <CFormInput type="text" placeholder="Filter by token..." style="color: #fff" aria-label="Filter by token..."
            class="search-input" v-model="filterName" />
          <CAvatar :src="Search" class="search-input-avatar" />
        </CInputGroup>
      </div>
    </div>

    <div class="mt-3 track_info_table">
      <DataTable :displayTable="displayTable" :data="displayTable" :default_head_captions="selectedTab == 'Pools'
        ? [
          'Name',
          'Revenue',
          'Fees',
          'Trades',
          'Volume',
          'TVL',
          'APR',
          'Profit',
        ]
        : selectedTab === 'Pairs' ? ['Name', 'Revenue', 'Fees', 'Trades', 'Volume', 'TVL', 'Profit', 'Ratio', 'Market Ratio', '%Deviation' ] : ['Name', 'Revenue', 'Fees', 'Trades', 'Volume', 'TVL', 'Profit']
        " :table_bg="''" :filterableHeaders="filterableHeaders" @filter-click="onFilterClick" :sortIcons="true"
        @table-header-click="onDatatableHeaderClick" :sortedHeader="sortedHeader" :headerDropdownSort="true"
        :isFullTable="true">
        <template v-slot:default="{
          dataCell,
          dataCellKey,
          dataRowIndex /*, tokenName, fieldName*/,
        }">
          <div :class="displayTable[dataRowIndex] &&
            isPoolInactive(tableData[dataRowIndex])
            ? 'inactive'
            : ''
            " style="cursor: pointer">
            <DataTableCellTokenNamePaired v-if="dataCellKey.includes('Name')" :value="dataCell" />
            <div v-else-if="['Profit', 'Revenue', 'Volume', 'TVL', 'Fees'].includes(
              dataCellKey,
            )
              " class="text-truncate file-table-cell" :class="tableData[dataRowIndex].Blockchain === trackCurrentNetwork
    ? 'text-white'
    : 'text-secondary'
    " data-coreui-toggle="tooltip" data-coreui-placement="left" :title="dataCell">
              <div class="d-flex align-items-center justify-content-center">

                <div>
                  <CurrencySymbol :symbol="symbol" />
                  {{ numberToAposthrophe(dataCell, currencyDecimals) }}
                </div>
              </div>
            </div>
            <div v-else-if="['APR', '%Deviation'].includes(dataCellKey)" class="text-truncate file-table-cell" :class="tableData[dataRowIndex].Blockchain === trackCurrentNetwork
              ? 'text-white'
              : 'text-secondary'
              " data-coreui-toggle="tooltip" data-coreui-placement="left" :title="dataCell">
              <div class="d-flex align-items-center justify-content-center">
                <div>{{ dataCell }}</div>
                <div>%</div>
              </div>
            </div>
            <div v-else class="text-truncate file-table-cell text-center" data-coreui-toggle="tooltip"
              data-coreui-placement="left" :class="tableData[dataRowIndex].Blockchain === trackCurrentNetwork
                ? 'text-white'
                : 'text-secondary'
                " :title="dataCell">
              {{ numberToAposthrophe(dataCell, currencyDecimals) }}
            </div>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed, toRefs, defineProps, onMounted } from 'vue'
import DataTableCellTokenNamePaired from '@/components/DataTable/Cell/TokenNamePaired.vue'
import DataTable from '@/components/DataTable/index.vue'
import Tabs from '@/UI/Tabs.vue'
import Search from '@/assets/images/search.png'
import { useDevice } from '@/composables/adaptive/useDevice'
import { isRightChainName } from '@/composables/pools/usePoolSwapsStats'
import { FormatAllPairsToDisplay } from '@/lib/formatter/trackPairsFormatter'
import { FormatAllTokensToDisplay } from '@/lib/formatter/trackTokensFormatter'
import { excludeKeysFromObject } from '@/lib/utils'
import {
  networkId,
  DisplayNetwork,
  // DisplayChain,
} from '@/composables/useNetwork'
import CurrencySymbol from "@/components/TrackInfo/CurrencySymbol.vue"
import numberToAposthrophe from '@/lib/formatter/numberToAposthrophe'

const props = defineProps([
  'allPairsTableData',
  'allTokensTableData',
  'chainSelected',
  'currency', 'symbol', 'currencyDecimals'
])
const { allPairsTableData, allTokensTableData, chainSelected } = toRefs(props)
const tableData = ref([])
const available_tabs = ['Pairs', 'Tokens']
const selectedTab = ref(available_tabs[0])
const { width } = useDevice()


const hideTvlValues = {
  "USD": 1000,
  "ETH": 0.5,
  "BTC": 0.02
}
const hideTvlValue = computed(() => hideTvlValues[props.currency])

function changeTab(tab) {
  selectedTab.value = tab
}

const available_tabs_data = computed(() => ({
  Pairs: {
    allTableData: allPairsTableData.value,
    allFormatter: FormatAllPairsToDisplay,
    filterableHeaders: ['Profit', 'Trades', 'Revenue', 'Volume', 'Fees'],
  },
  Tokens: {
    allTableData: allTokensTableData.value,
    allFormatter: FormatAllTokensToDisplay,
    filterableHeaders: ['Profit', 'Trades', 'Revenue', 'Volume', 'Fees'],
  },
}))
const selectedTableData = computed(
  () => available_tabs_data.value[selectedTab.value].allTableData,
)
const formatterMethod = computed(
  () => (data) =>
    available_tabs_data.value[selectedTab.value].allFormatter(
      data,
      chainSelected.value.name,
    ),
)

const trackCurrentNetwork = computed(() => DisplayNetwork[networkId.value])

const networksSupported = ref(networkId.value >= 0)
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

const filterName = ref('')

const hideSmallerThan10Pools = ref(true)
const sortedHeader = ref({})

const displayTable = computed(() => {
  let formatted =
    selectedTableData.value.length > 0
      ? tableData.value.map((td) =>
        excludeKeysFromObject({ ...td }, ['id', 'balance0', 'balance1']),
      )
      : null
  if (!formatted) return formatted
  formatted = formatted.filter((item) =>
    isRightChainName(item.Blockchain, chainSelected.value.name),
  )
  let nameIndex = `${selectedTab.value.slice(
    0,
    selectedTab.value.length - 1,
  )} Name`
  formatted = formatted.filter(
    (item) =>
      filterName.value == '' ||
      item[nameIndex][0]
        .join('')
        .toLowerCase()
        .includes(filterName.value.toLowerCase()),
  )
  return formatted
})

const filterableHeaders = computed(
  () => available_tabs_data.value[selectedTab.value].filterableHeaders,
)

watch(selectedTableData, () => {
  tableData.value = formatterMethod.value(selectedTableData.value)
  hideSmallerThan10Pools.value = true
  filterTvl()
})

watch(hideSmallerThan10Pools, () => {
  filterTvl()
})

watch(selectedTab, () => {
  onTabChange()
})

onMounted(() => {
  tableData.value = formatterMethod.value(selectedTableData.value)
  onTabChange()
})

function onTabChange() {
  hideSmallerThan10Pools.value = true
  filterTvl()
}

function filterTvl() {
  console.log(tableData.value)
  if (hideSmallerThan10Pools.value === false) {
    tableData.value = formatterMethod.value(selectedTableData.value)
  } else if (hideSmallerThan10Pools.value === true) {
    tableData.value = tableData.value.filter(
      (el) =>
        Number(el.TVL) > hideTvlValue.value &&
        (el.balance0 == undefined ||
          (el.balance0 > hideTvlValue.value && el.balance1 > hideTvlValue.value)),
    )
  }
}

function onDatatableHeaderClick(caption) {
  let availableFilterHeaders = [
    'Profit',
    'Revenue',
    'Trades',
    'Volume',
    'Fees',
    'TVL',
  ]
  if (availableFilterHeaders.includes(caption)) {
    let sortedAsc = [...tableData.value].sort((a, b) => a[caption] - b[caption])
    let sortedDesc = [...tableData.value].sort(
      (a, b) => b[caption] - a[caption],
    )

    if (
      JSON.stringify(sortedDesc) == JSON.stringify(tableData.value) &&
      !(
        sortedHeader.value.caption == caption &&
        sortedHeader.value.direction == 'asc'
      )
    ) {
      tableData.value = sortedAsc
      sortedHeader.value = { caption, direction: 'asc' }
    } else {
      tableData.value = sortedDesc
      sortedHeader.value = { caption, direction: 'desc' }
    }
  }
}

function onFilterClick(filterValue, header) {
  tableData.value.forEach((td) => {
    let found = selectedTableData.value.find((dtd) => dtd.id == td.id)
    td[header] = found[filterValue.code]
  })
}

// function goToPool(poolIndex) {
//   if (isPoolInactive(tableData.value[poolIndex])) return
//   router.push({
//     name: 'Pool Details',
//     params: {
//       id: tableData.value[poolIndex].id,
//       onMountedActivity: 'info',
//       chainSelected: DisplayChain[networkId.value],
//     },
//   })
// }
</script>
<style lang="scss">
@import '@/styles/_variables.scss';



.table_above_toggler {
  font-size: 12px;

  @media (max-width: $xxl) {
    font-size: 10px;
  }
}

.search-input {
  font-size: 12px;

  @media (max-width: $xxl) {
    font-size: 10px;
    padding: 0px 12px;
  }

  &-group {
    border-radius: 20px;
    background: transparent;
    padding: 1px 8px;

    @media (max-width: $xxl) {
      width: 150px;
      padding: 4px 0;
    }
  }

  &::placeholder {
    color: #fff;
  }

  &-avatar {
    width: 15px;
    margin-right: 10px;

    @media (max-width: $xxl) {
      width: 10px;
      height: 15px;
    }
  }
}

.dropdown-item {
  color: white !important;
}

.dropdown-item:hover {
  color: #009a6c !important;
  background: none;
  cursor: pointer;
}

.positive {
  color: rgba(63, 185, 80, 1) !important;
}

.negative {
  color: rgba(248, 81, 73, 1) !important;
}

.dropdown_status {
  position: relative;
  top: -10px;
  left: 140px;
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #009a6c;
  border: 1px solid rgba(86, 90, 105, 1);
  border-radius: 100%;
  padding: 3px;
  z-index: 10;
  color: white;
  font-size: 12px;
  font-weight: 400;
}

.track_info_table {
  overflow-x: auto;
  padding: 0;
  border-radius: 15px;
  background: linear-gradient(153deg, #000 0%, rgba(0, 0, 0, 0.00) 80%);
  backdrop-filter: blur(20.067087173461914px);
}

.table_above {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table_above_sub {
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: $md) {
  .table_above {
    /* flex-direction: column; */
    align-items: baseline;
    gap: 10px;
  }

  .table_above_sub {
    flex-direction: column-reverse;
    gap: 10px;
  }
}

.inactive {
  opacity: 0.5;
}
</style>
