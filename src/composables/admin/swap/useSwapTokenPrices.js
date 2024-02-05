import { useQuery } from '@tanstack/vue-query'
import useGraphQLQuery from '../../useQuery'
import { configService } from '@/services/config/config.service'
import { networkId } from '../../useNetwork'
import { PRICES_QUERY } from '@/composables/queries/pricesQuery'

export async function GetSwapTokenPrices() {
  let config = configService.getNetworkConfig(networkId.value)
  if (!config.poolsUrlV2) return []
  let data = await useGraphQLQuery(config.poolsUrlV2, PRICES_QUERY)
  if (data['tokenPrices']) {
    let prices = data['tokenPrices']
    return prices
  }
  return []
}

export function useSwapTokenPrices(options = {}) {
  return useQuery(['prices', networkId], GetSwapTokenPrices, {
    ...options,
    onError: (error) => {
      console.error('GraphQL query error:', error)
    },
    onSuccess: () => {},
  })
}
