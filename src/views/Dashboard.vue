<template>
  <SystemProfitDetailsModal :SystemProfitModalVisible="SystemProfitModalVisible" :SystemProfitTime="SystemProfitTime"
    @changeVisibleSystemProfitModal="changeVisibleSystemProfitModal('24 Hours')"
    :profitsDetails="profitsDetails[SystemProfitTime]" :symbol="currencySelected.symbol"
    :currencyDecimals="currencyDecimals == 0 ? 3 : currencyDecimals" />
  <MainCard>
    <!-- NEW DESIGN -->
    <div class="d-flex justify-content-between mb-4">
      <div>
        <ChainSelector @updateChain="(newChain) => (chainSelected = newChain)" />
      </div>
      <div>
        <CurrencySelector @updateCurrency="(newCurrency) => (currencySelected = newCurrency)" />
      </div>
    </div>

    <div class="d-flex justify-content-between flex-wrap gap-2 mb-xl-3 mb-2 mt-md-0 mt-3">
      <TotalWidget :text_header="'Total Value Deposit'" :text_value="numberToAposthrophe(tvlTotal, currencyDecimals)"
        :widget_icon="valueDeposit" :additional_symbol="currencySelected.symbol" />
      <TotalWidget :text_header="'Total Profits'" :additional_symbol="currencySelected.symbol"
        :text_value="numberToAposthrophe(profitTotal, currencyDecimals)" :widget_icon="ProfitsCart" />
      <TotalWidget :text_header="'Total Revenue'" :additional_symbol="currencySelected.symbol"
        :text_value="numberToAposthrophe(revenueTotal, currencyDecimals)" :widget_icon="RevenueGlobal" />
      <TotalWidget :text_header="'Last 7 Days APR'" :text_value="numberToAposthrophe(Number(weekApr).toFixed(0))"
        :widget_icon="VolumeList" :additional_symbol="'%'" />
    </div>
    <CRow>
      <CCol lg="12" xl="8" xxl="8" class="dashboard_charts_first_column">
        <CRow>
          <CCol md="12" lg="8" class="dashboard_charts_first_column">
            <StackedColumnChart :data="numberOfTradesSeries()" :dates="numberOfTradesDates" />
          </CCol>
          <CCol md="12" lg="4">
            <WidgetPieChart :data="pieChartData()" />
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="12">
            <ProfitRevenueChart :symbol="currencySelected.symbol" :data="profitRevenueSeries"
              :dates="profitRevenueDates" />
          </CCol>
        </CRow>
      </CCol>

      <CCol md="12" lg="12" xl="4" xxl="4">
        <div class="dashboard_second_column">
          <CCol md="12" xl="12" xxl="12">
            <CCard class="d-flex justify-content-between bot-volume">
              <div class="d-flex align-items-baseline gap-1">
                <Title :title="'System Profit'"> </Title>
                <VTooltip :distance="0" :placement="'right'">
                  <div style="cursor: help">
                    <img :src="info" class="info_icon" />
                  </div>
                  <template #popper>
                    <div style="
                        background: linear-gradient(
                          rgba(89, 89, 89, 0.75),
                          rgba(73, 73, 73, 0.15)
                        );
                        backdrop-filter: blur(10px);
                        padding: 10px;
                        border-radius: 4px;
                        width: 400px;
                      ">
                      <div style="font-size: clamp(10px, 0.9vw, 16px)">
                        Information
                      </div>
                      <p style="
                          display: flex;
                          flex-direction: column;
                          font-size: clamp(10px, 0.8vw, 14px);
                        ">
                        This component displays profits segmented daily, weekly,
                        and monthly. Track and gauge the bot's effectiveness and
                        financial gains over different time intervals.
                      </p>
                    </div>
                  </template>
                </VTooltip>
              </div>

              <CCardBody class="bot-volume__wrapper">
                <!-- <div v-if="monthlyProfitArb +
                monthlyProfitMatic +
                monthlyProfitBsc == 0
                ">
                <LoaderPulse></LoaderPulse>
              </div> -->
                <div>
                  <BotVolumeCard :currencyDecimals="currencyDecimals" :SystemProfitModalVisible="SystemProfitModalVisible"
                    @changeVisibleSystemProfitModal="
                      changeVisibleSystemProfitModal('24 Hours')
                      " :symbol="currencySelected.symbol" :volumeArb="profitsInfo.arbitrum.daily"
                    :volumeBsc="profitsInfo.binance.daily" :chainSelected="chainSelected"
                    :volumeMatic="profitsInfo.polygon.daily" :title="'24 hours'"
                    :previousVolumeArb="profitsInfo.arbitrum['day-past']"
                    :previousVolumeBsc="profitsInfo.binance['day-past']"
                    :previousVolumeMatic="profitsInfo.polygon['day-past']" :tooltipTitle="'Daily System Profit'" />
                  <BotVolumeCard :currencyDecimals="currencyDecimals" :SystemProfitModalVisible="SystemProfitModalVisible"
                    @changeVisibleSystemProfitModal="
                      changeVisibleSystemProfitModal('7 Days')
                      " :symbol="currencySelected.symbol" :volumeArb="profitsInfo.arbitrum.weekly"
                    :volumeBsc="profitsInfo.binance.weekly" :chainSelected="chainSelected"
                    :volumeMatic="profitsInfo.polygon.weekly" :previousVolumeArb="profitsInfo.arbitrum['week-past']"
                    :previousVolumeBsc="profitsInfo.binance['week-past']"
                    :previousVolumeMatic="profitsInfo.polygon['week-past']" :title="'7 days'"
                    :tooltipTitle="'Weekly System Profit'" />
                  <BotVolumeCard :currencyDecimals="currencyDecimals" :SystemProfitModalVisible="SystemProfitModalVisible"
                    @changeVisibleSystemProfitModal="
                      changeVisibleSystemProfitModal('30 Days')
                      " :symbol="currencySelected.symbol" :volumeArb="profitsInfo.arbitrum.monthly"
                    :volumeBsc="profitsInfo.binance.monthly" :chainSelected="chainSelected"
                    :volumeMatic="profitsInfo.polygon.monthly" :previousVolumeArb="profitsInfo.arbitrum['month-past']"
                    :previousVolumeBsc="profitsInfo.binance['month-past']"
                    :previousVolumeMatic="profitsInfo.polygon['month-past']" :title="'30 days'"
                    :tooltipTitle="'Monthly System Profit'" />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md="12" xl="12" xxl="12">
            <div>
              <BotVolumeWidget :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :items="volumeWidgetData" />
              <GasFeesWidget :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :items="feeWidgetData" />
            </div>
          </CCol>
        </div>
      </CCol>
    </CRow>

    <CRow>
      <CCol :lg="12" :xl="8" :xxl="8" class="mt-4">
        <div class="mb-4">
          <div class="d-flex justify-content-between mt-4 px-4">
            <div class="d-flex flex-column">
              <div class="d-flex align-items-center gap-1">
                <Title :title="'Trading Activity'"> </Title>
                <VTooltip :distance="0" :placement="'right'">
                  <div style="cursor: help">
                    <img :src="info" class="info_icon" />
                  </div>
                  <template #popper>
                    <div style="
                        background: linear-gradient(
                          rgba(89, 89, 89, 1),
                          rgba(73, 73, 73, 0.45)
                        );
                        backdrop-filter: blur(10px);
                        padding: 10px;
                        border-radius: 4px;
                      ">
                      <div style="font-size: clamp(10px, 0.9vw, 16px)">
                        Information
                      </div>
                      <div style="
                          display: flex;
                          flex-direction: column;
                          font-size: clamp(10px, 0.8vw, 14px);
                          width: 400px;
                        ">
                        Explore the interplay between Profit and Revenue over
                        time. Presented as a line chart, you can analyze both
                        metrics on a daily, weekly, or monthly basis.
                      </div>
                    </div>
                  </template>
                </VTooltip>
              </div>
            </div>
          </div>

          <CCardBody>
            <!-- <div v-else-if="trackingTradesLoading === false && filteredList.length === 0
              " class="my-4">

              <div class="d-flex justify-content-center text-white">
                <div class="d-flex" style="width: 35%">
                  <div style="width: 5%; border-radius: 10px 0px 0px 10px" class="bg-danger"></div>
                  <div style="
                  background: rgba(15, 17, 19, 1);
                  width: 95%;
                  border-radius: 0px 10px 10px 0px;
                  padding: 25px 10px;
                ">
                    <div class="d-flex gap-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M22 12C22 17.5228 17.5228 22 12 22H2.9937C2.11018 22 1.66771 20.9229 2.29245 20.2929L4.2495 18.3195C2.84334 16.597 2 14.397 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.2071 8.79289C15.5976 9.18342 15.5976 9.81658 15.2071 10.2071L13.4142 12L15.2071 13.7929C15.5976 14.1834 15.5976 14.8166 15.2071 15.2071C14.8166 15.5976 14.1834 15.5976 13.7929 15.2071L12 13.4142L10.2071 15.2071C9.81658 15.5976 9.18342 15.5976 8.79289 15.2071C8.40237 14.8166 8.40237 14.1834 8.79289 13.7929L10.5858 12L8.79289 10.2071C8.40237 9.81658 8.40237 9.18342 8.79289 8.79289C9.18342 8.40237 9.81658 8.40237 10.2071 8.79289L12 10.5858L13.7929 8.79289C14.1834 8.40237 14.8166 8.40237 15.2071 8.79289Z"
                          fill="#FF507A" />
                      </svg>

                      <h4>No Transactions Found</h4>
                    </div>
                    <div style="padding-left: 30px">
                      It looks like there were no trading activities for the
                      selected period. Please adjust your filters or check back
                      later for updated data.
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
            <div class="table-wrapper">
              <Table class="table_trading-activity" :headers="[
                'Trade',
                'Assets',
                'Strategy',
                'Route',
                'Volume',
                'Profit w Fees',
                'Gas Fees',
              ]">
                <div v-if="trackingTradesLoading === true" style="height: 500px">
                  <LoaderPulse />
                </div>
                <CTableBody v-else-if="filteredList.length > 0 && !trackingTradesLoading" class="text-white table-body"
                  :class="{ 'table-body_scroll': filteredList.length > 6 }">
                  <CTableRow v-for="(item, i) in filteredList" :key="i" class="table-row">
                    <CTableDataCell scope="row" class="text-white table-cell">
                      {{ getTimeDifferenceFormatted(item.date) }} <br />
                      <div class="d-flex align-items-center gap-2">
                        <img :src="computedNetwork(item.chain)" :width="20" :alt="item.chain" />
                        <a :href="getTransactionUrl(item.transactionHash, item.chain)
                          " target="_blank" class="transaction-link">
                          {{ addressShorthand(item.transactionHash) }}
                        </a>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell class="align-middle table-cell">
                      <div class="d-flex flex-column">
                        <div class="text-white d-flex justify-content-center align-items-center">
                          <img width="22" class="p-1" :src="computedTokenImage(item.token)" />
                          {{
                            `-${item.valueIn.toFixed(
                              currencyDecimals == 0 ? 2 : currencyDecimals,
                            )}${item.token} `
                          }}
                        </div>
                        <div class="text-green d-flex justify-content-center align-items-center">
                          <img width="22" class="p-1" :src="computedTokenImage(item.token)" />
                          <div class="d-flex">
                            {{
                              `+${item.valueOut.toFixed(
                                currencyDecimals == 0 ? 2 : currencyDecimals,
                              )}${item.token} `
                            }}
                          </div>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell class="align-middle table-cell">
                      <div class="text-white" v-if="item.strategie == 'arbFromTokensWith1InchAndVault'
                          ">
                        1inch
                      </div>
                      <div class="text-white" v-else-if="item.strategie == 'arbFromTokensWithVault'">
                        1inch Fusion
                      </div>
                      <div class="text-white" v-else-if="item.strategie ==
                        'arbFromTokensWith1InchUniV3AndVault'
                        ">
                        1inch
                      </div>
                      <div class="text-white" v-else-if="item.strategie == 'arbFromTokensWith1InchUniAndVault'
                        ">
                        1inch
                      </div>
                      <div class="text-white" v-else-if="item.strategie == 'arbFromTokensWithOdosAndVault'
                        ">
                        Odos
                      </div>
                      <div class="text-white" v-else-if="item.strategie == 'arbFromTokensWithFireBirdAndVault'
                        ">
                        Firebird
                      </div>
                    </CTableDataCell>
                    <CTableDataCell class="align-middle table-cell">
                      <div class="d-flex align-items-center flex-column justify-content-center">
                        <span class="text-danger">{{ item.buypath }}</span>
                        <CIcon icon="cil-arrow-top" class="mx-1 text-white" size="xl" style="transform: rotate(180deg)" />
                        <span class="text-success">{{ item.sellpath }}</span>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell class="align-middle table-cell">
                      <div class="text-white">
                        <span v-if="currencySelected.symbol === '₿'">
                          <img :src="btcSymbol" width="9" />
                        </span>
                        <span v-else-if="currencySelected.symbol === 'Ξ'">
                          <img :src="ethSymbol" width="9" />
                        </span>
                        <span v-else>{{ currencySelected.symbol }} </span>
                        {{
                          item.volumeUsd.toFixed(
                            currencyDecimals == 0 ? 2 : currencyDecimals,
                          )
                        }}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell class="align-middle table-cell">
                      <div :class="{
                            'd-flex align-items-center text-danger text-center justify-content-center':
                              Number(item.valueOut) < Number(item.valueIn) ||
                              Number(item.profit) < 0,
                            'd-flex align-items-center text-success text-center justify-content-center':
                              Number(item.valueOut) >= Number(item.valueIn) ||
                              Number(item.profit) > 0,
                          }">
                        <span v-if="currencySelected.symbol === '₿'">
                          <img :src="btcSymbol" width="9" />
                        </span>
                        <span v-else-if="currencySelected.symbol === 'Ξ'">
                          <img :src="ethSymbol" width="9" />
                        </span>
                        <span v-else>{{ currencySelected.symbol }} </span>{{
                          item.profit.toFixed(
                            currencyDecimals == 0 ? 2 : currencyDecimals,
                          )
                        }}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell class="table-cell align-middle">
                      <span class="text-secondary">{{
                        item.chain == 'binance'
                        ? item.gasFee.toFixed(
                          currencyDecimals == 0 ? 2 : currencyDecimals,
                        ) + ' BNB'
                        : item.chain == 'arbitrum'
                          ? item.gasFee.toFixed(
                            currencyDecimals == 0 ? 2 : currencyDecimals,
                          ) + ' ETH'
                          : item.gasFee.toFixed(
                            currencyDecimals == 0 ? 2 : currencyDecimals,
                          ) + ' MATIC'
                      }}
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow></CTableRow>
                </CTableBody>
              </Table>
            </div>
          </CCardBody>
        </div>
        <Pagination :perPage="perPage1" :pools="filteredList" :currentPage="currentPage1" @changePage="changePage1"
          @changePerPage="changePerPage1" :perPageOptions="perPageOptions"></Pagination>
      </CCol>
      <!-- <div v-if="filteredList.length !== 0" style="display: flex; gap: 5px; justify-content: end">
        <CButton color="primary" :disabled="currentPage === 1" @click="currentPage = 1">First
        </CButton>
        <CButton color="primary" :disabled="currentPage === 1" @click="changePage(-1)">
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.53 4.53442L4.69501 0.347936C4.9097 0.154714 5.23174 0.154714 5.42496 0.347936L5.91875 0.841727C6.11198 1.03495 6.11198 1.35699 5.91875 1.57168L2.61251 4.87793L5.91875 8.20564C6.11198 8.42033 6.11198 8.74237 5.91875 8.93559L5.42496 9.42938C5.23174 9.62261 4.9097 9.62261 4.69501 9.42938L0.53 5.2429C0.336777 5.04968 0.336777 4.72764 0.53 4.53442Z"
              fill="#00C9FF" />
          </svg>
        </CButton>
        <CButton color="primary">{{ currentPage }}</CButton>
        <CButton :disabled="currentPage === Math.ceil(listTxs.length / perPage)
          " @click="changePage(1)" color="primary">
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.26861 5.2429L2.10359 9.42938C1.8889 9.62261 1.56687 9.62261 1.37364 9.42938L0.879853 8.93559C0.686631 8.74237 0.686631 8.42033 0.879853 8.20564L4.1861 4.87793L0.879853 1.57168C0.686631 1.35699 0.686631 1.03495 0.879853 0.841727L1.37364 0.347936C1.56687 0.154714 1.8889 0.154714 2.10359 0.347936L6.26861 4.53442C6.46183 4.72764 6.46183 5.04968 6.26861 5.2429Z"
              fill="#7EF6B2" />
          </svg>
        </CButton>
        <CButton color="primary" :disabled="currentPage === Math.ceil(listTxs.length / perPage)
          " @click="
      currentPage = Math.ceil(listTxs.length / perPage)
      ">Last
        </CButton>
      </div> -->
      {{ console.log('tokensInfo', tokensInfo) }}
      <CCol :lg="12" :xl="4" :xxl="4" class="mt-4">
        <div class="mb-4">
          <div class="d-flex justify-content-between mt-4 px-4">
            <div class="d-flex align-items-baseline gap-1">
              <Title :title="'Top Trading Tokens'"> </Title>
              <VTooltip :distance="0" :placement="'right'">
                <div style="cursor: help">
                  <img :src="info" class="info_icon" />
                </div>
                <template #popper>
                  <div style="
                      background: linear-gradient(
                        rgba(89, 89, 89, 0.75),
                        rgba(73, 73, 73, 0.15)
                      );
                      backdrop-filter: blur(10px);
                      padding: 10px;
                      border-radius: 4px;
                      width: 400px;
                    ">
                    <div style="font-size: clamp(10px, 0.9vw, 16px)">
                      Information
                    </div>
                    <div style="
                        display: flex;
                        flex-direction: column;
                        font-size: clamp(10px, 0.8vw, 14px);
                      ">
                      <div>
                        Name: Full name of the asset along with used
                        abbreviation
                      </div>
                      <div>Price: Current market price of the asset</div>
                      <div>
                        Price Variation : Asset's price has changed in the last
                        24 hours.
                      </div>
                      <div>
                        Volume: Trading volume for the asset over the past 24
                        hours.
                      </div>
                    </div>
                  </div>
                </template>
              </VTooltip>
            </div>
          </div>
          <CCardBody>
            <div class="table-wrapper">
              <Table class="table_top-trading-tokens" :headers="['Name', 'Price', 'Volume', 'Balance']">
                <div v-if="topTradingTokens.length === 0" style="height: 500px">
                  <LoaderPulse />
                </div>
                <CTableBody v-if="topTradingTokens.length > 0" class="table-body"
                  :class="{ 'table-body_scroll': topTradingTokens.length > 6 }">
                  <CTableRow v-for="item in topTradingTokens" :key="item" class="table-row">
                    <CTableDataCell class="align-middle table-cell">
                      <DataTableCellTokenName :isSmall="true" :value="item['Name']" />
                    </CTableDataCell>
                    <CTableDataCell class="align-middle table-cell">
                      <div class="file-table-cell d-flex justify-content-center" v-if="item['Price']">
                        <span class="d-block"><span v-if="currencySelected.symbol === '₿'">
                            <img :src="btcSymbol" width="9" />
                          </span>
                          <span v-else-if="currencySelected.symbol === 'Ξ'">
                            <img :src="ethSymbol" width="9" />
                          </span>
                          <span v-else>{{ currencySelected.symbol }} </span>{{
                            item['Price'].toFixed(
                              currencyDecimals == 0 ? 2 : currencyDecimals,
                            )
                          }}</span>
                        <DataTableCellPriceChange :value="item['Change']" />
                      </div>
                      <div class="text-truncate file-table-cell" v-else>
                        no info
                      </div>
                    </CTableDataCell>
                    <CTableDataCell class="align-middle table-cell">
                      <div class="text-truncate file-table-cell">
                        {{ item['Volume'] }}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell class="align-middle table-cell">
                      <div class="text-truncate file-table-cell">
                        {{ formatBigNumber(item['Balance']) }}
                        {{ item['Symbol'] }}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </Table>
            </div>
          </CCardBody>
        </div>
      </CCol>
    </CRow>
  </MainCard>
