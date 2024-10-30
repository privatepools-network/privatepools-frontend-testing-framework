import {
  CalculateTokenOrderPrice,
  calculatePercentageChange,
} from '@/composables/math/chartMath/trackingInfoMath'
import { replaceFirstCharIfW } from '@/composables/poolActions/compose/usePossibleComposeTokens'
import {
  isRightChain,
  isRightChainName,
} from '@/composables/pools/usePoolSwapsStats'
import { Network, ReversedDisplayNetwork } from '@/composables/useNetwork'
import { configService } from '@/services/config/config.service'
import {
  CalculateJoinExitPrice,
  GetMonthlyTextData,
  GetQuarterlyTextData,
  GetWeeklyTextData,
  GetYearlyTextData,
  InitAssetsInfo,
  NATIVE_ASSET,
  InitAssetsTemplate,
  InitPoolsInfo,
  RemoveZeroValueAssetPools,
  RemoveZeroValueAssets,
  RemoveZeroValuePools,
  getActiveUsersForPeriod,
  getPriceForTimestamp,
  getTokensPricesForTimestamp,
  getTvlBalancesForTimestamp,
  getTvlForTimestamp,
} from './financialStatementUtils'
import wl from '@/assets/wl/tokenslist.json'
const TIMELINES = {
  Weekly: { getTextData: GetWeeklyTextData },
  Monthly: { getTextData: GetMonthlyTextData },
  Quarterly: { getTextData: GetQuarterlyTextData },
  Yearly: { getTextData: GetYearlyTextData },
}

export const FINANCIAL_ITEM_TEMPLATE = {
  date: '',
  dateDays: '',
  end: 0,
  start: 0,
  profitLoss: 0,
  profitLoss_ETH: 0,
  profitLoss_BTC: 0,
  profitLossPercents: 0,
  LiquidityDeposited: 0,
  LiquidityDeposited_ETH: 0,
  LiquidityDeposited_BTC: 0,
  LiquidityDepositedPercent: 0,
  Deposits: 0,
  Deposits_ETH: 0,
  Deposits_BTC: 0,
  DepositsPercent: 0,
  WithdrawsPercent: 0,
  Withdraws: 0,
  Withdraws_ETH: 0,
  Withdraws_BTC: 0,
  TradingVolume: 0,
  TradingVolume_ETH: 0,
  TradingVolume_BTC: 0,
  TradingVolumePercents: 0,
  Trades: 0,
  Fees: 0,
  Fees_ETH: 0,
  Fees_BTC: 0,
  FeesPercent: 0,
  Revenue: 0,
  Revenue_ETH: 0,
  Revenue_BTC: 0,
  RevenuePercent: 0,
  Profit: 0,
  Profit_ETH: 0,
  Profit_BTC: 0,
  ProfitPercent: 0,
  TokenIncentives: null,
  Earnings: 0,
  Assets: '0',
  AssetsInfo: [],
  AssetsMarketInfo: [],
  AssetsProfitInfo: [],
  AssetsRevenueInfo: [],
  AssetsVolumeInfo: [],
  AssetsGasFeeInfo: [],
  AssetsDepositInfo: [],
  AssetsWithdrawInfo: [],
  AssetsCapitalGainsInfo: [],
  AssetsProfitLossInfo: [],
  AssetsInitialLiquidityInfo: [],
  AssetsFinalLiquidityInfo: [],
  Pools: 0,
  PoolsPercent: 0,
  PoolsInfo: [],
  CapitalGains: 0,
  CapitalGainsETH: 0,
  CapitalGainsBTC: 0,
  CapitalGainsPercent: 0,
  ProfitLossHoldings: '0',
  NonPoolHoldings: '0',
  AssetsPercent: 0,
  CirculatingSupplyInfo: [],
  MarketCapInfo: [],
  PFRatio: '0',
  PSRatio: '0',
  ActiveUsersPercent: 0,
  ActiveUsers: 0,
  Developers: 0,
  DevelopersPercent: 0,
  Commits: 0,
  CommitsPercent: 0,
  SharpeRatio: '0',
  SortinoRatio: '0',
  InitialLiquidity: 0,
  InitialLiquidityETH: 0,
  InitialLiquidityBTC: 0,
  InitialLiquidityPercent: 0,
  FinalLiquidity: 0,
  FinalLiquidityETH: 0,
  FinalLiquidityBTC: 0,
  FinalLiquidityPercent: 0,
  TokenTurnoverInfo: [],
}

