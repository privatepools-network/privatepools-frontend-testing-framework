import arbitrum from './arbitrum.js'
import binance from './binance.js'
import polygon from './polygon.js'
import { Network } from '@/composables/useNetwork'

const config = {
  [Network.ARBITRUM]: arbitrum,
  [Network.BINANCE]: binance,
  [Network.POLYGON]: polygon,
  userWallet: process.env.VUE_APP_ARBITRAGE_WALLET.toString(),
}

export default config
