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
import {
  GetMonthlyTextData,
  GetQuarterlyTextData,
  GetWeeklyTextData,
  GetYearlyTextData,
  capitalizeFirstLetter,
} from '@/lib/utils'
import { configService } from '@/services/config/config.service'

/**
 * @typedef {Object} FinancialStatementTemplate
 * @property {string} date
 * @property {string} dateDays
 * @property {number} end
 * @property {number} start
 * @property {number} profitLoss
 * @property {number} profitLossPercents
 * @property {number} LiquidityDeposited
 * @property {number} LiquidityDepositedPercent
 * @property {number} TradingVolume
 * @property {number} TradingVolumePercents
 * @property {Object} ComparisonPerformance
 * @property {number} ComparisonPerformance.Percent
 * @property {string} ComparisonPerformance.BTC
 * @property {string} ComparisonPerformance.ETH
 * @property {string} ComparisonPerformance.HoldETH
 * @property {string} ComparisonPerformance.HoldBTC
 * @property {number} Fees
 * @property {number} FeesPercent
 * @property {number} Revenue
 * @property {number} RevenuePercent
 * @property {null|any} TokenIncentives
 * @property {number} Earnings
 * @property {string} Assets
 * @property {Array} AssetsInfo
 * @property {Array} AssetsMarketInfo
 * @property {string} Pools
 * @property {string} PoolsPercent
 * @property {Array} PoolsInfo
 * @property {string} CapitalGains
 * @property {string} CapitalGainsPercent
 * @property {string} ProfitLossHoldings
 * @property {string} NonPoolHoldings
 * @property {number} AssetsPercent
 * @property {Object} PriceInfo
 * @property {string} PriceInfo.WBTC
 * @property {string} PriceInfo.ETH
 * @property {string} PriceInfo.USDT
 * @property {string} PriceInfo.USDC
 * @property {string} PriceInfo.SUSHI
 * @property {Array} CirculatingSupplyInfo
 * @property {Array} MarketCapInfo
 * @property {Object} TokenTurnoverInfo
 * @property {string} TokenTurnoverInfo.WBTC
 * @property {string} TokenTurnoverInfo.ETH
 * @property {string} TokenTurnoverInfo.USDT
 * @property {string} TokenTurnoverInfo.USDC
 * @property {string} TokenTurnoverInfo.SUSHI
 * @property {Object} TokenHoldersInfo
 * @property {string} TokenHoldersInfo.WBTC
 * @property {string} TokenHoldersInfo.ETH
 * @property {string} TokenHoldersInfo.USDT
 * @property {string} TokenHoldersInfo.USDC
 * @property {string} TokenHoldersInfo.SUSHI
 * @property {Object} TokenDeviationInfo
 * @property {string} TokenDeviationInfo.WBTC
 * @property {string} TokenDeviationInfo.ETH
 * @property {string} TokenDeviationInfo.USDT
 * @property {string} TokenDeviationInfo.USDC
 * @property {string} TokenDeviationInfo.SUSHI
 * @property {string} PFRatio
 * @property {Object} PFRatioInfo
 * @property {string} PFRatioInfo.WBTC
 * @property {string} PFRatioInfo.ETH
 * @property {string} PFRatioInfo.USDT
 * @property {string} PFRatioInfo.USDC
 * @property {string} PFRatioInfo.SUSHI
 * @property {string} PSRatio
 * @property {Object} PSRatioInfo
 * @property {string} PSRatioInfo.WBTC
 * @property {string} PSRatioInfo.ETH
 * @property {string} PSRatioInfo.USDT
 * @property {string} PSRatioInfo.USDC
 * @property {string} PSRatioInfo.SUSHI
 * @property {number} ActiveUsersPercent
 * @property {string} ActiveUsers
 * @property {Object} ActiveUsersInfo
 * @property {string} ActiveUsersInfo.WBTC
 * @property {string} ActiveUsersInfo.ETH
 * @property {string} ActiveUsersInfo.USDT
 * @property {string} ActiveUsersInfo.USDC
 * @property {string} ActiveUsersInfo.SUSHI
 * @property {string} Developers
 * @property {string} DevelopersPercent
 * @property {string} Commits
 * @property {string} CommitsPercent
 * @property {string} SharpeRatio
 * @property {Object} SharpeRatioInfo
 * @property {string} SharpeRatioInfo.WBTC
 * @property {string} SharpeRatioInfo.ETH
 * @property {string} SharpeRatioInfo.USDT
 * @property {string} SharpeRatioInfo.USDC
 * @property {string} SharpeRatioInfo.SUSHI
 * @property {string} SortinoRatio
 * @property {Object} SortinoRatioInfo
 * @property {string} SortinoRatioInfo.WBTC
 * @property {string} SortinoRatioInfo.ETH
 * @property {string} SortinoRatioInfo.USDT
 * @property {string} SortinoRatioInfo.USDC
 * @property {string} SortinoRatioInfo.SUSHI
 * @property {string} InitialLiquidity
 * @property {number} InitialLiquidityPercent
 * @property {string} FinalLiquidity
 * @property {number} FinalLiquidityPercent
 */

/**
 * @typedef {Object} AssetTemplate
 * @property {string} symbol
 * @property {number} value
 * @property {number} previousValue
 * @property {number} percent
 */

/**
 * @typedef {Object} GithubInfo
 * @property {string} repository
 * @property {string} name
 * @property {number} timestamp
 */

