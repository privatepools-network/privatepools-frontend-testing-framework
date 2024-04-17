import {
  calculatePercentageDifference,
  isTimestampWithinCurrentDay,
  isTimestampWithinPreviousDay,
  isTimestampWithinLast7Days,
  isTimestampWithinPrevious7Days,
  isTimestampWithinCurrent30Days,
  isTimestampWithinPrevious30Days,
  calculateAverage,
  sumFields,
  formatSimpleTimestamp,
  formatDateFromTimestamp,
  generateTimeAgoString,
  capitalizeFirstLetter,
} from '@/lib/utils'
import {
  CalculateAvgApr,
  CalculateSharpeRatio,
  CalculateSortinoRatio,
  CalculateTokenOrderPrice,
  CalculateVolatilityIndex,
} from '../math/chartMath/trackingInfoMath'
import { configService } from '@/services/config/config.service'
import { ReversedDisplayNetwork } from '../useNetwork'

/**
 * @typedef {import('@/composables/pools/snapshots/usePoolHistoricalTvl').HistoricalTVL} HistoricalTVL
 */

/**
 * @typedef {Object} Swap
 * @property {string} chain - The blockchain on which the trade occurred (e.g., "arbitrum").
 * @property {string} token - The token address used in the trade.
 * @property {string} timestamp - The timestamp of the trade.
 * @property {number} amountIn - The amount of input tokens.
 * @property {string} functionName - The name of the function involved in the trade.
 * @property {number} amountOut - The amount of output tokens.
 * @property {number} revenue - The revenue from the trade.
 * @property {number} revenueUsd - The revenue in USD.
 * @property {number} profit - The profit from the trade.
 * @property {number} profitUsd - The profit in USD.
 * @property {string} hash - The hash of the trade transaction.
 * @property {number} blockNumber - The block number of the trade transaction.
 * @property {number} tradeAmount - The total trade amount.
 * @property {number} volume - The volume of the trade.
 * @property {number} volumeUsd - The volume in USD.
 * @property {number} selector - The selector value.
 * @property {string} buyPath - The path used for buying.
 * @property {string} sellPath - The path used for selling.
 * @property {number} gasFee - The gas fee for the trade.
 * @property {number} gasFeeUsd - The gas fee in USD.
 * @property {Array<Object>} swaps - An array of swap details.
 * @property {Array<number>} swaps.amountInVault - The amount in the vault for the swap.
 * @property {Array<number>} swaps.amountInVaultUsd - The amount in the vault in USD for the swap.
 * @property {Array<number>} swaps.amountOutVault - The amount out of the vault for the swap.
 * @property {Array<number>} swaps.amountOutVaultUsd - The amount out of the vault in USD for the swap.
 * @property {Array<number>} swaps.profitUsd - The profit in USD for the swap.
 * @property {Array<number>} swaps.revenueUsd - The revenue in USD for the swap.
 * @property {Array<string>} swaps.tokenInVault - The token input in the vault for the swap.
 * @property {Array<string>} swaps.tokenOutVault - The token output in the vault for the swap.
 * @property {Array<string>} swaps.poolIdVault - The pool ID in the vault for the swap.
 * @property {Array<string>} swaps.trackPair - The tracked pair for the swap.
 */

/**
 * @typedef {Object} TimeRangeData
 * @property {number} value
 * @property {number} percentChange
 */

/**
 * Aggregate stats for one key on specified time range.
 * @function useTimeRangeData
 * @param {string} key - swap field name to aggregate data (for example: profitUsd, revenueUsd)
 * @param {Swap[]} filtered - filtered swaps to aggregate
 * @param {Function} isWithinCurrentTimeRange - is timestamp within current time range
 * @param {Function} isWithinPreviousTimeRange - is timestamp within previous time range
 * @param {boolean} swaps - is @see key within root of the object or inside 'swaps' field.
 * @returns {TimeRangeData} - aggregated data for @see key field and its difference from the previous period
 */
function useTimeRangeData(
  key,
  filtered,
  isWithinCurrentTimeRange,
  isWithinPreviousTimeRange,
  swaps = true,
) {
  let currentDaySwaps = filtered.filter((f) =>
    isWithinCurrentTimeRange(f.timestamp),
  )
  let previousDaySwaps = filtered.filter((f) =>
    isWithinPreviousTimeRange(f.timestamp),
  )
  let currentVolume = 0
  if (currentDaySwaps.length > 0)
    currentVolume = currentDaySwaps.reduce(
      (sum, value) =>
        sum +
        parseFloat(
          swaps
            ? value['swaps'].reduce((sum, value) => sum + value[key], 0)
            : value[key],
        ),
      0,
    )
  let prevVolume = 0
  if (previousDaySwaps.length > 0)
    prevVolume = previousDaySwaps.reduce(
      (sum, value) =>
        sum +
        parseFloat(
          swaps
            ? value['swaps'].reduce((sum, value) => sum + value[key], 0)
            : value[key],
        ),
      0,
    )
  let percentChange = calculatePercentageDifference(prevVolume, currentVolume)
  if (isNaN(percentChange)) percentChange = 0
  return {
    value: currentVolume.toFixed(2),
    rawValue: currentVolume,
    percentChange: percentChange,
  }
}

/**
 * Find average value of the field @see key on specified time range.
 * @function useTimeRangeData
 * @param {string} key - swap field name to find average (for example: profitUsd, revenueUsd)
 * @param {Swap[]} filtered - filtered swaps for calculating average
 * @param {Function} isWithinCurrentTimeRange - is timestamp within current time range
 * @param {Function} isWithinPreviousTimeRange - is timestamp within previous time range
 * @param {boolean} swaps - is @see key within root of the object or inside 'swaps' field.
 * @returns {number} average value for the field @see key on specified time range.
 */
