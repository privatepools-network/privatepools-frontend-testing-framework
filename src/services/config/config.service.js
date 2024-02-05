import configs from '@/lib/config'
import template from '@/lib/utils/template'
import { networkId } from '@/composables/useNetwork'

export default class ConfigService {
  env() {
    return {
      APP_ENV: process.env.VUE_APP_ENV || 'production',
      NETWORK: networkId.value,
      APP_DOMAIN: process.env.VUE_APP_DOMAIN || 'app.wavelength.exchange',
      IPFS_NODE: process.env.VUE_APP_IPFS_NODE || 'ipfs.io',
      BLOCKNATIVE_DAPP_ID:
        process.env.VUE_APP_BLOCKNATIVE_DAPP_ID || 'MISSING_KEY',
      ALCHEMY_KEY:
        process.env.VUE_APP_ALCHEMY_KEY ||
        this.getNetworkConfig(networkId.value).keys.alchemy ||
        'MISSING_KEY',
      INFURA_PROJECT_ID:
        process.env.VUE_APP_INFURA_PROJECT_ID ||
        this.getNetworkConfig(networkId.value).keys.infura ||
        'MISSING_KEY',
      ENABLE_STABLE_POOLS: process.env.VUE_APP_ENABLE_STABLE_POOLS === 'true',
      PORTIS_DAPP_ID: process.env.VUE_APP_PORTIS_DAPP_ID || 'MISSING_KEY',
      BACKEND_URL: this.getNetworkConfig(networkId.value).backendUrl,
    }
  }

  network() {
    return configs[networkId.value]
  }

  getNetworkConfig(key) {
    if (!Object.keys(configs).includes(key.toString())) return {}
    return configs[key]
  }

  rpc() {
    return template(this.network.rpc, {
      INFURA_KEY: this.env.INFURA_PROJECT_ID,
      ALCHEMY_KEY: this.env.ALCHEMY_KEY,
    })
  }

  ws() {
    return template(this.network.ws, {
      INFURA_KEY: this.env.INFURA_PROJECT_ID,
      ALCHEMY_KEY: this.env.ALCHEMY_KEY,
    })
  }

  loggingRpc() {
    return template(this.network.loggingRpc, {
      INFURA_KEY: this.env.INFURA_PROJECT_ID,
      ALCHEMY_KEY: this.env.ALCHEMY_KEY,
    })
  }
}

export const configService = new ConfigService()
