import axios from 'axios'
import { BACKEND_URL } from '../pools/mappings'
export async function getDetailsData(network, poolId) {
  const urls = [
    `${BACKEND_URL[network]}/data/details/${poolId}/general/`,
    `${BACKEND_URL[network]}/data/details/${poolId}/financialStatement/`,
    `${BACKEND_URL[network]}/data/details/${poolId}/statistics/`,
    `${BACKEND_URL[network]}/data/details/${poolId}/pairsTokens/`,
    `${BACKEND_URL[network]}/data/details/${poolId}/diagrams/`,
  ]

  const promises = urls.map((url) => axios.get(url))
  const data = await Promise.all(promises)
  return {
    general: data[0].data,
    financialStatement: data[1].data,
    statistics: data[2].data,
    pairsTokens: data[3].data,
    diagrams: data[4].data,
  }
}
export async function getCLDetailsData(network, poolId) {
  const urls = [
    `${BACKEND_URL[network]}/data/clDetails/${poolId}/general/`,
    `${BACKEND_URL[network]}/data/clDetails/${poolId}/financialStatement/`,
    `${BACKEND_URL[network]}/data/clDetails/${poolId}/statistics/`,
    `${BACKEND_URL[network]}/data/clDetails/${poolId}/pairsTokens/`,
    `${BACKEND_URL[network]}/data/clDetails/${poolId}/diagrams/`,
  ]

  const promises = urls.map((url) => axios.get(url))
  const data = await Promise.all(promises)
  return {
    general: data[0].data,
    financialStatement: data[1].data,
    statistics: data[2].data,
    pairsTokens: data[3].data,
    diagrams: data[4].data,
  }
}
