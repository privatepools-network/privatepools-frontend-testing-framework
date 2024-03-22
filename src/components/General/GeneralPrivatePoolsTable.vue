<template>
  <div class="table__header">
    <Tabs
      style="margin-right: 15px"
      :selectedTab="activitiesSelectedMode"
      :tabsOptions="activitiesModes"
      @changeTab="changeActivitiesMode"
    ></Tabs>

    <Tabs
      :selectedTab="actSelectedPeriodOfData"
      :tabsOptions="periodsOfData"
      @changeTab="changeActPeriodOfData"
    >
    </Tabs>
  </div>
  <CRow id="pool-activity-row" class="table-wrapper">
    <Table :headers="['Actions', 'Details', 'Value', 'Time']">
      <CTableBody v-if="activities" class="text-white table-body">
        <CTableRow v-for="(item, i) in activities" :key="i" class="table-row">
          <CTableDataCell scope="row" class="text-white table-cell">
            <div class="actions-cell">
              <img v-if="item['Actions'] === 'Deposit'" :src="DepositIcon" />
              <img v-if="item['Actions'] === 'Withdraw'" :src="WithdrawIcon" />
              <img v-if="item['Actions'] === 'Swap'" :src="SwapIcon" />
              <div class="actions-cell__text">
                {{ item['Actions'] }}
              </div>
            </div>
          </CTableDataCell>
          <CTableDataCell scope="row" class="text-white table-cell">
            <div class="details-cell">
              <div
                v-for="(tokenEntry, tokenIndex) in item['Details']"
                class="details-cell__token-entity"
                :key="`activity-token-key-${tokenIndex}`"
              >
                <div
                  v-for="(tokenInfo, tokenInfoIndex) in Object.entries(
                    tokenEntry,
                  )"
                  :class="
                    tokenInfo[0] !== 'action'
                      ? 'details-cell__token-entity'
                      : ''
                  "
                  :key="`activity-token-info-key-${tokenInfoIndex}`"
                >
                  <div
                    v-if="tokenInfo[0] !== 'action'"
                    class="d-flex align-items-center"
                  >
                    <img
                      :src="getTokenEntity(tokenInfo[0], 'short').icon"
                      class="details-cell__token-entity__icon"
                    />
                    <div class="details-cell__token-entity__token-name">
                      {{ tokenInfo[1] }}
                    </div>
                    <div
                      v-if="
                        tokenEntry.action === 'Swap' && tokenInfoIndex === 1
                      "
                      style="margin-left: 10px"
                    >
                   <img :src="swapArrowIcon"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CTableDataCell>
          <CTableDataCell scope="row" class="text-white table-cell">
            <div>
              {{ item['Value'] }}
            </div>
          </CTableDataCell>

          <CTableDataCell scope="row" class="text-white table-cell">
            <div class="time-cell">
              <a
                target="_blank"
                :href="`${
                  configService.getNetworkConfig(item.chainId).explorer
                }/tx/${item.Tx}`"
              >
                {{ item['Time'] }}
                <img :src="linkIcon" />
              </a>
            </div>
          </CTableDataCell>
        </CTableRow>
      </CTableBody>
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
import linkIcon from '@/assets/icons/TableAction/linkIcon.svg'

const props = defineProps(['clActivity', 'wpActivity'])
const { clActivity, wpActivity } = toRefs(props)

const activities = computed(() => {
  let result = []
  if (wpActivity.value) {
    result.push(...getWpActivity())
  }
  if (clActivity.value) {
    result.push(...getClActivity())
  }
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

function getClActivity() {
  let result = []
  let cl_joins = clActivity.value.filter((item) => item.type == 'Join')
  let cl_exits = clActivity.value.filter((item) => item.type == 'Exit')
  let cl_swaps = clActivity.value.filter((item) => item.type == 'Swap')
  console.log('HERE - ', cl_joins)
  result.push(
    ...cl_swaps.map((item) => {
      let out = {
        Actions: 'Swap',
        Details: [
          {
            action: 'Swap',
          },
        ],
        Value: item.amountUSD,
        Time: generateTimeAgoString(item.timestamp),
        Tx: item.transaction.id,
        timestamp: item.timestamp,
        chainId: item.chainId,
      }
      out['Details'][0][item.token0.symbol] = parseFloat(item.amount0).toFixed(
        2,
      )
      out['Details'][0][item.token1.symbol] = parseFloat(item.amount1).toFixed(
        2,
      )
      return out
    }),
  )
  let cl_joinExits = cl_joins.concat(cl_exits)
  result.push(
    ...cl_joinExits.map((item) => {
      let out = {
        Actions: item.type == 'Join' ? 'Deposit' : 'Withdraw',
        Details: [{}],
        Value: parseFloat(item.amountUSD).toFixed(2),
        Time: generateTimeAgoString(item.timestamp),
        Tx: item.transaction.id,
        timestamp: item.timestamp,
        chainId: item.chainId,
      }
      out['Details'][0][item.token0.symbol] = parseFloat(item.amount0).toFixed(
        2,
      )
      out['Details'][0][item.token1.symbol] = parseFloat(item.amount1).toFixed(
        2,
      )
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

const activitiesModes = ['All', 'Deposit', 'Swap', 'Harvest', 'Withdraw']

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
      font-size: 10px;
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
    color: #ffffff;
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
