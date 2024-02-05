/**
 * @typedef {import('@/composables/portfolio/usePortfolioHistoricalBalances').PoolsArray} PoolsArray
 * @typedef {import('../poolsFormatter').Swap} Swap
 */

/**
 * Filter swaps only to periods when the user was holding share in the pool which was related to trade.
 * @function GetActivePeriodsSwapsData
 * @param {PoolsArray} historicalUserBalances - historical balances of the user
 * @param {Swap[]} poolSwapsData - swaps of the pools that the user was active in
 * @returns {Swap[]} filtered swaps.
 */
export function GetActivePeriodsSwapsData(
  historicalUserBalances,
  poolSwapsData,
) {
  let result_swaps = []

  for (let i = 0; i < poolSwapsData.length; i++) {
    let swap = poolSwapsData[i]
    let pool = swap.swaps[0].poolIdVault[0]
    let poolUserBalances = historicalUserBalances.find(
      (item) => item.poolId.id == pool,
    )
    if (poolUserBalances && poolUserBalances.balances) {
      let balances = poolUserBalances.balances.filter(
        (b) => b.timestamp <= swap.timestamp,
      )
      if (
        balances.length > 0 &&
        balances[0] > swap.timestamp &&
        balances[0].value > 0
      ) {
        result_swaps.push(swap)
      }
    }
  }

  return result_swaps
}
