import useGraphQLQuery from '../useQuery'
import { configService } from '@/services/config/config.service'
import {
  ACTIVE_USERS_QUERY,
  POOL_ACTIVE_USERS_QUERY,
} from '../queries/activeUsersQuery'
import { networkId } from '../useNetwork'

/**
 * @typedef {Object} UserObject
 * @property {string} id - User ID.
 */

/**
 * @typedef {Object} JoinExitTransaction
 * @property {UserObject} user - User information.
 * @property {string} valueUSD - Value in USD.
 * @property {string[]} amounts - Value in token amounts.
 * @property {string} type - Transaction type (e.g., "Exit").
 * @property {number} timestamp - Timestamp of the transaction.
 */

/**
 * @typedef {Object} SwapTransaction
 * @property {number} timestamp - Timestamp of the transaction.
 * @property {UserObject} userAddress - User address information.
 */

/**
 * @typedef {Object} ActiveUserActions
 * @property {Array<JoinExitTransaction>} joinExits - Array of join/exit data.
 * @property {Array<SwapTransaction>} swaps - Array of swap data.
 */

/**
 * @typedef {Object} UserTx
 * @property {number} timestamp
 * @property {string} user
 * @property {string} [chain]
 */

/**
 *
 * @param {number} network
 * @param {string} poolId - specific pool id to filter results
 * @returns {{activeUsers:UserTx[],joinExits:JoinExitTransaction[]}}
 */
export async function GetActiveUsers(network, poolId = null) {
  network = network ? network : networkId.value
  let config = configService.getNetworkConfig(network)
  if (!config.subgraph) return []
  let data = await useGraphQLQuery(
    config.subgraph,
    poolId ? POOL_ACTIVE_USERS_QUERY(poolId) : ACTIVE_USERS_QUERY,
  )
  if (data && data['joinExits']) {
    let swaps = data['swaps'].map((swap) => ({
      timestamp: swap.timestamp,
      user: swap.userAddress.id,
    }))
    let joinExits = data['joinExits'].map((joinExit) => ({
      timestamp: joinExit.timestamp,
      user: joinExit.user.id,
    }))
    return {
      activeUsers: [...swaps, ...joinExits],
      joinExtis: data['joinExits'],
    }
  }
  return []
}
