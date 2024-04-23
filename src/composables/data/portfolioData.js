import axios from 'axios'
import { BACKEND_URL } from '../pools/mappings'
export async function getPortfolioData(network, address) {
  const subUrls = [
    'pools',
    'activity',
    'pairsTokens',
    'chart',
    'statistics',
    'financialStatement',
  ]
  const promises = []
  for (let i = 0; i < subUrls.length; i++) {
    const url = `${BACKEND_URL[network]}/data/portfolio/${address}/${subUrls[i]}`
    promises.push(axios.get(url))
  }
  const data = await Promise.all(promises)
  let aprs = data[4].data.aprTable
  if (!aprs) {
    aprs = {
      '24H': { APR: 0 },
      '7D': { APR: 0 },
      '1M': { APR: 0 },
      '1Y': { APR: 0 },
    }
  }
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
    all_pools: data[0].data,
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
    chart: data[3].data,
    statistics: data[4].data,
    financialStatement: data[5].data,
    cardStats: {
      'Profit': data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['Profit']),
      ),
      'Profit 24H': data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['profit24H']),
      ),
      'Profit 7D': data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['profit7D']),
      ),
      'Profit 30D': data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['profit30D']),
      ),
      'APR 24H': aprs['24H'],
      'APR 7D': aprs['7D'],
      'APR 30D': aprs['1M'],
      APR: aprs['1Y'],
      rewards: '-',
      portfolioBalance: '-',
      breakdown: data[0].data.map((item) => ({
        id: item['Pool Name'][0].join('-'),
        tvl: item.TVL,
      })),
    },
  }
}
export async function getPortfolioBalance(network, userAddress) {
  const response = await axios.get(
    `${BACKEND_URL[network]}/portfolio/${userAddress}`,
  )
  return response.data
}
