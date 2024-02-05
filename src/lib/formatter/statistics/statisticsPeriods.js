export const PERIODS = ['24H', '7D', '1M', '3M', '1Y', 'total']

/**
 * @typedef {{
 * Period:string
 * APR: number
 * 'VS USD':number
 * 'VS LIDO':number
 * 'VS BTC':number
 * 'VS Defi Yield':number
 * }} StatisticsResult
 */

const DAYS_AGO = {
  '24H': 1,
  '7D': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
  'total': 1000,
}

export function GetPeriodTimestamp(period) {
  const currentDate = new Date()
  if (!PERIODS.includes(period)) return currentDate.getTime() / 1000
  const daysAgo = new Date(currentDate)
  daysAgo.setDate(currentDate.getDate() - DAYS_AGO[period])

  return daysAgo.getTime() / 1000
}
