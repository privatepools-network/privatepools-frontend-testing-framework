//https://github.com/orionprotocol/sdk#api-key
//https://github.com/orionprotocol/sdk/blob/982ec94d401e9d531c2423bb6b94b92899e27127/src/config/envs.json
///

import axios from 'axios'

const ORION_URLS = {
  137: 'https://trade.orion.xyz/polygon-mainnet/backend/',
  56: 'https://trade.orion.xyz/bsc-mainnet/backend/',
}

/**
 * Get swap quote for Orion DEX.
 * @function GetOrionQuote
 * @param {number} networkId - id of the chain
 * @param {string} fromSymbol - from token symbol
 * @param {string} toSymbol - to token symbol
 * @param {string} amountWithDecimals - formatted amount
 * @returns {string} to amount for swap
 */
export async function GetOrionQuote(
  networkId,
  fromSymbol,
  toSymbol,
  amountWithDecimals,
) {
  if (!ORION_URLS[networkId]) return 0
  const baseUrl = ORION_URLS[networkId]
  try {
    let url = `${baseUrl}api/v1/swap?type=exactSpend&assetIn=${fromSymbol}&assetOut=${toSymbol}&amountIn=${amountWithDecimals}`
    let response = await axios.get(url)
    if (response.data.amountOut) {
      return response.data.amountOut
    }
    return 0
  } catch (e) {
    console.error('ORION', e)
    return 0
  }
}