function useTimeRangeDataAvg(
  key,
  filtered,
  isWithinCurrentTimeRange,
  isWithinPreviousTimeRange,
  swaps = true,
) {
  let filtered_length = filtered.filter((item) =>
    isWithinCurrentTimeRange(item.timestamp),
  ).length
  let result = useTimeRangeData(
    key,
    filtered,
    isWithinCurrentTimeRange,
    isWithinPreviousTimeRange,
    swaps,
  )
  return parseFloat(result.value) / filtered_length
}

/**
 * The same as @see useTimeRangeData but it will sum all array values on 'swaps' subfield instead of taking just the first one.
 * @param {string} key - swap field name to aggregate data (for example: profitUsd, revenueUsd)
 * @param {Swap[]} filtered - filtered swaps to aggregate
 * @param {Function} isWithinCurrentTimeRange - is timestamp within current time range
 * @param {Function} isWithinPreviousTimeRange - is timestamp within previous time range
 * @returns {TimeRangeData} - aggregated data for @see key field and its difference from the previous period
 */
//eslint-disable-next-line
function useTimeRangeDataMultipleKeys(
  keys,
  filtered,
  isWithinCurrentTimeRange,
  isWithinPreviousTimeRange,
) {
  let currentDaySwaps = filtered.filter((f) =>
    isWithinCurrentTimeRange(f.timestamp),
  )
  let previousDaySwaps = filtered.filter((f) =>
    isWithinPreviousTimeRange(f.timestamp),
  )
  let currentVolume = 0
  if (currentDaySwaps.length > 0)
    currentVolume = keys
      .map((key) =>
        currentDaySwaps.reduce(
          (sum, value) =>
            sum +
            parseFloat(
              value['swaps'].reduce((sum, value) => sum + value[key], 0),
            ),
          0,
        ),
      )
      .reduce((sum, value) => sum + value, 0)
  let prevVolume = 0
  if (previousDaySwaps.length > 0)
    prevVolume = keys
      .map((key) =>
        previousDaySwaps.reduce(
          (sum, value) =>
            sum +
            parseFloat(
              value['swaps'].reduce((sum, value) => sum + value[key], 0),
            ),
          0,
        ),
      )
      .reduce((sum, value) => sum + value, 0)
  let percentChange = calculatePercentageDifference(prevVolume, currentVolume)
  if (isNaN(percentChange)) percentChange = 0
  return {
    value: currentVolume.toFixed(2),
    percentChange: percentChange,
  }
}

/**
 * Get the aggregated volume for the last 24h.
 * @function usePool24hVolume
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated volume for the last 24h.
 */
export function usePool24hVolume(filtered) {
  return useTimeRangeData(
    'volumeUsd',
    filtered,
    isTimestampWithinCurrentDay,
    isTimestampWithinPreviousDay,
    false,
  )
}

/**
 * Get the aggregated volume for the last 7d.
 * @function usePool7dVolume
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated volume for the last 7d.
 */
export function usePool7dVolume(filtered) {
  return useTimeRangeData(
    'volumeUsd',
    filtered,
    isTimestampWithinLast7Days,
    isTimestampWithinPrevious7Days,
    false,
  )
}

/**
 * Get the aggregated volume for the last 30d.
 * @function usePool30dVolume
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated volume for the last 30d.
 */
export function usePool30dVolume(filtered) {
  return useTimeRangeData(
    'volumeUsd',
    filtered,
    isTimestampWithinCurrent30Days,
    isTimestampWithinPrevious30Days,
    false,
  )
}
/**
 * Get the aggregated volume for all time.
 * @function usePoolAllTimeVolume
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated volume for all time
 */
export function usePoolAllTimeVolume(filtered) {
  return useTimeRangeData(
    'volumeUsd',
    filtered,
    () => true,
    () => false,
    false,
  )
}

/**
 * Get the aggregated profit for the last 24h.
 * @function usePool24hProfit
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated profit for the last 24h.
 */
export function usePool24hProfit(filtered) {
  return useTimeRangeData(
    'profitUsd',
    filtered,
    isTimestampWithinCurrentDay,
    isTimestampWithinPreviousDay,
    false,
  )
}

/**
 * Get the aggregated profit for the last 7d.
 * @function usePool7dProfit
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated profit for the last 7d.
 */
export function usePool7dProfit(filtered) {
  return useTimeRangeData(
    'profitUsd',
    filtered,
    isTimestampWithinLast7Days,
    isTimestampWithinPrevious7Days,
    false,
  )
}
/**
 * Get the aggregated profit for the last 30d.
 * @function usePool30dProfit
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated profit for the last 30d.
 */
export function usePool30dProfit(filtered) {
  return useTimeRangeData(
    'profitUsd',
    filtered,
    isTimestampWithinCurrent30Days,
    isTimestampWithinPrevious30Days,
    false,
  )
}

/**
 * Get the aggregated profit for all time.
 * @function usePoolAllTimeProfit
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated profit for all time.
 */
export function usePoolAllTimeProfit(filtered) {
  return useTimeRangeData(
    'profitUsd',
    filtered,
    () => true,
    () => false,
    false,
  )
}

/**
 * Get the 24h average profit.
 * @function use24hAvgProfit
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  24h average profit.
 */
export function use24hAvgProfit(filtered) {
  return useTimeRangeDataAvg(
    'profitUsd',
    filtered,
    isTimestampWithinCurrentDay,
    isTimestampWithinPreviousDay,
    false,
  )
}

/**
 * Get the 7d average profit.
 * @function use7dAvgProfit
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  7d average profit.
 */
