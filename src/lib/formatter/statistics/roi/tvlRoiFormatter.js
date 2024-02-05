import { CalculateRoi } from '@/composables/math/chartMath/trackingInfoMath'
import { GetPeriodTimestamp, PERIODS } from '../statisticsPeriods'

/**
 * @typedef {import('@/composables/pools/snapshots/usePoolHistoricalTvl').HistoricalTVL} HistoricalTVL
 */

/**
 * Get darkpools protocol ROI for the periods ('24H', '7D', '1M', '3M', '1Y')
 * @function FormatTvlRoi
 * @param {HistoricalTVL} historical_tvl - historical TVLs of darkpool's pools
 * @returns {Map<string,number>}  mapping with roi percent info for each period.
 */
export function FormatTvlRoi(chartData, chainSelected) {
  let result = {}
  let chart_data = [...chartData].sort((a, b) => a.timestamp - b.timestamp)
  let current_tvl = chart_data[chart_data.length - 1].TVL[chainSelected]
  let current_profit = chart_data.reduce((sum, value) => sum + value.Profits, 0)
  for (let i = 0; i < PERIODS.length; i++) {
    let period = PERIODS[i]
    let timestamp = GetPeriodTimestamp(period) * 1000
    let lastIndex = chart_data.findLastIndex(
      (item) => item.timestamp < timestamp,
    )
    let first_profit = 0
    let first_period_tvl = 0
    if (lastIndex != -1) {
      let previousItems = chart_data.slice(0, lastIndex)
      first_profit = previousItems.reduce(
        (sum, value) => sum + value.Profits,
        0,
      )
      first_period_tvl = chart_data[lastIndex]
    } else {
      first_period_tvl = chart_data.find((item) => item.TVL[chainSelected] > 0)
    }
    first_period_tvl = first_period_tvl.TVL[chainSelected]
    result[period] = CalculateRoi(
      first_period_tvl + first_profit,
      current_tvl + current_profit,
    )
  }
  return result
}