</template>

<script setup>
import { CRow } from '@coreui/vue'
import { addressShorthand } from '@/lib/helpers/util'
import axios from 'axios'

import valueDeposit from '@/assets/icons/widgetsIcons/valueDeposit.svg'
import ProfitsCart from '@/assets/icons/widgetsIcons/ProfitsCart.svg'
import RevenueGlobal from '@/assets/icons/widgetsIcons/RevenueGlobal.svg'
import VolumeList from '@/assets/icons/widgetsIcons/VolumeList.svg'
import Pagination from '@/components/Manage/Pool/Pagination.vue'
import moment from 'moment'
// import ChainSelector from '@/components/ChainSelector'
import arb from '@/assets/images/networks/arbitrum.png'
import polygon from '@/assets/images/networks/polygon.png'
import binance from '@/assets/images/networks/binance2.png'
import useHandleTokensInfoDashboard from '@/composables/useHandleTokensInfoDashboard'
import DataTableCellTokenName from '@/components/DataTable/Cell/TokenName.vue'
import DataTableCellPriceChange from '@/components/DataTable/Cell/PriceChange.vue'
import BotVolumeCard from '@/components/BotVolumeCard/index.vue'
import { getTimeDifferenceFormatted } from '@/lib/helpers/util'
import { subgraphService } from '@/services/subgraph/subgraph.service'
import MainCard from '../UI/MainCard.vue'
import ChainSelector from '@/UI/ChainSelectorV2.vue'
import TotalWidget from '@/components/Widgets/TotalWidget.vue'
import StackedColumnChart from '@/components/Widgets/StackedColumnChart.vue'
import WidgetPieChart from '@/components/Widgets/WidgetPieChart.vue'
import ProfitRevenueChart from '@/components/Dashboard/ProfitRevenueChart.vue'
import GasFeesWidget from '@/components/Dashboard/GasFeesWidget.vue'
import BotVolumeWidget from '@/components/Dashboard/BotVolumeWidget.vue'
import numberToAposthrophe from '@/lib/formatter/numberToAposthrophe'

