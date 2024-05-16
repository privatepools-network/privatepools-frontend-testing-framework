import axios from 'axios'
import { BACKEND_URL, REDUNDANT_BACKEND_URL } from '../pools/mappings'
export async function getTokensData(network) {
  try {
    const url = `${BACKEND_URL[network]}/data/composeTokens`
    const data = await axios.get(url)
    return data.data
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  return (
    await axios.get(`${REDUNDANT_BACKEND_URL[network]}/data/composeTokens`)
  ).data
}
