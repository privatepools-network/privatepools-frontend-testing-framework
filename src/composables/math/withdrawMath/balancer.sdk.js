import { networkId } from '@/composables/useNetwork'
import { configService } from '@/services/config/config.service'
import { BalancerSDK } from '@wavelength/sdk'

export function InitBalancer() {
  const config = configService.getNetworkConfig(networkId.value)
 
  console.log("PEDRO: ",networkId.value.toString(), config.rpc, config.poolsUrlV2); // Add this line to console log the arguments

  return new BalancerSDK({
    network: networkId.value.toString(),
    rpcUrl: config.rpc,
    subgraphUrl: config.poolsUrlV2,
  })
}
// END: ed8c6549bwf9`);
