<template>
  <MainCard>
    <CRow class="d-flex">
      <CRow class="text-white d-flex align-items-center mb-2">
        <div class="d-flex align-items-center gap-3 justify-between" style="justify-content:space-between;">
          <!-- <div style="font-size: 20px; font-weight: 600">Track Trades</div> -->
          <div>
            <ChainSelector @updateChain="(newChain) => (chainSelected = newChain)" />
          </div>
          <CurrencySelector @updateCurrency="(newCurrency) => (currencySelected = newCurrency)" />

        </div>

      </CRow>

      <div style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        ">
        <!-- <CInputGroup
        class="mb-3 mt-2 d-flex align-items-center justify-content-start search-input-group"
      >
        <CAvatar :src="Search" style="width: 15px; margin-left: 10px;" />
        <CFormInput
          type="text"
          placeholder="Filter by Strategy / token / Profit"
          aria-label="Filter by token: All"
          class="search-input"
          style="color: white;"
          v-model="filter"
        />

      </CInputGroup> -->
        <!-- <div style="display: flex; align-items: center; margin-bottom: 10px">
          <ReloadButton
            :isLoading="fetchIsLoading"
            :fetchTradingData="fetchTradingData"
            :ago="ago"
          />
        </div> -->
      </div>

      <div class="text-white d-flex flex-column mt-xxl-3 mt-0">
        <div v-if="width > 768" class="d-flex align-items-center gap-1">
          <Title :title="'Trades Chart'"> </Title>
          <VTooltip :distance="0" :placement="'right-start'">
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
                  ">
                  <span>
                    <span style="font-weight: 700">Number of trades: </span>Represents the total count of trades executed
                    within a
                    specific timeframe
                  </span>
                  <!-- <span>
                    <span style="font-weight: 700">TVL: </span>Total Value Lock
                  </span> -->
                  <span>
                    <span style="font-weight: 700">Avg Profit per Trade: </span>Sum of Profits per trade divided by the
                    number of trades
                    within a specific timeframe
                  </span>
                  <span>
                    <span style="font-weight: 700">Gas Fees: </span>Gas Fee
                    Spent In Native Token
                  </span>
                </div>
              </div>
            </template>
          </VTooltip>
        </div>

        <div class="track_info_container">
          <ArbitrageBotCardTrades :data="botCardValues" :chainSelected="chainSelected.name"
            :currencySelected="currencySelected" />

          <div class="track_chart_card">
            <div v-if="isLoading" class="chart_inside">
              <LoaderPulse />
            </div>
            <div v-else class="chart_inside">
              <div class="timeline_container">
                <div class="chart-timeline">
                  <div class="chart-equivalent">
                    <div class="chart-equivalent__el" v-for="timeline in timelines" :key="timeline.name" :class="{
                      'chart-equivalent__el_active':
                        currentTimeline.name == timeline.name,
                    }" @click="changeTimeline(timeline)">
                      {{ timeline.name }}
                    </div>
                    <div class="chart-equivalent__el" :class="{
                      'chart-equivalent__el_active': isCumulativeMode == true,
                    }" @click="isCumulativeMode = !isCumulativeMode">
                      Cumulative
                    </div>
                  </div>
                </div>
              </div>
              <img :src="logo" alt="D3" class="chart-logo" />
              <VChart class="chart" :option="optionObj" :autoresize="true" />
            </div>
          </div>
        </div>
      </div>
      <div class="text-white mt-5">
        <div class="d-flex justify-content-between align-items-end">
          <div class="d-flex align-items-center gap-1">
            <Title :title="'Trades Table'"> </Title>
            <VTooltip :distance="0" :placement="'right-start'">
              <div style="cursor: help">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  class="info_icon">
                  <path
                    d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667 12.904 7.479 12.712 7.287C12.52 7.095 12.2827 6.99933 12 7C11.7167 7 11.479 7.096 11.287 7.288C11.095 7.48 10.9993 7.71733 11 8C11 8.28333 11.096 8.521 11.288 8.713C11.48 8.905 11.7173 9.00067 12 9ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825 4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267 15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667 22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175 19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z"
                    fill="#F8F8F8" />
                </svg>

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
                  <h6>Information</h6>
                  <div style="
                      display: flex;
                      flex-direction: column;
                      font-size: 13px;
                    ">
                    <span>
                      <span style="font-weight: 700">Trade: </span>Date, Time,
                      Chain and Transaction Hash
                    </span>
                    <span>
                      <span style="font-weight: 700">Assets: </span> Asset In
                      First Trade, Asset Out Second Trade
                    </span>
                    <span>
                      <span style="font-weight: 700">Strategy: </span> Strategy
                      Used For Arbitrage
                    </span>
                    <span>
                      <span style="font-weight: 700"> Route: </span> Buy Path,
                      Sell Path
                    </span>
                    <span>
                      <span style="font-weight: 700"> Volume: </span>
                      UsdValueOfFirstTradeInput + UsdValueOfSecondTradeOutput
                    </span>
                    <span>
                      <span style="font-weight: 700"> Profit w Fees: </span>
                      UsdValueOfSecondTradeOutput - (UsdValueOfFirstTradeInput +
                      GasFeeUSD Value)
                    </span>
                    <span>
                      <span style="font-weight: 700"> Gas Fees: </span> Gas Fee
                      Spent In Native Token
                    </span>
                  </div>
                </div>
              </template>
            </VTooltip>
          </div>

          <!--          <div class="mb-3">-->
          <!--            <div style="-->
          <!--                position: relative;-->
          <!--                width: 16px;-->
          <!--                height: 16px;-->
          <!--                border-radius: 9999px;-->
          <!--                background-color: #565a69;-->
          <!--                top: 10px;-->
          <!--                left: 95px;-->
          <!--                z-index: 3;-->
          <!--                font-size: 10px;-->
          <!--                display: flex;-->
          <!--                justify-content: center;-->
          <!--                align-items: center;-->
          <!--              ">-->
          <!--              {{-->
          <!--                Object.entries(filterOptions)-->
          <!--                  .map((el, i) => el.map((selector) => selector.isSelected)[1])-->
          <!--                  .filter(Boolean).length-->
          <!--              }}-->
          <!--            </div>-->
          <!-- <div class="portfolio-table__dropdown">

              <div class="portfolio-table__dropdown__title" :class="{
                    'portfolio-table__dropdown__title_active': isColumnsOpened,
                  }" @click="isColumnsOpened = !isColumnsOpened">
                <span> Columns </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="6" viewBox="0 0 9 6" fill="none">
                  <path d="M7.89258 4.64893L4.59508 1.35143L1.29758 4.64893" stroke="#FAFAFA" stroke-width="1.64844"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <div class="portfolio-table__dropdown__wrapper" v-if="isColumnsOpened">
                <div class="portfolio-table__dropdown__option" :class="{
                  'portfolio-table__dropdown__option_active': item.isSelected,
                }" v-for="item in filterOptions" :key="item.title" @click="item.isSelected = !item.isSelected">
                  {{ item.title }}
                  <svg v-if="item.isSelected" xmlns="http://www.w3.org/2000/svg" width="10" height="7" viewBox="0 0 10 7"
                    fill="none">
                    <path
                      d="M3.20625 6.76406L0 3.55781L0.801563 2.75625L3.20625 5.16094L8.36719 0L9.16875 0.801563L3.20625 6.76406Z"
                      fill="#F8F8F8" />
                  </svg>
                </div>
              </div>
            </div> -->
          <!--          </div>-->
        </div>
      </div>
      <Filters :datePicker="datePicker" :isFilterOpen="isFilterOpen" :selectedTokens="selectedTokens"
        :selectedStrategy="selectedStrategy" :selectedProfit="selectedProfit" :selectedChain="selectedChain"
        :optionsTokens="optionsTokens" :optionsStrategies="optionsStrategies" :optionsProfit="optionsProfit"
        @updateTokens="(newTokens) => (selectedTokens = newTokens)"
        @updateStrategy="(newTokens) => (selectedStrategy = newTokens)"
        @updateProfit="(newTokens) => (selectedProfit = newTokens)"
        @updateDatePicker="(newTokens) => (datePicker = newTokens)" />
      <CCardBody class="tracking_table">
        <Table :headers="selectedHeaders">
          <CTableBody class="table-body">
            <div style="padding: 280px 0px" v-if="filteredList.length === 0">
              <LoaderPulse />
            </div>
            <template v-else>
              <CTableRow class="table-row" style="border-color: transparent" v-for="(transaction, i) in filteredList"
                :key="i">
                <CTableDataCell scope="row" class="align-middle table-cell">
                  <div class="text-white d-flex flex-column fw-normal">
                    {{
                      getTimeDifferenceFormatted(transaction.date)
                    }}
                    <br />
                    <div class="d-flex align-items-center gap-2">
                      <img :src="computedNetwork(transaction.chain)" :width="20" :alt="transaction.chain" />
                      <a :href="getTransactionUrl(
                        transaction.transactionHash,
                        transaction.chain,
                      )
                        " target="_blank" class="transaction-link">
                        {{ addressShorthand(transaction.transactionHash) }}
                      </a>
                    </div>
                  </div>
                </CTableDataCell>
                <CTableDataCell v-if="filterOptions['Assets'].isSelected" class="align-middle table-cell">
                  <div class="d-flex flex-column">
                    <div class="text-white d-flex align-items-center justify-content-center">
                      <img width="22" class="p-1" :src="computedTokenImage(transaction.token)" />
                      {{
                        `-${transaction.valueIn.toFixed(2)}${transaction.token
                          }(`
                      }}
                      <CurrencySymbol :symbol="currencySymbol" /> {{
                        `${transaction.valueInUsd.toFixed(currencyDecimals)})` }}
                    </div>
                    <div class="text-green d-flex align-items-center justify-content-center">
                      <img width="22" class="p-1" :src="computedTokenImage(transaction.token)" />
                      <div class="d-flex" style="border-bottom: 1px dotted #00C9FF;">
                        {{
                          `+${transaction.valueOut.toFixed(2)}${transaction.token
                            } (`
                        }}
                        <CurrencySymbol :symbol="currencySymbol" /> {{
                          `${transaction.valueOutUsd.toFixed(currencyDecimals)})` }}
                      </div>
                    </div>
                  </div>
                </CTableDataCell>
                <CTableDataCell v-if="filterOptions['Strategy'].isSelected" class="align-middle table-cell">
                  <div class="d-flex align-items-center text-white text-center justify-content-center">
                    <div class="text-white" v-if="transaction.strategie ==
                      'arbFromTokensWith1InchAndVault'
                      ">
                      1inch
                    </div>
                    <div class="text-white" v-else-if="transaction.strategie ==
                      'arbFromTokensWith1InchUniV3AndVault'
                      ">
                      1inch
                    </div>
                    <div class="text-white" v-else-if="transaction.strategie == 'arbFromTokensWithVault'
                      ">
                      1inch Fusion
                    </div>
                    <div class="text-white" v-else-if="transaction.strategie ==
                      'arbFromTokensWith1InchUniAndVault'
                      ">
                      1inch
                    </div>

                    <div class="text-white" v-else-if="transaction.strategie == 'arbFromTokensWithOdosAndVault'
                      ">
                      Odos
                    </div>
                    <div class="text-white" v-else-if="transaction.strategie ==
                      'arbFromTokensWithFireBirdAndVault'
                      ">
                      Firebird
                    </div>
                  </div>
                </CTableDataCell>
                <CTableDataCell v-if="filterOptions['Route'].isSelected" class="align-middle table-cell">
                  <div class="d-flex align-items-center flex-column justify-content-center">
                    <!--
                    <div class="d-flex flex-column">
                      <div class="text-white">
                        {{ transaction.methodName }}
                      </div>
                    </div>
                    <CAvatar :src="Uniswap" size="sm" class="me-2" />
                    -->

                    <span class="text-danger">{{ transaction.buypath }}</span>
                    <CIcon icon="cil-arrow-top" class="mx-1 text-white" size="xl" style="transform: rotate(180deg)" />
                    <span class="text-success">{{ transaction.sellpath }}</span>
                  </div>
                </CTableDataCell>
                <CTableDataCell class="align-middle table-cell" v-if="filterOptions['Volume'].isSelected">
                  <div class="d-flex flex-column">
                    <div class="text-white">
                      <CurrencySymbol :symbol="currencySymbol" />{{ transaction.volumeUsd.toFixed(currencyDecimals) }}
                    </div>
                  </div>
                </CTableDataCell>

                <CTableDataCell class="align-middle table-cell" v-if="filterOptions['Profit w Fees'].isSelected">
                  <div :class="{
                    'd-flex align-items-center text-danger text-center justify-content-center':
                      Number(transaction.valueOut) <
                      Number(transaction.valueIn) ||
                      Number(transaction.profit) < 0,
                    'd-flex align-items-center text-success text-center justify-content-center':
                      Number(transaction.valueOut) >=
                      Number(transaction.valueIn) ||
                      Number(transaction.profit) >= 0,
                  }">
                    <CurrencySymbol :symbol="currencySymbol" />{{ transaction.profit.toFixed(currencyDecimals) }}
                  </div>
                </CTableDataCell>
                <CTableDataCell class="align-middle table-cell" v-if="filterOptions['Profit in Token'].isSelected">
                  <div class="d-flex align-items-center">
                    <img width="20" class="p-1" :src="getTokenIcon(transaction.token)" />
                    <div class="text-white">
                      {{
                        `${transaction.profitInToken
                          ? transaction.profitInToken.toFixed(2)
                          : 0
                          } ${transaction.token}`
                      }}
                    </div>
                  </div>
                </CTableDataCell>
                <CTableDataCell v-if="filterOptions['Gas Fees'].isSelected" class="align-middle table-cell">
                  <div class="d-flex align-items-center justify-content-center text-white text-center text-nowrap">
                    {{
                      `${transaction.chain == 'binance'
                        ? transaction.gasFee.toFixed(currencyDecimals) + ' BNB'
                        : transaction.chain == 'arbitrum'
                          ? transaction.gasFee.toFixed(currencyDecimals) + ' ETH'
                          : transaction.gasFee.toFixed(currencyDecimals) + ' MATIC'
                        }(`
                    }}
                    <CurrencySymbol :symbol="currencySymbol" /> {{ `${transaction.gasFeeUsd.toFixed(currencyDecimals)})`
                    }}
                  </div>
                </CTableDataCell>
                <CTableDataCell class="align-middle table-cell" v-if="filterOptions['Traded Pair'].isSelected">
                  <div class="d-flex flex-column align-items-center">
                    <!-- {{ console.log("!!!", transaction.trackPair.split('/')) }} -->
                    <div class="text-white">
                      <img width="15" :src="getTokenIcon(transaction.trackPair.split('/')[0])" />

                      {{ transaction.trackPair.split('/')[0] }}
                      /
                      <img width="15" :src="getTokenIcon(transaction.trackPair.split('/')[1])" />
                      {{ transaction.trackPair.split('/')[1] }}
                    </div>
                  </div>
                </CTableDataCell>
                <CTableDataCell class="align-middle table-cell" v-if="filterOptions['Deviation'].isSelected">
                  <div class="d-flex flex-column align-items-center">
                    <div class="text-white">
                      {{ formatBigNumber(transaction.deviation) }}%
                    </div>
                  </div>
                </CTableDataCell>
              </CTableRow>
            </template>
          </CTableBody>
        </Table>
      </CCardBody>
      <div style="margin-top: 20px;">
        <Pagination :perPage="perPage" :totalPage="totalPage" :currentPage="currentPage" @changePage="changePage"
          @changePerPage="changePerPage" :perPageOptions="perPageOptions"></Pagination>
      </div>
    </CRow>
  </MainCard>
