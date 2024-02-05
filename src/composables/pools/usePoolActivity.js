import useGraphQLQuery from '../useQuery'
import { configService } from '@/services/config/config.service'
import { JOIN_EXITS_QUERY } from '../queries/joinExitsQuery'
import { SWAPS_QUERY } from '../queries/swapsQuery'
import { networkId } from '../useNetwork'

/**
 * Get users activity for specific pool
 * @function GetPoolActivity
 * @param {string} poolId - id of pool
 * @param {number} network - chain id
 * @returns {Array<import('../portfolio/usePortfolioActions').PoolSwap|import('../portfolio/usePortfolioActions').JoinExit>} users activity for specific pools
 */
export async function GetPoolActivity(poolId, network) {
  network = network ? network : networkId.value
  let joinExits = await useGraphQLQuery(
    configService.getNetworkConfig(network).subgraph,
    JOIN_EXITS_QUERY(poolId),
  )
  let swaps = await useGraphQLQuery(
    configService.getNetworkConfig(network).subgraph,
    SWAPS_QUERY(poolId),
  )
  let result = []
  if (joinExits['joinExits']) {
    result.push(...joinExits['joinExits'])
  }
  if (swaps['swaps']) {
    swaps['swaps'].forEach((s) => (s['type'] = 'Swap'))
    result.push(...swaps['swaps'])
  }
  return result
}