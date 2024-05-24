import { GetCachedTreasuryYields } from '@/composables/api/useTreasuryYields'
import { usePool30dProfit } from '@/composables/pools/usePoolSwapsStats'
import {
  addDaysToDate,
  calculateAverage,
  timestampToSimpleDate,
} from '@/lib/utils'

/**
 * @typedef {import('@/lib/formatter/poolTvlFormatter').TVLInfo} TVLInfo
 * @typedef {import('@/lib/formatter/trackingInfoChartFormatter').TrackingInfoChartItem} TrackingInfoChartItem
 */

/**
 * @typedef {Object} HLC
 * @property {number} high - The high value.
 * @property {number} low - The low value.
 * @property {number} close - The close value.
 * @typedef {import('@/composables/api/useTreasuryYields.js').Treasury} Treasury
 * @typedef {import('@/composables/pools/usePoolSwapsStats').Swap} Swap
 * @typedef {'bonds'|'dai'} RiskFreeOption
 **/

const DaysCount = {
  Daily: 1,
  Weekly: 7,
  Monthly: 30,
}

const DAI_YIELD = 4

/**
 * Calculate Average APR for time range. If @see previousItems has some empty days - function will add them based on value of the previous days. It works only for custom usage with days number, if you will specify currentTimeline as a string - it won't add values for empty days.
 *
 * @function CalculateAvgApr
 * @param {{Profits:number}} item - item with the last state for the time range (we need here just summarized profits for this time range).
 * @param {{TVL:TVLInfo}[]} previousItems - items for this time range with tvl information.
 * @param {string|number} currentTimeline - specified time range, you can specify it as a string @see DaysCount or just as a number of days.
 * @returns {number} Returns average APR for the time range.
 */
export function CalculateAvgApr(
  item,
  previousItems,
  currentTimeline,
  chainSelected,
) {
  let profits = item['Profits'] // summarized profit per this time range (day/week/month)
  const protocolFee = 0
  let days = currentTimeline
  if (days == 0) days = 1
  if (typeof currentTimeline == 'string') days = DaysCount[currentTimeline] // days count of time range 1/7/30
  //else previousItems = addMonthEmptyDaysTimestamps(previousItems, days)
  let averageTvl = calculateAverage(
    previousItems.map((item) => item.TVL[chainSelected]),
  )
  let apr =
    averageTvl > 0
      ? ((profits * (1 - protocolFee)) / averageTvl) * (365 / days) * 100
      : 0

  return apr
}

/**
 * Calculate historical price changes for the token.
 * @function calculatePricesPercentageChange
 * @param {number[]} prices - sorted historical prices of the token
 * @returns {number[]} array with percentage changes of the token price.
 * **/
// eslint-disable-next-line
function calculatePricesPercentageChange(prices) {
  const percentageChanges = []

  for (let i = 1; i < prices.length; i++) {
    const previousPrice = prices[i - 1]
    const currentPrice = prices[i]

    if (previousPrice !== 0) {
      const percentageChange =
        ((currentPrice - previousPrice) / previousPrice) * 100
      percentageChanges.push(percentageChange)
    } else {
      // Handle the case where previousPrice is 0 (division by zero)
      percentageChanges.push(0) // You can choose to set it to 0 or some other value.
    }
  }

  return percentageChanges
}

/**
 * Calculate typical token price based on HLC (high/low/close).
 * @function CalculateTokenOrderPrice
 * @param {HLC} token_info - token info with HLC information.
 * @returns {number} token typical price.
 * **/
export function CalculateTokenOrderPrice(token_info) {
  return (token_info.high + token_info.low + token_info.close) / 3
}
// eslint-disable-next-line
function CalculatePriceRatios(prices0, prices1) {
  let ratios = prices0.map((p0, i) => (p0 / prices1[i]) * 100)
  return ratios
}