import LoaderPulse from '@/components/loaders/LoaderPulse.vue'

import {
  formatBigNumber,
  getStartOfMonthTimestamp,
  getStartOfWeekTimestamp,
  getLast7Days,
  timestampToWeekRange,
  getLastMonthDatesArray,
  getLastWeekDatesArray,
  timestampToWeekDayMonth,
  getMonthsArray,
  timestampToMonth,
  getStartOfYearFirstMonthTimestamp,
  sumFields,
} from '@/lib/utils'
import { GetHistoricalTvl } from '@/composables/pools/snapshots/usePoolHistoricalTvl'
import { FormatHistoricalTvl } from '@/lib/formatter/poolTvlFormatter'
import {
  isRightChain,
  isRightChainName,
  convertSwapsCurrency,
  convertUsdToCurrencySymbol,
  usePool24hProfitTokens,
  usePool7dProfitTokens,
  usePool30dProfitTokens,
  usePool24hProfitTokensAmount,
  usePool7dProfitTokensAmount,
  usePool30dProfitTokensAmount,
} from '@/composables/pools/usePoolSwapsStats'
import { GetPools } from '@/composables/pools/usePools'
import Table from '@/UI/Table.vue'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { DisplayNetwork, Network } from '@/composables/useNetwork'
import { CalculateWeekAvgApr } from '@/composables/math/chartMath/trackingInfoMath.js'
import { calculatePercentage } from '@/composables/math/chartMath/trackingInfoMath'
import { excludeKeyFromObject } from '@/lib/utils/index'
import hours24 from '@/assets/icons/widgetsIcons/timelines/hours24.svg'
import month1 from '@/assets/icons/widgetsIcons/timelines/month1.svg'
import months6 from '@/assets/icons/widgetsIcons/timelines/months6.svg'
import allTime from '@/assets/icons/widgetsIcons/timelines/allTime.svg'
import Title from '@/UI/Title.vue'
import computedTokenImage from '@/composables/useComputedTokenImage'
import CurrencySelector from '@/UI/CurrencySelector.vue'
import SystemProfitDetailsModal from '@/components/modals/SystemProfitDetailsModal.vue'
import { GetTokenPricesBySymbols } from '@/composables/balances/cryptocompare'
import info from '@/assets/images/info.svg'
import btcSymbol from '@/assets/images/tokens/btcSymbol.png'
import ethSymbol from '@/assets/images/tokens/ethSymbol.png'

