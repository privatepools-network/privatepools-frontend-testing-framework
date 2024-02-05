import useGraphQLQuery from '../useQuery'
import { configService } from '@/services/config/config.service'
import { HISTORICAL_TOKENS_QUERY } from '../queries/financialStatement/historicalTokensQuery'
import { DisplayNetwork, networkId } from '../useNetwork'

/**
 * Represents historical token data.
 * @typedef {Object} HistoricalToken
 * @property {Object} historicalBalanceId - The identifier for historical balance.
 * @property {PoolId} historicalBalanceId.poolId - The ID of the pool associated with the historical balance.
 * @property {number} historicalBalanceId.timestamp - The timestamp of the historical balance.
 * @property {Token} token - Information about the token.
 * @property {string} balanceUsd - The balance in USD.
 * @property {string} balance - The balance of the token.
 */

/**
 * Represents the ID and timestamp of a historical balance.
 * @typedef {Object} HistoricalBalanceId
 * @property {PoolId} poolId - The ID of the pool associated with the historical balance.
 * @property {number} timestamp - The timestamp of the historical balance.
 */

/**
 * Represents the ID of a pool.
 * @typedef {Object} PoolId
 * @property {string} id - The unique identifier for the pool.
 */

/**
 * Represents information about a token.
 * @typedef {Object} Token
 * @property {string} address - The address of the token.
 * @property {string} symbol - The symbol of the token.
 */

/**
 * Get historical balances for protocol tokens.
 * @function GetHistoricalTokens
 * @param {number} network - network id
 * @param {string|null} poolId - pool id to filter tokens
 * @returns {Promise<HistoricalToken[]>} historical balances for protocol tokens
 */
export async function GetHistoricalTokens(network, poolId = null, skip=0) {
  network = network ? network : networkId.value
  let config = configService.getNetworkConfig(network)
  if (!config.subgraph) return []
  let data = await useGraphQLQuery(config.subgraph, HISTORICAL_TOKENS_QUERY(skip))
  if (data && data['historicalTokens']) {
    if (poolId) {
      data['historicalTokens'] = data['historicalTokens'].filter(
        (item) => item.historicalBalanceId.poolId.id == poolId,
      )
    }
    return data['historicalTokens'].map((p) => ({
      ...p,
      chain: DisplayNetwork[network],
    }))
  }
  return []
}
