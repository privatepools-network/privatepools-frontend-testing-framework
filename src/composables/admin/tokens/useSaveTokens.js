import axios from 'axios'
import { NETWORK_SHORT_NAME, NETWORK_URL } from '../mappings'

export async function useSaveTokens(network, selectedTokens) {
  let addresses = selectedTokens.map((t) => t.address)
  let addresses_joined = addresses.join(',')
  const url = `${NETWORK_URL[network.name]}tokens/${
    NETWORK_SHORT_NAME[network.name]
  }/addTokensToTrade/${addresses_joined}`
  let response = await axios.get(url)
  return response
}
