<template>
  <CRow class="d-flex align-items-center">
    <div class="text-white fw-bold fs-4 mb-1">My Investment</div>
    <div class="portfolio-investment">
      <div class="portfolio-stats">

        <div class="portfolio-stats__el">
          <CAvatar size="md" v-for="(tokenEntity, tokenEntityIndex) in tokenEntities"
            :key="`token-entity-key-${tokenEntityIndex}`" :src="tokenEntity.icon" />
          <div class="portfolio-stats__info">
            <div class="portfolio-stats__title">
              <div class="short text-white">
                {{ tokenEntities.map((tokenEntity) => tokenEntity.short).join('/') }}
              </div>
            </div>
            <div class="portfolio-stats__amount portfolio-stats__amount_success">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                <path d="M6 0L11.1962 9H0.803848L6 0Z" fill="#2DC24E" />
              </svg>
              <span>10.52% ({{ formatBalanceVariation(627.82) }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="portfolio mt-1">
      <div class="portfolio-header">
        <div class="portfolio-header__title">
          <span>Current Investment</span>
          <svg @click="isBalanceHidden = !isBalanceHidden" xmlns="http://www.w3.org/2000/svg" width="14" height="11"
            viewBox="0 0 14 11" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M6.99995 3.84912C6.08658 3.84912 5.34912 4.58658 5.34912 5.49995C5.34912 6.41333 6.08658 7.15079 6.99995 7.15079C7.91333 7.15079 8.65079 6.41333 8.65079 5.49995C8.65079 4.58658 7.91333 3.84912 6.99995 3.84912ZM4.47412 5.49995C4.47412 4.10333 5.60333 2.97412 6.99995 2.97412C8.39658 2.97412 9.52579 4.10333 9.52579 5.49995C9.52579 6.89658 8.39658 8.02579 6.99995 8.02579C5.60333 8.02579 4.47412 6.89658 4.47412 5.49995Z"
              fill="#E1E1E1" />
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M1.31678 3.74815C2.71148 1.55577 4.75525 0.232422 6.99991 0.232422C9.24466 0.232422 11.2885 1.55589 12.6832 3.74844C13.0011 4.2468 13.1453 4.88518 13.1453 5.49701C13.1453 6.10883 13.0011 6.74721 12.6832 7.24557C11.2885 9.43812 9.24466 10.7616 6.99991 10.7616C4.75516 10.7616 2.7113 9.43812 1.3166 7.24557C0.998695 6.74721 0.854492 6.10883 0.854492 5.49701C0.854492 4.88506 0.99875 4.24656 1.31678 3.74815ZM6.99991 1.10742C5.12633 1.10742 3.33185 2.21062 2.05489 4.21807L2.05452 4.21865C1.84768 4.5427 1.72949 5.00657 1.72949 5.49701C1.72949 5.98745 1.84768 6.45131 2.05452 6.77537L2.05489 6.77594C3.33185 8.78339 5.12633 9.88659 6.99991 9.88659C8.87349 9.88659 10.668 8.78339 11.9449 6.77594L11.9453 6.77537C12.1521 6.45131 12.2703 5.98745 12.2703 5.49701C12.2703 5.00657 12.1521 4.5427 11.9453 4.21865L11.9449 4.21807C10.668 2.21062 8.87349 1.10742 6.99991 1.10742Z"
              fill="#E1E1E1" />
          </svg>
        </div>
        <div class="portfolio-header__balance" v-if="isBalanceHidden == false">
          ${{ formattedBalance }}
        </div>
        <div class="portfolio-header__balance" v-else>
          ${{ hiddenBalance }}
        </div>

        <div class="portfolio-header__variation">
          <div class="portfolio-header__variation-amount"
            :class="{ 'text-danger': balanceVariation < 0, 'text-success': balanceVariation >= 0 }">
            {{ formattedBalanceVariation }} ({{ balanceVariationInPercents }}%)
          </div>
          <div class="portfolio-header__variation-period">
            24H
          </div>
        </div>
      </div>
      <div class="portfolio-stats">
        <div class="portfolio-stats__el">
          <div class="portfolio-stats__info">
            <div class="portfolio-stats__title">
              All time profit
            </div>
            <div class="portfolio-stats__amount portfolio-stats__amount_success">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                <path d="M6 0L11.1962 9H0.803848L6 0Z" fill="#2DC24E" />
              </svg>
              <span>2.52% ({{ formatBalanceVariation(324.84) }})</span>
            </div>
          </div>
        </div>
      </div>
      <div class="portfolio-tabs">
        <div class="portfolio-tabs__el" :class="{ 'portfolio-tabs__el_active': activeTab == 0 }" @click="activeTab = 0">
          Chart
        </div>
        <div class="portfolio-tabs__el" :class="{ 'portfolio-tabs__el_active': activeTab == 1 }" @click="activeTab = 1">
          Statistics
        </div>
        <div class="portfolio-tabs__el" :class="{ 'portfolio-tabs__el_active': activeTab == 2 }" @click="activeTab = 2">
          Finacial Statement
        </div>
      </div>
      <div class="portfolio-chart" v-if="activeTab == 0">
        chart
      </div>
      <div class="portfolio-statistics mb-4" v-if="activeTab == 1">
        <div class="portfolio-statistics__el">
          <StatisticCard :data="DradownsMOCK" :title="'Drawdowns'"></StatisticCard>
          <StatisticCard :data="riskMetricsMOCK" :title="'Risk Metrics'"></StatisticCard>
          <StatisticCard :data="profitsMOCK" :title="'Profits'"></StatisticCard>
        </div>

        <div class="portfolio-statistics__el">
          <StatisticTable :data="APR_MOCK" :title="'ROI'"></StatisticTable>
          <StatisticTable :data="ROI_MOCK" :title="'APR'"></StatisticTable>
        </div>
        <div class="portfolio-statistics__el">
          <StatisticDonunChart :data="pairsBreakdownChartMOCK"></StatisticDonunChart>
          <StatisticDonunChart :data="assetsBreakdownChartMOCK"></StatisticDonunChart>
        </div>

      </div>
      <div class="portfolio-financial-statement">
        <FinancialStatement v-if="activeTab == 2"></FinancialStatement>
      </div>
      <div class="portfolio-table">
        <div class="text-white fw-medium fs-4 mb-3">Pool Investment</div>
        <div class="portfolio-table__header">
          <div class="portfolio-table__header__left">
            <div class="portfolio-table__filter">
              <div class="portfolio-table__filter__el"
                :class="{ 'portfolio-table__filter__el_active': selectedPeriodOfData.number == item.number }"
                @click="selectedPeriodOfData = item, sortedHeader = {}" v-for="item in periodsOfData" :key="item.number">
                {{ item.title }}
              </div>

            </div>
          </div>
          <div class="portfolio-table__dropdown">
            <div class="portfolio-table__dropdown__title"
              :class="{ 'portfolio-table__dropdown__title_active': isColumnsOpened }"
              @click="isColumnsOpened = !isColumnsOpened">
              <span>
                Columns
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="9" height="6" viewBox="0 0 9 6" fill="none">
                <path d="M7.89258 4.64893L4.59508 1.35143L1.29758 4.64893" stroke="#FAFAFA" stroke-width="1.64844"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="portfolio-table__dropdown__wrapper" v-if="isColumnsOpened">
              <div class="portfolio-table__dropdown__option"
                :class="{ 'portfolio-table__dropdown__option_active': item.isSelected }" v-for="item in filterOptions"
                :key="item.title" @click="item.isSelected = !item.isSelected">
                {{ item.title }}
                <svg v-if="item.isSelected" xmlns="http://www.w3.org/2000/svg" width="10" height="7" viewBox="0 0 10 7"
                  fill="none">
                  <path
                    d="M3.20625 6.76406L0 3.55781L0.801563 2.75625L3.20625 5.16094L8.36719 0L9.16875 0.801563L3.20625 6.76406Z"
                    fill="#F8F8F8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="portfolio-table__wrapper">
          <DataTable v-if="filteredPools.length > 0" :data="filteredPools" :table_bg="'bg-primary'"
            @table-header-click="onDatatableHeaderClick" :sortedHeader="sortedHeader">
            <template v-slot:default="{ dataCell, dataCellKey /*, tokenName, fieldName*/ }">
              <div v-if="dataCellKey === 'Name' || filterOptions[dataCellKey].isSelected">
                <DataTableCellTokenNamePaired v-if="dataCellKey === 'Name'" :value="dataCell" />
                <div v-else-if="dataCellKey === '% Of Pool'" class="text-truncate file-table-cell"
                  data-coreui-toggle="tooltip" data-coreui-placement="left" :title="dataCell">
                  <div v-if="dataCell.variation < 0">
                    {{ dataCell.amount }}% <span class="text-danger">{{ dataCell.variation }}%</span>
                  </div>
                  <div v-else>
                    {{ dataCell.amount }}% <span class="text-success">+{{ dataCell.variation }}%</span>
                  </div>
                </div>
                <div v-else-if="dataCellKey === 'Fees'" class="text-truncate file-table-cell" data-coreui-toggle="tooltip"
                  data-coreui-placement="left" :title="dataCell">
                  <div>
                    ${{ dataCell.amount }}
                  </div>

                </div>
                <div v-else-if="dataCellKey === 'Number of Trades'" class="text-truncate file-table-cell"
                  data-coreui-toggle="tooltip" data-coreui-placement="left" :title="dataCell">
                  <div>
                    {{ dataCell.amount }}
                  </div>

                </div>

                <div v-else class="text-truncate file-table-cell" data-coreui-toggle="tooltip"
                  data-coreui-placement="left" :title="dataCell">
                  <div v-if="dataCell.variation < 0">
                    ${{ dataCell.amount }} <span class="text-danger">{{ dataCell.variation }}%</span>
                  </div>
                  <div v-else>
                    ${{ dataCell.amount }} <span class="text-success">+{{ dataCell.variation }}%</span>
                  </div>
                </div>
              </div>

            </template>
          </DataTable>
        </div>
      </div>
      <div class="portfolio-table mt-5">
        <div class="text-white fw-medium fs-4 mb-3">Pool Activity</div>
        <div class="portfolio-table__header">
          <div class="portfolio-table__header__left">
            <div class="portfolio-table__filter">
              <div class="portfolio-table__filter__el"
                :class="{ 'portfolio-table__filter__el_active': item == activitiesSelectedMode }"
                @click="activitiesSelectedMode = item" v-for="item in activitiesModes" :key="item">
                {{ item }}
              </div>
            </div>
          </div>
        </div>
        <div class="portfolio-table__wrapper_activities">
          <DataTable :data="filteredActivities" :noNumberCol="false">
            <template v-slot:default="{ dataCell, fieldName }">

              {{ console.log(dataCell) }}
              <div class="actions-cell" v-if="fieldName === 'Actions'">
                <svg v-if="dataCell === 'Deposit'" width="16" height="16" viewBox="0 0 16 16" fill="none"
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
                <svg v-if="dataCell === 'Withdraw'" width="16" height="16" viewBox="0 0 16 16" fill="none"
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
                <svg v-if="dataCell === 'Swap'" width="12" height="16" viewBox="0 0 12 16" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.2512 0.0679535C9.34907 0.124692 9.42481 0.212943 9.46604 0.318291C9.50727 0.423639 9.51156 0.539855 9.4782 0.647953L7.6772 6.49995H11.0002C11.0979 6.49991 11.1934 6.52847 11.275 6.5821C11.3566 6.63574 11.4207 6.71209 11.4594 6.80175C11.4981 6.8914 11.5098 6.99043 11.4928 7.08661C11.4759 7.18278 11.4312 7.2719 11.3642 7.34295L3.3642 15.843C3.28679 15.9253 3.18379 15.9789 3.07197 15.9952C2.96016 16.0115 2.84613 15.9894 2.74847 15.9326C2.65081 15.8757 2.57528 15.7875 2.53419 15.6822C2.4931 15.577 2.48887 15.4609 2.5222 15.353L4.3232 9.49995H1.0002C0.902544 9.49999 0.807016 9.47143 0.725405 9.4178C0.643795 9.36417 0.579677 9.28782 0.540965 9.19816C0.502253 9.10851 0.490642 9.00948 0.507566 8.9133C0.52449 8.81712 0.569208 8.72801 0.636199 8.65695L8.6362 0.156953C8.71351 0.0747526 8.81636 0.0211221 8.92802 0.00478201C9.03967 -0.011558 9.15357 0.0103533 9.2512 0.0669535V0.0679535ZM2.1572 8.49995H5.0002C5.07845 8.49994 5.15561 8.51829 5.22547 8.55353C5.29533 8.58877 5.35595 8.63991 5.40245 8.70285C5.44895 8.76578 5.48002 8.83875 5.49318 8.91588C5.50633 8.99302 5.5012 9.07216 5.4782 9.14695L4.1102 13.59L9.8422 7.49995H7.0002C6.92195 7.49997 6.84479 7.48162 6.77493 7.44638C6.70506 7.41114 6.64445 7.36 6.59795 7.29706C6.55145 7.23413 6.52038 7.16116 6.50722 7.08402C6.49406 7.00689 6.49919 6.92774 6.5222 6.85295L7.8902 2.40995L2.1572 8.49995Z"
                    fill="#00C9FF" />
                </svg>
                <svg v-if="dataCell === 'Harvest'" xmlns="http://www.w3.org/2000/svg" width="14" height="19"
                  viewBox="0 0 14 19" fill="none">
                  <path
                    d="M6.99998 2.375C6.43036 2.77801 1.27161 7.72862 1 8.21501V10.8951C1.37643 10.9044 6.37997 5.56793 6.99998 5.31447C7.61999 5.56793 12.6235 10.9044 13 10.8951V8.21501C12.7284 7.72862 7.56961 2.77797 6.99998 2.375ZM6.99998 8.10491C6.43036 8.50792 1.27161 13.4585 1 13.945V16.625C1.37643 16.6344 6.37997 11.2979 6.99998 11.0444C7.61999 11.2979 12.6235 16.6344 13 16.625V13.9449C12.7284 13.4585 7.56961 8.50792 6.99998 8.10491Z"
                    fill="#00C9FF" />
                </svg>

                <div class="actions-cell__text">
                  {{ dataCell }}
                </div>
              </div>

              <div class="details-cell" v-else-if="fieldName === 'Details'">
                <div v-for="(tokenEntry, tokenIndex) in dataCell" class="details-cell__token-entity"
                  :key="`activity-token-key-${tokenIndex}`"
                  :class="{ 'details-cell__token-entity_swap': tokenEntry.action === 'Swap' }">

                  <div v-for="(tokenInfo, tokenInfoIndex)  in Object.entries(
                    tokenEntry,
                  )" :class="tokenInfo[0] !== 'action' ? 'details-cell__token-entity' : ''"
                    :key="`activity-token-info-key-${tokenInfoIndex}`">


                    <div v-if="tokenInfo[0] !== 'action'" class="d-flex gap-2 align-items-center">
                      <img :src="getTokenEntity(tokenInfo[0], 'short').icon" class="details-cell__token-entity__icon" />
                      <div class="details-cell__token-entity__token-name">
                        {{ tokenInfo[1] }}
                      </div>
                      <!-- {{ console.log("tokenInfoIndex", tokenInfoIndex) }}
                    {{ console.log("tokenInfo", tokenInfo) }} -->
                      <!-- {{ console.log("tokenPrices", tokenPrices) }} -->
                      <div v-if="tokenEntry.action === 'Swap' && tokenInfoIndex === 0" style="margin-left: 10px;">
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

              <div v-else-if="fieldName === 'Time'" class="text-truncate file-table-cell" data-coreui-toggle="tooltip"
                data-coreui-placement="left" :title="dataCell">
                <!--                   :href="`${configService.getNetworkConfig(networkId).explorer}/tx/${poolActivityData[dataRowIndex].Tx}`">-->
                <a target="_blank" href="#">
                  {{ dataCell }}
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
              <div v-else-if="fieldName == 'Value'" class="text-truncate file-table-cell" data-coreui-toggle="tooltip"
                data-coreui-placement="left" :title="dataCell">
                ${{ dataCell }}
              </div>
              <div v-else-if="fieldName == 'Profit'" class="text-truncate file-table-cell" data-coreui-toggle="tooltip"
                data-coreui-placement="left" :title="dataCell">
                <span v-if="dataCell < 0" class="text-danger">
                  -${{ dataCell }}
                </span>
                <span v-else class="text-success">
                  +${{ dataCell }}
                </span>

              </div>

              <div v-else-if="fieldName != 'Tx'" class="text-truncate file-table-cell" data-coreui-toggle="tooltip"
                data-coreui-placement="left" :title="dataCell">
                {{ dataCell }}
              </div>

            </template>
          </DataTable>
        </div>
      </div>
    </div>
  </CRow>
</template>
<script setup>
import { CRow } from "@coreui/vue";
import { computed, ref, defineProps, toRefs } from "vue";
import DataTableCellTokenNamePaired from "@/components/DataTable/Cell/TokenNamePaired.vue";
import DataTable from "@/components/DataTable/index.vue";
import StatisticCard from "@/components/Statistics/Card.vue";
import StatisticTable from "@/components/Statistics/Table.vue";
import StatisticDonunChart from "@/components/Statistics/DonutChart.vue";
import { getTokenEntity } from "@/lib/helpers/util";
import FinancialStatement from "@/components/TrackInfo/FinancialStatement.vue";

const props = defineProps({
  id: Number
})

const tokenEntities = computed(() => {
  let tokens = filteredPools.value[0]['Name'].flat()
  let entities = tokens.map((propValue) => getTokenEntity(propValue, 'short'))
  return entities
})

const { id } = toRefs(props)

const assetsBreakdownChartMOCK = ref({
  labels: ['Bitcoin (BTC)', 'Ethereum (ETH)', 'Tether (USDT)', 'Sushiswap (SUSHI)', 'USD Coin (USDC)'],
  colors: ['rgba(230, 177, 12, 1)', '#00C9FF', 'rgba(248, 71, 71, 1)', 'rgba(194, 119, 237, 1)', 'rgba(0, 199, 242, 1)'],
  series: [44, 15, 11, 6, 2]
})

const pairsBreakdownChartMOCK = ref({
  labels: ['Bitcoin (BTC)', 'Ethereum (ETH)', 'Tether (USDT)', 'Sushiswap (SUSHI)', 'USD Coin (USDC)'],
  colors: ['rgba(230, 177, 12, 1)', '#00C9FF', 'rgba(248, 71, 71, 1)', 'rgba(194, 119, 237, 1)', 'rgba(0, 199, 242, 1)'],
  series: [20, 20, 5, 3, 1]
})

const riskMetricsMOCK = ref([
  {
    text: 'Sharpe Ratio',
    value: -6.33,
  },
  {
    text: 'Sortino Ratio',
    value: 0.36,
  },
  {
    text: 'Volatility Ratio',
    value: 0.2,
  },
])

const profitsMOCK = ref([
  {
    text: 'Average Profit per Trade',
    value: '$1,651,00',
  },
  {
    text: 'Average Profit per Pool',
    value: '2048 Days',
  },
])

const DradownsMOCK = ref([
  {
    text: 'Maximum drawdown',
    value: '$1,651,00',
  },
  {
    text: 'Duration',
    value: '2048 Days',
  },
  {
    text: 'Recovery Period',
    value: '01/07/23 - 13/08/23',
  },
  {
    text: 'Capital Loss',
    value: '$1,189,00',
  },
  {
    text: 'Percentual Impact',
    value: '20.45%',
  },
])

const ROI_MOCK = ref([

  {
    Period: '24H',
    'VS USD': 0.47,
    'VS ETH': 0.93,
    'VS BTC': 1.23,
    'VS DeFi': 2.13,
  },
  {
    Period: '7D',
    'VS USD': -9.47,
    'VS ETH': -7.93,
    'VS BTC': -10.23,
    'VS DeFi': -9.13,
  },
  {
    Period: '1M',
    'VS USD': -29.47,
    'VS ETH': -17.93,
    'VS BTC': -18.23,
    'VS DeFi': -19.13,
  },
  {
    Period: '3M',
    'VS USD': -49.47,
    'VS ETH': -47.93,
    'VS BTC': -38.23,
    'VS DeFi': -39.13,
  },
  {
    Period: '1Y',
    'VS USD': -79.47,
    'VS ETH': -87.93,
    'VS BTC': -88.23,
    'VS DeFi': -89.13,
  },
])
const APR_MOCK = ref([

  {
    Period: '24H',
    'VS USD': -0.47,
    'VS LIDO': -0.93,
    'VS BTC': -1.23,
    'VS DeFi Yield': -2.13,
  },
  {
    Period: '7D',
    'VS USD': -9.47,
    'VS LIDO': -7.93,
    'VS BTC': -10.23,
    'VS DeFi Yield': -9.13,
  },
  {
    Period: '1M',
    'VS USD': -29.47,
    'VS LIDO': -17.93,
    'VS BTC': -18.23,
    'VS DeFi Yield': -19.13,
  },
  {
    Period: '3M',
    'VS USD': -49.47,
    'VS LIDO': -47.93,
    'VS BTC': -38.23,
    'VS DeFi Yield': -39.13,
  },
  {
    Period: '1Y',
    'VS USD': -79.47,
    'VS LIDO': -87.93,
    'VS BTC': -88.23,
    'VS DeFi Yield': -89.13,
  },
])

const pools = ref([
  [
    {
      'id': 1,
      'Name': ['USDT', 'USDC'],
      'Avg APR': {
        amount: '11234.01',
        variation: '3.45'
      },
      'Liquidity Deposited': {
        amount: '1.45',
        variation: '-1.56'
      },
      '% of Pool': {
        amount: '1.45',
        variation: '3.45'
      },
      'Returns Harvested': {
        amount: '1.45',
        variation: '3.45'
      },
      'TVL': {
        amount: '1.45',
        variation: '3.45'
      },
      'Volume': {
        amount: '1.45',
        variation: '3.45'
      },
      'Fees': {
        amount: '1.45',
        variation: ''
      },
      'Avg Profit Per Trade': {
        amount: '10.01',
        variation: '3.45'
      },
      'Number of Trades': {
        amount: '12',
        variation: ''
      },
    }, {
      'id': 2,
      'Name': ['USDT', 'USDC', 'ETH'],
      'Avg APR': {
        amount: '1230.01',
        variation: '3.45'
      },
      'Liquidity Deposited': {
        amount: '14.45',
        variation: '-1.56'
      },
      '% of Pool': {
        amount: '165.45',
        variation: '3.45'
      },
      'Returns Harvested': {
        amount: '12.45',
        variation: '3.45'
      },
      'TVL': {
        amount: '14.45',
        variation: '3.45'
      },
      'Volume': {
        amount: '14.45',
        variation: '3.45'
      },
      'Fees': {
        amount: '21.45',
        variation: ''
      },
      'Avg Profit Per Trade': {
        amount: '130.01',
        variation: '3.45'
      },
      'Number of Trades': {
        amount: '132',
        variation: ''
      },
    }, {
      'id': 3,
      'Name': ['USDT', 'USDC', 'ETH'],
      'Avg APR': {
        amount: '10.01',
        variation: '3.45'
      },
      'Liquidity Deposited': {
        amount: '1.45',
        variation: '-1.56'
      },
      '% of Pool': {
        amount: '14565.45',
        variation: '3.45'
      },
      'Returns Harvested': {
        amount: '1.45',
        variation: '3.45'
      },
      'TVL': {
        amount: '1.45',
        variation: '3.45'
      },
      'Volume': {
        amount: '1.45',
        variation: '3.45'
      },
      'Fees': {
        amount: '1.45',
        variation: ''
      },
      'Avg Profit Per Trade': {
        amount: '10.01',
        variation: '3.45'
      },
      'Number of Trades': {
        amount: '12',
        variation: ''
      },
    },
  ],
  [
    {
      'id': 1,
      'Name': ['USDT', 'USDC'],
      'Avg APR': {
        amount: '16340.01',
        variation: '3.45'
      },
      'Liquidity Deposited': {
        amount: '1.45',
        variation: '-1.56'
      },
      '% of Pool': {
        amount: '1.45',
        variation: '3.45'
      },
      'Returns Harvested': {
        amount: '1.45',
        variation: '3.45'
      },
      'TVL': {
        amount: '1.45',
        variation: '3.45'
      },
      'Volume': {
        amount: '1.45',
        variation: '3.45'
      },
      'Fees': {
        amount: '1.45',
        variation: ''
      },
      'Avg Profit Per Trade': {
        amount: '10.01',
        variation: '3.45'
      },
      'Number of Trades': {
        amount: '12',
        variation: ''
      },
    }, {
      'id': 2,
      'Name': ['USDT', 'USDC', 'ETH'],
      'Avg APR': {
        amount: '175670.01',
        variation: '3.45'
      },
      'Liquidity Deposited': {
        amount: '1.45',
        variation: '-1.56'
      },
      '% of Pool': {
        amount: '1.45',
        variation: '3.45'
      },
      'Returns Harvested': {
        amount: '1.45',
        variation: '3.45'
      },
      'TVL': {
        amount: '1.45',
        variation: '3.45'
      },
      'Volume': {
        amount: '1.45',
        variation: '3.45'
      },
      'Fees': {
        amount: '1.45',
        variation: ''
      },
      'Avg Profit Per Trade': {
        amount: '10.01',
        variation: '3.45'
      },
      'Number of Trades': {
        amount: '12',
        variation: ''
      },
    },
  ],
  [
    {
      'id': 1,
      'Name': ['USDT', 'USDC'],
      'Avg APR': {
        amount: '1350.01',
        variation: '3.45'
      },
      'Liquidity Deposited': {
        amount: '1.45',
        variation: '-1.56'
      },
      '% of Pool': {
        amount: '1.45',
        variation: '3.45'
      },
      'Returns Harvested': {
        amount: '1.45',
        variation: '3.45'
      },
      'TVL': {
        amount: '1.45',
        variation: '3.45'
      },
      'Volume': {
        amount: '1.45',
        variation: '3.45'
      },
      'Fees': {
        amount: '1.45',
        variation: ''
      },
      'Avg Profit Per Trade': {
        amount: '10.01',
        variation: '3.45'
      },
      'Number of Trades': {
        amount: '12',
        variation: ''
      },
    }, {
      'id': 2,
      'Name': ['USDT', 'USDC', 'ETH'],
      'Avg APR': {
        amount: '10.01',
        variation: '3.45'
      },
      'Liquidity Deposited': {
        amount: '15654.45',
        variation: '-1.56'
      },
      '% of Pool': {
        amount: '1.45',
        variation: '3.45'
      },
      'Returns Harvested': {
        amount: '1.45',
        variation: '3.45'
      },
      'TVL': {
        amount: '1.45',
        variation: '3.45'
      },
      'Volume': {
        amount: '1.45',
        variation: '3.45'
      },
      'Fees': {
        amount: '1.45',
        variation: ''
      },
      'Avg Profit Per Trade': {
        amount: '10.01',
        variation: '3.45'
      },
      'Number of Trades': {
        amount: '12',
        variation: ''
      },
    },
  ],
  [
    {
      'id': 1,
      'Name': ['USDT', 'USDC'],
      'Avg APR': {
        amount: '45610.01',
        variation: '3.45'
      },
      'Liquidity Deposited': {
        amount: '1.45',
        variation: '-1.56'
      },
      '% of Pool': {
        amount: '1.45',
        variation: '3.45'
      },
      'Returns Harvested': {
        amount: '1.45',
        variation: '3.45'
      },
      'TVL': {
        amount: '1.45',
        variation: '3.45'
      },
      'Volume': {
        amount: '1.45',
        variation: '3.45'
      },
      'Fees': {
        amount: '1.45',
        variation: ''
      },
      'Avg Profit Per Trade': {
        amount: '10.01',
        variation: '3.45'
      },
      'Number of Trades': {
        amount: '12',
        variation: ''
      },
    }, {
      'id': 2,
      'Name': ['USDT', 'USDC', 'ETH'],
      'Avg APR': {
        amount: '10.01',
        variation: '3.45'
      },
      'Liquidity Deposited': {
        amount: '1.45',
        variation: '-1.56'
      },
      '% of Pool': {
        amount: '14565.45',
        variation: '3.45'
      },
      'Returns Harvested': {
        amount: '1.45',
        variation: '3.45'
      },
      'TVL': {
        amount: '1.45',
        variation: '3.45'
      },
      'Volume': {
        amount: '1.45',
        variation: '3.45'
      },
      'Fees': {
        amount: '1.45',
        variation: ''
      },
      'Avg Profit Per Trade': {
        amount: '10.01',
        variation: '3.45'
      },
      'Number of Trades': {
        amount: '12',
        variation: ''
      },
    },
  ],
  [
    {
      'id': 1,
      'Name': ['USDT', 'USDC'],
      'Avg APR': {
        amount: '45610.01',
        variation: '3.45'
      },
      'Liquidity Deposited': {
        amount: '1.45',
        variation: '-1.56'
      },
      '% of Pool': {
        amount: '1.45',
        variation: '3.45'
      },
      'Returns Harvested': {
        amount: '1.45',
        variation: '3.45'
      },
      'TVL': {
        amount: '1.45',
        variation: '3.45'
      },
      'Volume': {
        amount: '1.45',
        variation: '3.45'
      },
      'Fees': {
        amount: '1.45',
        variation: ''
      },
      'Avg Profit Per Trade': {
        amount: '10.01',
        variation: '3.45'
      },
      'Number of Trades': {
        amount: '12',
        variation: ''
      },
    }, {
      'id': 2,
      'Name': ['USDT', 'USDC', 'ETH'],
      'Avg APR': {
        amount: '1230.01',
        variation: '3.45'
      },
      'Liquidity Deposited': {
        amount: '1232.45',
        variation: '-1.56'
      },
      '% of Pool': {
        amount: '14565.45',
        variation: '3.45'
      },
      'Returns Harvested': {
        amount: '2321.45',
        variation: '3.45'
      },
      'TVL': {
        amount: '1.45',
        variation: '3.45'
      },
      'Volume': {
        amount: '1.45',
        variation: '3.45'
      },
      'Fees': {
        amount: '1.45',
        variation: ''
      },
      'Avg Profit Per Trade': {
        amount: '10.01',
        variation: '3.45'
      },
      'Number of Trades': {
        amount: '12',
        variation: ''
      },
    },
  ],

])
const activities =
  [
    {
      'Actions': 'Deposit',
      'Details': [
        {
          'GMX': '30.65',
          'RDNT': '2.65',
          'WETH': '3.65'

        }
      ],
      'Value': '1450',
      'Profit': '1450',
      'Time': 'about 1 hour ago',
    }, {
      'Actions': 'Swap',
      'Details': [
        {
          'GMX': '30.65',
          'RDNT': '2.65',
          'action': 'Swap'

        }
      ],
      'Value': '1450',
      'Profit': '1450',
      'Time': 'about 1 hour ago',
    }, {
      'Actions': 'Harvest',
      'Details': [
        {
          'GMX': '0.65',
          'RDNT': '2.65',
          'WETH': '3.65'

        }
      ],
      'Value': '1450',
      'Profit': '1450',
      'Time': 'about 1 hour ago',
    }, {
      'Actions': 'Withdraw',
      'Details': [
        {
          'GMX': '0.65',
          'RDNT': '2.65',
          'WETH': '3.65'

        }
      ],
      'Value': '1450',
      'Profit': '1450',
      'Time': 'about 1 hour ago',
    },

  ]


const filteredActivities = computed(() => {
  if (activitiesSelectedMode.value == false) {
    return activities
  } else {
    let newData = []
    activities.forEach((item) => {
      if (item['Actions'] == activitiesSelectedMode.value) {
        newData.push(item)
      }
    })
    return newData
  }

})

const filteredPools = computed(() => {
  let newData = []
  pools.value[selectedPeriodOfData.value.number].forEach((item) => {
    if (item.id == id.value) {
      newData.push({ 'Name': item['Name'] })
      for (let key in item) {
        if (key != 'Name' && key != 'id' && filterOptions.value[key].isSelected == true) {
          newData[newData.length - 1][key] = item[key]
        }
      }
    }
  })
  return newData
})

const periodsOfData = [
  {
    number: 0,
    title: '24H'
  },
  {
    number: 1,
    title: '7D'
  },
  {
    number: 2,
    title: '1M'
  },
  {
    number: 3,
    title: '1Y'
  },
  {
    number: 4,
    title: 'All Time'
  },

]
const activitiesModes = ['Deposit', 'Swap', 'Harvest', 'Withdraw']

const activitiesSelectedMode = ref(false)

const selectedPeriodOfData = ref(periodsOfData[0])

const sortedHeader = ref({})

function onDatatableHeaderClick(caption) {
  let sortedAsc = [...pools.value[selectedPeriodOfData.value.number]].sort(function (a, b) {
    var response = 0;
    if (a[caption].amount > b[caption].amount) {
      response = 1
    }
    if (a[caption].amount < b[caption].amount) {
      response = -1
    }
    if (a[caption].amount == b[caption].amount) {
      response = 0
    }
    return response
  })
  let sortedDesc = [...pools.value[selectedPeriodOfData.value.number]].sort(function (a, b) {
    var response = 0;
    if (a[caption].amount > b[caption].amount) {
      console.log(a[caption] + '>' + b[caption])
      response = -1
    }
    if (a[caption].amount < b[caption].amount) {
      console.log(a[caption] + '<' + b[caption])
      response = 1
    }
    if (a[caption].amount == b[caption].amount) {
      console.log(a[caption] + '=' + b[caption])
      response = 0
    }
    return response
  })

  if (JSON.stringify(sortedDesc) == JSON.stringify(pools.value[selectedPeriodOfData.value.number]) && !(sortedHeader.value.caption == caption && sortedHeader.value.direction == 'asc')) {
    pools.value[selectedPeriodOfData.value.number] = sortedAsc
    sortedHeader.value = { caption, direction: "asc" }
  } else {
    pools.value[selectedPeriodOfData.value.number] = sortedDesc
    sortedHeader.value = { caption, direction: "desc" }
  }
}

const filterOptions = ref({
  'Avg APR': {
    title: 'Avg APR',
    isSelected: true
  },
  'Liquidity Deposited': {
    title: 'Liquidity Deposited',
    isSelected: true
  },
  '% of Pool': {
    title: '% of Pool',
    isSelected: true
  },
  'Returns Harvested': {
    title: 'Returns Harvested',
    isSelected: true
  },
  'TVL': {
    title: 'TVL',
    isSelected: true
  },
  'Volume': {
    title: 'Volume',
    isSelected: true
  },
  'Fees': {
    title: 'Fees',
    isSelected: true
  },
  'Avg Profit Per Trade': {
    title: 'Avg Profit Per Trade',
    isSelected: false
  },
  'Number of Trades': {
    title: 'Number of Trades',
    isSelected: false
  },

})



const activeTab = ref(0)

const isColumnsOpened = ref(false)

const isBalanceHidden = ref(false)
const balance = ref(277308.00)
const balanceVariation = ref(1200.78)

const formattedBalance = computed(() => {
  let parts = balance.value.toFixed(2).toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
})

const hiddenBalance = computed(() => {
  let balanceLength = balance.value.toFixed(2).toString().length
  return Array(balanceLength).fill('*').join('')
})

const formattedBalanceVariation = computed(() => {
  return formatBalanceVariation(balanceVariation.value)
})

function formatBalanceVariation(variation) {
  if (variation < 0) {
    return variation.toFixed(2).toString().replace('-', '-$')
  } else {
    return variation.toFixed(2).toString().replace('', '+$')
  }
}

const balanceVariationInPercents = computed(() => {
  return formatVariationInPercents(balanceVariation.value, balance.value)
})

function formatVariationInPercents(variation, currentBalance) {
  if (variation < 0) {
    let positiveVariation = (variation * -1)
    let startBalance = currentBalance + positiveVariation
    return (positiveVariation / startBalance * 100).toFixed(2).toString().replace('', '-')
  } else {
    let startBalance = currentBalance - variation
    return (startBalance / variation).toFixed(2).toString().replace('', '+')
  }
}


</script>
<style lang="sass">
.details-cell__token-entity
  .details-cell__token-entity
    padding: 4px 6px
    background: #181C1F
    border-radius: 6px
    font-size: 16px
    font-weight: 400

.details-cell__token-entity_swap
  .details-cell__token-entity
    background: none


.portfolio-table__wrapper_activities
  overflow-x: auto

  .file-table-header-container
    max-width: none !important
    min-width: 200px !important

    &:nth-child(2)
      min-width: 300px !important

  .table
    min-width: 100% !important
    width: auto

  .actions-cell
    display: flex
    align-items: center

    &__text
      font-size: 16px
      font-weight: 300
      line-height: 24px
      letter-spacing: 0em
      color: #ffffff
      margin-left: 12px


  .details-cell
    display: flex
    flex-wrap: wrap

    &__token-entity
      display: flex

      &:not(:last-child)
        margin-right: 12px

      &__icon
        height: 24px
        width: 24px
        margin-right: 8px

.portfolio-table__wrapper
  .file-table-header-container
    max-width: none !important
    min-width: 200px !important

  .table
    min-width: 100% !important
    width: auto

.portfolio
  display: flex
  flex-direction: column
  align-items: flex-start

  &-header
    color: #fff
    margin-bottom: 29px

    &__title
      font-size: 14px
      margin-bottom: 8px

      span
        margin-right: 8px

      svg
        cursor: pointer

    &__balance
      font-size: 32px
      font-weight: 600
      margin-bottom: 8px

    &__variation
      display: flex
      align-items: center

      &-amount
        font-size: 14px
        margin-right: 8px

      &-period
        font-size: 12px
        padding: 2px 6px
        background-color: #1A1D1E
        border-radius: 5px

  &-stats
    display: flex
    flex-wrap: wrap

    &__el
      display: flex
      align-items: center
      margin-right: 48px
      margin-bottom: 10px

    &__icon
      margin-right: 4px

    &__title
      color: #E1E1E1
      font-size: 14px
      margin-bottom: 4px

    &__amount
      svg
        margin-right: 4px

      &_danger
        color: #e55353

        svg
          transform: rotate(180deg)

          path
            fill: #e55353

      &_success
        color: #00C9FF

        svg
          transform-origin: center

          path
            fill: #00C9FF

  &-tabs
    padding: 4px
    margin-bottom: 50px
    border-radius: 4px
    border: 1px solid rgba(1, 180, 126, 0.10)
    background: rgba(255, 255, 255, 0.05)
    display: flex
    justify-content: left

    &__el
      padding: 7px 12px
      color: #fff

      &_active
        border-radius: 4px
        background: rgba(255, 255, 255, 0.15)

  &-chart
    margin-bottom: 50px

  &-table
    width: 100%

    &__wrapper
      width: 100%
      overflow-x: auto

      &::-webkit-scrollbar
        height: 6px

      &::-webkit-scrollbar-track
        background: transparent

      &::-webkit-scrollbar-thumb
        background-color: rgba(63, 67, 80, 0.24)
        border-radius: 3px

    &__header
      display: flex
      justify-content: space-between
      align-items: flex-start
      margin-bottom: 17px
      flex-wrap: wrap

      &__left
        display: flex
        flex-wrap: wrap


    &__filter
      display: flex
      padding: 4px
      border-radius: 12px
      border: 1px solid #7EF6B2
      margin-bottom: 10px

      &:first-child
        margin-right: 8px

      &__el
        font-size: 14px
        padding: 6px 8px
        border-radius: 12px
        color: rgba(#fff, 0.6)

        &_active
          color: #fff
          background: #00C9FF

    &__dropdown
      position: relative
      font-size: 14px

      &__title
        color: #fff
        padding: 9px 13px
        border-radius: 12px
        border: 1px solid #7EF6B2
        text-align: center
        cursor: pointer

        &_active
          border-radius: 12px 12px 0 0
          border-bottom: 1px solid #fff

          svg
            transition-duration: 0.3s
            transform-origin: center
            transform: rotate(180deg)

      &__wrapper
        padding: 7px
        position: absolute
        border-radius: 0 0 12px 12px
        border: 1px solid #7EF6B2
        border-top: none
        background: #000

      &__option
        color: rgba(#fff, 0.6)
        margin-bottom: 10px
        display: flex
        justify-content: space-between
        align-items: center
        cursor: pointer

        svg
          min-width: 9px

        &_active
          color: #fff

  &-statistics
    display: flex
    justify-content: space-between
    width: 100%
    flex-wrap: wrap
    &__el
      display: flex
      flex-direction: column
      justify-content: space-between
      width: 32%
      @media all and (max-width: 1200px)
        width: 100%
      &:nth-child(3)
        @media all and (max-width: 1200px)
          flex-direction: row
        @media all and (max-width: 900px)
          flex-direction: column
</style>
