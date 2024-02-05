import { Network } from '../useNetwork'

export const BACKEND_URL = {
  [Network.ARBITRUM]: process.env.VUE_APP_OUTPUT_LINK_ARBITRUM,
  [Network.POLYGON]: process.env.VUE_APP_OUTPUT_LINK_POLYGON,
  [Network.BINANCE]: process.env.VUE_APP_OUTPUT_LINK_BINANCE,
}
