import axios from 'axios'
import { BACKEND_URL, REDUNDANT_BACKEND_URL } from '../pools/mappings'
export async function getPoolsData(network) {
  let base_url = BACKEND_URL[network]
  try {
    return await getPoolsDataByUrl(base_url)
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  base_url = REDUNDANT_BACKEND_URL[network]
  return await getPoolsDataByUrl(base_url)
}

async function getPoolsDataByUrl(base_url) {
  const subUrls = ['table']
  const promises = []
  const names = (await axios.get(`${base_url}/pools/names`)).data
  for (let i = 0; i < subUrls.length; i++) {
    const url = `${base_url}/data/pools/${subUrls[i]}`
    promises.push(axios.get(url))
  }
  const data = await Promise.all(promises)
  return {
    table: data[0].data.map((item, index) => ({
      ...item,
      display_name: names[item.address.toLowerCase()] ?? `Pool #${index + 1}`,
    })),
  }
}
