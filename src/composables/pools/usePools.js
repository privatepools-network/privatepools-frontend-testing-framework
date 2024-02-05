import { useQuery } from '@tanstack/vue-query'
import useGraphQLQuery from '../useQuery'
import { configService } from '@/services/config/config.service'
import { POOL_QUERY, POOL_SUBGRAPH_QUERY } from '../queries/poolQuery'
import { DisplayNetwork, networkId } from '../useNetwork'
import { GetTokenPricesBySymbols } from '../balances/cryptocompare'
/**
 * @typedef {Object} PoolData
 * @property {string} id - The unique identifier of the pool.
 * @property {string} name - The name of the pool.
 * @property {string} address - The address of the pool.
 * @property {string} poolType - The type of the pool (e.g., "Weighted").
 * @property {string} swapFee - The swap fee of the pool.
 * @property {string[]} tokensList - List of token addresses in the pool.
 * @property {string} totalLiquidity - Total liquidity in the pool.
 * @property {string} totalSwapVolume - Total swap volume in the pool.
 * @property {string} totalSwapFee - Total swap fee in the pool.
 * @property {string} totalShares - Total shares in the pool.
 * @property {string} owner - The address of the pool owner.
 * @property {string} factory - The address of the factory that created the pool.
 * @property {?number} amp - Amplification coefficient (null if not applicable).
 * @property {number} createTime - The timestamp when the pool was created.
 * @property {boolean} swapEnabled - Indicates whether swapping is enabled for the pool.
 * @property {string} volume24h - 24-hour trading volume for the pool.
 * @property {string} fees24h - 24-hour accumulated fees for the pool.
 * @property {{total: string}} apr - Annual Percentage Rate information.
 * @property {Array<{name: string, symbol: string, decimals: number, address: string, balance: string, weight: string}>} tokens - List of token details in the pool.
 * @property {?number} mainIndex - Main index value (null if not applicable).
 * @property {?object} tokenRates - Token rates information (null if not applicable).
 * @property {string} holdersCount - Number of holders in the pool.
 * @property {string} swapsCount - Number of swaps in the pool.
 * @property {?object} linearPools - Linear pool information (null if not applicable).
 */

/**
 * @typedef {Object} SimplePoolData
 * @property {string} id - The unique identifier of the pool.
 * @property {string} name - The name of the pool.
 * @property {string} address - The address of the pool.
 * @property {string} totalLiquidity - Total liquidity in the pool.
 * @property {string} totalShares - Total shares in the pool.
 * @property {Array<{
 *   symbol: string,
 *   address: string,
 *   balance: string
 * }>} tokens - List of token details in the pool.
 */

/**
 * @typedef {null|{id:string}} PoolsOptions
 */

/**
 * Get pools for this network.
 * @function GetPools
 * @param {number} network -  network ID of the network where the data is to be found
 * @param {PoolsOptions} options - options to query for specific pool or all pools
 * @param {boolean} subgraph - use subgraph url or /graphql url
 * @returns {Promise<SimplePoolData[] | PoolData[]>} array of pools
 */
export async function GetPools(
  network,
  options = null,
  subgraph = false,
  queryTvl = false,
  toToken = 'USD',
) {
  network = network ? network : networkId.value
  let config = configService.getNetworkConfig(network)
  let url = subgraph ? config.subgraph : config.poolsUrlV2
  let query = subgraph ? POOL_SUBGRAPH_QUERY : POOL_QUERY
  if (!url) return []
  let data = await useGraphQLQuery(url, {
    pools: query,
  })
  if (data && data['pools']) {
    let pools = data['pools']
    if (queryTvl) {
      await setPoolsTvls(pools, toToken)
    }
    if (options && options['id']) {
      pools = pools.filter((p) => p.id == options['id'])
    }
    return pools.map((p) => ({ ...p, chain: DisplayNetwork[network] }))
  }
  return []
}

export async function setPoolsTvls(pools, toToken = 'USD') {
  let symbols = Array.from(
    new Set(pools?.map((p) => p?.tokens?.map((t) => t.symbol)).flat()),
  )
  let prices = await GetTokenPricesBySymbols(symbols, toToken)
  for (let i = 0; i < pools.length; i++) {
    pools[i].totalLiquidity = pools[i].tokens.reduce(
      (sum, t) => sum + t.balance * prices[t.symbol],
      0,
    )
    pools[i].lpPrice = pools[i].totalLiquidity / pools[i].totalShares
  }
  return pools
}

/**
 * Query pools in lazy way @see GetPools.
 * @function usePools
 * @param {number} network - network ID of the network where the data is to be found
 * @param {PoolsOptions} options - options to query for specific pool or all pools
 * @returns {Object} query for getting pools.
 */
export function usePools(network = null, options = {}) {
  const queryFn = async () => {
    return await GetPools(network, options)
  }
  return useQuery(['pools', network], queryFn, {
    ...options,
    onError: (error) => {
      console.error('GraphQL query error:', error)
    },
    onSuccess: () => {},
  })
}
