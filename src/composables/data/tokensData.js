import axios from 'axios'
import { BACKEND_URL } from '../pools/mappings'
export async function getTokensData(network) {
  const url = `${BACKEND_URL[network]}/data/composeTokens`
  const data = await axios.get(url)
  return data.data
}