function InitTemplate(textData) {
  let template_clone = { ...FINANCIAL_ITEM_TEMPLATE }
  template_clone.date = textData.title
  template_clone.dateDays = textData.range
  template_clone.end = textData.end
  template_clone.start = textData.start
  return template_clone
}

export function FormatFinancialStatement(
  poolSwapsData,
  historical_tvl,
  active_users,
  historicalTokens,
  historicalPrices,
  joinExits,
  chainSelected,
  githubInfo,
  marketCaps,
) {
  let result = {
    Weekly: [],
    Monthly: [],
    Quarterly: [],
    Yearly: [],
  }
  try {
    let filtered = poolSwapsData
      .sort((a, b) => parseFloat(a.timestamp) - parseFloat(b.timestamp))
    let filteredJoinExits = joinExits
    let filtered_historical_tvl = historical_tvl
      .filter((item) => isRightChainName(item.Blockchain, chainSelected))
      .sort((a, b) => a.timestamp - b.timestamp)
    let filtered_historical_tokens = historicalTokens
    let filtered_active_users = active_users
    let token_symbols = Array.from(
      new Set(filtered_historical_tokens.map((t) => t.symbol)),
    ).sort()
    let pools = Array.from(
      new Set(filtered_historical_tvl.map((t) => t.pool.id)),
    )
    let timeline_keys = Object.keys(TIMELINES)
    for (let j = 0; j < filtered_historical_tvl.length; j++) {
      let item_ts = filtered_historical_tvl[j].timestamp

      for (let k = 0; k < timeline_keys.length; k++) {
        let timeline = timeline_keys[k]
        if (
          result[timeline].length == 0 ||
          result[timeline][result[timeline].length - 1].end < item_ts
        ) {
          let template = InitTemplate(
            TIMELINES[timeline].getTextData(item_ts * 1000),
          )
          InitAssetsInfo(
            template,
            token_symbols,
            historicalPrices,
            filtered_historical_tokens,
            poolSwapsData,
          )
          InitAssetsMarketInfo(template, token_symbols, historicalPrices)
          let previous_element =
            result[timeline].length > 0
              ? result[timeline][result[timeline].length - 1]
              : undefined
          if (marketCaps && marketCaps.length > 0) {
            addMarketCapsInfo(
              template,
              token_symbols,
              marketCaps,
              previous_element,
            )
          }

          addTokensTurnover(
            template,
            token_symbols,
            filtered_historical_tokens,
            filtered,
            previous_element,
          )
          InitPoolsInfo(
            template,
            pools,
            filtered_historical_tvl,
            historicalPrices,
          )
          addLiquidityDeposited(template, filteredJoinExits, historicalPrices)
          addCapitalGains(
            template,
            filtered_historical_tvl,
            historicalPrices,
            previous_element,
          )
          addActiveUsers(template, filtered_active_users)
          if (githubInfo) addGithubInfo(template, githubInfo)
          template.profitLoss = template.CapitalGains
          template.profitLoss_ETH = template.CapitalGainsETH
          template.profitLoss_BTC = template.CapitalGainsBTC
          template.AssetsProfitLossInfo = [
            ...template.AssetsCapitalGainsInfo.map((item) => ({ ...item })),
          ]
          result[timeline].push(template)
          let timeline_data = result[timeline][result[timeline].length - 1]
          let filtered_token_swaps = filtered.filter(
            (item) =>
              parseFloat(item.timestamp) >= timeline_data.start &&
              parseFloat(item.timestamp) <= timeline_data.end,
          )
          for (let i = 0; i < filtered_token_swaps.length; i++) {
            let item = filtered_token_swaps[i]

            addArbitrageBotInfo(timeline_data, item, filtered_historical_tokens)
            if (result[timeline].length > 1) {
              let previous_element =
                result[timeline][result[timeline].length - 2]
              addPercentagesInfo(timeline_data, previous_element)
            }
          }
        }
      }
    }
   // RemoveZeroValueAssets(result, filtered)
   // RemoveZeroValuePools(result)
   // RemoveZeroValueAssetPools(result)
  } catch (e) {
    console.error('[FIN STATEMENT ERR]', e)
  }
  console.log("FIN STATEMENT RESULT ", result)
  return result
}

