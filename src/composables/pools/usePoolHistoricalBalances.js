import useGraphQLQuery from '../useQuery'
import { configService } from '@/services/config/config.service'
import { POOL_HISTORICAL_BALANCES_QUERY } from '../queries/poolHistoricalBalancesQuery'
import { networkId } from '../useNetwork'
/**
 * Represents historical pool balance data.
 * @typedef {Object} PoolHistoricalBalance
 * @property {number} timestamp - The timestamp of the historical balance.
 * @property {Array<HistoricalTokenBalance>} tokens - Array of token balances for the pool.
 */

/**
 * Represents historical token balance data within a pool.
 * @typedef {Object} HistoricalTokenBalance
 * @property {TokenInfo} token - Information about the token.
 * @property {string} balanceUsd - The balance in USD.
 */

/**
 * Represents information about a token.
 * @typedef {Object} TokenInfo
 * @property {string} symbol - The symbol of the token.
 */

/**
 * Get pool's tokens historical balances.
 * @function GetPoolHistoricalBalances
 * @param {number} network - network id of the pool
 * @param {string} poolId - pool id to filter historical balances
 * @returns {PoolHistoricalBalance[]} historical balances of the tokens in the pool.
 */
export async function GetPoolHistoricalBalances(network, poolId) {
  network = network ? network : networkId.value
  let config = configService.getNetworkConfig(network)
  if (!config.subgraph) return []
  let query = POOL_HISTORICAL_BALANCES_QUERY(poolId)
  let data = await useGraphQLQuery(config.subgraph, query)
  if (data && data['poolHistoricalBalances']) {
    let balances = data['poolHistoricalBalances']
    return balances
  }
  return []
}
