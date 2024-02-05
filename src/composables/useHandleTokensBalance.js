import { getJsonRpcProvider } from '@/composables/useProvider'
import useBalance from '@/composables/useBalance'
import {
  CONFIG_CHAIN,
  CUSTOM_CONFIG_CHAIN,
  PROTOCOLS,
} from './utils/chain_mappings'
import config from '@/lib/config'

const DEFAULT_WALLET = process.env.VUE_APP_ARBITRAGE_WALLET.toString()
export const useHandleTokensBalance = async (chain) => {
  const provider = getJsonRpcProvider(CUSTOM_CONFIG_CHAIN[chain])
  let config_tokens = Object.values(config[CONFIG_CHAIN[chain]].tokens)
  let tokensVolume
  let chainProtocol = PROTOCOLS[chain]
  if (chainProtocol) {
    tokensVolume = await Promise.all(
      chainProtocol.map(async (elem) => {
        let token = config_tokens.find((t) => t.address == elem.protocol)
        let decimals = null
        if (token) decimals = token.decimals
        return {
          value: await useBalance(
            elem.protocol,
            provider,
            DEFAULT_WALLET,
            decimals,
          ),
          name: elem.name,
        }
      }),
    )
  }

  // console.log('tokensVolume:\t', tokensVolume)

  return tokensVolume.map((tokenInfo) => ({
    // [tokenInfo.name]: tokenInfo.value,
    name: tokenInfo.name,
    volume: tokenInfo.value,
  }))
}
