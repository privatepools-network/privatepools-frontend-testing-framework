import { useQuery } from '@tanstack/vue-query'
import useGraphQLQuery from '../../useQuery'
import { configService } from '@/services/config/config.service'
import {
  HISTORIC_VALUES_QUERY,
  HISTORIC_FILTERED_VALUES_QUERY,
} from '../../queries/historicValuesQuery'
import { DisplayNetwork, networkId } from '../../useNetwork'

/**
 * @typedef {Object} HistoricalTotalShare
 * @property {string} id - The unique identifier of the historical total share.
 * @property {number} totalShares - The total shares value at a specific historical point.
 * @property {number} timestamp - The timestamp when the historical total share was recorded.
 * @property {Pool} poolId - The associated pool for the historical total share.
 */

/**
 * @typedef {Object} HistoricalBalance
 * @property {string} id - The unique identifier of the historical balance.
 * @property {HistoricalUserBalance} hirstoricalUserBalance - The associated historical user balance.
 * @property {number} value - The value of the historical balance.
 * @property {number} timestamp - The timestamp when the historical balance was recorded.
 */

/**
 * @typedef {Object} HistoricalUserBalance
 * @property {string} id - The unique identifier of the historical user balance.
 * @property {string} address - The address of the user associated with the historical balance.
 * @property {Pool} poolId - The associated pool for the historical user balance.
 * @property {HistoricalBalance[]} balances - Array of historical balances associated with the user.
 */


/**
 * @typedef {Object} LiquiditySnapshot
 * @property {string} poolLiquidityUSD - The total liquidity value in USD.
 * @property {string} poolShareValue - The value of pool shares.
 * @property {string} pricingAsset - The address of the pricing asset.
 * @property {number} timestamp - The timestamp associated with the liquidity snapshot.
 */

/**
 * @typedef {Object} PoolHistoricalValues
 * @property {LiquiditySnapshot[]} historicValues
 * @property {HistoricalTotalShare[]} historicalTotalShares
 * @property {HistoricalUserBalance[]} historicalUserBalances
 * @property {HistoricalBalance[]} historicalBalances
 * @property {string} chain - chain name
 */


/**
 * Get historical totalShares/userBalances and historicalBalances.
 * @function GetPoolHistoricValues
 * @param {string|null} poolId - pool id to filter results
 * @param {number} network - network ID of the network where the data is to be found
 * @returns {Promise<PoolHistoricalValues[]>}
 */
export async function GetPoolHistoricValues(poolId, network) {
  network = network ? network : networkId.value

  const currentDate = new Date()
  const thirtyDaysAgo = new Date(currentDate - 30 * 24 * 60 * 60 * 1000) // 30 days ago in milliseconds
  const timestampInSeconds = Math.floor(thirtyDaysAgo.getTime() / 1000)
  let query = poolId
    ? HISTORIC_FILTERED_VALUES_QUERY(poolId, timestampInSeconds)
    : HISTORIC_VALUES_QUERY
  let poolInfo = await useGraphQLQuery(
    configService.getNetworkConfig(network).subgraph,
    query,
  )
  let result = []
  if (poolInfo && poolInfo['pools'].length > 0) {
    if (poolId) result = poolInfo['pools'][0]
    else
      result = poolInfo['pools'].map((r) => ({
        ...r,
        chain: DisplayNetwork[network],
      }))
  }
  return result
}

/**
 * Query pools historical values in lazy way @see
 * @function usePoolHistoricValues
 * @param {string|null} poolId - pool id to filter results
 * @param {number} network - network ID of the network where the data is to be found
 * @param {Object} options  - useQuery addtional options
 * @returns {Object} query with pools historical values
 */
export function usePoolHistoricValues(poolId, network = null, options = {}) {
  const queryFn = async () => {
    return await GetPoolHistoricValues(poolId, network)
  }
  return useQuery(['historicalValues', poolId], queryFn, {
    ...options,
    onError: (error) => {
      console.error('GraphQL query error:', error)
    },
    onSuccess: () => {},
  })
}
