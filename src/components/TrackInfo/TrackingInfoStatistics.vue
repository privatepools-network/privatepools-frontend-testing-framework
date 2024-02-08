<template>
  <!-- eslint-disable -->

  <!--  <div class="stats_container" style="padding: 280px clamp(10px, 0.9vw, 15px);"-->
  <!--    v-if="chartData && chartData.length === 0">-->
  <!--    <LoaderPulse />-->
  <!--  </div>-->
  <div class="stats_container">
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

        <div v-if="drawDownData.length > 0" v-for="item in drawDownData" :key="item" style="padding: 0px 8px">
          <div class="d-flex align-items-center justify-content-between" style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            ">
            <div class="stats_text">{{ item.text }}</div>
            <div class="stats_value">{{ item.value }}</div>
          </div>
        </div>
        <div v-else v-for="item in drawDownTitles" :key="`draw-down-title-${item}`" style="padding: 0px 8px">
          <div class="d-flex align-items-center justify-content-between" style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            ">
            <div class="stats_text">{{ item }}</div>
            <div class="stats_value">
              <ThreeDots></ThreeDots>
            </div>
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
                  <p @click="riskFreeOption = 'bonds'" v-close-popper
                    :class="{ 'chart_dropdown_items_active': riskFreeOption == 'bonds' }" class="chart_dropdown_items">
                    Risk-Free American Bonds
                  </p>
                  <p @click="riskFreeOption = 'dai'" v-close-popper
                    :class="{ 'chart_dropdown_items_active': riskFreeOption == 'dai' }" class="chart_dropdown_items">
                    Risk-Free Staked DAI
                  </p>


                </div>
              </template>
            </Dropdown>
          </div>
        </div>
        <div v-if="riskMetrics.length > 0" v-for="item in riskMetrics" :key="item" style="padding: 0px 8px">
          <div class="d-flex align-items-center justify-content-between" style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            ">
            <div class="stats_text">{{ item.text }}</div>
            <div class="stats_value">{{ item.value }}</div>
          </div>
        </div>
        <div v-else v-for="item in riskMetricsTitles" :key="`risk-metrics-title-${item}`" style="padding: 0px 8px">
          <div class="d-flex align-items-center justify-content-between" style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            ">
            <div class="stats_text">{{ item }}</div>
            <div class="stats_value">
              <ThreeDots></ThreeDots>
            </div>
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
        <div v-if="profitsData.length > 0" v-for="item in profitsData" :key="item" style="padding: 0px 8px">
          <div class="d-flex align-items-center justify-content-between" style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            ">
            <div class="stats_text">{{ item.text }}</div>
            <div class="stats_value">{{ item.value }}</div>
          </div>
        </div>
        <div v-else v-for="item in profitsTitles" :key="`profits-${item}`" style="padding: 0px 8px">
          <div class="d-flex align-items-center justify-content-between" style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            ">
            <div class="stats_text">{{ item }}</div>
            <div class="stats_value">
              <ThreeDots></ThreeDots>
            </div>
          </div>
        </div>
      </div>



    </div>

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
        <div v-if="roiData === null" style="margin-top: 10%; margin-bottom: 10%;">
          <LoaderPulse></LoaderPulse>
        </div>
        <DataTable v-else :default_head_captions="['Period', 'ROI', 'VS USD', 'VS LIDO', 'VS BTC', 'VS DeFi YIELD']"
          :data="roiData" :table_bg="'rgba(7, 14, 15, 0.5)'" :rowHeight="'h-25'" fontSizeTable="small"
          :header_cells_bg="'table_header_cell_bg'" :displayTable="roiData"
          :header_cells_inside="'table_header_cell_inside'">
          <template v-slot:default="{ dataCell, dataCellKey }">
            <div v-if="dataCellKey === 'Period' && roiData" class="text-truncate file-table-cell"
              style="font-size: clamp(10px, 0.8vw, 13px); text-align: left" data-coreui-toggle="tooltip"
              data-coreui-placement="left" :title="dataCell">
              {{ dataCell }}
            </div>
            <div v-else-if="dataCellKey === 'Period'" class="text-truncate file-table-cell"
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
          <div class="d-flex gap-2">
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

        <div v-if="aprData === null" style="margin-top: 10%; margin-bottom: 10%;">
          <LoaderPulse></LoaderPulse>
        </div>
        <DataTable v-else :default_head_captions="['Period', 'APR', 'VS USD', 'VS LIDO', 'VS BTC', 'VS DeFi YIELD']"
          :data="aprData" :table_bg="'rgba(7, 14, 15, 0.5)'" :rowHeight="'h-25'" fontSizeTable="small"
          :header_cells_bg="'table_header_cell_bg'" :displayTable="aprData"
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
        {{ console.log('investmentsData', investmentsData) }}
        <DataTable v-if="investmentsData"
          :default_head_captions="['Assets', 'Deposit', 'Withdraw', 'Current Amount', 'Profit', 'Deviation %']"
          :data="investmentsData" :table_bg="'rgba(7, 14, 15, 0.5)'" :rowHeight="'h-25'" fontSizeTable="small"
          :header_cells_bg="'table_header_cell_bg'" :displayTable="investmentsData"
          :header_cells_inside="'table_header_cell_inside'">
          <template v-slot:default="{ dataCell, dataCellKey }">
            <div v-if="dataCellKey === 'Period'" class="text-truncate file-table-cell"
              style="font-size: clamp(10px, 0.8vw, 13px); text-align: left" data-coreui-toggle="tooltip"
              data-coreui-placement="left" :title="dataCell">
              {{ console.log('investmentsDatadataCell', dataCell) }}

              BTC
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

    <div class="stats_column_charts" style="">
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
          <div v-if="assets.length > 0">
            <apexchart v-if="AssetsChart === 'Assets Breakdown'" :options="dynamicDonut(
              assets.map(a => a.symbol),
              assets.map((a) => stringToColor(a.symbol)), assets)" :series="assets.map(a => a.percent)" :height="350"
              :width="355" />
            <apexchart v-else
              :options="dynamicDonut(
                ['Bitcoin (BTC)', 'Ethereum (ETH)', 'RWAs', 'LSDs', 'Stablecoins', 'Infrastructure', 'L1s', 'L2s', 'DeFi'],
                ['rgba(230, 177, 12, 1)', 'rgba(1, 180, 126, 1)', 'rgba(248, 71, 71, 1)', 'rgba(194, 119, 237, 1)', 'rgba(0, 199, 242, 1)', 'rgba(0, 252, 2, 1)', 'rgba(0, 252, 2, 1)', 'rgba(0, 252, 2, 1)', 'rgba(0, 252, 2, 1)'])"
              :series="[44, 55, 41, 17, 15, 22, 11, 8, 6]" :height="350" :width="355" />
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
                <div style="font-size:clamp(10px, 0.9vw, 16px)">Investments Breakdown</div>
                <div style="display: flex; flex-direction: column; font-size: clamp(10px, 0.8vw, 14px);">
                  <div>This pie chart provides a visual representation of the distribution of investments across different
                    categories or sectors, showing how the total investment is divided.</div>
                </div>
              </div>
            </template>
          </VTooltip>
        </div>
        <div class="diagram-container">
          <div v-if="pairs.length > 0">
            <apexchart v-if="BreakdownChart === 'Pairs Breakdown'" :options="dynamicDonut(
              pairs.map(a => a.symbol),
              pairs.map((a) => stringToColor(a.symbol)), pairs)" :series="pairs.map(a => a.percent)" :height="350"
              :width="355" />
            <apexchart v-else :options="dynamicDonut(
              ['USDT/BTC/ETH', 'SUSHI/DAI/FRAX', 'USDT/USDC'],
              ['rgba(0, 199, 242, 1)', 'rgba(194, 119, 237, 1)', 'rgba(251, 198, 47, 1)'])" :series="[44, 55, 41]"
              :height="350" :width="355" />
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
import { ref, defineProps, toRefs, computed, onMounted, watch } from 'vue'
import info from '@/assets/images/info.svg'
// import InvestSettings from '@/assets/icons/statisticIcons/InvestSettings.svg'
import calendar from '@/assets/icons/statisticIcons/calendar.svg'
import riskMetricsIcon from '@/assets/icons/statisticIcons/riskMetrics.svg'
import DataTable from '@/components/DataTable/index.vue'
import '@vuepic/vue-datepicker/dist/main.css'
import VueDatePicker from '@vuepic/vue-datepicker'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import { Dropdown } from 'floating-vue'
import {
  getAverageProfitPerTimeRange,
  getSharpeRatioPerTimeRange,
  getSortinoRatioPerTimeRange,
  getAssetsBreakdown,
  getVolatilityIndexPerTimeRange,
  getPairsBreakdown,
  getAveragePoolProfitPerTimeRange
} from "@/composables/pools/usePoolSwapsStats"
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
import ThreeDots from "@/components/loaders/ThreeDots.vue";