// export function CalculateVolatilityIndex(
//   chainSelected,
//   previousItems,
//   historicalPrices,
//   currentTimeline,
//   assets,
//   sortino = false,
//   timestamp = null,
//   riskFreeOption = 'bonds',
// ) {
//   let prices_length = currentTimeline
//   if (typeof currentTimeline == 'string') {
//     prices_length = currentTimeline == 'Daily' ? 24 : DaysCount[currentTimeline]
//   }
//   let volatilities = []
//   let prices_key = currentTimeline == 'Daily' ? 'Hourly' : 'Daily'
//   let avg_percentages = [] // avg_token_percentage1 * volatility_value
//   for (let i = 0; i < assets.length; i++) {
//     let symbol_historical = historicalPrices.find((p) => p.symbol == assets[i]) // get historical prices for the asset
//     let prices = symbol_historical[prices_key] // for the daily filter - we are using hourly data, for weekly,monthly - we are using daily data
//       .slice(-prices_length) // slice n price positions
//       .map((p) => CalculateTokenOrderPrice(p)) // for price we are taking average for the sum of: low, high, close positions
//     let ratios = []
//     for (let k = 0; k < assets.length; k++) {
//       if (k != i) {
//         let pair_symbol_historical = historicalPrices.find(
//           (p) => p.symbol == assets[k],
//         ) // get historical prices for the asset
//         let pair_symbol_prices = pair_symbol_historical[prices_key] // for the daily filter - we are using hourly data, for weekly,monthly - we are using daily data
//           .slice(-prices_length) // slice n price positions
//           .map((p) => CalculateTokenOrderPrice(p))
//         ratios.push(
//           calculateAverage(CalculatePriceRatios(prices, pair_symbol_prices)),
//         )
//       }
//     }
//     //let prices_changes = calculatePricesPercentageChange(ratios)
//     let avg_ratio = calculateAverage(ratios) // [1] get average asset price for the period
//     if (sortino) {
//       let bondsTreasury = FindTreasury(timestamp)
//       let treasury =
//         riskFreeOption == 'bonds'
//           ? bondsTreasury
//             ? bondsTreasury.avg_interest_rate_amt
//             : 0
//           : 4
//       if (treasury) ratios = ratios.filter((p) => p <= parseFloat(treasury))
//     }
//     let s_diffs = ratios.map((p) => Math.pow(avg_ratio - p, 2)) // [2] find squares of avg-price relations
//     let volatility_value = Math.sqrt(calculateAverage(s_diffs)) // [3-4] find sqrt of squared_differences
//     volatilities.push(volatility_value)
//     let assets_percentages = previousItems.map(
//       (pItem) =>
//         pItem.TVL[chainSelected] && pItem.Assets[assets[i]]
//           ? pItem.Assets[assets[i]] / (pItem.TVL[chainSelected] / 100) // calculating percentage of the asset
//           : 0, // if tvl == 0 => return 0
//     )
//     let avg_percentage = calculateAverage(assets_percentages)
//     avg_percentages.push(avg_percentage * volatility_value) // [5] multiply avg percentage of the asset to volatility_value
//   }
//   let volatility_index = calculateAverage(avg_percentages)
//   let vi = calculateAverage(volatilities)
//   console.log(vi)
//   return volatility_index
// }

/**
 * @typedef {import('@/composables/balances/cryptocompare').HistoricalPriceInfo} HistoricalPriceInfo
 */

/**
 * Calculate volatility index for time period
 * @function CalculateVolatilityIndex
 * @param {string} chainSelected - selected chain in the UI
 * @param {TrackingInfoChartItem[]} previousItems - items with info about TVL and assets for @see currentTimeline time period
 * @param {HistoricalPriceInfo[]} historicalPrices - historical prices of the tokens
 * @param {string|number} currentTimeline - can be key from @see DaysCount or just number of days
 * @param {string[]} assets - array of symbols for calculating volatility index for them
 * @param {boolean} sortino - is that volatility index for sortino or not
 * @param {number} timestamp - if sortino is true - then you should specify timestamp for treasury bond search.
 * @param {string} riskFreeOption - bonds/dai
 * @returns {number} volatility index for time period
 */
