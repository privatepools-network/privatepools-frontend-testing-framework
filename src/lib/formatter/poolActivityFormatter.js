import { formatBigNumber, generateTimeAgoString } from '../utils'
import { getPriceForTimestamp } from '@/lib/formatter/financialStatement/financialStatementFormatter'
const ACTION_TYPES = {
  Join: 'Deposit',
  Exit: 'Withdraw',
  Swap: 'Swap',
}

/**
 * @typedef {Object} FormattedPoolActivity
 * @property {string} Actions
 * @property {string[]} Details
 * @property {string} Value
 * @property {string} Time
 * @property {string} Tx
 */

/**
 * Format activities for specific pool
 * @function FormatPoolActivity
 * @param {Array<import('@/composables/portfolio/usePortfolioActions').PoolSwap|import('@/composables/portfolio/usePortfolioActions').JoinExit} poolActivity - users acitvity on specific chain
 * @param {import('@/composables/tokens/useTokenSymbols').Token[]} tokens - protocol tokens
 * @param {Map<string,number>} historicalPrices - mapping with prices for @see tokens
 * @returns {FormattedPoolActivity[]} formatted pool activities for specific pool
 */
export function FormatPoolActivity(
  poolActivity,
  tokens,
  historicalPrices,
  symbol = '$',
  decimals = 2,
) {
  let result = []
  for (let i = 0; i < poolActivity.length; i++) {
    let action = poolActivity[i]
    if (action.type != 'Swap') {
      result.push({
        Actions: ACTION_TYPES[action.type],
        Details: [
          tokens.reduce((_result, item, index) => {
            _result[item.symbol] = parseFloat(action.amounts[index]).toFixed(3)
            return _result
          }, {}),
        ],
        Value: `${symbol}${formatBigNumber(
          parseFloat(action.valueUSD),
          decimals,
        )}`,
        Time: generateTimeAgoString(action.timestamp),
        timestamp: action.timestamp,
        Tx: action.tx,
      })
    } else {
      let tokenInSymbol = tokens.find((t) => t.address == action.tokenIn)
      let tokenOutSymbol = tokens.find((t) => t.address == action.tokenOut)
      let price = getPriceForTimestamp(
        tokenOutSymbol.symbol,
        historicalPrices,
        action.timestamp,
      )
      let details = {
        action: action.type,
      }

      if (!tokenInSymbol || !tokenOutSymbol) continue
      details[tokenInSymbol.symbol] = parseFloat(action.tokenAmountIn).toFixed(
        2,
      )
      details[tokenOutSymbol.symbol] = parseFloat(
        action.tokenAmountOut,
      ).toFixed(2)
      result.push({
        Actions: ACTION_TYPES[action.type],
        Details: [details],
        Value: `${symbol}${formatBigNumber(
          price * action.tokenAmountOut,
          decimals,
        )}`,
        Time: generateTimeAgoString(action.timestamp),
        timestamp: action.timestamp,
        Tx: action.tx,
      })
    }
  }
  result.sort((a, b) => b.timestamp - a.timestamp)
  result = result.map(({ Actions, Details, Value, Time, Tx, timestamp }) => {
    return { Actions, Details, Value, Time, Tx, timestamp }
  })
  return result
}

/**
 * Find closes object to targetTimestamp
 * @function findClosestObject
 * @param {{timestamp:number}} arr - array with info about timestamp
 * @param {number} targetTimestamp - timestamp for which we are searching closes object
 * @returns {any} closest object for @see targetTimestamp
 */
// function findClosestObject(arr, targetTimestamp) {
//   if (arr.length === 0) {
//     return null
//   }

//   let closestObject = arr[0]
//   let minTimeDifference = Math.abs(targetTimestamp - closestObject.timestamp)

//   for (let i = 1; i < arr.length; i++) {
//     const currentDifference = Math.abs(targetTimestamp - arr[i].timestamp)

//     if (currentDifference < minTimeDifference) {
//       minTimeDifference = currentDifference
//       closestObject = arr[i]
//     }
//   }

//   return closestObject
// }