import {
  isTimestampWithinCurrentDay,
  isTimestampWithinPreviousDay,
  isTimestampWithinLast7Days,
  isTimestampWithinPrevious7Days,
  isTimestampWithinCurrent30Days,
  isTimestampWithinPrevious30Days,
  isTimestampWithinCurrent90Days,
  isTimestampWithinPrevious90Days,
  isTimestampWithinLastYear,
  isTimestampWithinPreviousYear
} from '@/lib/utils'
import { CalculateJoinExitPrice, getTvlForTimestamp } from "@/lib/formatter/financialStatement/financialStatementFormatter"
import {
  calculatePercentageChange,
} from '@/composables/math/chartMath/trackingInfoMath'
import {
  isRightChainName,
} from '@/composables/pools/usePoolSwapsStats'
const props = defineProps(['chainSelected', 'poolSwapsData', 'tokensData', 'historical_tvl', 'chartData', 'historicalPrices', 'tokenPairs', 'symbol', 'joinExits'])
const { chainSelected, poolSwapsData, tokensData, historical_tvl, chartData, historicalPrices, tokenPairs, joinExits } = toRefs(props)
//const networks = [process.env.VUE_APP_KEY_ARBITRUM ? Network.ARBITRUM : undefined, process.env.VUE_APP_KEY_BINANCE ? Network.BINANCE : undefined, process.env.VUE_APP_KEY_POLYGON ? Network.POLYGON : undefined].filter((n) => n != undefined)

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
            '<span style="font-weight:700">' + 'TVL:  :' + '</span>' + ' ' + `${props.symbol}${formatBigNumber(w.config.data[seriesIndex].invested)}` +
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

