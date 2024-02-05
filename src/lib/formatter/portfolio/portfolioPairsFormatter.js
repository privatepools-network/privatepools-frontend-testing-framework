import {
  useAllTimeAvgProfit,
  usePoolAllTimeFee,
  usePoolAllTimeTrades,
  usePoolAllTimeVolume,
} from '@/composables/pools/usePoolSwapsStats'
import { formatBigNumber } from '@/lib/utils'
import { isEqualPairs } from '../trackPairsFormatter'
import { FormatInvestmentSmallValues } from './portfolioPoolsFormatter'

/**
 * Calculate number of combinations for tokens.
 * @function calculateCombinations
 * @param {number} n -number of tokens
 * @returns {number} - number of unique combinations
 */
function calculateCombinations(n) {
  if (n < 0) {
    return 0 // Invalid input
  }

  // Calculate C(n, k) where k is 2
  return parseInt(factorial(n) / (factorial(2) * factorial(n - 2)))
}
/**
 * Calculate n!
 * @function factorial
 * @param {number} num
 * @returns {number} factorial of number n
 */
function factorial(num) {
  if (num === 0) return 1
  let result = 1
  for (let i = 1; i <= num; i++) {
    result *= i
  }
  return result
}

/**
 * Format info about the token pairs in which the user is invested in (from the pools).
 * @function FormatPortfolioPairs
 * @param {import('@/composables/portfolio/useUserPools').UserData} user_data - info about shares owned in the pools
 * @param {import('../poolsFormatter').Swap[]} swaps_data -  arbitrage trades for the pools
 * @param {import('../trackPairsFormatter').TokenPairsInfo} pairs_data - info about the pairs that user is invested in (from the pools)
 * @param {Map<string,number>} prices - mapping with prices info for token symbols.
 * @returns {import('./portfolioPoolsFormatter').PortfolioFormattedStats[]} - formatted info about the pairs in which user is invested.
 */
export function FormatPortfolioPairs(
  user_data,
  swaps_data,
  pairs_data,
  prices,
) {
  let result = []
  let userPools = user_data.sharesOwned.map((share) => share.poolId)
  let pairs = pairs_data['tokenPairs']
  let tokens = pairs_data['tokens']
  for (let i = 0; i < pairs.length; i++) {
    let pair = pairs[i]
    let splited = pair.id.split('-')
    let token0 = splited[0]
    let token1 = splited[1]
    let symbol0 = tokens.find((t) => t.id == token0).symbol
    let symbol1 = tokens.find((t) => t.id == token1).symbol

    let poolsWithPair = userPools.filter((p) => {
      let addresses = p.tokens.map((t) => t.address)
      return addresses.includes(token0) && addresses.includes(token1)
    })
    let tvl_sum = 0
    if (poolsWithPair.length == 0) continue
    for (let k = 0; k < poolsWithPair.length; k++) {
      let pairPool = poolsWithPair[k]
      let possible_pairs_count = calculateCombinations(pairPool.tokens.length)
      let share = user_data.sharesOwned.find((s) => s.poolId.id == pairPool.id)
      let userTvl = (pairPool.totalLiquidity / 100) * share.percentage
      tvl_sum += userTvl / possible_pairs_count
    }

    let balanceUsd0 = prices[symbol0] * pair.balanceToken0
    let balanceUsd1 = prices[symbol1] * pair.balanceToken1
    let pair_tvl = balanceUsd0 + balanceUsd1
    let pair_swaps_data = swaps_data.filter(
      (item) =>
        item.swaps[0].trackPair.filter((tp) => isEqualPairs(tp, pair.id))
          .length > 0,
    )
    result.push({
      id: i,
      Name: [symbol0, symbol1],
      'Liquidity Deposited': {
        amount: formatBigNumber(tvl_sum, 4),
        variation: '',
      },
      '% of Pool': {
        amount: formatBigNumber(tvl_sum / (pair_tvl / 100), 4),
        variation: '',
      },
      TVL: {
        amount: formatBigNumber(pair_tvl),
        variation: '',
        fullAmount: pair_tvl,
      },
      Volume: {
        amount: formatBigNumber(usePoolAllTimeVolume(pair_swaps_data).value),
        variation: '',
      },
      Fees: {
        amount: formatBigNumber(usePoolAllTimeFee(pair_swaps_data).value),
        variation: '',
      },
      'Avg Profit Per Trade': {
        amount: formatBigNumber(useAllTimeAvgProfit(pair_swaps_data)),
        variation: '',
      },
      'Number of Trades': {
        amount: formatBigNumber(usePoolAllTimeTrades(pair_swaps_data).value),
        variation: '',
      },
    })
  }
  return FormatInvestmentSmallValues(result)
}
