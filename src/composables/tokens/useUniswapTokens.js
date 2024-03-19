import axios from 'axios'
import { removeDuplicates } from '../../lib/utils'
import useGraphQLQuery from '../useQuery'
import { UNISWAP_TOKENS_QUERY } from '../queries/external/uniswapTokensQuery'
import { UNISWAP_SUBGRAPHS } from '../concentrated-liquidity/constants'

export async function fetchUniswapTokens(networkId) {
  const url = 'https://tokens.coingecko.com/binance-smart-chain/all.json'
  let existing_tokens = await useUniswapTokens(networkId)
  let response = await axios.get(url)
  return removeDuplicates(
    existing_tokens.concat(
      response.data.tokens
        .filter((item) => item['chainId'] == networkId)
        .map((t) => ({
          ...t,
          price: 0,
          balance: 0,
          img: t.logoURI,
        })),
    ),
    'address',
  )
}

async function useUniswapTokens(networkId) {
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    UNISWAP_TOKENS_QUERY,
  )
  if (data && data['tokens']) {
    let tokens = data['tokens'].map((t) => ({
      ...t,
      address: t.id,
      symbol: t.symbol.toUpperCase(),
      price: 0,
      balance: 0,
    }))
    return tokens
  }
  return []
}
