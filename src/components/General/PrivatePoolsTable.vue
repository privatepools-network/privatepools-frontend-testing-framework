<template>
  <div class="table__header">
    <Tabs style="margin-right: 15px" :selectedTab="activitiesModes[english_names.indexOf(activitiesSelectedMode)]"
      :tabsOptions="activitiesModes" @changeTab="changeActivitiesMode"></Tabs>

    <Tabs :selectedTab="actSelectedPeriodOfData" :tabsOptions="periodsOfData" @changeTab="changeActPeriodOfData">
    </Tabs>
  </div>
  <CRow id="pool-activity-row" class="table-wrapper !mx-0">
    <div v-if="activities.length === 0" class="!bg-[white] dark:!bg-[#fff0]  backdrop-blur-md h-[500px]">
      <LoaderPulse />
    </div>
    <Table v-else-if="activities.length !== 0"
      :headers="activitiesSelectedMode === 'Trade' || activitiesSelectedMode === 'All' ? [t('actions'), t('details'), t('value'), t('profits'), t('time')] 
      : [t('actions'), t('details'), t('value'), t('time')]">
      <CTableBody v-if="activities" class="text-black dark:!text-white"
        :class="isDark ? 'table-body' : 'table-body-light'">
        <CTableRow v-for="(item, i) in activities.slice(0, sliceNumber)" :key="i" class="table-row">
          <CTableDataCell scope="row" class="text-black dark:!text-white table-cell">
            <div class="actions-cell">
              <img v-if="item['Actions'] === 'Deposit'" :src="DepositIcon" />
              <img v-if="item['Actions'] === 'Withdraw'" :src="WithdrawIcon" />
              <img v-if="item['Actions'] === 'Trade'" :src="SwapIcon" />
              <div class="actions-cell__text text-black dark:!text-white">
                {{ item['Actions'] }}
              </div>
            </div>
          </CTableDataCell>
          <CTableDataCell scope="row" class="text-black dark:!text-white table-cell">
            <div class="details-cell">
              <div v-for="(tokenEntry, tokenIndex) in item['Details']" class="details-cell__token-entity"
                :key="`activity-token-key-${tokenIndex}`">
                <div v-for="(tokenInfo, tokenInfoIndex) in Object.entries(
                  tokenEntry,
                )" :class="tokenInfo[0] !== 'action'
                      ? 'details-cell__token-entity'
                      : ''
                    " :key="`activity-token-info-key-${tokenInfoIndex}`">
                  <div v-if="tokenInfo[0] !== 'action'" class="d-flex align-items-center">
                    <img :src="getTokenEntity(tokenInfo[0], 'short').icon" class="details-cell__token-entity__icon" />
                    <div class="details-cell__token-entity__token-name font-['Roboto_Mono',_monospace]">
                      {{ trimZeros(tokenInfo[1]) }}
                    </div>
                    <div v-if="
                      tokenEntry.action === 'Swap' && tokenInfoIndex === 1
                    " style="margin-left: 10px">
                      <img :src="swapArrowIcon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CTableDataCell>



          <CTableDataCell scope="row" class="text-black dark:!text-white table-cell ">
            <div class="font-['Roboto_Mono',_monospace] flex items-center">
              {{ console.log('111111',  item['Value']) }}
              <CurrencySymbol />{{
                item[`Value${currentCurrency == "USD" ? "" : "_" +
                currentCurrency}`] === '-' ? '-' :
                trimZeros(item[`Value${currentCurrency == "USD" ? "" : "_" + currentCurrency}`]) }}
            </div>
          </CTableDataCell>



          <CTableDataCell v-if="activitiesSelectedMode === 'Trade' || activitiesSelectedMode === 'All'" scope="row"
            class="text-black dark:!text-white table-cell ">
            <div class="font-['Roboto_Mono',_monospace] flex  items-center">
              <CurrencySymbol />{{
              item[`Profits${currentCurrency == "USD" ? "" : "_" +
                currentCurrency}`] === undefined ? '-' :
              trimZeros(parseFloat(item[`Profits${currentCurrency == "USD" ? "" : "_" +
                currentCurrency}`]).toFixed(currencyDecimals)) }}
            </div>
          </CTableDataCell>



          <CTableDataCell scope="row" class="text-black dark:!text-white table-cell">
            <div class="time-cell">
              <a target="_blank" :href="`${configService.getNetworkConfig(item.chainId).explorer
                }/tx/${item.Tx}`" class="flex items-center gap-1 text-black dark:!text-white">
                {{ moment.unix(item['timestamp']).format('L, LTS') }}
                <div class="w-[14px] h-[14px]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.5068 7.58333V11.0833C10.5068 11.3928 10.3839 11.6895 10.1651 11.9083C9.94633 12.1271 9.64959 12.25 9.34017 12.25H2.9235C2.61408 12.25 2.31734 12.1271 2.09854 11.9083C1.87975 11.6895 1.75684 11.3928 1.75684 11.0833V4.66667C1.75684 4.35725 1.87975 4.0605 2.09854 3.84171C2.31734 3.62292 2.61408 3.5 2.9235 3.5H6.4235"
                      stroke="#00e0ff" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8.75684 1.75H12.2568V5.25" stroke="#00e0ff" stroke-width="1.16667" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M5.83984 8.16667L12.2565 1.75" stroke="#00e0ff" stroke-width="1.16667"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </a>
            </div>
          </CTableDataCell>
        </CTableRow>
        <div v-if="sliceNumber < activities.length" @click="activities.slice(0, (sliceNumber = sliceNumber + 5))"
          class="load_more text-black dark:!text-white">
          {{ $t('load_more') }}
          <img :src="arrow_bottom" class="!border-b-0 !p-0" />
        </div>
      </CTableBody>
    </Table>
    <div v-else class="d-flex flex-column gap-2 justify-content-center align-items-center h-100 py-20">
      <div class="text-black dark:!text-white" style="font-size: 14px; text-align: center">
        No Activity yet
      </div>
      <div class="text-black dark:!text-white" style="font-size: 12px; text-align: center">
        Choose a pool to invest or create a pool to get started.
      </div>
      <div class="add_liq_btn_pools">
        <div class="d-flex gap-1">+ Add liquidity</div>
      </div>
    </div>
  </CRow>

  <!-- <Pagination :perPage="perPage" :pools="activities" :currentPage="currentPage" @changePage="changePage"
    @changePerPage="changePerPage" :perPageOptions="[25, 50, 100]"></Pagination> -->
</template>
<script setup>
import Tabs from '@/UI/Tabs'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import Table from '@/UI/Table'
import { ref, defineProps, computed, toRefs } from 'vue'
import { getTokenEntity } from '@/lib/helpers/util'
import { generateTimeAgoString, trimZeros } from '@/lib/utils'
import { configService } from '@/services/config/config.service'
import DepositIcon from '@/assets/icons/TableAction/DepositIcon.svg'
import WithdrawIcon from '@/assets/icons/TableAction/WithdrawIcon.svg'
import SwapIcon from '@/assets/icons/TableAction/SwapIcon.svg'
import swapArrowIcon from '@/assets/icons/TableAction/swapArrowIcon.svg'
import { useDark } from '@vueuse/core'
import Pagination from '../Pool/Pagination.vue'
import { t } from 'i18next'
import arrow_bottom from '@/assets/icons/arrow/arrow_loadmore.svg'
import moment from 'moment'
import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'
import router from '@/router'
import CurrencySymbol from '@/components/TrackInfo/CurrencySymbol.vue'
const settingsStore = useSettings()

const { currentCurrency } = storeToRefs(settingsStore)
const currencyDecimals = computed(() => currentCurrency.value == "USD" ? 3 : 5)
const isDark = useDark()

const props = defineProps(['clActivity', 'wpActivity', 'all_activities'])
const sliceNumber = ref(10)
const activities = computed(() => {
  let result = props.all_activities ?? []
  console.log('HERE', props.all_activities)

  let now = Date.now() / 1000
  let filtered_time_ago = now - actSelectedPeriodOfData.value.number
  return result
    .filter(
      (item) =>
        activitiesSelectedMode.value == 'All' ||
        activitiesSelectedMode.value == item.Actions,
    )
    .filter((item) => item.timestamp >= filtered_time_ago)
    .sort((a, b) => b.timestamp - a.timestamp)
})

const perPage = ref(25)
const currentPage = ref(1)

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

const periodsOfData = [
  {
    number: 86400,
    title: '24H',
  },
  {
    number: 604800,
    title: '7D',
  },
  {
    number: 2592000,
    title: '1M',
  },
  {
    number: 31536000,
    title: '1Y',
  },
  {
    number: 3153600000,
    title: t('all_time'),
  },
]

const english_names = router.currentRoute.value.path === '/portfolio' ? ['All', 'Deposit', "Withdraw",] : ['All', 'Deposit', "Trade", "Withdraw",]
const activitiesModes = router.currentRoute.value.path === '/portfolio' ? [t('all'), t('deposit'), t('withdraw')] : [t('all'), t('deposit'), t('trade'), t('withdraw')]

const activitiesSelectedMode = ref(english_names[0])
const actSelectedPeriodOfData = ref(periodsOfData[4])

function changeActivitiesMode(_new) {
  activitiesSelectedMode.value = english_names[activitiesModes.indexOf(_new)]
}

function changeActPeriodOfData(_new) {
  actSelectedPeriodOfData.value = _new
}
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

@mixin cells-widths {
  width: 150px;

  @media (max-width: $xxl) {
    width: 100px;
  }

  &:nth-child(1) {
    width: 200px;

    @media (max-width: $xxl) {
      width: 130px;
    }
  }

  &:nth-child(2) {
    width: 300px !important;

    @media (max-width: $xxl) {
      width: 200px !important;
    }
  }
}

:deep(.table-header-font-folder) {
  text-align: left !important;
  @include cells-widths;
}

.table {
  &__header {
    display: flex;
    margin-bottom: 18px;
    @media (max-width: $md) {
      flex-direction: column;
      gap: 10px;
    }
  }

  &-body-light {
    display: block;
    // max-height: 500px;
    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
      background-color: #ffffff;
      border-radius: 50px;
      margin-bottom: 10px;
    }

    &::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
      background: #ffffff;
      border-radius: 50px;
    }

    &::-webkit-scrollbar-thumb {
      border: 1px solid #02120a71;
      background: #00c9ff;
      border-radius: 21px;
    }
  }

  &-body {
    display: block;
    // max-height: 500px;
    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
      background-color: #02120a;
      border-radius: 50px;
      margin-bottom: 10px;
    }

    &::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
      background: #02120a;
      border-radius: 50px;
    }

    &::-webkit-scrollbar-thumb {
      border: 2px solid #02120a;
      background: #00c9ff;
      border-radius: 21px;
    }
  }

  &-wrapper {
    padding: 0;
    outline: 0.5px solid rgba(163, 164, 165, 0.2196078431);
    width: 100%;
    overflow-x: auto;
    margin-bottom: 30px;
    border-radius: 15.289px;
    background: #22222224;
    box-shadow: 0px 4px 4px 0px #00000040;
    border: 1px solid #ffffff0d;
  }

  &-row {
    border-color: transparent;
    width: 100%;
    display: table;
    table-layout: fixed;
  }

  &-cell {
    padding: 24px 0 24px 10px !important;
    width: fit-content;
    font-weight: 400;
    white-space: nowrap;
    font-size: 14px;
    overflow: visible;
    @include cells-widths;

    @media (max-width: $xxl) {
      font-size: clamp(10px, 1vw, 14px);
      padding: 12px 0 12px 10px !important;
    }

    &:first-child {
      padding: 24px 0 24px 45px !important;
      text-align: left;

      @media (max-width: $xxl) {
        padding: 12px 0 12px 15px !important;
      }
    }

    &:last-child {
      padding: 24px 10px 24px 10px !important;

      @media (max-width: $xxl) {
        padding: 12px 10px 12px 10px !important;
      }
    }
  }
}

.actions-cell {
  display: flex;
  align-items: center;

  &__text {
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    letter-spacing: 0em;
    // color: #ffffff;
    margin-left: 12px;

    @media (max-width: $xxl) {
      font-size: 12px;
    }
  }
}

.details-cell {
  display: flex;
  flex-wrap: wrap;

  &__token-entity {
    display: flex;

    &:not(:last-child) {
      margin-right: 12px;
    }

    &__icon {
      height: 20px;
      width: 20px;
      margin-right: 8px;

      @media (max-width: $xxl) {
        margin-right: 4px;
      }
    }
  }
}
</style>
