import axios from 'axios'
import { BACKEND_URL } from '../pools/mappings'
export async function getSidebarData(address, network) {
  const subUrls = ['']
  const promises = []
  for (let i = 0; i < subUrls.length; i++) {
    const url = `${BACKEND_URL[network]}/portfolio/${address}`
    promises.push(axios.get(url))
  }
  const data = await Promise.all(promises)
  return {
    userBalance: data[0].data,
  }
}
