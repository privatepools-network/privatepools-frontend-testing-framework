import { formatSimpleTimestamp } from '@/lib/utils'

/**
 * @typedef {import('@/lib/formatter/trackingInfoChartFormatter').TrackingInfoChartItem} TrackingInfoChartItem
 */

/**
 * Add empty days in between for tracking info chart
 * @function addEmptyDays
 * @param {TrackingInfoChartItem[]} chart_data - chart data from tracking info page
 * @returns {TrackingInfoChartItem[]} chart data with added data for missing days in between
 */
export function addEmptyDays(chart_data) {
  let ts = chart_data[0].timestamp
  let last_ts = Date.now()
  let last_index = 1
  let dates = chart_data.map((item) => item.Date)
  let tokens = Object.keys(chart_data[0].Assets)
  let empty_token_profits = {}
  for (let i = 0; i < tokens.length; i++) {
    empty_token_profits[tokens[i]] = 0
  }
  while (ts < last_ts) {
    let date = formatSimpleTimestamp(ts / 1000)
    let found_index = dates.lastIndexOf(date)
    if (found_index == -1) {
      chart_data.splice(last_index, 0, {
        Date: date,
        Blockchain: '',
        timestamp: ts,
        Profits: 0,
        Revenue: 0,
        'Token Profits': {...empty_token_profits},
        Assets: { ...chart_data[last_index - 1].Assets },
        'Gas Fees': 0,
        Volume: 0,
        Trades: 0,
        TVL: { ...chart_data[last_index - 1].TVL },
      })
      dates.splice(last_index, 0, date)
      last_index++
    } else {
      last_index = found_index + 1
    }
    ts += 86400000
  }
  return chart_data
}