/**
 * @typedef {import('@/composables/pools/usePoolSwapsStats').Swap} Swap
 * @typedef {import('@/composables/pools/snapshots/usePoolHistoricalTvl').HistoricalTVL} HistoricalTVL
 * @typedef {import('@/composables/users/useActiveUsers').UserTx} UserTx
 * @typedef {import('./historicalTokensFormatter').FormattedHistoricalToken} FormattedHistoricalToken
 * @typedef {import('@/composables/balances/cryptocompare').HistoricalPriceInfo} HistoricalPriceInfo
 * @typedef {import('@/composables/users/useActiveUsers').JoinExitTransaction} JoinExitTransaction
 * @typedef {import('@/composables/useTokenPriceChange').CoinData} CoinData
 */

const template = {
  date: '',
  dateDays: '',
  end: 0,
  start: 0,
  profitLoss: 0,
  profitLossPercents: 0,
  LiquidityDeposited: 0,
  LiquidityDepositedPercent: 0,
  Deposits: 0,
  DepositsPercent: 0,
  WithdrawsPercent: 0,
  TradingVolume: 0,
  TradingVolumePercents: 0,
  ComparisonPerformance: {
    Percent: 0,
    BTC: '0',
    ETH: '0',
    HoldETH: '0',
    HoldBTC: '0',
  },
  Fees: 0,
  FeesPercent: 0,
  Revenue: 0,
  RevenuePercent: 0,
  Profit: 0,
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
  Pools: '0',
  PoolsPercent: '0',
  PoolsInfo: [],
  CapitalGains: '0',
  CapitalGainsPercent: '0',
  ProfitLossHoldings: '0',
  NonPoolHoldings: '0',
  AssetsPercent: 0,
  PriceInfo: {
    WBTC: '0',
    ETH: '0',
    USDT: '0',
    USDC: '0',
    SUSHI: '0',
  },
  CirculatingSupplyInfo: [],
  MarketCapInfo: [],
  TokenTurnoverInfo: {
    WBTC: '0',
    ETH: '0',
    USDT: '0',
    USDC: '0',
    SUSHI: '0',
  },
  TokenHoldersInfo: {
    WBTC: '0',
    ETH: '0',
    USDT: '0',
    USDC: '0',
    SUSHI: '0',
  },
  TokenDeviationInfo: {
    WBTC: '0',
    ETH: '0',
    USDT: '0',
    USDC: '0',
    SUSHI: '0',
  },
  PFRatio: '0',
  PFRatioInfo: {
    WBTC: '0',
    ETH: '0',
    USDT: '0',
    USDC: '0',
    SUSHI: '0',
  },
  PSRatio: '0',
  PSRatioInfo: {
    WBTC: '0',
    ETH: '0',
    USDT: '0',
    USDC: '0',
    SUSHI: '0',
  },
  ActiveUsersPercent: 0,
  ActiveUsers: '0',
  ActiveUsersInfo: {
    WBTC: '0',
    ETH: '0',
    USDT: '0',
    USDC: '0',
    SUSHI: '0',
  },
  Developers: '0',
  DevelopersPercent: '0',
  Commits: '0',
  CommitsPercent: '0',
  SharpeRatio: '0',
  SharpeRatioInfo: {
    WBTC: '0',
    ETH: '0',
    USDT: '0',
    USDC: '0',
    SUSHI: '0',
  },
  SortinoRatio: '0',
  SortinoRatioInfo: {
    WBTC: '0',
    ETH: '0',
    USDT: '0',
    USDC: '0',
    SUSHI: '0',
  },
  InitialLiquidity: 0,
  InitialLiquidityPercent: 0,
  FinalLiquidity: 0,
  FinalLiquidityPercent: 0,
}

/**
 * Initialize template for financial statement column.
 * @function InitTemplate
 * @param {string} textData - title for financial statement column
 * @returns {FinancialStatementTemplate} template for financial statement column
 */
function InitTemplate(textData) {
  let template_clone = { ...template }
  template_clone.date = textData.title
  template_clone.dateDays = textData.range
  template_clone.end = textData.end
  template_clone.start = textData.start
  return template_clone
}

/**
 * Initialize template for asset specific stats
 * @function InitAssetsTemplate
 * @param {string[]} token_symbols - array of token symbols
 * @returns {AssetTemplate[]} - array of asset template for token_symbols
 */
function InitAssetsTemplate(token_symbols) {
  return token_symbols.map((s) => ({
    symbol: s,
    value: 0,
    percent: 0,
    previousValue: 0,
  }))
}

/**
 * Initialize information about historical balances for specific asset.
 * @function InitAssetsInfo
 * @param {FinancialStatementTemplate} template - financial statement template
 * @param {string[]} token_symbols - array of token symbols
 * @param {FormattedHistoricalToken} filtered_historical_tokens - data about historical balances of the tokens
 * @returns {void}
 */
