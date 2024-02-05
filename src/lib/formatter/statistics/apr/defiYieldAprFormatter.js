import { calculateAverage } from '@/lib/utils'

/**
 *
 * @typedef {import('@/lib/formatter/statistics/apr/statisticsAprFormatter').MarketsInfo} MarketsInfo
 */

/**
 * Get average APR for top tokens.
 * @param {MarketsInfo} market_data - APRs info for different platforms.
 * @returns {number} Average APR for top tokens.
 */
export function FormatDefiYieldApr(market_data) {
  let apr = 0
  let celsius = market_data['celsius']
  if (celsius && celsius.interestRates) {
    let interestRates = celsius.interestRates
    let avg_rate = calculateAverage(
      interestRates.map((item) => parseFloat(item.rate)),
    )
    apr = avg_rate * 100
  }
  return apr
}