const protocolStartTs = 1685556000000
const datePickerDrawdown = ref([new Date(protocolStartTs), new Date()])
const datePickerProfit = ref([new Date(protocolStartTs), new Date()])
const datePickerRisks = ref([new Date(protocolStartTs), new Date()])


const riskFreeOption = ref('bonds')

const assets = computed(() => getAssetsBreakdown(poolSwapsData.value, tokensData.value, chainSelected.value.name, historicalPrices.value))
const pairs = computed(() => getPairsBreakdown(poolSwapsData.value, tokensData.value, tokenPairs.value, chainSelected.value.name, historicalPrices.value))

const riskMetrics = computed(() => {
  if (chartData.value.length > 0) {
    return [
      {
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
      },
    ]
  } else {
    return []
  }
})

const riskMetricsTitles = ['Sharpe Ratio', 'Sortino Ratio', 'Volatility Ratio']

const profitsData = computed(() => {
  if (poolSwapsData.value.length > 0) {
    return [
      {
        text: 'Average Profit per Trade',
        value: `${props.symbol}${formatBigNumber(getAverageProfitPerTimeRange(poolSwapsData.value, chainSelected.value.name, ...datePickerProfit.value))}`,
      },
      {
        text: 'Average Profit per Pool',
        value: `${props.symbol}${formatBigNumber(getAveragePoolProfitPerTimeRange(poolSwapsData.value, chainSelected.value.name, historical_tvl.value, ...datePickerProfit.value))}`,
      }
    ]
  } else {
    return []
  }
})

