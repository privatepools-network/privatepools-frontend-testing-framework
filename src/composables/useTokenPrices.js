import { useQuery } from '@tanstack/vue-query'
import useGraphQLQuery from './useQuery'
import { configService } from '@/services/config/config.service'
import {
  TokensPricesQuery,
  FilteredTokensPricesQuery,
} from './queries/tokenPricesQuery'
import { networkId } from './useNetwork'
export async function GetPoolTokenPrices(addresses, network) {
  network = network ? network : networkId.value
  let config = configService.getNetworkConfig(network)
  if (!config) return []
  let query = TokensPricesQuery(addresses)
  let data = await useGraphQLQuery(config.subgraph, query)
  if (data['tokenPrices']) {
    let tokenPrices = data['tokenPrices'].filter((item) => item.priceUSD != '0')
    let result = {}
    for (let i = 0; i < tokenPrices.length; i++) {
      let asset = tokenPrices[i].asset
      if (!result[asset]) {
        result[asset] = []
      }
      result[asset].push(tokenPrices[i])
    }
    return result
  }
  return {}
}

// Define your useGraphqlQuery wrapper function
export function useTokenPrices(addresses, options = {}) {
  return useQuery(['tokenPrices'], () => GetPoolTokenPrices(addresses), options)
}

export async function GetFilteredTokenPrices(assets, pricingAssets, network) {
  network = network ? network : networkId.value
  let config = configService.getNetworkConfig(network)
  if (!config) return []
  let query = FilteredTokensPricesQuery(assets, pricingAssets)
  let data = await useGraphQLQuery(config.subgraph, query)
  if (data['tokenPrices']) {
    let tokenPrices = data['tokenPrices'].filter((item) => item.price != '0')
    return tokenPrices
  }
  return {}
}
