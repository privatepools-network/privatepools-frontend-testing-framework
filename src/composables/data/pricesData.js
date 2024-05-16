import axios from 'axios'
import { BACKEND_URL, REDUNDANT_BACKEND_URL } from '../pools/mappings'
export async function getPrices(network, tokenIds, toToken = 'USD') {
  try {
    return await getPricesByUrl(BACKEND_URL[network], tokenIds, toToken)
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  return await getPricesByUrl(REDUNDANT_BACKEND_URL[network], tokenIds, toToken)
}

export async function getSinglePrice(network, token, toToken = 'USD') {
  const prices = await getPrices(network, [token], toToken)
  return prices[token]
}

async function getPricesByUrl(base_url, tokenIds, toToken = 'USD') {
  const url = `${base_url}/prices?symbols=${tokenIds}&toToken=${toToken}`

  const response = await axios.get(url)
  const result = {}
  for (const [key, value] of Object.entries(response.data)) {
    result[key] = value[toToken]
  }
  return result
}
