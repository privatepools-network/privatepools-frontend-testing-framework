import {
  GetCachedTreasuryYields,
  InitTreasuryYields,
} from '@/composables/api/useTreasuryYields'
import { GetPeriodTimestamp, PERIODS } from '../statisticsPeriods'
import { calculateAverage } from '@/lib/utils'

/**
 * Get usd ROI info from US treasuries for the periods ('24H', '7D', '1M', '3M', '1Y')
 * @function FormatUsdRoi
 * @returns {Promise<Map<string,number>>} mapping with roi percent info for each period.
 */
export async function FormatUsdRoi() {
  let treasury = GetCachedTreasuryYields()
  if (treasury.length == 0) {
    treasury = await InitTreasuryYields()
  }
  treasury = treasury.map((t) => ({
    ...t,
    timestamp: Date.parse(t.record_date) / 1000,
  }))
  treasury.sort((a, b) => a.timestamp - b.timestamp)
  let result = []
  //let current_price = treasury[treasury.length - 1].avg_interest_rate_amt
  for (let i = 0; i < PERIODS.length; i++) {
    let period = PERIODS[i]
    let timestamp = GetPeriodTimestamp(period)
    let rois = treasury
      .filter((token_info) => token_info.timestamp > timestamp)
      .map((item) => parseFloat(item.avg_interest_rate_amt))
    if (rois.length == 0)
      rois = [treasury[treasury.length - 1]].map((item) =>
        parseFloat(item.avg_interest_rate_amt),
      )
    result[period] = rois.length > 0 ? calculateAverage(rois) : 0
  }
  return result
}