function InitAssetsInfo(
  template,
  token_symbols,
  historicalPrices,
  filtered_historical_tokens,
) {
  template.AssetsInfo = getAssetsInfo(
    token_symbols,
    filtered_historical_tokens,
    historicalPrices,
    template.start,
    template.end,
  )
  template.AssetsProfitInfo = [
    ...template.AssetsInfo.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      percent: 0,
    })),
  ]
  template.AssetsRevenueInfo = [
    ...template.AssetsInfo.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      percent: 0,
    })),
  ]
  template.AssetsVolumeInfo = [
    ...template.AssetsInfo.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      percent: 0,
    })),
  ]
  template.AssetsDepositInfo = [
    ...template.AssetsInfo.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      percent: 0,
    })),
  ]
  template.AssetsWithdrawInfo = [
    ...template.AssetsInfo.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      percent: 0,
    })),
  ]
  template.AssetsInitialLiquidityInfo = [
    ...template.AssetsInfo.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      percent: 0,
    })),
  ]
  template.AssetsFinalLiquidityInfo = [
    ...template.AssetsInfo.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      percent: 0,
    })),
  ]
  template.AssetsCapitalGainsInfo = [
    ...template.AssetsInfo.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      percent: 0,
    })),
  ]
  let chains = [Network.ARBITRUM, Network.BINANCE, Network.POLYGON]
  let nativeTokens = chains.map(
    (chain) => configService.getNetworkConfig(chain).nativeAsset.symbol,
  )
  template.AssetsGasFeeInfo = nativeTokens.map((t) => ({
    value: 0,
    valueUsd: 0,
    percent: 0,
    symbol: t,
  }))
  let total_assets_info = getTotalAssetsInfo(template.AssetsInfo)
  template.Assets = total_assets_info.sum
  template.AssetsPercent = total_assets_info.percent
}

/**
 * Initialize asset prices.
 * @function InitAssetsMarketInfo
 * @param {FinancialStatementTemplate} template - financial statement template
 * @param {string[]} token_symbols - array of token symbols
 * @param {HistoricalPriceInfo[]} historicalPrices - historical prices of the assets
 * @returns {void}
 */
function InitAssetsMarketInfo(template, token_symbols, historicalPrices) {
  template.AssetsMarketInfo = getAssetsMarketInfo(
    token_symbols,
    historicalPrices,
    template.start,
    template.end,
  )
}

/**
 * Initialize TVL data for each of the pools.
 * @function InitPoolsInfo
 * @param {FinancialStatementTemplate} template - financial statement template
 * @param {string[]} pools - pool IDs to analyze
 * @param {HistoricalTVL[]} filtered_historical_tvl - historical TVL of these pools
 * @returns {void}
 */
function InitPoolsInfo(template, pools, filtered_historical_tvl) {
  template.PoolsInfo = getPoolsInfo(
    pools,
    filtered_historical_tvl,
    template.start,
    template.end,
  )
  let total_pools_info = getTotalPoolsInfo(template.PoolsInfo)

  template.Pools = total_pools_info.sum
  template.PoolsPercent = total_pools_info.percent
}

const timelines = {
  Weekly: { getTextData: GetWeeklyTextData },
  Monthly: { getTextData: GetMonthlyTextData },
  Quarterly: { getTextData: GetQuarterlyTextData },
  Yearly: { getTextData: GetYearlyTextData },
}

/**
 * Format data for financial statement tab.
 * @function FormatFinancialStatementData
 * @param {Swap[]} poolSwapsData - trades info
 * @param {HistoricalTVL[]} historical_tvl - historical TVLs of the pools
 * @param {UserTx[]} active_users - users that made any join/exit/swap on our protocol
 * @param {FormattedHistoricalToken[]} historicalTokens - info about historical tokens balances
 * @param {GithubInfo} githubInfo - github statistics
 * @param {HistoricalPriceInfo[]} historicalPrices - historical prices of the tokens
 * @param {JoinExitTransaction[]} joinExits - joinExits of the protocol
 * @param {string} chainSelected - chain selected in the UI
 * @param {CoinData} [marketCaps] - market caps info for PoolDetails financial statement
 * @returns {{Weekly:FinancialStatementTemplate[], Monthly:FinancialStatementTemplate[], Quarterly:FinancialStatementTemplate[], Yearly:FinancialStatementTemplate[]}} formatted data for financial statement tab.
 */
