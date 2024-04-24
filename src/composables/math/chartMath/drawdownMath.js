import { formatBigNumber, timestampToSimpleDate } from '@/lib/utils'

/**
 * Represents detailed information about key metrics related to drawdown analysis.
 * @typedef {Object} DrawdownMetrics
 * @property {string} text - Label describing the drawdown metric.
 * @property {string} value - Value associated with the drawdown metric.
 */

/**
 * Represents an array of detailed drawdown metrics.
 * @typedef {DrawdownMetrics[]} DrawdownMetricsArray
 */

/**
 * Calculate drawdown metrics from the chart data.
 * @function AnalyzeDrawdowns
 * @param {import('./trackingInfoMath').TrackingInfoChartItem[]} chart_data - full chart data
 * @param {string} chainSelected - chain selected in the ui
 * @param {Date|number|null} date0 - time range start
 * @param {Date|number|null} date1 - time range end
 * @returns {DrawdownMetrics} - drawdown metrics
 */
export function AnalyzeDrawdowns(chart_data, chainSelected, date0, date1, symbol) {
  let [ts0, ts1] = [0, Date.now()]
  if (date0 && date1) {
    ;[ts0, ts1] = [new Date(date0).getTime(), new Date(date1).getTime()]
  }
  let allTvlProfitsSum = chart_data.map((item) => ({
    timestamp: item.timestamp,
    value: parseFloat(item.TVL[chainSelected]) + parseFloat(item.Profits),
  }))
  let filtered_chart_data = allTvlProfitsSum.filter(
    (item) => item.timestamp > ts0 && item.timestamp < ts1,
  )
  let tvlProfitSums = filtered_chart_data
  let sorted = [...tvlProfitSums].sort((a, b) => b.value - a.value)
  let peakIndex = tvlProfitSums.findIndex(
    (item) => item.timestamp == sorted[0].timestamp,
  )
  let peak = tvlProfitSums[peakIndex]
  peak = peak ? peak : { value: 0, timestamp: 0 }
  let afterPeakValues = tvlProfitSums
    .slice(peakIndex + 1, tvlProfitSums.length)
    .sort((a, b) => a.value - b.value)

  let afterPeakAllValues = allTvlProfitsSum.filter(
    (item) => item.timestamp > peak.timestamp,
  )
  let troughIndex = tvlProfitSums.findIndex(
    (item) => item.timestamp == (afterPeakValues.length > 0 ? afterPeakValues[0].timestamp : 0),
  )

  let trough = tvlProfitSums[troughIndex]
  trough = trough ? trough : { value: 0, timestamp: 0 }
  let recoveryPick = afterPeakAllValues.find((item) => item.value >= peak.value)
  let maximum_drawdown = peak.value - trough.value
  return [
    {
      text: 'Maximum drawdown',
      value: `${symbol}${formatBigNumber(maximum_drawdown)}`,
    },
    {
      text: 'Duration',
      value: `${Math.floor(
        (trough.timestamp - peak.timestamp) / (1000 * 60 * 60 * 24),
      )} days`,
    },
    {
      text: 'Recovery Period',
      value: recoveryPick
        ? `${timestampToSimpleDate(trough.timestamp)} - ${timestampToSimpleDate(
            recoveryPick.timestamp,
          )}`
        : 'backing not reach yet',
    },
    {
      text: 'Capital Loss',
      value: `${symbol}${formatBigNumber(maximum_drawdown)}`,
    },
    {
      text: 'Percentual Impact',
      value: `${formatBigNumber((maximum_drawdown / peak.value) * 100, 2)}%`,
    },
  ]
}