/**
 * Add arbitrage trade to the stats.
 */
function addArbitrageBotInfo(timeline_data, item, historical_tokens) {
  timeline_data.Trades += 1
  timeline_data.Fees += parseFloat(item.gasFeeUsd.toString())
  timeline_data.Revenue += parseFloat(item.revenueUsd.toString())
  timeline_data.Profit += parseFloat(item.profitUsd.toString())
  timeline_data.profitLoss += parseFloat(item.revenueUsd.toString())
  timeline_data.TradingVolume += parseFloat(item.volumeUsd.toString())

  timeline_data.Fees_ETH += parseFloat(item.gasFeeETH.toString())
  timeline_data.Revenue_ETH += parseFloat(item.revenueETH.toString())
  timeline_data.Profit_ETH += parseFloat(item.profitETH.toString())
  timeline_data.profitLoss_ETH += parseFloat(item.revenueETH.toString())
  timeline_data.TradingVolume_ETH += parseFloat(item.volumeETH.toString())

  timeline_data.Fees_BTC += parseFloat(item.gasFeeBTC.toString())
  timeline_data.Revenue_BTC += parseFloat(item.revenueBTC.toString())
  timeline_data.Profit_BTC += parseFloat(item.profitBTC.toString())
  timeline_data.profitLoss_BTC += parseFloat(item.revenueBTC.toString())
  timeline_data.TradingVolume_BTC += parseFloat(item.volumeBTC.toString())
  let found_token = timeline_data.AssetsProfitInfo.find(
    (_item) => _item.address.toLowerCase() == item.token.toLowerCase(),
  )
  if (!found_token) {
    return
  }
  timeline_data.AssetsProfitInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).valueUsd += item.profitUsd
  timeline_data.AssetsProfitInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).valueETH += item.profitETH
  timeline_data.AssetsProfitInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).valueBTC += item.profitBTC

  timeline_data.AssetsProfitInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).value += item.profit

  timeline_data.AssetsVolumeInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).valueUsd += item.volumeUsd
  timeline_data.AssetsVolumeInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).valueETH += item.volumeETH
  timeline_data.AssetsVolumeInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).valueBTC += item.volumeBTC

  timeline_data.AssetsVolumeInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).value += item.volume

  timeline_data.AssetsRevenueInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).valueUsd += item.revenueUsd
  timeline_data.AssetsRevenueInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).valueETH += item.revenueETH
  timeline_data.AssetsRevenueInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).valueBTC += item.revenueBTC

  timeline_data.AssetsRevenueInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).value += item.revenue

  let nativeTokenSymbol = NATIVE_ASSET.symbol
  timeline_data.AssetsGasFeeInfo.find(
    (token) => token.symbol == nativeTokenSymbol,
  ).value += item.gasFee

  timeline_data.AssetsGasFeeInfo.find(
    (token) => token.symbol == nativeTokenSymbol,
  ).valueUsd += item.gasFeeUsd
  timeline_data.AssetsGasFeeInfo.find(
    (token) => token.symbol == nativeTokenSymbol,
  ).valueETH += item.gasFeeETH
  timeline_data.AssetsGasFeeInfo.find(
    (token) => token.symbol == nativeTokenSymbol,
  ).valueBTC += item.gasFeeBTC

  const profitLossFound = timeline_data.AssetsProfitLossInfo.find(
    (token) => token.symbol == found_token.symbol,
  )
  if (profitLossFound) {
    timeline_data.AssetsProfitLossInfo.find(
      (token) => token.symbol == found_token.symbol,
    ).valueUsd += item.revenueUsd
    timeline_data.AssetsProfitLossInfo.find(
      (token) => token.symbol == found_token.symbol,
    ).valueETH += item.revenueETH
    timeline_data.AssetsProfitLossInfo.find(
      (token) => token.symbol == found_token.symbol,
    ).valueBTC += item.revenueBTC

    timeline_data.AssetsProfitLossInfo.find(
      (token) => token.symbol == found_token.symbol,
    ).value += item.revenue
  }
}

