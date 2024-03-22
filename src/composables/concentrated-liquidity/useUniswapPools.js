import {
  UNISWAP_POOLS_QUERY,
  UNISWAP_FILTERED_POOLS_QUERY,
} from '../queries/external/uniswapPoolsQuery'
import useGraphQLQuery from '../useQuery'
import { UNISWAP_SUBGRAPHS } from './constants'
import { GetTokenPricesBySymbols } from '../balances/cryptocompare'
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