export function FormatFinancialStatementData(
  poolSwapsData,
  historical_tvl,
  active_users,
  historicalTokens,
  githubInfo,
  historicalPrices,
  joinExits,
  chainSelected,
  marketCaps = null,
) {
  let result = {
    Weekly: [],
    Monthly: [],
    Quarterly: [],
    Yearly: [],
  }

  let filtered = poolSwapsData
    .filter((item) => isRightChain(item, chainSelected))
    .sort((a, b) => a.timestamp - b.timestamp)
  let filteredJoinExits = joinExits.filter((item) =>
    isRightChainName(item.chain, chainSelected),
  )
  let filtered_historical_tvl = historical_tvl
    .filter((item) => isRightChainName(item.Blockchain, chainSelected))
    .sort((a, b) => a.timestamp - b.timestamp)
  let filtered_historical_tokens = historicalTokens.filter((item) =>
    isRightChain(item, chainSelected),
  )
  let filtered_active_users = active_users.filter((item) =>
    isRightChain(item, chainSelected),
  )
  let token_symbols = Array.from(
    new Set(filtered_historical_tokens.map((t) => t.symbol)),
  ).sort()
  let pools = Array.from(new Set(filtered_historical_tvl.map((t) => t.pool.id)))
  let timeline_keys = Object.keys(timelines)
  for (let j = 0; j < filtered_historical_tvl.length; j++) {
    let item_ts = filtered_historical_tvl[j].timestamp

    for (let k = 0; k < timeline_keys.length; k++) {
      let timeline = timeline_keys[k]
      if (
        result[timeline].length == 0 ||
        result[timeline][result[timeline].length - 1].end < item_ts
      ) {
        let template = InitTemplate(
          timelines[timeline].getTextData(item_ts * 1000),
        )
        InitAssetsInfo(
          template,
          token_symbols,
          historicalPrices,
          filtered_historical_tokens,
        )
        InitAssetsMarketInfo(template, token_symbols, historicalPrices)
        if (marketCaps) {
          addMarketCapsInfo(template, token_symbols, marketCaps)
        }
        let previous_element =
          result[timeline].length > 0
            ? result[timeline][result[timeline].length - 1]
            : null
        addTokensTurnover(
          template,
          token_symbols,
          filtered_historical_tokens,
          filtered,
          previous_element,
        )
        InitPoolsInfo(template, pools, filtered_historical_tvl)
        addLiquidityDeposited(template, filteredJoinExits, historicalPrices)
        addCapitalGains(template, filtered_historical_tvl, previous_element)
        addActiveUsers(template, filtered_active_users)
        addGithubInfo(template, githubInfo)
        template.profitLoss = template.CapitalGains
        template.AssetsProfitLossInfo = [
          ...template.AssetsCapitalGainsInfo.map((item) => ({ ...item })),
        ]
        result[timeline].push(template)
        let timeline_data = result[timeline][result[timeline].length - 1]
        let filtered_token_swaps = filtered.filter(
          (item) =>
            item.timestamp > timeline_data.start &&
            item.timestamp < timeline_data.end,
        )
        for (let i = 0; i < filtered_token_swaps.length; i++) {
          let item = filtered_token_swaps[i]

          addArbitrageBotInfo(timeline_data, item, filtered_historical_tokens)
          if (result[timeline].length > 1) {
            let previous_element = result[timeline][result[timeline].length - 2]
            addPercentagesInfo(timeline_data, previous_element)
          }
        }
      }
    }
  }
  RemoveZeroValueAssets(result, filtered)
  RemoveZeroValuePools(result)
  RemoveZeroValueAssetPools(result)
  console.log(result)
  return result
}

function RemoveZeroValueAssets(result, filtered_swaps) {
  let allTokens = result.Yearly[0].AssetsProfitInfo.map((t) => t.symbol)
  let zeroTokens = [...allTokens]
  let chains = Array.from(
    new Set(
      filtered_swaps.map(
        (item) => ReversedDisplayNetwork[capitalizeFirstLetter(item.chain)],
      ),
    ),
  )
  let existingNativeTokens = chains.map(
    (chain) => configService.getNetworkConfig(chain).nativeAsset.symbol,
  )
  for (let i = 0; i < result.Yearly.length; i++) {
    let item = result.Yearly[i]
    for (let k = 0; k < allTokens.length; k++) {
      let symbol = allTokens[k]
      if (
        item.AssetsProfitInfo.find((t) => t.symbol == symbol).value > 0.0001
      ) {
        zeroTokens = zeroTokens.filter((t) => t != symbol)
      }
    }
  }
  for (const [, value] of Object.entries(result)) {
    for (let i = 0; i < value.length; i++) {
      value[i].AssetsGasFeeInfo = value[i].AssetsGasFeeInfo.filter((item) =>
        existingNativeTokens.includes(item.symbol),
      )
      value[i].AssetsProfitInfo = value[i].AssetsProfitInfo.filter(
        (item) => !zeroTokens.includes(item.symbol),
      )
      value[i].AssetsVolumeInfo = value[i].AssetsVolumeInfo.filter(
        (item) => !zeroTokens.includes(item.symbol),
      )
      value[i].AssetsRevenueInfo = value[i].AssetsRevenueInfo.filter(
        (item) => !zeroTokens.includes(item.symbol),
      )
    }
  }
}

function RemoveZeroValuePools(result) {
  let allPools = result.Yearly[0].PoolsInfo.map((t) => t.id)
  let zeroPools = [...allPools]
  for (let i = 0; i < result.Yearly.length; i++) {
    let item = result.Yearly[i]
    for (let k = 0; k < allPools.length; k++) {
      let id = allPools[k]
      if (item.PoolsInfo.find((t) => t.id == id).value > 0.0001) {
        zeroPools = zeroPools.filter((t) => t != id)
      }
    }
  }
  for (const [, value] of Object.entries(result)) {
    for (let i = 0; i < value.length; i++) {
      value[i].PoolsInfo = value[i].PoolsInfo.filter(
        (item) => !zeroPools.includes(item.id),
      )
    }
  }
}

function RemoveZeroValueAssetPools(result) {
  let allAssets = result.Yearly[0].AssetsInfo.map((t) => t.symbol)
  let zeroAssets = [...allAssets]
  for (let i = 0; i < result.Yearly.length; i++) {
    let item = result.Yearly[i]
    for (let k = 0; k < allAssets.length; k++) {
      let symbol = allAssets[k]
      if (item.AssetsInfo.find((t) => t.symbol == symbol).value > 0.0001) {
        zeroAssets = zeroAssets.filter((t) => t != symbol)
      }
    }
  }
  for (const [, value] of Object.entries(result)) {
    for (let i = 0; i < value.length; i++) {
      value[i].AssetsInfo = value[i].AssetsInfo.filter(
        (item) => !zeroAssets.includes(item.symbol),
      )
      value[i].AssetsProfitLossInfo = value[i].AssetsProfitLossInfo.filter(
        (item) => !zeroAssets.includes(item.symbol),
      )
      value[i].AssetsDepositInfo = value[i].AssetsDepositInfo.filter(
        (item) => !zeroAssets.includes(item.symbol),
      )
      value[i].AssetsWithdrawInfo = value[i].AssetsWithdrawInfo.filter(
        (item) => !zeroAssets.includes(item.symbol),
      )
    }
  }
}

