import axios from 'axios'
import { BACKEND_URL, REDUNDANT_BACKEND_URL } from '../pools/mappings'
export async function getPoolsData(network) {
  let base_url = BACKEND_URL[network]
  try {
    return getPoolsDataByUrl(base_url)
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  base_url = REDUNDANT_BACKEND_URL[network]
  return await getPoolsDataByUrl(base_url)
}

async function getPoolsDataByUrl(base_url) {
  const subUrls = ['table']
  const promises = []
  for (let i = 0; i < subUrls.length; i++) {
    const url = `${base_url}/data/pools/${subUrls[i]}`
    promises.push(axios.get(url))
  }
  const data = await Promise.all(promises)
  return {
    table: data[0].data,
  }
}
