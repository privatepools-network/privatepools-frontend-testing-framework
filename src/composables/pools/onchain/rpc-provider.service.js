import { WebSocketProvider, JsonRpcProvider } from '@ethersproject/providers'
import { configService } from '@/services/config/config.service'

export default class RpcProviderService {
  network
  jsonProvider
  wsProvider
  loggingProvider

  constructor(config = configService) {
    this.network = config.network.shortName
    this.jsonProvider = new JsonRpcProvider(config.rpc)
    this.wsProvider = new WebSocketProvider(config.ws)
    this.loggingProvider = new JsonRpcProvider(config.loggingRpc)
  }

  initBlockListener(newBlockHandler) {
    this.wsProvider.on('block', (newBlockNumber) =>
      newBlockHandler(newBlockNumber),
    )
  }

  async getBlockNumber() {
    return await this.jsonProvider.getBlockNumber()
  }

  getJsonProvider(networkKey) {
    const rpcUrl = `${this.config.getNetworkConfig(networkKey).rpc}/${
      this.config.env.INFURA_PROJECT_ID
    }`
    return new JsonRpcProvider(rpcUrl)
  }
}

export const rpcProviderService = new RpcProviderService()
