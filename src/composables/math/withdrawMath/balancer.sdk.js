import { networkId } from '@/composables/useNetwork'
import { configService } from '@/services/config/config.service'
import { BalancerSDK } from '@wavelength/sdk'

export function InitBalancer() {
  let network_id = networkId.value || 56
  const config = configService.getNetworkConfig(network_id)
  console.log('PEDRO: ', network_id.toString(), config.rpc, config.poolsUrlV2) // Add this line to console log the arguments

  return new BalancerSDK({
    network: network_id.toString(),
    rpcUrl: config.rpc,
    subgraphUrl: config.poolsUrlV2,
  })
}
// END: ed8c6549bwf9`);
