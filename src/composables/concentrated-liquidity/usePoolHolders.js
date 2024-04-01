import { UNISWAP_POOL_HOLDERS } from '../queries/external/uniswapPoolHolders'
import useGraphQLQuery from '../useQuery'
import { UNISWAP_SUBGRAPHS } from './constants'

export async function usePoolHolders(poolId, networkId) {
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    UNISWAP_POOL_HOLDERS(poolId),
  )
  if (data && data['positions']) {
    return Array.from(new Set(data.positions.map((item) => item.owner)))
  }
  return []
}
