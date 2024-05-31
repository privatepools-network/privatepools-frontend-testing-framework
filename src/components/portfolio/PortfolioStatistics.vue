<template>
  <div class="stats_container dark:!bg-[#22222224] !bg-[white]">
    <div class="stats_column_tables">
      <div class="stats_column_tables_inside">
        <div class="d-flex align-items-center justify-content-between dark:!bg-[#02031C] !bg-[white] p-2">
          <div class="d-flex gap-2 items-center">
            <div class="font-medium text-sm text-black dark:!text-white">
              ROI
            </div>
            <VTooltip style="margin-top: -3px" :distance="0" :placement="'right'">
              <div style="cursor: help">
                <svg class="info_icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667
        12.904 7.479 12.712 7.287C12.52 7.095 12.2827 6.99933 12 7C11.7167 7 11.479 7.096 11.287 7.288C11.095 7.48
        10.9993 7.71733 11 8C11 8.28333 11.096 8.521 11.288 8.713C11.48 8.905 11.7173 9.00067 12 9ZM12 22C10.6167 22
        9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788
        15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825
        4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267
        15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667
        22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175
        19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675
        17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4
        7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20
        12 20Z" class="dark:!fill-white fill-black" />
                </svg>
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
                  <div style="font-size: clamp(10px, 0.9vw, 16px)">ROI</div>
                  <div style="
                      display: flex;
                      flex-direction: column;
                      font-size: clamp(10px, 0.8vw, 14px);
                    ">
                    <div><b>Average ROI:</b> Mean Return on Investment.</div>
                    <div><b>VS USD</b> ROI compared to US Dollar.</div>
                    <div>
                      <b>VS LIDO</b> Shows ROI relative to Lido across various
                      intervals.
                    </div>
                    <div><b>VS BTC</b> Compares ROI against Bitcoin.</div>
                    <div>
                      <b>VS DeFi Yield</b> ROI versus average DeFi yields.
                    </div>
                    <div><b></b></div>
                  </div>
                </div>
              </template>
            </VTooltip>
          </div>
        </div>

        <DataTable :default_head_captions="[
          t('period'),
          'ROI',
          'VS USD',
          'VS LIDO',
          'VS BTC',
          'VS DeFi YIELD',
        ]" :data="roiData" :table_bg="'rgba(7, 14, 15, 0.5)'" :rowHeight="'h-25'" fontSizeTable="small"
          :header_cells_bg="'table_header_cell_bg'" :displayTable="roiData"
          :header_cells_inside="'table_header_cell_inside'">
          <template v-slot:default="{ dataCell, dataCellKey }">
            <div v-if="dataCellKey === 'Period'" class="text-truncate file-table-cell"
              style="font-size: clamp(10px, 0.8vw, 13px); text-align: left" data-coreui-toggle="tooltip"
              data-coreui-placement="left" :title="dataCell">
              {{ dataCell }}
            </div>
            <div v-else :class="`text-truncate file-table-cell font-['Roboto_Mono',_monospace] ${parseFloat(dataCell) > 0
              ? 'positive'
              : parseFloat(dataCell) < 0
                ? 'negative'
                : ''
              }`" style="font-size: clamp(10px, 0.8vw, 13px)" data-coreui-toggle="tooltip" data-coreui-placement="left"
              :title="dataCell">
              <div class="d-flex align-items-center justify-content-end font-['Roboto_Mono',_monospace]" :class="{
                'text-danger': parseFloat(dataCell) < 0,
                'text-success': parseFloat(dataCell) > 0,
              }">
                <div>{{ parseFloat(dataCell) > 0 ? '+' : '' }}</div>
                <div class="font-['Roboto_Mono',_monospace]">{{ formatBigNumber(dataCell) }}</div>
                <div>%</div>
              </div>
            </div>
          </template>
        </DataTable>
      </div>
      <div class="stats_column_tables_inside">
        <div class="d-flex align-items-center justify-content-between dark:!bg-[#02031C] !bg-[white] p-2">
          <div class="d-flex gap-2 items-center">
            <div class="font-medium text-sm text-black dark:!text-white">
              APR
            </div>
            <VTooltip style="margin-top: -3px" :distance="0" :placement="'right'">
              <div style="cursor: help">
                <svg class="info_icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667
        12.904 7.479 12.712 7.287C12.52 7.095 12.2827 6.99933 12 7C11.7167 7 11.479 7.096 11.287 7.288C11.095 7.48
        10.9993 7.71733 11 8C11 8.28333 11.096 8.521 11.288 8.713C11.48 8.905 11.7173 9.00067 12 9ZM12 22C10.6167 22
        9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788
        15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825
        4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267
        15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667
        22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175
        19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675
        17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4
        7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20
        12 20Z" class="dark:!fill-white fill-black" />
                </svg>
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
                  <div style="font-size: clamp(10px, 0.9vw, 16px)">APR</div>
                  <div style="
                      display: flex;
                      flex-direction: column;
                      font-size: clamp(10px, 0.8vw, 14px);
                    ">
                    <div><b>Average APR:</b> Mean annualized return.</div>
                    <div><b>VS USD</b> APR comparison against US Dollar.</div>
                    <div>
                      <b>VS LIDO</b> APR relative to Lido over selected
                      timeframes.
                    </div>
                    <div><b>VS BTC</b> APR benchmarked against Bitcoin.</div>
                    <div>
                      <b>VS DeFi Yield</b> APR versus typical DeFi yields.
                    </div>
                    <div><b></b></div>
                  </div>
                </div>
              </template>
            </VTooltip>
          </div>
        </div>

        <DataTable :default_head_captions="[
          t('period'),
          'APR',
          'VS USD',
          'VS LIDO',
          'VS BTC',
          'VS DeFi YIELD',
        ]" :data="aprData" :table_bg="'rgba(7, 14, 15, 0.5)'" :rowHeight="'h-25'" fontSizeTable="small"
          :header_cells_bg="'table_header_cell_bg'" :displayTable="aprData"
          :header_cells_inside="'table_header_cell_inside'">
          <template v-slot:default="{ dataCell, dataCellKey }">
            <div v-if="dataCellKey === 'Period'" class="text-truncate file-table-cell"
              style="font-size: clamp(10px, 0.8vw, 13px); text-align: left" data-coreui-toggle="tooltip"
              data-coreui-placement="left" :title="dataCell">
              {{ dataCell }}
            </div>
            <div v-else :class="`text-truncate font-['Roboto_Mono',_monospace] file-table-cell  ${parseFloat(dataCell) > 0
              ? 'positive'
              : parseFloat(dataCell) < 0
                ? 'negative'
                : ''
              }`" style="font-size: clamp(10px, 0.8vw, 13px)" data-coreui-toggle="tooltip" data-coreui-placement="left"
              :title="dataCell">
              <div class="d-flex align-items-center justify-content-end font-['Roboto_Mono',_monospace]" :class="{
                'text-danger': parseFloat(dataCell) < 0,
                'text-success': parseFloat(dataCell) > 0,
              }">
                <div>{{ parseFloat(dataCell) > 0 ? '+' : '' }}</div>
                <div class="font-['Roboto_Mono',_monospace]">{{ formatBigNumber(dataCell) }}</div>
                <div>%</div>
              </div>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
    <div class="stats_column gap-xxl-5 gap-3">
      <div class="stats_column_inside">
        <div class="d-flex align-items-center justify-content-between dark:!bg-[#02031C] !bg-[white] p-2">
          <div class="d-flex gap-2 items-center">
            <div class="font-medium text-sm text-black dark:!text-white">
              {{ $t('drawdowns') }}
            </div>
            <VTooltip style="margin-top: -3px" :distance="0" :placement="'right'">
              <div style="cursor: help">
                <svg class="info_icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667
        12.904 7.479 12.712 7.287C12.52 7.095 12.2827 6.99933 12 7C11.7167 7 11.479 7.096 11.287 7.288C11.095 7.48
        10.9993 7.71733 11 8C11 8.28333 11.096 8.521 11.288 8.713C11.48 8.905 11.7173 9.00067 12 9ZM12 22C10.6167 22
        9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788
        15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825
        4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267
        15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667
        22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175
        19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675
        17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4
        7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20
        12 20Z" class="dark:!fill-white fill-black" />
                </svg>
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
                    {{ $t('drawdowns') }}
                  </div>
                  <div style="
                      display: flex;
                      flex-direction: column;
                      font-size: clamp(10px, 0.8vw, 14px);
                    ">
                    <div>
                      <b>Maximum Drawdown:</b> Peak-to-trough loss magnitude.
                    </div>
                    <div>
                      <b>Duration:</b> Time from drawdown start to lowest point.
                    </div>
                    <div>
                      <b>Recovery Period:</b> Time to return to peak after low.
                    </div>
                    <div><b>Capital Loss:</b> Actual monetary loss amount.</div>
                    <div>
                      <b>Percentual Impact:</b> Loss as a percentage of total
                      investment.
                    </div>
                    <div><b></b></div>
                  </div>
                </div>
              </template>
            </VTooltip>
          </div>
          <div class="d-flex align-items-center gap-2">
            <VueDatePicker class="dp__theme_dark" v-model="datePickerDrawdown" placeholder="Filter by Date" utc
              dark="true" range>
              <template #trigger>
                <div style="cursor: pointer"><img :src="calendar" /></div>
              </template>
            </VueDatePicker>
          </div>
        </div>
        <div v-if="drawDownData.length > 0" v-for="item in drawDownData" :key="item" style="padding: 0px 8px">
          <div class="d-flex align-items-center justify-content-between" style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            ">
            <div class="stats_text dark:!text-white text-black">{{ item.text }}</div>
            <div class="stats_value dark:!text-white text-black">{{ item.value }}</div>
          </div>
        </div>
        <div v-else v-for="item in drawDownTitles" :key="`draw-down-title-${item}`" style="padding: 0px 8px">
          <div class="d-flex align-items-center justify-content-between" style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            ">
            <div class="stats_text dark:!text-white text-black">{{ item }}</div>
            <div class="stats_value dark:!text-white text-black">
              <ThreeDots></ThreeDots>
            </div>
          </div>
        </div>
      </div>

      <div class="stats_column_inside">
        <div class="d-flex align-items-center justify-content-between dark:!bg-[#02031C] !bg-[white] p-2">
          <div class="d-flex gap-2 items-center">
            <div class="font-medium text-sm text-black dark:!text-white">
              {{ $t('risk_metrics') }}
            </div>
            <VTooltip style="margin-top: -3px" :distance="0" :placement="'right'">
              <div style="cursor: help">
                <svg class="info_icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667
        12.904 7.479 12.712 7.287C12.52 7.095 12.2827 6.99933 12 7C11.7167 7 11.479 7.096 11.287 7.288C11.095 7.48
        10.9993 7.71733 11 8C11 8.28333 11.096 8.521 11.288 8.713C11.48 8.905 11.7173 9.00067 12 9ZM12 22C10.6167 22
        9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788
        15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825
        4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267
        15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667
        22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175
        19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675
        17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4
        7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20
        12 20Z" class="dark:!fill-white fill-black" />
                </svg>
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
                    {{ $t('risk_metrics') }}
                  </div>
                  <div style="
                      display: flex;
                      flex-direction: column;
                      font-size: clamp(10px, 0.8vw, 14px);
                    ">
                    <div>
                      <b>Sharpe Ratio:</b> Assesses excess return per unit of
                      risk.
                    </div>
                    <div>
                      <b>Sortino Ratio:</b> Evaluates return for downside risk
                      only.
                    </div>
                    <div>
                      <b>Volatility:</b> Measures price fluctuation intensity.
                    </div>
                    <div><b></b></div>
                  </div>
                </div>
              </template>
            </VTooltip>
          </div>
          <div class="d-flex align-items-center gap-2">
            <VueDatePicker class="dp__theme_dark" v-model="datePickerRisks" placeholder="Filter by Date" utc dark="true"
              range>
              <template #trigger>
                <div style="cursor: pointer"><img :src="calendar" /></div>
              </template>
            </VueDatePicker>
            <!-- <Dropdown :distance="4" :placement="'bottom-center'">
              <div style="cursor: pointer">
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
                  <p @click="riskFreeOption = 'bonds'" v-close-popper :class="{
                    chart_dropdown_items_active: riskFreeOption == 'bonds',
                  }" class="chart_dropdown_items">
                    Risk-Free American Bonds
                  </p>
                  <p @click="riskFreeOption = 'dai'" v-close-popper :class="{
                    chart_dropdown_items_active: riskFreeOption == 'dai',
                  }" class="chart_dropdown_items">
                    Risk-Free Staked DAI
                  </p>
                </div>
              </template>
            </Dropdown> -->
          </div>
        </div>
        <div v-if="riskMetrics.length > 0" v-for="item in riskMetrics" :key="item" style="padding: 0px 8px">
          <div class="d-flex align-items-center justify-content-between" style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            ">
            <div class="stats_text dark:!text-white text-black">{{ item.text }}</div>
            <div class="stats_value dark:!text-white text-black">{{ item.value }}</div>
          </div>
        </div>
        <div v-else v-for="item in riskMetricsTitles" :key="`risk-metrics-title-${item}`" style="padding: 0px 8px">
          <div class="d-flex align-items-center justify-content-between" style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            ">
            <div class="stats_text dark:!text-white text-black">{{ item }}</div>
            <div class="stats_value dark:!text-white text-black">
              <ThreeDots></ThreeDots>
            </div>
          </div>
        </div>
      </div>

      <div class="stats_column_inside">
        <div class="d-flex align-items-center justify-content-between dark:!bg-[#02031C] !bg-[white] p-2">
          <div class="d-flex gap-2 items-center">
            <div class="font-medium text-sm text-black dark:!text-white">
              {{ $t('profits') }}
            </div>
            <VTooltip style="margin-top: -3px" :distance="0" :placement="'right'">
              <div style="cursor: help">
                <svg class="info_icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667
        12.904 7.479 12.712 7.287C12.52 7.095 12.2827 6.99933 12 7C11.7167 7 11.479 7.096 11.287 7.288C11.095 7.48
        10.9993 7.71733 11 8C11 8.28333 11.096 8.521 11.288 8.713C11.48 8.905 11.7173 9.00067 12 9ZM12 22C10.6167 22
        9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788
        15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825
        4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267
        15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667
        22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175
        19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675
        17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4
        7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20
        12 20Z" class="dark:!fill-white fill-black" />
                </svg>
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
                  <div style="font-size: clamp(10px, 0.9vw, 16px)">{{ $t('profits') }}</div>
                  <div style="
                      display: flex;
                      flex-direction: column;
                      font-size: clamp(10px, 0.8vw, 14px);
                    ">
                    <div>
                      <b>Average Profit per Trade:</b> The mean earnings across
                      individual trades.
                    </div>
                    <div>
                      <b>Average Profit per Pool:</b> Average earnings
                      calculated over a specific pool of trades.
                    </div>
                    <div><b></b></div>
                  </div>
                </div>
              </template>
            </VTooltip>
          </div>
          <div class="d-flex align-items-center gap-2">
            <VueDatePicker class="dp__theme_dark" v-model="datePickerProfit" placeholder="Filter by Date" utc
              dark="true" range>
              <template #trigger>
                <div style="cursor: pointer"><img :src="calendar" /></div>
              </template>
            </VueDatePicker>
          </div>
        </div>
        <div v-if="profitsData.length > 0" v-for="item in profitsData" :key="item" style="padding: 0px 8px">
          <div class="d-flex align-items-center justify-content-between" style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            ">
            <div class="stats_text dark:!text-white text-black">{{ item.text }}</div>
            <div class="stats_value dark:!text-white text-black">{{ item.value }}</div>
          </div>
        </div>
        <div v-else v-for="item in profitsTitles" :key="`profits-${item}`" style="padding: 0px 8px">
          <div class="d-flex align-items-center justify-content-between" style="
              border-bottom: 1px solid rgba(44, 44, 44, 0.2);
              padding: 8px 0px;
            ">
            <div class="stats_text dark:!text-white text-black">{{ item }}</div>
            <div class="stats_value dark:!text-white text-black">
              <ThreeDots></ThreeDots>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="stats_column_charts" style="gap: 30px">
      <div class="stats_column_inside">
        <div class="d-flex align-items-center justify-content-between dark:!bg-[#02031C] !bg-[white] p-2">
          <div class="d-flex align-items-center gap-2">
            <div class="d-flex gap-2 items-center align-items-baseline">
              <div style="
                  font-weight: 500;
                  font-size: clamp(10px, 0.9vw, 15px);
                " class="dark:!text-white text-black">
                {{ AssetsChart }}
              </div>
            </div>
          </div>
          <VTooltip style="margin-top: -3px" :distance="0" :placement="'right'">
            <div style="cursor: help">
              <svg class="info_icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667
        12.904 7.479 12.712 7.287C12.52 7.095 12.2827 6.99933 12 7C11.7167 7 11.479 7.096 11.287 7.288C11.095 7.48
        10.9993 7.71733 11 8C11 8.28333 11.096 8.521 11.288 8.713C11.48 8.905 11.7173 9.00067 12 9ZM12 22C10.6167 22
        9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788
        15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825
        4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267
        15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667
        22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175
        19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675
        17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4
        7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20
        12 20Z" class="dark:!fill-white fill-black" />
              </svg>
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
                  {{ $t('assets_breakdown') }}
                </div>
                <div style="
                    display: flex;
                    flex-direction: column;
                    font-size: clamp(10px, 0.8vw, 14px);
                  ">
                  <div>
                    This pie chart illustrates the distribution of assets,
                    categorized by type. Each segment represents a different
                    asset class, showing the proportion of each within the total
                    portfolio.
                  </div>
                </div>
              </div>
            </template>
          </VTooltip>
        </div>
        <div class="diagram-container">
          <div v-if="props.statistics">
            <apexchart v-if="AssetsChart === t('assets_breakdown')" :options="dynamicDonut(props.statistics.tokensBreakdown.map((a) => a.name.join('')),
              props.statistics.tokensBreakdown.map((a) => stringToColor(a.name.join(''))),
              props.statistics.tokensBreakdown,
            )
              " :series="props.statistics.tokensBreakdown.map((a) => parseFloat(a.tvl))" :height="410" :width="370" />
          </div>
          <div v-else style="height: 228px">
            <LoaderPulse></LoaderPulse>
          </div>
        </div>
      </div>

      <div class="stats_column_inside">
        <div class="d-flex align-items-center justify-content-between dark:!bg-[#02031C] !bg-[white] p-2">
          <div class="d-flex align-items-center gap-2">
            <div class="d-flex gap-2 items-center align-items-baseline">
              <div style="
                  font-weight: 500;
                  font-size: clamp(10px, 0.9vw, 15px);
                " class="dark:!text-white text-black">
                {{ BreakdownChart }}
              </div>
            </div>
          </div>
          <VTooltip style="margin-top: -3px" :distance="0" :placement="'right'">
            <div style="cursor: help">
              <svg class="info_icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667
        12.904 7.479 12.712 7.287C12.52 7.095 12.2827 6.99933 12 7C11.7167 7 11.479 7.096 11.287 7.288C11.095 7.48
        10.9993 7.71733 11 8C11 8.28333 11.096 8.521 11.288 8.713C11.48 8.905 11.7173 9.00067 12 9ZM12 22C10.6167 22
        9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788
        15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825
        4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267
        15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667
        22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175
        19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675
        17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4
        7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20
        12 20Z" class="dark:!fill-white fill-black" />
              </svg>
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
                  {{ $t('assets_breakdown') }}
                </div>
                <div style="
                    display: flex;
                    flex-direction: column;
                    font-size: clamp(10px, 0.8vw, 14px);
                  ">
                  <div>
                    This pie chart illustrates the distribution of assets,
                    categorized by type. Each segment represents a different
                    asset class, showing the proportion of each within the total
                    portfolio.
                  </div>
                </div>
              </div>
            </template>
          </VTooltip>
        </div>
        <div class="diagram-container">
          <div v-if="props.statistics">
            <apexchart v-if="BreakdownChart === t('pairs_breakdown')" :options="dynamicDonut(props.statistics.pairsBreakdown.map((a) => a.name.join('-')),
              props.statistics.pairsBreakdown.map((a) => stringToColor(a.name.join('-'))),
              props.statistics.pairsBreakdown,
            )" :series="props.statistics.pairsBreakdown.map((a) => parseFloat(a.tvl))" :height="410" :width="415" />
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
  getAveragePoolProfitPerTimeRange,
} from '@/composables/pools/usePoolSwapsStats'
import { formatBigNumber, stringToColor } from '@/lib/utils/index'
import { GetAaveAprs } from '@/composables/platforms/useAaveAprs'
import { GetCompoundAprs } from '@/composables/platforms/useCompoundAprs'
import { GetLidoApr } from '@/composables/platforms/useLidoApr'
import { GetCelsiusAprs } from '@/composables/platforms/useCelsiusAprs'
import { GetYearnAprs } from '@/composables/platforms/useYearnAprs'
import { GetTop10Tokens } from '@/composables/balances/cryptocompare'
import { GetHistoricalTokenPrices } from '@/composables/balances/useHistoricalTokenPrices'
import { FormatRoiStatistics } from '@/lib/formatter/statistics/roi/statisticsRoiFormatter'
import { FormatAprStatistics } from '@/lib/formatter/statistics/apr/statisticsAprFormatter'
import { AnalyzeDrawdowns } from '@/composables/math/chartMath/drawdownMath'
import ThreeDots from '@/components/loaders/ThreeDots.vue'
import { t } from 'i18next'
import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'


const settingsStore = useSettings();

const { currentCurrency } = storeToRefs(settingsStore)
const currencySymbol = computed(() => currentCurrency.value == "USD" ? "$" : currentCurrency.value)
const currencyDecimals = computed(() => currentCurrency.value == "USD" ? 2 : 5)
const postfix = computed(() => currentCurrency.value == "USD" ? "" : `_${currentCurrency.value}`)
const props = defineProps([
  'chainSelected',
  'poolSwapsData',
  'tokensData',
  'historical_tvl',
  'chartData',
  'historicalPrices',
  'userFirstTimestamp',
  'tokenPairs',
  'statistics'
])
const {
  chainSelected,
  poolSwapsData,
  tokensData,
  historical_tvl,
  chartData,
  historicalPrices,
  userFirstTimestamp,
  tokenPairs,
} = toRefs(props)

console.log(userFirstTimestamp)
function dynamicDonut(labels, arrayOfColors, data) {
  return {
    chart: {
      type: 'donut',
    },
    colors: ['#FA5173', '#01B47E', '#77aaff', '#FFD700'],
    data: data,
    labels: labels,
    legend: {
      show: true,
      fontSize: '14px',
      // fontFamily: 'Lato',
      fontWeight: 600,
      labels: {
        // colors: '#999',
        useSeriesColors: true,
      },
      markers: {
        fillColors: ['#FA5173', '#01B47E', '#77aaff', '#FFD700'],
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
      colors: ['#FA5173', '#01B47E', '#77aaff', '#FFD700'],
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
      colors: ['#181C1F'],
    },
    tooltip: {
      enabled: true,
      // eslint-disable-next-line
      custom({ series, seriesIndex, dataPointIndex, w }) {
        return (
          '<div style="background: linear-gradient(rgba(89, 89, 89, 1), rgba(73, 73, 73, 0.45)); padding: 10px;">' +
          '<h6 style="opacity:50%">' +
          w.config.labels[seriesIndex] +
          '</h6>' +
          '<div style="display:flex; flex-direction:column;">' +
          '<span>' +
          '<span style="font-weight:700">' +
          'TVL:  :' +
          '</span>' +
          ' ' +
          `${currencySymbol.value}${formatBigNumber(w.config.data[seriesIndex][`tvl${postfix.value}`])}` +
          '</span>' +
          '<span>' +
          '<span style="font-weight:700">' +
          'Allocation:' +
          '</span>' +
          ' ' +
          `${formatBigNumber(w.config.data[seriesIndex].allocation)}%` +
          '</span>' +
          '<span>' +
          '<span style="font-weight:700">' +
          'Nº Trades:' +
          '</span>' +
          ' ' +
          w.config.data[seriesIndex].trades +
          '</span>' +
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
}

const AssetsChart = ref(t('assets_breakdown'))
const BreakdownChart = ref(t('pairs_breakdown'))
const datePickerDrawdown = ref([new Date(userFirstTimestamp.value), new Date()])
const datePickerProfit = ref([new Date(userFirstTimestamp.value), new Date()])
const datePickerRisks = ref([new Date(userFirstTimestamp.value), new Date()])

watch(userFirstTimestamp, () => {
  datePickerDrawdown.value = [new Date(userFirstTimestamp.value), new Date()]
  datePickerProfit.value = [new Date(userFirstTimestamp.value), new Date()]
  datePickerRisks.value = [new Date(userFirstTimestamp.value), new Date()]
})

const riskFreeOption = ref('bonds')


const riskMetrics = computed(() => {
  if (chartData.value.length > 0) {
    return [
      {
        text: 'Sharpe Ratio',
        value: `${formatBigNumber(
          getSharpeRatioPerTimeRange(
            chartData.value,
            historicalPrices.value,
            tokensData.value,
            chainSelected.value.name,
            datePickerRisks.value[0],
            datePickerRisks.value[1],
            props.statistics.treasuryYield,
            riskFreeOption.value
          ),
        )}`,
      },
      {
        text: 'Sortino Ratio',
        value: `${formatBigNumber(
          getSortinoRatioPerTimeRange(
            chartData.value,
            historicalPrices.value,
            tokensData.value,
            chainSelected.value.name,
            datePickerRisks.value[0],
            datePickerRisks.value[1],
            props.statistics.treasuryYield,
            riskFreeOption.value
          ),
        )}`,
      },
      {
        text: 'Volatility Ratio',
        value: `${formatBigNumber(
          getVolatilityIndexPerTimeRange(
            chainSelected.value.name,
            chartData.value,
            historicalPrices.value,
            tokensData.value,
            datePickerRisks.value[0],
            datePickerRisks.value[1],
            props.statistics.treasuryYield,
            false,
            null,
            riskFreeOption.value,
          ),
        )}`,
      },
    ]
  } else {
    return []
  }
})

const riskMetricsTitles = ['Sharpe Ratio', 'Sortino Ratio', 'Volatility Ratio']

const profitsData = computed(() => {
  if (props.statistics) {
    return [
      {
        text: 'Average Profit per Trade',
        value: `${currencySymbol.value} ${getAverageProfitPerTimeRange(
          props.statistics.swaps,
          chainSelected.value.name,
          ...datePickerProfit.value,
          postfix.value
        ).toFixed(currencyDecimals.value)}`,
      },
    ]
  } else {
    return []
  }
})

const profitsTitles = ['Average Profit per Trade']

const drawDownData = computed(() =>
  chartData.value.length > 0
    ? AnalyzeDrawdowns(
      chartData.value,
      chainSelected.value.name,
      ...datePickerDrawdown.value,
      currencySymbol.value,
      postfix.value
    )
    : [],
)
const drawDownTitles = [
  'Maximum drawdown',
  'Duration',
  'Recovery Period',
  'Capital Loss',
  'Percentual Impact',
]

const roiData = computed(() => props.statistics ? Object.values(props.statistics.roiTable) : [])
const aprData = computed(() => props.statistics ? Object.values(props.statistics.aprTable) : [])

const top10Tokens = ref([])
const allTokensInfo = ref([])



let marketData = ref({})



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
  // color: rgba(243, 244, 246, 1);

  font-size: clamp(10px, 0.8vw, 14px);
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0em;
  text-align: left;
}

.stats_value {
  color: white;
  margin-right: 15px;
  font-family: 'Roboto Mono', monospace;

  font-size: clamp(10px, 0.8vw, 13px);
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0em;
  text-align: left;
}

.table_header_cell_bg {
  background: #2c2c2c50 !important;
  color: #9299aa !important;
  font-weight: 500 !important;
}

.table_header_cell_inside {
  justify-content: end;
}

.diagram-container {
  border-width: 0px, 1px, 1px, 1px;
  padding: clamp(10px, 0.9vw, 15px);

  border-style: solid;

  .apexcharts-inner {
    filter: drop-shadow(0 0 0.55rem rgba(98, 104, 143, 1));
  }
}

.chart_dropdown_items {
  cursor: pointer;
  font-size: clamp(10px, 0.8vw, 14px);

  &_active {
    color: #00c8ffda;
  }
}

.chart_dropdown_items:hover {
  color: #00c9ff;
}

.stats_container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  padding: 30px 18px;
  border-radius: 20px;
  // background: #22222224;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 4px 0px #00000040;
  backdrop-filter: blur(10px);
}

.stats_column {
  display: flex;
  flex-direction: column;
  width: 450px;
}

.stats_column_charts {
  display: flex;
  flex-direction: column;
  width: 30%;
}

.stats_column_tables {
  display: flex;
  flex-direction: column;
  width: 500px;
  gap: 35px;
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
    // gap: 0px;
    width: 35%;
  }

  .stats_column_charts {
    width: 30%;
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
    // gap: 0px;
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
  --dp-primary-color: #00c9ff;
  --dp-highlight-color: #00c8ff42;
  --dp-border-color: #00c9ff;
  --dp-menu-border-color: #00c9ff;
  --dp-border-color-hover: #00c9ff;
  --dp-border-radius: clamp(10px, 0.8vw, 13px);
  --dp-input-icon-padding: 8px;
  --dp-action-buttons-padding: 3px 9px;
  --dp-action-button-height: 32px;
}

.dp__action_button {
  line-height: normal;
}
</style>
@/lib/formatter/statistics/roi/statisticsRoiFormatter