/**
 * Add tokens turnover info
 * @function addTokensTurnover
 * @param {FinancialStatementTemplate} timeline_data - current financial statement column
 * @param {string[]} token_symbols - array of token symbols
 * @param {FormattedHistoricalToken[]} filtered_historical_tokens - info about historical tokens balances
 * @param {Swap[]} filtered - filtered arbitrage trades
 * @param {FinancialStatementTemplate|null} previous_element - previous financial statement column
 * @returns {void}
 */
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

      let end_volume = token_swaps
        .filter(
          (item) =>
            item.timestamp > timeline_data.start &&
            item.timestamp < timeline_data.end,
        )
        .reduce((sum, value) => sum + parseFloat(value['volumeUsd']), 0)
      let assetInfo = timeline_data.AssetsInfo.find(
        (item) => item.symbol == turnovers[i].symbol,
      )
      turnovers[i].value = (end_volume / assetInfo.value) * 100

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

/**
 * Get previous financial statement column value for specific key and token.
 * @function getPreviousValueForSymbol
 * @param {FinancialStatementTemplate|null} previous_element - previous financial statement column
 * @param {string} key - field name
 * @param {string} symbol - token symbol
 * @returns {number} - value of the specific stat for the symbol
 */
function getPreviousValueForSymbol(previous_element, key, symbol) {
  let prevValue = 0
  if (previous_element)
    prevValue = previous_element[key].find(
      (item) => item.symbol == symbol,
    ).value
  return prevValue
}

/**
 * Add info about market caps (only for PoolDetails tab)
 * @function addMarketCapsInfo
 * @param {FinancialStatementTemplate} timeline_data - current financial statement column
 * @param {string[]} token_symbols - array of token symbols
 * @param {CoinData} marketCaps - market caps info for PoolDetails financial statement
 * @param {FinancialStatementTemplate|null} previous_element - previous financial statement column
 * @returns {void}
 */
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
      let price = marketToken.value
      let rawInfo = marketCaps.RAW[replaceFirstCharIfW(symbol, '')].USD
      if (rawInfo) {
        let marketCap = rawInfo.MKTCAP / rawInfo.PRICE
        let circulatingSupply = rawInfo.CIRCULATINGSUPPLYMKTCAP
        let marketCapUsd = marketCap * price
        let circulatingSupplyUsd = circulatingSupply * price
        market_caps_info[i].value = marketCapUsd
        market_caps_info[i].percent = calculatePercentageChange(
          getPreviousValueForSymbol(
            previous_element,
            'MarketCapInfo',
            market_caps_info[i].symbol,
          ),
          marketCapUsd,
        )
        circulating_supply_info[i].value = circulatingSupplyUsd
        circulating_supply_info[i].percent = calculatePercentageChange(
          getPreviousValueForSymbol(
            previous_element,
            'CirculatingSupplyInfo',
            market_caps_info[i].symbol,
          ),
          circulatingSupplyUsd,
        )
      }
    }
  }
  timeline_data.MarketCapInfo = market_caps_info
  timeline_data.CirculatingSupplyInfo = circulating_supply_info
}

/**
 * Add liquidity deposited info.
 * @function addLiquidityDeposited
 * @param {FinancialStatementTemplate} timeline_data - current financial statement column
 * @param {JoinExitTransaction[]} filteredJoinExits - join exits of the protocol.
 * @returns {void}
 */
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
    .reduce((sum, value) => sum + value, 0)
  let withdrawed = filtered
    .filter((f) => f.type == 'Exit')
    .map((item) =>
      CalculateJoinExitPrice(timeline_data, item, historicalPrices),
    )
    .reduce((sum, value) => sum + value, 0)
  timeline_data.Deposits = deposited
  timeline_data.Withdraws = withdrawed
  timeline_data.LiquidityDeposited = deposited - withdrawed
}

export function CalculateJoinExitPrice(
  timeline_data,
  joinExit,
  historicalPrices,
  enableTimelineDataSet = true,
) {
  if (joinExit.type == 'Swap') return
  let valueUsd = 0
  let amounts = joinExit.amounts
  let tokens = joinExit.pool.tokens.map((t) => t.symbol)
  let ts = joinExit.timestamp
  let type = joinExit.type
  for (let i = 0; i < amounts.length; i++) {
    let token = tokens[i]
    let amount = amounts[i]
    let price = getPriceForTimestamp(token, historicalPrices, ts)
    let usdTokenValue = amount * price
    valueUsd += usdTokenValue
    if (enableTimelineDataSet) {
      let key = type == 'Join' ? 'AssetsDepositInfo' : 'AssetsWithdrawInfo'
      let found = timeline_data[key].find((t) => t.symbol == token)
      found.value += parseFloat(amount)
      found.valueUsd += usdTokenValue
    }
  }
  return valueUsd
}

/**
 * Add active users info.
 * @function addActiveUsers
 * @param {FinancialStatementTemplate} timeline_data - current financial statement column
 * @param {UserTx[]} filtered_active_users - active users of the protocol
 * @returns {void}
 */
function addActiveUsers(timeline_data, filtered_active_users) {
  timeline_data.ActiveUsers = getActiveUsersForPeriod(
    filtered_active_users,
    timeline_data.start,
    timeline_data.end,
  )
}