</template>

<script setup>
import CIcon from '@coreui/icons-vue'
import { CCardBody } from '@coreui/vue'
import Arbitrum from '@/assets/images/tokens/arb.png'
import Ether from '@/assets/images/tokens/ether.png'
import GmxIcon from '../../assets/images/tokens/gmx-logo.png'
import USDTIcon from '../../assets/images/tokens/usdt.png'
import BTCIcon from '../../assets/images/tokens/btc.png'
import MagicIcon from '../../assets/images/tokens/magic.png'
import PendleIcon from '../../assets/images/tokens/pendle.png'
import RDNTIcon from '../../assets/images/tokens/rdnt.png'
import arb from '@/assets/images/networks/arbitrum.png'
import polygon from '@/assets/images/networks/polygon.png'
import binance from '@/assets/images/networks/binance2.png'
import { Network, DisplayNetwork } from '@/composables/useNetwork'
import { ref, onMounted, onUnmounted, computed, defineEmits, watch } from 'vue'
// import useEthPrice from '@/composables/useEthPrice'
import { addressShorthand, getTimeDifferenceFormatted } from '@/lib/helpers/util'
import axios from 'axios'
import { subgraphService } from '@/services/subgraph/subgraph.service'
import moment from 'moment'
import Filters from '@/components/TrackTrades/Filters'
import ArbitrageBotCardTrades from '@/components/TrackTrades/ArbitrageBotCardTrades'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import computedTokenImage from '@/composables/useComputedTokenImage'
import CurrencySymbol from "@/components/TrackInfo/CurrencySymbol.vue"
import { getTokenEntity } from '@/lib/helpers/util'
import { formatBigNumber } from '@/lib/utils/index'
import { FormatTrackTradesResults } from '@/lib/formatter/trackTradesResultsFormatter'
import logo from '@/assets/images/d3v.png'
import ChainSelector from '@/UI/ChainSelectorV2.vue'
import { useDevice } from '@/composables/adaptive/useDevice'

