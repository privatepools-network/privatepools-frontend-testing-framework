import { getShortDayString, getTimestampMinusDays, median } from '@/lib/utils'

export function usePoolVolatility(filtered) {
  let result = {
    volatilityTimestamps: {},
    volatilityData: {},
  }
  let timestamps = filtered.map((t) => getShortDayString(t.timestamp))

  result['volatilityTimestamps'] = Array.from(new Set(timestamps))
  let { median_value: median_value_30, all_profit: all_profit_30 } =
    GetTimestampProfit(filtered, 30)
  let { median_value: median_value_90, all_profit: all_profit_90 } =
    GetTimestampProfit(filtered, 90)
  let { median_value: median_value_180, all_profit: all_profit_180 } =
    GetTimestampProfit(filtered, 180)
  let month_timestamp = getTimestampMinusDays(30)
  result['volatilityData'] = [
    {
      name: '30-Day profit',
      data: [],
    },
    {
      name: '90-Day profit',
      data: [],
    },
    {
      name: '180-Day profit',
      data: [],
    },
  ]
  result['volatilityTimestamps'].map((t) => {
    let month_filtered = filtered.filter(
      (f) =>
        f.timestamp > month_timestamp && getShortDayString(f.timestamp) == t,
    )
    if (month_filtered.length > 0) {
      let current_day_profit = month_filtered
        .reduce((sum, f) => sum + f.profitUsd, 0)
        .toFixed(2)
      let current_day_percent_30 = current_day_profit / (all_profit_30 / 100)
      let current_day_percent_90 = current_day_profit / (all_profit_90 / 100)
      let current_day_percent_180 = current_day_profit / (all_profit_180 / 100)
      let median_diff_30 = current_day_percent_30 - median_value_30
      let median_diff_90 = current_day_percent_90 - median_value_90
      let median_diff_180 = current_day_percent_180 - median_value_180
      result['volatilityData'][0].data.push(median_diff_30.toFixed(2))
      result['volatilityData'][1].data.push(median_diff_90.toFixed(2))
      result['volatilityData'][2].data.push(median_diff_180.toFixed(2))
    }
  })
  return result
}

export function GetTimestampProfit(filtered, days) {
  let timestamp = getTimestampMinusDays(days)
  let profits = {}
  let all_profit = 0
  for (let k = 0; k < filtered.length; k++) {
    if (filtered[k].timestamp > timestamp) {
      let day = getShortDayString(filtered[k].timestamp)
      if (!profits[day]) {
        profits[day] = 0
      }
      profits[day] += filtered[k].profitUsd
      all_profit += filtered[k].profitUsd
    }
  }
  let values_for_median = []
  for (const [, value] of Object.entries(profits)) {
    values_for_median.push(value / (all_profit / 100))
  }
  let median_value = median(values_for_median)
  return { median_value, all_profit }
}
