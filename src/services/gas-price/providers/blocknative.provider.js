import axios from 'axios'

export const GWEI_UNIT = 1e9

export default class BlocknativeProvider {
  async getLatest(confidence = 'best') {
    try {
      const response = await axios.get(
        'https://api.blocknative.com/gasprices/blockprices',
        {
          headers: {
            Authorization: process.env.VUE_APP_BLOCKNATIVE_DAPP_ID,
          },
        },
      )
      const estimatedPrices = response.data.blockPrices[0].estimatedPrices

      let gasPrice

      // try to get 90% confidence, but make sure not to overpay. (otherwise grab 70%)
      if (confidence === 'best') {
        const gasPrice70 = estimatedPrices.find(
          (estimatedPrice) => estimatedPrice.confidence === 70,
        )
        const gasPrice90 = estimatedPrices.find(
          (estimatedPrice) => estimatedPrice.confidence === 90,
        )

        if (gasPrice70 != null && gasPrice90 != null) {
          gasPrice =
            gasPrice90.price > 1.25 * gasPrice70.price ? gasPrice70 : gasPrice90
        }
      } else {
        gasPrice = estimatedPrices.find(
          (estimatedPrice) => estimatedPrice.confidence === confidence,
        )
      }

      // gas price is in gwei
      if (gasPrice != null) {
        return {
          price: gasPrice.price * GWEI_UNIT,
          maxFeePerGas: gasPrice.maxFeePerGas * GWEI_UNIT,
          maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas * GWEI_UNIT,
        }
      }
    } catch (e) {
      console.log('[Blocknative] Gas Platform Error', e)
    }
    return null
  }
}
