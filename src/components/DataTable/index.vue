<template>
  <CTable borderless  class="!bg-white dark:!bg-[#fff0]"
    :class="{ 'table_full': isFullTable == true, 'table_small': isFullTable != true, 'table_small_loading': isFullTable != true && displayTable == null }">
    <CTableHead color="" class="file-table-head">
      <CTableRow class="file-table-row" :class="rowHeight ? rowHeight : 'file-table-row'">
        <CTableHeaderCell v-for="(headCaption, headCaptionIndex) in headCaptions"
          :key="`head-caption-key-${headCaptionIndex}`" class="text-left dark:!bg-[#171718] bg-white text-black dark:!text-white"
          :class="{ 'file-table-header-container_full': isFullTable == true, ' file-table-header-container': isFullTable != true, header_cells_bg }">
          {{ console.log(headCaption) }}
          <div class="file-table-header-cell">
            <div class="d-flex align-items-center gap-1" :class="headCaptionIndex !== 0 ? header_cells_inside : ''"
              style="cursor: pointer; height: 20px;">
              <div style="width:20px" v-if="sortIcons &&
                headCaption !== 'Pair Name' &&
                headCaption !== 'Pool Name' &&
                headCaption !== 'Token Name' &&
                headCaption !== 'Name' &&
                sortedHeader.caption !== headCaption
                ">
                <svg @click="
                  $emit('table-header-click', headCaption, headCaptionIndex)
                  " width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.2975 8.72852L6.09047 5.00977C5.99867 4.90332 5.82192 4.90332 5.72914 5.00977L2.52211 8.72852C2.40297 8.86719 2.51039 9.07031 2.70278 9.07031H9.11684C9.30922 9.07031 9.41664 8.86719 9.2975 8.72852Z"
                    fill="#808080" />
                  <path
                    d="M9.11684 10.9297H2.70278C2.51039 10.9297 2.40297 11.1328 2.52211 11.2715L5.72914 14.9902C5.82094 15.0967 5.9977 15.0967 6.09047 14.9902L9.2975 11.2715C9.41664 11.1328 9.30922 10.9297 9.11684 10.9297Z"
                    fill="#808080" />
                </svg>
              </div>
              <div @click="
                $emit('table-header-click', headCaption, headCaptionIndex)
                " style="font-family: Montserrat; font-weight: 700;width: 20px"
                v-else-if="sortedHeader && sortedHeader.caption == 'Time' || headCaptionIndex != 0 && sortedHeader && sortedHeader.caption">
                {{
                  sortedHeader &&
                  sortedHeader.caption &&
                  sortedHeader.caption == headCaption
                  ? sortSymbol
                  : ''
                }}
              </div>
              <div @click="
                $emit('table-header-click', headCaption, headCaptionIndex)
                " :class="fontSizeTable" class="text-black dark:!text-white">
                {{ headCaption }}
              </div>

            </div>
          </div>
        </CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody class="file-table-body" style="position:relative;">
      {{ console.log('displayTable', displayTable) }}
      <div v-if="displayTable == null && isFullTable == true" style="
          display: flex;
          justify-content: center;
          margin-top: 20%;
          margin-bottom: 20%;
        ">
        <LoaderPulse />
      </div>

      <div v-if="displayTable && displayTable.length < 0 && !displayTable[0]['VS USD'] && !isFullTable" style="
          height: 200px;
          left: 50%;
          transform: translateX(-50%);
          position: absolute;
        ">
        <LoaderPulse />
      </div>
      <CTableRow v-if="displayTable && displayTable.length > 0 && !displayTable[0]['VS USD'] && !isFullTable"
        class="file-table-row text-black dark:!text-white" :class="table_bg && rowHeight ? rowHeight : 'file-table-row'"
        v-for="(dataRow, dataRowIndex) in data" :key="`data-row-key-${dataRowIndex}`"
        @click="$emit('table-row-click', dataRow, dataRowIndex)">
        <CTableDataCell scope="row" class="align-middle file-table-cell-container text-black dark:!text-white" v-for="(dataCell, dataCellKey, dataCellIndex) in getDataRow(
          dataRow,
          dataRowIndex,
        )" :key="`file-table-cell-key-${dataCellKey}`">
          <slot :data-cell="dataCell" :data-cell-key="dataCellKey" :data-row-index="dataRowIndex"
            :data-cell-index="dataCellIndex" :token-name="data[dataRowIndex].Name"
            :field-name="headCaptions[dataCellIndex]" />
        </CTableDataCell>


      </CTableRow>
      <CTableRow v-else class="file-table-row" :class="table_bg && rowHeight ? rowHeight : 'file-table-row'"
        v-for="(dataRow, dataRowIndex) in data" :key="`data-row-key1-${dataRowIndex}`"
        @click="$emit('table-row-click', dataRow, dataRowIndex)">
        <CTableDataCell scope="row" class="align-middle file-table-cell-container text-black dark:!text-white" v-for="(dataCell, dataCellKey, dataCellIndex) in getDataRow(
          dataRow,
          dataRowIndex,
        )" :key="`file-table-cell-key-${dataCellKey}`">
          <slot :data-cell="dataCell" :data-cell-key="dataCellKey" :data-row-index="dataRowIndex"
            :data-cell-index="dataCellIndex" :token-name="data[dataRowIndex].Name"
            :field-name="headCaptions[dataCellIndex]" />
        </CTableDataCell>
      </CTableRow>

    </CTableBody>
  </CTable>
