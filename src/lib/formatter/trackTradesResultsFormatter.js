import { DisplayNetwork } from '@/composables/useNetwork'
import { formatSimpleTimestamp } from '../utils'

/**
 * Represents detailed information about a specific data entry.
 * @typedef {Object} FormattedTrackTrade
 * @property {string} Date - Formatted date timestamp.
 * @property {number} timestamp - Timestamp in milliseconds.
 * @property {string} Blockchain - Displayed network name.
 * @property {number} GasFees - Gas fees in USD.
 * @property {number} NumberOfTrades - Number of trades.
 * @property {number} Profit - Profit in USD.
 * @property {number} TVL - Total Value Locked in USD.
 */

/**
 * Format track trades results.
 * @function FormatTrackTradesResults
 * @param {import('@/composables/pools/usePoolSwapsStats').Swap[]} data - arbitrage trades
 * @param {number} network - chain id
 * @returns {FormattedTrackTrade[]} - formatted trades for track trades page
 */
export function FormatTrackTradesResults(data, network) {
  let result = [] //Date, timestamp, Gas Fees, Number of Trades, Blockchain

  for (let i = 0; i < data.length; i++) {
    result.push({
      Date: formatSimpleTimestamp(data[i].timestamp),
      timestamp: parseFloat(data[i].timestamp) * 1000,
      Blockchain: DisplayNetwork[network],
      'Gas Fees': data[i].gasFeeUsd,
      'Number of Trades': 1,
      Profit: data[i].profitUsd,
      TVL: data[i].volumeUsd,
    })
  }

  return result
}