const profitsTitles = ['Average Profit per Trade', 'Average Profit per Pool']

const drawDownData = computed(() => chartData.value.length > 0 ? AnalyzeDrawdowns(chartData.value, chainSelected.value.name, ...datePickerDrawdown.value, props.symbol) : [])
const drawDownTitles = ['Maximum drawdown', 'Duration', 'Recovery Period', 'Capital Loss', 'Percentual Impact']


const roiData = ref([{ Period: '24H' }, { Period: '7D' }, { Period: '1M' }, { Period: '3M' }, { Period: '1Y' }])
const aprData = ref([{ Period: '24H' }, { Period: '7D' }, { Period: '1M' }, { Period: '3M' }, { Period: '1Y' }])
const investmentsData = ref([{ Period: '24H' }, { Period: '7D' }, { Period: '1M' }, { Period: '3M' }, { Period: '1Y' }])


const periodsFilterMethods = {
  '24H': {
    'current': isTimestampWithinCurrentDay,
    'previous': isTimestampWithinPreviousDay,
    'timeAgo': 60 * 60 * 24
  },
  '7D': {
    'current': isTimestampWithinLast7Days,
    'previous': isTimestampWithinPrevious7Days,
    'timeAgo': 60 * 60 * 24 * 7
  },
  '1M': {
    'current': isTimestampWithinCurrent30Days,
    'previous': isTimestampWithinPrevious30Days,
    'timeAgo': 60 * 60 * 24 * 30
  },
  '3M': {
    'current': isTimestampWithinCurrent90Days,
    'previous': isTimestampWithinPrevious90Days,
    'timeAgo': 60 * 60 * 24 * 90
  },
  '1Y': {
    'current': isTimestampWithinLastYear,
    'previous': isTimestampWithinPreviousYear,
    'timeAgo': 60 * 60 * 24 * 365
  },
}

const top10Tokens = ref([])
const allTokensInfo = ref([])

function InitInvestmentsData() {
  console.log("HERE")
  let filteredJoinExits = joinExits.value.filter((item) =>
    isRightChainName(item.chain, chainSelected.value.name),
  )
  let filteredPoolSwapsData = poolSwapsData.value.filter((item) => isRightChainName(item.chain, chainSelected.value.name))
  for (let i = 0; i < investmentsData.value.length; i++) {
    let period = investmentsData.value[i].Period
    let currentJoinExits = filteredJoinExits.filter((item) => periodsFilterMethods[period].current(item.timestamp))
    let previousJoinExits = filteredJoinExits.filter((item) => periodsFilterMethods[period].previous(item.timestamp))
    let depositedCurrent = AggregateJoinExit(currentJoinExits, 'Join')
    let withdrawCurrent = AggregateJoinExit(currentJoinExits, 'Exit')
    let depositedPrevious = AggregateJoinExit(previousJoinExits, 'Join')
    let withdrawPrevious = AggregateJoinExit(previousJoinExits, 'Exit')
    investmentsData.value[i].Deposit = calculatePercentageChange(depositedPrevious, depositedCurrent)
    investmentsData.value[i].Withdraw = calculatePercentageChange(withdrawPrevious, withdrawCurrent)
    let currentTvl = getTvlForTimestamp(historical_tvl.value, Date.now() / 1000)
    let previousTvl = getTvlForTimestamp(historical_tvl.value, Date.now() / 1000 - periodsFilterMethods[period].timeAgo)
    investmentsData.value[i]['Current Amount'] = calculatePercentageChange(previousTvl, currentTvl)
    let currentSwaps = filteredPoolSwapsData.filter((item) => periodsFilterMethods[period].current(item.timestamp))
    let previousSwaps = filteredPoolSwapsData.filter((item) => periodsFilterMethods[period].previous(item.timestamp))
    let profitCurrent = currentSwaps.reduce((sum, value) => sum + parseFloat(value.profitUsd), 0)
    let profitPrevious = previousSwaps.reduce((sum, value) => sum + parseFloat(value.profitUsd), 0)
    investmentsData.value[i].Profit = calculatePercentageChange(profitPrevious, profitCurrent)
    let amountInCurrent = currentSwaps.reduce((sum, value) => sum + parseFloat(value.swaps[0].amountInVaultUsd[0]), 0)
    let amountOutCurrent = currentSwaps.reduce((sum, value) => sum + parseFloat(value.swaps[0].amountOutVaultUsd[0]), 0)
    let currentDeviation = getDeviation(amountInCurrent, amountOutCurrent)
    let amountInPrevious = previousSwaps.reduce((sum, value) => sum + parseFloat(value.swaps[0].amountInVaultUsd[0]), 0)
    let amountOutPrevious = previousSwaps.reduce((sum, value) => sum + parseFloat(value.swaps[0].amountOutVaultUsd[0]), 0)
    let previousDeviation = getDeviation(amountInPrevious, amountOutPrevious)
    investmentsData.value[i]['Deviation %'] = calculatePercentageChange(previousDeviation, currentDeviation)
  }
}
function getDeviation(amountIn, amountOut) {
  let deviation = amountOut - amountIn
  return (deviation / amountIn) * 100
}