</template>

<script setup>
import { defineProps, computed, toRefs } from 'vue'
import Multiselect from 'vue-multiselect'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'

import { ref } from 'vue'

const props = defineProps([
  'data',
  'sortedHeader',
  'table_bg',
  'sortIcons',
  'fontSizeTable',
  'headerDropdownSort',
  'rowHeight',
  'filterableHeaders',
  'header_cells_bg',
  'header_cells_inside',
  'custom_filters',
  'default_head_captions',
  'isFullTable',
  'displayTable'
])
const { filterableHeaders, data, custom_filters, isFullTable, displayTable } = toRefs(props)
const headCaptions = computed(() => data.value && !props.default_head_captions ? Object.getOwnPropertyNames(data.value[0]) : props.default_head_captions ? props.default_head_captions : [])
const custom_filters_keys = computed(() =>
  Object.keys(custom_filters.value ? custom_filters.value : ''),
)

const filterOptions = computed(() =>
  headCaptions.value.map((h) => {
    if (custom_filters_keys.value.includes(h)) {
      return custom_filters.value[h]
    }
    return [
      { name: 'All Time', code: `${h} All Time` },
      { name: '24 H', code: `${h} 24 H` },
      { name: '7 D', code: `${h} 7 D` },
      { name: '30 D', code: `${h} 30 D` },
    ]
  }),
)
const filtersSelected = ref(filterOptions.value.map((h) => h[0]))

const sortSymbol = computed(() => {
  if (!props.sortedHeader || !props.sortedHeader.caption) return ''
  if (props.sortedHeader.direction == 'asc') {
    return '↓'
  }
  return '↑'
})

const getDataRow = (dataRow) => {
  delete dataRow['Blockchain']
  return dataRow
}
</script>
<style lang="scss">
.table_full {
  margin-bottom: 0;
}

.track_info_table {
  overflow-x: visible !important;

  @media (max-width: 1100px) {
    overflow-x: scroll !important;
  }

  &::-webkit-scrollbar-track {
    // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 50px;
    margin-bottom: 10px;
  }

  &::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
    border-radius: 50px;
  }

  &::-webkit-scrollbar-thumb {
    // border: 2px solid #02120a;
    padding: 1px;
    background: #00C9FF;
    border-radius: 20px;
  }
}

.table_small_loading {
  margin-bottom: 200px !important;
}
</style>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

@mixin file-table-cells-max-widths {
  max-width: 100px;

  &:nth-child(1) {
    max-width: 330px;

    @media (max-width: 1200px) {
      max-width: 100%;
    }
  }

  &:nth-child(2) {
    max-width: 100px;

    @media (max-width: 1200px) {
      max-width: 100%;
    }
  }

  &:nth-child(3) {
    max-width: 100px;

    @media (max-width: 1200px) {
      max-width: 100%;
    }
  }

  &:nth-child(4) {
    max-width: 80px;

    @media (max-width: 1200px) {
      max-width: 100%;
    }
  }

  &:nth-child(5) {
    max-width: 80px;

    @media (max-width: 1200px) {
      max-width: 100%;
    }
  }

  &:nth-child(6) {
    max-width: 80px;

    @media (max-width: 1200px) {
      max-width: 100%;
    }
  }

  &:nth-child(9) {
    max-width: 115px;

    @media (max-width: 1200px) {
      max-width: 100%;
    }
  }

  &:nth-child(10) {
    max-width: 90px;

    @media (max-width: 1200px) {
      max-width: 100%;
    }
  }
}

