import { UNISWAP_TVL_QUERY } from '../queries/external/uniswapPoolQuery'
import useGraphQLQuery from '../useQuery'
import { UNISWAP_SUBGRAPHS } from './constants'

export async function useUniswapTvl(poolId, networkId) {
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    UNISWAP_TVL_QUERY(poolId),
  )
  if (data && data['liquidityPools']) {
    return data.liquidityPools[0].totalValueLockedUSD
  }
  return 0
}
