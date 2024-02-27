import { GetTokenPricesBySymbols } from '../balances/cryptocompare'
import { GetPoolSwapsData } from '../pools/charts/usePoolSwapsData'
import { GetAllUserShares } from '../pools/usePoolShares'
import { GetPools } from '../pools/usePools'
import { USER_POSITIONS_QUERY } from '../queries/external/uniswapPositionsQuery'
import { DisplayNetwork } from '../useNetwork'
import useGraphQLQuery from '../useQuery'
import { UNISWAP_SUBGRAPHS } from '../concentrated-liquidity/constants'
import { GetHistoricalTvl } from '@/composables/pools/snapshots/usePoolHistoricalTvl'
import { addAPRInfo } from '@/lib/formatter/poolsFormatter'

export async function useWalletPools(address, networkId) {
  // DELETE
  // address = '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0'
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    USER_POSITIONS_QUERY(address),
  )
  if (data && data['positions']) {
    let token_symbols = Array.from(
      new Set(
        data['positions']
          .map((item) => [item.token0.symbol, item.token1.symbol])
          .flat(),
      ),
    )
    let user_shares = await GetAllUserShares(address)
    let user_pools = user_shares.map((item) => item.poolId.id)
    user_pools = user_pools.length > 0 ? user_pools : null
    let [token_prices, historical_tvl, swaps_data, pools] = await Promise.all([
      GetTokenPricesBySymbols(token_symbols),
      GetHistoricalTvl(networkId, null, 'USD', user_pools),
      GetPoolSwapsData(null, networkId),
      GetPools(networkId, null, true, true, 'USD', user_pools),
    ])
    if (!pools) return []
    pools = pools.map((pool) => ({
      ...pool,
      ...addAPRInfo(
        historical_tvl.filter((item) => item.pool.id == pool.id),
        swaps_data.filter(
          (item) => item.swaps[0].poolIdVault[0],
          DisplayNetwork[networkId],
        ),
      ),
    }))
    let cl_pools = formatCLPools(data['positions'], token_prices)
    console.log('WALLET POOLS PARSED')
    return [...formatWeightedPools(user_shares, pools), ...cl_pools]
  }
  return []
}

function formatCLPools(positions, token_prices) {
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
      let tvl0 = deposited0 * token_prices[symbol0]
      let tvl1 = deposited1 * token_prices[symbol1]
      formatted.push({
        id: unique_pools[i],
        label: `${symbol0} / ${symbol1}`,
        img: '',
        percentChange: '0',
        price: `$${(tvl0 + tvl1).toFixed(2)}`,
        tvlToken0: tvl0,
        tvlToken1: tvl1,
      })
    }
  }
  return formatted
}

function formatWeightedPools(shares, pools) {
  let formatted = []
  for (let i = 0; i < shares.length; i++) {
    let pool = pools.find((item) => item.id == shares[i].poolId.id)
    formatted.push({
      label: pool.tokens.map((item) => item.symbol).join(' / '),
      price: `$${(pool.lpPrice * shares[i].balance).toFixed(2)}`,
      img: `APR ${pool['APR 7 D']}%`,
      percentChange: '0',
    })
  }
  return formatted
}
