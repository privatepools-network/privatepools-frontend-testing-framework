import axios from 'axios'
import { BACKEND_URL } from '../pools/mappings'
export async function getGeneralData(network) {
  const subUrls = [
    'overview',
    'activities',
    'analytics',
    'topPerformancePools',
    'topTradingTokens',
  ]
  const promises = []
  for (let i = 0; i < subUrls.length; i++) {
    const url = `${BACKEND_URL[network]}/data/general/${subUrls[i]}`
    promises.push(axios.get(url))
  }
  const data = await Promise.all(promises)
  return {
    overview: data[0].data,
    activities: data[1].data,
    analytics: data[2].data,
    topPerformancePools: data[3].data,
    topTradingTokens: data[4].data,
  }
}
