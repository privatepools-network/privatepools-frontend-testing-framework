<template>
  <div style=" display: flex; flex-direction: column">
    <div
      class="d-flex align-items-center justify-content-between"
      style="background: #2222225d; padding: 8px"
    >
      <div class="d-flex">
        <div class="d-flex gap-2">
          <div
            style="
                color: rgba(243, 244, 246, 1);
                font-weight: 500;
                font-size: clamp(10px, 0.9vw, 15px);
              "
          >
            {{title}}
          </div>
          <img :src="info" />
        </div>
      </div>
      <img :src="calendar" />
    </div>

    <DataTable
      v-if="data.length > 0"
      :data="data"
      :table_bg="'rgba(7, 14, 15, 0.5)'"
      :rowHeight="'h-25'"
      fontSizeTable="small"
      :displayTable="data"
    >
      <template v-slot:default="{ dataCell, dataCellKey }">
        <div
          v-if="dataCellKey === 'Period'"
          class="text-truncate file-table-cell"
          style="font-size: 12px"
          data-coreui-toggle="tooltip"
          data-coreui-placement="left"
          :title="dataCell"
        >
          {{ dataCell }}
        </div>
        <div
          v-else
          :class="`text-truncate file-table-cell ${
                parseFloat(dataCell) > 0
                  ? 'positive'
                  : parseFloat(dataCell) < 0
                  ? 'negative'
                  : ''
              }`"
          style="font-size: 12px"
          data-coreui-toggle="tooltip"
          data-coreui-placement="left"
          :title="dataCell"
        >
          <div class="d-flex align-items-center">
            <div>{{ parseFloat(dataCell) > 0 ? '+' : '' }}</div>
            <div>{{ dataCell }}</div>
            <div>%</div>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>
<script setup>
import DataTable from "@/components/DataTable/index.vue";
import {toRefs,defineProps} from "vue";
import info from "@/assets/images/info.svg";
import calendar from "@/assets/icons/statisticIcons/calendar.svg";


const props = defineProps({
  data: Object,
  title: String
})
const {data, title} = toRefs(props)
</script>

<style lang="scss">
.file-table-cell {
  @media (max-width: 1400px) {
    font-size: 10px !important;
  }
}
</style>