export function use7dAvgProfit(filtered) {
  return useTimeRangeDataAvg(
    'profitUsd',
    filtered,
    isTimestampWithinLast7Days,
    isTimestampWithinPrevious7Days,
    false,
  )
}

/**
 * Get the 30d average profit.
 * @function use30dAvgProfit
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  30d average profit.
 */
export function use30dAvgProfit(filtered) {
  return useTimeRangeDataAvg(
    'profitUsd',
    filtered,
    isTimestampWithinCurrent30Days,
    isTimestampWithinPrevious30Days,
    false,
  )
}

/**
 * Get the all-time average profit.
 * @function useAllTimeAvgProfit
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  all-time average profit.
 */
export function useAllTimeAvgProfit(filtered) {
  return useTimeRangeDataAvg(
    'profitUsd',
    filtered,
    () => true,
    () => false,
    false,
  )
}
/**
 * Get the aggregated revenue for the last 24h.
 * @function usePool24hRevenue
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated revenue for the last 24h.
 */
export function usePool24hRevenue(filtered) {
  return useTimeRangeData(
    'revenueUsd',
    filtered,
    isTimestampWithinCurrentDay,
    isTimestampWithinPreviousDay,
    false,
  )
}

/**
 * Get the aggregated revenue for the last 7d.
 * @function usePool7dRevenue
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated revenue for the last 7d.
 */
export function usePool7dRevenue(filtered) {
  return useTimeRangeData(
    'revenueUsd',
    filtered,
    isTimestampWithinLast7Days,
    isTimestampWithinPrevious7Days,
    false,
  )
}

/**
 * Get the aggregated revenue for the last 30d.
 * @function usePool30dRevenue
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated revenue for the last 30d.
 */
export function usePool30dRevenue(filtered) {
  return useTimeRangeData(
    'revenueUsd',
    filtered,
    isTimestampWithinCurrent30Days,
    isTimestampWithinPrevious30Days,
    false,
  )
}

/**
 * Get the aggregated revenue for all time.
 * @function usePoolAllTimeRevenue
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated revenue for all time.
 */
export function usePoolAllTimeRevenue(filtered) {
  return useTimeRangeData(
    'revenueUsd',
    filtered,
    () => true,
    () => false,
    false,
  )
}

/**
 * Get the aggregated gas fee for the last 24h.
 * @function usePool24hGasFee
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated gas fee for the last 24h.
 */
export function usePool24hGasFee(filtered) {
  return useTimeRangeData(
    'gasFeeUsd',
    filtered,
    isTimestampWithinCurrentDay,
    isTimestampWithinPreviousDay,
    false,
  )
}

/**
 * Get the aggregated gas fee for the last 7d.
 * @function usePool7dGasFee
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated gas fee for the last 7d.
 */
export function usePool7dGasFee(filtered) {
  return useTimeRangeData(
    'gasFeeUsd',
    filtered,
    isTimestampWithinLast7Days,
    isTimestampWithinPrevious7Days,
    false,
  )
}

/**
 * Get the aggregated gas fee for the last 30d.
 * @function usePool30dGasFee
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated gas fee for the last 30d.
 */
export function usePool30dGasFee(filtered) {
  return useTimeRangeData(
    'gasFeeUsd',
    filtered,
    isTimestampWithinCurrent30Days,
    isTimestampWithinPrevious30Days,
    false,
  )
}

/**
 * Get the aggregated gas fee for all time.
 * @function usePoolAllTimeGasFee
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  aggregated gas fee for all time.
 */
export function usePoolAllTimeGasFee(filtered) {
  return useTimeRangeData(
    'gasFeeUsd',
    filtered,
    () => true,
    () => false,
    false,
  )
}

function usePoolTokensData(key, filtered, tokens_data) {
  let result = []
  for (let i = 0; i < filtered.length; i++) {
    let swap = filtered[i]
    let found_token = tokens_data.find(
      (item) => item.id == swap.token.toLowerCase(),
    )
    if (!found_token) {
      console.error('NOT FOUND ', swap.token)
      continue
    }
    let symbol = found_token.symbol
    let found = result.find((item) => item.symbol == symbol)
    if (!found) {
      found = { symbol, value: 0 }
      result.push(found)
    }
    found.value += swap[key]
  }
  return result
}

function usePoolTokensGasData(key, filtered) {
  let result = []
  for (let i = 0; i < filtered.length; i++) {
    let swap = filtered[i]
    let nativeToken = configService.getNetworkConfig(
      ReversedDisplayNetwork[capitalizeFirstLetter(swap.chain)],
    ).nativeAsset.symbol
    let found = result.find((item) => item.symbol == nativeToken)
    if (!found) {
      found = { symbol: nativeToken, value: 0 }
      result.push(found)
    }
    found.value += swap[key]
  }
  return result
}

export function usePool24hGasFeeTokens(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrentDay(f.timestamp),
  )
  return usePoolTokensGasData('gasFeeUsd', currentDaySwaps, tokens_data)
}
export function usePool7dGasFeeTokens(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinLast7Days(f.timestamp),
  )
  return usePoolTokensGasData('gasFeeUsd', currentDaySwaps, tokens_data)
}
export function usePool30dGasFeeTokens(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrent30Days(f.timestamp),
  )
  return usePoolTokensGasData('gasFeeUsd', currentDaySwaps, tokens_data)
}

