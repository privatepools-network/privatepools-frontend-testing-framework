import useGraphQLQuery from '../useQuery'
import { configService } from '@/services/config/config.service'
import { TOKENS_QUERY } from '../queries/tokensQuery'
import { networkId } from '../useNetwork'

/**
 * Represents information about a token.
 * @typedef {Object} Token
 * @property {string} id - The unique identifier for the token.
 * @property {string} symbol - The symbol of the token.
 * @property {string} address - The address of the token.
 * @property {string} totalBalanceNotional - The total balance notional value of the token.
 * @property {string} totalBalanceUSD - The total balance in USD of the token.
 * @property {string} name - The name of the token.
 */

/**
 * Get protocol tokens for specific chain.
 * @function GetTokens
 * @param {number} network - chain id
 * @returns {Promise<Token[]>} - protocol tokens for specific chain
 */
export async function GetTokens(network) {
  network = network ? network : networkId.value
  let config = configService.getNetworkConfig(network)
  if (!config.subgraph) return []
  let data = await useGraphQLQuery(config.subgraph, TOKENS_QUERY)
  if (data && data['tokens']) {
    let tokens = data['tokens'].map((t) => ({
      ...t,
      symbol: t.symbol.toUpperCase(),
    }))
    return tokens
  }
  return []
}
