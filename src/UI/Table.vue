<template>
  <CTable style="table-layout: fixed">
    <CTableHead color="transparent">
      <CTableRow class="table-row">
        <CTableHeaderCell class="text-left table-header-font-folder" v-for="header in headers" :key="header"
        >
          <span v-if="header.toUpperCase() == 'BESTOUTFIRSTSWAPAMOUNT'">Bestoutamount</span>
          <span v-else>{{ header }}</span>
        </CTableHeaderCell
        >
      </CTableRow>
    </CTableHead>
    <slot></slot>
  </CTable>
</template>

<script setup>
import {defineProps, toRefs} from "vue"

const props = defineProps({
  headers: Array,
})

const {headers} = toRefs(props)
</script>
<style scoped lang="scss">
.table {
  &-wrapper {
    padding: 0;
  }

  &-header-font-folder {
    color: #ffffff;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    padding: 29px 0 29px 10px;
    white-space: nowrap;
    overflow: hidden;

    &:not(:first-child) {
      text-align: center;
    }

    &:first-child {
      padding: 29px 0 29px 45px;
      @media (max-width: 1400px) {
        padding: 20px 0px 20px 15px;
      }
    }

    &:last-child {
      padding: 29px 10px 29px 10px;
      @media (max-width: 1400px) {
        padding: 20px 0px 20px 10px;
      }
    }

    @media (max-width: 1400px) {
      font-size: 8px;
      padding: 20px 0px 20px 10px;
    }
  }

  &-transparent {
    border-bottom: 0.5px solid rgba(163, 164, 165, 0.2196078431);
    border-radius: 20px 20px 0 0;
    background: linear-gradient(0deg, #02120A, #02120A), linear-gradient(0deg, rgba(163, 164, 165, 0.4), rgba(163, 164, 165, 0.4));
    width: 100%;
  }

  &-row {
    width: 100%;
    display: table;
    table-layout: fixed;
  }
}
</style>
<style lang="scss">

.table {
  margin-bottom: 0;
}
</style>