function AggregateJoinExit(joinExits, type) {
  return joinExits
    .filter((f) => f.type == type)
    .map((item) =>
      CalculateJoinExitPrice(null, item, historicalPrices.value, false),
    )
    .reduce((sum, value) => sum + value, 0)
}

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
  var [aave, compound, celsius, lido, yearn] = await Promise.all([GetAaveAprs(), GetCompoundAprs(), GetCelsiusAprs(), GetLidoApr(), GetYearnAprs()])

  marketData.value = {
    aave, compound, celsius, lido, yearn
  }
  aprData.value = FormatAprStatistics(marketData.value, chartData.value, tokensData.value, chainSelected.value.name)
}

onMounted(async () => {
  InitInvestmentsData()
  await Promise.all([InitRoi(), InitApr()])
})

watch(chartData, async () => {
  InitInvestmentsData()
  await Promise.all([InitRoi(), InitApr()])
})

watch(chainSelected, async () => {
  InitInvestmentsData()
  aprData.value = FormatAprStatistics(marketData.value, chartData.value, tokensData.value, chainSelected.value.name)
  roiData.value = await FormatRoiStatistics(chartData.value, allTokensInfo.value, top10Tokens.value, chainSelected.value.name)
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

  &_active {
    color: #009168;

  }
}

.chart_dropdown_items:hover {
  color: #00C087;
}

.stats_container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  padding: 30px 18px;
  border-radius: 20px;
  border: 0.5px solid rgba(163, 164, 165, 0.40);
}

.stats_column {
  display: flex;
  flex-direction: column;
  width: 500px;
  // gap: 100px !important;
}

.stats_column_charts {
  display: flex;
  flex-direction: column;
  width: 500px;
  gap: 55px;
}

.stats_column_tables {
  display: flex;
  flex-direction: column;
  width: 600px;
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

@media (max-width: $xxl2) {
  .stats_container {
    justify-content: space-around;
  }

  .stats_column {

    width: 30%;
  }

  .stats_column_tables {
    gap: 12px;
    width: 35%;
  }

  .stats_column_charts {
    width: 30%;
    gap: 67px;
  }
}


@media (max-width: $xl) {
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
    width: 8px !important;
    height: 8px !important;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #00C9FF;
    border-radius: 20px;
  }
}

.dp__theme_dark {
  --dp-background-color: rgba(15, 17, 19, 1);
  --dp-primary-color: rgb(1, 180, 126);
  --dp-highlight-color: rgba(1, 180, 126, 0.384);
  --dp-border-color: rgb(1, 180, 126);
  --dp-menu-border-color: rgb(1, 180, 126);
  --dp-border-color-hover: rgb(1, 180, 126);
  --dp-border-radius: clamp(10px, 0.8vw, 13px);
  --dp-input-icon-padding: 8px;
  --dp-action-buttons-padding: 3px 9px;
  --dp-action-button-height: 32px
}

.dp__action_button {
  line-height: normal;
}</style>
@/lib/formatter/statistics/roi/statisticsRoiFormatter