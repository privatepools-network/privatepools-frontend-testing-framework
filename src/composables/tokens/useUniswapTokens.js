import axios from 'axios'

export async function fetchUniswapTokens(networkId) {
  const url = 'https://cloudflare-ipfs.com/ipns/tokens.uniswap.org'
  let response = await axios.get(url)
  return response.data.tokens
    .filter((item) => item.extensions && item.extensions.bridgeInfo)
    .map((t) => ({
      ...t,
      price: 0,
      balance: 0,
      address: networkId
        ? t.extensions.bridgeInfo[networkId.toString()]
        : t.address,
      img: t.logoURI,
    }))
}