export function CalculateVolatilityIndex(
  chainSelected,
  previousItems,
  historicalPrices,
  currentTimeline,
  assets,
  treasury_yields,
  sortino = false,
  timestamp = null,
  riskFreeOption = 'bonds',
) {
  let prices_length = currentTimeline
  if (typeof currentTimeline == 'string') {
    prices_length = currentTimeline == 'Daily' ? 24 : DaysCount[currentTimeline]
  }
  let prices_key = currentTimeline == 'Daily' ? 'Hourly' : 'Daily'
  let avg_percentages = [] // avg_token_percentage1 * volatility_value
  for (let i = 0; i < assets.length; i++) {
    let symbol_historical = historicalPrices.find((p) => p.symbol == assets[i]) // get historical prices for the asset
    if (!symbol_historical || !symbol_historical[prices_key]) continue
    let prices = symbol_historical[prices_key] // for the daily filter - we are using hourly data, for weekly,monthly - we are using daily data
      .slice(-prices_length) // slice n price positions
      .map((p) => CalculateTokenOrderPrice(p)) // for price we are taking average for the sum of: low, high, close positions
    let prices_changes = calculatePricesPercentageChange(prices)
    let avg_price = calculateAverage(prices_changes) // [1] get average asset price for the period
    if (sortino) {
      let bondsTreasury = FindTreasury(treasury_yields, timestamp)
      let treasury =
        riskFreeOption == 'bonds'
          ? bondsTreasury
            ? bondsTreasury.avg_interest_rate_amt
            : 0
          : DAI_YIELD
      if (treasury)
        prices_changes = prices_changes.filter((p) => p <= parseFloat(treasury))
    }
    let s_diffs = prices_changes.map((p) => Math.pow(avg_price - p, 2)) // [2] find squares of avg-price relations
    let volatility_value = Math.sqrt(calculateAverage(s_diffs)) // [3-4] find sqrt of squared_differences
    let assets_percentages = previousItems.map(
      (pItem) =>
        pItem.TVL[chainSelected] && pItem.Assets[assets[i]]
          ? pItem.Assets[assets[i]] / (pItem.TVL[chainSelected] / 100) // calculating percentage of the asset
          : 0, // if tvl == 0 => return 0
    )
    let avg_percentage = calculateAverage(assets_percentages)
    avg_percentages.push(avg_percentage * volatility_value) // [5] multiply avg percentage of the asset to volatility_value
  }
  let volatility_index = calculateAverage(avg_percentages)
  return volatility_index
}

/**
 * Calculate sharpe ratio for time period.
 * @function CalculateSharpeRatio
 * @param {string} chainSelected - selected chain in the UI
 * @param {TrackingInfoChartItem[]} previousItems - items with info about TVL and assets for @see currentTimeline time period
 * @param {HistoricalPriceInfo[]} historicalPrices - historical prices of the tokens
 * @param {string|number} currentTimeline - can be key from @see DaysCount or just number of days
 * @param {string[]} assets - array of symbols for calculating volatility index for them
 * @param {number} avg_apr - average APR for time period
 * @param {number} timestamp - timestamp for treasury bond search.
 * @param {number|null} volatility_index - volatility index for time period
 * @param {string} riskFreeOption - bonds/dai
 * @returns {number} sharpe ratio for time period
 */
export function CalculateSharpeRatio(
  chainSelected,
  previousItems,
  historicalPrices,
  currentTimeline,
  assets,
  avg_apr,
  timestamp,
  treasury,
  volatility_index = null,
  riskFreeOption = 'bonds',
) {
  if (!volatility_index) {
    volatility_index = CalculateVolatilityIndex(
      chainSelected,
      previousItems,
      historicalPrices,
      currentTimeline,
      assets,
      false,
      riskFreeOption,
      treasury,
    )
  }
  return CalculateRatio(
    avg_apr,
    volatility_index,
    timestamp,
    treasury,
    riskFreeOption,
  )
}

/**
 * Calculate sortino ratio for time period.
 * @function CalculateSharpeRatio
 * @param {string} chainSelected - selected chain in the UI
 * @param {TrackingInfoChartItem[]} previousItems - items with info about TVL and assets for @see currentTimeline time period
 * @param {HistoricalPriceInfo[]} historicalPrices - historical prices of the tokens
 * @param {string|number} currentTimeline - can be key from @see DaysCount or just number of days
 * @param {string[]} assets - array of symbols for calculating volatility index for them
 * @param {number} avg_apr - average APR for time period
 * @param {number} timestamp - timestamp for treasury bond search.
 * @param {number|null} volatility_index - volatility index for time period
 * @param {string} riskFreeOption - bonds/dai
 * @returns {number} sortino ratio for time period
 */
export function CalculateSortinoRatio(
  chainSelected,
  previousItems,
  historicalPrices,
  currentTimeline,
  assets,
  avg_apr,
  timestamp,
  treasury,
  volatility_index = null,
  riskFreeOption = 'bonds',
) {
  if (!volatility_index) {
    volatility_index = CalculateVolatilityIndex(
      chainSelected,
      previousItems,
      historicalPrices,
      currentTimeline,
      assets,
      true,
      timestamp,
      riskFreeOption,
      treasury,
    )
  }
  return CalculateRatio(
    avg_apr,
    volatility_index,
    timestamp,
    treasury,
    riskFreeOption,
  )
}

