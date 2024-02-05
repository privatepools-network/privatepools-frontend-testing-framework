import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { NETWORK_SHORT_NAME, NETWORK_URL } from '../mappings'

export async function GetChoosenRoutes(networkName) {
  let networkShortName = NETWORK_SHORT_NAME[networkName.name]
  const url = `${
    NETWORK_URL[networkName.name]
  }oneinch/${networkShortName}/choosenRoutes`
  let response = await axios.get(url)
  return response.data
}

// Define your useGraphqlQuery wrapper function
export function useChoosenRoutes(networkName, options = {}) {
  const queryFn = async () => {
    return await GetChoosenRoutes(networkName.value)
  }
  return useQuery(['choosenRoutes', networkName], queryFn, {
    ...options,
    onError: (error) => {
      console.error('Dex query error:', error)
    },
    onSuccess: () => {},
  })
}
