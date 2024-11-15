import { BACKEND_URL, REDUNDANT_BACKEND_URL } from '../pools/mappings'
import axios from 'axios'
import { InitializeMetamask } from '@/lib/utils/metamask'

export async function addPoolName(networkId, poolId, owner, name) {
  let url = `${BACKEND_URL[networkId]}/pools/name`
  let response = null
  const provider = await InitializeMetamask()
  const signer = provider.getSigner()
  let signature = null
  try {
    signature = await signer.signMessage(`Pool name: ${name}`)
  } catch (e) {
    console.error('User denied signature')
    return false
  }
  try {
    response = await axios.post(url, {
      poolAddress: poolId.slice(0, 42),
      owner,
      name,
      signature,
    })
  } catch (e) {
    console.error('[POOL NAME ERROR]', e)
    url = `${REDUNDANT_BACKEND_URL[networkId]}/pools/name`
    response = await axios.post(url, {
      poolAddress: poolId.slice(0, 42),
      owner,
      name,
      signature,
    })
  }
  if (!response || !response.success) {
    console.error("Name for pool wasn't updated")
    return false
  }
  return true
}