const SystemProfitModalVisible = ref(false)
const SystemProfitTime = ref('24 Hours')

const chainSelected = ref({ code: 'ALL', name: 'All Chains' })

const currencySelected = ref({ symbol: '$' })
const currencyDecimals = computed(() =>
  currencySelected.value.symbol == '$' ? 0 : 5,
)

const ago = ref('')
const oldTime = ref(new Date())
const interval = ref(
  setInterval(() => {
    ago.value = moment(oldTime.value).fromNow()
  }, 1000),
)

const profits_chain_template = {
  daily: null,
  'day-past': 0,
  weekly: null,
  'week-past': 0,
  monthly: null,
  'month-past': 0,
  yearly: 0,
}

const profitsInfo = ref({
  arbitrum: { ...profits_chain_template },
  polygon: { ...profits_chain_template },
  binance: { ...profits_chain_template },
})

const tokensInfoArbitrum = ref([])

const tokensInfoBsc = ref([])

const tokensInfoMatic = ref([])
const swapsData = ref([])
const tokens_data = ref([])
const profitsDetails = computed(() =>
  chainSwapsData.value.length > 0 && tokens_data.value.length > 0
    ? {
      '24 Hours': {
        currency: usePool24hProfitTokens(
          chainSwapsData.value,
          tokens_data.value,
        ),
        token: usePool24hProfitTokensAmount(
          chainSwapsData.value,
          tokens_data.value,
        ),
      },
      '7 Days': {
        currency: usePool7dProfitTokens(
          chainSwapsData.value,
          tokens_data.value,
        ),
        token: usePool7dProfitTokensAmount(
          chainSwapsData.value,
          tokens_data.value,
        ),
      },
      '30 Days': {
        currency: usePool30dProfitTokens(
          chainSwapsData.value,
          tokens_data.value,
        ),
        token: usePool30dProfitTokensAmount(
          chainSwapsData.value,
          tokens_data.value,
        ),
      },
    }
    : [],
)

