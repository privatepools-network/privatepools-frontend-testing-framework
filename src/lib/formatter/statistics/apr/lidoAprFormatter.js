/**
 *
 * @typedef {import('@/lib/formatter/statistics/apr/statisticsAprFormatter').MarketsInfo} MarketsInfo
 */

/**
 * Get APR stETH on LIDO platform
 * @param {MarketsInfo} market_data - APRs info for different platforms.
 * @returns {number} APR for stETH.
 */
export function FormatLidoApr(market_data) {
  return market_data['lido'].data.apr
}
