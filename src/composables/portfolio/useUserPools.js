import useGraphQLQuery from '../useQuery'
import { configService } from '@/services/config/config.service'
import { PORTFOLIO_POOLS_QUERY } from '../queries/portfolio/portfolioPoolsQuery'
import { networkId } from '../useNetwork'

/**
 * Represents user data.
 * @typedef {Object} UserData
 * @property {Object} user - Information about the user.
 * @property {string} user.id - The unique identifier for the user.
 * @property {Array<SharesOwned>} user.sharesOwned - Array of shares owned by the user.
 */

/**
 * Represents shares owned by the user.
 * @typedef {Object} SharesOwned
 * @property {string} percentage - The percentage of shares owned.
 * @property {PoolId} poolId - The ID of the pool associated with the shares.
 */

/**
 * Represents the ID and details of a pool.
 * @typedef {Object} PoolId
 * @property {string} id - The unique identifier for the pool.
 * @property {string} totalLiquidity - The total liquidity of the pool.
 * @property {Array<Token>} tokens - Array of tokens associated with the pool.
 */

/**
 * Represents a token within a pool.
 * @typedef {Object} Token
 * @property {string} address - The address of the token.
 * @property {string} symbol - The symbol of the token.
 */

/**
 * Get the pools the user is invested in.
 * @function GetUserPools
 * @param {string} user - address of user
 * @param {number} network - network id
 * @returns {UserData} - info about the pools in which the user is invested.
 */
export async function GetUserPools(user, network) {
  network = network ? network : networkId.value
  let config = configService.getNetworkConfig(network)
  if (!config.subgraph) return []
  let data = await useGraphQLQuery(config.subgraph, PORTFOLIO_POOLS_QUERY(user))
  return data['user']
}