function changeVisibleSystemProfitModal(time) {
  if (!profitsDetails.value[time]) return
  SystemProfitTime.value = time
  SystemProfitModalVisible.value = !SystemProfitModalVisible.value
}

const listTxs = ref([])
const currentTradeTab = ref('daily')
const trackingTradesLoading = ref(true)
const perPage1 = ref(10)
const currentPage1 = ref(1)


function changePerPage1(v1) {
  perPage1.value = Number(v1)
  currentPage1.value = 1
}

const perPageOptions = computed(() => {
  return [10, 25, 50]
})


function changePage1(args) {
  if (args.isEquating == false) {
    currentPage1.value = currentPage1.value + args.num
  } else {
    currentPage1.value = args.num
  }
}

const networks = [
  process.env.VUE_APP_KEY_ARBITRUM ? Network.ARBITRUM : undefined,
  process.env.VUE_APP_KEY_BINANCE ? Network.BINANCE : undefined,
  process.env.VUE_APP_KEY_POLYGON ? Network.POLYGON : undefined,
].filter((n) => n != undefined)

const topTradingTokens = computed(() => {
  let result = []
  let chainTokens = {
    [Network.ARBITRUM]: tokensInfoArbitrum.value,
    [Network.BINANCE]: tokensInfoBsc.value,
    [Network.POLYGON]: tokensInfoMatic.value,
  }
  for (const [key, value] of Object.entries(chainTokens)) {
    if (
      value &&
      isRightChainName(DisplayNetwork[key], chainSelected.value.name)
    ) {
      for (let k = 0; k < value.length; k++) {
        let item = value[k]
        let found = result.find((t) => t.Name == item.Name)
        if (found) {
          found = sumFields([item, found], ['Balance', 'BalanceUsd'])
        } else {
          result.push(item)
        }
      }
    }
  }

  return result
    .sort((a, b) => b.Volume - a.Volume)
    .map((item) => excludeKeyFromObject(item, ['BalanceUsd']))
})

