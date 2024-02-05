import {
  GetTimeRangeRiskData,
  isRightChainName,
} from '@/composables/pools/usePoolSwapsStats'
import { GetPeriodTimestamp, PERIODS } from '../statisticsPeriods'
import { FormatUsdApr } from './usdAprFormatter'
import { FormatLidoApr } from './lidoAprFormatter'
import { FormatBtcApr } from './btcAprFormatter'
import { FormatDefiYieldApr } from './defiYieldAprFormatter'
import { sumFields } from '@/lib/utils'
import { CalculateAvgApr } from '@/composables/math/chartMath/trackingInfoMath'

/**
 * @typedef {import('@/composables/platforms/useCelsiusAprs').InterestRatesData} CelsiusAPRs
 * @typedef {import('@/composables/platforms/useCompoundAprs').APRs} CompoundAPRs
 * @typedef {import('@/composables/platforms/useAaveAprs').APRs} AaveAPRs
 * @typedef {import('@/composables/platforms/useYearnAprs').APRs} YearAPRs
 * @typedef {import('../statisticsPeriods').StatisticsResult} StatisticsResult
 * @typedef {import('@/lib/formatter/trackingInfoChartFormatter').TrackingInfoChartItem} TrackingInfoChartItem
 *
 * @typedef {import("@/composables/pools/useTokenPairs").TokenInfo} TokenInfo
 * @typedef {Object} MarketsInfo
 * @property {AaveAPRs} aave - info for aave platform
 * @property {CelsiusAPRs} celsius - info for celsius platform
 * @property {CompoundAPRs} compound - info for compound platform
 * @property {YearAPRs} yearn - info for yearn platform
 *
 *
 */

/**
 * Calculate APR for darkpools protocol vs other popular protocols.
 * @param {MarketsInfo} markets_info - APRs info for different platforms.
 * @param {TrackingInfoChartItem[]} chart_data -  - chart data with information needed to calculate APR
 * @param {TokenInfo[]} tokensData - info about tokens used on the chain
 * @param {string} chainSelected - selected chain in UI.
 * @returns {StatisticsResult[]} comparison of APRs for different platforms and ours.
 */
export function FormatAprStatistics(
  markets_info,
  chart_data,
  tokensData,
  chainSelected,
) {
  if (chart_data.length == 0) return null
  let result = []
  console.log(markets_info, chart_data, tokensData, chainSelected)
  let usd_apr = FormatUsdApr(markets_info)
  let lido_apr = FormatLidoApr(markets_info)
  let btc_apr = FormatBtcApr(markets_info)
  let defi_yield_apr = FormatDefiYieldApr(markets_info)
  for (let i = 0; i < PERIODS.length; i++) {
    let period = PERIODS[i]
    if(period == "total")
  continue
    let avg_apr = GetAvgAprForPeriod(
      chart_data,
      tokensData,
      chainSelected,
      period,
    )

    result.push({
      Period: period,
      APR: avg_apr,
      'VS USD': avg_apr - usd_apr,
      'VS LIDO': avg_apr - lido_apr,
      'VS BTC': avg_apr - btc_apr,
      'VS Defi Yield': avg_apr - defi_yield_apr,
    })
  }
  return result
}

/**
 * Get average APR of our plaform for time period.
 * @function GetAvgAprForPeriod
 * @param {TrackingInfoChartItem[]} chart_data - chart data with information needed to calculate APR
 * @param {TokenInfo[]} tokensData -  info about tokens used on the chain
 * @param {string} chainSelected - selected chain in UI
 * @param {string} period - period of APR @see PERIODS
 * @returns {number} average APR of our platform for period.
 */
export function GetAvgAprForPeriod(chart_data, tokensData, chainSelected, period) {
  let now = new Date()
  let startPeriodTimestamp = GetPeriodTimestamp(period)
  let startPeriodDate = new Date(startPeriodTimestamp * 1000)
  chart_data = chart_data.filter((item) =>
    isRightChainName(item.Blockchain, chainSelected) || item.Blockchain == '',
  )
  let { daysDifference, filtered_data } = GetTimeRangeRiskData(
    chainSelected,
    chart_data,
    tokensData,
    startPeriodDate,
    now,
  )
  let avg_apr = 0
  if (filtered_data.length > 0) {
    let profitItem = sumFields(filtered_data, ['Profits'])
    avg_apr = CalculateAvgApr(
      profitItem,
      filtered_data,
      daysDifference,
      chainSelected,
    )
  }
  return isNaN(avg_apr) ? 0 : avg_apr
}