import {
  TitleComponent,
  LegendComponent,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  MarkPointComponent,
} from 'echarts/components'
import * as echarts from 'echarts'
import { BarChart, CandlestickChart, LineChart } from 'echarts/charts'
import VChart from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { use } from 'echarts/core'
import {
  sumFields,
  groupTimestampsByDayWithIndexes,
  groupTimestampsByWeekWithIndexes,
  groupTimestampsByMonthWithIndexes,
  calculateAverage,
  formatSimpleTimestamp,
} from '@/lib/utils'
import MainCard from '@/UI/MainCard.vue'
import Table from '@/UI/Table.vue'
import Title from '@/UI/Title.vue'
import {
  isRightChainName,
  usePoolAllTimeTrades,
  usePoolAllTimeProfit,
  usePool30dProfit,
  usePool7dProfit,
  usePool24hProfit,
  usePoolAllTimeGasFee,
  usePool30dGasFee,
  usePool7dGasFee,
  usePool24hGasFee,
  usePool24hGasFeeTokens,
  usePool7dGasFeeTokens,
  usePool30dGasFeeTokens,
  usePool24hGasFeeTokensAmount,
  usePool7dGasFeeTokensAmount,
  usePool30dGasFeeTokensAmount,
  usePool24hProfitTokens,
  usePool7dProfitTokens,
  usePool30dProfitTokens,
  usePool24hProfitTokensAmount,
  usePool7dProfitTokensAmount,
  usePool30dProfitTokensAmount,
  convertSwapsCurrency,
} from '@/composables/pools/usePoolSwapsStats'
import { GetTokenPricesBySymbols } from '@/composables/balances/cryptocompare'
import { GetTokens } from '@/composables/tokens/useTokenSymbols'
import info from '@/assets/images/info.svg'
import CurrencySelector from '@/UI/CurrencySelector.vue'
import Pagination from '@/components/Manage/Pool/Pagination.vue'
use([
  CanvasRenderer,
  CandlestickChart,
  TitleComponent,
  LineChart,
  BarChart,
  LegendComponent,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  MarkPointComponent,
])

const emit = defineEmits(['updateChain'])
const currencySelected = ref({ "symbol": "$", "code": "USD" })
const currencySymbol = computed(() => currencySelected.value.symbol)
const currencyDecimals = computed(() => currencySelected.value.code == "USD" ? 2 : 5)
const chainSelected = ref({ name: 'All Chains', code: 'ALL', img: '' })
const { width } = useDevice()

emit('updateChain', chainSelected.value.name)

watch(chainSelected, () => {
  emit('updateChain', chainSelected.value.name)
})

const preFiltersList = ref([
  {
    title: 'Number of Trades',
    code: 'Number of Trades',
    selected: true,
    cumulable: true,
    isSolo: true,
  },
  {
    title: 'Avg Profit per Trade',
    code: 'Avg Profit per Trade',
    selected: true,
    cumulable: false,
    isSolo: true,
  },
  // {
  //   title: 'TVL',
  //   code: 'TVL',
  //   selected: true,
  //   cumulable: true,
  //   isSolo: true,
  // },
  {
    title: 'Avg Gas Fee per Trade',
    code: 'Avg Gas Fee per Trade',
    selected: true,
    cumulable: true,
    isSolo: true,
  },
])

const perPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(0)

function changePerPage(v1) {
  perPage.value = Number(v1)
  currentPage.value = 1
}

const perPageOptions = computed(() => {
  return [10, 25, 50]
})

function changePage(args) {
  if (args.isEquating == false) {
    currentPage.value = currentPage.value + args.num
  } else {
    currentPage.value = args.num
  }
}

const allChartData = ref([])

const filteredData = computed(() =>
  allChartData.value && allChartData.value.length > 0 ? getFilteredData() : [],
)


const dates = computed(() => {
  return filteredData.value.map((v) => v.Date)
})

const dataGasFees = computed(() => {
  if (
    preFiltersList.value.find((f) => f.code == 'Avg Gas Fee per Trade').selected
  )
    return filteredData.value.map((v) => v['Avg Gas Fee per Trade'])
  return []
})

// const dataTvl = computed(() => {
//   if (preFiltersList.value.find((f) => f.code == 'TVL').selected)
//     return filteredData.value.map((v) => v['TVL'])
//   return []
// })