/**
 * Add github development stats.
 */
function addGithubInfo(timeline_data, githubInfo) {
  if (githubInfo && githubInfo.length > 0) {
    let filtered = githubInfo.filter(
      (item) =>
        item.timestamp >= timeline_data.start &&
        item.timestamp <= timeline_data.end,
    )
    timeline_data.Developers = new Set(filtered.map((f) => f.name)).size
    timeline_data.Commits = filtered.length
  }
}

function addPercentagesInfo(timeline_data, previous_element) {
  timeline_data.profitLossPercents = calculatePercentageChange(
    previous_element.profitLoss,
    timeline_data.profitLoss,
  )
  timeline_data.FeesPercent = calculatePercentageChange(
    previous_element.Fees,
    timeline_data.Fees,
  )
  timeline_data.RevenuePercent = calculatePercentageChange(
    previous_element.Revenue,
    timeline_data.Revenue,
  )
  timeline_data.ProfitPercent = calculatePercentageChange(
    previous_element.Profit,
    timeline_data.Profit,
  )
  timeline_data.TradingVolumePercents = calculatePercentageChange(
    previous_element.TradingVolume,
    timeline_data.TradingVolume,
  )
  timeline_data.ActiveUsersPercent = calculatePercentageChange(
    previous_element.ActiveUsers,
    timeline_data.ActiveUsers,
  )
  timeline_data.CommitsPercent = calculatePercentageChange(
    previous_element.Commits,
    timeline_data.Commits,
  )
  timeline_data.DevelopersPercent = calculatePercentageChange(
    previous_element.Developers,
    timeline_data.Developers,
  )
  timeline_data.CapitalGainsPercent = calculatePercentageChange(
    previous_element.CapitalGains,
    timeline_data.CapitalGains,
  )
  timeline_data.DepositsPercent = calculatePercentageChange(
    previous_element.Deposits,
    timeline_data.Deposits,
  )
  timeline_data.WithdrawsPercent = calculatePercentageChange(
    previous_element.Withdraws,
    timeline_data.Withdraws,
  )
  timeline_data.LiquidityDepositedPercent = calculatePercentageChange(
    previous_element.LiquidityDeposited,
    timeline_data.LiquidityDeposited,
  )
  for (let i = 0; i < timeline_data.AssetsProfitInfo.length; i++) {
    timeline_data.AssetsProfitInfo[i].percent = calculatePercentageChange(
      previous_element.AssetsProfitInfo[i].value,
      timeline_data.AssetsProfitInfo[i].value,
    )
    timeline_data.AssetsRevenueInfo[i].percent = calculatePercentageChange(
      previous_element.AssetsRevenueInfo[i].value,
      timeline_data.AssetsRevenueInfo[i].value,
    )
    timeline_data.AssetsVolumeInfo[i].percent = calculatePercentageChange(
      previous_element.AssetsVolumeInfo[i].value,
      timeline_data.AssetsVolumeInfo[i].value,
    )
  }
  for (let i = 0; i < timeline_data.AssetsDepositInfo.length; i++) {
    timeline_data.AssetsDepositInfo[i].percent = calculatePercentageChange(
      previous_element.AssetsDepositInfo[i].value,
      timeline_data.AssetsDepositInfo[i].value,
    )
    timeline_data.AssetsWithdrawInfo[i].percent = calculatePercentageChange(
      previous_element.AssetsWithdrawInfo[i].value,
      timeline_data.AssetsWithdrawInfo[i].value,
    )
  }
  for (let i = 0; i < timeline_data.AssetsGasFeeInfo.length; i++) {
    timeline_data.AssetsGasFeeInfo[i].percent = calculatePercentageChange(
      previous_element.AssetsGasFeeInfo[i].value,
      timeline_data.AssetsGasFeeInfo[i].value,
    )
  }
  for (let i = 0; i < timeline_data.AssetsProfitLossInfo.length; i++) {
    timeline_data.AssetsProfitLossInfo[i].percent = calculatePercentageChange(
      previous_element.AssetsProfitLossInfo[i].value,
      timeline_data.AssetsProfitLossInfo[i].value,
    )
  }
}

function InitAssetsMarketInfo(template, token_symbols, historicalPrices) {
  template.AssetsMarketInfo = getAssetsMarketInfo(
    token_symbols,
    historicalPrices,
    template.start,
    template.end,
  )
}

