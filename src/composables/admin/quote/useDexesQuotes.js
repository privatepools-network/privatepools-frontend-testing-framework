import { configService } from '@/services/config/config.service'
import { ethers } from 'ethers'
import erc20abi from '@/lib/abi/ERC20.json'
//import { Get1InchQuote } from './dexes/use1InchQuote'
import { GetParaSwapQuote } from './dexes/useParaSwapQuote'
import { GetOrionQuote } from './dexes/useOrionQuote'
import { GetOdosQuote } from './dexes/useOdosQuote'

/**
 * @typedef {{
 * '1inch':string,
 * 'firebird':string,
 * 'paraswap':string,
 * 'odos':string,
 * 'orion':string,
 * }} DexesQuotes
 */

/**
 * Get quotes info for 5 DEXes (1inch, firebird, paraswap, odos, orion)
 * @function UseDexesQuotes
 * @param {number} networkId - id of the chain
 * @param {string} fromToken - which token to convert into @see toToken
 * @param {string} toToken - to which token @see fromToken should be converted
 * @param {string} amount - unformatted amount
 * @returns {DexesQuotes} quotes for 5 different DEXes
 */
export async function UseDexesQuotes(networkId, fromToken, toToken, amount) {
  let [decimalsFrom, decimalsTo] = await GetDecimals(
    networkId,
    fromToken.address,
    toToken.address,
  )
  const result = {
    '1inch': '0',
    firebird: '0',
    paraswap: '0',
    odos: '0',
    orion: '0',
  }
  let rawAmount = ethers.utils.parseUnits(amount, decimalsFrom).toString()
  let dex_values = await Promise.all([
    GetParaSwapQuote(
      networkId,
      fromToken.address,
      toToken.address,
      decimalsFrom,
      decimalsTo,
      rawAmount,
    ),
    GetOrionQuote(networkId, fromToken.symbol, toToken.symbol, amount),
    GetOdosQuote(networkId, fromToken.address, toToken.address, rawAmount),
  ])
  result['paraswap'] = ethers.utils.formatUnits(dex_values[0], decimalsTo)
  result['orion'] = dex_values[1]
  result['odos'] = ethers.utils.formatUnits(dex_values[2], decimalsTo)
  return result
}

/**
 * Get decimals for swap's tokens.
 * @function GetDecimals
 * @param {number} networkId - id of the chain
 * @param {string} fromToken - from token address
 * @param {string} toToken - to token address
 * @returns {number[]} array with decimals for from/to tokens
 */
async function GetDecimals(networkId, fromToken, toToken) {
  let config = configService.getNetworkConfig(networkId)
  let provider = new ethers.providers.JsonRpcProvider(config.rpc)
  let fromTokenContract = new ethers.Contract(fromToken, erc20abi, provider)
  let toTokenContract = new ethers.Contract(toToken, erc20abi, provider)
  let decimals = await Promise.all([
    fromTokenContract.decimals(),
    toTokenContract.decimals(),
  ])
  return decimals
}