const dataProfits = computed(() => {
  if (
    preFiltersList.value.find((f) => f.code == 'Avg Profit per Trade').selected
  )
    return filteredData.value.map((v) => v['Avg Profit per Trade'])
  return []
})

const dataTrades = computed(() => {
  if (preFiltersList.value.find((f) => f.code == 'Number of Trades').selected)
    return filteredData.value.map((v) => v['Number of Trades'])
  return []
})

const filters = ref({
  'Avg Gas Fee per Trade': true,
  'Avg Profit per Trade': true,
  // TVL: true,
  'Number of Trades': true,
})

const filterKeys = computed(() => Object.keys(filters.value))
const currency_prices = ref(null)
const optionObj = ref({
  legend: {
    data: filterKeys,
    selected: filters,
    top: -5,
    left: 10,
    bottom: 30,

    width: '50%',
    inactiveColor: '#777',
    textStyle: {
      color: '#ccc',
      fontSize: '10px',
      fontFamily: 'Poppins',
      fontWeight: 700,
    },
  },
  axisPointer: {
    label: {
      fontSize: 8,
    },
  },
  tooltip: {
    backgroundColor: 'rgba(73, 73, 73, 0.65)',
    borderWidth: 0,
    textStyle: {
      color: 'white',
    },
    trigger: 'axis',
    confine: true,
    axisPointer: {
      type: 'cross',
      lineStyle: {
        color: '#f1f1f1',
        width: 1,
        opacity: 0.7,
      },
    },
    formatter: (params) => {
      console.log(params)
      return `
      ${params[0].name} <br />
                ${params
          .map((el) =>
            el.seriesName === 'Revenue' ||
              el.seriesName === 'Profits' ||
              el.seriesName === 'TVL' ||
              el.seriesName === 'Avg Gas Fee per Trade' ||
              el.seriesName === 'Avg Profit per Trade' ||
              el.seriesName === 'Volume'
              ? `${el.marker} ${el.seriesName}: ${currencySymbol.value}${el.value ? el.value.toFixed(currencyDecimals.value) : 0
              } <br />`
              : el.seriesName === 'Volatility Index'
                ? `${el.marker} ${el.seriesName}: ${el.value ? el.value.toFixed(3) : 0
                }% <br />`
                : el.seriesName === 'Number of Trades'
                  ? `${el.marker} ${el.seriesName}: ${el.value ? el.value.toFixed(0) : 0
                  } Trades  <br />`
                  : `${el.marker} ${el.seriesName}: ${el.value ? el.value.toFixed(3) : 0
                  }`,
          )
          .join('')}
                `
    },
  },
  xAxis: [
    {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#8392A5' } },
    },
  ],
  yAxis: [
    {
      min: 0,

      axisLine: { lineStyle: { color: '#8392A5' } },
      gridIndex: 0,
      splitLine: {
        lineStyle: {
          color: 'rgba(51,51,51, 0.35)',
        },
      },
    },
    {
      type: 'value',
      name: 'Trades',
      position: 'right',

      min: 0,
      offset: 0,
      alignTicks: true,
      axisTick: { show: false },
      splitLine: { show: false },
      axisLine: {
        show: true,
        lineStyle: { color: '#6e27b2' },
      },
      axisLabel: {
        formatter: function (value) {
          return value
        },
      },
      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
    },
  ],
  grid: [
    {
      left: '5%',
      right: '5%',
      top: 90,
      bottom: 160,
    },
  ],
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: 0,
      start: 93,
      end: 100,
    },
    {
      show: true,
      xAxisIndex: 0,
      type: 'slider',
      bottom: 70,
      start: 93,
      end: 100,
      selectedDataBackground: {
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: 'orange',
            },
            {
              offset: 1,
              color: 'transparent',
            },
          ]),
        },
      },
    },
  ],
  series: [
    {
      type: 'line',
      name: 'Avg Profit per Trade',
      data: dataProfits,

      color: '#8bff8e',
      sampling: 'lttb',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#8bff8e',
          },
          {
            offset: 1,
            color: 'transparent',
          },
        ]),
      },
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 1,
        color: '#8bff8e',
      },
      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
    },
    {
      name: 'Avg Gas Fee per Trade',
      type: 'bar',
      data: dataGasFees,
      color: '#87F1FF',
      sampling: 'lttb',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#87F1FF',
          },
          {
            offset: 1,
            color: 'transparent',
          },
        ]),
      },
      smooth: true,
      showSymbol: false,
      itemStyle: {
        color: '#87F1FF',
        borderRadius: [5, 5, 0, 0],
      },

      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
    },
    // {
    //   type: 'line',
    //   name: 'TVL',
    //   data: dataTvl,
    //   color: '#f07e07',
    //   sampling: 'lttb',
    //   xAxisIndex: 0,
    //   yAxisIndex: 1,
    //   areaStyle: {
    //     color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
    //       {
    //         offset: 0,
    //         color: '#f07e07',
    //       },
    //       {
    //         offset: 1,
    //         color: 'transparent',
    //       },
    //     ]),
    //   },
    //   smooth: true,
    //   showSymbol: false,
    //   lineStyle: {
    //     width: 1,
    //     color: '#f07e07',
    //   },
    //   emphasis: {
    //     focus: 'series',
    //     blurScope: 'coordinateSystem',
    //   },
    // },
    {
      name: 'Number of Trades',
      type: 'bar',
      data: dataTrades,
      color: '#6e27b2',
      sampling: 'lttb',
      areaStyle: {},
      xAxisIndex: 0,
      yAxisIndex: 1,
      smooth: true,
      showSymbol: false,
      itemStyle: {
        color: '#6e27b2',
        borderRadius: [5, 5, 0, 0],
      },
      emphasis: {
        focus: 'series',
        blurScope: 'coordinateSystem',
      },
    },
  ],
  media: [
    {
      option: {
        tooltip: {
          textStyle: {
            fontSize: 14,
          },
        },
        legend: {
          itemWidth: 25,
          itemHeight: 14,
          textStyle: {
            fontSize: 14,
          },
        },
        xAxis: {
          axisLabel: {
            fontSize: 12,
          },
        },
        yAxis: {
          axisLabel: {
            fontSize: 12,
          },
        },
      },
    },
    {
      query: {
        maxWidth: 1400,
      },
      option: {
        tooltip: {
          textStyle: {
            fontSize: 9,
          },
        },
        legend: {
          itemWidth: 19,
          itemHeight: 10,
          textStyle: {
            fontSize: 10,
          },
        },
        xAxis: {
          axisLabel: {
            fontSize: 8,
          },
        },
        yAxis: [
          {
            nameTextStyle: {
              fontSize: 10,
            },
            axisLabel: {
              fontSize: 8,
            },
          },
          {
            nameTextStyle: {
              fontSize: 10,
            },
            axisLabel: {
              fontSize: 8,
            },
          },
          {
            nameTextStyle: {
              fontSize: 10,
            },
            axisLabel: {
              fontSize: 8,
            },
          },
        ],
      },
    },
    {
      query: {
        maxWidth: 768,
      },
      option: {
        legend: {
          width: '100%',
          itemWidth: 19,
          itemHeight: 10,
          textStyle: {
            fontSize: 11,
          },
        },
        grid: [
          {
            left: '10%',
            right: '10%',
            top: 90,
            bottom: 160,
          },
        ],
        xAxis: {
          axisLabel: {
            fontSize: 11,
          },
        },
        yAxis: {
          axisLabel: {
            fontSize: 11,
          },
        },
      },
    },
  ],
})