function getAssetsMarketInfo(symbols, historicalPrices, start, end) {
  let assets_info = InitAssetsTemplate(symbols)
  let start_prices = getTokensPricesForTimestamp(
    symbols,
    historicalPrices,
    start,
  )
  let end_prices = getTokensPricesForTimestamp(symbols, historicalPrices, end)
  let priceETH = 1 / getPriceForTimestamp('ETH', historicalPrices, end)
  let priceBTC = 1 / getPriceForTimestamp('BTC', historicalPrices, end)
  for (let i = 0; i < assets_info.length; i++) {
    let asset = assets_info[i]
    asset.value = end_prices[asset.symbol]
    asset.valueETH = end_prices[asset.symbol] * priceETH
    asset.valueBTC = end_prices[asset.symbol] * priceBTC
    asset.previousValue = start_prices[asset.symbol]
    asset.percent = calculatePercentageChange(
      start_prices[asset.symbol],
      end_prices[asset.symbol],
    )
  }
  return assets_info
}

function addMarketCapsInfo(
  timeline_data,
  token_symbols,
  marketCaps,
  previous_element,
) {
  let market_caps_info = InitAssetsTemplate(token_symbols)
  let circulating_supply_info = InitAssetsTemplate(token_symbols)
  for (let i = 0; i < market_caps_info.length; i++) {
    let symbol = market_caps_info[i].symbol
    let marketToken = timeline_data.AssetsMarketInfo.find(
      (t) => t.symbol == symbol,
    )
    if (marketToken) {
      let rawInfo = marketCaps.RAW[replaceFirstCharIfW(symbol)]
      if (rawInfo) {
        let marketCap = rawInfo.USD.MKTCAP
        let marketCapETH = rawInfo.ETH.MKTCAP
        let marketCapBTC = rawInfo.BTC.MKTCAP
        let circulatingSupply = rawInfo.USD.CIRCULATINGSUPPLYMKTCAP
        let circulatingSupplyETH = rawInfo.ETH.CIRCULATINGSUPPLYMKTCAP
        let circulatingSupplyBTC = rawInfo.BTC.CIRCULATINGSUPPLYMKTCAP
        market_caps_info[i].value = marketCap
        market_caps_info[i].valueETH = marketCapETH
        market_caps_info[i].valueBTC = marketCapBTC
        market_caps_info[i].percent = calculatePercentageChange(
          getPreviousValueForSymbol(
            previous_element,
            'MarketCapInfo',
            market_caps_info[i].symbol,
          ),
          marketCap,
        )
        circulating_supply_info[i].value = circulatingSupply
        circulating_supply_info[i].valueETH = circulatingSupplyETH
        circulating_supply_info[i].valueBTC = circulatingSupplyBTC
        circulating_supply_info[i].percent = calculatePercentageChange(
          getPreviousValueForSymbol(
            previous_element,
            'CirculatingSupplyInfo',
            market_caps_info[i].symbol,
          ),
          circulatingSupply,
        )
      }
    }
  }
  timeline_data.MarketCapInfo = market_caps_info
  timeline_data.CirculatingSupplyInfo = circulating_supply_info
}

function getPreviousValueForSymbol(previous_element, key, symbol) {
  let prevValue = 0
  if (previous_element)
    prevValue = previous_element[key].find(
      (item) => item.symbol == symbol,
    ).value
  return prevValue
}