.file-table-header-container_full {
  // color: #ffffff;
  font-size: clamp(10px, 1vw, 14px);
  font-weight: 600;
  text-transform: uppercase;
  padding: 29px 0 29px 0px;
  text-align: center;

  &:not(:first-child) {
    .file-table-header-cell {
      justify-content: center;
    }
  }

  @media (max-width: $xxl) {
    padding: 20px 0 20px 0px;
  }

  &:first-child {
    padding: 29px 0 29px 40px;

    @media (max-width: $xxl) {
      padding: 20px 0 20px 30px;
    }
  }

  &:last-child {
    padding: 29px 20px 29px 10px;

    @media (max-width: $xxl) {
      padding: 20px 10px 20px 10px;
    }
  }

  .file-table-header-cell {
    color: #fff;
    font-size: clamp(10px, 1vw, 14px);
    font-weight: 600;
    //width: fit-content;
    max-width: 100%;
    display: flex;

  }

}

.file-table-header-container {
  white-space: nowrap;
  text-wrap: nowrap;
  // background: #171718;
  border-right: 1px solid #2C2C2C;

  &:last-child {
    border-right: none;
  }

  &:not(:first-child) {
    .file-table-header-cell {
      justify-content: end;
    }
  }

  .file-table-header-cell {
    color: #9299AA;
    font-size: 12px;
    font-weight: 600;
    //width: fit-content;
    max-width: 100%;
    display: flex;
  }
}

.file-table-cell-container {
  width: fit-content;
  white-space: nowrap;

  &:deep(.file-table-cell) {
    font-size: 14px;
    text-align: center;
    font-weight: 400;
    letter-spacing: 0em;
    // color: #ffffff !important;
  }

  :deep(.token-name-container) {
    .short {
      font-size: 14px !important;

      @media (max-width: $xxl) {
        font-size: 10px !important;
      }
    }

    .pair_avatars {
      @media (max-width: $xxl) {
        width: 20px;

        &:not(:first-child) {
          margin-left: -1px;
        }
      }
    }
  }
}


.table_full {
  .file-table-header-cell {
    @media (max-width: $xxl) {
      font-size: 8px !important;
    }
  }

  .file-table-cell-container {
    &:deep(.file-table-cell) {
      @media (max-width: $xxl) {
        font-size: 10px !important;
      }
    }
  }

  .file-table-header-container_full,
  .file-table-cell-container {
    width: 100px;

    @media (max-width: $xxl) {
      width: 50px;
    }

    @media (max-width: $md) {
      width: 95px;
    }

    &:nth-child(1) {
      width: 300px;

      @media (max-width: $xxl) {
        width: 100px;
      }
    }
  }

  .file-table-row {
    border-color: transparent !important;
    height: 54px;
    display: table;
    width: 100%;
    table-layout: fixed;
    // color: white !important;
  }

  .file-table-head {
    display: table;
    width: 100%;
    table-layout: fixed;
    border-bottom: 0.5px solid rgba(163, 164, 165, 0.2196078431)
  }

  .file-table-body {
    display: block;
    overflow-x: auto;
    max-height: 626px;
    overflow-y: auto;

    &::-webkit-scrollbar-track {
      // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 50px;
      margin-bottom: 10px;
    }

    &::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
      background: #02120A;
      border-radius: 50px;
      margin-bottom: 10px;
    }

    &::-webkit-scrollbar-thumb {
      border: 2px solid #02120A;
      background: #00C9FF;
      border-radius: 20px;
    }
  }
}

.table_small {

  .file-table-header-container,
  .file-table-cell-container {
    @include file-table-cells-max-widths;
  }

  .file-table-header-container {
    .file-table-header-cell {
      @media (max-width: 1400px) {
        font-size: 8px !important;
      }
    }

  }

  .file-table-row {
    border-left: 1px solid rgba(44, 44, 44, 0.20);
    border-right: 1px solid rgba(44, 44, 44, 0.20);
    border-bottom: 1px solid rgba(44, 44, 44, 0.20) !important;
    height: 54px;
  }
}

:deep(.multiselect__tags) {
  background: none !important;
  border-color: rgba(0, 0, 0, 0) !important;
  padding: 8px 20px 0 8px !important;
}

:deep(.multiselect__content-wrapper) {
  border-color: #00C9FF !important;
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
  color: #00C9FF !important;
}

:deep(.multiselect__option--selected:hover) {
  color: rgb(229, 83, 83) !important;
  background: rgb(15, 17, 19) !important;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
