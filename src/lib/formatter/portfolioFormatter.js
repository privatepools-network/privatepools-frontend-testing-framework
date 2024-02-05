import {
  generateTimeAgoString,
  isTimestampWithinCurrent30Days,
  isTimestampWithinCurrentDay,
  isTimestampWithinLast7Days,
  isTimestampWithinLastYear,
  formatBigNumber,
} from '../utils'

/**
 * @typedef {import('@/composables/portfolio/usePortfolioActions').PortfolioActions} PortfolioActions
 */

/**
 * @typedef {Object} PortfolioActivity
 * @property {string} Actions - The type of action (e.g., 'Deposit' or 'Withdraw').
 * @property {TokenDetail[]} Details - An array containing details for each token.
 * @property {string} Value - The formatted value in USD.
 * @property {number} Profit - The profit value (set to 0 in the provided code).
 * @property {string} Time - A string representing the time ago.
 * @property {string} tx - The transaction hash.
 * @property {number} timestamp - The timestamp of the action.
 * @property {string} network - The network information.
 */

/**
 * @typedef {Object} TokenDetail
 * @property {string} symbol
 * @property {string} amount
 */

/**
 * @typedef {PortfolioActivity[][]} PortfolioActivities
 */

/**
 * Format user's joinExits and swaps to one array for different time periods. 24h/7d/1m/1y/all time
 * @function FormatPortfolioActivity
 * @param {PortfolioActions} data - user's unformatted actions.
 * @returns {PortfolioActivities} formatted user's activity for different time periods.
 */
export function FormatPortfolioActivity(data) {
  let joins = data['joinExits']
  let swaps = data['swaps']
  // 24h/ 7d/ 1m/ 1y/ all time
  let all_results = []
  if (!joins) return []
  for (let i = 0; i < joins.length; i++) {
    let details = {}
    let symbols = joins[i].pool.tokens.map((t) => t.symbol) // strings
    for (let k = 0; k < symbols.length; k++) {
      details[symbols[k]] = formatBigNumber(joins[i].amounts[k]) // string
    }
    all_results.push({
      Actions: joins[i].type == 'Join' ? 'Deposit' : 'Withdraw',
      Details: [details],
      Value: formatBigNumber(joins[i].valueUSD),
      Profit: 0,
      Time: generateTimeAgoString(joins[i].timestamp),
      tx: joins[i].tx,
      timestamp: joins[i].timestamp,
      network: joins[i].network,
    })
  }
  for (let i = 0; i < swaps.length; i++) {
    let details = {}
    details[swaps[i].tokenInSym] = formatBigNumber(swaps[i].tokenAmountIn)
    details[swaps[i].tokenOutSym] = formatBigNumber(swaps[i].tokenAmountOut)

    all_results.push({
      Actions: 'Swap',
      Details: [
        {
          ...details,
          action: 'Swap',
        },
      ],
      Value: formatBigNumber(swaps[i].valueUSD),
      Profit: 0,
      Time: generateTimeAgoString(swaps[i].timestamp),
      tx: swaps[i].tx,
      timestamp: swaps[i].timestamp,
      network: swaps[i].network,
    })
  }
  all_results.sort((a, b) => b.timestamp - a.timestamp)
  let time_results = [[], [], [], [], []]
  for (let i = 0; i < all_results.length; i++) {
    let ts = all_results[i].timestamp
    if (isTimestampWithinCurrentDay(ts)) {
      time_results[0].push(all_results[i])
    }
    if (isTimestampWithinLast7Days(ts)) {
      time_results[1].push(all_results[i])
    }
    if (isTimestampWithinCurrent30Days(ts)) {
      time_results[2].push(all_results[i])
    }
    if (isTimestampWithinLastYear(ts)) {
      time_results[3].push(all_results[i])
    }
    time_results[4].push(all_results[i])
  }
  return time_results
}