/**
 * Add github development stats.
 * @function addGithubInfo
 * @param {FinancialStatementTemplate} timeline_data - current financial statement column
 * @param {GithubInfo} githubInfo - github development stats
 * @returns {void}
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

/**
 * Add arbitrage trade to the stats.
 * @function addArbitrageBotInfo
 * @param {FinancialStatementTemplate} timeline_data - current financial statement column
 * @param {Swap} item - arbitrage trade object
 * @returns {void}
 */
function addArbitrageBotInfo(timeline_data, item, historical_tokens) {
  timeline_data.Fees += parseFloat(item.gasFeeUsd)
  timeline_data.Revenue += parseFloat(item.revenueUsd)
  timeline_data.Profit += parseFloat(item.profitUsd)
  timeline_data.profitLoss += parseFloat(item.revenueUsd)
  timeline_data.TradingVolume += parseFloat(item.volumeUsd)
  let found_token = historical_tokens.find(
    (_item) => _item.id == item.token.toLowerCase(),
  )
  timeline_data.AssetsProfitInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).valueUsd += item.profitUsd
  timeline_data.AssetsProfitInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).value += item.profit
  timeline_data.AssetsVolumeInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).valueUsd += item.volumeUsd
  timeline_data.AssetsVolumeInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).value += item.volume
  timeline_data.AssetsRevenueInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).valueUsd += item.revenueUsd
  timeline_data.AssetsRevenueInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).value += item.revenue

  let nativeTokenSymbol = configService.getNetworkConfig(
    ReversedDisplayNetwork[capitalizeFirstLetter(item.chain)],
  ).nativeAsset.symbol
  timeline_data.AssetsGasFeeInfo.find(
    (token) => token.symbol == nativeTokenSymbol,
  ).value += item.gasFee
  timeline_data.AssetsGasFeeInfo.find(
    (token) => token.symbol == nativeTokenSymbol,
  ).valueUsd += item.gasFeeUsd

  timeline_data.AssetsProfitLossInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).valueUsd += item.revenueUsd
  timeline_data.AssetsProfitLossInfo.find(
    (token) => token.symbol == found_token.symbol,
  ).value += item.revenue
}

/**
 * Add percentages change between 2 columns.
 * @function addPercentagesInfo
 * @param {FinancialStatementTemplate} timeline_data - current financial statement column
 * @param {FinancialStatementTemplate|null} previous_element - previous financial statement column
 * @returns {void}
 */
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

/**
 * Add capital gains info.
 * @function addCapitalGains
 * @param {FinancialStatementTemplate} timeline_data - current financial statement column
 * @param {HistoricalTVL[]} historical_tvl - historical TVLs of the pools
 * @param {FinancialStatementTemplate|null} previous_element - previous financial statement column
 * @returns {void}
 */
