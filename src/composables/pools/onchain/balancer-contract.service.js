import Vault from './vault'
import {
  WeightedPool__factory,
  StablePool__factory,
  InvestmentPool__factory,
} from '@balancer-labs/typechain'
import LinearPoolAbi from '@/lib/abi/LinearPool.json'
import ERC20_ABI from '@/lib/abi/ERC20.json'
import { rpcProviderService as _rpcProviderService } from './rpc-provider.service'
import { configService as _configService } from '@/services/config/config.service'
import { networkId } from '@/composables/useNetwork'

export default class BalancerContractsService {
  vault
  config
  provider

  constructor(
    configService = _configService.getNetworkConfig(networkId.value),
    rpcProviderService = _rpcProviderService,
  ) {
    this.provider = rpcProviderService.jsonProvider
    this.config = configService
    // Init contracts
    this.vault = new Vault(this)
  }

  // Combine all the ABIs and remove duplicates
  get allPoolABIs() {
    return Object.values(
      Object.fromEntries(
        [
          ...WeightedPool__factory.abi,
          ...StablePool__factory.abi,
          ...InvestmentPool__factory.abi,
          //...StablePhantomPool,
          ...LinearPoolAbi,
          //...StaticATokenLMAbi,
          ...ERC20_ABI,
          //...YearnTokenVault
        ].map((row) => [row.name, row]),
      ),
    )
  }
}

export const balancerContractsService = new BalancerContractsService()
