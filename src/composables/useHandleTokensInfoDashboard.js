import { useTokenPricesChange } from './useTokenPriceChange'
import { GetTokens } from './tokens/useTokenSymbols'
import { usePool24hVolume } from './pools/usePoolSwapsStats'
import token_protocols_arbitrum from '@/lib/config/tokens_protocols_ARBITRUM'
import token_protocols_binance from '@/lib/config/tokens_protocols_BINANCE.js'
import token_protocols_polygon from '@/lib/config/tokens_protocols_POLYGON.js'
import { Network } from '@/composables/useNetwork'

const NETWORK_PROTOCOL = {
  [Network.ARBITRUM]: token_protocols_arbitrum,
  [Network.BINANCE]: token_protocols_binance,
  [Network.POLYGON]: token_protocols_polygon,
}

export default async function useHandleTokensInfoDashboard(
  chainSwapsData,
  network,
  toSymbol = 'USD',
) {
  let tokens = await GetTokens(network)
  console.log(network)
  let prices = await useTokenPricesChange(
    tokens.map((t) => t.symbol),
    toSymbol,
  )
  let result = []
  let protocol_tokens = NETWORK_PROTOCOL[network].map((t) => ({
    ...t,
    address: t.protocol.toLowerCase(),
  }))
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    let found = protocol_tokens.find((t) => t.address == token.id.toLowerCase())
    if (found) {
      let symbol = token.symbol
      symbol = symbol.charAt(0) == 'W' ? symbol.slice(1) : symbol
      symbol = symbol == 'BTCB' ? 'BTC' : symbol
      let priceInfo = prices['RAW'][symbol.toUpperCase()][toSymbol]
      let swaps = chainSwapsData.filter(
        (item) => item.token.toLowerCase() == token.id.toLowerCase(),
      )
      result.push({
        Name: found.name,
        Price: priceInfo.PRICE,
        Change: parseFloat(priceInfo.CHANGEPCT24HOUR).toFixed(2),
        Volume: `${usePool24hVolume(swaps).value}`,
        Balance: token.totalBalanceNotional,
        Symbol: token.symbol,
        BalanceUsd: parseFloat(token.totalBalanceUSD),
        id: token.id,
        symbol: token.symbol,
      })
    }
  }
  return result
}

// export default async function useHandleTokensInfoDashboard(
//   tokensRawData,
//   chain,
// ) {
//   let tokensInfo = []
//   let chainProtocol = PROTOCOLS[chain]
//   if (chainProtocol) {
//     let config_tokens = config[CONFIG_CHAIN[chain]].tokens
//     let token_keys = Object.keys(config_tokens)
//     let mapped_config_tokens = token_keys.map((t) => config_tokens[t])
//     let api_ids = mapped_config_tokens.map((t) => {
//       return t.apiId
//     })

//     let pricesChange = await useTokenPricesChange(api_ids)
//     tokensInfo = await Promise.all(
//       chainProtocol.map(async (elem) => ({
//         ...(await subgraphService.trades.getTokenInfo(
//           elem.protocol,
//           tokensRawData,
//           chain,
//           pricesChange,
//         )),
//         name: elem.name,
//       })),
//     )

//   }

//   const tradingVolumes = await useHandleTokensBalance(chain)
//   return tokensInfo.map((tokenInfo, i) => ({
//     Name: tokenInfo.name,
//     Price: tokenInfo.price,
//     Change: tokenInfo.priceChange,
//     Volume: tokenInfo.volume24 + ' $',
//     Balance:
//       Number(tradingVolumes[i].volume).toFixed(2) + ' ' + tokenInfo.symbol,
//   }))
// }
