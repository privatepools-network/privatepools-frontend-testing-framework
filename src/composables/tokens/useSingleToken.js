import useGraphQLQuery from '../useQuery'
import { configService } from '@/services/config/config.service'
import { SINGLE_TOKEN_QUERY } from '../queries/tokensQuery'
import { networkId } from '../useNetwork'

export async function GetSingleToken(network, token_address) {
  network = network ? network : networkId.value
  let config = configService.getNetworkConfig(network)
  if (!config.subgraph) return []
  let data = await useGraphQLQuery(
    config.subgraph,
    SINGLE_TOKEN_QUERY(token_address),
  )
  if (data && data['tokens']) {
    let tokens = data['tokens']
    return tokens[0]
  }
  return null
}
