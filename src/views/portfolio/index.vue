<template>
  <MainCard>
    <CRow class="d-flex align-items-center">
      <Warning :NetworkUnsupported="NetworkUnsupported" v-if="visibleNetworkModal"></Warning>
      <div>
        <ChainSelector v-if="!visibleNetworkModal" @updateChain="(newChain) => (chainSelected = newChain)" />
      </div>
      <div class="portfolio mt-4">
        <div class="portfolio-header" v-if="!visibleNetworkModal">
          <div class="portfolio-header__title">
            <span>Current balance</span>
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
              :class="{ 'text-danger': balanceVariation < 0, 'portfolio-stats__amount_success': balanceVariation >= 0 }">
              {{ formattedBalanceVariation }} ({{ balanceVariationInPercents }}%)
            </div>
            <div class="portfolio-header__variation-period">
              24H
            </div>
          </div>
        </div>
        <div class="portfolio-stats" v-if="!visibleNetworkModal">
          <div class="portfolio-stats__el">
            <div class="portfolio-stats__info">
              <div class="portfolio-stats__title">
                All time profit
              </div>
              <div class="portfolio-stats__amount portfolio-stats__amount_success">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <path d="M6 0L11.1962 9H0.803848L6 0Z" fill="#2DC24E" />
                </svg>
                <span class="portfolio-header__amount-percents">2.52% ({{ formatBalanceVariation(324.84) }})</span>
              </div>
            </div>
          </div>

          <div class="portfolio-stats__el">
            <div v-if="performers.best">
              <img v-for="img in performers.best.tokens" :key="img" :src="getTokenEntity(img, 'short').icon" alt=""
                class="portfolio-stats__icon">
            </div>

            <div class="portfolio-stats__info">
              <div class="portfolio-stats__title">
                Best performer
              </div>
              <div class="portfolio-stats__amount portfolio-stats__amount_success">
                <svg v-if="performers.best" xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9"
                  fill="none">
                  <path d="M6 0L11.1962 9H0.803848L6 0Z" fill="#2DC24E" />
                </svg>
                <span v-if="performers.best" class="portfolio-header__amount-percents">{{
                  performers.best.percent_diff.toFixed(2) }}%
                  ({{ formatBalanceVariation(performers.best.diff) }})</span>
                <div v-else class="mt-3">
                  <ThreeDots></ThreeDots>
                </div>
              </div>
            </div>
          </div>
          <div class="portfolio-stats__el">
            <div v-if="performers.worst">
              <img v-for="img in performers.worst.tokens" :key="img" :src="getTokenEntity(img, 'short').icon" alt=""
                class="portfolio-stats__icon">
            </div>
            <div class="portfolio-stats__info">
              <div class="portfolio-stats__title">
                Worst performer
              </div>
              <div class="portfolio-stats__amount portfolio-stats__amount_danger">
                <svg v-if="performers.worst" xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9"
                  fill="none">
                  <path d="M6 0L11.1962 9H0.803848L6 0Z" fill="#2DC24E" />
                </svg>
                <span v-if="performers.worst" class="portfolio-header__amount-percents">{{
                  performers.worst.percent_diff.toFixed(2)
                }}%
                  ({{ formatBalanceVariation(performers.worst.diff) }})</span>
                <div v-else class="mt-3">
                  <ThreeDots></ThreeDots>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="portfolio-chart">
          <PortfolioChart :chart_data="all_chart_data" :networks_data="networks_data" :tokensData="tokensData"
            :chainSelected="chainSelected.name" @updateChart="(chart_data) => all_chart_data = chart_data" />
        </div>
        <Tabs style="margin-bottom: 44px;" :tabsOptions="['Investments', 'Statistics', 'Financial Statement']"
          :selectedTab="activeTab" @changeTab="changeActiveTab"></Tabs>
        <div class="portfolio-statistics" v-if="activeTab == 'Statistics'">
          <PortfolioStatistics :historical_tvl="historical_tvl" :tokensData="tokensData" :poolSwapsData="poolSwapsData"
            :chainSelected="chainSelected" :chartData="all_chart_data" :historicalPrices="historicalPrices"
            :userFirstTimestamp="firstUserTimestamp" :tokenPairs="chainPairs">
          </PortfolioStatistics>
        </div>
        <div class="portfolio-financial-statement">
          <PortfolioFinancialStatement :poolSwapsData="poolSwapsData" :chainSelected="chainSelected"
            :historical_tvl="historical_tvl" :historicalPrices="historicalPrices" :pools="pools.map(p => p.id)"
            :user="account" v-if="activeTab == 'Financial Statement'">
          </PortfolioFinancialStatement>
        </div>
        <div class="portfolio-table" v-if="activeTab == 'Investments'">
          <div class="text-white fw-medium fs-6 mb-3">My Investments</div>
          <div class="portfolio-table__header">
            <div class="portfolio-table__header__left" style="justify-content: space-between; width: 100%">

              <Tabs :selectedTab="selectedInvestmentsMode" :tabsOptions="investementModes"
                @changeTab="changeInvestmentMode"></Tabs>
              <div class="table-above">
                <div style="cursor: pointer">
                  <CFormSwitch size="l" style="background-color: #00c9ff" v-model="hideSmallerThan10Pools" id="hideSmallerThan10Pools" />
                </div>
                <div class="text-white table-above_toggler">
                  Hide {{ selectedInvestmentsMode.toLowerCase() }}
                </div>
              </div>

            </div>
          </div>
          <!--          v-if="selectedInvestmentData.length > 0 && account != ''"-->
          <div class="portfolio-table__wrapper">
            <DataTable :data="selectedInvestmentData" :default_head_captions="investmentHeadCaptions"
              @table-row-click="onDatatableRowClick" :table_bg="'bg-primary'" @table-header-click="onDatatableHeaderClick"
              :sortedHeader="sortedHeader" :isFullTable="true" :displayTable="selectedInvestmentData" :sortIcons="true">
              <template v-slot:default="{ dataCell, dataCellKey /*, tokenName, fieldName*/ }">
                <div>
                  <DataTableCellTokenNamePaired v-if="dataCellKey === 'Name'" :value="dataCell" />
                  <div v-else-if="['% of Pool', 'Avg APR'].includes(dataCellKey)" class="text-truncate file-table-cell"
                    data-coreui-toggle="tooltip" data-coreui-placement="left" :title="dataCell">
                    <div v-if="dataCell.variation < 0">
                      {{ dataCell.amount }}% <span v-if="dataCell.variation" class="text-danger">{{
                        dataCell.variation
                      }}%</span>
                    </div>
                    <div v-else>
                      {{ dataCell.amount }}% <span class="text-success" v-if="dataCell.variation">+{{
                        dataCell.variation
                      }}%</span>
                    </div>
                  </div>
                  <div v-else-if="dataCellKey === 'Fees'" class="text-truncate file-table-cell"
                    data-coreui-toggle="tooltip" data-coreui-placement="left" :title="dataCell">
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
                      ${{ dataCell.amount }} <span v-if="dataCell.variation" class="text-danger">{{
                        dataCell.variation
                      }}%</span>
                    </div>
                    <div v-else>
                      ${{ dataCell.amount }} <span v-if="dataCell.variation" class="text-success">+{{
                        dataCell.variation
                      }}%</span>
                    </div>
                  </div>
                </div>

              </template>
            </DataTable>

            <!--            <div v-if="pairs != null && selectedInvestmentData.length == 0 && account != ''">-->
            <!--              <span>You don’t have funds invested</span>-->
            <!--            </div>-->
            <!--            <div v-else-if="!isCorrectNetwork && account != ''">-->
            <!--              <span>You must be connected to a supported chain</span>-->
            <!--            </div>-->
            <!--            <div v-else-if="account == ''">-->
            <!--              <span>You must connect wallet to see your investments</span>-->
            <!--            </div>-->

          </div>
        </div>
        <div class="portfolio-table mt-5" v-if="activeTab == 'Investments'">
          <div class="text-white fw-medium fs-6 mb-3">Portfolio Activity</div>
          <div class="portfolio-table__header">
            <div class="portfolio-table__header__left">
              <Tabs style="margin-right: 15px;" :selectedTab="activitiesSelectedMode" :tabsOptions="activitiesModes"
                @changeTab="changeActivitiesMode"></Tabs>
              <!--              <div class="portfolio-table__filter__el"-->
              <!--                :class="{ 'portfolio-table__filter__el_active': item == activitiesSelectedMode }"-->
              <!--                @click="activitiesSelectedMode = item" v-for="item in activitiesModes" :key="item">-->
              <!--                {{ item }}-->
              <!--              </div>-->
              <Tabs :selectedTab="actSelectedPeriodOfData" :tabsOptions="periodsOfData"
                @changeTab="changeActPeriodOfData"></Tabs>
            </div>
          </div>

          <CRow id="pool-activity-row" class="table-wrapper">

            <Table :headers="[
              'Actions',
              'Details',
              'Value',
              'Time',
            ]">
              <CTableBody v-if="displayActivities.length > 0 && account != ''" class="text-white table-body">
                <CTableRow v-for="(item, i) in filteredActivities" :key="i" class="table-row">
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
                        )" :class="tokenInfo[0] !== 'action' ? 'details-cell__token-entity' : ''
  " :key="`activity-token-info-key-${tokenInfoIndex}`">
                          <div v-if="tokenInfo[0] !== 'action'" class="d-flex align-items-center">
                            <img :src="getTokenEntity(tokenInfo[0], 'short').icon"
                              class="details-cell__token-entity__icon" />
                            <div class="details-cell__token-entity__token-name">
                              {{ tokenInfo[1] }}
                            </div>
                            <div v-if="tokenEntry.action === 'Swap' && tokenInfoIndex === 1" style="margin-left: 10px">
                              <svg width="21" height="15" viewBox="0 0 21 15" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
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
                      <a target="_blank" :href="`${configService.getNetworkConfig(networkId).explorer
                        }/tx/${item['Tx']}`">
                        {{ item['Time'] }}
                        <svg width=" 14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clip-path="url(#clip0_1904_34599)">
                            <path
                              d="M10.5 7.58333V11.0833C10.5 11.3928 10.3771 11.6895 10.1583 11.9083C9.9395 12.1271 9.64275 12.25 9.33333 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V4.66667C1.75 4.35725 1.87292 4.0605 2.09171 3.84171C2.3105 3.62292 2.60725 3.5 2.91667 3.5H6.41667"
                              stroke="white" stroke-opacity="0.5" stroke-width="1.16667" stroke-linecap="round"
                              stroke-linejoin="round" />
                            <path d="M8.75 1.75H12.25V5.25" stroke="white" stroke-opacity="0.5" stroke-width="1.16667"
                              stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5.83301 8.16667L12.2497 1.75" stroke="white" stroke-opacity="0.5"
                              stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
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

          <!--            <div-->
          <!--              v-else-if="activities && displayActivities.length == 0 && account != '' && activitiesSelectedMode == 'Harvest'">-->
          <!--              <span>No harvests with this wallet</span>-->
          <!--            </div>-->
          <!--            <div v-else-if="activities != null && displayActivities.length == 0 && account != ''">-->
          <!--              <span>You don’t have activities</span>-->
          <!--            </div>-->
          <!--            <div v-else-if="!isCorrectNetwork && account != ''">-->
          <!--              <span>You must be connected to a supported chain</span>-->
          <!--            </div>-->
          <!--            <div v-else-if="account == ''">-->
          <!--              <span>You must connect wallet to see your activities</span>-->
          <!--            </div>-->

          <!--            <div v-else style="-->
          <!--          display: flex;-->
          <!--          justify-content: center;-->
          <!--          margin-top: 20%;-->
          <!--          margin-bottom: 20%;-->
          <!--        ">-->
          <!--              <LoaderPulse></LoaderPulse>-->
          <!--            </div>-->
        </div>
      </div>
    </CRow>
  </MainCard>
</template>
<script setup>
import { CRow } from "@coreui/vue";
import ThreeDots from '@/components/loaders/ThreeDots.vue'
import { computed, onMounted, ref, watch } from "vue";
import DataTableCellTokenNamePaired from "@/components/DataTable/Cell/TokenNamePaired.vue";
import DataTable from "@/components/DataTable/index.vue";
import Table from "@/UI/Table.vue";
import PortfolioChart from "@/components/portfolio/PortfolioChart.vue";
import PortfolioStatistics from "@/components/portfolio/PortfolioStatistics.vue";
import PortfolioFinancialStatement from "@/components/portfolio/PortfolioFinancialStatement.vue";
import { getTokenEntity } from "@/lib/helpers/util";
import router from "@/router";
import { InitializeMetamask } from '@/lib/utils/metamask'
import { GetPortfolioActions } from "@/composables/portfolio/usePortfolioActions"
import { DisplayNetwork, networkId } from "@/composables/useNetwork";
import { FormatPortfolioActivity } from "@/lib/formatter/portfolioFormatter"
import { configService } from "@/services/config/config.service";
import { ethers } from "ethers";
import MainCard from '@/UI/MainCard.vue'
import { GetHistoricalTokenPrices } from '@/composables/balances/useHistoricalTokenPrices'
import Tabs from "@/UI/Tabs.vue";
import { GetUserPools } from "@/composables/portfolio/useUserPools";
import { GetPoolSwapsData } from "@/composables/pools/charts/usePoolSwapsData";
import { FormatPoolsData } from "@/lib/formatter/poolsFormatter";
import { FormatPortfolioPools } from "@/lib/formatter/portfolio/portfolioPoolsFormatter";
import { FormatPortfolioPairs } from "@/lib/formatter/portfolio/portfolioPairsFormatter";
import { GetPoolHistoricValues } from "@/composables/pools/charts/usePoolHistoricValues";
import { GetHistoricalTvl } from "@/composables/pools/snapshots/usePoolHistoricalTvl";
import { GetTokenPairs } from "@/composables/pools/useTokenPairs";
import { GetTokenPricesBySymbols } from "@/composables/balances/cryptocompare";
import { excludeKeysFromObject, combineArrayObjects, median, calculatePercentageDifference } from "@/lib/utils";
import { FormatHistoricalTvl } from "@/lib/formatter/poolTvlFormatter";
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import ChainSelector from '@/UI/ChainSelectorV2.vue'
import { Network } from "@/composables/useNetwork"
import { isRightChainName } from '@/composables/pools/usePoolSwapsStats'
import { GetUserHistoricalBalances } from "@/composables/portfolio/usePortfolioHistoricalBalances"
import { GetActivePeriodsSwapsData } from "@/lib/formatter/portfolio/portfolioSwapsFormatter"
import { InitTreasuryYields } from '@/composables/api/useTreasuryYields'
const visibleNetworkModal = ref(false)
const NetworkUnsupported = ref(false)
const networksSupported = ref(false)


const chainSelected = ref({ name: 'All Chains', code: 'ALL', img: '' })

const onDatatableRowClick = (_, index) => {
  router.push({
    name: 'Investment Details',
    params: {
      id: pools.value[index].id,
    },
  })
}


const pools = ref(null)
const pairs = ref(null)
const activities = ref(null)
const hideSmallerThan10Pools = ref(true)

const displayActivities = computed(() => filteredActivities.value.map(item => excludeKeysFromObject(item, ['tx', 'timestamp', 'network'])))

const filteredActivities = computed(() => {
  let output = []
  if (!activities.value || activities.value.length == 0)
    output = []
  else if (activitiesSelectedMode.value == 'All') {
    output = activities.value[actSelectedPeriodOfData.value.number]
  } else {
    let newData = []
    activities.value[actSelectedPeriodOfData.value.number].forEach((item) => {
      if (item['Actions'] == activitiesSelectedMode.value) {
        newData.push(item)
      }
    })
    output = newData
  }
  return output.filter((item) => chainSelected.value.name == 'All Chains' || DisplayNetwork[item.network] == chainSelected.value.name)

})


const investementModes = ['Pools', 'Pairs']



const investmentDataMap = {
  "Pools": pools,
  "Pairs": pairs
}

const selectedInvestmentData = computed(() => {
  let data = investmentDataMap[selectedInvestmentsMode.value].value
  if (!data)
    return null
  if (hideSmallerThan10Pools.value) {
    data = data.filter((el) => el.TVL.fullAmount > 10)
  }
  let formatted = data.map(item => excludeKeysFromObject(item, ['id']))
  return formatted
})

const chain_swaps_data = computed(() => {
  if (!networks_data.value || networks_data.value.length == 0)
    return []

  let swaps_data = networks.map((n, i) => isRightChainName(DisplayNetwork[n], chainSelected.value.name) ? networks_data.value[i][1] : []).flat()

  return swaps_data
})




const performers = computed(() => {
  let pools_info = []
  if (chain_swaps_data.value.length == 0)
    return {}
  for (let i = 0; i < chain_swaps_data.value.length; i++) {
    let swap = chain_swaps_data.value[i]
    if (!swap)
      continue
    let poolId = swap['swaps'][0]['poolIdVault'][0]
    let poolInfo = pools_info.find((p) => p.id == poolId)
    if (!poolInfo) {
      poolInfo = { id: poolId, profit: 0 }
      pools_info.push(poolInfo)
    }
    let profit = parseFloat(swap.profitUsd)
    poolInfo.profit += profit
  }
  console.log("HERE - ", pools_info)
  if (pools_info.length == 0)
    return {}
  let pools_median = median(pools_info.map(p => p.profit))
  pools_info = pools_info.map((p) => ({ ...p, diff: p.profit - pools_median, percent_diff: calculatePercentageDifference(pools_median, p.profit) }))
  pools_info.sort((a, b) => a.diff - b.diff)
  let lastIndex = pools_info.length - 1
  console.log(networks_data.value)
  let best = {
    diff: pools_info[lastIndex].diff,
    percent_diff: pools_info[lastIndex].percent_diff,
    id: pools_info[lastIndex].id,
    tokens: FindPoolSymbols(pools_info[lastIndex].id),
  }
  let worst = {
    diff: pools_info[0].diff,
    percent_diff: pools_info[0].percent_diff,
    id: pools_info[0].id,
    tokens: FindPoolSymbols(pools_info[0].id),
  }
  return {
    best,
    worst
  }
})

function FindPoolSymbols(poolId) {
  for (let k = 0; k < networks_data.value.length; k++) {
    let network_data = networks_data.value[k][0]
    if (network_data) {
      let found = network_data.sharesOwned.find((p) => p.poolId.id == poolId)
      if (found)
        return found.poolId.tokens.map(t => t.symbol)
    }
  }
  return []
}


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
const activitiesModes = ['All', 'Deposit', 'Swap', 'Harvest', 'Withdraw']
const selectedInvestmentsMode = ref(investementModes[0])
const activitiesSelectedMode = ref(activitiesModes[0])
const actSelectedPeriodOfData = ref(periodsOfData[4])

const investmentHeadCaptions = computed(() => {
  {
    if (selectedInvestmentsMode.value == 'Pools') {
      return ['Name', 'AVG APR', 'Liquidity Deposited', '% Of Pool', 'Returns Harvested', 'TVL', 'Volume', 'Fees', 'AVG Profit Per Trade', 'Number Of Trades']
    } else {
      return ['Name', 'Liquidity Deposited', '% Of Pool', 'TVL', 'Volume', 'Fees', 'AVG Profit Per Trade', 'Number Of Trades']
    }
  }
})

function changeActivitiesMode(_new) {
  activitiesSelectedMode.value = _new
}

function changeActPeriodOfData(_new) {
  actSelectedPeriodOfData.value = _new
}

function changeInvestmentMode(_new) {
  selectedInvestmentsMode.value = _new
  sortedHeader.value = {}
}

const sortedHeader = ref({})

const isCorrectNetwork = computed(() => [42161, 56, 137].includes(networkId.value))
const portfolioActions = ref([])
const firstUserTimestamp = computed(() => portfolioActions.value.joinExits ? [...portfolioActions.value.joinExits].sort((a, b) => a.timestamp - b.timestamp)[0].timestamp * 1000 : 0)
const account = ref('')

function clearUserData() {
  networks_data.value = []
  portfolioActions.value = []
}
watch(networkId, async () => {
  const mmProvider = await InitializeMetamask()
  let previous_account = account.value
  account.value = ''//'0xb51027d05ffbf77b38be6e66978b2c5b6467f615'
  if (!mmProvider) {
    clearUserData()
    return
  }



  if (networkId.value > 0)
    account.value = await mmProvider.getSigner().getAddress()
  if (previous_account != account.value) {
    clearUserData()
  }
  // hardcoded for testing
  //account.value = '0xb51027d05ffbf77b38be6e66978b2c5b6467f615'
  InitInvestments()
  if (isCorrectNetwork.value) {
    if (portfolioActions.value.length == 0)
      await InitPortfolioActions()
    activities.value = FormatPortfolioActivity(portfolioActions.value)
  }
})


watch(chainSelected, () => {
  InitInvestments()
})

async function InitPortfolioActions() {
  let actions = await Promise.all(networks.map(n => GetPortfolioActions(account.value.toLowerCase(), n)))
  console.log(actions)
  portfolioActions.value = combineArrayObjects(actions)
}

function onDatatableHeaderClick(caption) {
  let data = investmentDataMap[selectedInvestmentsMode.value]
  let sortedAsc = [...data.value].sort(function (a, b) {
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
  let sortedDesc = [...data.value].sort(function (a, b) {
    var response = 0;
    if (a[caption].amount > b[caption].amount) {
      response = -1
    }
    if (a[caption].amount < b[caption].amount) {
      response = 1
    }
    if (a[caption].amount == b[caption].amount) {
      response = 0
    }
    return response
  })

  if (JSON.stringify(sortedDesc) == JSON.stringify(data.value) && !(sortedHeader.value.caption == caption && sortedHeader.value.direction == 'asc')) {
    data.value = sortedAsc
    sortedHeader.value = { caption, direction: "asc" }
  } else {
    data.value = sortedDesc
    sortedHeader.value = { caption, direction: "desc" }
  }
}


const activeTab = ref('Investments')

function changeActiveTab(_new) {
  activeTab.value = _new
}


const isBalanceHidden = ref(false)
const balance = ref(277308.00)
const balanceVariation = ref(1200.78)

const tokensData = ref([])
const historicalPrices = ref([])

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

function changeVisibleNetworkModal() {
  visibleNetworkModal.value = !visibleNetworkModal.value
}

async function InitUserData(user, network) {
  return await Promise.all([GetUserPools(user, network), GetPoolSwapsData(null, network), GetPoolHistoricValues(null, network), GetHistoricalTvl(network), GetTokenPairs(network), GetUserHistoricalBalances(user, network)])
}

const networks_data = ref([])
const tokenPrices = ref({})

const all_chart_data = ref([])

watch(all_chart_data, () => {
  console.log("UPDATES", all_chart_data.value)
})

const ChainSelectedIndex = {
  "Arbitrum": 0,
  "Binance": 1,
  "Polygon": 2,
}
const networks = [Network.ARBITRUM, Network.BINANCE, Network.POLYGON]

const historical_tvl = ref([])
const poolSwapsData = ref([])
async function InitInvestments() {
  pairs.value = null
  pools.value = null
  if (networkId.value == 0) {
    return
  }

  if (networks_data.value.length == 0) {
    await InitNetworksData()
  }
  pools.value = []
  pairs.value = []
  historical_tvl.value = []
  poolSwapsData.value = []
  for (let i = 0; i < networks_data.value.length; i++) {
    if (chainSelected.value.name == "All Chains" || ChainSelectedIndex[chainSelected.value.name] == i) {
      let [_user, _poolSwapsData, _historicValues, _historical_tvl, _pairs] = networks_data.value[i]

      if (!_user || _user.length == 0) {
        continue
      }
      let userPools = _user.sharesOwned.map((share) => share.poolId)
      let formatted_pools = FormatPoolsData(userPools, _poolSwapsData, _historicValues, true)
      if (tokenPrices.value == {})
        tokenPrices.value = await GetTokenPricesBySymbols(_pairs.tokens.map((t) => t.symbol))
      tokensData.value = [...tokensData.value, ..._pairs.tokens.map((t) => ({ ...t, Blockchain: DisplayNetwork[networks[i]] }))]
      console.log("TOKENS DATA", tokensData.value)
      historicalPrices.value = [...historicalPrices.value, ...await GetHistoricalTokenPrices(Array.from(new Set([...tokensData.value.map(t => t.symbol)])))]
      historical_tvl.value = [...historical_tvl.value, ..._historical_tvl]
      poolSwapsData.value = [...poolSwapsData.value, ..._poolSwapsData]
      let formatted_historical_tvl = FormatHistoricalTvl(_historical_tvl)
      let formattedPools = FormatPortfolioPools(formatted_pools, _user, _poolSwapsData, formatted_historical_tvl, DisplayNetwork[networks[i]])
      let formattedPairs = FormatPortfolioPairs(_user, _poolSwapsData, _pairs, tokenPrices.value)
      pools.value = [...pools.value, ...formattedPools]
      pairs.value = [...pairs.value, ...formattedPairs]
      console.log(pools.value)
      console.log(pairs.value)
    }
  }
}
console.log("HERE")
const chainPairs = ref([])
async function InitNetworksData() {
  let chains_data = await Promise.all(networks.map((n) => InitUserData(account.value.toLowerCase(), n)))
  let result = []
  for (let i = 0; i < chains_data.length; i++) {
    let [_user, _poolSwapsData, _historicValues, historical_tvl, _pairs, _historicalBalances] = chains_data[i]
    if (!_user || _user.length == 0) {
      result.push([null, null, null, null, null])
      continue
    }
    let userPools = _user.sharesOwned.map((share) => share.poolId)
    let userPoolIds = userPools.map((p) => p.id)
    let filteredPoolSwapsData = _poolSwapsData.filter((item) => item.swaps[0]['poolIdVault'].filter((poolId) => userPoolIds.includes(poolId)).length > 0)
    filteredPoolSwapsData = GetActivePeriodsSwapsData(_historicalBalances, filteredPoolSwapsData)
    let filteredHistoricalTvl = historical_tvl.filter((item) => userPoolIds.includes(item.pool.id))
    chainPairs.value = [...chainPairs.value, ..._pairs.map((p) => ({ ...p, Blockchain: DisplayNetwork[networks[i]] }))]
    result.push([_user, filteredPoolSwapsData, _historicValues, filteredHistoricalTvl, _pairs, _historicalBalances])
  }
  networks_data.value = result

}







onMounted(async () => {
  InitTreasuryYields()
  if (window.ethereum !== undefined) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    networksSupported.value = (await provider.getNetwork())
  }

  if (window.ethereum === undefined || window.ethereum?._state?.accounts?.length === 0 || !localStorage.getItem('isConnectedToWeb3')) {
    NetworkUnsupported.value = false
    changeVisibleNetworkModal()
  }
  if (window.ethereum !== undefined && window.ethereum?._state?.accounts?.length !== 0 && networksSupported.value.chainId !== 42161 && networksSupported.value.chainId !== 56 && networksSupported.value.chainId !== 137) {
    NetworkUnsupported.value = true
    changeVisibleNetworkModal()
  }
  const mmProvider = await InitializeMetamask()
  account.value = ''
  if (!mmProvider) return

  if (networkId.value > 0)
    account.value = await mmProvider.getSigner().getAddress()


})
</script>
<style lang="sass">
@import '../../styles/_variables.scss'

.table-above
  display: flex
  align-items: center
  &_toggler
    margin-left: 5px
    font-size: 12px
    @media (max-width: $xxl)
    font-size: 10px


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
  background: #22222224
  border: 1px solid #FFFFFF0D
  box-shadow: 0px 4px 4px 0px #00000040

  .file-table-header-container
    max-width: none !important
    min-width: 200px !important

  .table
    min-width: 100% !important
    width: auto

@mixin cells-widths
  width: 150px
  @media (max-width: $xxl)
  width: 100px

  &:nth-child(1)
    width: 200px
    @media (max-width: $xxl)
    width: 130px


  &:nth-child(2)
    width: 600px
    @media (max-width: $xxl)
    width: 300px


.table-header-font-folder
  text-align: left !important
  @include cells-widths



.table
  &-body
    display: block
    max-height: 500px
    overflow-x: hidden
    overflow-y: auto
    &::-webkit-scrollbar-track
      -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3)
      background-color: #02120a
      border-radius: 50px
      margin-bottom: 10px

    &::-webkit-scrollbar
      width: 8px !important
      height: 8px !important
      background: #02120a
      border-radius: 50px

    &::-webkit-scrollbar-thumb
      border: 2px solid #02120a
      background: #00C9FF
      border-radius: 21px


  &-wrapper
    padding: 0
    outline: 0.5px solid rgba(163, 164, 165, 0.2196078431)
    width: 100%
    overflow-x: auto
    margin-bottom: 30px
    border-radius: 15.289px
    background: #22222224
    border: 1px solid #FFFFFF0D
    box-shadow: 0px 4px 4px 0px #00000040

  &-row
    border-color: transparent
    width: 100%
    display: table
    table-layout: fixed

  &-cell
    padding: 24px 0 24px 10px !important
    width: fit-content
    font-weight: 400
    white-space: nowrap
    font-size: 14px
    overflow: visible
    @include cells-widths
    @media (max-width: $xxl)
      font-size: 10px
      padding: 12px 0 12px 10px !important

    &:first-child
      padding: 24px 0 24px 45px !important
      text-align: left
      @media (max-width: $xxl)
        padding: 12px 0 12px 15px !important


    &:last-child
      padding: 24px 10px 24px 10px !important
      @media (max-width: $xxl)
        padding: 12px 10px 12px 10px !important

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
    @media (max-width: $xxl)
      font-size: 12px



.details-cell
  display: flex
  flex-wrap: wrap
  &__token-entity
    display: flex
    background: none
    &:not(:last-child)
      margin-right: 12px

    &__icon
      height: 24px
      width: 24px
      margin-right: 8px
      @media (max-width: $xxl)
        margin-right: 4px






.portfolio
  display: flex
  flex-direction: column
  align-items: flex-start
  max-width: 100%

  &-header
    color: #fff
    margin-bottom: 29px
    &__amount-percents
      font-size: clamp(10px, 0.8vw, 14px)
    &__title
      font-size: clamp(10px, 0.8vw, 14px)
      margin-bottom: 8px

      span
        margin-right: 8px

      svg
        cursor: pointer

    &__balance
      font-size:clamp(10px, 0.9vw, 26px)
      font-weight: 600
      margin-bottom: 8px

    &__variation
      display: flex
      align-items: center

      &-amount
        font-size: clamp(10px, 0.8vw, 14px)
        margin-right: 8px

      &-period
        font-size: clamp(9px, 0.7vw, 12px)
        padding: 2px 6px
        background-color: #1A1D1E
        border-radius: 5px

  &-stats
    display: flex
    margin-bottom: 28px
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
      font-size: clamp(10px, 0.8vw, 14px)
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
        color: #2DC24E

        svg
          transform-origin: center

          path
            fill: #2DC24E

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
    width: 100%

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

  

  &-financial-statement
    width: 100%
  &-statistics
    width: 100%
</style>
