import axios from 'axios'
import { BACKEND_URL, REDUNDANT_BACKEND_URL } from '../pools/mappings'
export async function getPortfolioData(network, address) {
  let data = []
  try {
    data = await getPortfolioDataByUrl(BACKEND_URL[network], address)
  } catch (e) {
    console.error('[SERVER ERROR]', e)
    data = await getPortfolioDataByUrl(REDUNDANT_BACKEND_URL[network], address)
  }
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
      ...item,
      Name: item['Pool Name'][0],
      'AVG APR': item.APR,
      'Liquidity Deposited': item.shareBalanceUsd,
      'Liquidity Deposited_ETH': item.shareBalanceETH,
      'Liquidity Deposited_BTC': item.shareBalanceBTC,
      '% of Pool': item.percentage,
      'Returns Harvested': 0,
      TVL: item.TVL,
      TVL_ETH: item.TVL_ETH,
      TVL_BTC: item.TVL_BTC,
      Volume: item.Volume,
      Volume_ETH: item.Volume_ETH,
      Volume_BTC: item.Volume_BTC,
      Fees: item.Fees,
      Fees_ETH: item.Fees_ETH,
      Fees_BTC: item.Fees_BTC,
      'AVG Profit Per Trade': item.Trades > 0 ? item.Profit / item.Trades : 0,
      'AVG Profit Per Trade_ETH':
        item.Trades > 0 ? item.Profit_ETH / item.Trades : 0,
      'AVG Profit Per Trade_BTC':
        item.Trades > 0 ? item.Profit_BTC / item.Trades : 0,
      'Number Of Trades': item.Trades,
    })),
    all_pools: data[0].data,
    activity: data[1].data,
    historicalPrices: data[2].data,
    // pairsTokens: data[2].data,
    // pairs: data[2].data.pairs.map((item) => ({
    //   Name: item['Name'],
    //   'Liquidity Deposited': item['Liquidity Deposited'],
    //   '% Of Pair': item['% Of Pair'],
    //   TVL: item['TVL'],
    //   Volume: item['Volume'],
    //   Fees: item['Fees'],
    //   'AVG Profit Per Trade': item['AVG Profit Per Trade'],
    //   'Number Of Trades': item['Number Of Trades'],
    // })),
    chart: data[3].data,
    statistics: data[4].data,
    financialStatement: data[5].data,
    cardStats: {
      Profit: data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['Profit']) / 100 * item.percentage,
        0,
      ),
      Profit_ETH: data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['Profit_ETH']) / 100 * item.percentage,
        0,
      ),
      Profit_BTC: data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['Profit_BTC']) / 100 * item.percentage,
        0,
      ),
      'Profit 24H': data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['profit24H']) / 100 * item.percentage,
        0,
      ),
      'Profit 7D': data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['profit7D']) / 100 * item.percentage,
        0,
      ),
      'Profit 30D': data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['profit30D']) / 100 * item.percentage,
        0,
      ),
      'Profit 24H_ETH': data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['profit24H_ETH']) / 100 * item.percentage,
        0,
      ),
      'Profit 7D_ETH': data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['profit7D_ETH']) / 100 * item.percentage,
        0,
      ),
      'Profit 30D_ETH': data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['profit30D_ETH']) / 100 * item.percentage,
        0,
      ),
      'Profit 24H_BTC': data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['profit24H_BTC']) / 100 * item.percentage,
        0,
      ),
      'Profit 7D_BTC': data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['profit7D_BTC']) / 100 * item.percentage,
        0,
      ),
      'Profit 30D_BTC': data[0].data.reduce(
        (sum, item) => sum + parseFloat(item['profit30D_BTC']) / 100 * item.percentage,
        0,
      ),
      'APR 24H': aprs['24H'].APR,
      'APR 7D': aprs['7D'].APR,
      'APR 30D': aprs['1M'].APR,
      APR: ((aprs['24H'].APR + aprs['7D'].APR + aprs['1M'].APR) / 3).toFixed(3),
      rewards: '-',
      portfolioBalance: data[0].data.reduce(
        (sum, value) => sum + value.shareBalanceUsd,
        0,
      ),
      portfolioBalance_ETH: data[0].data.reduce(
        (sum, value) => sum + value.shareBalanceETH,
        0,
      ),
      portfolioBalance_BTC: data[0].data.reduce(
        (sum, value) => sum + value.shareBalanceBTC,
        0,
      ),
      breakdown: data[0].data.map((item) => ({
        id: item['Pool Name'][0].join('-'),
        shareBalanceUsd: item.shareBalanceUsd,
        shareBalanceETH: item.shareBalanceETH,
        shareBalanceBTC: item.shareBalanceBTC,
      })),
    },
  }
}

async function getPortfolioDataByUrl(base_url, address) {
  const subUrls = [
    'pools',
    'activity',
    'historicalPrices',
    'chart',
    'statistics',
    'financialStatement',
  ]
  const promises = []
  for (let i = 0; i < subUrls.length; i++) {
    const url = `${base_url}/data/portfolio/${address}/${subUrls[i]}`
    promises.push(axios.get(url))
  }
  const data = await Promise.all(promises)
  return data
}

export async function getPortfolioBalance(network, userAddress) {
  try {
    const response = await axios.get(
      `${BACKEND_URL[network]}/portfolio/${userAddress}`,
    )
    return response.data
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  return (
    await axios.get(
      `${REDUNDANT_BACKEND_URL[network]}/portfolio/${userAddress}`,
    )
  ).data
}

export async function getUserPools(network, userAddress) {
 

  try {
    const response = await axios.get(
      `${BACKEND_URL[network]}/data/portfolio/${userAddress}/pools`,
    )
    return response.data
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  return (
    await axios.get(
      `${REDUNDANT_BACKEND_URL[network]}/data/portfolio/${userAddress}/pools`,
    )
  ).data
}
export async function getRewards(network) {
  try {
    const response = await axios.get(`${BACKEND_URL[network]}/rewards`)
    return response.data
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  return (await axios.get(`${REDUNDANT_BACKEND_URL[network]}/rewards`)).data
}
