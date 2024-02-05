import axios from 'axios'

/**
 * Get swap quote for Odos DEX.
 * @function GetOdosQuote
 * @param {number} networkId - id of the chain 
 * @param {string} from - from token address
 * @param {string} to - to token address
 * @param {string} amount - unformatted amount
 * @returns {string} to amount for swap
 */
export async function GetOdosQuote(networkId, from, to, amount) {
  const body = {
    chainId: networkId,
    inputTokens: [
      {
        tokenAddress: from,
        amount: amount,
      },
    ],
    outputTokens: [
      {
        tokenAddress: to,
        proportion: 1,
      },
    ],
  }
  try {
    let response = await axios.post('https://api.odos.xyz/sor/quote/v2', body)
    if (response.data.outAmounts) {
      return response.data.outAmounts[0]
    }
    return '0'
  } catch (e) {
    console.error('ODOS - ', e)
    return '0'
  }
}
