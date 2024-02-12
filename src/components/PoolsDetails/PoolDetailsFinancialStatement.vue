<template>
  <div class="finance_above_settings">
    <div class="chart-timeline">
      <Tabs :tabsOptions="timelines" :selectedTab="currentTimeline" @changeTab="changeTimeline"></Tabs>
    </div>
    <div class="finance_above_buttons">
      <div>
        <CButton color="success" variant="outline" style="
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
          ">
          <div class="d-flex align-items-center gap-2 text-white">
            <img :src="downloadIcon" width="15" /> Download CSV
          </div>
        </CButton>
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
          <div>
            <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(item.profitLoss, decimals) }}
          </div>
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
                <div>{{ formatBigNumber(asset.value, decimals) }} {{ asset.symbol }} -
                  <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(asset.valueUsd, decimals) }}
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
          <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(item.LiquidityDeposited, decimals) }}
          <div :class="item.LiquidityDepositedPercent < 0
            ? 'text-danger'
            : 'text-success'
            ">
            {{ computedPercent(item.LiquidityDepositedPercent) }}
          </div>
        </div>
        <div v-if="visibleLiquidity" class="d-flex gap-1 justify-content-end">
          <div>
            <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(item.Deposits, decimals) }}
          </div>
          <div :class="item.DepositsPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.DepositsPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleLiquidity">
          <div>
            <div class="d-flex flex-column gap-2">
              <div></div>
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsDepositInfo" :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, decimals) }} {{ asset.symbol }} -
                  <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(asset.valueUsd, decimals) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
        <div v-if="visibleLiquidity" class="d-flex gap-1 justify-content-end">
          <div>
            <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(item.Withdraws, decimals) }}
          </div>
          <div :class="item.WithdrawsPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.WithdrawsPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleLiquidity">
          <div></div>
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsWithdrawInfo" :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, decimals) }} {{ asset.symbol }} -
                  <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(asset.valueUsd, decimals) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
        <div class="d-flex gap-2 justify-content-end">
          <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(item.TradingVolume) }}
          <div :class="item.TradingVolumePercents < 0 ? 'text-danger' : 'text-success'
            ">
            {{ computedPercent(item.TradingVolumePercents) }}
          </div>
        </div>
        <CCollapse :visible="visibleVolume">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsVolumeInfo" :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, decimals) }} {{ asset.symbol }} -
                  <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(asset.valueUsd, decimals) }}
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
          <div class="financial_header_text" style="font-size: clamp(10px, 0.9vw, 16px)">
            Income Statement
          </div>
        </div>
      </div>
      <div style="margin-top: 56px; min-width: 300px; text-align: right" class="d-flex flex-column gap-3"
        v-for="(item, index) in financeData" :key="`Portfolio-key-${index}`">
        <div class="d-flex justify-content-end gap-2">
          <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(item.Revenue, 2) }}
          <div :class="item.RevenuePercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.RevenuePercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleRevenue">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsRevenueInfo" :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} -
                  <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(asset.valueUsd, 2) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
        <div class="d-flex justify-content-end gap-2">
          <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(item.Fees, 2) }}
          <div :class="item.FeesPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.FeesPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleGasFee">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsGasFeeInfo" :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} -
                  <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(asset.valueUsd, 2) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="d-flex justify-content-end gap-2">
          <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(item.Profit, 2) }}
          <div :class="item.ProfitPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.ProfitPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleProfits">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsProfitInfo" :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} -
                  <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(asset.valueUsd, 2) }}
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

          <div>Capital Gains</div>
        </div>
      </div>
      <div style="margin-top: 56px; min-width: 300px; text-align: right" class="d-flex flex-column gap-4"
        v-for="(item, index) in financeData" :key="`Portfolio-key-${index}`">
        <div class="d-flex justify-content-end gap-2">
          <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(item.InitialLiquidity, decimals) }}
          <div :class="item.InitialLiquidityPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.InitialLiquidityPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleInitialLiquidity">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsInitialLiquidityInfo"
                :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, decimals) }} {{ asset.symbol }} -
                  <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(asset.valueUsd, decimals) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="d-flex justify-content-end gap-2">
          <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(item.FinalLiquidity, decimals) }}
          <div :class="item.FinalLiquidityPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.FinalLiquidityPercent) }}
          </div>
        </div>

        <CCollapse :visible="visibleFinalLiquidity">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsFinalLiquidityInfo"
                :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} -
                  <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(asset.valueUsd, decimals) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="d-flex justify-content-end gap-2">
          <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(item.Assets, decimals) }}
          <div :class="item.AssetsPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.AssetsPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleAssets">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsInfo" :key="asset.symbol">
                <div>{{ formatBigNumber(asset.balance, decimals) }} {{ asset.symbol }} -
                  <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(asset.value, decimals) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="d-flex justify-content-end gap-2">
          <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(item.CapitalGains, decimals) }}
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
          Market Data
        </div>

        <div class="d-flex flex-column gap-4 pt-3">
          <div class="collapsed_subheader" @click="visiblePrice = !visiblePrice">
            <div>Price</div>
            <div>
              <img :src="arrow_up" :class="visiblePrice ? 'toggle-down' : 'toggle-up'" />
            </div>
          </div>
          <CCollapse :visible="visiblePrice">
            <div>
              <div class="d-flex flex-column gap-2" v-if="financeData.length > 0">
                <div v-for="asset in financeData[0].AssetsMarketInfo" :key="asset.symbol">
                  {{ asset.symbol }}
                </div>
              </div>
            </div>
          </CCollapse>

          <div class="collapsed_subheader" @click="visibleCirculatingSupply = !visibleCirculatingSupply">
            <div>Circulating Supply</div>
            <div>
              <img :src="arrow_up" :class="visibleCirculatingSupply ? 'toggle-down' : 'toggle-up'" />
            </div>
          </div>
          <CCollapse :visible="visibleCirculatingSupply">
            <div>
              <div class="d-flex flex-column gap-2" v-if="financeData.length > 0">
                <div v-for="asset in financeData[0].CirculatingSupplyInfo" :key="asset.symbol">
                  {{ asset.symbol }}
                </div>
              </div>
            </div>
          </CCollapse>

          <div class="collapsed_subheader" @click="visibleMarketCap = !visibleMarketCap">
            <div>Market Cap</div>
            <div>
              <img :src="arrow_up" :class="visibleMarketCap ? 'toggle-down' : 'toggle-up'" />
            </div>
          </div>
          <CCollapse :visible="visibleMarketCap">
            <div>
              <div class="d-flex flex-column gap-2" v-if="financeData.length > 0">
                <div v-for="asset in financeData[0].MarketCapInfo" :key="asset.symbol">
                  {{ asset.symbol }}
                </div>
              </div>
            </div>
          </CCollapse>

          <div class="collapsed_subheader" @click="visibleTokenTurnover = !visibleTokenTurnover">
            <div>Token Turnover</div>
            <div>
              <img :src="arrow_up" :class="visibleTokenTurnover ? 'toggle-down' : 'toggle-up'" />
            </div>
          </div>
          <CCollapse :visible="visibleTokenTurnover">
            <div>
              <div class="d-flex flex-column gap-2" v-if="financeData.length > 0">
                <div v-for="asset in financeData[0].TokenTurnoverInfo" :key="asset.symbol">
                  {{ asset.symbol }}
                </div>
              </div>
            </div>
          </CCollapse>

          <!-- <div
            class="collapsed_subheader"
            @click="visibleTokenHolders = !visibleTokenHolders"
          >
            <div>Token Holders</div>
            <div>
              <img
                :src="arrow_up"
                :class="visibleTokenHolders ? 'toggle-down' : 'toggle-up'"
              />
            </div>
          </div>
          <CCollapse :visible="visibleTokenHolders">
            <div>
              <div
                class="d-flex flex-column gap-2"
                v-if="financeData.length > 0"
              >
                <div v-for="pool in financeData[0].PoolsInfo" :key="pool.name">
                  {{ pool.name }}
                </div>
              </div>
            </div>
          </CCollapse> -->


        </div>
      </div>

      <div style="margin-top: 56px; min-width: 300px; text-align: right" class="d-flex flex-column gap-4"
        v-for="(item, index) in financeData" :key="`Portfolio-key-${index}`">
        <div class="d-flex justify-content-end gap-2 collapsed_margin" style="margin-top: 1.5vw">
          <!-- {{ formatBigNumber(item.Assets, 2) }} -->
          <div :class="item.AssetsPercent < 0 ? 'text-danger' : 'text-success'">
            <!-- {{ computedPercent(item.AssetsPercent) }} -->
          </div>
        </div>
        <CCollapse :visible="visiblePrice">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsMarketInfo" :key="asset.symbol">
                <div>
                  <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(asset.value, decimals) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="d-flex justify-content-end gap-2 collapsed_margin" style="margin-top: 1.5vw">
          <!-- {{ formatBigNumber(item.Pools, 1) }} -->
          <div :class="item.PoolsPercent < 0 ? 'text-danger' : 'text-success'">
            <!-- {{ computedPercent(item.PoolsPercent) }} -->
          </div>
        </div>
        <CCollapse :visible="visibleCirculatingSupply">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.CirculatingSupplyInfo"
                :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, decimals) }} {{ asset.symbol }}</div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="d-flex justify-content-end gap-2 collapsed_margin" style="margin-top: 1.5vw">
          <!-- {{ formatBigNumber(item.Pools, 1) }} -->
          <div :class="item.PoolsPercent < 0 ? 'text-danger' : 'text-success'">
            <!-- {{ computedPercent(item.PoolsPercent) }} -->
          </div>
        </div>
        <CCollapse :visible="visibleMarketCap">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.MarketCapInfo" :key="asset.symbol">
                <div>{{ formatBigNumber(asset.value, decimals) }}</div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="d-flex justify-content-end gap-2 collapsed_margin" style="margin-top: 1.5vw">
          <!-- {{ formatBigNumber(item.Pools, 1) }} -->
          <div :class="item.PoolsPercent < 0 ? 'text-danger' : 'text-success'">
            <!-- {{ computedPercent(item.PoolsPercent) }} -->
          </div>
        </div>
        <CCollapse :visible="visibleTokenTurnover">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.TokenTurnoverInfo" :key="asset.symbol">
                <div>
                  <CurrencySymbol :symbol="symbol" />{{ formatBigNumber(asset.value, decimals) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="d-flex justify-content-end gap-2 collapsed_margin" style="margin-top: 1.5vw">
          <!-- {{ formatBigNumber(item.Pools, 1) }} -->
          <div :class="item.PoolsPercent < 0 ? 'text-danger' : 'text-success'">
            <!-- {{ computedPercent(item.PoolsPercent) }} -->
          </div>
        </div>
        <!-- <CCollapse :visible="visibleTokenHolders">
          <div>
            <div class="d-flex flex-column gap-2">
              <div
                class="d-flex gap-1 justify-content-end"
                v-for="pool in item.PoolsInfo"
                :key="pool.name"
              >
                <div>{{ formatBigNumber(pool.value, 4) }}</div>
                <div :class="pool.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(pool.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse> -->

        <div class="d-flex justify-content-end gap-2 collapsed_margin" style="margin-top: 1.5vw">
          <!-- {{ formatBigNumber(item.Pools, 1) }} -->
          <div :class="item.PoolsPercent < 0 ? 'text-danger' : 'text-success'">
            <!-- {{ computedPercent(item.PoolsPercent) }} -->
          </div>
        </div>
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
import { GetActiveUsers } from '@/composables/users/useActiveUsers'
import { DisplayNetwork, ReversedDisplayNetwork } from '@/composables/useNetwork'
import { useTokenPricesChange } from '@/composables/useTokenPriceChange'
import { GetHistoricalTokens } from '@/composables/balances/useHistoricalTokens'
import CurrencySymbol from "@/components/TrackInfo/CurrencySymbol.vue"
const props = defineProps([
  'chainSelected',
  'poolSwapsData',
  'historical_tvl',
  'historicalPrices',
  'poolId',
  'symbol',
  'decimals'
])

const {
  chainSelected,
  poolSwapsData,
  historical_tvl,
  historicalPrices,
  poolId,
} = toRefs(props)
const activeUsers = ref(null)
const joinExits = ref(null)
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
      {},
      historicalPrices.value,
      joinExits.value,
      chainSelected.value.name,
      marketCaps.value
    )
    : null,
)

