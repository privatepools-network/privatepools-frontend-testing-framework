import axios from 'axios'
import { BACKEND_URL } from '../pools/mappings'
export async function getPortfolioData(network, address) {
  const subUrls = ['pools', 'activity', 'pairsTokens']
  const promises = []
  for (let i = 0; i < subUrls.length; i++) {
    const url = `${BACKEND_URL[network]}/data/portfolio/${address}/${subUrls[i]}`
    promises.push(axios.get(url))
  }
  const data = await Promise.all(promises)
  return {
    pools: data[0].data.map((item) => ({
      Name: item['Pool Name'][0],
      'AVG APR': item.APR,
      'Liquidity Deposited': item.shares.balance,
      '% of Pool': item.shares.percentage,
      'Returns Harvested': 0,
      TVL: item.Liquidity,
      Volume: item.Volume,
      Fees: item.Fees,
      'AVG Profit Per Trade': item.Trades > 0 ? item.Profit / item.Trades : 0,
      'Number Of Trades': item.Trades,
    })),
    activity: data[1].data,
    pairsTokens: data[2].data,
    pairs: data[2].data.pairs.map((item) => ({
      Name: item['Pair Name'],
      'Liquidity Deposited': '?',
      '% Of Pair': '?',
      TVL: item.TVL,
      Volume: item.Volume,
      Fees: item.Fees,
      'AVG Profit Per Trade': item.Trades > 0 ? item.Profit / item.Trades : 0,
      'Number Of Trades': item.Trades,
    })),
  }
}
export async function getPortfolioBalance(network, userAddress) {
  const response = await axios.get(
    `${BACKEND_URL[network]}/portfolio/${userAddress}`,
  )
  return response.data
}
