import { configService } from '@/services/config/config.service'
import { DisplayNetwork, networkId } from '../useNetwork'
import { TVL_QUERY } from '../queries/tvlQuery'
import useGraphQLQuery from '../useQuery'

export async function GetPoolsTvl(network, options = null, subgraph = false) {
  network = network ? network : networkId.value
  let config = configService.getNetworkConfig(network)
  let url = subgraph ? config.subgraph : config.poolsUrlV2
  if (!url) return []
  let data = await useGraphQLQuery(url, TVL_QUERY)
  if (data && data['pools']) {
    let pools = data['pools']
    if (options && options['id']) {
      pools = pools.filter((p) => p.id == options['id'])
    }
    return pools.map((p) => ({ ...p, chain: DisplayNetwork[network] }))
  }
  return []
}
