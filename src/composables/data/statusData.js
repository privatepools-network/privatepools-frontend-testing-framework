import axios from 'axios'
export async function getStatus() {
  const url = `${process.env.VUE_APP_REWARDS_BACKEND_BINANCE}/status`
  try {
    const response = await axios.get(url)
    return response.data.status
  } catch (e) {
    console.error('[SERVER ERROR]', e)
  }
  const response = await axios.get(
    `${process.env.VUE_APP_REDUNDANT_REWARDS_BACKEND_BINANCE}/status`,
  )
  return response.data.status
}
