import axios from 'axios'
import { GWEI_UNIT } from './blocknative.provider'

export default class PolygonProvider {
  async getLatest(txSpeed = 'standard') {
    try {
      const { data } = await axios.get(
        'https://gasstation-mainnet.matic.network',
      )
      return { price: data[txSpeed] * GWEI_UNIT }
    } catch (error) {
      console.log('[Polygon] Gas Platform Error', error)
      return null
    }
  }
}