const filterOptions = ref({
  Assets: {
    title: 'Assets',
    isSelected: true,
  },
  Strategy: {
    title: 'Strategy',
    isSelected: true,
  },
  Route: {
    title: 'Route',
    isSelected: true,
  },
  Volume: {
    title: 'Volume',
    isSelected: true,
  },
  'Profit w Fees': {
    title: 'Profit w Fees',
    isSelected: true,
  },
  'Profit in Token': {
    title: 'Profit in Token',
    isSelected: true,
  },
  'Gas Fees': {
    title: 'Gas Fees',
    isSelected: true,
  },
  'Traded Pair': {
    title: 'Traded Pair',
    isSelected: true,
  },
  Deviation: {
    title: 'Deviation',
    isSelected: true,
  },
})

const selectedHeaders = computed(() => {
  const array = ['Trade']
  for (let key in filterOptions.value) {
    if (filterOptions.value[key].isSelected) {
      array.push(filterOptions.value[key].title)
    }
  }
  return array
})

const datePicker = ref(null)
const isFilterOpen = ref(false)
const selectedTokens = ref([])
const selectedStrategy = ref([])
const selectedProfit = ref([])
const selectedChain = ref([])
const optionsTokens = ref([
  { name: 'Arbitrum Token', code: 'ARB', img: Arbitrum },
  { name: 'GMX Token', code: 'GMX', img: GmxIcon },
  { name: 'Ether', code: 'WETH', img: Ether },
  { name: 'USD Coin', code: 'USDC', img: getTokenEntity('USDC', 'short').icon },
  { name: 'Tether USD', code: 'USDT', img: USDTIcon },
  { name: 'Wrapped BTC', code: 'BTC', img: BTCIcon },
  { name: 'Magic', code: 'MAGIC', img: MagicIcon },
  { name: 'Pendle', code: 'PENDLE', img: PendleIcon },
  { name: 'RDNT', code: 'RDNT', img: RDNTIcon },
  {
    name: 'Wrapped MATIC',
    code: 'WMATIC',
    img: getTokenEntity('MATIC', 'short').icon,
  },
  {
    name: 'Stargate Finance',
    code: 'STG',
    img: getTokenEntity('STG', 'short').icon,
  },
  {
    name: 'Wrapped BNB',
    code: 'WBNB',
    img: getTokenEntity('WBNB', 'short').icon,
  },
  {
    name: 'DOGE',
    code: 'DOGE',
    img: getTokenEntity('DOGE', 'short').icon,
  },
  { name: 'PAXG', code: 'PAXG', img: getTokenEntity('PAXG', 'short').icon },
  {
    name: 'Binance Beacon',
    code: 'BETH',
    img: getTokenEntity('BETH', 'short').icon,
  },
  {
    name: 'Velas',
    code: 'VLX',
    img: getTokenEntity('VLX', 'short').icon,
  },
  {
    name: 'Aavegotchi',
    code: 'GHST',
    img: getTokenEntity('GHST', 'short').icon,
  },
])
const optionsStrategies = ref([
  {
    name: 'Odos',
    code: 'arbFromTokensWithOdosAndVault',
  },
  {
    name: 'Firebird',
    code: 'arbFromTokensWithFireBirdAndVault',
  },
  {
    name: '1Inch',
    code:
      'arbFromTokensWith1InchUniAndVault' ||
      'arbFromTokensWith1InchAndVault' ||
      'arbFromTokensWith1InchUniV3AndVault',
  },
])
const optionsProfit = ref([
  { name: 'From $0.0 to $2.0', code: [0, 2] },
  { name: 'From $2.0 to $5.0', code: [2, 5] },
  { name: 'From $5.0 to $10.0', code: [5, 10] },
  { name: 'From $10.0 to $20.0', code: [10, 20] },
  { name: 'From $20.0 to $50.0', code: [20, 50] },
  { name: '$50.0 +', code: [50, 10000000] },
])
// const optionsChains = ref([
//   { name: 'Binance', code: 'bsc' },
//   { name: 'Arbitrum', code: 'arbitrum' },
//   { name: 'Polygon', code: 'polygon' },
// ])
const ago = ref('')
const oldTime = ref(new Date())
const interval = ref(
  setInterval(() => {
    ago.value = moment(oldTime.value).fromNow()
  }, 1000),
)
const data = ref([])
const chainFilteredData = computed(() => {
  if (currency_prices.value == null) return []
  return convertSwapsCurrency(
    data.value.filter((item) => isRightChain(item.chain)),
    currency_prices.value,
    currencySelected.value.code,
  )
})


// async function getTransaction(networkId = Network.ARBITRUM) {
//   if (!networkId) networkId = Network.ARBITRUM
//   const txs = await useTransaction(
//     networkId,
//     '0xb04dc0b5106eb9e618c80480bb1d7d9220e89a76',
//     startPage.value,
//     pageCount.value,
//   )
//   if (txs.length > 0) {
//     txs.map((tx) => {
//       const decodedTx = decodeTransaction(tx)
//       tx = {
//         ...tx,
//         methodName: decodedTx?.functionFragment?.name,
//       }
//       transactions.value.push(tx)
//     })
//   }
// }

const isLoading = ref(false)
// const fetchIsLoading = ref(false)

const listTxs = ref([])
const tokens_data = ref(null)
onUnmounted(() => {
  clearInterval(interval.value)
})

const timelines = [
  {
    name: 'Daily',
  },
  {
    name: 'Weekly',
  },
  {
    name: 'Monthly',
  },
]

const isCumulativeMode = ref(false)
const currentTimeline = ref(timelines[0])
const TimelineFilters = {
  Daily: groupTimestampsByDayWithIndexes,
  Weekly: groupTimestampsByWeekWithIndexes,
  Monthly: groupTimestampsByMonthWithIndexes,
}