function addCapitalGains(timeline_data, historical_tvl, previous_element) {
  let finalLiquidity = getTvlForTimestamp(historical_tvl, timeline_data.end)
  let finalBalances = getTvlBalancesForTimestamp(
    historical_tvl,
    timeline_data.end,
  )
  let initialLiquidity = getTvlForTimestamp(historical_tvl, timeline_data.start)

  let initialBalances = getTvlBalancesForTimestamp(
    historical_tvl,
    timeline_data.start,
  )

  for (let k = 0; k < finalBalances.length; k++) {
    let item = finalBalances[k]
    let initialLiquidity = initialBalances.find(
      (_item) => _item.symbol == item.symbol,
    )
    let initial = { value: 0, valueUsd: 0 }
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
    let liquidityDeposited = assetDeposit.value - assetWithdraw.value
    let liquidityDepositedUsd = assetDeposit.valueUsd - assetWithdraw.valueUsd
    found.value = item.value - (initial.value + liquidityDeposited)
    found.valueUsd = item.valueUsd - (initial.valueUsd + liquidityDepositedUsd)

    let foundInitialLiquidity = timeline_data.AssetsInitialLiquidityInfo.find(
      (_item) => _item.symbol == item.symbol,
    )
    let foundFinalLiquidity = timeline_data.AssetsFinalLiquidityInfo.find(
      (_item) => _item.symbol == item.symbol,
    )

    if (initial.value == 0) {
      initial.value = item.value
      initial.valueUsd = item.valueUsd
    }

    foundInitialLiquidity.value = initial.value
    foundInitialLiquidity.valueUsd = initial.valueUsd

    foundFinalLiquidity.value = item.value
    foundFinalLiquidity.valueUsd = item.valueUsd
  }
  let summarized = timeline_data.AssetsCapitalGainsInfo.map(
    (item) => item.valueUsd,
  ).reduce((sum, value) => sum + value, 0)
  let summarizedInitial = initialBalances
    .map((item) => item.valueUsd)
    .reduce((sum, value) => sum + value, 0)
  let summarizedFinal = finalBalances
    .map((item) => item.valueUsd)
    .reduce((sum, value) => sum + value, 0)

  console.log(summarized)
  console.log(summarizedInitial)
  console.log(summarizedFinal)

  timeline_data.CapitalGains =
    finalLiquidity - (initialLiquidity + timeline_data.LiquidityDeposited)
  if (initialLiquidity == 0) {
    initialLiquidity = finalLiquidity
  }
  timeline_data.InitialLiquidity = initialLiquidity
  timeline_data.FinalLiquidity = finalLiquidity
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

/**
 * Get token price by timestamp
 * @function getPriceForTimestamp
 * @param {string} symbol - token symbol
 * @param {HistoricalPriceInfo[]} historicalPrices - data with historical prices of the tokens
 * @param {number} timestamp - timestamp in seconds
 * @returns {number} price of the token for the specific timestamp
 */
export function getPriceForTimestamp(symbol, historicalPrices, timestamp) {
  if (!historicalPrices || historicalPrices.length == 0) return 0
  let symbol_prices = historicalPrices.filter((h) => h.symbol == symbol)[0]
  if (!symbol_prices) return 0
  let sorted = [...symbol_prices.Daily].sort((a, b) => b.time - a.time)
  let found = sorted.find((item) => item.time <= timestamp)
  if (!found) return 0
  return CalculateTokenOrderPrice(found)
}

/**
 * Get active users number for the time range.
 * @function getActiveUsersForPeriod
 * @param {UserTx[]} active_users - users that made any join/exit/swap on our protocol
 * @param {number} start - start timestamp
 * @param {number} end - end timestamp
 * @returns {number} - number of the active users for the time range.
 */
function getActiveUsersForPeriod(active_users, start, end) {
  let filtered = active_users
    .filter(
      (user_info) => user_info.timestamp > start && user_info.timestamp < end,
    )
    .map((item) => item.user)
  return Array.from(new Set(filtered)).length
}

/**
 * Get historical tokens balances for the time range.
 * @function getAssetsInfo
 * @param {string[]} symbols - array of token symbols
 * @param {FormattedHistoricalToken[]} historicalTokens - info about historical tokens balances
 * @param {number} start - start timestamp
 * @param {number} end - end timestamp
 * @returns {AssetTemplate[]} - array of assets balances info for the time range.
 */
function getAssetsInfo(
  symbols,
  historicalTokens,
  historicalPrices,
  start,
  end,
) {
  let assets_info = InitAssetsTemplate(symbols)
  let start_balances = getTokensHoldingForTimestamp(
    historicalTokens,
    historicalPrices,
    symbols,
    start,
  )
  let end_balances = getTokensHoldingForTimestamp(
    historicalTokens,
    historicalPrices,
    symbols,
    end,
  )
  for (let i = 0; i < assets_info.length; i++) {
    let asset = assets_info[i]
    asset.balance = end_balances[asset.symbol].balance
    asset.value = end_balances[asset.symbol].balanceUsd
    asset.previousValue = start_balances[asset.symbol].balanceUsd
    asset.percent = calculatePercentageChange(
      start_balances[asset.symbol].balanceUsd,
      end_balances[asset.symbol].balanceUsd,
    )
  }
  return assets_info
}
/**
 * Get prices info for the assets.
 * @function getAssetsMarketInfo
 * @param {string[]} symbols - array of token symbols
 * @param {HistoricalPriceInfo[]} historicalPrices - historical prices of the assets
 * @param {number} start - start timestamp
 * @param {number} end - end timestamp
 * @returns {AssetTemplate[]} - array of assets prices info for the time range.
 */
function getAssetsMarketInfo(symbols, historicalPrices, start, end) {
  let assets_info = InitAssetsTemplate(symbols)
  let start_prices = getTokensPricesForTimestamp(
    symbols,
    historicalPrices,
    start,
  )
  let end_prices = getTokensPricesForTimestamp(symbols, historicalPrices, end)
  for (let i = 0; i < assets_info.length; i++) {
    let asset = assets_info[i]
    asset.value = end_prices[asset.symbol]
    asset.previousValue = start_prices[asset.symbol]
    asset.percent = calculatePercentageChange(
      start_prices[asset.symbol],
      end_prices[asset.symbol],
    )
  }
  return assets_info
}

/**
 * Summarize assets info.
 * @function getTotalAssetsInfo
 * @param {AssetTemplate[]} assetsInfo - assets info to summarize
 * @returns {sum:number, percent:number} - summarized assets info data.
 */
function getTotalAssetsInfo(assetsInfo) {
  let sum = 0
  let prevSum = 0
  for (let k = 0; k < assetsInfo.length; k++) {
    sum += assetsInfo[k].value
    prevSum += assetsInfo[k].previousValue
  }
  return {
    sum,
    percent: calculatePercentageChange(prevSum, sum),
  }
}

/**
 * Get pools historical balances for the time range.
 * @function getPoolsInfo
 * @param {string[]} pools - pool IDs to analyze
 * @param {HistoricalTVL[]} historical_tvl - historical TVL of these pools
 * @param {number} start - start timestamp
 * @param {number} end - end timestamp
 * @returns {AssetTemplate[]} - pools historical balances for the time range.
 */
function getPoolsInfo(pools, historical_tvl, start, end) {
  let result = []
  let tvl_start = getPoolsTvlFromTimestamp(pools, historical_tvl, start)
  let tvl_end = getPoolsTvlFromTimestamp(pools, historical_tvl, end)
  for (let k = 0; k < pools.length; k++) {
    result.push({
      id: tvl_start[pools[k]].id,
      name: tvl_start[pools[k]].name,
      value: tvl_end[pools[k]].value,
      previousValue: tvl_start[pools[k]].value,
      percent: calculatePercentageChange(
        tvl_start[pools[k]].value,
        tvl_end[pools[k]].value,
      ),
    })
  }
  return result
}

/**
 * Summarize pools data.
 * @function getTotalPoolsInfo
 * @param {AssetTemplate[]} pools - pools data
 * @returns {{sum:number, percent:number}} - summarized pools data
 */
function getTotalPoolsInfo(poolsInfo) {
  let sum = 0
  let prevSum = 0
  for (let k = 0; k < poolsInfo.length; k++) {
    sum += poolsInfo[k].value
    prevSum += poolsInfo[k].previousValue
  }
  return {
    sum,
    percent: calculatePercentageChange(prevSum, sum),
  }
}

/**
 * Get pools historical TVLs from the timestamp.
 * @function getPoolsTvlFromTimestamp
 * @param {string[]} pools - pool IDs to analyze
 * @param {HistoricalTVL[]} fhistorical_tvl - historical TVL of these pools
 * @param {number} timestamp - timestamp in seconds
 * @returns {value:number, name:string} - historical TVLs of the pools for specific timestamp.
 */
function getPoolsTvlFromTimestamp(pools, historical_tvl, timestamp) {
  let result = {}
  for (let i = 0; i < pools.length; i++) {
    let pool = pools[i]
    let poolHistoricalTvl = historical_tvl.filter((t) => t.pool.id == pool)
    if (poolHistoricalTvl.length > 0) {
      let tvl = getTvlForTimestamp(poolHistoricalTvl, timestamp)
      result[pool] = {
        value: tvl,
        name: poolHistoricalTvl[0].pool.tokens.map((t) => t.symbol).join('/'),
        id: poolHistoricalTvl[0].pool.id,
      }
    }
  }
  return result
}

/**
 * Get TVL for the timestamp.
 * @function getTvlForTimestamp
 * @param {HistoricalTVL[]} fhistorical_tvl - historical TVL of these pools
 * @param {number} timestamp - timestamp in seconds
 * @returns {number} - historical TVL for the specific timestamp.
 */
export function getTvlForTimestamp(historical_tvl, timestamp) {
  let found_pools = []
  let sum_tvl = 0
  let filtered_historical_tvl = historical_tvl
    .filter((t) => t.timestamp <= timestamp)
    .sort((a, b) => b.timestamp - a.timestamp)
  if (filtered_historical_tvl.length == 0) {
    return 0
  }
  for (let i = 0; i < filtered_historical_tvl.length; i++) {
    let tvl = filtered_historical_tvl[i]
    if (!found_pools.includes(tvl.pool.id)) {
      found_pools.push(tvl.pool.id)
      sum_tvl += parseFloat(tvl.totalLiquidity)
    }
  }
  return sum_tvl
}
export function getTvlBalancesForTimestamp(historical_tvl, timestamp) {
  let found_pools = []
  let filtered_historical_tvl = historical_tvl
    .filter((t) => t.timestamp <= timestamp)
    .sort((a, b) => b.timestamp - a.timestamp)
  if (filtered_historical_tvl.length == 0) {
    return []
  }
  let balances = []
  for (let i = 0; i < filtered_historical_tvl.length; i++) {
    let tvl = filtered_historical_tvl[i]
    if (!found_pools.includes(tvl.pool.id)) {
      for (let k = 0; k < tvl.pool.tokens.length; k++) {
        let symbol = tvl.pool.tokens[k].symbol
        let found = balances.find((t) => t.symbol == symbol)
        if (!found) {
          found = { symbol, value: 0, valueUsd: 0 }
          balances.push(found)
        }
        found.value += parseFloat(tvl.balances[k])
        found.valueUsd += parseFloat(tvl.balancesUsd[k])
      }
      found_pools.push(tvl.pool.id)
    }
  }
  return balances
}

/**
 * Get tokens historical balances for the timestamp.
 * @function getTokensHoldingForTimestamp
 * @param {FormattedHistoricalToken[]} historicalTokens - info about historical tokens balances
 * @param {string[]} symbols - array of token symbols
 * @param {number} timestamp - timestamp in seconds
 * @returns {Map<string, {balance:number, balanceUsd}>} map with the info about historical balances of the tokens.
 */
function getTokensHoldingForTimestamp(
  historicalTokens,
  historicalPrices,
  symbols,
  timestamp,
) {
  let found_pools = []
  let filtered_historical_tokens = historicalTokens
    .filter((t) => t.timestamp < timestamp)
    .sort((a, b) => b.timestamp - a.timestamp)

  let balances = {}
  symbols.forEach((t) => {
    balances[t] = {
      balance: 0,
      balanceUsd: 0,
    }
  })

  let prices = getTokensPricesForTimestamp(symbols, historicalPrices, timestamp)
  for (let i = 0; i < filtered_historical_tokens.length; i++) {
    let token = filtered_historical_tokens[i]
    let token_id = `${token.symbol}-${token.poolId}`
    if (!found_pools.includes(token_id)) {
      found_pools.push(token_id)
      balances[token.symbol]['balanceUsd'] +=
        parseFloat(token.balance) * prices[token.symbol]
      balances[token.symbol]['balance'] += parseFloat(token.balance)
    }
  }
  return balances
}

/**
 * Get historical token prices for the timestamp
 * @function getTokensPricesForTimestamp
 * @param {string[]} symbols - array of token symbols
 * @param {HistoricalPriceInfo[]} historicalPrices - historical prices of the assets
 * @param {number} timestamp - timestamp in seconds
 * @returns {Map<string, number>} map with the info about historical balances of the tokens.
 */
export function getTokensPricesForTimestamp(
  symbols,
  historicalPrices,
  timestamp,
) {
  let prices = {}
  for (let i = 0; i < symbols.length; i++) {
    prices[symbols[i]] = getPriceForTimestamp(
      symbols[i],
      historicalPrices,
      timestamp,
    )
  }
  return prices
}
