<template>
  <div class="table__header">
    <Tabs style="margin-right: 15px" :selectedTab="activitiesSelectedMode" :tabsOptions="activitiesModes"
      @changeTab="changeActivitiesMode"></Tabs>

    <Tabs :selectedTab="actSelectedPeriodOfData" :tabsOptions="periodsOfData" @changeTab="changeActPeriodOfData">
    </Tabs>
  </div>
  <CRow id="pool-activity-row" class="table-wrapper" style="border-radius: 15.289px;
background: #22222224;
box-shadow: 0px 4px 4px 0px #00000040;

border: 1px solid #FFFFFF0D;">
    <Table :headers="['Actions', 'Details', 'Value', 'Time']">
      <CTableBody v-if="activities" class="text-white table-body">
        <CTableRow v-for="(item, i) in activities" :key="i" class="table-row">
          <CTableDataCell scope="row" class="text-white table-cell">
            <div class="actions-cell">
              <svg v-if="item['Actions'] === 'Deposit'" width="16" height="16" viewBox="0 0 16 16" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1253_7764)">
                  <path d="M8 3.33325V12.6666" stroke="#00FC02" stroke-width="1.33333" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M3.3335 8H12.6668" stroke="#00FC02" stroke-width="1.33333" stroke-linecap="round"
                    stroke-linejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_1253_7764">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <svg v-if="item['Actions'] === 'Withdraw'" width="16" height="16" viewBox="0 0 16 16" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1253_7859)">
                  <path d="M3.3335 8H12.6668" stroke="#00C9FF" stroke-width="1.33333" stroke-linecap="round"
                    stroke-linejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_1253_7859">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <svg v-if="item['Actions'] === 'Swap'" width="12" height="16" viewBox="0 0 12 16" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.2512 0.0679535C9.34907 0.124692 9.42481 0.212943 9.46604 0.318291C9.50727 0.423639 9.51156 0.539855 9.4782 0.647953L7.6772 6.49995H11.0002C11.0979 6.49991 11.1934 6.52847 11.275 6.5821C11.3566 6.63574 11.4207 6.71209 11.4594 6.80175C11.4981 6.8914 11.5098 6.99043 11.4928 7.08661C11.4759 7.18278 11.4312 7.2719 11.3642 7.34295L3.3642 15.843C3.28679 15.9253 3.18379 15.9789 3.07197 15.9952C2.96016 16.0115 2.84613 15.9894 2.74847 15.9326C2.65081 15.8757 2.57528 15.7875 2.53419 15.6822C2.4931 15.577 2.48887 15.4609 2.5222 15.353L4.3232 9.49995H1.0002C0.902544 9.49999 0.807016 9.47143 0.725405 9.4178C0.643795 9.36417 0.579677 9.28782 0.540965 9.19816C0.502253 9.10851 0.490642 9.00948 0.507566 8.9133C0.52449 8.81712 0.569208 8.72801 0.636199 8.65695L8.6362 0.156953C8.71351 0.0747526 8.81636 0.0211221 8.92802 0.00478201C9.03967 -0.011558 9.15357 0.0103533 9.2512 0.0669535V0.0679535ZM2.1572 8.49995H5.0002C5.07845 8.49994 5.15561 8.51829 5.22547 8.55353C5.29533 8.58877 5.35595 8.63991 5.40245 8.70285C5.44895 8.76578 5.48002 8.83875 5.49318 8.91588C5.50633 8.99302 5.5012 9.07216 5.4782 9.14695L4.1102 13.59L9.8422 7.49995H7.0002C6.92195 7.49997 6.84479 7.48162 6.77493 7.44638C6.70506 7.41114 6.64445 7.36 6.59795 7.29706C6.55145 7.23413 6.52038 7.16116 6.50722 7.08402C6.49406 7.00689 6.49919 6.92774 6.5222 6.85295L7.8902 2.40995L2.1572 8.49995Z"
                  fill="#00C9FF" />
              </svg>

              <div class="actions-cell__text">
                {{ item['Actions'] }}
              </div>
            </div>
          </CTableDataCell>
          <CTableDataCell scope="row" class="text-white table-cell">
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
                      <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12.179 14.3137C11.9207 14.0553 11.7967 13.7432 11.807 13.3772C11.8182 13.0112 11.953 12.6991 12.2113 12.4407L15.8603 8.79178H1.45817C1.0922 8.79178 0.785212 8.66778 0.537212 8.41978C0.290074 8.17264 0.166504 7.86609 0.166504 7.50011C0.166504 7.13414 0.290074 6.82716 0.537212 6.57916C0.785212 6.33202 1.0922 6.20845 1.45817 6.20845H15.8603L12.179 2.5272C11.9207 2.26886 11.7915 1.96188 11.7915 1.60624C11.7915 1.25146 11.9207 0.944905 12.179 0.686572C12.4373 0.428239 12.7443 0.299072 13.1 0.299072C13.4547 0.299072 13.7613 0.428239 14.0196 0.686572L19.929 6.59595C20.0582 6.72511 20.1499 6.86504 20.2041 7.01574C20.2575 7.16643 20.2842 7.32789 20.2842 7.50011C20.2842 7.67234 20.2575 7.83379 20.2041 7.98449C20.1499 8.13518 20.0582 8.27511 19.929 8.40428L13.9873 14.3459C13.7505 14.5828 13.4547 14.7012 13.1 14.7012C12.7443 14.7012 12.4373 14.572 12.179 14.3137Z"
                          fill="#00C9FF" />
                      </svg>
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
              <a target="_blank" :href="`${configService.getNetworkConfig(item.chainId).explorer}/tx/${item.Tx}`">
                {{ item['Time'] }}
                <svg width=" 14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_1904_34599)">
                    <path
                      d="M10.5 7.58333V11.0833C10.5 11.3928 10.3771 11.6895 10.1583 11.9083C9.9395 12.1271 9.64275 12.25 9.33333 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V4.66667C1.75 4.35725 1.87292 4.0605 2.09171 3.84171C2.3105 3.62292 2.60725 3.5 2.91667 3.5H6.41667"
                      stroke="white" stroke-opacity="0.5" stroke-width="1.16667" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M8.75 1.75H12.25V5.25" stroke="white" stroke-opacity="0.5" stroke-width="1.16667"
                      stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.83301 8.16667L12.2497 1.75" stroke="white" stroke-opacity="0.5" stroke-width="1.16667"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1904_34599">
                      <rect width="14" height="14" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
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
import LoaderPulse from '../loaders/LoaderPulse.vue';
import Table from '@/UI/Table'
import { ref, defineProps, computed, toRefs } from 'vue'
import { getTokenEntity } from '@/lib/helpers/util';
import { generateTimeAgoString } from '@/lib/utils';
import { configService } from '@/services/config/config.service'

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
  return result.filter((item) => activitiesSelectedMode.value == 'All' || activitiesSelectedMode.value == item.Actions).filter((item) => item.timestamp >= filtered_time_ago).sort((a, b) => b.timestamp - a.timestamp)
})

