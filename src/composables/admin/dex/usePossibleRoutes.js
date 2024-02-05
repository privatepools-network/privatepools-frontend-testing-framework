import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { NETWORK_SHORT_NAME, NETWORK_URL } from '../mappings'

export async function GetPossibleRoutes(networkName) {
  let networkShortName = NETWORK_SHORT_NAME[networkName.name]
  const url = `${
    NETWORK_URL[networkName.name]
  }oneinch/${networkShortName}/possibleRoutes`
  let response = await axios.get(url)
  return response.data
}

// Define your useGraphqlQuery wrapper function
export function usePossibleRoutes(networkName, options = {}) {
  const queryFn = async () => {
    return await GetPossibleRoutes(networkName.value)
  }
  return useQuery(['possibleRoutes', networkName], queryFn, {
    ...options,
    onError: (error) => {
      console.error('Dex query error:', error)
    },
    onSuccess: () => {},
  })
}
