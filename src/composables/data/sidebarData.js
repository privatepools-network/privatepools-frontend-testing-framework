import axios from 'axios'
import { BACKEND_URL, REDUNDANT_BACKEND_URL } from '../pools/mappings'
export async function getSidebarData(address, network) {
  try {
    return await getSidebarDataByUrl(BACKEND_URL[network], address)
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  return await getSidebarDataByUrl(REDUNDANT_BACKEND_URL[network], address)
}

async function getSidebarDataByUrl(base_url, address) {
  const subUrls = ['']
  const promises = []
  for (let i = 0; i < subUrls.length; i++) {
    const url = `${base_url}/portfolio/${address}`
    promises.push(axios.get(url))
  }
  const data = await Promise.all(promises)
  return {
    userBalance: data[0].data,
  }
}
