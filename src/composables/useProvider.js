import { JsonRpcProvider } from '@ethersproject/providers'
import { Network } from '@/composables/useNetwork'
import config from '@/lib/config'

export function getJsonRpcProvider(networkId) {
  return new JsonRpcProvider(config[networkId].rpc)
}

const provider = (chain) =>
  getJsonRpcProvider(
    chain == 'binance'
      ? Network.BINANCE
      : chain == 'arbitrum'
      ? Network.ARBITRUM
      : Network.POLYGON,
  )

export default function useProvider(chain) {
  const provider2 = provider(chain)
  return {
    provider2,
  }
}
