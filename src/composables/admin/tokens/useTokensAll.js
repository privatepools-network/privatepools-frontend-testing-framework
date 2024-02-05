import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { NETWORK_SHORT_NAME, NETWORK_URL } from '../mappings'
import { getTokenEntity } from '@/lib/helpers/util'

export async function GetTokensAll(networkName) {
  let networkShortName = NETWORK_SHORT_NAME[networkName.name]
  const url = `${
    NETWORK_URL[networkName.name]
  }tokens/${networkShortName}/tokensAll`
  let response = await axios.get(url)
  let data = response.data
  for (let i = 0; i < data.length; i++) {
    let img = getTokenEntity(data[i]['name'], 'short').icon
    data[i].img = img
  }
  return data
}

export function useTokensAll(networkName, options = {}) {
  const queryFn = async () => {
    return await GetTokensAll(networkName.value)
  }
  return useQuery(['tokensAll'], queryFn, {
    ...options,
    onError: (error) => {
      console.error('Dex query error:', error)
    },
    onSuccess: () => {},
  })
}
