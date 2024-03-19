import {
  UNISWAP_POOLS_QUERY,
  UNISWAP_FILTERED_POOLS_QUERY,
} from '../queries/external/uniswapPoolsQuery'
import useGraphQLQuery from '../useQuery'
import { UNISWAP_SUBGRAPHS } from './constants'

export async function useUniswapPools(networkId) {
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    UNISWAP_POOLS_QUERY,
  )
  if (data && data['pools']) {
    return data.pools.map((item) => ({
      ...item,
      chainId: networkId,
    }))
  }
  return []
}

export async function useFilteredUniswapPools(networkId, ids) {
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    UNISWAP_FILTERED_POOLS_QUERY(ids),
  )
  if (data && data['pools']) {
    return data.pools.map((item) => ({ ...item, chainId: networkId }))
  }
  return []
}
