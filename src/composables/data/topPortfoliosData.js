import axios from 'axios'
import { BACKEND_URL, REDUNDANT_BACKEND_URL } from '../pools/mappings'
export async function getTopPortfolios() {
  const url = `${BACKEND_URL[56]}/data/topPortfolios`
  let data = []
  try {
    const response = await axios.get(url)
    data = response.data
  } catch (e) {
    console.error('[SERVER ERROR]', e)
    data = (await axios.get(`${REDUNDANT_BACKEND_URL[56]}/data/topPortfolios`))
      .data
  }
  return data.map((item, i) => ({
    Place: i + 1,
    Wallet: item.user,
    Profit: item.profit,
    PNL: item.pnl,
    'Total Deposited': item.totalDeposited,
    'Number of Pools': item.poolsNumber,
    'Traded Volume': item.volume,
    'Gas Fees': item.fee,
  }))
}
