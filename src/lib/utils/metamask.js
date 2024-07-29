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

export async function iterationByTokensForMetamask(tokensToWatch) {
  tokensToWatch.forEach((token) => {
    addTokenToMetamask(token.address, token.symbol, token.decimals).catch(
      console.error,
    )
  })
}

export async function addTokenToMetamask(address, symbol, decimals) {
  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: address,
          symbol: symbol,
          decimals: decimals,
        },
      },
    })
  } catch (error) {
    console.log(error)
  }
}
