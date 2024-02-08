<template>
  <div class="finance_above_settings">
    <div class="chart-timeline">
      <Tabs :tabsOptions="timelines" :selectedTab="currentTimeline" @changeTab="changeTimeline"></Tabs>
    </div>
    <div class="finance_above_buttons">
      <div>
        <CButton color="success" variant="outline" @click="downloadPdf" style="
            border-radius: 20px;
            font-size: clamp(10px, 0.8vw, 14px);
            padding: 4px 8px;
          ">
          <div class="d-flex align-items-center gap-2 text-white">
            <img :src="downloadIcon" width="15" /> Download PDF
          </div>
        </CButton>
      </div>
      <div>
        <CButton color="success" variant="outline" style="
            border-radius: 20px;
            font-size: clamp(10px, 0.8vw, 14px);
            padding: 4px 8px;
          " @click="downloadCsv">
          <div class="d-flex align-items-center gap-2 text-white">
            <img :src="downloadIcon" width="15" /> Download CSV
          </div>
        </CButton>
      </div>
    </div>
  </div>
  <!-- PDF don't related! -->
  <div ref="content" style="position: absolute; z-index: -1; left: -9999999999px; top: -100%;">
    <div class="pdf" v-for="(financeDataChunk, index) in financeDataForPdf" :key="`pdf-el-${index}`">
      {{ console.log('financeDataForPdf', financeDataForPdf) }}
      <div class="pdf-line">
        <div class="pdf-column">
          <div class="pdf-title" style="font-size: 20px">
            Financial Statement
          </div>
          <br />
          <div class="pdf-title">Profit/Loss</div>
          <div style="font-size:8px" v-for="asset in financeDataChunk[0].AssetsProfitLossInfo"
            :key="`symbol-${asset.symbol}`">{{ asset.symbol }}
          </div>
        </div>
        <div class="pdf-column" v-for="(item, index) in financeDataChunk" :key="`pdf-line-${index}`">
          <div class="pdf-value">
            {{ item.date }}
          </div>
          <div class="pdf-value">
            {{ item.dateDays }}
          </div>
          <div class="pdf-value" style="margin-top: 6px">
            <span class="pdf-value__percent">(</span>
            <div class="pdf-value__current">
              {{ formatBigNumber(item.profitLoss) }}
            </div>
            <div class="pdf-value__percent" :class="item.profitLossPercents < 0 ? 'text-danger' : 'text-success'
              ">
              {{ computedPercent(item.profitLossPercents) }}
            </div>
            <span class="pdf-value__percent">)</span>
          </div>

          <div class="pdf-value">
            <div class="">
              <div style="font-size:8px" v-for="asset in item.AssetsProfitLossInfo" :key="asset.symbol">
                {{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{ formatBigNumber(asset.valueUsd,
                  2)
                }}

                <span :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </span>
              </div>
            </div>
          </div>



        </div>
      </div>




      <div class="pdf-line pdf-line_major">
        <div class="pdf-column_major">
          <div class="pdf-title">Portfolio</div>
        </div>
      </div>
      <div class="pdf-line">
        <div class="pdf-column">
          <div class="pdf-title">Liquidity Deposits/Withdraws</div>

          <div class="pdf-title" style="font-size:10px !important">Deposit:</div>
          <div style="font-size:8px" v-for="asset in financeDataChunk[0].AssetsProfitLossInfo"
            :key="`symbol-${asset.symbol}`">{{ asset.symbol }}
          </div>

          <div class="pdf-title" style="font-size:10px !important">Withdraw:</div>
          <div style="font-size:8px" v-for="asset in financeDataChunk[0].AssetsProfitLossInfo"
            :key="`symbol-${asset.symbol}`">{{ asset.symbol }}
          </div>

          <div class="pdf-title">Trading Volume</div>
          <div style="font-size:8px" v-for="asset in financeDataChunk[0].AssetsVolumeInfo"
            :key="`symbol-${asset.symbol}`">{{ asset.symbol }}
          </div>
        </div>


        <div class="pdf-column" v-for="(item, index) in financeDataChunk" :key="`pdf-line-${index}`">
          <div class="pdf-value"></div>
          <div class="pdf-value">
            <div class="pdf-value__current">
              {{ formatBigNumber(item.LiquidityDeposited) }}
            </div>
            <div class="pdf-value__percent" :class="item.LiquidityDepositedPercent < 0
              ? 'text-danger'
              : 'text-success'
              ">
              {{ computedPercent(item.LiquidityDepositedPercent) }}
            </div>
          </div>

          <div class="pdf-value">
            <div class="pdf-value__current" style="font-size:10px !important">
              {{ formatBigNumber(item.Deposits) }}
            </div>
            <div style="font-size:10px !important" class="pdf-value__percent" :class="item.DepositsPercent < 0
              ? 'text-danger'
              : 'text-success'
              ">
              {{ computedPercent(item.DepositsPercent) }}
            </div>
          </div>



          <div class="pdf-value">
            <div class="">
              <div style="font-size:8px" v-for="asset in item.AssetsDepositInfo" :key="asset.symbol">
                {{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{ formatBigNumber(asset.valueUsd,
                  2)
                }}

                <span :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </span>
              </div>
            </div>
          </div>

          <div class="pdf-value">
            <div class="pdf-value__current" style="font-size:10px !important">
              {{ formatBigNumber(item.Withdraws) }}
            </div>
            <div style="font-size:10px !important" class="pdf-value__percent" :class="item.WithdrawsPercent < 0
              ? 'text-danger'
              : 'text-success'
              ">
              {{ computedPercent(item.WithdrawsPercent) }}
            </div>
          </div>


          <div class="pdf-value">
            <div class="">
              <div style="font-size:8px" v-for="asset in item.AssetsWithdrawInfo" :key="asset.symbol">
                {{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{ formatBigNumber(asset.valueUsd,
                  2)
                }}

                <span :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </span>
              </div>
            </div>
          </div>

          <div class="pdf-value">
            <div class="pdf-value__current">
              {{ formatBigNumber(item.TradingVolume) }}
            </div>
            <div class="pdf-value__percent" :class="item.LiquidityDepositedPercent < 0
              ? 'text-danger'
              : 'text-success'
              ">
              {{ computedPercent(item.TradingVolumePercents) }}
            </div>
          </div>


          <div class="pdf-value">
            <div class="">
              <div style="font-size:8px" v-for="asset in item.AssetsVolumeInfo" :key="asset.symbol">
                {{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{ formatBigNumber(asset.valueUsd,
                  2)
                }}

                <span :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </span>
              </div>
            </div>
          </div>



        </div>
      </div>

      <div class="pdf-line pdf-line_major">
        <div class="pdf-column_major">
          <div class="pdf-title">Income Statement</div>
        </div>
      </div>
      <div class="pdf-line">
        <div class="pdf-column">

          <div class="pdf-title">Revenue</div>
          <div style="font-size:8px" v-for="asset in financeDataChunk[0].AssetsRevenueInfo"
            :key="`symbol-${asset.symbol}`">{{ asset.symbol }}
          </div>
          <div class="pdf-title">Fees</div>
          <div style="font-size:8px" v-for="asset in financeDataChunk[0].AssetsGasFeeInfo"
            :key="`symbol-${asset.symbol}`">{{ asset.symbol }}
          </div>
          <div class="pdf-title">Profits</div>
          <div style="font-size:8px" v-for="asset in financeDataChunk[0].AssetsRevenueInfo"
            :key="`symbol-${asset.symbol}`">{{ asset.symbol }}
          </div>
        </div>

        <div class="pdf-column" v-for="(item, index) in financeDataChunk" :key="`pdf-line-${index}`">
          <div class="pdf-value"></div>

          <div class="pdf-value">
            <div class="pdf-value__current">
              {{ formatBigNumber(item.Revenue) }}
            </div>
            <div class="pdf-value__percent" :class="item.RevenuePercent < 0 ? 'text-danger' : 'text-success'">
              {{ computedPercent(item.RevenuePercent) }}
            </div>
          </div>

          <div class="pdf-value">
            <div class="">
              <div style="font-size:8px" v-for="asset in item.AssetsRevenueInfo" :key="asset.symbol">
                {{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{ formatBigNumber(asset.valueUsd,
                  2)
                }}

                <span :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </span>
              </div>
            </div>
          </div>


          <div class="pdf-value">
            <div class="pdf-value__current">
              {{ formatBigNumber(item.Fees) }}
            </div>
            <div class="pdf-value__percent" :class="item.FeesPercent < 0 ? 'text-danger' : 'text-success'">
              {{ computedPercent(item.FeesPercent) }}
            </div>
          </div>

          <div class="pdf-value">
            <div class="">
              <div style="font-size:8px" v-for="asset in item.AssetsGasFeeInfo" :key="asset.symbol">
                {{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{ formatBigNumber(asset.valueUsd,
                  2)
                }}

                <span :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </span>
              </div>
            </div>
          </div>

          <div class="pdf-value">
            <div class="pdf-value__current">
              {{ formatBigNumber(item.Profit) }}
            </div>
            <div class="pdf-value__percent" :class="item.ProfitPercent < 0 ? 'text-danger' : 'text-success'">
              {{ computedPercent(item.ProfitPercent) }}
            </div>
          </div>

          <div class="pdf-value">
            <div class="">
              <div style="font-size:8px" v-for="asset in item.AssetsProfitInfo" :key="asset.symbol">
                {{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{ formatBigNumber(asset.valueUsd,
                  2)
                }}

                <span :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="pdf-line pdf-line_major">
        <div class="pdf-column_major">
          <div class="pdf-title">Holdings</div>
        </div>
      </div>
      <div class="pdf-line">
        <div class="pdf-column">


          <div class="pdf-title">Initial Liquidity</div>
          <div style="font-size:8px" v-for="asset in financeDataChunk[0].AssetsInitialLiquidityInfo"
            :key="`symbol-${asset.symbol}`">{{ asset.symbol }}
          </div>
          <div class="pdf-title">Final Liquidity</div>
          <div style="font-size:8px" v-for="asset in financeDataChunk[0].AssetsFinalLiquidityInfo"
            :key="`symbol-${asset.symbol}`">{{ asset.symbol }}
          </div>
          <div class="pdf-title">Assets</div>
          <div style="font-size:8px" v-for="asset in financeDataChunk[0].AssetsInfo" :key="`symbol-${asset.symbol}`">{{
            asset.symbol }}
          </div>
          <div class="pdf-title">Pools</div>
          <div style="font-size:8px" v-for="pool in financeDataChunk[0].PoolsInfo" :key="pool.name">
            {{ pool.name }}
          </div>
        </div>

        <div class="pdf-column" v-for="(item, index) in financeDataChunk" :key="`pdf-line-${index}`">
          <div class="pdf-value"></div>

          <div class="pdf-value">
            <div class="pdf-value__current">
              {{ formatBigNumber(item.InitialLiquidity, 2) }}
            </div>
            <div class="pdf-value__percent" :class="item.InitialLiquidity < 0 ? 'text-danger' : 'text-success'">
              {{ computedPercent(item.InitialLiquidity) }}
            </div>
          </div>

          <div class="pdf-value">
            <div class="">
              <div style="font-size:8px" v-for="asset in item.AssetsInitialLiquidityInfo" :key="asset.symbol">
                {{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{ formatBigNumber(asset.valueUsd,
                  2)
                }}

                <span :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </span>
              </div>
            </div>
          </div>


          <div class="pdf-value">
            <div class="pdf-value__current">
              {{ formatBigNumber(item.FinalLiquidity, 1) }}
            </div>
            <div class="pdf-value__percent" :class="item.FinalLiquidity < 0 ? 'text-danger' : 'text-success'">
              {{ computedPercent(item.FinalLiquidity) }}
            </div>
          </div>

          <div class="pdf-value">
            <div class="">
              <div style="font-size:8px" v-for="asset in item.AssetsFinalLiquidityInfo" :key="asset.symbol">
                {{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{ formatBigNumber(asset.valueUsd,
                  2)
                }}

                <span :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </span>
              </div>
            </div>
          </div>


          <div class="pdf-value">
            <div class="pdf-value__current">
              {{ formatBigNumber(item.Assets, 4) }}
            </div>
            <div class="pdf-value__percent" :class="item.Assets < 0 ? 'text-danger' : 'text-success'
              ">
              {{ computedPercent(item.Assets) }}
            </div>
          </div>

          <div class="pdf-value">
            <div class="">
              <div style="font-size:8px" v-for="asset in item.AssetsInfo" :key="asset.symbol">
                {{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{ formatBigNumber(asset.valueUsd,
                  2)
                }}

                <span :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </span>
              </div>
            </div>
          </div>


          <div class="pdf-value">
            <div class="pdf-value__current">
              {{ formatBigNumber(item.Pools, 4) }}
            </div>
            <div class="pdf-value__percent" :class="item.Pools < 0 ? 'text-danger' : 'text-success'
              ">
              {{ computedPercent(item.Pools) }}
            </div>
          </div>

          <div class="pdf-value">
            <div class="">
              <div style="font-size:8px" v-for="asset in item.PoolsInfo" :key="asset.symbol">
                {{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{ formatBigNumber(asset.valueUsd,
                  2)
                }}

                <span :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="pdf-line pdf-line_major">
        <div class="pdf-column_major">
          <div class="pdf-title">Alternative Kpis</div>
        </div>
      </div>
      <div class="pdf-line">
        <div class="pdf-column">
          <div class="pdf-title">Active Users</div>
          <div class="pdf-title">Core Developers</div>
          <div class="pdf-title">Code Commits</div>
        </div>

        <div class="pdf-column" v-for="(item, index) in financeDataChunk" :key="`pdf-line-${index}`">
          <div class="pdf-value"></div>
          <div class="pdf-value">
            <div class="pdf-value__current">
              {{ formatBigNumber(item.ActiveUsers) }}
            </div>
            <div class="pdf-value__percent" :class="item.ActiveUsersPercent < 0 ? 'text-danger' : 'text-success'
              ">
              {{ computedPercent(item.ActiveUsersPercent) }}
            </div>
          </div>
          <div class="pdf-value">
            <div class="pdf-value__current">
              {{ formatBigNumber(item.Developers, 2) }}
            </div>
            <div class="pdf-value__percent" :class="item.DevelopersPercent < 0 ? 'text-danger' : 'text-success'
              ">
              {{ computedPercent(item.DevelopersPercent) }}
            </div>
          </div>
          <div class="pdf-value">
            <div class="pdf-value__current">
              {{ formatBigNumber(item.Commits, 2) }}
            </div>
            <div class="pdf-value__percent" :class="item.CommitsPercent < 0 ? 'text-danger' : 'text-success'">
              {{ computedPercent(item.CommitsPercent) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>





  <div class="mt-5 finance_table" style="position: relative">
    <div class="financial_header column_loading">
      <div class="sticky_first_column">
        <div class="financial_header_text">Financial Statement</div>
        <div class="collapsed_subheader financial_header_text" @click="visibleProfitLoss = !visibleProfitLoss">
          <div>Profit/Loss</div>
          <div>
            <img :src="arrow_up" :class="visibleProfitLoss ? 'toggle-down' : 'toggle-up'" />
          </div>
        </div>
        <CCollapse :visible="visibleProfitLoss">
          <div class="financial_header_text">
            <div class="d-flex flex-column gap-2" v-if="financeData.length > 0">
              <div v-for="asset in financeData[0].AssetsProfitLossInfo" :key="asset.symbol">
                {{ asset.symbol }}
              </div>
            </div>
          </div>
        </CCollapse>
      </div>
      <div style="min-width: 300px; text-align: right"
        v-for="(item, index) in financeData.sort((a, b) => b.start - a.start)" :key="`date-key-${index}`">
        <div class="financial_header_text">{{ item.date }}</div>
        <div class="financial_header_subtext">{{ item.dateDays }}</div>
        <div class="financial_header_subtext d-flex gap-1 justify-content-end">
          (
          <div>{{ symbol }}{{ formatBigNumber(item.profitLoss) }}</div>
          <div :class="item.profitLossPercents < 0 ? 'text-danger' : 'text-success'
            ">
            {{ computedPercent(item.profitLossPercents) }}
          </div>
          )
        </div>
        <CCollapse :visible="visibleProfitLoss">
          <div class="financial_header_text">
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsProfitLossInfo"
                :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{
                  formatBigNumber(asset.valueUsd, 2) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
      </div>
    </div>
    <div class="financial_block_without_bg column_loading">
      <div class="sticky_column_without_bg">
        <div class="financial_header_text" style="font-size: clamp(10px, 0.9vw, 16px)">
          Portfolio
        </div>
        <div class="d-flex flex-column gap-4 pt-3">
          <div class="collapsed_subheader" @click="visibleLiquidity = !visibleLiquidity">
            <div>Liquidity Deposits/Withdraws</div>
            <div>
              <img :src="arrow_up" :class="visibleLiquidity ? 'toggle-down' : 'toggle-up'" />
            </div>
          </div>
          <div v-if="visibleLiquidity" class="collapsed_subheader">
            <div>Deposits:</div>
          </div>
          <CCollapse :visible="visibleLiquidity">
            <div>
              <div class="d-flex flex-column gap-2" v-if="financeData.length > 0">
                <div v-for="asset in financeData[0].AssetsDepositInfo" :key="asset.symbol">
                  {{ asset.symbol }}
                </div>
              </div>
            </div>
          </CCollapse>
          <div v-if="visibleLiquidity" class="collapsed_subheader">
            <div>Withdraws:</div>
          </div>
          <CCollapse :visible="visibleLiquidity">
            <div>
              <div class="d-flex flex-column gap-2" v-if="financeData.length > 0">
                <div v-for="asset in financeData[0].AssetsWithdrawInfo" :key="asset.symbol">
                  {{ asset.symbol }}
                </div>
              </div>
            </div>
          </CCollapse>
          <div class="collapsed_subheader" @click="visibleVolume = !visibleVolume">
            <div>Trading Volume</div>
            <div>
              <img :src="arrow_up" :class="visibleVolume ? 'toggle-down' : 'toggle-up'" />
            </div>
          </div>
          <CCollapse :visible="visibleVolume">
            <div>
              <div class="d-flex flex-column gap-2" v-if="financeData.length > 0">
                <div v-for="asset in financeData[0].AssetsVolumeInfo" :key="asset.symbol">
                  {{ asset.symbol }}
                </div>
              </div>
            </div>
          </CCollapse>
        </div>
      </div>
      <div style="margin-top: 56px; min-width: 300px; text-align: right" class="d-flex flex-column gap-4"
        v-for="(item, index) in financeData" :key="`Portfolio-key-${index}`">
        <div class="d-flex gap-2 justify-content-end">
          {{ symbol }}{{ formatBigNumber(item.LiquidityDeposited) }}
          <div :class="item.LiquidityDepositedPercent < 0
            ? 'text-danger'
            : 'text-success'
            ">
            {{ computedPercent(item.LiquidityDepositedPercent) }}
          </div>
        </div>
        <div v-if="visibleLiquidity" class="d-flex gap-1 justify-content-end">
          <div>{{ symbol }}{{ formatBigNumber(item.Deposits, 3) }}</div>
          <div :class="item.DepositsPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.DepositsPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleLiquidity">
          <div>
            <div class="d-flex flex-column gap-2">
              <div></div>
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsDepositInfo" :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{
                  formatBigNumber(asset.valueUsd, 2) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
        <div v-if="visibleLiquidity" class="d-flex gap-1 justify-content-end">
          <div>{{ symbol }}{{ formatBigNumber(item.Withdraws, 3) }}</div>
          <div :class="item.WithdrawsPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.WithdrawsPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleLiquidity">
          <div>
            <div class="d-flex flex-column gap-2">
              <div></div>
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsWithdrawInfo" :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{
                  formatBigNumber(asset.valueUsd, 2) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
        <div class="d-flex gap-2 justify-content-end">
          {{ symbol }}{{ formatBigNumber(item.TradingVolume) }}
          <div :class="item.TradingVolumePercents < 0 ? 'text-danger' : 'text-success'
            ">
            {{ computedPercent(item.TradingVolumePercents) }}
          </div>
        </div>
        <CCollapse :visible="visibleVolume">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsVolumeInfo" :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{
                  formatBigNumber(asset.valueUsd, 2) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div style="height: 27px"></div>
      </div>
    </div>
    <div class="financial_block_with_bg column_loading">
      <div class="sticky_column_with_bg">
        <div class="financial_header_text" style="font-size: clamp(10px, 0.9vw, 16px)">
          Income Statement
        </div>
        <div class="d-flex flex-column gap-3 pt-3">

          <div class="collapsed_subheader" @click="visibleRevenue = !visibleRevenue">
            <div>Revenue</div>
            <div>
              <img :src="arrow_up" :class="visibleRevenue ? 'toggle-down' : 'toggle-up'" />
            </div>
          </div>
          <CCollapse :visible="visibleRevenue">
            <div>
              <div class="d-flex flex-column gap-2" v-if="financeData.length > 0">
                <div v-for="asset in financeData[0].AssetsRevenueInfo" :key="asset.symbol">
                  {{ asset.symbol }}
                </div>
              </div>
            </div>
          </CCollapse>
          <div class="collapsed_subheader" @click="visibleGasFee = !visibleGasFee">
            <div>Fees</div>
            <div>
              <img :src="arrow_up" :class="visibleGasFee ? 'toggle-down' : 'toggle-up'" />
            </div>
          </div>
          <CCollapse :visible="visibleGasFee">
            <div>
              <div class="d-flex flex-column gap-2" v-if="financeData.length > 0">
                <div v-for="asset in financeData[0].AssetsGasFeeInfo" :key="asset.symbol">
                  {{ asset.symbol }}
                </div>
              </div>
            </div>
          </CCollapse>
          <div class="collapsed_subheader" @click="visibleProfits = !visibleProfits">
            <div>Profits</div>
            <div>
              <img :src="arrow_up" :class="visibleProfits ? 'toggle-down' : 'toggle-up'" />
            </div>
          </div>
          <CCollapse :visible="visibleProfits">
            <div>
              <div class="d-flex flex-column gap-2" v-if="financeData.length > 0">
                <div v-for="asset in financeData[0].AssetsProfitInfo" :key="asset.symbol">
                  {{ asset.symbol }}
                </div>
              </div>
            </div>
          </CCollapse>
          <div style="padding-left: 15px">(Token Incentives)</div>

        </div>
      </div>
      <div style="margin-top: 56px; min-width: 300px; text-align: right" class="d-flex flex-column gap-3"
        v-for="(item, index) in financeData" :key="`Portfolio-key-${index}`">
        <div class="d-flex justify-content-end gap-2">
          {{ symbol }}{{ formatBigNumber(item.Revenue, 2) }}
          <div :class="item.RevenuePercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.RevenuePercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleRevenue">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsRevenueInfo" :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{
                  formatBigNumber(asset.valueUsd, 2) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
        <div class="d-flex justify-content-end gap-2">
          {{ symbol }}{{ formatBigNumber(item.Fees, 2) }}
          <div :class="item.FeesPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.FeesPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleGasFee">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsGasFeeInfo" :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{
                  formatBigNumber(asset.valueUsd, 2) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="d-flex justify-content-end gap-2">
          {{ symbol }}{{ formatBigNumber(item.Profit, 2) }}
          <div :class="item.ProfitPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.ProfitPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleProfits">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsProfitInfo" :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{
                  formatBigNumber(asset.valueUsd, 2) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div style="color: rgba(103, 103, 103, 1)" v-if="item.TokenIncentives === null">
          <div class="d-flex justify-content-end gap-1">
            N/A <img :src="infoGray" width="18" />
          </div>
        </div>
        <div v-else>{{ item.TokenIncentives }}</div>
      </div>
    </div>

    <div class="financial_block_without_bg column_loading">
      <div class="sticky_column_without_bg">
        <div class="financial_header_text" style="font-size: clamp(10px, 0.9vw, 16px)">
          Holdings
        </div>
        <div class="d-flex flex-column gap-4 pt-3">
          <div class="collapsed_subheader" @click="visibleInitialLiquidity = !visibleInitialLiquidity">
            <div>Initial Liquidity</div>
            <div>
              <img :src="arrow_up" :class="visibleInitialLiquidity ? 'toggle-down' : 'toggle-up'" />
            </div>
          </div>
          <CCollapse :visible="visibleInitialLiquidity">
            <div>
              <div class="d-flex flex-column gap-2" v-if="financeData.length > 0">
                <div v-for="asset in financeData[0].AssetsInitialLiquidityInfo" :key="asset.symbol">
                  {{ asset.symbol }}
                </div>
              </div>
            </div>
          </CCollapse>
          <div class="collapsed_subheader" @click="visibleFinalLiquidity = !visibleFinalLiquidity">
            <div>Final Liquidity</div>
            <div>
              <img :src="arrow_up" :class="visibleFinalLiquidity ? 'toggle-down' : 'toggle-up'" />
            </div>
          </div>
          <CCollapse :visible="visibleFinalLiquidity">
            <div>
              <div class="d-flex flex-column gap-2" v-if="financeData.length > 0">
                <div v-for="asset in financeData[0].AssetsFinalLiquidityInfo" :key="asset.symbol">
                  {{ asset.symbol }}
                </div>
              </div>
            </div>
          </CCollapse>
          <div class="collapsed_subheader" @click="visibleAssets = !visibleAssets">
            <div>Assets</div>
            <div>
              <img :src="arrow_up" :class="visibleAssets ? 'toggle-down' : 'toggle-up'" />
            </div>
          </div>
          <CCollapse :visible="visibleAssets">
            <div>
              <div class="d-flex flex-column gap-2" v-if="financeData.length > 0">
                <div v-for="asset in financeData[0].AssetsInfo" :key="asset.symbol">
                  {{ asset.symbol }}
                </div>
              </div>
            </div>
          </CCollapse>
          <div class="collapsed_subheader" @click="visiblePools = !visiblePools">
            <div>Pools</div>
            <div>
              <img :src="arrow_up" :class="visiblePools ? 'toggle-down' : 'toggle-up'" />
            </div>
          </div>
          <CCollapse :visible="visiblePools">
            <div>
              <div class="d-flex flex-column gap-2" v-if="financeData.length > 0">
                <div v-for="pool in financeData[0].PoolsInfo" :key="pool.name">
                  {{ pool.name }}
                </div>
              </div>
            </div>
          </CCollapse>
          <div>Capital Gains</div>
        </div>
      </div>
      <div style="margin-top: 56px; min-width: 300px; text-align: right" class="d-flex flex-column gap-4"
        v-for="(item, index) in financeData" :key="`Portfolio-key-${index}`">
        <div class="d-flex justify-content-end gap-2">
          {{ symbol }}{{ formatBigNumber(item.InitialLiquidity, 1) }}
          <div :class="item.InitialLiquidityPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.InitialLiquidityPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleInitialLiquidity">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsInitialLiquidityInfo"
                :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{
                  formatBigNumber(asset.valueUsd, 4) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="d-flex justify-content-end gap-2">
          {{ symbol }}{{ formatBigNumber(item.FinalLiquidity, 1) }}
          <div :class="item.FinalLiquidityPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.FinalLiquidityPercent) }}
          </div>
        </div>

        <CCollapse :visible="visibleFinalLiquidity">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsFinalLiquidityInfo"
                :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} - {{ symbol }}{{
                  formatBigNumber(asset.valueUsd, 4) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
        <div class="d-flex justify-content-end gap-2">
          {{ symbol }}{{ formatBigNumber(item.Assets, 2) }}
          <div :class="item.AssetsPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.AssetsPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleAssets">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsInfo" :key="asset.symbol">
                <div>{{ formatBigNumber(asset.balance, 4) }} {{ asset.symbol }} - {{ symbol }}{{
                  formatBigNumber(asset.value, 4) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
        <div class="d-flex justify-content-end gap-2">
          {{ symbol }}{{ formatBigNumber(item.Pools, 1) }}
          <div :class="item.PoolsPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.PoolsPercent) }}
          </div>
        </div>
        <CCollapse :visible="visiblePools">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="pool in item.PoolsInfo" :key="pool.name">
                <div>{{ symbol }}{{ formatBigNumber(pool.value, 4) }}</div>
                <div :class="pool.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(pool.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
        <div class="d-flex justify-content-end gap-2">
          {{ symbol }}{{ formatBigNumber(item.CapitalGains) }}
          <div :class="item.CapitalGainsPercent < 0 ? 'text-danger' : 'text-success'
            ">
            {{ computedPercent(item.CapitalGainsPercent) }}
          </div>
        </div>
      </div>
    </div>

    <div class="financial_block_with_bg column_loading">
      <div class="sticky_column_with_bg">
        <div class="financial_header_text" style="font-size: clamp(10px, 0.9vw, 16px)">
          Alternative Kpis
        </div>
        <div class="d-flex flex-column gap-3 pt-3">
          <div class="collapsed_subheader" @click="visibleActiveUsers = !visibleActiveUsers">
            <div>Active Users</div>
          </div>
          <div class="collapsed_subheader" @click="visibleCoreDevelopers = !visibleCoreDevelopers">
            <div>Core Developers</div>
          </div>

          <div class="collapsed_subheader" @click="visibleCodeCommits = !visibleCodeCommits">
            <div>Code commits</div>
          </div>
        </div>
      </div>
      <div style="margin-top: 56px; min-width: 300px; text-align: right" class="d-flex flex-column gap-3"
        v-for="(item, index) in financeData" :key="`Portfolio-key-${index}`">
        <div class="d-flex flex-column gap-2">
          <div class="d-flex gap-1 justify-content-end">
            <div>{{ formatBigNumber(item.ActiveUsers) }}</div>
            <div :class="item.ActiveUsersPercent < 0 ? 'text-danger' : 'text-success'
              ">
              {{ computedPercent(item.ActiveUsersPercent) }}
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2">
          {{ formatBigNumber(item.Developers, 2) }}
          <div :class="item.DevelopersPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.DevelopersPercent) }}
          </div>
        </div>
        <div class="d-flex justify-content-end gap-2">
          {{ formatBigNumber(item.Commits, 2) }}
          <div :class="item.CommitsPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.CommitsPercent) }}
          </div>
        </div>

        <div style="height: 27px"></div>
      </div>
    </div>

    <div style="position: absolute; left: 50%; top: 50%">
      <LoaderPulse v-if="!isDataReady"></LoaderPulse>
    </div>
  </div>
</template>
<script setup>
import Tabs from '@/UI/Tabs.vue'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import { ref, defineProps, toRefs, computed, onBeforeMount } from 'vue'
import downloadIcon from '../../assets/icons/download.svg'
import arrow_up from '@/assets/icons/arrow/arrow_up.svg'
import infoGray from '@/assets/icons/infoGray.svg'
import { FormatFinancialStatementData } from '@/lib/formatter/financialStatement/financialStatementFormatter'
import { FormatHistoricalTokens } from '@/lib/formatter/financialStatement/historicalTokensFormatter'
import { formatBigNumber } from '@/lib/utils/index'
import { Network } from '@/composables/useNetwork'

import { GetHistoricalTokens } from '@/composables/balances/useHistoricalTokens'
import axios from 'axios'
import { jsPDF } from 'jspdf'

const props = defineProps([
  'chainSelected',
  'poolSwapsData',
  'historical_tvl',
  'historicalPrices',
  'symbol',
  'joinExits',
  'activeUsers'
])

const { chainSelected, poolSwapsData, historical_tvl, historicalPrices, joinExits, activeUsers } =
  toRefs(props)
const historicalTokens = ref(null)
const isDataReady = computed(
  () =>
    joinExits.value &&
    historicalPrices.value &&
    poolSwapsData.value &&
    historical_tvl.value &&
    activeUsers.value &&
    historicalTokens.value,
)
console.log(joinExits, historicalPrices, poolSwapsData, historical_tvl)
const data = computed(() =>
  isDataReady.value
    ? FormatFinancialStatementData(
      poolSwapsData.value,
      historical_tvl.value,
      activeUsers.value,
      historicalTokens.value,
      githubInfo.value,
      historicalPrices.value,
      joinExits.value,
      chainSelected.value.name,
    )
    : null,
)

const timelines = ['Weekly', 'Monthly', 'Quarterly', 'Yearly']

function computedPercent(number) {
  let formatted_number = formatBigNumber(number, 3)
  return (number < 0 ? '' : '+') + formatted_number + '%'
}

function downloadCsv() {
  let csvArr = [
    ['Financial Statement'],
    ['Liquidity Deposits/Withdraws'],
    ['Trading Volume'],
    ['Fees'],
    ['Revenue'],
    ['Assets'],
    ['Pools'],
    ['Capital gains'],
    ['Active Users'],
    ['Core Developers'],
    ['Code commits'],
  ]
  csvArr.forEach((item) => {
    switch (item) {
      case 'Financial Statement': {
        financeData.value.forEach()
      }
    }
  })
  console.log(financeData.value)
  financeData.value.forEach((item) => {
    for (let itemKey in item) {
      switch (itemKey) {
        case 'date': {
          csvArr[0].push(item[itemKey])
          csvArr[0].push(item[itemKey] + ' change')
          break
        }
        case 'LiquidityDeposited': {
          csvArr[1].push(formatBigNumber(item[itemKey]))
          csvArr[1].push(computedPercent(item['LiquidityDepositedPercent']))
          break
        }
        case 'TradingVolume': {
          csvArr[2].push(formatBigNumber(item[itemKey]))
          csvArr[2].push(computedPercent(item['TradingVolumePercents']))
          break
        }
        case 'Fees': {
          csvArr[3].push(formatBigNumber(item[itemKey]))
          csvArr[3].push(computedPercent(item['FeesPercent']))
          break
        }
        case 'Revenue': {
          csvArr[4].push(formatBigNumber(item[itemKey]))
          csvArr[4].push(computedPercent(item['RevenuePercent']))
          break
        }
        case 'Assets': {
          csvArr[5].push(formatBigNumber(item[itemKey], 2))
          csvArr[5].push(computedPercent(item['AssetsPercent']))
          break
        }
        case 'Pools': {
          csvArr[6].push(formatBigNumber(item[itemKey], 1))
          csvArr[6].push(computedPercent(item['PoolsPercent']))
          break
        }
        case 'CapitalGains': {
          csvArr[7].push(formatBigNumber(item[itemKey], 4))
          csvArr[7].push(computedPercent(item['CapitalGainsPercent']))
          break
        }
        case 'ActiveUsers': {
          csvArr[8].push(formatBigNumber(item[itemKey]))
          csvArr[8].push(computedPercent(item['ActiveUsersPercent']))
          break
        }
        case 'Developers': {
          csvArr[9].push(formatBigNumber(item[itemKey], 2))
          csvArr[9].push(computedPercent(item['DevelopersPercent']))
          break
        }
        case 'Commits': {
          csvArr[10].push(formatBigNumber(item[itemKey], 2))
          csvArr[10].push(computedPercent(item['CommitsPercent']))
          break
        }
      }
    }
  })
  var csvContent = 'data:text/csv;charset=utf-8,'
  csvArr.forEach(function (rowArray) {
    let row = rowArray.join(',')
    csvContent += row + '\r\n'
  })
  var encodedUri = encodeURI(csvContent)
  var link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'financial_statement.csv')
  document.body.appendChild(link) // Required for FF

  link.click()
}

let content = ref(null)

function downloadPdf() {
  let doc = new jsPDF('p', 'pt', 'A4')
  doc.html(content.value.innerHTML, {
    callback: function (doc) {
      doc.save()
    },
    x: 10,
    y: 10,
  })
}

const visibleAssets = ref(true)
const visibleProfits = ref(true)
const visibleInitialLiquidity = ref(true)
const visibleFinalLiquidity = ref(true)
const visibleProfitLoss = ref(true)
const visibleLiquidity = ref(true)
const visibleVolume = ref(true)
const visibleRevenue = ref(true)
const visibleGasFee = ref(true)
const visiblePools = ref(true)
// const visibleWithdrawedLiquidity = ref(true)
// const visibleDepositedLiquidity = ref(true)
// const visibleCapitalValue = ref(true)

const visibleActiveUsers = ref(false)
const visibleCodeCommits = ref(false)

const currentTimeline = ref(timelines[1])

function changeTimeline(tl) {
  currentTimeline.value = tl
}

const financeData = computed(() =>
  data.value ? data.value[currentTimeline.value] : [],
)

function sortData() {
  return financeData.value.sort((a, b) => b.start - a.start)
}

const financeDataForPdf = computed(() => {
  if (data.value) {
    let array = sortData()
    let size = 2
    let subarray = []
    for (let i = 0; i < Math.ceil(array.length / size); i++) {
      subarray[i] = array.slice(i * size, i * size + size)
    }
    return subarray
  } else {
    return []
  }
})
const githubInfo = ref(null)

async function InitData(network) {
  return await Promise.all([
    GetHistoricalTokens(network),
  ])
}

async function SetGithubInfo() {
  let link = process.env.VUE_APP_OUTPUT_LINK_ARBITRUM || process.env.VUE_APP_OUTPUT_LINK_POLYGON || process.env.VUE_APP_OUTPUT_LINK_BINANCE
  if (link) {
    let response = await axios.get(
      `${link}/github-info`,
    )
    githubInfo.value = response.data
  }
}

onBeforeMount(async () => {
  const networks = [process.env.VUE_APP_KEY_ARBITRUM ? Network.ARBITRUM : undefined, process.env.VUE_APP_KEY_BINANCE ? Network.BINANCE : undefined, process.env.VUE_APP_KEY_POLYGON ? Network.POLYGON : undefined].filter((n) => n != undefined)

  let networks_data = await Promise.all(networks.map((n) => InitData(n)))
  historicalTokens.value = FormatHistoricalTokens(
    networks.map((n, i) => networks_data[i][0]).flat(),
  )
  SetGithubInfo()
})
</script>
<style lang="scss">
@import '@/styles/_variables.scss';

.pdf {
  display: flex;
  flex-direction: column;
  margin-bottom: 27px;

  &-line {
    display: flex;
    width: 100%;
    position: relative;
    margin-bottom: 12px;

    &_major {
      margin-bottom: 0;
    }
  }

  &-title,
  &-value {
    white-space: nowrap;
    display: flex;
    font-family: Helvetica !important;

    &__current {
      font-family: Helvetica;
    }
  }

  &-title {
    font-size: 12px;
  }

  &-column_major {
    width: 100%;

    .pdf-title {
      font-size: 14px;
    }
  }

  &-column {
    min-width: 33%;

    &:first-child {
      margin-right: 200px;
    }

    &:nth-child(2) {
      margin-right: 175px;
    }
  }

  &-value {

    &__current,
    &__percent {
      font-size: 12px;
    }

    &__current {
      width: 0px;
      margin-right: 60px;
    }

    &__percent {
      font-family: Helvetica;
    }
  }
}

.financial_header {
  padding: 10px 10px 10px 0;
  gap: 40px;
  display: flex;
  width: fit-content;
}

.column_loading {
  min-width: 100% !important;
}

.financial_header_text {
  font-size: clamp(10px, 0.9vw, 16px);
  color: rgba(243, 244, 246, 1);
  font-weight: 500;
  margin-bottom: 20px;
}

.financial_header_subtext {
  font-size: clamp(10px, 0.8vw, 14px);
  color: rgba(178, 178, 178, 1);
  font-weight: 300;
}

.financial_block_without_bg {
  display: flex;
  padding: 20px 10px 20px 0;
  width: fit-content;

  gap: 40px;
  color: rgba(243, 244, 246, 1);
  font-size: clamp(10px, 0.8vw, 14px);


  font-weight: 300;
}

.financial_block_with_bg {
  border-top: 1px solid #2c2c2c;

  border-bottom: 1px solid #2c2c2c;

  background: rgba(44, 44, 44, 0.1);
  width: fit-content;

  display: flex;
  padding: 20px 10px 20px 0;
  gap: 40px;
  color: rgba(243, 244, 246, 1);
  font-size: clamp(10px, 0.8vw, 14px);

  font-weight: 300;
}

.toggle-down {
  transform: rotate(0deg);
  transition: all 0.3s;
}

.toggle-up {
  transform: rotate(180deg);
  transition: all 0.3s;
}

.collapsed_subheader {
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
  align-items: center;
  cursor: pointer;
}

.collapsed_subheader:hover {
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  color: #00c087;
}

.sticky_first_column {
  /* margin-right: 200px; */
  min-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 10px;
}

.sticky_column_with_bg {
  min-width: 300px;
  padding-left: 10px;
}

.sticky_column_without_bg {
  min-width: 300px;
  padding-left: 10px;
}

.finance_table {
  overflow-x: scroll;
  border-radius: 15.289px;
  border: 1px solid #2C2C2C;
  background: linear-gradient(155deg, rgba(0, 0, 0, 0.63) -25.98%, rgba(0, 0, 0, 0.00) 100%);
  backdrop-filter: blur(20.067087173461914px);

  &::-webkit-scrollbar {
    height: 16px;
    border-radius: 50px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 50px;
    margin-left: 10px;
    margin-right: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 192, 135);
    border: 6px solid #02120a;
    border-radius: 50px;
  }
}

.finance_above_settings {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 10px;
}

.finance_above_buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: column;
}

.chart-timeline {
  width: 100%;
}

@media (min-width: $lg) {
  .finance_above_settings {
    flex-direction: row;
  }

  .sticky_first_column {
    /* margin-right: 200px; */
    min-width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: sticky;
    left: 0;
    z-index: 5;
  }

  .sticky_column_with_bg {
    /* margin-right: 200px; */
    min-width: 300px;
    position: sticky;
    left: 0;
    z-index: 5;
  }

  .sticky_column_without_bg {
    /* margin-right: 200px; */
    min-width: 300px;
    position: sticky;
    left: 0;
    z-index: 5;
  }
}

@media (min-width: $sm) {
  .finance_above_buttons {
    flex-direction: row;
  }

  .chart-timeline {
    width: fit-content;
  }
}

@media (max-width: $md) {
  .finance_above_buttons {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    flex-direction: row;
  }

  .chart-timeline {
    width: fit-content;
  }
}
</style>
