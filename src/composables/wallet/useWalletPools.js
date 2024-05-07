import { GetAllUserShares } from '../pools/usePoolShares'
import { USER_POSITIONS_QUERY } from '../queries/external/uniswapPositionsQuery'
import useGraphQLQuery from '../useQuery'
import { UNISWAP_SUBGRAPHS } from '../concentrated-liquidity/constants'
import { useFilteredUniswapPools } from '@/composables/concentrated-liquidity/useUniswapPools'
export async function useWalletPools(
  address,
  networkId,
  includeStatsInfo = true,
) {
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    USER_POSITIONS_QUERY(address),
  )

  if (data && data['positions']) {
    let user_shares = await GetAllUserShares(address)
    let user_pools = user_shares.map((item) => item.poolId.id)
    let cl_pools = formatCLPools(data['positions'])
    console.log('WALLET POOLS PARSED')
    return [
      ...user_pools.map((item) => ({ id: item })),
      ...cl_pools.map((item) => item.id),
    ]
  }
  return []
}

export async function GetUserUniswapPools(address, networkId) {
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    USER_POSITIONS_QUERY(address),
  )
  if (data && data['positions']) {
    let pool_ids = Array.from(
      new Set(data['positions'].map((item) => item.pool.id).flat()),
    )
    let filtered_pools = await useFilteredUniswapPools(networkId, pool_ids)
    return filtered_pools
  }
  return []
}

function formatCLPools(positions) {
  let formatted = []
  let unique_pools = Array.from(new Set(positions.map((item) => item.pool.id)))
  for (let i = 0; i < unique_pools.length; i++) {
    let pool_positions = positions.filter(
      (item) => item.pool.id == unique_pools[i],
    )
    let deposited0 = 0
    let deposited1 = 0
    let symbol0 = null
    let symbol1 = null
    for (let k = 0; k < pool_positions.length; k++) {
      if (!symbol0) {
        symbol0 = pool_positions[k].token0.symbol
        symbol1 = pool_positions[k].token1.symbol
      }
      deposited0 += parseFloat(pool_positions[k].depositedToken0)
      deposited1 += parseFloat(pool_positions[k].depositedToken1)
    }
    if (deposited0 > 0 || deposited1 > 0) {
      formatted.push({
        id: unique_pools[i],
        label: `${symbol0} / ${symbol1}`,
        img: '',
        percentChange: '0',
      })
    }
  }
  return formatted
}