export function usePool24hGasFeeTokensAmount(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrentDay(f.timestamp),
  )
  return usePoolTokensGasData('gasFee', currentDaySwaps, tokens_data)
}
export function usePool7dGasFeeTokensAmount(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinLast7Days(f.timestamp),
  )
  return usePoolTokensGasData('gasFee', currentDaySwaps, tokens_data)
}
export function usePool30dGasFeeTokensAmount(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrent30Days(f.timestamp),
  )
  return usePoolTokensGasData('gasFee', currentDaySwaps, tokens_data)
}

export function usePool24hProfitTokens(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrentDay(f.timestamp),
  )
  return usePoolTokensData('profitUsd', currentDaySwaps, tokens_data)
}
export function usePool7dProfitTokens(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinLast7Days(f.timestamp),
  )
  return usePoolTokensData('profitUsd', currentDaySwaps, tokens_data)
}
export function usePool30dProfitTokens(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrent30Days(f.timestamp),
  )
  return usePoolTokensData('profitUsd', currentDaySwaps, tokens_data)
}

export function usePool24hProfitTokensAmount(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrentDay(f.timestamp),
  )
  return usePoolTokensData('profit', currentDaySwaps, tokens_data)
}
export function usePool7dProfitTokensAmount(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinLast7Days(f.timestamp),
  )
  return usePoolTokensData('profit', currentDaySwaps, tokens_data)
}
export function usePool30dProfitTokensAmount(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrent30Days(f.timestamp),
  )
  return usePoolTokensData('profit', currentDaySwaps, tokens_data)
}

export function usePool24hRevenueTokens(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrentDay(f.timestamp),
  )
  return usePoolTokensData('revenueUsd', currentDaySwaps, tokens_data)
}
export function usePool7dRevenueTokens(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinLast7Days(f.timestamp),
  )
  return usePoolTokensData('revenueUsd', currentDaySwaps, tokens_data)
}
export function usePool30dRevenueTokens(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrent30Days(f.timestamp),
  )
  return usePoolTokensData('revenueUsd', currentDaySwaps, tokens_data)
}

export function usePool24hRevenueTokensAmount(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrentDay(f.timestamp),
  )
  return usePoolTokensData('revenue', currentDaySwaps, tokens_data)
}
export function usePool7dRevenueTokensAmount(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinLast7Days(f.timestamp),
  )
  return usePoolTokensData('revenue', currentDaySwaps, tokens_data)
}
export function usePool30dRevenueTokensAmount(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrent30Days(f.timestamp),
  )
  return usePoolTokensData('revenue', currentDaySwaps, tokens_data)
}

export function usePool24hVolumeTokens(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrentDay(f.timestamp),
  )
  return usePoolTokensData('volumeUsd', currentDaySwaps, tokens_data)
}
export function usePool7dVolumeTokens(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinLast7Days(f.timestamp),
  )
  return usePoolTokensData('volumeUsd', currentDaySwaps, tokens_data)
}
export function usePool30dVolumeTokens(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrent30Days(f.timestamp),
  )
  return usePoolTokensData('volumeUsd', currentDaySwaps, tokens_data)
}

export function usePool24hVolumeTokensAmount(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrentDay(f.timestamp),
  )
  return usePoolTokensData('volume', currentDaySwaps, tokens_data)
}
export function usePool7dVolumeTokensAmount(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinLast7Days(f.timestamp),
  )
  return usePoolTokensData('volume', currentDaySwaps, tokens_data)
}
export function usePool30dVolumeTokensAmount(filtered, tokens_data) {
  let currentDaySwaps = filtered.filter((f) =>
    isTimestampWithinCurrent30Days(f.timestamp),
  )
  return usePoolTokensData('volume', currentDaySwaps, tokens_data)
}

/**
 * Get the 24h average gas fee.
 * @function use24hAvgGasFee
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  24h average gas fee.
 */
export function use24hAvgGasFee(filtered) {
  return useTimeRangeDataAvg(
    'gasFeeUsd',
    filtered,
    isTimestampWithinCurrentDay,
    isTimestampWithinPreviousDay,
    false,
  )
}

/**
 * Get the 7d average gas fee.
 * @function use7dAvgGasFee
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  7d average gas fee.
 */
export function use7dAvgGasFee(filtered) {
  return useTimeRangeDataAvg(
    'gasFeeUsd',
    filtered,
    isTimestampWithinLast7Days,
    isTimestampWithinPrevious7Days,
    false,
  )
}

/**
 * Get the 30d average gas fee.
 * @function use30dAvgGasFee
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  30d average gas fee.
 */
export function use30dAvgGasFee(filtered) {
  return useTimeRangeDataAvg(
    'gasFeeUsd',
    filtered,
    isTimestampWithinCurrent30Days,
    isTimestampWithinPrevious30Days,
    false,
  )
}

/**
 * Get the all-time average gas fee.
 * @function useAllTimeAvgGasFee
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {TimeRangeData}  all-time average gas fee.
 */
export function useAllTimeAvgGasFee(filtered) {
  return useTimeRangeDataAvg(
    'gasFeeUsd',
    filtered,
    () => true,
    () => false,
    false,
  )
}
/**
 * Get the aggregated fee for the last 24h.
 * @function usePool24hFee
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {FeeData}  aggregated fee for the last 24h.
 */
export function usePool24hFee(filtered) {
  return {
    value:
      usePool24hRevenue(filtered).rawValue -
      usePool24hProfit(filtered).rawValue,
  }
}

/**
 * Get the aggregated fee for the last 7d.
 * @function usePool7dFee
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {FeeData}  aggregated fee for the last 7d.
 */
export function usePool7dFee(filtered) {
  return {
    value:
      usePool7dRevenue(filtered).rawValue - usePool7dProfit(filtered).rawValue,
  }
}

/**
 * Get the aggregated fee for the last 30d.
 * @function usePool30dFee
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {FeeData}  aggregated fee for the last 30d.
 */
