import { GetTokenPricesBySymbols } from '../balances/cryptocompare'
import { UNISWAP_SHARES_QUERY } from '../queries/external/uniswapSharesQuery'
import useGraphQLQuery from '../useQuery'
import { fetchPositions } from './cl'
import { UNISWAP_SUBGRAPHS } from './constants'

export async function useUniswapShares(poolId, signer, networkId) {
  const address = '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0' //await signer.getAddress()
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    UNISWAP_SHARES_QUERY(poolId, address),
  )
  if (data && data['positions'] && data.positions.length > 0) {
    const token0 = data.positions[0].token0
    const token1 = data.positions[0].token1
    const positions = await fetchPositions(
      signer,
      [
        { ...token0, address: token0.id },
        { ...token1, address: token1.id },
      ],
      networkId,
      data.positions[0].pool.feeTier,
    )
    const token_prices = await GetTokenPricesBySymbols([
      token0.symbol,
      token1.symbol,
    ])
    const token0_deposited = positions.reduce(
      (sum, item) => sum + parseFloat(item.amountReadable0),
      0,
    )
    const token1_deposited = positions.reduce(
      (sum, item) => sum + parseFloat(item.amountReadable1),
      0,
    )
    return {
      token0Usd: token0_deposited * token_prices[token0.symbol],
      token1Usd: token1_deposited * token_prices[token1.symbol],
      token0: token0_deposited,
      token1: token1_deposited,
    }
  }
  return {
    token0Usd: 0,
    token1Usd: 0,
    token0: 0,
    token1: 0,
  }
}