const timelines = ['Weekly', 'Monthly', 'Quarterly', 'Yearly']

function computedPercent(number) {
  let formatted_number = formatBigNumber(number, 3)
  return (number < 0 ? '' : '+') + formatted_number + '%'
}


const marketCaps = ref(null)
const visibleInitialLiquidity = ref(true)
const visibleFinalLiquidity = ref(true)
const visibleProfitLoss = ref(true)
const visibleAssets = ref(true)
const visibleProfits = ref(true)
const visibleVolume = ref(true)
const visibleRevenue = ref(true)
const visibleGasFee = ref(true)
const visiblePrice = ref(true)
const visibleCirculatingSupply = ref(true)
const visibleMarketCap = ref(true)
const visibleTokenTurnover = ref(true)
const visibleLiquidity = ref(true)
const currentTimeline = ref(timelines[1])

function changeTimeline(tl) {
  currentTimeline.value = tl
}

const financeData = computed(() =>
  data.value ? data.value[currentTimeline.value] : [],
)

async function InitData(network) {
  return await Promise.all([
    GetActiveUsers(network, poolId.value),
    GetHistoricalTokens(network, poolId.value),
  ])
}

onBeforeMount(async () => {
  let networks = [ReversedDisplayNetwork[chainSelected.value.name]]
  let networks_data = await Promise.all(networks.map((n) => InitData(n)))

  joinExits.value = networks
    .map((n, i) =>
      networks_data[i][0].joinExtis.map((join) => ({
        ...join,
        chain: DisplayNetwork[n],
      })),
    )
    .flat()
  activeUsers.value = networks
    .map((n, i) =>
      networks_data[i][0].activeUsers.map((user_info) => ({
        ...user_info,
        chain: DisplayNetwork[n],
      })),
    )
    .flat()
  historicalTokens.value = FormatHistoricalTokens(
    networks.map((n, i) => networks_data[i][1]).flat(),
  )
  marketCaps.value = await useTokenPricesChange(Array.from(new Set(historicalTokens.value.map(item => item.symbol))))
})
</script>
<style lang="scss">
@import '@/styles/_variables.scss';

.financial_header {
  border-radius: 10px 10px 0px 0px;
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
  min-width: 300px;
  padding-top: 10px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgba(15, 19, 32, 0.9);
  backdrop-filter: blur(200px);

  padding-left: 10px;
}

.sticky_column_with_bg {
  min-width: 300px;
  padding: 20px 10px 20px 10px;
  background-color: rgba(15, 19, 32, 0.9);
  backdrop-filter: blur(200px);
}

.sticky_column_without_bg {
  /* margin-right: 200px; */
  min-width: 300px;
  padding: 20px 10px 20px 10px;
  background-color: rgba(15, 19, 32, 0.9);
  backdrop-filter: blur(200px);
}

.finance_table {
  border-radius: 20px;
  border: 0.5px solid rgba(163, 164, 165, 0.4);
  overflow-x: scroll;
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

.collapsed_margin {
  margin-top: 1.5vw !important;
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

@media (max-width: $xxl) {
  .collapsed_margin {
    margin-top: 1.6vw !important;
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