function addTokensTurnover(
  timeline_data,
  token_symbols,
  filtered_historical_tokens,
  filtered,
  previous_element,
) {
  let turnovers = InitAssetsTemplate(token_symbols)
  for (let i = 0; i < turnovers.length; i++) {
    let found = filtered_historical_tokens.find(
      (item) => item.symbol == turnovers[i].symbol,
    )
    if (found) {
      let id = found.id
      let token_swaps = filtered.filter(
        (item) => item.token.toLowerCase() == id,
      )

      const filtered_token_swaps = token_swaps.filter(
        (item) =>
          parseFloat(item.timestamp) > timeline_data.start &&
          parseFloat(item.timestamp) < timeline_data.end,
      )
      let end_volume = filtered_token_swaps.reduce(
        (sum, value) => sum + parseFloat(value['volumeUsd'].toString()),
        0,
      )
      let end_volume_eth = filtered_token_swaps.reduce(
        (sum, value) => sum + parseFloat(value['volumeETH'].toString()),
        0,
      )
      let end_volume_btc = filtered_token_swaps.reduce(
        (sum, value) => sum + parseFloat(value['volumeBTC'].toString()),
        0,
      )
      let assetInfo = timeline_data.AssetsInfo.find(
        (item) => item.symbol == turnovers[i].symbol,
      )
      turnovers[i].value = (end_volume / (assetInfo.value || 1)) * 100
      turnovers[i].valueETH = (end_volume_eth / (assetInfo.valueETH || 1)) * 100
      turnovers[i].valueBTC = (end_volume_btc / (assetInfo.valueBTC || 1)) * 100
      turnovers[i].percent = calculatePercentageChange(
        getPreviousValueForSymbol(
          previous_element,
          'TokenTurnoverInfo',
          turnovers[i].symbol,
        ),
        turnovers[i].value,
      )
    }
  }
  timeline_data.TokenTurnoverInfo = turnovers
}

function addLiquidityDeposited(
  timeline_data,
  filteredJoinExits,
  historicalPrices,
) {
  let filtered = filteredJoinExits.filter(
    (item) =>
      item.timestamp >= timeline_data.start &&
      item.timestamp <= timeline_data.end,
  )

  let deposited = filtered
    .filter((f) => f.type == 'Join')
    .map((item) =>
      CalculateJoinExitPrice(timeline_data, item, historicalPrices),
    )
  let depositedUSD =
    deposited.reduce((sum, value) => sum + value.valueUsd, 0) ?? 0
  let depositedETH =
    deposited.reduce((sum, value) => sum + value.valueETH, 0) ?? 0
  let depositedBTC =
    deposited.reduce((sum, value) => sum + value.valueBTC, 0) ?? 0
  let withdrawed = filtered
    .filter((f) => f.type == 'Exit')
    .map((item) =>
      CalculateJoinExitPrice(timeline_data, item, historicalPrices),
    )
  let withdrawedUSD =
    withdrawed.reduce((sum, value) => sum + value.valueUsd, 0) ?? 0
  let withdrawedETH =
    withdrawed.reduce((sum, value) => sum + value.valueETH, 0) ?? 0
  let withdrawedBTC =
    withdrawed.reduce((sum, value) => sum + value.valueBTC, 0) ?? 0
  timeline_data.Deposits = depositedUSD
  timeline_data.Deposits_ETH = depositedETH
  timeline_data.Deposits_BTC = depositedBTC
  timeline_data.Withdraws = withdrawedUSD
  timeline_data.Withdraws_ETH = withdrawedETH
  timeline_data.Withdraws_BTC = withdrawedBTC
  timeline_data.LiquidityDeposited = depositedUSD - withdrawedUSD
  timeline_data.LiquidityDeposited_ETH = depositedETH - withdrawedETH
  timeline_data.LiquidityDeposited_BTC = depositedBTC - withdrawedBTC
}

