import axios from 'axios'
import { BACKEND_URL } from '../pools/mappings'
export async function getPoolData(network, poolId) {
  const urls = [
    `${BACKEND_URL[network]}/data/details/general/${poolId}`,
    `${BACKEND_URL[network]}/data/details/financialStatement/${poolId}`,
    `${BACKEND_URL[network]}/data/details/statistics/${poolId}`,
    `${BACKEND_URL[network]}/data/details/pairsTokens/${poolId}`,
  ]

  const promises = [urls.map((url) => axios.get(url))]
  const data = await Promise.all(promises)
  return {
    general: data[0].data,
    financialStatement: data[1].data,
    statistics: data[2].data,
    pairsTokens: data[3].data,
  }
}
