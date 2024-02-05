import useGraphQLQuery from '../useQuery'
import { configService } from '@/services/config/config.service'
import { PORTFOLIO_ACTIONS_QUERY } from '../queries/portfolio/portfolioActionsQuery'
import { networkId } from '../useNetwork'

/**
 * @typedef {import("@/composables/pools/useTokenPairs").TokenInfo} TokenInfo
 */

/**
 * @typedef {Object} JoinExit
 * @property {Object} user - The user details.
 * @property {string} user.id - The user's ID.
 * @property {string} tx - The transaction hash.
 * @property {string[]} amounts - An array of amounts for each token.
 * @property {Object} pool - The pool details.
 * @property {TokenInfo[]} pool.tokens - An array of tokens in the pool.
 * @property {string} valueUSD - The value in USD.
 * @property {string} type - The type of action (e.g., "Join").
 * @property {number} timestamp - The timestamp of the action.
 */

/**
 * @typedef {Object} PoolSwap
 * @property {Object} userAddress - The user's address details.
 * @property {string} userAddress.id - The user's ID.
 * @property {string} valueUSD - The value in USD.
 * @property {string} tokenInSym - The symbol of the token being swapped in.
 * @property {string} tokenOutSym - The symbol of the token being swapped out.
 * @property {string} tokenAmountIn - The amount of the token being swapped in.
 * @property {string} tokenAmountOut - The amount of the token being swapped out.
 * @property {string} tx - The transaction hash.
 * @property {number} timestamp - The timestamp of the swap.
 */

/**
 * @typedef {{joinExits:JoinExit[], swaps:PoolSwap[]}} PortfolioActions
 */

/**
 * Get user's swaps and joinExits.
 * @function GetPortfolioActions
 * @param {string} user - user address for whom we need to parse info.
 * @param {number} network - network ID of the network where the data is to be found
 * @returns {Promise<PortfolioActions>} actions of this address.
 */
export async function GetPortfolioActions(user, network) {
  network = network ? network : networkId.value
  let config = configService.getNetworkConfig(network)
  if (!config.subgraph) return []
  let data = await useGraphQLQuery(
    config.subgraph,
    PORTFOLIO_ACTIONS_QUERY(user.toLowerCase()),
  )
  if (data && data['joinExits'] && data['swaps']) {
    let joinExits = data.joinExits.map((d) => ({ ...d, network: network }))
    let swaps = data.swaps.map((d) => ({ ...d, network: network }))
    return { joinExits, swaps }
  }
  return []
}
