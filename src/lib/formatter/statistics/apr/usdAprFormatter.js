import { FormatAave } from '@/composables/platforms/useAaveAprs'
import { FormatCompound } from '@/composables/platforms/useCompoundAprs'
import { FormatYearn } from '@/composables/platforms/useYearnAprs'

const STABLES = ['DAI', 'USDT', 'USDC']

/**
 *
 * @typedef {import('@/lib/formatter/statistics/apr/statisticsAprFormatter').MarketsInfo} MarketsInfo
 */

/**
 * Get APR for USD stablecoins on AAVE/COMPOUND/YEARN platforms.
 * @param {MarketsInfo} market_data - APRs info for different platforms.
 * @returns {number} Average APR USD stablecoins.
 */
export function FormatUsdApr(market_data) {
  let aave_info = FormatAave(market_data['aave'], STABLES)
  let compound_info = FormatCompound(market_data['compound'], STABLES)
  let yearn_info = FormatYearn(market_data['yearn'], STABLES)
  let sum = 0
  for (let i = 0; i < STABLES.length; i++) {
    let stable = STABLES[i]
    let stabled_sum =
      aave_info[stable] + compound_info[stable] + yearn_info[stable]
    let avg_stable = stabled_sum / 3
    sum += avg_stable
  }
  let usd_avg_apr = sum / STABLES.length
  return usd_avg_apr
}