const botCardValues = computed(() =>
  data.value.length > 0 && tokens_data.value
    ? {
      Trades: usePoolAllTimeTrades(chainFilteredData.value).value,
      TradesArbitrum: usePoolAllTimeTrades(
        data.value.filter((item) => isRightChainName(item.chain, 'Arbitrum')),
      ).value,
      TradesBinance: usePoolAllTimeTrades(
        data.value.filter((item) => isRightChainName(item.chain, 'Binance')),
      ).value,
      TradesPolygon: usePoolAllTimeTrades(
        data.value.filter((item) => isRightChainName(item.chain, 'Polygon')),
      ).value,
      Profit: usePoolAllTimeProfit(chainFilteredData.value).rawValue,
      Profit24H: usePool24hProfit(chainFilteredData.value).rawValue,
      Profit7D: usePool7dProfit(chainFilteredData.value).rawValue,
      Profit30D: usePool30dProfit(chainFilteredData.value).rawValue,
      GasFee: usePoolAllTimeGasFee(chainFilteredData.value).rawValue,
      GasFee24H: usePool24hGasFee(chainFilteredData.value).rawValue,
      GasFee7D: usePool7dGasFee(chainFilteredData.value).rawValue,
      GasFee30D: usePool30dGasFee(chainFilteredData.value).rawValue,
      GasFee24HTokens: usePool24hGasFeeTokens(
        chainFilteredData.value,
        tokens_data.value,
      ),
      GasFee7DTokens: usePool7dGasFeeTokens(
        chainFilteredData.value,
        tokens_data.value,
      ),
      GasFee30DTokens: usePool30dGasFeeTokens(
        chainFilteredData.value,
        tokens_data.value,
      ),
      GasFee24HTokensAmount: usePool24hGasFeeTokensAmount(
        chainFilteredData.value,
        tokens_data.value,
      ),
      GasFee7DTokensAmount: usePool7dGasFeeTokensAmount(
        chainFilteredData.value,
        tokens_data.value,
      ),
      GasFee30DTokensAmount: usePool30dGasFeeTokensAmount(
        chainFilteredData.value,
        tokens_data.value,
      ),
      Profit24HTokens: usePool24hProfitTokens(
        chainFilteredData.value,
        tokens_data.value,
      ),
      Profit7DTokens: usePool7dProfitTokens(
        chainFilteredData.value,
        tokens_data.value,
      ),
      Profit30DTokens: usePool30dProfitTokens(
        chainFilteredData.value,
        tokens_data.value,
      ),
      Profit24HTokensAmount: usePool24hProfitTokensAmount(
        chainFilteredData.value,
        tokens_data.value,
      ),
      Profit7DTokensAmount: usePool7dProfitTokensAmount(
        chainFilteredData.value,
        tokens_data.value,
      ),
      Profit30DTokensAmount: usePool30dProfitTokensAmount(
        chainFilteredData.value,
        tokens_data.value,
      ),
    }
    : undefined,
)

// const convertFromNumber = (str) => {
//   let number = parseFloat(str)

//   let suffix = ''
//   if (number >= 1e9) {
//     suffix = 'b'
//     number /= 1e9
//   } else if (number >= 1e6) {
//     suffix = 'm'
//     number /= 1e6
//   } else if (number >= 1e3) {
//     suffix = 'k'
//     number /= 1e3
//   }

//   const result = number + suffix
//   return result
// }

function isRightChain(chain) {
  return (
    chain.toLowerCase() == chainSelected.value.name.toLowerCase() ||
    chainSelected.value.name.toLowerCase() == 'all chains'
  )
}

function getFilteredData() {
  let result = []
  let chart_data = allChartData.value.filter((item) =>
    isRightChain(item.Blockchain),
  )
  chart_data = addEmptyDays(chart_data)
  let timestamps = chart_data.map((v) => v.timestamp)
  let indexes = TimelineFilters[currentTimeline.value.name](timestamps)
  indexes = indexes.sort((a, b) => a - b)
  let selectedFilters = preFiltersList.value.filter((v) => v.selected)
  let selectedCumulableCodes = selectedFilters
    .filter((v) => v.cumulable)
    .map((v) => v.code)
  for (let i = 0; i < indexes.length; i++) {
    let start_index = i == 0 ? 0 : indexes[i - 1] + 1
    let end_index = indexes[i] + 1
    let previousItems = chart_data.slice(start_index, end_index)
    let item = {
      ...chart_data[indexes[i]],
      ...sumFields(previousItems, selectedCumulableCodes),
    }
    let result_item = {
      Blockchain: item.Blockchain,
      timestamp: item.timestamp,
      Date: item.Date,
    }
    let avg_profit = calculateAverage(
      previousItems.map((p_item) => p_item['Profit']),
    )
    let avg_fee = calculateAverage(
      previousItems.map((p_item) => p_item['Gas Fees']),
    )
    for (let k = 0; k < selectedFilters.length; k++) {
      let filter_code = selectedFilters[k].code
      if (Object.hasOwn(item, filter_code)) {
        if (isCumulativeMode.value && selectedFilters[k].cumulable) {
          let previous_value =
            result.length == 0 ? 0 : result[result.length - 1][filter_code]
          result_item[filter_code] = item[filter_code] + previous_value
        } else {
          result_item[filter_code] = item[filter_code]
        }
      } else if (filter_code == 'Avg Profit per Trade') {
        result_item['Avg Profit per Trade'] = avg_profit
      } else if (filter_code == 'Avg Gas Fee per Trade') {
        result_item['Avg Gas Fee per Trade'] = avg_fee
      }
    }
    result.push(result_item)
  }
  return result
}

function changeTimeline(tl) {
  currentTimeline.value = tl
}

// function onFilterClick(item) {
//   item.selected = !item.selected
//   if (item.selected) {
//     filters.value[item.title] = true
//   } else {
//     delete filters.value[item.title]
//   }
// }

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

//Equivalents for displaying data
// const equivalents = computed(() => [
//   {
//     name: 'USD',
//     cost: 1,
//   },
// ])

// const currentEquivalent = ref(equivalents.value[0])

// function changeEquivalent(eq) {
//   currentEquivalent.value = eq
// }

const networks = [
  process.env.VUE_APP_KEY_ARBITRUM ? Network.ARBITRUM : undefined,
  process.env.VUE_APP_KEY_BINANCE ? Network.BINANCE : undefined,
  process.env.VUE_APP_KEY_POLYGON ? Network.POLYGON : undefined,
].filter((n) => n != undefined)

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

function getTokenIcon(token) {
  return getTokenEntity(token, 'short').icon
}
// async function fetchTradingData() {
//   fetchIsLoading.value = true
//   await axios
//     .get('https://rtyenmdkakhdhduduvdduvdvd.pro/fetch-data')
//     .then(() => {
//       getTradingVolume()
//       fetchIsLoading.value = false
//       oldTime.value = new Date()
//     })
//     .catch((error) => {
//       console.error(error)
//       fetchIsLoading.value = false
//     })
// }

async function fetchDataAndMerge() {
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

  return mergedData
}

async function InitTxsData() {
  if (data.value.length == 0) {
    tokens_data.value = (
      await Promise.all(networks.map((network) => GetTokens(network)))
    ).flat()
    let mergedData = await fetchDataAndMerge()
    data.value = mergedData
  }

  let txs = listTxs.value.filter((item) => isRightChain(item.chain))
  let parseData = JSON.parse(JSON.stringify(txs))
  totalPage.value = parseData.length;
  listTxs.value = subgraphService.trades.getTxsInfo(
    convertSwapsCurrency([...data.value], currency_prices.value, currencySelected.value.code),
    null,
    tokens_data.value,
  )
}
// async function InitBalance(networkId) {
//   const provider = getJsonRpcProvider(networkId)
//   const tokenKeys = Object.keys(config[networkId].tokens)

//   const balancePromises = []
//   for (const key of tokenKeys) {
//     const balancePromise = useBalance(
//       config[networkId].tokens[key]['address'],
//       provider,
//       config['userWallet'],
//     ).then(
//       async (balance) => {
//         const price = await useTokenPrice(
//           config[networkId].tokens[key]['apiId'],
//           'usd',
//         )
//         if (balance > 0) {
//           tokens.value[networkId].push({
//             name: config[networkId].tokens[key]['name'],
//             amount: (balance * price).toFixed(2),
//             logoURI: config[networkId].tokens[key]['logoURI'],
//           })

//           return balance * price
//         } else return 0
//       }, // Handle error if fetching token price fails
//     )
//     balancePromises.push(balancePromise)
//   }

//   const ethBalancePromise = useEthBalance(provider, config['userWallet'])

