import axios from 'axios'
import { NETWORK_SHORT_NAME, NETWORK_URL } from '../mappings'

export async function useSaveDexes(network, selectedTokens) {
  let codes = selectedTokens.map((t) => t.code)
  let codes_joined = codes.join(',')

  let response = await axios.get(
    `${NETWORK_URL[network.name]}oneinch/${
      NETWORK_SHORT_NAME[network.name]
    }/addRoute/${codes_joined}`,
  )
  return response
}
