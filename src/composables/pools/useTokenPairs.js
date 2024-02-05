import useGraphQLQuery from '../useQuery'
import { configService } from '@/services/config/config.service'
import { TOKEN_PAIRS_QUERY } from '../queries/tokenPairsQuery'
import { DisplayNetwork, networkId } from '../useNetwork'

/**
 * @typedef {{
 *   id: string,
 *   balanceToken0: string,
 *   balanceToken1: string
 * }} TokenPairInfo
 */

/**
 * @typedef {{
 *   id: string,
 *   symbol: string,
 *   totalBalanceUSD: string,
 *   latestPrice: {
 *     priceUSD: string
 *   } | null
 * }} TokenInfo
 */

/**
 * @typedef {{
 *   totalBalanceUSD: string,
 *   timestamp: number,
 *   id: string
 * }} TokenSnapshotInfo
 */

/**
 * @typedef {{
 * tokenPairs: TokenPairInfo[]
 * tokens: TokenInfo[]
 * tokenSnapshots: TokenSnapshotInfo[]
 * }} TokenPairsInfo
 */

/**
 * Get protocol tokens/pairs and tokens snapshots.
 * @function GetTokenPairs
 * @param {*} network - network ID of the network where the data is to be found
 * @returns {Promise<TokenPairsInfo | null>} info about protocol tokens/pairs and tokens snapshots.
 */
export async function GetTokenPairs(network) {
  network = network ? network : networkId.value
  let config = configService.getNetworkConfig(network)
  if (!config.subgraph) return []
  let data = await useGraphQLQuery(config.subgraph, TOKEN_PAIRS_QUERY)
  if (data) {
    return data
  }
  return null
}

export function updateTokenPrices(tokenPairs, networks, token_prices) {
  for (let i = 0; i < networks.length; i++) {
    for (let k = 0; k < tokenPairs[i].tokens.length; k++) {
      let token = tokenPairs[i].tokens[k]
      tokenPairs[i].tokens[k] = {
        ...token,
        Blockchain: DisplayNetwork[networks[i]],
        totalBalanceUSD:
          token_prices[token.symbol] * token.totalBalanceNotional,
        latestPrice: { priceUSD: token_prices[token.symbol] },
      }
    }
  }
}
