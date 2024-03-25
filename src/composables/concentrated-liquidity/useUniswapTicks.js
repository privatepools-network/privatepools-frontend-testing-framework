import JSBI from 'jsbi'
import { UNISWAP_POOL_TICKS } from '../queries/external/uniswapTicks'
import useGraphQLQuery from '../useQuery'
import { UNISWAP_SUBGRAPHS } from './constants'

export async function useUniswapTicks(poolId, networkId) {
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    UNISWAP_POOL_TICKS(poolId),
  )
  if (data && data['ticks']) {
    return data.ticks.map((item) => ({
      index: item.tickIdx,
      liquidityGross: JSBI.BigInt(item.liquidityGross),
      liquidityNet: JSBI.BigInt(item.liquidityNet),
    }))
  }
  return []
}
