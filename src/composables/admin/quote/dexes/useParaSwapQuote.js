import axios from 'axios'

/**
 * Get swap quote for ParaSwap DEX.
 * @function GetParaSwapQuote
 * @param {number} networkId - id of the chain
 * @param {string} src - from token address
 * @param {string} dst - to token address
 * @param {number} srcDecimals - from token decimals
 * @param {number} destDecimals - to token decimals
 * @param {string} amount - formatted amount
 * @returns {string} to amount for swap
 */
export async function GetParaSwapQuote(
  networkId,
  src,
  dst,
  srcDecimals,
  destDecimals,
  amount,
) {
  try {
    const url = `https://apiv5.paraswap.io/prices/?srcToken=${src}&destToken=${dst}&amount=${amount}&srcDecimals=${srcDecimals}&destDecimals=${destDecimals}&side=SELL&network=${networkId}`
    let response = await axios.get(url)
    if (response.data.priceRoute.destAmount) {
      return response.data.priceRoute.destAmount
    }
    return 0
  } catch (e) {
    console.error('PARASWAP - ', e)
    return 0
  }
}
