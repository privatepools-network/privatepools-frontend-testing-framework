import axios from 'axios'
import { BACKEND_URL } from '../pools/mappings'
export async function getPoolsData(network) {
  const subUrls = ['table']
  const promises = []
  for (let i = 0; i < subUrls.length; i++) {
    const url = `${BACKEND_URL[network]}/data/pools/${subUrls[i]}`
    promises.push(axios.get(url))
  }
  const data = await Promise.all(promises)
  return {
    table: data[0].data,
  }
}
