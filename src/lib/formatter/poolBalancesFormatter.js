import { formatSimpleTimestamp } from '../utils'

/**
 * @typedef {{timestamps:number[], Dates:string[]}  & {[key: string]: number[]}} PoolBalancesChartData
 */

/**
 * Format pool's tokens historical balances to chart format.
 * @function FormatPoolBalances
 * @param {import('@/composables/pools/usePoolHistoricalBalances').PoolHistoricalBalance[]} data
 * @returns {PoolBalancesChartData} - formatted data for pool's tokens historical balances chart on pool details.
 */
export function FormatPoolBalances(data) {
  const result = {
    timestamps: [],
    Dates: [],
  }

  // Extract all unique tokens from the data
  let uniqueTokens = new Set()
  data.forEach((entry) => {
    entry.tokens.forEach((tokenEntry) => {
      uniqueTokens.add(tokenEntry.token.symbol)
    })
  })
  uniqueTokens = Array.from(uniqueTokens)

  // Initialize token balance arrays in the result object
  uniqueTokens.forEach((token) => {
    result[token] = []
  })

  // Sort data by timestamp in ascending order
  data.sort((a, b) => a.timestamp - b.timestamp)

  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    let ts = item.timestamp
    let date = formatSimpleTimestamp(ts)
    result.Dates.push(date)
    result.timestamps.push(ts * 1000)

    let tokens = item.tokens
    for (let k = 0; k < uniqueTokens.length; k++) {
      let token = uniqueTokens[k]
      let found_token = tokens.find((t) => t.token.symbol == token)
      if (found_token) {
        result[token].push(
          parseFloat(found_token.balance),
        )
      } else {
        if (result[token].length > 0) {
          result[token].push(result[token][result[token].length - 1])
        } else {
          result[token].push(0)
        }
      }
    }
  }
  return result
}
