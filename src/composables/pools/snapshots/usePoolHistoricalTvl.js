import { GetHistoricalTokenPrices } from '@/composables/balances/useHistoricalTokenPrices'
import { GetHistoricalTokens } from '@/composables/balances/useHistoricalTokens'
// import {
//   HISTORICAL_POOL_TVL_QUERY,
//   HISTORICAL_TVL_QUERY,
// } from '@/composables/queries/historicalTvlQuery'
import { DisplayNetwork } from '@/composables/useNetwork'
//import useGraphQLQuery from '@/composables/useQuery'
import { getTokensPricesForTimestamp } from '@/lib/formatter/financialStatement/financialStatementUtils'
//import { configService } from '@/services/config/config.service'

/**
 * @typedef {import("@/composables/pools/useTokenPairs").TokenInfo} TokenInfo
 */

/**
 * @typedef {Object} HistoricalTVL
 * @property {string} totalLiquidity - The total liquidity value.
 * @property {number} timestamp - The timestamp associated with the liquidity snapshot.
 * @property {Object} pool - The pool information.
 * @property {string} pool.id - The unique identifier of the pool.
 * @property {TokenInfo[]} pool.tokens - Array of tokens in the pool.
 * @property {string} pool.tokens[].symbol - The symbol of a token in the pool.
 */

/**
 * Get historical values of TVL for all pools or for a single pool.
 * @function GetHistoricalTvl
 * @param {number} network - network ID of the network where the data is to be found
 * @param {*} poolId - pool id to filter results (not necessary)
 * @returns {Promise<HistoricalTVL[]>} historical tvls for pools.
 */
// export async function GetHistoricalTvl(network, poolId = null) {
//   let config = configService.getNetworkConfig(network)
//   if (!config.subgraph) return []
//   let query = poolId ? HISTORICAL_POOL_TVL_QUERY(poolId) : HISTORICAL_TVL_QUERY
//   let data = await useGraphQLQuery(config.subgraph, query)
//   data.poolSnapshots = data.poolSnapshots.map((ps) => ({
//     ...ps,
//     Blockchain: DisplayNetwork[network],
//   }))
//   return data.poolSnapshots
// }
// export async function GetHistoricalTvls(network, pools) {
//   let filtered = pools.filter((item) => item.totalLiquidity > 1000)

//   let config = configService.getNetworkConfig(network)
//   if (!config.poolsUrlV2) return []
//   let promises = []
//   for (let i = 0; i < filtered.length; i++) {
//     let query = HISTORICAL_POOL_TVL_BACKEND_QUERY(filtered[i].id)
//     promises.push(useGraphQLQuery(config.poolsUrlV2, query))
//   }

//   let results = await Promise.all(promises)
//   let snapshots = []
//   console.log(results)
//   for (let i = 0; i < results.length; i++) {
//     snapshots.push(...results[i].poolSnapshots)
//   }
//   console.log(snapshots)
//   console.log(pools)
//   snapshots = snapshots.map((ps) => ({
//     ...ps,
//     pool: filtered.find((p) => p.id == ps.poolId),
//     Blockchain: DisplayNetwork[network],
//   }))
//   console.log(snapshots)
//   return snapshots.sort((a, b) => b.timestamp - a.timestamp)
// }

export async function GetHistoricalTvl(
  network,
  poolId = null,
  toToken = 'USD',
  filter = [],
) {
  if (filter == null) return []
  let historical_tokens = []
  let skip = 0
  let results = await GetHistoricalTokens(network, poolId, skip, filter)
  historical_tokens.push(...results)
  while (results.length == 1000) {
    skip += 1000
    results = await GetHistoricalTokens(network, poolId, skip, filter)
    historical_tokens.push(...results)
  }

  let unique_symbols = Array.from(
    new Set(historical_tokens.map((t) => t.token.symbol)),
  )
  let unique_pools = Array.from(
    new Set(historical_tokens.map((t) => t.historicalBalanceId.poolId.id)),
  )
  let prices = await GetHistoricalTokenPrices(
    unique_symbols,
    true,
    500,
    toToken,
  )
  let snapshots = []
  for (let i = 0; i < unique_pools.length; i++) {
    let pool = unique_pools[i]
    let pool_historical_tokens = historical_tokens.filter(
      (t) => t.historicalBalanceId.poolId.id == pool,
    )
    let pool_token_symbols = Array.from(
      new Set(pool_historical_tokens.map((t) => t.token.symbol)),
    )
    for (let k = 0; k < pool_historical_tokens.length; k++) {
      let historical_token = pool_historical_tokens[k]
      if (
        snapshots.find(
          (s) =>
            s.timestamp == historical_token.historicalBalanceId.timestamp &&
            s.pool.id == historical_token.historicalBalanceId.poolId.id,
        ) != null
      ) {
        continue
      }
      let tokens_prices = getTokensPricesForTimestamp(
        pool_token_symbols,
        prices,
        historical_token.historicalBalanceId.timestamp,
      )
      let tvl = 0
      let balances = pool_token_symbols.map(() => 0)
      let balancesUsd = pool_token_symbols.map(() => 0)
      for (let j = 0; j < pool_token_symbols.length; j++) {
        let balance = findTokenBalanceForTimestamp(
          pool_historical_tokens,
          pool_token_symbols[j],
          historical_token.historicalBalanceId.timestamp,
        )
        balances[j] = balance
        let usdBalance = balance * tokens_prices[pool_token_symbols[j]]
        tvl += usdBalance
        balancesUsd[j] = usdBalance
      }
      snapshots.push({
        totalLiquidity: tvl,
        balances,
        balancesUsd,
        timestamp: historical_token.historicalBalanceId.timestamp,
        pool: {
          id: pool,
          tokens: pool_token_symbols.map((t) => ({ symbol: t })),
        },
      })
    }
  }
  return snapshots
    .map((s) => ({ ...s, Blockchain: DisplayNetwork[network] }))
    .sort((a, b) => b.timestamp - a.timestamp)
}

function findTokenBalanceForTimestamp(historical_tokens, symbol, timestamp) {
  let found = historical_tokens.find(
    (t) =>
      t.token.symbol == symbol && t.historicalBalanceId.timestamp <= timestamp,
  )
  if (!found) {
    return 0
  }
  return found.balance
}

// {
//   totalLiquidity
//   timestamp
//   pool{
//     id
//     tokens{
//       symbol
//     }
//   }
// }
