import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { BACKEND_URL } from '../mappings'
import { networkId } from '../../useNetwork'

/**
 * Get arbitrage trades for specific pool
 * @function GetPoolSwapsData
 * @param {string} poolId - pool id
 * @param {number} network - network id
 * @returns {Promise<import('../usePoolSwapsStats').Swap[]>} arbitrage trades for specific pool
 */
export async function GetPoolSwapsData(poolId, network) {
  network = network ? network : networkId.value
  if (!network || !BACKEND_URL[network]) return []
  const url = `${BACKEND_URL[network]}/output`
  let response = await axios.get(url)
  let data = response.data
  let filtered = data
  if (poolId)
    filtered = data.filter(
      (t) =>
        t['swaps'].length > 0 && t['swaps'][0]['poolIdVault'].includes(poolId),
    )
  filtered.sort((a, b) => a.gasFeeUsd - b.gasFeeUsd)
  return filtered
}

export function usePoolSwapsData(poolId, network = null, options = {}) {
  const queryFn = async () => {
    return await GetPoolSwapsData(poolId, network)
  }
  return useQuery(['poolSwapsData', network], queryFn, {
    ...options,
    onError: (error) => {
      console.error('Pool query error:', error)
    },
    onSuccess: () => {},
  })
}
