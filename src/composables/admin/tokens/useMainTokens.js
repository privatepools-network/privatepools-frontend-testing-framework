import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { NETWORK_SHORT_NAME, NETWORK_URL } from '../mappings'

export async function GetMainTokens(networkName) {
  let networkShortName = NETWORK_SHORT_NAME[networkName.name]
  const url = `${
    NETWORK_URL[networkName.name]
  }tokens/${networkShortName}/mainTokens`
  let response = await axios.get(url)
  return response.data
}

// Define your useGraphqlQuery wrapper function
export function useMainTokens(networkName, options = {}) {
  const queryFn = async () => {
    return await GetMainTokens(networkName.value)
  }
  return useQuery(['mainTokens', networkName], queryFn, {
    ...options,
    onError: (error) => {
      console.error('Dex query error:', error)
    },
    onSuccess: () => {},
  })
}