export function usePool30dFee(filtered) {
  return {
    value:
      usePool30dRevenue(filtered).rawValue -
      usePool30dProfit(filtered).rawValue,
  }
}

/**
 * Get the aggregated fee for all time.
 * @function usePoolAllTimeFee
 * @param {Swap[]} filtered - swaps to aggregate
 * @returns {FeeData}  aggregated fee for all time.
 */
export function usePoolAllTimeFee(filtered) {
  return {
    value:
      usePoolAllTimeRevenue(filtered).rawValue -
      usePoolAllTimeProfit(filtered).rawValue,
  }
}

/**
 * Get the count of trades for the last 24h.
 * @function usePool24hTrades
 * @param {Swap[]} filtered - swaps to count
 * @returns {TradeCountData}  count of trades for the last 24h.
 */
export function usePool24hTrades(filtered) {
  return {
    value: filtered.filter((f) => isTimestampWithinCurrentDay(f.timestamp))
      .length,
  }
}

/**
 * Get the count of trades for the last 7d.
 * @function usePool7dTrades
 * @param {Swap[]} filtered - swaps to count
 * @returns {TradeCountData}  count of trades for the last 7d.
 */
export function usePool7dTrades(filtered) {
  return {
    value: filtered.filter((f) => isTimestampWithinLast7Days(f.timestamp))
      .length,
  }
}

/**
 * Get the count of trades for the last 30d.
 * @function usePool30dTrades
 * @param {Swap[]} filtered - swaps to count
 * @returns {TradeCountData}  count of trades for the last 30d.
 */
export function usePool30dTrades(filtered) {
  return {
    value: filtered.filter((f) => isTimestampWithinCurrent30Days(f.timestamp))
      .length,
  }
}

/**
 * Get the count of all-time trades.
 * @function usePoolAllTimeTrades
 * @param {Swap[]} filtered - swaps to count
 * @returns {TradeCountData}  count of all-time trades.
 */
export function usePoolAllTimeTrades(filtered) {
  return { value: filtered.length }
}

/**
 * Check is item chain equals to selected chain
 * @function isRightChain
 * @param {{chain:string}} item - item to check
 * @param {string} chainSelected - selected chain in ui
 * @returns {boolean} is item chain equals to selected chain
 */
export function isRightChain(item, chainSelected) {
  return (
    (item.chain && chainSelected.toLowerCase() == item.chain.toLowerCase()) ||
    chainSelected.toLowerCase() == 'all chains'
  )
}

/**
 * Check is chain name equals to selected chain.
 * @function isRightChain
 * @param {string} chain - chain name to check
 * @param {string} chainSelected - selected chain in ui
 * @returns {boolean} is chain name equals to selected chain.
 */
export function isRightChainName(chain, chainSelected) {
  try {
    return (
      chain.toLowerCase() == chainSelected.toLowerCase() ||
      chainSelected.toLowerCase() == 'all chains'
    )
  } catch (e) {
    console.error(chain, chainSelected)
    return false
  }
}

/**
 * Get average profit for specified time range.
 * @function getAverageProfitPerTimeRange
 * @param {Swap[]} data - swaps to analyze
 * @param {string} chainSelected - selected chain in ui
 * @param {Date|number} date0 - time range start
 * @param {Date|number} date1 - time range end
 * @returns {number} - average profit for time range
 */
export function getAverageProfitPerTimeRange(
  data,
  chainSelected,
  date0,
  date1,
) {
  let [ts0, ts1] = [0, Date.now()]
  if (date0 && date1) {
    ;[ts0, ts1] = [
      new Date(date0).getTime() / 1000,
      new Date(date1).getTime() / 1000,
    ]
  }
  let filtered_data = data.filter(
    (d) =>
      d.timestamp > ts0 && d.timestamp < ts1 && isRightChain(d, chainSelected),
  )
  let profits = filtered_data.map((item) => item.profitUsd)
  return calculateAverage(profits)
}

/**
 * Calculate total and specific TVLs for the timestamp.
 * @function calculateTvl
 * @param {number} ts1 - timestamp up to which to calculate TVLs
 * @param {HistoricalTVL[]} historical_tvl - historical values of TVL
 * @param {string} chainSelected - selected chain in ui
 * @returns {Map<string, number>} TVL values for whole protocol (All) and for specific pools up to @see ts1
 */
function calculateTvl(ts1, historical_tvl, chainSelected) {
  historical_tvl.sort((a, b) => b.timestamp - a.timestamp)
  historical_tvl = historical_tvl.filter(
    (tvl) => tvl.timestamp <= ts1 && isRightChain(tvl, chainSelected),
  )
  let results = { All: 0 }
  for (let i = 0; i < historical_tvl.length; i++) {
    let id = historical_tvl[i].pool.id
    let liquidity = parseFloat(historical_tvl[i].totalLiquidity)
    if (!results[id]) {
      results[id] = liquidity
      results['All'] += liquidity
    }
  }
  return results
}

/**
 * Get average profit made by pools for specified time range.
 * @function getAveragePoolProfitPerTimeRange
 * @param {string} chainSelected - selected chain in ui
 *  * @param {HistoricalTVL[]} historical_tvl - historical values of TVL
 * @param {Date|number} date0 - time range start
 * @param {Date|number} date1 - time range end
 * @returns {number} - average profit made by pools for time range
 */
