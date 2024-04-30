<template>
  <div class="finance_above_settings">
    <div class="chart-timeline">
      <Tabs :tabsOptions="timelines" :selectedTab="currentTimeline" @changeTab="changeTimeline"></Tabs>
    </div>
    <!-- <div class="finance_above_buttons">
      <div>
        <CButton  variant="outline" style="
            border-radius: 20px;
            font-size: clamp(10px, 0.8vw, 14px);
            padding: 4px 8px;
            border-color: #00C9FF;
          ">
          <div class="d-flex align-items-center gap-2 dark:!text-white text-black">
            <img :src="downloadIcon" width="15" /> Download PDF
          </div>
        </CButton>
      </div>
      <div>
        <CButton  variant="outline" style="
            border-radius: 20px;
            font-size: clamp(10px, 0.8vw, 14px);
            padding: 4px 8px;
            border-color: #00C9FF;
          ">
          <div class="d-flex align-items-center gap-2 dark:!text-white text-black">
            <img :src="downloadIcon" width="15" /> Download CSV
          </div>
        </CButton>
      </div>
    </div> -->
  </div>

  <div class="mt-5 finance_table dark:!bg-[#22222224] bg-white" style="position: relative">
    <div class="financial_header dark:!bg-[#1C1C1C] bg-white column_loading">
      <div class="sticky_first_column dark:!bg-[#1c1c1c] bg-white">
        <div class="financial_header_text dark:!text-white text-black">Financial Statement</div>
        <div class="collapsed_subheader financial_header_text dark:!text-white text-black" @click="visibleProfitLoss = !visibleProfitLoss">
          <div>Profit/Loss</div>
          <div>
            <img :src="arrow_up" :class="visibleProfitLoss ? 'toggle-down' : 'toggle-up'" />
          </div>
        </div>
        <CCollapse :visible="visibleProfitLoss">
          <div class="financial_header_text dark:!text-white text-black">
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
        <div class="financial_header_text dark:!text-white text-black">{{ item.date }}</div>
        <div class="financial_header_subtext  dark:!text-white text-black">{{ item.dateDays }}</div>

        <div class="financial_header_subtext  dark:!text-white text-black d-flex gap-1 justify-content-end">
          (
          <div class="flex items-center">
            <CurrencySymbol  />{{ formatBigNumber(item.profitLoss, decimals) }}
          </div>
          <div :class="item.profitLossPercents < 0 ? 'text-danger' : 'text-success'
            ">
            {{ computedPercent(item.profitLossPercents) }}
          </div>
          )
        </div>
        <CCollapse :visible="visibleProfitLoss">
          <div class="financial_header_text dark:!text-white text-black">
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsProfitLossInfo"
                :key="asset.symbol">
                <div class="flex items-center">{{ formatBigNumber(asset.value, decimals) }} {{ asset.symbol }} -
                  <CurrencySymbol  />{{ formatBigNumber(asset.valueUsd, decimals) }}
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
    <div class="financial_block_without_bg  dark:!text-white text-black column_loading">
      <div class="sticky_column_without_bg dark:!bg-[#191919] bg-white">
        <div class="financial_header_text dark:!text-white text-black" style="font-size: clamp(10px, 0.9vw, 16px)">
          Portfolio
        </div>
        <div class="d-flex flex-column gap-4 pt-3">
          <div class="collapsed_subheader dark:!text-white text-black" @click="visibleLiquidity = !visibleLiquidity">
            <div>Liquidity Deposits/Withdraws</div>
            <div>
              <img :src="arrow_up" :class="visibleLiquidity ? 'toggle-down' : 'toggle-up'" />
            </div>
          </div>
          <div v-if="visibleLiquidity" class="collapsed_subheader dark:!text-white text-black">
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
          <div v-if="visibleLiquidity" class="collapsed_subheader dark:!text-white text-black">
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
          <div class="collapsed_subheader dark:!text-white text-black" @click="visibleVolume = !visibleVolume">
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
      <div style="margin-top: 80px; min-width: 300px; text-align: right; gap: 1.2rem" class="d-flex flex-column gap-4"
        v-for="(item, index) in financeData" :key="`Portfolio-key-${index}`">
        <div class="flex gap-2 justify-end items-center">
          <CurrencySymbol  />{{ formatBigNumber(item.LiquidityDeposited, decimals) }}
          <div :class="item.LiquidityDepositedPercent < 0
            ? 'text-danger'
            : 'text-success'
            ">
            {{ computedPercent(item.LiquidityDepositedPercent) }}
          </div>
        </div>
        <div v-if="visibleLiquidity" class="d-flex gap-1 justify-content-end">
          <div class="flex items-center">
            <CurrencySymbol  />{{ formatBigNumber(item.Deposits, decimals) }}
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
                <div class="flex items-center">{{ formatBigNumber(asset.value, decimals) }} {{ asset.symbol }} -
                  <CurrencySymbol  />{{ formatBigNumber(asset.valueUsd, decimals) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
        <div v-if="visibleLiquidity" class="d-flex gap-1 justify-content-end">
          <div class="flex items-center">
            <CurrencySymbol  />{{ formatBigNumber(item.Withdraws, decimals) }}
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
                <div class="flex items-center">{{ formatBigNumber(asset.value, decimals) }} {{ asset.symbol }} -
                  <CurrencySymbol  />{{ formatBigNumber(asset.valueUsd, decimals) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
        <div class="flex gap-2 justify-end items-center">
          <CurrencySymbol  />{{ formatBigNumber(item.TradingVolume) }}
          <div :class="item.TradingVolumePercents < 0 ? 'text-danger' : 'text-success'
            ">
            {{ computedPercent(item.TradingVolumePercents) }}
          </div>
        </div>
        <CCollapse :visible="visibleVolume">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsVolumeInfo" :key="asset.symbol">
                <div class="flex items-center">{{ formatBigNumber(asset.value, decimals) }} {{ asset.symbol }} -
                  <CurrencySymbol  />{{ formatBigNumber(asset.valueUsd, decimals) }}
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
    <div class="financial_block_with_bg dark:!bg-[#1C1C1C] bg-white dark:!text-white text-black column_loading">
      <div class="sticky_column_with_bg dark:!bg-[#1C1C1C] bg-white">
        <div class="financial_header_text dark:!text-white text-black" style="font-size: clamp(10px, 0.9vw, 16px)">
          Income Statement
        </div>
        <div class="d-flex flex-column gap-3 pt-3">
          <div class="collapsed_subheader dark:!text-white text-black" @click="visibleRevenue = !visibleRevenue">
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
          <div class="collapsed_subheader dark:!text-white text-black" @click="visibleGasFee = !visibleGasFee">
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
          <div class="collapsed_subheader dark:!text-white text-black" @click="visibleProfits = !visibleProfits">
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
          <div style="padding-left: 15px" class="dark:!text-white text-black">(Token Incentives)</div>
          <div class="financial_header_text dark:!text-white text-black" style="font-size: clamp(10px, 0.9vw, 16px)">
            Income Statement
          </div>
        </div>
      </div>
      <div style="margin-top: 80px; min-width: 300px; text-align: right; gap: 1.2rem" class="d-flex flex-column gap-3"
        v-for="(item, index) in financeData" :key="`Portfolio-key-${index}`">
        <div class="flex justify-end gap-2 items-center">
          <CurrencySymbol  />{{ formatBigNumber(item.Revenue, 2) }}
          <div :class="item.RevenuePercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.RevenuePercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleRevenue">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsRevenueInfo" :key="asset.symbol">
                <div class="flex items-center">{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} -
                  <CurrencySymbol  />{{ formatBigNumber(asset.valueUsd, 2) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
        <div class="flex justify-end gap-2 items-center">
          <CurrencySymbol  />{{ formatBigNumber(item.Fees, 2) }}
          <div :class="item.FeesPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.FeesPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleGasFee">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsGasFeeInfo" :key="asset.symbol">
                <div class="flex items-center">{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} -
                  <CurrencySymbol  />{{ formatBigNumber(asset.valueUsd, 2) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="flex justify-end gap-2 items-center">
          <CurrencySymbol  />{{ formatBigNumber(item.Profit, 2) }}
          <div :class="item.ProfitPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.ProfitPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleProfits">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsProfitInfo" :key="asset.symbol">
                <div class="flex items-center">{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} -
                  <CurrencySymbol  />{{ formatBigNumber(asset.valueUsd, 2) }}
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

    <div class="financial_block_without_bg  dark:!text-white text-black column_loading">
      <div class="sticky_column_without_bg dark:!bg-[#191919] bg-white">
        <div class="financial_header_text dark:!text-white text-black" style="font-size: clamp(10px, 0.9vw, 16px)">
          Holdings
        </div>
        <div class="d-flex flex-column gap-4 pt-3">
          <div class="collapsed_subheader dark:!text-white text-black" @click="visibleInitialLiquidity = !visibleInitialLiquidity">
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
          <div class="collapsed_subheader dark:!text-white text-black" @click="visibleFinalLiquidity = !visibleFinalLiquidity">
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

          <div class="collapsed_subheader dark:!text-white text-black" @click="visibleAssets = !visibleAssets">
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
      <div style="margin-top: 80px; min-width: 300px; text-align: right; gap: 1.2rem" class="d-flex flex-column gap-4"
        v-for="(item, index) in financeData" :key="`Portfolio-key-${index}`">
        <div class="flex justify-end gap-2 items-center">
          <CurrencySymbol  />{{ formatBigNumber(item.InitialLiquidity, decimals) }}
          <div :class="item.InitialLiquidityPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.InitialLiquidityPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleInitialLiquidity">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsInitialLiquidityInfo"
                :key="asset.symbol">
                <div class="flex items-center">{{ formatBigNumber(asset.value, decimals) }} {{ asset.symbol }} -
                  <CurrencySymbol  />{{ formatBigNumber(asset.valueUsd, decimals) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="flex justify-end gap-2 items-center">
          <CurrencySymbol  />{{ formatBigNumber(item.FinalLiquidity, decimals) }}
          <div :class="item.FinalLiquidityPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.FinalLiquidityPercent) }}
          </div>
        </div>

        <CCollapse :visible="visibleFinalLiquidity">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsFinalLiquidityInfo"
                :key="asset.symbol">
                <div class="flex items-center">{{ formatBigNumber(asset.value, 4) }} {{ asset.symbol }} -
                  <CurrencySymbol  />{{ formatBigNumber(asset.valueUsd, decimals) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="flex justify-end gap-2 items-center">
          <CurrencySymbol  />{{ formatBigNumber(item.Assets, decimals) }}
          <div :class="item.AssetsPercent < 0 ? 'text-danger' : 'text-success'">
            {{ computedPercent(item.AssetsPercent) }}
          </div>
        </div>
        <CCollapse :visible="visibleAssets">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsInfo" :key="asset.symbol">
                <div class="flex items-center">{{ formatBigNumber(asset.balance, decimals) }} {{ asset.symbol }} -
                  <CurrencySymbol  />{{ formatBigNumber(asset.value, decimals) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="flex justify-end gap-2 items-center">
          <CurrencySymbol  />{{ formatBigNumber(item.CapitalGains, decimals) }}
          <div :class="item.CapitalGainsPercent < 0 ? 'text-danger' : 'text-success'
            ">
            {{ computedPercent(item.CapitalGainsPercent) }}
          </div>
        </div>
      </div>
    </div>

    <div class="financial_block_with_bg dark:!bg-[#1C1C1C] bg-white dark:!text-white text-black column_loading">
      <div class="sticky_column_with_bg dark:!bg-[#1C1C1C] bg-white">
        <div class="financial_header_text dark:!text-white text-black" style="font-size: clamp(10px, 0.9vw, 16px)">
          Market Data
        </div>

        <div class="d-flex flex-column gap-4 pt-3">
          <div class="collapsed_subheader dark:!text-white text-black" @click="visiblePrice = !visiblePrice">
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

          <div class="collapsed_subheader dark:!text-white text-black" @click="visibleCirculatingSupply = !visibleCirculatingSupply">
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

          <div class="collapsed_subheader dark:!text-white text-black" @click="visibleMarketCap = !visibleMarketCap">
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

          <div class="collapsed_subheader dark:!text-white text-black" @click="visibleTokenTurnover = !visibleTokenTurnover">
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

      <div style="margin-top: 80px; min-width: 300px; text-align: right; " class="d-flex flex-column gap-4"
        v-for="(item, index) in financeData" :key="`Portfolio-key-${index}`">
        <div class="flex justify-end gap-2 items-center collapsed_margin" style="margin-top: 1.5vw">
          <!-- {{ formatBigNumber(item.Assets, 2) }} -->
          <div :class="item.AssetsPercent < 0 ? 'text-danger' : 'text-success'">
            <!-- {{ computedPercent(item.AssetsPercent) }} -->
          </div>
        </div>
        <CCollapse :visible="visiblePrice">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.AssetsMarketInfo" :key="asset.symbol">
                <div class="flex items-center">
                  <CurrencySymbol  />{{ formatBigNumber(asset.value, decimals) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="flex justify-end gap-2 items-center collapsed_margin" style="margin-top: 1.5vw">
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

        <div class="flex justify-end gap-2 items-center collapsed_margin" style="margin-top: 1.5vw">
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

        <div class="flex justify-end gap-2 items-center collapsed_margin" style="margin-top: 1.5vw">
          <!-- {{ formatBigNumber(item.Pools, 1) }} -->
          <div :class="item.PoolsPercent < 0 ? 'text-danger' : 'text-success'">
            <!-- {{ computedPercent(item.PoolsPercent) }} -->
          </div>
        </div>
        <CCollapse :visible="visibleTokenTurnover">
          <div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex gap-1 justify-content-end" v-for="asset in item.TokenTurnoverInfo" :key="asset.symbol">
                <div class="flex items-center">
                  <CurrencySymbol  />{{ formatBigNumber(asset.value, decimals) }}
                </div>
                <div :class="asset.percent < 0 ? 'text-danger' : 'text-success'">
                  {{ computedPercent(asset.percent) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>

        <div class="flex justify-end gap-2 items-center collapsed_margin" style="margin-top: 1.5vw">
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

        <div class="flex justify-end gap-2 items-center collapsed_margin" style="margin-top: 1.5vw">
          <!-- {{ formatBigNumber(item.Pools, 1) }} -->
          <div :class="item.PoolsPercent < 0 ? 'text-danger' : 'text-success'">
            <!-- {{ computedPercent(item.PoolsPercent) }} -->
          </div>
        </div>
      </div>
    </div>

    <!-- <div style="position: absolute; left: 50%; top: 50%">
      <LoaderPulse v-if="!isDataReady"></LoaderPulse>
    </div> -->
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
import { t } from 'i18next'
const props = defineProps([
  'chainSelected',
  'poolSwapsData',
  'historical_tvl',
  'historicalPrices',
  'poolId',
  'symbol',
  'decimals',
  'all_data'
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

const timelines = [t('weekly'), t('monthly'), t('quarterly'), t('yearly')]

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
{
  if(props.all_data){
    return props.all_data[currentTimeline.value]
  }
  else if(data.value){
    return data.value[currentTimeline.value]
  }

  return []
}
)

async function InitData(network) {
  return await Promise.all([
    GetActiveUsers(network, poolId.value),
    GetHistoricalTokens(network, poolId.value),
  ])
}

onBeforeMount(async () => {
  // let networks = [ReversedDisplayNetwork[chainSelected.value.name]]
  // let networks_data = await Promise.all(networks.map((n) => InitData(n)))

  // joinExits.value = networks
  //   .map((n, i) =>
  //     networks_data[i][0].joinExtis.map((join) => ({
  //       ...join,
  //       chain: DisplayNetwork[n],
  //     })),
  //   )
  //   .flat()
  // activeUsers.value = networks
  //   .map((n, i) =>
  //     networks_data[i][0].activeUsers.map((user_info) => ({
  //       ...user_info,
  //       chain: DisplayNetwork[n],
  //     })),
  //   )
  //   .flat()
  // historicalTokens.value = FormatHistoricalTokens(
  //   networks.map((n, i) => networks_data[i][1]).flat(),
  // )
  // marketCaps.value = await useTokenPricesChange(Array.from(new Set(historicalTokens.value.map(item => item.symbol))))
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
  // background: #1C1C1C;
}

.column_loading {
  min-width: 100% !important;
}

.financial_header_text {
  font-size: clamp(10px, 0.9vw, 16px);
  // color: rgba(243, 244, 246, 1);
  font-weight: 500;
  margin-bottom: 20px;
}

.financial_header_subtext {
  font-size: clamp(10px, 0.8vw, 14px);
  // color: rgba(178, 178, 178, 1);
  font-weight: 300;
}

.financial_block_without_bg {
  display: flex;
  width: fit-content;

  gap: 40px;
  // color: rgba(243, 244, 246, 1);
  font-size: clamp(10px, 0.8vw, 14px);

  font-weight: 300;
}

.financial_block_with_bg {
  border-top: 1px solid #2c2c2c;

  border-bottom: 1px solid #2c2c2c;

  // background: #1C1C1C;
  width: fit-content;

  display: flex;
  gap: 40px;
  // color: rgba(243, 244, 246, 1);
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
  color: #00C9FF;
}

.sticky_first_column {
  min-width: 300px;
  padding-top: 10px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // background-color:#22222224;

  padding-left: 10px;
}

.sticky_column_with_bg {
  min-width: 300px;
  padding: 20px 10px 20px 10px;
  // background: #22222224;
}

.sticky_column_without_bg {
  /* margin-right: 200px; */
  min-width: 300px;
  padding: 20px 10px 20px 10px;

}

.finance_table {
  border-radius: 20px;
  overflow-x: scroll;
  // background: #22222224;
  border: 1px solid #FFFFFF0D;
  box-shadow: 0px 4px 4px 0px #00000040;

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
    background-color: rgb(0, 131, 192);
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
