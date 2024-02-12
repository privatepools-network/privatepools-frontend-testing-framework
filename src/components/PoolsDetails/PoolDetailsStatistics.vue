<template>
  <div class="stats_container" style="padding: 280px clamp(10px, 0.9vw, 15px);"
    v-if="chartData && chartData.length === 0">
    <LoaderPulse />
  </div>
  <div class="stats_container">
    
    <div class="stats_column_tables">
      <div class="stats_column_tables_inside">
        <div class="d-flex align-items-center justify-content-between"
          style="background-color: rgba(7, 14, 15, 0.7); padding: 8px">
          <div class="d-flex gap-2">
            <div style="
                color: rgba(243, 244, 246, 1);
                font-weight: 500;
                font-size: clamp(10px, 0.9vw, 15px);
              ">
              ROI
            </div>
            <VTooltip style="margin-top: -3px;" :distance="0" :placement="'right'">
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
                  <div style="font-size:clamp(10px, 0.9vw, 16px)">ROI</div>
                  <div style="display: flex; flex-direction: column; font-size: clamp(10px, 0.8vw, 14px);">
                    <div><b>Average ROI:</b> Mean Return on Investment.</div>
                    <div><b>VS USD</b> ROI compared to US Dollar.</div>
                    <div><b>VS LIDO</b> Shows ROI relative to Lido across various intervals.</div>
                    <div><b>VS BTC</b> Compares ROI against Bitcoin.</div>
                    <div><b>VS DeFi Yield</b> ROI versus average DeFi yields.</div>
                    <div><b></b> </div>
                  </div>
                </div>
              </template>
            </VTooltip>
          </div>
        </div>

        <DataTable v-if="roiData"
          :default_head_captions="['Period', 'ROI', 'VS USD', 'VS LIDO', 'VS BTC', 'VS DeFi YIELD']" :data="roiData"
          :table_bg="'rgba(7, 14, 15, 0.5)'" :rowHeight="'h-25'" fontSizeTable="small"
          :header_cells_bg="'table_header_cell_bg'" :displayTable="roiData"
          :header_cells_inside="'table_header_cell_inside'">
          <template v-slot:default="{ dataCell, dataCellKey }">
            <div v-if="dataCellKey === 'Period'" class="text-truncate file-table-cell"
              style="font-size: clamp(10px, 0.8vw, 13px); text-align: left" data-coreui-toggle="tooltip"
              data-coreui-placement="left" :title="dataCell">
              {{ dataCell }}
            </div>
            <div v-else :class="`text-truncate file-table-cell ${parseFloat(dataCell) > 0
              ? 'positive'
              : parseFloat(dataCell) < 0
                ? 'negative'
                : ''
              }`" style="font-size: clamp(10px, 0.8vw, 13px)" data-coreui-toggle="tooltip" data-coreui-placement="left"
              :title="dataCell">
              <div class="d-flex align-items-center justify-content-end"
                :class="{ 'text-danger': parseFloat(dataCell) < 0, 'text-success': parseFloat(dataCell) > 0 }">
                <div>{{ parseFloat(dataCell) > 0 ? '+' : '' }}</div>
                <div>{{ formatBigNumber(dataCell) }}</div>
                <div>%</div>
              </div>
            </div>
          </template>
        </DataTable>
      </div>
      <div class="stats_column_tables_inside">
        <div class="d-flex align-items-center justify-content-between"
          style="background-color: rgba(7, 14, 15, 0.7); padding: 8px">
          <div class="d-flex gap-2 align-items-center">
            <div style="
                color: rgba(243, 244, 246, 1);
                font-weight: 500;
                font-size: clamp(10px, 0.9vw, 15px);
              ">
              APR
            </div>
            <VTooltip style="margin-top: -3px;" :distance="0" :placement="'right'">
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
                  <div style="font-size:clamp(10px, 0.9vw, 16px)">APR</div>
                  <div style="display: flex; flex-direction: column; font-size: clamp(10px, 0.8vw, 14px);">
                    <div><b>Average APR:</b> Mean annualized return.</div>
                    <div><b>VS USD</b> APR comparison against US Dollar.</div>
                    <div><b>VS LIDO</b> APR relative to Lido over selected timeframes.</div>
                    <div><b>VS BTC</b> APR benchmarked against Bitcoin.</div>
                    <div><b>VS DeFi Yield</b> APR versus typical DeFi yields.</div>
                    <div><b></b> </div>
                  </div>
                </div>
              </template>
            </VTooltip>
          </div>
        </div>

        <DataTable v-if="aprData && aprData.length > 0" :data="aprData" :table_bg="'rgba(7, 14, 15, 0.5)'"
          :rowHeight="'h-25'" fontSizeTable="small" :header_cells_bg="'table_header_cell_bg'" :displayTable="aprData"
          :default_head_captions="['Period', 'APR', 'VS USD', 'VS LIDO', 'VS BTC', 'VS DeFi YIELD']"
          :header_cells_inside="'table_header_cell_inside'">
          <template v-slot:default="{ dataCell, dataCellKey }">
            <div v-if="dataCellKey === 'Period'" class="text-truncate file-table-cell"
              style="font-size: clamp(10px, 0.8vw, 13px); text-align: left" data-coreui-toggle="tooltip"
              data-coreui-placement="left" :title="dataCell">
              {{ dataCell }}
            </div>
            <div v-else :class="`text-truncate file-table-cell  ${parseFloat(dataCell) > 0
              ? 'positive'
              : parseFloat(dataCell) < 0
                ? 'negative'
                : ''
              }`" style="font-size: clamp(10px, 0.8vw, 13px)" data-coreui-toggle="tooltip" data-coreui-placement="left"
              :title="dataCell">
              <div class="d-flex align-items-center justify-content-end"
                :class="{ 'text-danger': parseFloat(dataCell) < 0, 'text-success': parseFloat(dataCell) > 0 }">
                <div>{{ parseFloat(dataCell) > 0 ? '+' : '' }}</div>
                <div>{{ formatBigNumber(dataCell) }}</div>
                <div>%</div>
              </div>
            </div>
          </template>
        </DataTable>
        <LoaderPulse style="height: 200px;" v-else></LoaderPulse>
      </div>


      <!-- <div class="stats_column_tables_inside">
        <div class="d-flex align-items-center justify-content-between"
          style="background-color: rgba(7, 14, 15, 0.7); padding: 8px">
          <div class="d-flex gap-2">
            <div style="
                color: rgba(243, 244, 246, 1);
                font-weight: 500;
                font-size: clamp(10px, 0.9vw, 15px);
              ">
              Investments
            </div>
            <VTooltip style="margin-top: -3px;" :distance="0" :placement="'right'">
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
                  <div style="font-size:clamp(10px, 0.9vw, 16px)">ROI</div>
                  <div style="display: flex; flex-direction: column; font-size: clamp(10px, 0.8vw, 14px);">
                    <div><b>Average ROI:</b> Mean Return on Investment.</div>
                    <div><b>VS USD</b> ROI compared to US Dollar.</div>
                    <div><b>VS LIDO</b> Shows ROI relative to Lido across various intervals.</div>
                    <div><b>VS BTC</b> Compares ROI against Bitcoin.</div>
                    <div><b>VS DeFi Yield</b> ROI versus average DeFi yields.</div>
                    <div><b></b> </div>
                  </div>
                </div>
              </template>
            </VTooltip>
          </div>
        </div>

        <DataTable v-if="investmentsData"
          :default_head_captions="['Assets', 'Deposit', 'Withdraw', 'Current Amount', 'Profit', 'Deviation %']"
          :data="investmentsData" :table_bg="'rgba(7, 14, 15, 0.5)'" :rowHeight="'h-25'" fontSizeTable="small"
          :header_cells_bg="'table_header_cell_bg'" :displayTable="investmentsData"
          :header_cells_inside="'table_header_cell_inside'">
          <template v-slot:default="{ dataCell, dataCellKey }">
            <div v-if="dataCellKey === 'Period'" class="text-truncate file-table-cell"
              style="font-size: clamp(10px, 0.8vw, 13px); text-align: left" data-coreui-toggle="tooltip"
              data-coreui-placement="left" :title="dataCell">
              {{ dataCell }}
            </div>
            <div v-else :class="`text-truncate file-table-cell ${parseFloat(dataCell) > 0
              ? 'positive'
              : parseFloat(dataCell) < 0
                ? 'negative'
                : ''
              }`" style="font-size: clamp(10px, 0.8vw, 13px)" data-coreui-toggle="tooltip" data-coreui-placement="left"
              :title="dataCell">
              <div class="d-flex align-items-center justify-content-end"
                :class="{ 'text-danger': parseFloat(dataCell) < 0, 'text-success': parseFloat(dataCell) > 0 }">
                <div>{{ parseFloat(dataCell) > 0 ? '+' : '' }}</div>
                <div>{{ formatBigNumber(dataCell) }}</div>
                <div>%</div>
              </div>
            </div>
          </template>
        </DataTable>
      </div> -->

    </div>
    <div class="stats_column gap-xxl-5 gap-1">
      <div class="stats_column_inside">
        <div class="d-flex align-items-center justify-content-between"
          style="background-color: rgba(7, 14, 15, 0.7); padding: 8px">
          <div class="d-flex gap-2">
            <div style="
                color: rgba(243, 244, 246, 1);
                font-weight: 500;
                font-size: clamp(10px, 0.9vw, 15px);
              ">
              Drawdowns
            </div>
            <VTooltip style="margin-top: -3px;" :distance="0" :placement="'right'">
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
                  <div style="font-size:clamp(10px, 0.9vw, 16px)">Dradowns</div>
                  <div style="display: flex; flex-direction: column; font-size: clamp(10px, 0.8vw, 14px);">
                    <div><b>Maximum Drawdown:</b> Peak-to-trough loss magnitude.</div>
                    <div><b>Duration:</b> Time from drawdown start to lowest point.</div>
                    <div><b>Recovery Period:</b> Time to return to peak after low.</div>
                    <div><b>Capital Loss:</b> Actual monetary loss amount.</div>
                    <div><b>Percentual Impact:</b> Loss as a percentage of total investment.</div>
                    <div><b></b> </div>
                  </div>
                </div>
              </template>
            </VTooltip>
          </div>
          <div class="d-flex align-items-center gap-2">

            <VueDatePicker class="dp__theme_dark" v-model="datePickerDrawdown" placeholder="Filter by Date" utc
              dark="true" range>
              <template #trigger>
                <div style="cursor: pointer;"><img :src="calendar" /></div>

              </template>
            </VueDatePicker>
          </div>
        </div>
        <div v-for="item in drawDownData" :key="item" style="padding: 0px 8px">
          <div class="d-flex align-items-center justify-content-between" style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            ">
            <div class="stats_text">{{ item.text }}</div>
            <div class="stats_value">{{ item.value }}</div>
          </div>
        </div>
      </div>

      <div class="stats_column_inside">
        <div class="d-flex align-items-center justify-content-between"
          style="background-color: rgba(7, 14, 15, 0.7); padding: 8px">
          <div class="d-flex gap-2">
            <div style="
                color: rgba(243, 244, 246, 1);
                font-weight: 500;
                font-size: clamp(10px, 0.9vw, 15px);
              ">
              Risk Metrics
            </div>
            <VTooltip style="margin-top: -3px;" :distance="0" :placement="'right'">
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
                  <div style="font-size:clamp(10px, 0.9vw, 16px)">Risk Metrics</div>
                  <div style="display: flex; flex-direction: column; font-size: clamp(10px, 0.8vw, 14px);">
                    <div><b>Sharpe Ratio:</b> Assesses excess return per unit of risk.</div>
                    <div><b>Sortino Ratio:</b> Evaluates return for downside risk only.</div>
                    <div><b>Volatility:</b> Measures price fluctuation intensity.</div>
                    <div><b></b> </div>
                  </div>
                </div>
              </template>
            </VTooltip>
          </div>
          <div class="d-flex align-items-center gap-2">
            <VueDatePicker class="dp__theme_dark" v-model="datePickerRisks" placeholder="Filter by Date" utc dark="true"
              range>
              <template #trigger>
                <div style="cursor: pointer;"><img :src="calendar" /></div>

              </template>
            </VueDatePicker>
            <Dropdown :distance="4" :placement="'bottom-center'">
              <div style="cursor: pointer;">
                <img :src="riskMetricsIcon" />

              </div>
              <template #popper>
                <div style="
                      width: 250px;
                      background-color: rgba(7, 14, 15, 0.9);
                      color: rgba(255, 255, 255, 1);
                      border-radius: 5px 5px 0px 0px;
                      padding: 10px;

                    ">
                  <p @click="riskFreeOption = 'bonds'" v-close-popper class="chart_dropdown_items">
                    Risk-Free American Bonds
                  </p>
                  <p @click="riskFreeOption = 'dai'" v-close-popper class="chart_dropdown_items">
                    Risk-Free Staked DAI
                  </p>


                </div>
              </template>
            </Dropdown>
          </div>
        </div>
        <div v-for="item in riskMetrics" :key="item" style="padding: 0px 8px">
          <div class="d-flex align-items-center justify-content-between" style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            ">
            <div class="stats_text">{{ item.text }}</div>
            <div class="stats_value">{{ item.value }}</div>
          </div>
        </div>
      </div>

      <div class="stats_column_inside">
        <div class="d-flex align-items-center justify-content-between"
          style="background-color: rgba(7, 14, 15, 0.7); padding: 8px">
          <div class="d-flex gap-2">
            <div style="
                color: rgba(243, 244, 246, 1);
                font-weight: 500;
                font-size: clamp(10px, 0.9vw, 15px);
              ">
              Profits
            </div>
            <VTooltip style="margin-top: -3px;" :distance="0" :placement="'right'">
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
                  <div style="font-size:clamp(10px, 0.9vw, 16px)">Profits</div>
                  <div style="display: flex; flex-direction: column; font-size: clamp(10px, 0.8vw, 14px);">
                    <div><b>Average Profit per Trade:</b> The mean earnings across individual trades.</div>
                    <div><b>Average Profit per Pool:</b> Average earnings calculated over a specific pool of trades.</div>
                    <div><b></b> </div>
                  </div>
                </div>
              </template>
            </VTooltip>
          </div>
          <div class="d-flex align-items-center gap-2">
            <VueDatePicker class="dp__theme_dark" v-model="datePickerProfit" placeholder="Filter by Date" utc dark="true"
              range>
              <template #trigger>
                <div style="cursor: pointer;"><img :src="calendar" /></div>

              </template>
            </VueDatePicker>
          </div>
        </div>
        <div v-for="item in profitsData" :key="item" style="padding: 0px 8px">
          <div class="d-flex align-items-center justify-content-between" style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            ">
            <div class="stats_text">{{ item.text }}</div>
            <div class="stats_value">{{ item.value }}</div>
          </div>
        </div>
      </div>


    </div>


    <div class="stats_column_charts" style="gap:30px">
      <div class="stats_column_inside">
        <div class="d-flex align-items-center justify-content-between"
          style="background-color: rgba(7, 14, 15, 0.7); padding: 8px">
          <div class="d-flex align-items-center gap-2">
            <div class="d-flex gap-2 align-items-baseline">
              <div style="
                  color: rgba(243, 244, 246, 1);
                  font-weight: 500;
                  font-size: clamp(10px, 0.9vw, 15px);
                ">
                {{ AssetsChart }}
              </div>


            </div>


          </div>
          <VTooltip style="margin-top: -3px;" :distance="0" :placement="'right'">
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
                <div style="font-size:clamp(10px, 0.9vw, 16px)">Assets Breakdown By Type</div>
                <div style="display: flex; flex-direction: column; font-size: clamp(10px, 0.8vw, 14px);">
                  <div>This pie chart illustrates the distribution of assets, categorized by type. Each segment represents
                    a different asset class, showing the proportion of each within the total portfolio.</div>
                </div>
              </div>
            </template>
          </VTooltip>
        </div>
        <div class="diagram-container">
          <div v-if="assets">
            <apexchart v-if="AssetsChart === 'Assets Breakdown'" :options="dynamicDonut(
              assets.map(a => a.symbol),
              assets.map((a) => stringToColor(a.symbol)), assets)" :series="assets.map(a => a.percent)" :height="410"
              :width="370" />
            <apexchart v-else
              :options="dynamicDonut(
                ['Bitcoin (BTC)', 'Ethereum (ETH)', 'RWAs', 'LSDs', 'Stablecoins', 'Infrastructure', 'L1s', 'L2s', 'DeFi'],
                ['rgba(230, 177, 12, 1)', '#00C9FF', 'rgba(248, 71, 71, 1)', 'rgba(194, 119, 237, 1)', 'rgba(0, 199, 242, 1)', 'rgba(0, 252, 2, 1)', 'rgba(0, 252, 2, 1)', 'rgba(0, 252, 2, 1)', 'rgba(0, 252, 2, 1)'])"
              :series="[44, 55, 41, 17, 15, 22, 11, 8, 6]" :height="410" :width="415" />
          </div>
          <div v-else style="height: 228px">
            <LoaderPulse></LoaderPulse>
          </div>
        </div>

      </div>


      <div class="stats_column_inside">
        <div class="d-flex align-items-center justify-content-between"
          style="background-color: rgba(7, 14, 15, 0.7); padding: 8px">
          <div class="d-flex align-items-center gap-2">
            <div class="d-flex gap-2 align-items-baseline">
              <div style="
                  color: rgba(243, 244, 246, 1);
                  font-weight: 500;
                  font-size: clamp(10px, 0.9vw, 15px);
                ">
                {{ BreakdownChart }}
              </div>


            </div>


          </div>
          <VTooltip style="margin-top: -3px;" :distance="0" :placement="'right'">
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
                <div style="font-size:clamp(10px, 0.9vw, 16px)">Assets Breakdown By Type</div>
                <div style="display: flex; flex-direction: column; font-size: clamp(10px, 0.8vw, 14px);">
                  <div>This pie chart illustrates the distribution of assets, categorized by type. Each segment represents
                    a different asset class, showing the proportion of each within the total portfolio.</div>
                </div>
              </div>
            </template>
          </VTooltip>
        </div>
        <div class="diagram-container">
          <div v-if="assets">
            <apexchart v-if="BreakdownChart === 'Pairs Breakdown'" :options="dynamicDonut(
              pairs.map(a => a.symbol),
              pairs.map((a) => stringToColor(a.symbol)), pairs)" :series="pairs.map(a => a.percent)" :height="410"
              :width="415" />
            <apexchart v-else :options="dynamicDonut(
              ['USDT/BTC/ETH', 'SUSHI/DAI/FRAX', 'USDT/USDC'],
              ['rgba(0, 199, 242, 1)', 'rgba(194, 119, 237, 1)', 'rgba(251, 198, 47, 1)'])" :series="[44, 55, 41]"
              :height="410" :width="415" />
          </div>
          <div v-else style="height: 228px">
            <LoaderPulse></LoaderPulse>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, toRefs, computed, onBeforeMount, watch } from 'vue'
import info from '@/assets/images/info.svg'
// import InvestSettings from '@/assets/icons/statisticIcons/InvestSettings.svg'
import calendar from '@/assets/icons/statisticIcons/calendar.svg'
import riskMetricsIcon from '@/assets/icons/statisticIcons/riskMetrics.svg'
import DataTable from '@/components/DataTable/index.vue'
import '@vuepic/vue-datepicker/dist/main.css'
import VueDatePicker from '@vuepic/vue-datepicker'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import { Dropdown } from 'floating-vue'
import { getAverageProfitPerTimeRange, getSharpeRatioPerTimeRange, getAssetsBreakdown, getSortinoRatioPerTimeRange, getVolatilityIndexPerTimeRange, getPairsBreakdown } from "@/composables/pools/usePoolSwapsStats"
import { formatBigNumber, stringToColor } from "@/lib/utils/index"
import { GetAaveAprs } from "@/composables/platforms/useAaveAprs"
import { GetCompoundAprs } from "@/composables/platforms/useCompoundAprs"
import { GetLidoApr } from "@/composables/platforms/useLidoApr"
import { GetCelsiusAprs } from "@/composables/platforms/useCelsiusAprs"
import { GetYearnAprs } from "@/composables/platforms/useYearnAprs"
import { GetTop10Tokens } from '@/composables/balances/cryptocompare'
import { GetHistoricalTokenPrices } from '@/composables/balances/useHistoricalTokenPrices'
import { FormatRoiStatistics } from "@/lib/formatter/statistics/roi/statisticsRoiFormatter"
import { FormatAprStatistics } from "@/lib/formatter/statistics/apr/statisticsAprFormatter"
import { AnalyzeDrawdowns } from "@/composables/math/chartMath/drawdownMath"



const props = defineProps(['chainSelected', 'poolSwapsData', 'tokensData', 'historical_tvl', 'chartData', 'historicalPrices', 'pool', 'tokenPairs', 'symbol', 'decimals'])
const { chainSelected, poolSwapsData, tokensData, chartData, historicalPrices, pool, tokenPairs, symbol } = toRefs(props)
function dynamicDonut(labels, arrayOfColors, data) {
  return (
    {
      chart: {
        type: 'donut',

      },
      data: data,
      labels: labels,
      legend: {
        show: true,
        fontSize: '14px',
        // fontFamily: 'Lato',
        fontWeight: 600,
        labels: {
          colors: 'white',
          useSeriesColors: false
        },
        markers: {

          fillColors: arrayOfColors,

        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
        colors: arrayOfColors,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '80%',
            background: 'transparent',
          },
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#181C1F']

      },
      tooltip: {
        enabled: true,
        // eslint-disable-next-line
        custom({ series, seriesIndex, dataPointIndex, w }) {
          return (
            '<div style="background: linear-gradient(rgba(89, 89, 89, 1), rgba(73, 73, 73, 0.45)); padding: 10px;">' +
            '<h6 style="opacity:50%">' + w.config.labels[seriesIndex] + '</h6>' +
            '<div style="display:flex; flex-direction:column;">' +
            '<span>' +
            '<span style="font-weight:700">' + 'TVL:  :' + '</span>' + ' ' + `${symbol}${formatBigNumber(w.config.data[seriesIndex].invested)}` +
            '</span>' +
            '<span>' +
            '<span style="font-weight:700">' + 'Allocation:' + '</span>' + ' ' + `${formatBigNumber(w.config.data[seriesIndex].percent)}%` +
            '</span>' +
            '<span>' +

            '</div>' +
            '</div>'
          )
        },
      },
      responsive: [
        {
          breakpoint: 1400,
          options: {
            chart: {
              width: 300,

            },
            legend: {
              width: 105,

              fontSize: '8px',

              markers: {

                width: 8,
                height: 8,

              },
            },
          },
        },
        {
          breakpoint: 768,
          options: {
            chart: {
              width: '100%',
              height: '100%',
            },
            legend: {
              // show: false,
              position: 'right',
            },
          },
        },
      ],
    }
  )
}

const AssetsChart = ref('Assets Breakdown')
const BreakdownChart = ref('Pairs Breakdown')

const poolCreateTs = pool.value.createTime * 1000
const datePickerDrawdown = ref([new Date(poolCreateTs), new Date()])
const datePickerProfit = ref([new Date(poolCreateTs), new Date()])
const datePickerRisks = ref([new Date(poolCreateTs), new Date()])


const riskFreeOption = ref('bonds')

const assets = computed(() => chartData.value.length > 0 ? getAssetsBreakdown(poolSwapsData.value, tokensData.value, chainSelected.value.name, historicalPrices.value) : [])
const pairs = computed(() => chartData.value.length > 0 ? getPairsBreakdown(poolSwapsData.value, tokensData.value, tokenPairs.value, chainSelected.value.name, historicalPrices.value) : [])

const riskMetrics = computed(() => {
  if (chartData.value.length > 0) {
    return [{
      text: 'Sharpe Ratio',
      value: `${formatBigNumber(getSharpeRatioPerTimeRange(chartData.value, historicalPrices.value, tokensData.value, chainSelected.value.name, datePickerRisks.value[0], datePickerRisks.value[1], riskFreeOption.value))}`
    },
    {
      text: 'Sortino Ratio',
      value: `${formatBigNumber(getSortinoRatioPerTimeRange(chartData.value, historicalPrices.value, tokensData.value, chainSelected.value.name, datePickerRisks.value[0], datePickerRisks.value[1], riskFreeOption.value))}`
    },
    {
      text: 'Volatility Ratio',
      value: `${formatBigNumber(getVolatilityIndexPerTimeRange(chainSelected.value.name, chartData.value, historicalPrices.value, tokensData.value, datePickerRisks.value[0], datePickerRisks.value[1], false, null, riskFreeOption.value))}`
    },]
  }
  return []

})
const profitsData = computed(() => [
  {
    text: 'Average Profit per Trade',
    value: `${symbol.value}${formatBigNumber(getAverageProfitPerTimeRange(poolSwapsData.value, chainSelected.value.name, ...datePickerProfit.value))}`,
  },
])

const drawDownData = computed(() => AnalyzeDrawdowns(chartData.value, chainSelected.value.name, ...datePickerDrawdown.value, symbol.value))




const roiData = ref([{ Period: '24H' }, { Period: '7D' }, { Period: '1M' }, { Period: '3M' }, { Period: '1Y' }])
const investmentsData = ref([{ Period: 'BTC' }, { Period: 'ETH' }, { Period: 'AVAX' }, { Period: 'SOL' }, { Period: 'LINK' }])
const aprData = ref([{ Period: '24H' }, { Period: '7D' }, { Period: '1M' }, { Period: '3M' }, { Period: '1Y' }])


const top10Tokens = ref([])
const allTokensInfo = ref([])

async function InitRoi() {
  if (chartData.value.length > 0) {
    top10Tokens.value = await GetTop10Tokens()
    let fetchTokens = [...top10Tokens.value.filter((token) => historicalPrices.value.filter((price) => price.symbol == token).length == 0), "stETH"]
    let defiTokens = await GetHistoricalTokenPrices(fetchTokens, false)
    allTokensInfo.value = [...defiTokens, ...historicalPrices.value]
    roiData.value = await FormatRoiStatistics(chartData.value, allTokensInfo.value, top10Tokens.value, chainSelected.value.name)
  }
}

let marketData = ref({})
async function InitApr() {
  if (chartData.value.length > 0) {
    let [aave, compound, celsius, lido, yearn] = await Promise.all([GetAaveAprs(), GetCompoundAprs(), GetCelsiusAprs(), GetLidoApr(), GetYearnAprs()])
    marketData.value = {
      aave, compound, celsius, lido, yearn
    }
    aprData.value = FormatAprStatistics(marketData.value,
      chartData.value, tokensData.value, chainSelected.value.name)
  }
}

onBeforeMount(async () => {
  await Promise.all([InitRoi(), InitApr()])
})
console.log("APR - ", aprData)
watch(chainSelected, async () => {
  if ((chartData.value.length > 0)) {
    aprData.value = FormatAprStatistics(marketData.value, chartData.value, tokensData.value, chainSelected.value.name)
    roiData.value = await FormatRoiStatistics(chartData.value, allTokensInfo.value, top10Tokens.value, chainSelected.value.name)
    investmentsData.value = await FormatRoiStatistics(chartData.value, allTokensInfo.value, top10Tokens.value, chainSelected.value.name)
  }
})
watch(chartData, async () => {
  await Promise.all([InitRoi(), InitApr()])
})

</script>
<style lang="scss">
@import '@/styles/_variables.scss';

.positive {
  color: rgba(63, 185, 80, 1) !important;
}

.negative {
  color: rgba(248, 81, 73, 1) !important;
}

.stats_text {
  color: rgba(243, 244, 246, 1);
  font-family: Inter;
  font-size: clamp(10px, 0.8vw, 14px);
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0em;
  text-align: left;
}

.stats_value {
  color: white;
  margin-right: 15px;
  font-family: Inter;
  font-size: clamp(10px, 0.8vw, 13px);
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0em;
  text-align: left;
}

.table_header_cell_bg {
  background: #2c2c2c50 !important;
  color: #9299AA !important;
  font-weight: 500 !important;
}

.table_header_cell_inside {
  justify-content: end;
}

.diagram-container {
  border-width: 0px, 1px, 1px, 1px;
  padding: clamp(10px, 0.9vw, 15px);
  border-style: solid;

  border-color: #a3a4a50e;


  .apexcharts-inner {
    filter: drop-shadow(0 0 0.55rem rgba(98, 104, 143, 1));
  }
}

.chart_dropdown_items {
  cursor: pointer;
  font-size: clamp(10px, 0.8vw, 14px);
}

.chart_dropdown_items:hover {
  color: #00C9FF;
}

.stats_container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  padding: 30px 18px;
  border-radius: 20px;
  background: linear-gradient(153deg, #000 0%, rgba(0, 0, 0, 0.00) 100%);
  backdrop-filter: blur(20.067087173461914px);

}

.stats_column {
  display: flex;
  flex-direction: column;
  width: 450px;
  gap: 100px !important;
}

.stats_column_charts {
  display: flex;
  flex-direction: column;

}

.stats_column_tables {
  display: flex;
  flex-direction: column;
  width: 550px;
  gap: 50px
}

.stats_column_tables_inside {
  width: 100%;
}

.stats_column_inside {
  display: flex;
  flex-direction: column;
  width: 100%;
}

@media (max-width:$xxl2) {
  .stats_container {
    justify-content: space-around;
  }

  .stats_column {

    width: 30%;
  }

  .stats_column_tables {
    gap: 0px;
    width: 35%;
  }

  .stats_column_charts {
    width: 30%;
  }
}


@media (max-width:$xl) {
  .stats_container {
    justify-content: space-around;
  }

  .stats_column {

    width: 100%;
  }

  .stats_column_tables {
    margin-top: 20px;
    gap: 0px;
    width: 100%;
  }

  .stats_column_charts {
    display: flex;
    flex-direction: column;
    width: 100%;

  }
}

@media (max-width: $sm) {
  .diagram-container {
    display: flex;
    justify-content: center;
  }
}


.stats_column_tables_inside {
  overflow-x: scroll;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 192, 135);
    border-radius: 3px;
  }
}

.dp__theme_dark {
  --dp-background-color: rgba(15, 17, 19, 1);
  --dp-primary-color: #00C9FF;
  --dp-highlight-color: #00c8ff42;
  --dp-border-color: #00C9FF;
  --dp-menu-border-color: #00C9FF;
  --dp-border-color-hover: #00C9FF;
  --dp-border-radius: clamp(10px, 0.8vw, 13px);
  --dp-input-icon-padding: 8px;
  --dp-action-buttons-padding: 3px 9px;
  --dp-action-button-height: 32px
}

.dp__action_button {
  line-height: normal;
}
</style>
@/lib/formatter/statistics/roi/statisticsRoiFormatter
