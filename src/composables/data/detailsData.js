import axios from 'axios'
import { BACKEND_URL, REDUNDANT_BACKEND_URL } from '../pools/mappings'
import { balancerContractsService } from '@/composables/pools/onchain/balancer-contract.service'
export async function getDetailsData(network, poolId) {
  let url = `${BACKEND_URL[network]}`
  try {
    return await getDetailsDataByUrl(url, poolId)
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  url = REDUNDANT_BACKEND_URL[network]
  return await getDetailsDataByUrl(url, poolId)
}

async function getDetailsDataByUrl(base_url, poolId) {
  const urls = [
    `${base_url}/data/details/${poolId}/general/`,
    `${base_url}/data/details/${poolId}/statistics/`,
    `${base_url}/data/details/${poolId}/pairsTokens/`,
    `${base_url}/data/details/${poolId}/raw0/`,
    `${base_url}/data/details/${poolId}/raw1/`,
    `${base_url}/data/details/${poolId}/financialStatement_raw0/`,
    `${base_url}/data/details/${poolId}/financialStatement_raw1/`,
    `${base_url}/historical_prices/${poolId}`,
  ]

  const promises = urls.map((url) => axios.get(url))
  const data = await Promise.all(promises)
  return {
    general: data[0].data,
    statistics: data[1].data,
    pairsTokens: data[2].data,
    raw0: data[3].data,
    raw1: data[4].data,
    financialStatement_raw0: data[5].data,
    financialStatement_raw1: data[6].data,
    historical_prices: data[7].data,
  }
}

export async function getCLDetailsData(network, poolId) {
  let url = `${BACKEND_URL[network]}`
  try {
    return await getCLDetailsDataByUrl(url, poolId)
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  url = REDUNDANT_BACKEND_URL[network]
  return await getCLDetailsDataByUrl(url, poolId)
}

async function getCLDetailsDataByUrl(base_url, poolId) {
  const urls = [
    `${base_url}/data/clDetails/${poolId}/general/`,
    `${base_url}/data/clDetails/${poolId}/financialStatement/`,
    `${base_url}/data/clDetails/${poolId}/statistics/`,
    `${base_url}/data/clDetails/${poolId}/pairsTokens/`,
    `${base_url}/data/clDetails/${poolId}/diagrams/`,
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

export async function getSinglePoolDetails(
  network,
  poolId,
  enableOnchain = false,
) {
  let base_url = BACKEND_URL[network]
  const names = (await axios.get(`${base_url}/pools/names`)).data

  try {
    const response = await axios.get(
      `${base_url}/data/details/${poolId}/general/`,
    )

    let poolData = {}
    if (enableOnchain) {
      poolData = await balancerContractsService.vault.getPoolData(
        poolId,
        'Weighted',
        response.data.tokens,
        network,
      )
    }

    return {
      ...response.data,
      display_name: names[poolId.slice(0, 42)] ?? `Pool #1`,
      onchain: { ...response.data.onchain, ...poolData },
    }
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  base_url = REDUNDANT_BACKEND_URL[network]

  let response = await axios.get(`${base_url}/data/details/${poolId}/general/`)
  let poolData = {}
  if (enableOnchain) {
    poolData = await balancerContractsService.vault.getPoolData(
      poolId,
      'Weighted',
      response.data.tokens,
      network,
    )
  }
  return {
    ...response.data,
    onchain: { ...response.data.onchain, ...poolData },
  }
}
export async function getCLSinglePoolDetails(network, poolId) {
  let base_url = BACKEND_URL[network]
  try {
    const response = await axios.get(
      `${base_url}/data/cldetails/${poolId}/general/`,
    )
    return response.data
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  base_url = REDUNDANT_BACKEND_URL[network]

  return (await axios.get(`${base_url}/data/cldetails/${poolId}/general/`)).data
}
export async function getCLTvls(network, poolId) {
  let base_url = BACKEND_URL[network]
  try {
    const response = await axios.get(
      `${base_url}/data/cldetails/${poolId}/tvls/`,
    )
    return response.data
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  base_url = REDUNDANT_BACKEND_URL[network]
  return (await axios.get(`${base_url}/data/cldetails/${poolId}/tvls/`)).data
}