export function getAveragePoolProfitPerTimeRange(
  data,
  chainSelected,
  historical_tvl,
  date0,
  date1,
) {
  let [ts0, ts1] = [0, Date.now()]
  if (date0 && date1) {
    ;[ts0, ts1] = [
      new Date(date0).getTime() / 1000,
      new Date(date1).getTime() / 1000,
    ]
  }
  let filtered_data = data.filter(
    (d) =>
      d.timestamp > ts0 && d.timestamp < ts1 && isRightChain(d, chainSelected),
  )
  let pool_results = {}
  for (let i = 0; i < filtered_data.length; i++) {
    for (
      let k = 0;
      k < filtered_data[i]['swaps'][0]['poolIdVault'].length;
      k++
    ) {
      let poolId = filtered_data[i]['swaps'][0]['poolIdVault'][k]
      let profit = filtered_data[i]['swaps'][0]['profitUsd'][k]
      if (!pool_results[poolId]) {
        pool_results[poolId] = {
          trades: 1,
          profit: profit,
        }
      } else {
        pool_results[poolId].trades++
        pool_results[poolId].profit += profit
      }
    }
  }
  let profits = []
  let results = calculateTvl(ts1, historical_tvl, chainSelected)
  for (const [key, value] of Object.entries(pool_results)) {
    let profit = value['profit'] / value['trades']
    let weighted_profit = profit * (results[key] / results['All'])
    profits.push(weighted_profit)
  }
  return calculateAverage(profits)
}

/**
 * @typedef {import("@/composables/pools/useTokenPairs").TokenInfo} TokenInfo
 */

/**
 * @typedef {Object} AssetBreakdown
 * @property {number} trades
 * @property {number} invested
 * @property {number} percent
 * @property {string} symbol
 */

/**
 * Get top 10 assets by amount of trades.
 * @function getAssetsBreakdown
 * @param {Swap[]} data - swaps to analyze
 * @param {TokenInfo[]} tokensData - info about tokens used on that chain for arbitrage
 * @param {string} chainSelected - selected chain in the ui
 * @returns {AssetBreakdown[]} top 10 assets by amount of trades
 */
export function getAssetsBreakdown(
  data,
  tokensData,
  chainSelected,
  historicalPrices,
) {
  let results = [] // invested $, percent
  let filtered_data = tokensData.filter((item) =>
    isRightChainName(item.Blockchain, chainSelected),
  )
  for (let i = 0; i < filtered_data.length; i++) {
    let balance = filtered_data[i].totalBalanceNotional
      ? filtered_data[i].totalBalanceNotional
      : filtered_data[i].balance
    let hourly_prices = historicalPrices.find(
      (item) => item.symbol == filtered_data[i].symbol,
    )
    let price = CalculateTokenOrderPrice(
      hourly_prices.Hourly[hourly_prices.Hourly.length - 1],
    )
    results.push({
      symbol: filtered_data[i].symbol,
      invested: price * balance,
      percent: 0,
    })
  }
  let notAddedTokens = filtered_data.filter(
    (t) => !results.map((r) => r.symbol).includes(t.symbol),
  )
  let index = 0
  while (results.length < 10 && index < notAddedTokens.length) {
    results.push({
      symbol: notAddedTokens[index].symbol,
      trades: 0,
      percent: 0,
    })
    index++
  }
  let totalInvested = results.reduce((sum, val) => sum + val.invested, 0)
  for (let k = 0; k < results.length; k++) {
    results[k]['percent'] = results[k]['invested'] / (totalInvested / 100)
  }
  let top10 = getTop10Assets(results)
  return top10
}

/**
 * Get top 10 pairs by amount of trades.
 * @function getPairsBreakdown
 * @param {Swap[]} data - swaps to analyze
 * @param {TokenInfo[]} tokensData - info about tokens used on that chain for arbitrage
 * @param {string} chainSelected - selected chain in the ui
 * @returns {AssetBreakdown[]} top 10 pairs by amount of trades
 */
export function getPairsBreakdown(
  data,
  tokensData,
  pairsData,
  chainSelected,
  historicalPrices,
) {
  let results = [] // invested $, number of trades, percent
  let filtered_data = pairsData.filter((item) =>
    isRightChainName(item.Blockchain, chainSelected),
  )
  let total_tvl_used = []
  let total_tvl = 0
  for (let i = 0; i < filtered_data.length; i++) {
    let item = filtered_data[i]
    let [token0, token1] = item.id.split('-')
    let balance0 = item.balanceToken0
    let balance1 = item.balanceToken1
    let symbol0 = tokensData.find((t) => t.id == token0).symbol
    let symbol1 = tokensData.find((t) => t.id == token1).symbol
    let hourly_prices0 = historicalPrices.find((item) => item.symbol == symbol0)
    let price0 = CalculateTokenOrderPrice(
      hourly_prices0.Hourly[hourly_prices0.Hourly.length - 1],
    )
    let hourly_prices1 = historicalPrices.find((item) => item.symbol == symbol1)
    let price1 = CalculateTokenOrderPrice(
      hourly_prices1.Hourly[hourly_prices1.Hourly.length - 1],
    )
    if (!total_tvl_used.includes(symbol0)) {
      total_tvl += price0 * balance0
      total_tvl_used.push(symbol0)
    }
    if (!total_tvl_used.includes(symbol1)) {
      total_tvl += price1 * balance1
      total_tvl_used.push(symbol1)
    }
    results.push({
      symbol: `${symbol0}/${symbol1}`,
      invested: price0 * balance0 + price1 * balance1,
      percent: 0,
    })
  }
  for (let k = 0; k < results.length; k++) {
    results[k]['percent'] = results[k]['invested'] / (total_tvl / 100)
  }
  let top10 = getTop10Assets(results)
  return top10
}

/**
 * Sort top 10 assets by amount of trades.
 * @function getTop10Assets
 * @param {Swap[]} data - swaps to analyze
 * @returns {AssetBreakdown[]} top 10 assets by amount of trades
 */
