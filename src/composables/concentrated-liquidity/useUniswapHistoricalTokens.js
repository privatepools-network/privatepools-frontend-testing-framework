import { UNISWAP_HISTORICAL_TOKENS_QUERY } from '../queries/external/uniswapHistoricalTokensQuery'
import useGraphQLQuery from '../useQuery'
import { UNISWAP_SUBGRAPHS } from './constants'

export async function useUniswapHistoricalTokens(poolId, networkId) {
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    UNISWAP_HISTORICAL_TOKENS_QUERY(poolId),
  )
  if (data && data['poolTokenHourDatas']) {
    return data.poolTokenHourDatas
  }
  return []
}
