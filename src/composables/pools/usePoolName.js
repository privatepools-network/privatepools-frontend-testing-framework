import { BACKEND_URL, REDUNDANT_BACKEND_URL } from '../pools/mappings'
import axios from 'axios'

export async function addPoolName(networkId, poolId, owner, name) {
  let url = `${BACKEND_URL[networkId]}/pools/name`
  let response = null
  try {
    response = await axios.post(url, {
      poolAddress: poolId.slice(0, 42),
      owner,
      name,
      signature: 'nosig',
    })
  } catch (e) {
    console.error('[POOL NAME ERROR]', e)
    url = `${REDUNDANT_BACKEND_URL[networkId]}/pools/name`
    response = await axios.post(url, {
      poolAddress: poolId.slice(0, 42),
      owner,
      name,
      signature: 'nosig',
    })
  }
  if (!response || !response.success) {
    console.error("Name for pool wasn't updated")
    return false
  }
  return true
}
