import { subgraphService } from '@/services/subgraph/subgraph.service'
import tokens_protocols from '@/lib/config/tokens_protocols_ARBITRUM'
import tokens_protocols_BINANCE from '@/lib/config/tokens_protocols_BINANCE.js'
import tokens_protocols_POLYGON from '@/lib/config/tokens_protocols_POLYGON.js'
import { useHandleTokensBalance } from './useHandleTokensBalance'
import { GetTokensAll } from './admin/tokens/useTokensAll'

export default async function useHandleTokensInfo(
  tokensRawData,
  selectedChain,
  chain
) {
let tokensInfo = []
if(chain == "arbitrum"){
  tokensInfo = await Promise.all(
    tokens_protocols.map(async (elem) => ({
      ...(await subgraphService.trades.getTokenInfo(
        elem.protocol,
        tokensRawData,
        chain
      )),
      name: elem.name,
    })),
  )
console.log("TEE ARBITRUM TOKEN INFO: ", tokensInfo.length)
}
  if(chain == "binance"){
    tokensInfo = await Promise.all(
      tokens_protocols_BINANCE.map(async (elem) => ({
        ...(await subgraphService.trades.getTokenInfo(
          elem.protocol,
          tokensRawData,
          chain
        )),
        name: elem.name,
      })),
    )
  console.log("TEE BSC TOKEN INFO: ", tokensInfo.length)
  }

  if(chain == "polygon"){
    tokensInfo = await Promise.all(
      tokens_protocols_POLYGON.map(async (elem) => ({
        ...(await subgraphService.trades.getTokenInfo(
          elem.protocol,
          tokensRawData,
          chain
        )),
        name: elem.name,
      })),
    )
  console.log("TEE BSC TOKEN INFO: ", tokensInfo.length)
  }

  const tradingVolumes = await useHandleTokensBalance(chain)
  console.log("PUTAS 1")

  let tokensAll = await GetTokensAll(selectedChain.value)
  console.log("PUTAS 2")

  let result = []
  console.log("PUTAS 3")
  for (let i = 0; i < tokensInfo.length; i++) {
    let tokenInfo = tokensInfo[i]
    let foundToken = tokensAll.find((t) => t.address.toLowerCase() == tokenInfo.address.toLowerCase())
    let amountsInfo = {
      'Initial Amount': 0,
      'Loop Amount': 0,
      'Max Amount': 0,
      'Min Profit': 0,
    }
    if (foundToken && foundToken.initialAmount) {
      amountsInfo = {
        'Initial Amount': foundToken.initialAmount,
        'Loop Amount': foundToken.sum,
        'Max Amount': foundToken.maxAMount,
        'Min Profit': foundToken.minArbAmount,
      }
    }
    
    result.push({
      Name: tokenInfo.name,
      Price: tokenInfo.price + ' $',
      Change: tokenInfo.priceChange,
      Volume24h: tokenInfo.volume24 + ' $',
      Balance:
        Number(tradingVolumes[i].volume).toFixed(2) + ' ' + tokenInfo.symbol,
      ...amountsInfo,
    })
  }
  return result
}