//   const [ethBalance, ...tokenBalances] = await Promise.all([
//     ethBalancePromise,
//     ...balancePromises,
//   ])

//   if (ethBalance > 0)
//     tokens.value[networkId].push({
//       name: config[networkId]['nativeAsset']['name'],
//       amount: (ethBalance * nativeTokenPrices.value[networkId]).toFixed(2),
//       logoURI: config[networkId]['nativeAsset']['logoURI'],
//     })

//   const totalAmount = Math.floor(
//     tokenBalances.reduce((a, b) => a + b, 0) +
//       ethBalance * nativeTokenPrices.value[networkId],
//   )

//   const index = networks.value.findIndex(
//     (network) => network.networkId === networkId,
//   )
//   networks.value[index].amount = totalAmount
// }
// function getPercent() {
//   ;[0, 1, 2].map((index) => {
//     let totalAmount = 0
//     networks.value.map((network) => {
//       totalAmount += parseFloat(network.amount)
//     })
//     networks.value[index].percent = (
//       (networks.value[index].amount * 100) /
//       totalAmount
//     ).toFixed(2)
//   })
// }

const filteredList = computed(() => {
  let txs = listTxs.value.filter((item) => isRightChain(item.chain))
  let parseData = JSON.parse(JSON.stringify(txs))
  parseData = parseData
    .sort((a, b) => Date.parse(new Date(a.date)) - Date.parse(new Date(b.date)))
    .reverse()    

  if (
    selectedTokens.value.length === 0 &&
    selectedStrategy.value.length === 0 &&
    selectedProfit.value.length === 0 &&
    selectedChain.value.length === 0 &&
    datePicker.value === null
  ) {
    const start = (currentPage.value - 1) * perPage.value
    const end = currentPage.value * perPage.value
    const result = parseData.slice(start, end)
    return result
  } else {
    if (selectedTokens.value.length !== 0) {
      parseData = parseData.filter((el) => {
        return selectedTokens.value.find((element) => {
          return element.code === el.token
        })
      })
    }

    if (selectedStrategy.value.length !== 0) {
      console.log(parseData)
      console.log(selectedStrategy.value)
      parseData = parseData.filter((el) => {
        return selectedStrategy.value.find((element) => {
          return (
            element.name.toLowerCase() === el.buypath.toLowerCase() ||
            element.name.toLowerCase() === el.sellpath.toLowerCase()
          )
        })
      })
    }

    if (selectedProfit.value.length !== 0) {
      parseData = parseData.filter((el) => {
        return selectedProfit.value.find((element) => {
          for (let i = 0; parseData.length > i; i++) {
            if (el.profit < element.code[0] || el.profit > element.code[1]) {
              return false
            }
            return el.profit
          }
        })
      })
    }
    if (selectedChain.value.length !== 0) {
      parseData = parseData.filter((el) => {
        return selectedChain.value.find((element) => {
          return element.code === el.chain
        })
      })
    }

    if (datePicker.value !== null) {
      const startDate = JSON.parse(JSON.stringify(datePicker.value[0]))
      const endDate = JSON.parse(JSON.stringify(datePicker.value[1]))
      parseData = parseData.filter((el) => {
        return datePicker.value.find(() => {
          for (let i = 0; parseData.length > i; i++) {
            if (
              Date.parse(el.date) < Date.parse(startDate) ||
              Date.parse(el.date) > Date.parse(endDate)
            ) {
              return false
            }
            return el.date
          }
        })
      })
    }

    return parseData
  }
})

function InitChartData() {
  let chart_data = [...data.value]
  let formatted_chart_data = networks.map((n) => FormatTrackTradesResults(chart_data.filter((item) => item.chain.toLowerCase() == DisplayNetwork[n].toLowerCase()), n)).flat()
  formatted_chart_data.sort((a, b) => a.timestamp - b.timestamp)
  allChartData.value = addEmptyDays(formatted_chart_data)
}

function addEmptyDays(chart_data) {
  let ts = chart_data[0].timestamp
  let last_ts = Date.now()
  let last_index = 1
  let dates = chart_data.map((item) => item.Date)
  while (ts < last_ts) {
    let date = formatSimpleTimestamp(ts / 1000)
    let found_index = dates.lastIndexOf(date)
    if (found_index == -1) {
      chart_data.splice(last_index, 0, {
        Date: date,
        Blockchain: '',
        timestamp: ts,
        'Avg Gas Fee per Trade': 0,
        'Avg Profit per Trade': 0,
        'Number of Trades': 0,
      })
      dates.splice(last_index, 0, date)
      last_index++
    } else {
      last_index = found_index + 1
    }
    ts += 86400000
  }
  return chart_data
}

// async function InitNativeTokenPrices() {
//   const [arbitrumPrice, ethPrice, fantomPrice] = await Promise.all([
//     getNativeTokenPrices(Network.ARBITRUM),
//     getNativeTokenPrices(Network.MAINNET),
//     getNativeTokenPrices(Network.FANTOM),
//   ])
//   nativeTokenPrices.value[Network.ARBITRUM] = arbitrumPrice
//   nativeTokenPrices.value[Network.MAINNET] = ethPrice
//   nativeTokenPrices.value[Network.FANTOM] = fantomPrice
// }

onMounted(async () => {
  isLoading.value = true

  currency_prices.value = await GetTokenPricesBySymbols(['BTC', 'ETH'])
  await InitTxsData()
  InitChartData()
  //await getTransaction()

  isLoading.value = false
})


watch((currencySelected), async () => {
  isLoading.value = true

  await InitTxsData()
  InitChartData()

  isLoading.value = false
})
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.track_info_container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  /* gap: 10px; */
}

@media (min-width: $xl) {
  .track_info_container {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    /* gap: 15px; */
  }
}

@media (max-width: $xxl) {}

@mixin trades-table {
  width: 100px;

  @media (max-width: $xxl) {
    width: 70px;
  }

  &:nth-child(1) {
    width: 250px;

    @media (max-width: $xxl) {
      width: 170px;
    }

    @media (max-width: $md) {
      width: 210px;
    }
  }

  &:nth-child(2) {
    width: 200px;

    @media (max-width: $xxl) {
      width: 130px;
    }

    @media (max-width: $md) {
      width: 180px;
    }
  }

  &:nth-child(8) {
    width: 200px;

    @media (max-width: $xxl) {
      width: 120px;
    }

    @media (max-width: $md) {
      width: 155px;
    }
  }

  &:nth-child(9) {
    width: 200px;

    @media (max-width: $xxl) {
      width: 120px;
    }

    @media (max-width: $md) {
      width: 155px;
    }
  }
}

.table-cell {
  @include trades-table;
}

:deep(.table-header-font-folder) {
  @include trades-table;
}

