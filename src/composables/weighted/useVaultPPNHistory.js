import axios from 'axios'
import { NETWORK_URL } from '../admin/mappings'
import {
  getShortDayString,
  getShortHourString,
  getShortMonthString,
  getShortWeekString,
} from '@/lib/utils'

const poolId =
  '0x9458b32c812f14632a7cf9fe287ec2f99071828a000200000000000000000010'

export async function useVaultPPNHistory(networkId) {
  let url = `${NETWORK_URL.Binance}/data/details/${poolId}/general`

  const { data } = await axios.get(url)
  const result = formatPPNHistory(data.chart)
  return result
}

function formatPPNHistory(data) {
  const now = new Date() / 1000
  const result = {
    '24H': {
      data: [],
      dates: [],
      formatDate: getShortHourString,
      startPeriod: now - 60 * 60 * 24,
    },
    '7D': {
      data: [],
      dates: [],
      formatDate: getShortDayString,
      startPeriod: now - 60 * 60 * 24 * 7,
    },
    '30D': {
      data: [],
      dates: [],
      formatDate: getShortWeekString,
      startPeriod: now - 60 * 60 * 24 * 30,
    },
    '1Y': {
      data: [],
      dates: [],
      formatDate: getShortMonthString,
      startPeriod: now - 60 * 60 * 24 * 365,
    },
  }
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    for (const [_, value] of Object.entries(result)) {
      const formatted = value.formatDate(item.timestamp)
      if (
        item.timestamp >= value.startPeriod &&
        !value.dates.includes(formatted)
      ) {
        value.dates.push(formatted)
        value.data.push(item.Assets.PPN)
      }
    }
  }
  return result
}
