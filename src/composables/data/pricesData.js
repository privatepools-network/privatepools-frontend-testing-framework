import axios from 'axios'
import { BACKEND_URL } from '../pools/mappings'
export async function getPrices(network, tokenIds, toToken = 'USD') {
  const url = `${BACKEND_URL[network]}/prices?symbols=${tokenIds}&toToken=${toToken}`
  const response = await axios.get(url)
  const result = {}
  for (const [key, value] of Object.entries(response.data)) {
    result[key] = value[toToken]
  }
  return result
}
export async function getSinglePrice(network, token, toToken = 'USD') {
  const prices = await getPrices(network, [token], toToken)
  return prices[token]
}
