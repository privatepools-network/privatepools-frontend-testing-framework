import { networkId } from '@/composables/useNetwork'
import ConfigService, { configService } from '../config/config.service'
import BlocknativeProvider from './providers/blocknative.provider'
import PolygonProvider from './providers/polygon.provider'

export default class GasPriceService {
  constructor(
    configService = new ConfigService(),
    blocknativeProvider = new BlocknativeProvider(),
    polygonProvider = new PolygonProvider(),
  ) {
    this.configService = configService
    this.blocknativeProvider = blocknativeProvider
    this.polygonProvider = polygonProvider
  }

  async getLatest() {
    this.configService = configService.getNetworkConfig(networkId.value)
    switch (this.configService.network.key) {
      case '1':
        return await this.blocknativeProvider.getLatest()
      case '137':
        return await this.polygonProvider.getLatest()
      default:
        return null
    }
  }
}
