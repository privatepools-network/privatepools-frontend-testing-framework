import { UNISWAP_POOLS_QUERY } from '../queries/external/uniswapPoolsQuery'
import useGraphQLQuery from '../useQuery'
import { UNISWAP_SUBGRAPHS } from './constants'

export async function useUniswapPools(networkId) {
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    UNISWAP_POOLS_QUERY,
  )
  if (data && data['pools']) {
    return data.pools.map((item) => ({ ...item, chainId: networkId }))
  }
  return []
}
