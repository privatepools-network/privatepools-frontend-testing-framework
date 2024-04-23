import { FormatUsdRoi } from './usdRoiFormatter'
import { PERIODS } from '../statisticsPeriods'
import { FormatTokenRoi, GetTop10TokensRoi } from './tokensRoiFormatter'
import { FormatTvlRoi } from './tvlRoiFormatter'

/**
 * @typedef {import('@/composables/pools/snapshots/usePoolHistoricalTvl').HistoricalTVL} HistoricalTVL
 * @typedef {import ("./cryptocompare").HistoricalPriceInfo} HistoricalPriceInfo
 * @typedef {import('../statisticsPeriods').StatisticsResult} StatisticsResult
 */

/**
 * Calculate ROI for darkpools protocol vs other popular protocols.
 * @function FormatRoiStatistics
 * @param {HistoricalTVL[]} historical_tvl - historical TVLs values of our pools
 * @param {HistoricalPriceInfo[]} token_prices - historical prices of the tokens
 * @param {string[]} top10Tokens - top 10 token symbols by market cap
 * @param {string} chainSelected - selected chain in the UI
 * @returns {Promise<StatisticsResult[]>} comparison of ROIs for different platforms and ours.
 */
export async function FormatRoiStatistics(
  chart_data,
  token_prices,
  top10Tokens,
  chainSelected,
) {
  let result = []
  let btc_prices_info = token_prices.filter(
    (token_price) => token_price.symbol == 'BTC',
  )[0]
  let lido_prices_info = token_prices.filter(
    (token_price) => token_price.symbol == 'stETH',
  )[0]

  let btc_info = FormatTokenRoi(btc_prices_info)
  let lido_info = FormatTokenRoi(lido_prices_info)
  let avg_top10_tokens_info = GetTop10TokensRoi(token_prices, top10Tokens)
  let usd_info = await FormatUsdRoi()
  let tvl_info = FormatTvlRoi(chart_data, chainSelected)
  for (let i = 0; i < PERIODS.length; i++) {
    let period = PERIODS[i]
    if (period == 'total') continue
    let roi = tvl_info[period]
    result.push({
      Period: period,
      ROI: roi,
      'VS USD': roi - usd_info[period],
      'VS LIDO': roi - lido_info[period],
      'VS BTC': roi - btc_info[period],
      'VS Defi Yield': roi - avg_top10_tokens_info[period],
    })
  }
  return result
}
