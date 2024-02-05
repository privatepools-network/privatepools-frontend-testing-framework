<template>
  <div class="feed-table">
    <DataTable :displayTable="displayTable"  :data="displayTable"
               :default_head_captions="['Time', 'All Pairs', 'All Types', 'Buy/Sell', 'Price (USDT)', 'Amount (BTC)', 'Amount (ETH)', 'Profit Trade']"
               :table_bg="''" :sortIcons="true" :sortedHeader="sortedHeader"
               :isFullTable="true" @table-header-click="onDatatableHeaderClick">
          <template v-slot:default="{
                dataCell,
                dataCellKey,
                // dataRowIndex /*, tokenName, fieldName*/,
              }">
            <div class="feed-table__pair" v-if="dataCellKey.includes('Name')">
              <div class="feed-table__avatar">
                <img v-for="token in tokenEntities(dataCell)" :key="token" :src="token.icon" alt="" class="feed-table__img">
              </div>
              <div class="feed-table__pair-name">
                {{ tokenEntities(dataCell).map((tokenEntity) => tokenEntity.short).join('/') }}
              </div>
            </div>
            <div v-else-if="dataCellKey.includes('Time')">{{formatTimestamp(dataCell)}}</div>
            <div v-else-if="['Type', 'BuyOrSell', 'Price (USDT)', 'Profit Trade'].includes(dataCellKey)">
              {{dataCell}}
            </div>
            <div v-else-if="['Amount (BTC)', 'Amount (ETH)'].includes(dataCellKey)">
              <span v-if="dataCell > 0" class="text-success">+{{dataCell}}</span>
              <span v-else class="text-danger">{{dataCell}}</span>
            </div>
          </template>
    </DataTable>
  </div>
</template>
<script setup>
import DataTable from "@/components/DataTable/index.vue";
import {ref} from "vue";
import {getTokenEntity} from "@/lib/helpers/util";
const displayTable = ref([
  {
    Time: 1699646255000,
    Name: ['BTC', 'ETH'],
    Type: 'Limit Order',
    BuyOrSell: 'Buy',
    'Price (USDT)': 26641.20,
    'Amount (BTC)': 0.235622,
    'Amount (ETH)': -31641.20,
    'Profit Trade': 0.225622
  },
  {
    Time: 1699641255000,
    Name: ['BTC', 'ETH'],
    Type: 'Limit Order',
    BuyOrSell: 'Buy',
    'Price (USDT)': 16641.20,
    'Amount (BTC)': 1.235622,
    'Amount (ETH)': -11641.20,
    'Profit Trade': 1.225622
  },
  {
    Time: 1699643255000,
    Name: ['BTC', 'ETH'],
    Type: 'Limit Order',
    BuyOrSell: 'Buy',
    'Price (USDT)': 16641.20,
    'Amount (BTC)': 1.235622,
    'Amount (ETH)': -11641.20,
    'Profit Trade': 1.225622
  },
  {
    Time: 1699643255000,
    Name: ['BTC', 'ETH'],
    Type: 'Limit Order',
    BuyOrSell: 'Buy',
    'Price (USDT)': 16641.20,
    'Amount (BTC)': 1.235622,
    'Amount (ETH)': -11641.20,
    'Profit Trade': 1.225622
  },
  {
    Time: 1699643255000,
    Name: ['BTC', 'ETH'],
    Type: 'Limit Order',
    BuyOrSell: 'Buy',
    'Price (USDT)': 16641.20,
    'Amount (BTC)': 1.235622,
    'Amount (ETH)': -11641.20,
    'Profit Trade': 1.225622
  },

])
const sortedHeader = ref({})

function onDatatableHeaderClick(caption) {
  console.log(caption)
  let availableFilterHeaders = [
    'Time',
    'Price (USDT)',
    'Amount (BTC)',
    'Amount (ETH)',
    'Profit Trade',
  ]
  if (availableFilterHeaders.includes(caption)) {
    let sortedAsc = [...displayTable.value].sort((a, b) => a[caption] - b[caption])
    let sortedDesc = [...displayTable.value].sort(
      (a, b) => b[caption] - a[caption],
    )

    if (
      JSON.stringify(sortedDesc) == JSON.stringify(displayTable.value) &&
      !(
        sortedHeader.value.caption == caption &&
        sortedHeader.value.direction == 'asc'
      )
    ) {
      displayTable.value = sortedAsc
      sortedHeader.value = { caption, direction: 'asc' }
    } else {
      displayTable.value = sortedDesc
      sortedHeader.value = { caption, direction: 'desc' }
    }
  }
}

function formatTimestamp(timestamp) {
  let date = new Date(timestamp)
  let formattedDate = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  return formattedDate
}

function tokenEntities(tokens) {
  let entities = tokens.map((propValue) => getTokenEntity(propValue, 'short'))
  console.log(entities)
  return entities
}
</script>
<style lang="scss" scoped>
.feed-table {
  border-radius: 25px;
  border: 1px solid rgba(163, 164, 165, 0.40);
  padding: 0 20px;
  overflow-x: auto;
  &__pair {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__img {
    width: 25px;
    &:first-child {
      margin-top: -4px;
    }
    &:nth-child(2) {
      margin-left: -16px;
      margin-bottom: -4px;
    }
  }
}
:deep(.file-table-header-container_full) {
  width: 100px !important;
  padding: 20px 8px 16px 8px !important;
  white-space: nowrap;
  .file-table-header-cell {
    font-weight: 400 !important;
  }
}
:deep(.file-table-cell-container) {
  width: 100px !important;
  font-weight: 400;
  font-size: clamp(10px, 0.8vw, 12px);
  &:not(:first-child) {
    text-align: center;
  }
  --cui-table-hover-color: #fff;
  --cui-table-hover-bg: none;
}
:deep(.table_full) {
  @media (max-width: 1000px) {
    width: 150%;
  }
  .file-table-row {
    height: auto !important;
  }
}
:deep(.file-table-body) {
  .file-table-row {
    &:first-child {
      margin-top: 8px;
    }
  }
}
</style>
