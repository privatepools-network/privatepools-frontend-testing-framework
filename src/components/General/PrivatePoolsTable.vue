<template>
  <div class="table__header">
    <Tabs style="margin-right: 15px" :selectedTab="activitiesSelectedMode" :tabsOptions="activitiesModes"
      @changeTab="changeActivitiesMode"></Tabs>

    <Tabs :selectedTab="actSelectedPeriodOfData" :tabsOptions="periodsOfData" @changeTab="changeActPeriodOfData">
    </Tabs>
  </div>


  <CRow id="pool-activity-row" class="table-wrapper">
    <Table :headers="['Actions', 'Details', 'Value', 'Time']">
      <CTableBody v-if="activities" class="text-black dark:!text-white"
        :class="isDark ? 'table-body' : 'table-body-light'">
        <CTableRow v-for="(item, i) in activities" :key="i" class="table-row">
          <CTableDataCell scope="row" class="text-black dark:!text-white table-cell">
            <div class="actions-cell">
              <img v-if="item['Actions'] === 'Deposit'" :src="DepositIcon" />
              <img v-if="item['Actions'] === 'Withdraw'" :src="WithdrawIcon" />
              <img v-if="item['Actions'] === 'Swap'" :src="SwapIcon" />
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
                    <div class="details-cell__token-entity__token-name">
                      {{ tokenInfo[1] }}
                    </div>
                    <div v-if="tokenEntry.action === 'Swap' && tokenInfoIndex === 1
      " style="margin-left: 10px">
                      <img :src="swapArrowIcon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CTableDataCell>
          <CTableDataCell scope="row" class="text-black dark:!text-white table-cell">
            <div>
              {{ item['Value'] }}
            </div>
          </CTableDataCell>

          <CTableDataCell scope="row" class="text-black dark:!text-white table-cell">
            <div class="time-cell">
              <a target="_blank" :href="`${configService.getNetworkConfig(item.chainId).explorer
      }/tx/${item.Tx}`" class="flex items-center gap-1 text-black dark:!text-white">
                {{ item['Time'] }}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.5068 7.58333V11.0833C10.5068 11.3928 10.3839 11.6895 10.1651 11.9083C9.94633 12.1271 9.64959 12.25 9.34017 12.25H2.9235C2.61408 12.25 2.31734 12.1271 2.09854 11.9083C1.87975 11.6895 1.75684 11.3928 1.75684 11.0833V4.66667C1.75684 4.35725 1.87975 4.0605 2.09854 3.84171C2.31734 3.62292 2.61408 3.5 2.9235 3.5H6.4235"
                    stroke="#00e0ff" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M8.75684 1.75H12.2568V5.25" stroke="#00e0ff" stroke-width="1.16667" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M5.83984 8.16667L12.2565 1.75" stroke="#00e0ff" stroke-width="1.16667" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </a>
            </div>
          </CTableDataCell>
        </CTableRow>
      </CTableBody>
      <div v-else-if="activities.length === 0"
        class="d-flex flex-column gap-2 justify-content-center align-items-center h-100 py-20">
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
      <div v-else style="height: 500px">
        <LoaderPulse></LoaderPulse>
      </div>
    </Table>
  </CRow>
</template>
<script setup>
import Tabs from '@/UI/Tabs'
import LoaderPulse from '../loaders/LoaderPulse.vue'
import Table from '@/UI/Table'
import { ref, defineProps, computed, toRefs } from 'vue'
import { getTokenEntity } from '@/lib/helpers/util'
import { generateTimeAgoString } from '@/lib/utils'
import { configService } from '@/services/config/config.service'
import DepositIcon from '@/assets/icons/TableAction/DepositIcon.svg'
import WithdrawIcon from '@/assets/icons/TableAction/WithdrawIcon.svg'
import SwapIcon from '@/assets/icons/TableAction/SwapIcon.svg'
import swapArrowIcon from '@/assets/icons/TableAction/swapArrowIcon.svg'
import { useDark } from '@vueuse/core'

const isDark = useDark()

const props = defineProps(['clActivity', 'wpActivity', 'all_activities'])
const { clActivity, wpActivity } = toRefs(props)

const activities = computed(() => {
  let result = props.all_activities ?? []
  console.log("HERE" - props.all_activities)
  // if (wpActivity.value) {
  //   result.push(...getWpActivity())
  // }
  // if (clActivity.value) {
  //   result.push(...clActivity.value)
  // }
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

function getWpActivity() {
  let result = []
  let wp_joins = wpActivity.value.filter((item) => item.type == 'Join')
  let wp_exits = wpActivity.value.filter((item) => item.type == 'Exit')
  let wp_swaps = wpActivity.value.filter((item) => item.type == 'Swap')
  console.log('HERE - ', wp_joins)
  result.push(
    ...wp_swaps.map((item) => {
      let out = {
        Actions: 'Swap',
        Details: [
          {
            action: 'Swap',
          },
        ],
        Value: 0,
        Time: generateTimeAgoString(item.timestamp),
        Tx: item.tx,
        timestamp: item.timestamp,
        chainId: item.chainId,
      }
      out['Details'][0][item.tokenInSym] = parseFloat(
        item.tokenAmountIn,
      ).toFixed(2)
      out['Details'][0][item.tokenOutSym] = parseFloat(
        item.tokenAmountOut,
      ).toFixed(2)
      return out
    }),
  )
  let wp_joinExits = wp_joins.concat(wp_exits)
  result.push(
    ...wp_joinExits.map((item) => {
      let out = {
        Actions: item.type == 'Join' ? 'Deposit' : 'Withdraw',
        Details: [{}],
        Value: parseFloat(item.valueUSD).toFixed(2),
        Time: generateTimeAgoString(item.timestamp),
        Tx: item.tx,
        timestamp: item.timestamp,
        chainId: item.chainId,
      }
      for (let i = 0; i < item.pool.tokens.length; i++) {
        out['Details'][0][item.pool.tokens[i].symbol] = parseFloat(
          item.amounts[i],
        ).toFixed(2)
      }
      return out
    }),
  )
  return result
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
    title: 'All Time',
  },
]

const activitiesModes = ['All', 'Deposit', 'Trades', 'Harvest', 'Withdraw']

const activitiesSelectedMode = ref(activitiesModes[0])
const actSelectedPeriodOfData = ref(periodsOfData[4])

function changeActivitiesMode(_new) {
  activitiesSelectedMode.value = _new
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
    width: 600px;

    @media (max-width: $xxl) {
      width: 300px;
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
  }

  &-body-light {
    display: block;
    max-height: 500px;
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
    max-height: 500px;
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
