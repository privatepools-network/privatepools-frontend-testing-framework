import {
  getShortDayString,
  getShortHourString,
  getShortMonthString,
  getShortWeekString,
} from '@/lib/utils'
import { UNISWAP_PPN_HISTORY } from '../queries/external/uniswapPPNHistory'
import useGraphQLQuery from '../useQuery'
import { UNISWAP_SUBGRAPHS } from './constants'
import { GetHistoricalTokenPrices } from '@/composables/balances/useHistoricalTokenPrices'
import { getTokensPricesForTimestamp } from '@/lib/formatter/financialStatement/financialStatementUtils'

const PPN_POOLS = {
  56: '0x37db09f292929bcd05a50825bf91f64a26f36f1d',
}

export async function useUniswapPPNHistory(networkId) {
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    UNISWAP_PPN_HISTORY(PPN_POOLS[networkId]),
  )
  if (data && data['poolTokenHourDatas']) {
    const tokens = getUniqueTokens(data.poolTokenHourDatas)
    const pricingToken = tokens.find((item) => item != 'PPN')
    const prices = await GetHistoricalTokenPrices([pricingToken])
    const result = formatPPNHistory(
      data.poolTokenHourDatas,
      prices,
      pricingToken,
    )
    return result
  }
  return null
}

function formatPPNHistory(poolTokenHourDatas, prices, pricingToken) {
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
  const data = combineTokensData(poolTokenHourDatas)
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    for (const [_, value] of Object.entries(result)) {
      const formatted = value.formatDate(item.date)
      if (item.date >= value.startPeriod && !value.dates.includes(formatted)) {
        const ppnTokenTvl =
          item.token0 == 'PPN' ? item.token0Tvl : item.token1Tvl
        const priceTokenTvl =
          item.token0 == 'PPN' ? item.token1Tvl : item.token0Tvl
        let relativePrice = ppnTokenTvl / priceTokenTvl
        if (isNaN(relativePrice)) {
          relativePrice = 0
        }
        const token_prices = getTokensPricesForTimestamp(
          [pricingToken],
          prices,
          item.date,
        )
        value.dates.push(formatted)
        value.data.push(token_prices[pricingToken] * relativePrice)
      }
    }
  }
  return result
}

function combineTokensData(poolTokenHourDatas) {
  const data = []
  const tokens = getUniqueTokens(poolTokenHourDatas)
  const token0_data = poolTokenHourDatas.filter(
    (item) => item.token.symbol == tokens[0],
  )
  for (let i = 0; i < token0_data.length; i++) {
    const token0 = token0_data[i]
    const token1 = poolTokenHourDatas.find(
      (item) => item.token.symbol == tokens[1] && item.date == token0.date,
    )
    data.push({
      date: token0.date,
      token0: token0.token.symbol,
      token1: token1.token.symbol,
      token0Tvl: token0.totalValueLocked,
      token1Tvl: token1.totalValueLocked,
    })
  }
  return data
}

function getUniqueTokens(poolTokenHourDatas) {
  return Array.from(
    new Set(poolTokenHourDatas.map((item) => item.token.symbol)),
  )
}