function addCapitalGains(
  timeline_data,
  historical_tvl,
  historical_token_prices,
  previous_element,
) {
  let finalLiquidity = getTvlForTimestamp(
    historical_tvl,
    historical_token_prices,
    timeline_data.end,
  )
  let finalBalances = getTvlBalancesForTimestamp(
    historical_tvl,
    historical_token_prices,
    timeline_data.end,
  )
  let initialLiquidity = getTvlForTimestamp(
    historical_tvl,
    historical_token_prices,
    timeline_data.start,
  )

  let initialBalances = getTvlBalancesForTimestamp(
    historical_tvl,
    historical_token_prices,
    timeline_data.start,
  )

  for (let k = 0; k < finalBalances.length; k++) {
    let item = finalBalances[k]
    let initialLiquidity = initialBalances.find(
      (_item) => _item.symbol == item.symbol,
    )
    let initial = { value: 0, valueUsd: 0, valueETH: 0, valueBTC: 0 }
    if (initialLiquidity) {
      initial = initialLiquidity
    }
    let found = timeline_data.AssetsCapitalGainsInfo.find(
      (_item) => _item.symbol == item.symbol,
    )
    let assetDeposit = timeline_data.AssetsDepositInfo.find(
      (_item) => item.symbol == _item.symbol,
    )
    let assetWithdraw = timeline_data.AssetsWithdrawInfo.find(
      (_item) => item.symbol == _item.symbol,
    )
    if (assetDeposit && assetWithdraw) {
      let liquidityDeposited = assetDeposit.value - assetWithdraw.value
      let liquidityDepositedUsd = assetDeposit.valueUsd - assetWithdraw.valueUsd
      let liquidityDepositedETH = assetDeposit.valueETH - assetWithdraw.valueETH
      let liquidityDepositedBTC = assetDeposit.valueBTC - assetWithdraw.valueBTC
      found.value = item.value - (initial.value + liquidityDeposited)
      found.valueUsd =
        item.valueUsd - (initial.valueUsd + liquidityDepositedUsd)
      found.valueETH =
        item.valueETH - (initial.valueETH + liquidityDepositedETH)
      found.valueBTC =
        item.valueBTC - (initial.valueBTC + liquidityDepositedBTC)

      let foundInitialLiquidity = timeline_data.AssetsInitialLiquidityInfo.find(
        (_item) => _item.symbol == item.symbol,
      )
      let foundFinalLiquidity = timeline_data.AssetsFinalLiquidityInfo.find(
        (_item) => _item.symbol == item.symbol,
      )
      if (initial.value == 0) {
        initial.value = item.value
        initial.valueUsd = item.valueUsd
        initial.valueETH = item.valueETH
        initial.valueBTC = item.valueBTC
      }

      foundInitialLiquidity.value = initial.value
      foundInitialLiquidity.valueUsd = initial.valueUsd
      foundInitialLiquidity.valueETH = initial.valueETH
      foundInitialLiquidity.valueBTC = initial.valueBTC

      foundFinalLiquidity.value = item.value
      foundFinalLiquidity.valueUsd = item.valueUsd
      foundFinalLiquidity.valueETH = item.valueETH
      foundFinalLiquidity.valueBTC = item.valueBTC
    }
  }
  // let summarized = timeline_data.AssetsCapitalGainsInfo.map(
  //   (item) => item.valueUsd
  // ).reduce((sum, value) => sum + value, 0);
  // let summarizedInitial = initialBalances
  //   .map((item) => item.valueUsd)
  //   .reduce((sum, value) => sum + value, 0);
  // let summarizedFinal = finalBalances
  //   .map((item) => item.valueUsd)
  //   .reduce((sum, value) => sum + value, 0);

  timeline_data.CapitalGains =
    finalLiquidity.tvlUsd -
    (initialLiquidity.tvlUsd + timeline_data.LiquidityDeposited)
  timeline_data.CapitalGainsETH =
    finalLiquidity.tvlETH -
    (initialLiquidity.tvlETH + timeline_data.LiquidityDeposited_ETH)
  timeline_data.CapitalGainsBTC =
    finalLiquidity.tvlBTC -
    (initialLiquidity.tvlBTC + timeline_data.LiquidityDeposited_BTC)
  if (initialLiquidity.tvlUsd == 0) {
    initialLiquidity = finalLiquidity
  }
  timeline_data.InitialLiquidity = initialLiquidity.tvlUsd
  timeline_data.InitialLiquidityETH = initialLiquidity.tvlETH
  timeline_data.InitialLiquidityBTC = initialLiquidity.tvlBTC
  timeline_data.FinalLiquidity = finalLiquidity.tvlUsd
  timeline_data.FinalLiquidityETH = finalLiquidity.tvlETH
  timeline_data.FinalLiquidityBTC = finalLiquidity.tvlBTC
  if (previous_element) {
    timeline_data.InitialLiquidityPercent = calculatePercentageChange(
      previous_element.InitialLiquidity,
      timeline_data.InitialLiquidity,
    )
    timeline_data.FinalLiquidityPercent = calculatePercentageChange(
      previous_element.FinalLiquidity,
      timeline_data.FinalLiquidity,
    )
  }
}

function addActiveUsers(timeline_data, filtered_active_users) {
  timeline_data.ActiveUsers = getActiveUsersForPeriod(
    filtered_active_users,
    timeline_data.start,
    timeline_data.end,
  )
}
