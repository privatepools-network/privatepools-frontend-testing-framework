import axios from 'axios'

export async function getSidebarData(address) {
  const subUrls = ['']
  const promises = []
  for (let i = 0; i < subUrls.length; i++) {
    const url = `https://binancerunbotdoprimocosta.xyz/portfolio/${address}`
    promises.push(axios.get(url))
  }
  const data = await Promise.all(promises)
  return {
    userBalance: data[0].data,
  }
}
