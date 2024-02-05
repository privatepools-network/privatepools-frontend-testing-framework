import { DisplayNetwork } from '@/composables/useNetwork'
import { formatSimpleTimestamp } from '../utils'

/**
 * @typedef {import('@/lib/formatter/tokenSnapshotsFormatter').ChartAssets} ChartAssets
 * @typedef {import('@/lib/formatter/poolTvlFormatter').TVLInfo} TVLInfo
 */

/**
 * @typedef {{
 *   Date: Date,
 *   Profits: number,
 *   Revenue: number,
 *   'Gas Fees': number,
 *   Volume: number,
 *   Trades: number,
 *   Assets: ChartAssets,
 *   Blockchain: string,
 *   timestamp: number,
 *   TVL: TVLInfo,
 * }} TrackingInfoChartItem
 */

/**
 * Format chart items values to display them on chart.
 * @function FormatTrackingInfoChart
 * @param {import('./poolsFormatter').Swap[]} poolSwapsData - swaps data to analze
 * @param {number} network - network ID of the network where the data is to be found
 * @returns {TrackingInfoChartItem[]} formatted data with trades info for chart.
 */
export function FormatTrackingInfoChart(poolSwapsData, network) {
  let result = []
  if (!poolSwapsData) return []
  for (let i = 0; i < poolSwapsData.length; i++) {
    result.push({
      Date: formatSimpleTimestamp(poolSwapsData[i].timestamp),
      Profits: parseFloat(poolSwapsData[i].profitUsd),
      Revenue: parseFloat(poolSwapsData[i].revenueUsd),
      'Gas Fees': parseFloat(poolSwapsData[i].gasFeeUsd),
      Volume: parseFloat(poolSwapsData[i].volumeUsd),
      Trades: 1,
      Assets: {},
      Blockchain: DisplayNetwork[network],
      timestamp: parseFloat(poolSwapsData[i].timestamp) * 1000,
    })
  }
  return result
}

export function FormatTrackingInfoChartWTokens(poolSwapsData, network, tokens) {
  let result = []
  if (!poolSwapsData) return []
  for (let i = 0; i < poolSwapsData.length; i++) {
    let found_token = tokens.find(
      (t) => poolSwapsData[i].token.toLowerCase() == t.address,
    ).symbol
    let otherTokens = tokens
      .map((t) => t.symbol)
      .filter((t) => t != found_token)
    let tokenProfits = {  }
    tokenProfits[found_token] = parseFloat(poolSwapsData[i].profit)
    for (let k = 0; k < otherTokens.length; k++) {
      tokenProfits[otherTokens[k]] = 0
    }
    result.push({
      Date: formatSimpleTimestamp(poolSwapsData[i].timestamp),
      Profits: parseFloat(poolSwapsData[i].profitUsd),
      Revenue: parseFloat(poolSwapsData[i].revenueUsd),
      'Gas Fees': parseFloat(poolSwapsData[i].gasFeeUsd),
      Volume: parseFloat(poolSwapsData[i].volumeUsd),
      'Token Profits': tokenProfits,
      Trades: 1,
      Assets: {},
      Blockchain: DisplayNetwork[network],
      timestamp: parseFloat(poolSwapsData[i].timestamp) * 1000,
    })
  }
  return result
}