function getWpActivity() {
  let result = []
  let wp_joins = wpActivity.value.filter((item) => item.type == 'Join')
  let wp_exits = wpActivity.value.filter((item) => item.type == 'Exit')
  let wp_swaps = wpActivity.value.filter((item) => item.type == 'Swap')
  console.log("HERE - ", wp_joins)
  result.push(...wp_swaps.map((item) => {
    let out = {
      "Actions": "Swap",
      "Details": [
        {
          "action": "Swap",
        }
      ],
      "Value": 0,
      "Time": generateTimeAgoString(item.timestamp),
      "Tx": item.tx,
      "timestamp": item.timestamp,
      chainId: item.chainId
    }
    out['Details'][0][item.tokenInSym] = parseFloat(item.tokenAmountIn).toFixed(2)
    out['Details'][0][item.tokenOutSym] = parseFloat(item.tokenAmountOut).toFixed(2)
    return out
  }))
  let wp_joinExits = wp_joins.concat(wp_exits)
  result.push(...wp_joinExits.map((item) => {
    let out = {
      "Actions": item.type == "Join" ? "Deposit" : "Withdraw",
      "Details": [{}],
      "Value": parseFloat((item.valueUSD)).toFixed(2),
      "Time": generateTimeAgoString(item.timestamp),
      "Tx": item.tx,
      "timestamp": item.timestamp,
      chainId: item.chainId,
    }
    for (let i = 0; i < item.pool.tokens.length; i++) {
      out['Details'][0][item.pool.tokens[i].symbol] = parseFloat(item.amounts[i]).toFixed(2)
    }
    return out
  }))
  return result
}

function getClActivity() {
  let result = []
  let cl_joins = clActivity.value.filter((item) => item.type == 'Join')
  let cl_exits = clActivity.value.filter((item) => item.type == 'Exit')
  let cl_swaps = clActivity.value.filter((item) => item.type == 'Swap')
  console.log("HERE - ", cl_joins)
  result.push(...cl_swaps.map((item) => {
    let out = {
      "Actions": "Swap",
      "Details": [
        {
          "action": "Swap",
        }
      ],
      "Value": item.amountUSD,
      "Time": generateTimeAgoString(item.timestamp),
      "Tx": item.transaction.id,
      "timestamp": item.timestamp,
      chainId: item.chainId,
    }
    out['Details'][0][item.token0.symbol] = parseFloat(item.amount0).toFixed(2)
    out['Details'][0][item.token1.symbol] = parseFloat(item.amount1).toFixed(2)
    return out
  }))
  let cl_joinExits = cl_joins.concat(cl_exits)
  result.push(...cl_joinExits.map((item) => {
    let out = {
      "Actions": item.type == "Join" ? "Deposit" : "Withdraw",
      "Details": [{}],
      "Value": parseFloat((item.amountUSD)).toFixed(2),
      "Time": generateTimeAgoString(item.timestamp),
      "Tx": item.transaction.id,
      "timestamp": item.timestamp,
      chainId: item.chainId,
    }
    out['Details'][0][item.token0.symbol] = parseFloat(item.amount0).toFixed(2)
    out['Details'][0][item.token1.symbol] = parseFloat(item.amount1).toFixed(2)
    return out
  }))
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
      background: #00C9FF;
      border-radius: 21px;
    }
  }

  &-wrapper {
    padding: 0;
    border-radius: 20px;
    outline: 0.5px solid rgba(163, 164, 165, 0.2196078431);
    background: transparent;
    width: 100%;
    overflow-x: auto;
    margin-bottom: 30px;
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