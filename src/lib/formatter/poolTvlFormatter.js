import { calculatePercentageDifference } from '../utils'
import { formatSimpleTimestamp } from '../utils'

/**
 * @typedef {import('@/composables/pools/charts/usePoolHistoricValues').LiquiditySnapshot} LiquiditySnapshot
 * @typedef {import('@/composables/pools/snapshots/usePoolHistoricalTvl').HistoricalTVL} HistoricalTVL
 */

/**
 * @typedef {{tvl:number, percentChange:number}} TVLChange
 */

/**
 * @typedef {{
 * 'All Chains':number
 * Arbitrum: number
 * Binance:number
 * Polygon:number
 * timestamp:number
 * Date:string
 * }}TVLInfo
 */

/**
 * Get current tvl and its change comparing with previous tvl value.
 * @function FormatPoolTVL
 * @param {LiquiditySnapshot[]} liquiditySnapshots - historical snapshots of liquidities
 * @returns {TVLChange} returns current tvl value and its percentage change.
 */
export function FormatPoolTVL(liquiditySnapshots) {
  let sorted = liquiditySnapshots.sort((a, b) => a.timestamp - b.timestamp)

  let currentTvl = 0

  if (sorted.length > 0) {
    currentTvl = sorted[sorted.length - 1]['poolLiquidityUSD']
  }
  let previousTvl = 0
  if (sorted.length > 1) {
    previousTvl = sorted[sorted.length - 2]['poolLiquidityUSD']
  }
  let percentChange = calculatePercentageDifference(previousTvl, currentTvl)
  if (isNaN(percentChange)) percentChange = 0
  return {
    tvl: parseFloat(currentTvl).toFixed(2),
    percentChange: parseFloat(percentChange).toFixed(2),
  }
}

/**
 * Convert date string to timestamp
 * @param {string} dateStr - string in format m/d/y
 * @returns {number} (ms) timestamp of this date string
 */
//eslint-disable-next-line
function GetDateFromFormatted(dateStr) {
  const [month, day, year] = dateStr.split('/').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getTime()
}

/**
 * Get historical TVLs values for all chains.
 * @function FormatHistoricalTvl
 * @param {HistoricalTVL[]} historicalTvl - historical TVLs
 * @returns {TVLInfo} formatted tvl info results for all chains.
 */
export function FormatHistoricalTvl(historicalTvls) {
  let result = []
  historicalTvls = historicalTvls.sort((a,b) => b.timestamp - a.timestamp)
  let unique_pools = Array.from(new Set(historicalTvls.map((t) => t.pool.id)))
  for (let i = 0; i < historicalTvls.length; i++) {
    let tvl = {
      Arbitrum: 0,
      Binance: 0,
      Polygon: 0,
      'All Chains': 0,
      Date: formatSimpleTimestamp(historicalTvls[i].timestamp),
      timestamp: historicalTvls[i].timestamp * 1000,
    }
    for (let k = 0; k < unique_pools.length; k++) {
      let pool = unique_pools[k]
      let found = historicalTvls.find((t) =>t.timestamp * 1000 <= tvl.timestamp  && t.pool.id == pool)
      if (found) {
        tvl[found.Blockchain] += parseFloat(found.totalLiquidity)
        tvl['All Chains'] += parseFloat(found.totalLiquidity)
      }
    }
    result.push(tvl)
  }
  // let timestamps = _timestamps.map((t) => formatSimpleTimestamp(t))
  // for (let i = 0; i < timestamps.length; i++) {
  //   let historical_values = historicalTvls
  //     .filter(
  //       (h) =>
  //         formatSimpleTimestamp(h.timestamp) == timestamps[i] ||
  //         h.timestamp < GetDateFromFormatted(timestamps[i]) / 1000,
  //     )
  //     .filter((v, i, a) => a.findIndex((v2) => v2.pool.id === v.pool.id) === i)
  //   result.push({
  //     Date: timestamps[i],
  //     timestamp: GetDateFromFormatted(timestamps[i]),
  //     Arbitrum: 0,
  //     Binance: 0,
  //     Polygon: 0,
  //     'All Chains': 0,
  //   })
  //   for (let k = 0; k < historical_values.length; k++) {
  //     let tvl = parseFloat(historical_values[k].totalLiquidity)
  //     result[result.length - 1][historical_values[k].Blockchain] += tvl
  //     result[result.length - 1]['All Chains'] += tvl
  //     result[result.length - 1]['poolId'] = historical_values[k].pool.id
  //   }
  // }
  return result
}
