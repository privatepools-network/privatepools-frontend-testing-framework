import useGraphQLQuery from '../useQuery'
import { configService } from '@/services/config/config.service'
import { PORTFOLIO_HISTORICAL_BALANCES } from '../queries/portfolio/portfolioHistoricalBalances'
import { networkId } from '../useNetwork'

/**
 * @typedef {Object} PoolId
 * @property {string} id - The ID associated with the pool.
 */

/**
 * @typedef {Object} Balance
 * @property {string} value - The balance value.
 * @property {number} timestamp - The timestamp associated with the balance.
 */

/**
 * @typedef {Object} PoolData
 * @property {PoolId} poolId - The pool ID object.
 * @property {string} address - The address associated with the pool.
 * @property {Array<Balance>} balances - An array of balance objects.
 */

/**
 * @typedef {Array<PoolData>} PoolsArray
 */


/**
 * Get user's historical shares in pools.
 * @function GetUserHistoricalBalances
 * @param {string} user - user address 
 * @param {number} network - network ID of the network where the data is to be found
 * @returns {PoolsArray} historical shares of the user for each pool, where he was active.
 */
export async function GetUserHistoricalBalances(user, network) {
  network = network ? network : networkId.value
  let config = configService.getNetworkConfig(network)
  if (!config.subgraph) return []
  let data = await useGraphQLQuery(
    config.subgraph,
    PORTFOLIO_HISTORICAL_BALANCES(user),
  )
  return data['historicalUserBalances']
}
