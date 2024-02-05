import { useQuery } from '@tanstack/vue-query'
import { GetTokenPriceUsd } from './cryptocompare'


export function useCryptoCompareTokenPrices(pool, options = {}) {
  const queryFn = async () => {
    let tokens = pool.value.tokens
    let result = {}
    if (!tokens.length) return {}
    for (let i = 0; i < tokens.length; i++) {
      result[tokens[i].address] = await GetTokenPriceUsd(tokens[i].symbol)
    }
    return result
  }
  return useQuery(['cryptoCompareTokenPrices'], queryFn, {
    ...options,
    onError: (error) => {
      console.error('Balance query error:', error)
    },
    onSuccess: () => {},
  })
}