/**
 * Find US Treasury value for the timestamp, if value not found for this month - it will take the value from the previous month.
 * @function FindTreasury
 * @param {number} timestamp - (ms) timestamp of when to find US Treasury
 * @return {Treasury} US Treasury for this timestamp.
 **/
function FindTreasury(treasury_yields, timestamp) {
  // let date = new Date(timestamp)
  // console.log('treasury_yields', treasury_yields)
  // let found = treasury_yields.find(
  //   (t) =>
  //     parseFloat(t.record_calendar_month) == date.getMonth() + 1 &&
  //     parseFloat(t.record_calendar_year) == date.getFullYear(),
  // )
  // if (!found)
  //   found = treasury_yields.find(
  //     (t) =>
  //       parseFloat(t.record_calendar_month) == date.getMonth() && // get treasury from previous month
  //       parseFloat(t.record_calendar_year) == date.getFullYear(),
  //   )
  return 0
}

/**
 * Calculate ratio (sortino/sharpe) last formula.
 * @function CalculateRatio
 * @param {number} avg_apr - average apr for time period. @see CalculateAvgApr
 * @param {number} volatility_index - volatilit index for time period. @see CalculateVolatilityIndex
 * @param {number} timestamp  - (ms) last timestamp of time period.
 * @param {RiskFreeOption} riskFreeOption - yield to compare with (bonds/dai).
 * @returns {number} ratio for the parameters.
 * **/
function CalculateRatio(
  avg_apr,
  volatility_index,
  timestamp,
  treasury_yields,
  riskFreeOption = 'bonds',
) {
  let bonds_ratio = FindTreasury(treasury_yields, timestamp)
  let treasury =
    riskFreeOption == 'bonds'
      ? bonds_ratio
        ? bonds_ratio.avg_interest_rate_amt
        : 0
      : DAI_YIELD
  if (!treasury || volatility_index == 0) return 0
  let result = (avg_apr - treasury) / volatility_index
  return result
}

/**
 * Format TVL ans swaps data for time period.
 * @function formatAvgAprValues
 * @param {TVLInfo[]} historicalTvl - not formatted array of TVLs.
 * @param {Swap[]} swapsData - not formatted array of swaps.
 * @param {number} daysCount - how much days count for average APR calculation (this will be a time period). @see CalculateAvgApr
 * @returns {{profit:number, items:TVLInfo[]}} formatted data for average APR calculation.
 **/
function formatAvgAprValues(historicalTvl, swapsData, daysCount) {
  const currentDate = new Date()

  const daysAgoDate = new Date(currentDate)
  daysAgoDate.setDate(currentDate.getDate() - daysCount)
  const days_ago_ts = daysAgoDate.getTime() / 1000 // Divide by 1000 to convert from milliseconds to seconds
  let tvls = historicalTvl.filter((tvl) => tvl.timestamp >= days_ago_ts * 1000)

  if (tvls.length == 0 && historicalTvl.length > 0)
    tvls = [{ ...historicalTvl[0], timestamp: currentDate.getTime() / 1000 }]

  let items = tvls.map((tvl) => ({ TVL: tvl }))
  let profits = swapsData.filter((item) => item.timestamp >= days_ago_ts)
  let profit = profits.reduce(
    (sum, value) => sum + parseFloat(value.profitUsd),
    0,
  )
  return { profit: profit, items }
}

export function CalculateTotalTokenAPR(
  token_related_tvls,
  token_info,
  swapsData,
  chainSelectedName,
  custom_last = null,
) {
  let first_ts = token_related_tvls[0].timestamp
  let first_ts_temp = first_ts
  let last_ts = custom_last || new Date().getTime() / 1000
  let historical_tvls = []
  while (last_ts > first_ts) {
    let tvl = calculateTokenTvlForTimestamp(
      token_related_tvls,
      token_info,
      first_ts,
    )
    let historical_tvl = {
      'All Chains': tvl,
      Date: timestampToSimpleDate(first_ts * 1000),
      timestamp: first_ts * 1000,
    }
    historical_tvl[chainSelectedName] = tvl
    historical_tvls.push(historical_tvl)

    first_ts = addDaysToDate(new Date(first_ts * 1000), 1).getTime() / 1000
  }
  let filtered_swaps = swapsData.filter(
    (item) =>
      item.token.toLowerCase() == token_info.address &&
      item.timestamp <= last_ts,
  )
  let profitItem = {
    Profits: filtered_swaps.reduce((sum, value) => sum + value.profit, 0),
  }
  let _daysAgo = daysAgo(first_ts_temp * 1000)
  return CalculateAvgApr(
    profitItem,
    historical_tvls.map((item) => ({ TVL: item })),
    _daysAgo,
    chainSelectedName,
  )
}

