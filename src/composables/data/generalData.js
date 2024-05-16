import axios from 'axios'
import { BACKEND_URL, REDUNDANT_BACKEND_URL } from '../pools/mappings'
export async function getGeneralData(network) {
  let url = BACKEND_URL[network]
  try {
    return await getGeneralDataByUrl(url)
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  url = REDUNDANT_BACKEND_URL[network]
  return await getGeneralDataByUrl(url)
}

async function getGeneralDataByUrl(base_url) {
  const subUrls = [
    'overview',
    'activities',
    'analytics',
    'topPerformancePools',
    'topTradingTokens',
    'chart',
  ]
  const promises = []
  for (let i = 0; i < subUrls.length; i++) {
    const url = `${base_url}/data/general/${subUrls[i]}`
    promises.push(axios.get(url))
  }
  const data = await Promise.all(promises)

  return {
    overview: data[0].data,
    activities: data[1].data,
    analytics: data[2].data,
    topPerformancePools: data[3].data,
    topTradingTokens: data[4].data,
    chart: data[5].data,
  }
}
