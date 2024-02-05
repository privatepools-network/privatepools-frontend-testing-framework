import tokens_protocols from '@/lib/config/tokens_protocols_ARBITRUM'
import tokens_protocols_BINANCE from '@/lib/config/tokens_protocols_BINANCE.js'
import tokens_protocols_POLYGON from '@/lib/config/tokens_protocols_POLYGON.js'
import { Network } from '@wavelength/sdk'
import { Network as CustomNetwork } from '@/composables/useNetwork'
export const PROTOCOLS = {
  binance: tokens_protocols_BINANCE,
  polygon: tokens_protocols_POLYGON,
  arbitrum: tokens_protocols,
}

export const CONFIG_CHAIN = {
  binance: Network.BINANCE,
  polygon: Network.POLYGON,
  arbitrum: Network.ARBITRUM,
}
export const CUSTOM_CONFIG_CHAIN = {
  binance: CustomNetwork.BINANCE,
  polygon: CustomNetwork.POLYGON,
  arbitrum: CustomNetwork.ARBITRUM,
}
