import {
  UNISWAP_TVL_SNAPSHOTS_ALL_QUERY,
  UNISWAP_TVL_SNAPSHOTS_QUERY,
} from '../queries/external/uniswapTvlSnapshotsQuery'
import useGraphQLQuery from '../useQuery'
import { UNISWAP_SUBGRAPHS } from './constants'

export async function useUniswapTvlSnapshots(poolId) {
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[1],
    poolId
      ? UNISWAP_TVL_SNAPSHOTS_QUERY(poolId)
      : UNISWAP_TVL_SNAPSHOTS_ALL_QUERY,
  )
  if (data && data['liquidityPoolDailySnapshots']) {
    return data.liquidityPoolDailySnapshots
  }
  return 0
}