.table {
  &-row {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  &-body {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 626px;
    display: block;
    backdrop-filter: blur(20.067087173461914px);

    .table-row {
      width: calc(100% + 8px);
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

  &-cell {
    text-align: center;
    font-weight: 400;
    white-space: nowrap;
    font-size: 14px;
    padding: 24px 0 24px 10px;

    @media (max-width: $xxl) {
      font-size: 10px;
      padding: 12px 0 12px 10px !important;
    }

    &:first-child {
      padding: 15px 0 15px 45px;
      text-align: left;

      @media (max-width: $xxl) {
        padding: 12px 0 12px 15px !important;
      }
    }

    &:last-child {
      padding: 15px 10px 15px 10px;

      @media (max-width: $xxl) {
        padding: 12px 10px 12px 10px !important;
      }
    }
  }
}

.chart-logo {
  display: none;
}

.chart {
  &-filters {
    display: flex;
    align-items: flex-start;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 12px 5px;

    &__el {
      color: #fff;
      font-size: 12px;
      margin-right: 2px;
      display: flex;
      flex-direction: column;
      position: relative;
      cursor: pointer;

      @media all {
        /* margin-bottom: 10px; */
      }

      &:hover {
        background-color: #00C9FFcb;
        cursor: pointer;
        color: rgb(255, 255, 255);
        border-radius: 20px;
      }

      &_progress {
        /* cursor: progress; */
        /* opacity: 0.6; */

        .chart-filters__title {
          &:hover {
            background: none;
          }
        }
      }

      &_active {
        font-size: 12px;
        margin-right: 2px;

        .chart-filters__title {
          background: #00C9FF;
          color: #fff;

          &:hover {
            background-color: rgba(#00C9FF, 0.5);
            cursor: pointer;
            color: #fff;
          }
        }
      }

      &_opened {
        .chart-filters__title {
          border-bottom: 1px solid #fff;
          border-radius: 12px 12px 0 0;
          background: none;

          .chart-filters__dropdown-icon {
            transform-origin: center;
            transform: rotate(180deg);
          }
        }
      }
    }

    &__toggling {
      display: flex;
      justify-content: space-between;
      padding: 6px 7px 12px 6px;
    }

    &__toggler {
      color: #00C9FF;
      font-size: 11px;
      font-weight: 300;
      text-decoration-line: underline;
    }

    &__dropdown-icon {
      transition: 0.3s;
    }

    &__title {
      padding: 8px 10px;
      border-radius: 20px;
      border: 1px solid #7ef6b2;
      color: rgba(126, 246, 178, 1);

      &:hover {
        background-color: rgba(#00C9FF, 0.3);
      }
    }

    &__option {
      padding: 8px 6px;
      align-items: center;
      display: flex;
      justify-content: space-between;

      svg {
        margin-right: 10px;
        display: none;
      }

      &:last-child {
        border-radius: 0 0 12px 12px;
      }

      &:hover {
        background-color: rgba(#00C9FF, 0.3);
      }

      &_selected {
        svg {
          display: block;
        }

        &:hover {
          background-color: rgba(#00C9FF, 0.3);
        }
      }
    }

    &__options {
      width: 120px;
      top: 100%;
      position: absolute;
      background: #000;
      z-index: 11;
      border: 1px solid #00C9FF;
      border-top: none;
      border-radius: 0 0 12px 12px;
    }
  }

  &-equivalent {
    padding: 0px;
    color: #00C9FF;
    font-size: clamp(8px, 0.5vw, 12px);
    margin-right: 15px;
    display: flex;
    justify-self: flex-start;
    border-radius: 20px;
    border: 1px solid #00C9FF;

    &__el {
      padding: 8px 15px;
      cursor: pointer;
      border-radius: 20px;

      &:hover {
        background: rgba(#00C9FF, 0.3);
      }

      &_active {
        background: #00C9FF;
        color: #fff;

        &:hover {
          background: #00C9FF;
        }
      }
    }
  }

  &-wrapper {
    display: flex;
    width: 100%;
    margin-bottom: 14px;

    @media all and (max-width: 576px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &-timeline {
    width: 100%;
    margin-right: auto;

    @media all and (max-width: 576px) {
      margin-left: 0;
      margin-top: 10px;
    }
  }

  &-loading {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    &__img {
      animation: pulse 1.5s linear infinite;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
  }

  50% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.5);
  }
}

.track_chart_card {
  // border: 1px solid rgba(163, 164, 165, 0.26);
  border-radius: 0px 20px 20px 0px;
  width: 100%;
  padding: 20px;
  background: #22222224;
  border: 1px solid #FFFFFF0D;
  box-shadow: 0px 4px 4px 0px #00000040;}

.timeline_container {
  width: fit-content;
  display: block;
  position: relative;
  top: 65px;
  margin-left: auto;
  right: 5px;
  margin-top: -65px;
  z-index: 30;
}

.chart_inside {
  width: 100%;
  height: 550px;
  padding-bottom: 20px;
}

@media (max-width: $xxl) {
  .track_chart_card {
    width: 100%;
  }

  .chart_inside {
    width: 100%;
    height: 450px;
  }

  .chart-filters {
    gap: 5px 2px;
  }
}

@media (max-width: $sm) {
  .timeline_container {
    width: 100%;
  }

  .chart {
    &-equivalent {
      padding: 0px;
      color: #fff;
      font-size: clamp(8px, 0.5vw, 12px);
      margin-right: 15px;
      display: flex;
      flex-direction: column;
      border-radius: 20px;
      border: 1px solid #00C9FF;
    }
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

.filter_button:hover path {
  stroke: #00C9FF !important;
}

.reload_button__active {
  animation: rotate 2s linear infinite;
}

.filter_button__active {
  stroke: #ffffff !important;
}

.tracking_table {
  padding: 0;
  border-radius: 15px;
  background: linear-gradient(153deg, #000 0%, rgba(0, 0, 0, 0.00) 90%);
  backdrop-filter: blur(20.067087173461914px);
  overflow-x: auto;
}

@media (min-width: $xl) {
  .tracking_table {
    overflow: auto;
  }
}

@media (min-width: $md) {
  .chart-logo {
    display: block;
    position: relative;
    top: 39%;
    left: 48%;
    opacity: 0.15;
  }

  .filters_container {
    display: flex;
    align-items: flex-start;
    margin-top: 10px;
    margin-bottom: 40px;
    gap: 10px;
    flex-wrap: wrap;
  }
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

.portfolio {
  &-table {
    &__dropdown {
      position: relative;
      font-size: 14px;

      &__title {
        color: #fff;
        padding: 9px 13px;
        border-radius: 12px;
        border: 1px solid #7ef6b2;
        text-align: center;
        cursor: pointer;

        &_active {
          border-radius: 12px 12px 0 0;
          border-bottom: 1px solid #fff;

          svg {
            transition-duration: 0.3s;
            transform-origin: center;
            transform: rotate(180deg);
          }
        }
      }

      &__wrapper {
        padding: 7px;
        position: absolute;
        border-radius: 0 0 12px 12px;
        border: 1px solid #7ef6b2;
        border-top: none;
        background: #000;
        z-index: 101;
      }

      &__option {
        color: rgba(#fff, 0.6);
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        svg {
          min-width: 9px;
        }

        &_active {
          color: #fff;
        }
      }
    }
  }
}

@media (max-width: $xl) {
  .timeline_container {
    width: fit-content;
    display: flex;
    position: static;
    z-index: 30;
    margin-left: 0;
    margin-top: 0;
    margin-bottom: 20px;
  }

  .track_chart_card {
    border: 1px solid rgba(163, 164, 165, 0.3);
    border-width: 0px 1px 1px 1px;
    border-radius: 0px 0px 20px 20px;
  }

  .chart {
    &-equivalent {
      padding: 0px;
      color: rgba(126, 246, 178, 1);
      font-size: clamp(8px, 0.5vw, 12px);
      margin-right: 15px;
      display: flex;
      flex-direction: row;
      border-radius: 20px;
      border: 1px solid #00C9FF;
    }
  }
}
</style>
