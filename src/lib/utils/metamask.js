import { ethers } from 'ethers'
import { setNetworkId, networkId } from '@/composables/useNetwork'
export async function InitializeMetamask() {
  try {
    await window.ethereum.enable()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    return provider
  } catch (e) {
    console.error(e)
  }
  return null
}

export async function selectNetwork(chainId) {
  try {
    if (chainId == networkId.value) {
      return true
    }
    let hex_id = chainId.toString(16)
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${hex_id}` }],
    })
    setNetworkId(chainId)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}


