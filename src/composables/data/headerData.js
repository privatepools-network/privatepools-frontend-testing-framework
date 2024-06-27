import axios from 'axios'
import { BACKEND_URL, REDUNDANT_BACKEND_URL } from '../pools/mappings'
import wl_tokens from '../../assets/wl/tokenslist.json'
export async function getHeaderData(network) {
  let base_url = BACKEND_URL[network]
  try {
    return await getHeaderDataByUrl(base_url)
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  base_url = REDUNDANT_BACKEND_URL[network]
  return await getHeaderDataByUrl(base_url)
}

async function getHeaderDataByUrl(base_url) {
  const subUrls = ['search']
  const promises = []
  for (let i = 0; i < subUrls.length; i++) {
    const url = `${base_url}/data/header/${subUrls[i]}`
    promises.push(axios.get(url))
  }
  const data = await Promise.all(promises)
  return {
    search: {
      ...data[0].data,
      tokens: data[0].data.tokens.filter(
        (item) => wl_tokens[item.address.toLowerCase()] != undefined,
      ),
    },
  }
}