function getTop10Assets(data) {
  data.sort((a, b) => b.invested - a.invested)

  let topN = 9
  // Take the first 9 objects
  const top9 = data.slice(0, topN)

  if (data.length <= topN) return data

  let sliced = data.slice(topN)
  const others = {
    symbol: 'Others',
    percent: sliced.reduce((acc, obj) => acc + obj.percent, 0),
    invested: sliced.reduce((acc, obj) => acc + obj.invested, 0),
  }

  // Calculate the percentage for the 'Others' object based on the 'trades' field
  const totalInvested = data.reduce((acc, obj) => acc + obj.invested, 0)
  others.percent = (others.invested / totalInvested) * 100

  // Create a new array with the top 9 and 'Others'
  let result = [...top9, others]
  return result
}

/**
 * @typedef {Object} TimeRangeRiskData
 * @property {number} daysDifference
 * @property {string} assets
 * @property {TrackingInfoChartItem[]} filtered_data
 */

/**
 * Get time range risk data (from calendar on Statistics Tab).
 * @function GetTimeRangeRiskData
 * @param {string} chainSelected - selected chain in the UI
 * @param {TrackingInfoChartItem[]} chart_data - chart data to take from info for volatility/sharpe/sortino
 * @param {TokenInfo[]} tokensData -  info about tokens used on that chain
 * @param {Date|number} date0 - time range start
 * @param {Date|number} date1 - time range end
 * @returns {TimeRangeRiskData} info about period duration in days, assets used on that exactly chain and selected chart data for that time range.
 */
export function GetTimeRangeRiskData(
  chainSelected,
  chart_data,
  tokensData,
  date0,
  date1,
) {
  let [ts0, ts1] = [chart_data[0].timestamp, Date.now()]
  if (date0 && date1) {
    ;[ts0, ts1] = [new Date(date0).getTime(), new Date(date1).getTime()]
  }
  if (ts0 < chart_data[0].timestamp) {
    ts0 = chart_data[0].timestamp
  }
  const _date0 = new Date(ts0)
  const _date1 = new Date(ts1)

  // Calculate the difference in days
  const timeDifference = Math.abs(_date1 - _date0) // Difference in milliseconds
  const daysDifference = parseInt(timeDifference / (1000 * 60 * 60 * 24)) // Convert to days

  let filtered_data = chart_data.filter(
    (item) => item.timestamp >= ts0 && item.timestamp < ts1,
  )

  let assets = Array.from(
    new Set(
      tokensData
        .filter((t) => isRightChainName(t.Blockchain, chainSelected))
        .map((t) => t.symbol),
    ),
  )
  return {
    daysDifference,
    assets,
    filtered_data,
  }
}

/**
 * @typedef {import('@/composables/balances/useHistoricalTokenPrices').HistoricalPriceInfo} HistoricalPriceInfo
 */

/**
 * Get volatility index for specified time range.
 * @function getVolatilityIndexPerTimeRange
 * @param {string} chainSelected - selected chain in the UI
 * @param {TrackingInfoChartItem[]} chart_data - chart data to take from info for volatility
 * @param {HistoricalPriceInfo[]} historicalPrices - historical prices of the tokens
 * @param {TokenInfo[]} tokensData -  info about tokens used on that chain
 * @param {Date|number} date0 - time range start
 * @param {Date|number} date1 - time range end
 * @param {boolean} sortino - is that volatility index for sortino or not
 * @param {number} timestamp - timestamp for treasury bond search.
 * @param {string} riskFreeOption - bonds/dai
 * @returns {number} volatilty index for that time range
 */
export function getVolatilityIndexPerTimeRange(
  chainSelected,
  chart_data,
  historicalPrices,
  tokensData,
  date0,
  date1,
  sortino = false,
  timestamp = null,
  riskFreeOption = 'bonds',
) {
  let { daysDifference, filtered_data, assets } = GetTimeRangeRiskData(
    chainSelected,
    chart_data,
    tokensData,
    date0,
    date1,
  )
  let volatility_index = CalculateVolatilityIndex(
    chainSelected,
    filtered_data,
    historicalPrices,
    daysDifference,
    assets,
    sortino,
    timestamp,
    riskFreeOption,
  )
  return volatility_index
}

/**
 * Get sharpe ratio for specified time range
 * @param {TrackingInfoChartItem[]} chart_data -  chart data to take from info for volatility and sharpe
 * @param {HistoricalPriceInfo[]} historicalPrices - historical prices of the tokens
 * @param {TokenInfo[]} tokensData -  info about tokens used on that chain
 * @param {string} chainSelected - selected chain in the UI
 * @param {Date|number} date0 - time range start
 * @param {Date|number} date1 - time range end
 * @param {string} riskFreeOption - bonds/dai
 * @returns {number} sharpe ratio for that time range
 */
export function getSharpeRatioPerTimeRange(
  chart_data,
  historicalPrices,
  tokensData,
  chainSelected,
  date0,
  date1,
  riskFreeOption = 'bonds',
) {
  let { daysDifference, filtered_data, assets } = GetTimeRangeRiskData(
    chainSelected,
    chart_data,
    tokensData,
    date0,
    date1,
  )
  if (filtered_data.length == 0) return 0
  let last_ts = filtered_data[filtered_data.length - 1].timestamp
  let volatility_index = CalculateVolatilityIndex(
    chainSelected,
    filtered_data,
    historicalPrices,
    daysDifference,
    assets,
    false,
    null,
    riskFreeOption,
  )
  let profitItem = sumFields(filtered_data, ['Profits'])
  let avg_apr = CalculateAvgApr(
    profitItem,
    filtered_data,
    daysDifference,
    chainSelected,
  )
  return CalculateSharpeRatio(
    chainSelected,
    filtered_data,
    historicalPrices,
    daysDifference,
    assets,
    avg_apr,
    last_ts,
    volatility_index,
    riskFreeOption,
  )
}

