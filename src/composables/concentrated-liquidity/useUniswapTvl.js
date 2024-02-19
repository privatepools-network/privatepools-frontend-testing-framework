import { UNISWAP_TVL_QUERY } from '../queries/external/uniswapPoolQuery'
import useGraphQLQuery from '../useQuery'

const UNISWAP_SUBGRAPHS = {
  1: 'https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-ethereum',
  56: 'https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-bsc',
  137: 'https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-polygon',
}

export async function useUniswapTvl(poolId) {
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[1],
    UNISWAP_TVL_QUERY(poolId),
  )
  if (data && data['liquidityPools']) {
    return data.liquidityPools[0].totalValueLockedUSD
  }
  return 0
}
