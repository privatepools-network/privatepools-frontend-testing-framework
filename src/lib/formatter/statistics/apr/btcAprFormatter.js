/**
 *
 * @typedef {import('@/lib/formatter/statistics/apr/statisticsAprFormatter').MarketsInfo} MarketsInfo
 */

/**
 * Get APR for Bitcoin based on Bitcoin APR on compound platform + WBTC APR on celsius platform.
 * @param {MarketsInfo} market_data - APRs info for different platforms.
 * @returns {number} Average APR for BTC
 */
export function FormatBtcApr(market_data) {
  let compound = market_data['compound']
  let wbtc_apr = 0
  let wbtc = compound.filter((item) => item.underlyingSymbol == 'WBTC')[0]
  if (wbtc) {
    wbtc_apr = parseFloat(wbtc.borrowRate) * 100
  }
  let btc_apr = 0
  let celsius = market_data['celsius']
  if (celsius && celsius.interestRates) {
    let btc = celsius.interestRates.filter((item) => item.coin == 'BTC')[0]
    if (btc) {
      btc_apr = parseFloat(btc.rate) * 100
    }
  }
  return (wbtc_apr + btc_apr) / 2
}