/**
 * Get sortino ratio for specified time range
 * @param {TrackingInfoChartItem[]} chart_data -  chart data to take from info for volatility and sortino
 * @param {HistoricalPriceInfo[]} historicalPrices - historical prices of the tokens
 * @param {TokenInfo[]} tokensData -  info about tokens used on that chain
 * @param {string} chainSelected - selected chain in the UI
 * @param {Date|number} date0 - time range start
 * @param {Date|number} date1 - time range end
 * @param {string} riskFreeOption - bonds/dai
 * @returns {number} sortino ratio for that time range
 */
export function getSortinoRatioPerTimeRange(
  chart_data,
  historicalPrices,
  tokensData,
  chainSelected,
  date0,
  date1,
  riskFreeOption = 'bonds',
) {
  let { daysDifference, filtered_data, assets } = GetTimeRangeRiskData(
    chainSelected,
    chart_data,
    tokensData,
    date0,
    date1,
  )
  if (filtered_data.length == 0) return 0
  let last_ts = filtered_data[filtered_data.length - 1].timestamp
  let volatility_index = CalculateVolatilityIndex(
    chainSelected,
    filtered_data,
    historicalPrices,
    daysDifference,
    assets,
    true,
    last_ts,
    riskFreeOption,
  )
  let profitItem = sumFields(filtered_data, ['Profits'])
  let avg_apr = CalculateAvgApr(
    profitItem,
    filtered_data,
    daysDifference,
    chainSelected,
  )
  return CalculateSortinoRatio(
    chainSelected,
    filtered_data,
    historicalPrices,
    daysDifference,
    assets,
    avg_apr,
    last_ts,
    volatility_index,
    riskFreeOption,
  )
}

/**
 * @typedef {Object} Profit24HInfo
 * @property {number} highest
 * @property {number} highestPercent
 * @property {string} highestTime
 * @property {string} highestTimeAgo
 * @property {number} lowest
 * @property {number} lowestPercent
 * @property {string} lowestTime
 * @property {string} lowestTimeAgo
 */

/**
 * Get profits info for specific pool (highest/lowest profit per day).
 * @function GetPool24hProfit
 * @param {Swap[]} poolSwapsData - swaps of specific pool
 * @returns {Profit24HInfo} info about highest/lowest profits day for pool.
 */
export function GetPool24hProfit(poolSwapsData) {
  let result = {
    highest: 0,
    highestPercent: 0,
    highestTime: formatDateFromTimestamp(new Date() / 1000),
    highestTimeAgo: generateTimeAgoString(new Date() / 1000),
    lowest: 0,
    lowestPercent: 0,
    lowestTime: formatDateFromTimestamp(new Date() / 1000),
    lowestTimeAgo: generateTimeAgoString(new Date() / 1000),
  }
  let today_swaps = poolSwapsData.filter((item) =>
    isTimestampWithinCurrentDay(item.timestamp),
  )
  let today_profit = today_swaps.reduce(
    (sum, value) => sum + parseFloat(value.profitUsd),
    0,
  )
  let sorted = [...poolSwapsData].sort((a, b) => a.timestamp - b.timestamp)
  let profits = []
  for (let k = 0; k < sorted.length; k++) {
    let item = sorted[k]
    let date = formatSimpleTimestamp(item.timestamp)
    let found = profits.find((item) => item.date == date)
    if (!found) {
      found = { date, profits: 0, timestamp: item.timestamp }
      profits.push(found)
    }
    found.profits += parseFloat(item.profitUsd)
  }
  let profitsSorted = profits.sort((a, b) => b.profits - a.profits)

  if (profitsSorted.length > 0) {
    let highest = profitsSorted[0]
    result.highest = highest.profits
    result.highestPercent = calculatePercentageDifference(
      highest.profits,
      today_profit,
    )
    result.highestTime = formatDateFromTimestamp(highest.timestamp)
    result.highestTimeAgo = generateTimeAgoString(highest.timestamp)
    let lowest = profitsSorted[profitsSorted.length - 1]
    result.lowest = lowest.profits
    result.highestPercent = calculatePercentageDifference(
      lowest.profits,
      today_profit,
    )
    result.highestTime = formatDateFromTimestamp(lowest.timestamp)
    result.highestTimeAgo = generateTimeAgoString(lowest.timestamp)
  }

  return result
}

export function convertSwapsCurrency(swaps, currency_prices, selectedCode) {
  let _swaps = [...swaps.map((s) => ({ ...s }))]
  for (let i = 0; i < _swaps.length; i++) {
    for (const [key, value] of Object.entries(_swaps[i])) {
      if (key.toLowerCase().includes('usd')) {
        _swaps[i][key] = convertUsdToCurrencySymbol(
          value,
          currency_prices,
          selectedCode,
        )
      }
    }
    for (let k = 0; k < _swaps[i].swaps[0].length; k++) {
      for (const [key, value] of Object.entries(_swaps[i].swaps[k])) {
        if (key.toLowerCase().includes('usd')) {
          _swaps[i].swaps[k][key] = [
            convertUsdToCurrencySymbol(value[0], currency_prices, selectedCode),
          ]
        }
      }
    }
  }
  return _swaps
}

export function convertUsdToCurrencySymbol(
  value,
  currency_prices,
  selectedCode,
) {
  if (selectedCode == 'USD') {
    return value
  }
  let result = value / currency_prices[selectedCode]
  return result
}
