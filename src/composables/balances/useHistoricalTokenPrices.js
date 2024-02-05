import { GetHistoricalPrice } from './cryptocompare'

/**
 * @typedef {import ("./cryptocompare").HistoricalPriceInfo} HistoricalPriceInfo
 */

/**
 * Get historical prices info for the tokens.
 * @function GetHistoricalTokenPrices
 * @param {string[]} tokens - symbols of the tokens
 * @param {boolean} enableHourly - include parsing hourly prices for current day or not
 * @param {number} daysLimit - how many days ago to count price
 * @returns {Promise<HistoricalPriceInfo[]>} - historical prices info
 */
export async function GetHistoricalTokenPrices(
  tokens,
  enableHourly = true,
  daysLimit = 500,
  toToken='USD'
) {
  let promises = []
  let unique_tokens = Array.from(new Set(tokens))
  for (let i = 0; i < unique_tokens.length; i++) {
    let symbol = unique_tokens[i]
    promises.push(GetHistoricalPrice(symbol, enableHourly, daysLimit, toToken))
  }
  return await Promise.all(promises)
}