function calculateTokenTvlForTimestamp(historiclaTvl, token_info, ts) {
  historiclaTvl = historiclaTvl.filter((item) => item.timestamp <= ts)
  let unique_pools = []
  let tvl = 0
  for (let k = historiclaTvl.length - 1; k >= 0; k--) {
    let item = historiclaTvl[k]
    if (!unique_pools.includes(item.pool.id)) {
      let token_index = item.pool.tokens
        .map((t) => t.symbol)
        .findIndex((t) => t == token_info.symbol)
      tvl += parseFloat(item.balances[token_index])
      unique_pools.push(item.pool.id)
    }
  }
  return tvl
}

function daysAgo(timestamp) {
  // Convert the timestamp to milliseconds
  const timestampMillis = timestamp

  // Get the current date and time in milliseconds
  const currentDateMillis = new Date().getTime()

  // Calculate the time difference in milliseconds
  const timeDifference = currentDateMillis - timestampMillis

  // Calculate the number of days
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

  return daysDifference
}

/**
 * Calculate all days average APR with unformatted data.
 * @function CalculateTotalAvgApr
 * @param {TVLInfo[]} historicalTvl - historical tvl values.
 * @param {Swap[]} swapsData - array of swaps from /output call.
 * @param {string} chainSelected - chain that is selected on page
 * @returns {number} all days average APR.
 */
export function CalculateTotalAvgApr(historicalTvl, swapsData, chainSelected) {
  let first_tvl = historicalTvl.sort((a, b) => a.timestamp - b.timestamp)[0]
  if (!first_tvl) return 0
  let start_ts = first_tvl.timestamp
  let _daysAgo = daysAgo(start_ts)
  if (_daysAgo == 0) _daysAgo = 1
  let { items, profit } = formatAvgAprValues(historicalTvl, swapsData, _daysAgo)
  return CalculateAvgApr({ Profits: profit }, items, _daysAgo, chainSelected)
}
/**
 * Calculate 30 days average APR with unformatted data.
 * @function CalculateMonthAvgApr
 * @param {TVLInfo[]} historicalTvl - historical tvl values.
 * @param {Swap[]} swapsData - array of swaps from /output call.
 * @param {string} chainSelected - chain that is selected on page
 * @returns {number} 30 days average APR.
 */
export function CalculateMonthAvgApr(historicalTvl, swapsData, chainSelected) {
  let first_tvl = historicalTvl.sort((a, b) => a.timestamp - b.timestamp)[0]
  if (!first_tvl) return 0
  let start_ts = first_tvl.timestamp
  let _daysAgo = daysAgo(start_ts)
  if (_daysAgo == 0) _daysAgo = 1
  if (_daysAgo > 30) {
    _daysAgo = 30
  }
  let { items, profit } = formatAvgAprValues(historicalTvl, swapsData, _daysAgo)
  return CalculateAvgApr({ Profits: profit }, items, _daysAgo, chainSelected)
}
/**
 * Calculate 7 days average APR with unformatted data.
 * @function CalculateWeekAvgApr
 * @param {TVLInfo[]} historicalTvl - historical tvl values.
 * @param {Swap[]} swapsData - array of swaps from /output call.
 * @param {string} chainSelected - chain that is selected on page
 * @returns {number} 7 days average APR.
 */
export function CalculateWeekAvgApr(historicalTvl, swapsData, chainSelected) {
  let first_tvl = historicalTvl.sort((a, b) => a.timestamp - b.timestamp)[0]
  if (!first_tvl) return 0
  let start_ts = first_tvl.timestamp
  let _daysAgo = daysAgo(start_ts)
  if (_daysAgo == 0) _daysAgo = 1
  if (_daysAgo > 7) {
    _daysAgo = 7
  }
  let { items, profit } = formatAvgAprValues(historicalTvl, swapsData, _daysAgo)
  return CalculateAvgApr({ Profits: profit }, items, _daysAgo, chainSelected)
}
/**
 * Calculate 1 day average APR with unformatted data.
 * @function CalculateDayAvgApr
 * @param {TVLInfo[]} historicalTvl - historical tvl values.
 * @param {Swap[]} swapsData - array of swaps from /output call.
 * @param {string} chainSelected - chain that is selected on page
 * @returns {number} 1 day average APR.
 */
