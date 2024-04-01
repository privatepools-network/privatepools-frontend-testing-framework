import {
  UNISWAP_POOLS_QUERY,
  UNISWAP_FILTERED_POOLS_QUERY,
} from '../queries/external/uniswapPoolsQuery'
import useGraphQLQuery from '../useQuery'
import { UNISWAP_SUBGRAPHS } from './constants'
import { GetTokenPricesBySymbols } from '../balances/cryptocompare'
import { formatDateFromTimestamp, generateTimeAgoString } from '@/lib/utils'
import { usePoolHolders } from './usePoolHolders'
export async function useUniswapPools(networkId) {
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    UNISWAP_POOLS_QUERY,
  )
  if (data && data['pools']) {
    let token_symbols = Array.from(
      new Set(
        data['pools']
          .map((item) => [item.token0.symbol, item.token1.symbol])
          .flat(),
      ),
    )
    let token_prices = await GetTokenPricesBySymbols(token_symbols)
    calculatePoolTvls(data['pools'], token_prices)
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

function calculatePoolTvls(pools, token_prices) {
  for (let i = 0; i < pools.length; i++) {
    const pool = pools[i]
    pool.totalValueLockedUSD =
      pool.totalValueLockedToken0 * token_prices[pool.token0.symbol] +
      pool.totalValueLockedToken1 * token_prices[pool.token1.symbol]
  }
}

export async function GetSingleCLPool(network, poolId) {
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[network],
    UNISWAP_FILTERED_POOLS_QUERY([poolId]),
  )
  if (data.pools) {
    let token_symbols = Array.from(
      new Set(
        data['pools']
          .map((item) => [item.token0.symbol, item.token1.symbol])
          .flat(),
      ),
    )
    const token_prices = await GetTokenPricesBySymbols(token_symbols)
    const poolHolders = await usePoolHolders(poolId, network)
    calculatePoolTvls(data['pools'], token_prices)
    return data.pools.map((item) => ({
      ...item,
      chainId: network,
      createdAt: formatDateFromTimestamp(item.createdAtTimestamp),
      timeAgo: generateTimeAgoString(item.createdAtTimestamp),
      totalLiquidity: item.totalValueLockedUSD,
      lpPrice: item.totalValueLockedUSD / item.liquidity,
      holdersCount: poolHolders.length,
      tokens: [
        { ...item.token0, balance: item.totalValueLockedToken0, weight: 50 },
        { ...item.token1, balance: item.totalValueLockedToken1, weight: 50 },
      ],
    }))[0]
  }
  return null
}
