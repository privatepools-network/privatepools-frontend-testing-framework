import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { NETWORK_SHORT_NAME, NETWORK_URL } from '../mappings'

const FIELD_NAMES = {
  'Initial Amount': 'updateInitialAmount',
  'Loop amount': 'updateSum',
  'Max amount Trading': 'updateMaxAmount',
  'Min Profit': 'updateMinArbAmount',
}

export async function UpdateSum(networkName, fieldName, address, sum) {
  let networkShortName = NETWORK_SHORT_NAME[networkName.name]
  const url = `${
    NETWORK_URL[networkName.name]
  }tokensFields/${networkShortName}/${FIELD_NAMES[fieldName]}/${address}/${sum}`
  let response = await axios.get(url)
  return response.data
}

export function useUpdateSum(
  networkName,
  fieldName,
  address,
  sum,
  options = {},
) {
  const queryFn = async () => {
    return await UpdateSum(networkName, fieldName, address, sum)
  }
  return useQuery(['updateSum'], queryFn, {
    ...options,
    onError: (error) => {
      console.error('Dex query error:', error)
    },
    onSuccess: () => {},
  })
}
