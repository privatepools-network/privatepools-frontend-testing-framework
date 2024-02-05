import { CalculateMonthAvgApr } from '@/composables/math/chartMath/trackingInfoMath'
import { useAllTimeAvgProfit } from '@/composables/pools/usePoolSwapsStats'
import { formatBigNumber } from '@/lib/utils'

/**
 * @typedef {Object} AmountVariation
 * @property {string} amount
 * @property {string} variation
 */

/**
 * @typedef {Object} FullAmount
 * @property {number} fullAmount
 * 
 * @typedef {AmountVariation & FullAmount} FullAmountVariation
 *
 */

/**
 *
 * @typedef {{
 *  id:string,
 *  Name:string[],
 * 'Avg APR': AmountVariation,
 * 'Liquidity Deposited': AmountVariation,
 * '% of Pool': AmountVariation,
 * 'Returns Harvested': AmountVariation,
 * TVL: FullAmountVariation,
 * Volume: AmountVariation,
 * Fees: AmountVariation,
 * 'Avg Profit Per Trade': AmountVariation,
 * 'Number of Trades': AmountVariation,
 * }} PortfolioFormattedStats
 */

/**
 * Format small values to normal view, if user has very small percentage in some of the pool - it won't show zero.
 * @function FormatInvestmentSmallValues
 * @param {PortfolioFormattedStats[]} result - formatted pools from @see FormatPortfolioPools
 * @returns {PortfolioFormattedStats[]} formatted pools with formatted % of Pool value
 */
export function FormatInvestmentSmallValues(result) {
  return result
    .filter((r) => r['Liquidity Deposited'].amount != '0')
    .map((r) => ({
      ...r,
      '% of Pool': {
        amount:
          r['% of Pool'].amount == '0' ? '>0.0001' : r['% of Pool'].amount,
        variation: r['% of Pool'].variation,
      },
    }))
}

/**
 * Format info about the pools in which the user is invested in.
 * @function FormatPortfolioPools
 * @param {import('../poolsFormatter').PoolFormattedData[]} poolsData - info about these pools
 * @param {import('@/composables/portfolio/useUserPools').UserData} user_data - info about shares owned in these pools
 * @param {import('../poolsFormatter').Swap[]} swaps_data - arbitrage trades for these pools
 * @param {import('../poolTvlFormatter').TVLInfo[]} historical_tvl - historical TVL values of these pools
 * @param {string} network - chain that is selected on page
 * @returns {PortfolioFormattedStats[]} - formatted info about the pools in which user is invested.
 */
export function FormatPortfolioPools(
  poolsData,
  user_data,
  swaps_data,
  historical_tvl,
  network,
) {
  let result = []
  let userPools = user_data.sharesOwned.map((share) => share.poolId)
  for (let i = 0; i < poolsData.length; i++) {
    let poolData = poolsData[i]
    let found_index = userPools.findIndex((p) => p.id == poolData.id)
    let pool = userPools[found_index]
    let share = user_data.sharesOwned[found_index]
    let filtered_tvl = historical_tvl.filter((tvl) => tvl.poolId == pool.id)
    let avg_month_apr = CalculateMonthAvgApr(filtered_tvl, swaps_data, network)
    if (isNaN(avg_month_apr)) avg_month_apr = 0
    result.push({
      id: poolData.id,
      Name: pool.tokens.map((t) => t.symbol),
      'Avg APR': {
        amount: formatBigNumber(avg_month_apr),
        variation: '',
      },
      'Liquidity Deposited': {
        amount: formatBigNumber((poolData.TVL / 100) * share.percentage, 4),
        variation: '',
      },
      '% of Pool': {
        amount: formatBigNumber(share.percentage, 4),
        variation: '',
      },
      'Returns Harvested': {
        amount: '-',
        variation: '',
      },
      TVL: {
        amount: formatBigNumber(poolData.TVL),
        variation: '',
        fullAmount: poolData.TVL,
      },
      Volume: {
        amount: formatBigNumber(poolData['Volume All Time']),
        variation: '',
      },
      Fees: {
        amount: formatBigNumber(poolData['Fees All Time']),
        variation: '',
      },
      'Avg Profit Per Trade': {
        amount: formatBigNumber(useAllTimeAvgProfit(swaps_data)),
        variation: '',
      },
      'Number of Trades': {
        amount: formatBigNumber(poolData['Trades All Time']),
        variation: '',
      },
    })
  }
  return FormatInvestmentSmallValues(result)
}