const filteredList = computed(() => {
  let txs = listTxs.value
    .filter(
      (el) =>
        moment(el.date).unix() > moment().subtract(1, 'months').unix() &&
        isRightChain(el, chainSelected.value.name),
    )
    .sort((a, b) => Date.parse(new Date(a.date)) - Date.parse(new Date(b.date)))
    .reverse()
  const star = (currentPage1.value - 1) * perPage1.value
  const end = currentPage1.value * perPage1.value
  const result = txs.slice(star, end)
  return result.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const last7Days = getLast7Days()

const tradesChains = computed(() =>
  chainSelected.value.name.toLowerCase() == 'all chains'
    ? [
      process.env.VUE_APP_KEY_ARBITRUM
        ? DisplayNetwork[Network.ARBITRUM]
        : undefined,
      process.env.VUE_APP_KEY_BINANCE
        ? DisplayNetwork[Network.BINANCE]
        : undefined,
      process.env.VUE_APP_KEY_POLYGON
        ? DisplayNetwork[Network.POLYGON]
        : undefined,
    ].filter((n) => n != undefined)
    : [chainSelected.value.name],
)
const numberOfTradesDates = computed(() => last7Days.map((d) => d.date))

function numberOfTradesSeries() {
  if (swapsData.value.length > 0) {
    return tradesChains.value.map((c) => ({
      name: c,
      data: getLast7DaysTrades(c),
    }))
  } else {
    return 0
  }
}

function getLast7DaysTrades(chain) {
  let filtered = swapsData.value.filter(
    (d) => d.chain.toLowerCase() == chain.toLowerCase(),
  )

  let result = []
  for (let i = 0; i < last7Days.length; i++) {
    let dayInfo = last7Days[i]
    let dayTrades = filtered.filter(
      (item) =>
        item.timestamp >= dayInfo.timestampStart &&
        item.timestamp <= dayInfo.timestampEnd,
    ).length
    result.push(dayTrades)
  }
  return result
}

function computedNetwork(chain) {
  if (chain === 'arbitrum') {
    return arb
  }
  if (chain === 'binance') {
    return binance
  }
  if (chain === 'polygon') {
    return polygon
  }
}

async function fetchAutomaticData() {
  let links = [
    process.env.VUE_APP_OUTPUT_LINK_ARBITRUM,
    process.env.VUE_APP_OUTPUT_LINK_BINANCE,
    process.env.VUE_APP_OUTPUT_LINK_POLYGON,
  ]
  await Promise.all(
    links.map((l) =>
      l != undefined
        ? axios.get(`${l}/fetch-data`, {
          timeout: 120000,
        })
        : new Promise((resolve) => {
          resolve({ data: [] })
        }),
    ),
  )
}

function getTransactionUrl(transactionHash, chain) {
  if (chain === 'arbitrum') {
    return `${process.env.VUE_APP_EXPLORER_ARBITRUM}/tx/${transactionHash}`
  }
  if (chain === 'binance') {
    return `${process.env.VUE_APP_EXPLORER_BINANCE}/tx/${transactionHash}`
  }
  if (chain === 'polygon') {
    return `${process.env.VUE_APP_EXPLORER_POLYGON}/tx/${transactionHash}`
  }
}

const currency_prices = ref(null)

async function fetchDataAndMerge() {
  currency_prices.value = await GetTokenPricesBySymbols(['BTC', 'ETH'])
  console.log('Starting requests...')

  let links = [
    process.env.VUE_APP_OUTPUT_LINK_ARBITRUM,
    process.env.VUE_APP_OUTPUT_LINK_BINANCE,
    process.env.VUE_APP_OUTPUT_LINK_POLYGON,
  ]
  const [response1, response2, response3] = await Promise.all(
    links.map((l) =>
      l != undefined
        ? axios.get(`${l}/output`)
        : new Promise((resolve) => {
          resolve({ data: [] })
        }),
    ),
  )

  console.log('All requests completed!')

  const addChainToData = (data, chain) => {
    if (Array.isArray(data)) {
      return data.map((item) => ({ ...item, chain }))
    }
    return [{ ...data, chain }]
  }

  let data1 = response1.data
  let data2 = response2.data
  let data3 = response3.data

  data1 = data1.length > 0 ? addChainToData(data1, 'arbitrum') : []
  data2 = data2.length > 0 ? addChainToData(data2, 'binance') : []
  data3 = data3.length > 0 ? addChainToData(data3, 'polygon') : []
  let mergedData = []

  mergedData = [...data1, ...data2, ...data3]

  mergedData = convertSwapsCurrency(
    mergedData,
    currency_prices.value,
    currencySelected.value.code,
  )
  return mergedData
}

const poolsData = ref([])
const chainPoolsData = computed(() =>
  poolsData.value.filter((p) => isRightChain(p, chainSelected.value.name)),
)
const tvlTotal = computed(() =>
  chainPoolsData.value.reduce(
    (sum, item) => sum + parseFloat(item.totalLiquidity),
    0,
  ),
)
console.log(chainPoolsData)
console.log(tvlTotal)

async function fetchPools() {
  const chains = [Network.ARBITRUM, Network.BINANCE, Network.POLYGON]
  let pools = await Promise.all(
    chains.map((chain) =>
      GetPools(chain, null, true, true, currencySelected.value.code),
    ),
  )
  return chains
    .map((chain, i) =>
      pools[i].map((pool) => ({ ...pool, chain: DisplayNetwork[chain] })),
    )
    .flat()
}

const historicalTvl = ref([])
//const chainHistoricalTvl = computed(() => historicalTvl.value[capitalizeFirstLetter(chainSelected.value.name.toLowerCase())])
const weekApr = computed(() =>
  CalculateWeekAvgApr(
    historicalTvl.value,
    chainSwapsData.value,
    chainSelected.value.name,
  ),
)

async function fetchHistoricalTvl() {
  const chains = [Network.ARBITRUM, Network.BINANCE, Network.POLYGON]
  let historical_tvl = await Promise.all(
    chains.map((chain) =>
      GetHistoricalTvl(chain, null, currencySelected.value.code),
    ),
  )
  return FormatHistoricalTvl(
    chains
      .map((chain, i) =>
        historical_tvl[i].map((tvl) => ({
          ...tvl,
          chain: DisplayNetwork[chain],
        })),
      )
      .flat(),
  )
}

async function fetchData() {
  return await Promise.all([
    fetchDataAndMerge(),
    fetchPools(),
    fetchHistoricalTvl(),
  ])
}

const profitTotal = computed(() => {
  let profits = chainSwapsData.value.map((item) => item.profitUsd)
  let res = profits.reduce((sum, value) => sum + parseFloat(value), 0)
  console.log(res)
  console.log(chainSwapsData.value.filter((v) => v.profitUsd > 1000))
  return res
})
const revenueTotal = computed(() => {
  let profits = chainSwapsData.value.map((item) => item.revenueUsd)
  return profits.reduce((sum, value) => sum + parseFloat(value), 0)
})

const chainSwapsData = computed(() =>
  swapsData.value.filter((item) =>
    isRightChain(item, chainSelected.value.name),
  ),
)

const hours24volume = computed(() =>
  swapsData.value.length > 0
    ? chainSwapsData.value
      .filter((item) => item.timestamp >= moment().subtract(1, 'days').unix())
      .reduce((sum, value) => sum + parseFloat(value.volumeUsd), 0)
    : null,
)
const hours24PrevVolume = computed(() =>
  chainSwapsData.value
    .filter(
      (item) =>
        item.timestamp >= moment().subtract(2, 'days').unix() &&
        item.timestamp <= moment().subtract(1, 'days').unix(),
    )
    .reduce((sum, value) => sum + parseFloat(value.volumeUsd), 0),
)
const weekvolume = computed(() =>
  swapsData.value.length > 0
    ? chainSwapsData.value
      .filter((item) => item.timestamp >= moment().subtract(7, 'days').unix())
      .reduce((sum, value) => sum + parseFloat(value.volumeUsd), 0)
    : null,
)
const weekPrevVolume = computed(() =>
  chainSwapsData.value
    .filter(
      (item) =>
        item.timestamp >= moment().subtract(14, 'days').unix() &&
        item.timestamp <= moment().subtract(7, 'days').unix(),
    )
    .reduce((sum, value) => sum + parseFloat(value.volumeUsd), 0),
)
const monthvolume = computed(() =>
  swapsData.value.length > 0
    ? chainSwapsData.value
      .filter(
        (item) => item.timestamp >= moment().subtract(1, 'months').unix(),
      )
      .reduce((sum, value) => sum + parseFloat(value.volumeUsd), 0)
    : null,
)
const monthPrevVolume = computed(() =>
  chainSwapsData.value
    .filter(
      (item) =>
        item.timestamp >= moment().subtract(2, 'months').unix() &&
        item.timestamp <= moment().subtract(1, 'months').unix(),
    )
    .reduce((sum, value) => sum + parseFloat(value.volumeUsd), 0),
)
const allTimevolume = computed(() =>
  swapsData.value.length > 0
    ? chainSwapsData.value.reduce(
      (sum, value) => sum + parseFloat(value.volumeUsd),
      0,
    )
    : null,
)

const volumeWidgetData = computed(() => [
  {
    timeline: '24 hours',
    value: hours24volume.value,
    icon: hours24,
    progress: calculatePercentage(hours24PrevVolume.value, hours24volume.value),
  },
  {
    timeline: '7 days',
    value: weekvolume.value,
    icon: month1,
    progress: calculatePercentage(weekPrevVolume.value, weekvolume.value),
  },
  {
    timeline: '30 days',
    value: monthvolume.value,
    icon: months6,
    progress: calculatePercentage(monthPrevVolume.value, monthvolume.value),
  },
  {
    timeline: 'All-Time',
    value: allTimevolume.value,
    icon: allTime,
    progress: 0,
  },
])

const hours24fee = computed(() =>
  swapsData.value.length > 0
    ? chainSwapsData.value
      .filter((item) => item.timestamp >= moment().subtract(1, 'days').unix())
      .reduce((sum, value) => sum + parseFloat(value.gasFeeUsd), 0)
    : null,
)
const hours24PrevFee = computed(() =>
  chainSwapsData.value
    .filter(
      (item) =>
        item.timestamp >= moment().subtract(2, 'days').unix() &&
        item.timestamp <= moment().subtract(1, 'days').unix(),
    )
    .reduce((sum, value) => sum + parseFloat(value.gasFeeUsd), 0),
)
const monthFee = computed(() =>
  swapsData.value.length > 0
    ? chainSwapsData.value
      .filter(
        (item) => item.timestamp >= moment().subtract(1, 'months').unix(),
      )
      .reduce((sum, value) => sum + parseFloat(value.gasFeeUsd), 0)
    : null,
)
const prevMonthFee = computed(() =>
  chainSwapsData.value
    .filter(
      (item) =>
        item.timestamp >= moment().subtract(2, 'months').unix() &&
        item.timestamp <= moment().subtract(1, 'months').unix(),
    )
    .reduce((sum, value) => sum + parseFloat(value.gasFeeUsd), 0),
)
const weekFee = computed(() =>
  swapsData.value.length > 0
    ? chainSwapsData.value
      .filter((item) => item.timestamp >= moment().subtract(7, 'days').unix())
      .reduce((sum, value) => sum + parseFloat(value.gasFeeUsd), 0)
    : null,
)
const prevWeekFee = computed(() =>
  chainSwapsData.value
    .filter(
      (item) =>
        item.timestamp >= moment().subtract(14, 'days').unix() &&
        item.timestamp <= moment().subtract(7, 'days').unix(),
    )
    .reduce((sum, value) => sum + parseFloat(value.gasFeeUsd), 0),
)

const allTimeFee = computed(() =>
  swapsData.value.length > 0
    ? chainSwapsData.value.reduce(
      (sum, value) => sum + parseFloat(value.gasFeeUsd),
      0,
    )
    : null,
)
const sorted = computed(() =>
  swapsData.value.length > 0
    ? [...chainSwapsData.value].sort((a, b) => a.gasFeeUsd - b.gasFeeUsd)
    : [],
)
console.log('SORTED - ', sorted)
const feeWidgetData = computed(() => [
  {
    timeline: '24 hours',
    value: hours24fee.value,
    icon: hours24,
    progress: Math.floor(
      calculatePercentage(hours24PrevFee.value, hours24fee.value),
    ),
  },
  {
    timeline: '7 days',
    value: weekFee.value,
    icon: month1,
    progress: Math.floor(calculatePercentage(prevWeekFee.value, weekFee.value)),
  },
  {
    timeline: '30 days',
    value: monthFee.value,
    icon: months6,
    progress: Math.floor(
      calculatePercentage(monthFee.value, prevMonthFee.value),
    ),
  },
  {
    timeline: 'All-Time',
    value: allTimeFee.value,
    icon: allTime,
    progress: 0,
  },
])

const profitRevenueMap = {
  Daily: {
    getTimeArray: getLastWeekDatesArray,
    formatTime: timestampToWeekDayMonth,
    getStart: getStartOfWeekTimestamp,
  },
  Weekly: {
    getTimeArray: getLastMonthDatesArray,
    formatTime: timestampToWeekRange,
    getStart: getStartOfMonthTimestamp,
  },
  Monthly: {
    getTimeArray: getMonthsArray,
    formatTime: timestampToMonth,
    getStart: getStartOfYearFirstMonthTimestamp,
  },
}

const profitRevenueData = computed(() => ({
  Daily: getProfitRevenueByTimeline('Daily'),
  Weekly: getProfitRevenueByTimeline('Weekly'),
  Monthly: getProfitRevenueByTimeline('Monthly'),
}))
const profitRevenueDates = computed(() => {
  if (swapsData.value.length > 0) {
    return {
      Daily: profitRevenueData.value['Daily'].dates,
      Weekly: profitRevenueData.value['Weekly'].dates,
      Monthly: profitRevenueData.value['Monthly'].dates,
    }
  } else {
    return 0
  }
})
console.log('DATA - ', profitRevenueData)
console.log('DATES - ', profitRevenueDates)

const profitRevenueSeries = computed(() => {
  if (swapsData.value.length > 0) {
    return {
      Daily: profitRevenueData.value['Daily'].data,
      Weekly: profitRevenueData.value['Weekly'].data,
      Monthly: profitRevenueData.value['Monthly'].data,
    }
  } else {
    return 0
  }
})

function getProfitRevenueByTimeline(timeline) {
  let dates = profitRevenueMap[timeline].getTimeArray()

  let data = [
    {
      name: 'Revenue',
      data: [],
      xAxisIndex: 0,
    },
    {
      name: 'Profit',
      data: [],
      xAxisIndex: 0,
    },
  ]
  console.log(dates)
  for (let i = 0; i < dates.length; i++) {
    let date = dates[i]
    let start = profitRevenueMap[timeline].getStart()
    let items = chainSwapsData.value.filter(
      (item) =>
        item.timestamp >= start &&
        profitRevenueMap[timeline].formatTime(item.timestamp) == date,
    )
    let chart_decimals =
      currencyDecimals.value == 0 ? 3 : currencyDecimals.value
    if (items.length > 0) {
      data[1].data.push(
        items
          .reduce((sum, value) => sum + parseFloat(value.profitUsd), 0)
          .toFixed(chart_decimals),
      )
      data[0].data.push(
        items
          .reduce((sum, value) => sum + parseFloat(value.revenueUsd), 0)
          .toFixed(chart_decimals),
      )
    } else {
      data[1].data.push(0)
      data[0].data.push(0)
    }
  }
  return {
    dates,
    data,
  }
}

let platformCodes = ['1inch', 'firebird', 'odos', 'arbfromtokenswithvault']

function platformSeries() {
  let series = []

  // console.log('chainSwapsData', chainSwapsData.value)

  if (swapsData.value.length > 0) {
    let chainSwaps = [...chainSwapsData.value]
    for (let i = 0; i < platformCodes.length; i++) {
      let code = platformCodes[i]
      let filtered_swaps = chainSwaps.filter((item) =>
        item.functionName.toLowerCase().includes(code),
      )
      chainSwaps = chainSwaps.filter((s) => !filtered_swaps.includes(s))
      series.push(filtered_swaps.length)
    }
    return series
  } else {
    return 0
  }
}

const platform_series = computed(() => platformSeries())
const all_platform_labels = ['1Inch', 'FireBird', 'Odos', '1Inch Fusion']
const all_platform_colors = ['#00C7FC', '#00DFEF', '#282D73', '#0099EA']
function pieChartData() {
  let labels = []
  let colors = []
  let series = []
  for (let i = 0; i < platform_series.value.length; i++) {
    let value = platform_series.value[i]
    if (value != 0) {
      labels.push(all_platform_labels[i])
      colors.push(all_platform_colors[i])
      series.push(value)
    }
  }
  return {
    labels: labels,
    colors: colors,
    series: series,
  }
}

async function initData() {
  trackingTradesLoading.value = true
  //const date = new Date()

  let [data, pools, historical_tvl] = await fetchData()
  poolsData.value = pools
  historicalTvl.value = historical_tvl
  swapsData.value = [...data]
  // Assuming both responses are objects, merge them
  let dataArb = data.filter((item) => item.chain == 'arbitrum')
  let dataPolygon = data.filter((item) => item.chain == 'polygon')
  let dataBinance = data.filter((item) => item.chain == 'binance')
  let chains_data = {
    arbitrum: dataArb,
    polygon: dataPolygon,
    binance: dataBinance,
  }

  let keys = Object.keys(profits_chain_template)
  for (let i = 0; i < networks.length; i++) {
    let chain = DisplayNetwork[networks[i]].toLowerCase()
    for (let k = 0; k < keys.length; k++) {
      profitsInfo.value[chain][keys[k]] = subgraphService.trades.getProfit(
        keys[k],
        chains_data[chain],
        chain,
      )
    }
  }

  listTxs.value = subgraphService.trades.getTxsInfo(
    data,
    currentTradeTab.value,
    [],
  )
  console.log('LIST TXS - ', listTxs.value)

  trackingTradesLoading.value = false
  const results = {}

  let tokensInfo = await Promise.all(
    networks.map(async (network) =>
      useHandleTokensInfoDashboard(
        data.filter((d) => d.chain == DisplayNetwork[network].toLowerCase()),
        network,
        currencySelected.value.code,
      ),
    ),
  )
  networks.map((network, i) => {
    results[network] = tokensInfo[i].map((t) => ({
      ...t,
      BalanceUsd: convertUsdToCurrencySymbol(
        t.BalanceUsd,
        currency_prices.value,
        currencySelected.value.code,
      ),
    }))
  })
  tokensInfoArbitrum.value = results[Network.ARBITRUM] || []
  tokensInfoBsc.value = results[Network.BINANCE] || []
  tokensInfoMatic.value = results[Network.POLYGON] || []
  tokens_data.value = tokensInfoArbitrum.value
    .concat(tokensInfoBsc.value)
    .concat(tokensInfoMatic.value)
}

watch(currencySelected, async () => {
  poolsData.value = []
  historicalTvl.value = []
  swapsData.value = []
  let keys = Object.keys(profits_chain_template)
  for (let i = 0; i < networks.length; i++) {
    let chain = DisplayNetwork[networks[i]].toLowerCase()
    for (let k = 0; k < keys.length; k++) {
      profitsInfo.value[chain][keys[k]] = null
    }
  }
  await initData()
})
onUnmounted(() => {
  clearInterval(interval.value)
})

// onMounted(async () => {
//   const b = await initData()
//   if (b) {
//     await fetchAutomaticData()
//   }
// })
</script>
<style lang="scss">
@import '../styles/_variables.scss';

@mixin trading-activity-cells {
  width: 100px;

  @media (max-width: $xxl) {
    width: 70px;
  }

  &:nth-child(1) {
    width: 270px;

    @media (max-width: $xxl) {
      width: 200px;
    }
  }

  &:last-child {
    width: 150px;

    @media (max-width: $xxl) {
      width: 100px;
    }
  }
}

@mixin top-trading-tokes-cell {
  width: 100px;

  @media (max-width: $xxl) {
    width: 60px;
  }

  &:first-child {
    width: 150px;

    @media (max-width: $xxl) {
      width: 60px;
    }
  }

  &:nth-child(2) {
    @media (max-width: $xxl) {
      width: 100px;
    }
  }
}

.table_trading-activity {
  .table-cell {
    @include trading-activity-cells;
  }

  .table-header-font-folder {
    @include trading-activity-cells;
  }
}

.table_top-trading-tokens {
  .table-cell {
    @include top-trading-tokes-cell;
  }

  .table-header-font-folder {
    @include top-trading-tokes-cell;
  }
}

.table {
  &-body {
    display: block;
    height: 500px;
    overflow-x: hidden;
    overflow-y: auto;

    &_scroll {
      .table-row {
        width: calc(100% + 8px);
      }
    }

    &::-webkit-scrollbar-track {
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 50px;
      margin-bottom: 10px;
      padding: 2px !important;
      width: 8px;
    }

    &::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
      border-radius: 50px;
    }

    &::-webkit-scrollbar-thumb {
      border: 2px solid transparent;
      padding: 2px !important;
      background: #00C9FF;
      border-radius: 20px;
    }
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
    text-align: center;
    font-weight: 400;
    white-space: nowrap;
    font-size: 14px;
    overflow: visible;

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

  &-wrapper {
    padding: 0;
    border-radius: 15.289px;
    background: linear-gradient(153deg, #000 0%, rgba(0, 0, 0, 0.00) 100%);
    backdrop-filter: blur(20.067087173461914px);
    width: 100%;
    overflow-x: auto;

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
      background-color: #02120a;
      border-radius: 50px;
    }

    &::-webkit-scrollbar {
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

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .reload_button:hover path {
    stroke: #00C9FF !important;
  }

  .reload_button__active {
    animation: rotate 2s linear infinite;
  }

  .activities_tabs {
    flex-direction: column;
  }

  .activities_tab {
    border-radius: 0px;
    padding: 5px 10px;
  }

  .bot_text {
    font-size: 16px;
  }

  @media (min-width: $lg) {
    .activities_tabs {
      flex-direction: row;
    }

    .bot_text {
      font-size: 20px;
    }

    .activities_tab {
      border-radius: 0.375rem;
      padding: 10px 15px 10px 15px;
    }
  }

  .multiselect__tags {
    background: none !important;
    border-color: #00C9FF !important;
  }

  .multiselect__content-wrapper {
    border-color: #00C9FF !important;
  }

  .multiselect__single {
    background: none !important;
    color: white !important;
  }

  .multiselect__option {
    background: rgb(15, 17, 19) !important;
    color: white !important;
  }

  .multiselect__option:hover {
    background: rgba(1, 180, 126, 0.884) !important;
  }

  .transaction-link {
    text-decoration: none;
  }

  .transaction-link:hover {
    color: rgba(1, 180, 126, 0.884);
  }

  .text-green {
    color: rgb(74 222 128);
  }

  .border-dotted {
    border-bottom-style: dotted;
    border-bottom-width: 1px;
  }
}

.bot-volume {
  background: transparent;
  border: none;

  &__wrapper {
    border-radius: 15px;
    backdrop-filter: blur(60px);
    background: linear-gradient(356.2deg, #00c8ff0e 0%, #000000 105.42%);

  }

  &__card {
    border-radius: 10px;
    background: linear-gradient(356.2deg, #00c8ff0e 0%, #000000 105.42%);

    border: none;

    &:last-child {
      margin-bottom: 0 !important;
    }
  }
}

.dashboard_charts_first_column {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.dashboard_second_column {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

@media (max-width: $xxl2) {
  .dashboard_charts_first_column {
    justify-content: flex-start;
  }
}

@media (max-width: $xxl) {
  .dashboard_charts_first_column {
    margin-bottom: 10px;
  }

  .dashboard_second_column {
    height: auto;
    gap: 30px;
    flex-direction: column;
  }
}

@media (max-width: $xl) {
  .dashboard_second_column {
    flex-direction: column;
  }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