export function CalculateDayAvgApr(historicalTvl, swapsData, chainSelected) {
  let { items, profit } = formatAvgAprValues(historicalTvl, swapsData, 1)
  return CalculateAvgApr({ Profits: profit }, items, 1, chainSelected)
}

/**
 * Add empty days for TVLs data. (for example we have TVLs for these dates [1/1/2023, 1/2/2023, 1/4/2023]) - it will add value for 1/3/2023.
 * @function addMonthEmptyDaysTimestamps
 * @param {TVLInfo[]} tvls - unformatted historical tvls values
 * @param {number} days - from which date to start - (now - days).
 * @returns {TVLInfo[]} array with TVLs with all dates within this time range now - days -> now
 */
export function addMonthEmptyDaysTimestamps(tvls, days = 30) {
  if (tvls.length == 0 || days < 1) {
    return []
  }
  let end_date = new Date()
  let start_date = new Date(end_date.getTime() - 1000 * 60 * 60 * 24 * days)
  let filtered_tvls = []
  while (start_date <= end_date) {
    let current_date = timestampToSimpleDate(start_date)
    let current_day_tvls = tvls.filter(
      (t) => current_date == timestampToSimpleDate(new Date(t.TVL.timestamp)),
    )
    if (current_day_tvls.length > 0) {
      filtered_tvls.push({
        ...current_day_tvls.sort(
          (a, b) => b.TVL.timestamp - a.TVL.timestamp,
        )[0],
      })
    } else {
      if (filtered_tvls.length > 0) {
        filtered_tvls.push({
          TVL: {
            ...filtered_tvls[filtered_tvls.length - 1].TVL,
            timestamp: start_date.getTime(),
            Date: current_date,
          },
        })
      } else if (tvls.filter((t) => t.TVL.timestamp < end_date) == 0) {
        filtered_tvls.push({
          TVL: {
            'All Chains': 0,
            Arbitrum: 0,
            Binance: 0,
            Polygon: 0,
            Date: current_date,
            timestamp: start_date.getTime(),
          },
        })
      }
    }
    start_date = addDaysToDate(start_date, 1)
  }
  return filtered_tvls.sort((a, b) => b.timestamp - a.timestamp)
}

/**
 * Calculate percentage difference between 2 values.
 * @function calculatePercentageChange
 * @param {number} initialValue - previous value
 * @param {number} finalValue - current value
 * @returns {number} percentage difference between 2 values.
 * **/
export function calculatePercentageChange(initialValue, finalValue) {
  if (initialValue === 0) {
    return 0
  }
  const change = ((finalValue - initialValue) / initialValue) * 100
  return change
}

/**
 * Calculate percentage of value from another.
 * @function calculatePercentageChange
 * @param {number} initialValue - base value
 * @param {number} finalValue - value to calculate how much percent it's from base value
 * @returns {number} percent initialValue out of finalValue.
 * **/
export function calculatePercentage(initialValue, finalValue) {
  if (initialValue == null || finalValue == null) return 0
  let percent = initialValue / 100

  return finalValue / percent
}

/**
 * Calculate ROI (Returns On Investment)
 * @function CalculateRoi
 * @param {number} amountSpent - investments value
 * @param {number} amountGaied - returns
 * @returns {number} returns on investment in percent.
 * **/
export function CalculateRoi(amountSpent, amountGained) {
  if (amountSpent == 0) return 0
  if (amountGained == 0) return 1
  return ((amountGained - amountSpent) / amountSpent) * 100
}

export function CalculateCLAPR(poolSnapshots, trades, poolId) {
  let formattedTvls = poolSnapshots.toReversed()
  formattedTvls = formattedTvls.map((item) => ({
    TVL: {
      'All Chains': parseFloat(item.totalValueLockedUSD),
      timestamp: item.timestamp,
    },
  }))
  let pool_trades = trades.filter((item) =>
    item.swaps[0].poolIdVault[0].includes(poolId),
  )
  let profit = usePool30dProfit(pool_trades).value
  return CalculateAvgApr(
    { Profits: profit },
    formattedTvls,
    'Monthly',
    'All Chains',
  )
}
