import {
  CalculateRoi,
  CalculateTokenOrderPrice,
} from '@/composables/math/chartMath/trackingInfoMath'
import { GetPeriodTimestamp, PERIODS } from '../statisticsPeriods'
import { sumFields } from '@/lib/utils'

/**
 * @typedef {import ("./cryptocompare").HistoricalPriceInfo} HistoricalPriceInfo
 */

/**
 * Get ROI for specific token for the periods ('24H', '7D', '1M', '3M', '1Y')
 * @function FormatTokenRoi
 * @param {HistoricalPriceInfo} token_historical_info - historical prices of the token
 * @returns {Map<string,number>} mapping with roi percent info for each period.
 */
export function FormatTokenRoi(token_historical_info) {
  let result = []
  token_historical_info = token_historical_info.Daily
  token_historical_info.sort((a, b) => a.time - b.time)
  let current_price = CalculateTokenOrderPrice(
    token_historical_info[token_historical_info.length - 1],
  )

  for (let i = 0; i < PERIODS.length; i++) {
    let period = PERIODS[i]
    if (period == 'total') continue
    let timestamp = GetPeriodTimestamp(period)
    let first_period_price_index = token_historical_info.findLastIndex(
      (token_info) => token_info.time < timestamp,
    )
    let first_period_price = CalculateTokenOrderPrice(
      token_historical_info[first_period_price_index],
    )
    result[period] = CalculateRoi(first_period_price, current_price)
  }
  return result
}

/**
 * Get ROI for top 10 tokens by market cap
 * @function GetTop10TokensRoi
 * @param {HistoricalPriceInfo[]} tokens_historical_info - historical prices of the @see top10Tokens
 * @param {string[]} top10Tokens - symbols of top10 tokens by market cap
 * @returns {number} - average ROI for top 10 tokens.
 */
export function GetTop10TokensRoi(tokens_historical_info, top10Tokens) {
  let top10_token_rois = []
  for (let i = 0; i < top10Tokens.length; i++) {
    let token = top10Tokens[i]
    let token_historical_info = tokens_historical_info.filter(
      (token_info) => token == token_info.symbol,
    )[0]
    let roi_info = FormatTokenRoi(token_historical_info)
    top10_token_rois.push(roi_info)
  }
  let summarizedInfo = sumFields(top10_token_rois, PERIODS)
  let avg_roi = {}
  for (const [key, value] of Object.entries(summarizedInfo)) {
    avg_roi[key] = value / 10
  }
  return avg_roi
}
