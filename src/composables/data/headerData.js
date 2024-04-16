import axios from 'axios'
import { BACKEND_URL } from '../pools/mappings'
export async function getHeaderData(network) {
  const subUrls = ['search']
  const promises = []
  for (let i = 0; i < subUrls.length; i++) {
    const url = `${BACKEND_URL[network]}/data/header/${subUrls[i]}`
    promises.push(axios.get(url))
  }
  const data = await Promise.all(promises)
  return {
    search: data[0].data,
  }
}
