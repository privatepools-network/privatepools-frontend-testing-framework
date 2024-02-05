import { useQuery } from '@tanstack/vue-query'
import useBalance from '../useBalance'
import { getJsonRpcProvider } from '../useProvider'
import { networkId } from '../useNetwork'

// Define your useGraphqlQuery wrapper function
export function useTokenBalances(tokens, wallet_address, options = {}) {
  const queryFn = async () => {
    const balances = {}
    console.log('TOKENS - ', tokens)
    let provider = getJsonRpcProvider(networkId.value)
    tokens.map(async (t) => {
      let result = await useBalance(t, provider, wallet_address)
      balances[t] = result
    })
    return balances
  }
  return useQuery(['tokenBalance'], queryFn, {
    ...options,
    onError: (error) => {
      console.error('Balance query error:', error)
    },
    onSuccess: () => {},
  })
}
