import { addDaysToDate } from '@/lib/utils'
import { TIME_TYPES } from '@/composables/admin/mappings'
/**
 * Add info for profits diagram on pool details page.
 */
export function usePoolProfitTimeType(_filtered, time_type, result) {
  let start_date = new Date(time_type.start_date)
  let end_date = new Date()
  result['profitsTimestamps'][time_type.name] = []
  result['profitsData'][`${time_type.name}_tokens`] = []
  result['profitsData'][time_type.name] = []
  result['profitsData_ETH'][`${time_type.name}_tokens`] = []
  result['profitsData_ETH'][time_type.name] = []
  result['profitsData_BTC'][`${time_type.name}_tokens`] = []
  result['profitsData_BTC'][time_type.name] = []
  const filtered = _filtered.map((f) => ({
    ...f,
    date: time_type.method(parseFloat(f.timestamp)),
  }))
  while (start_date < end_date) {
    let date = time_type.method(start_date.getTime() / 1000)
    result['profitsTimestamps'][time_type.name].push(date)
    result['profitsData'][time_type.name].push(
      parseFloat(
        filtered
          .filter((f) => f.date == date)
          .reduce((sum, f) => sum + f.profitUsd, 0)
          .toFixed(5),
      ),
    )
    result['profitsData_ETH'][time_type.name].push(
      parseFloat(
        filtered
          .filter((f) => f.date == date)
          .reduce((sum, f) => sum + (f.profitETH ?? 0), 0)
          .toFixed(5),
      ),
    )
    result['profitsData_BTC'][time_type.name].push(
      parseFloat(
        filtered
          .filter((f) => f.date == date)
          .reduce((sum, f) => sum + (f.profitBTC ?? 0), 0)
          .toFixed(5),
      ),
    )
    let date_filtered = filtered.filter((f) => f.date == date)
    result['profitsData'][`${time_type.name}_tokens`].push([])
    result['profitsData_ETH'][`${time_type.name}_tokens`].push([])
    result['profitsData_BTC'][`${time_type.name}_tokens`].push([])
    for (let k = 0; k < date_filtered.length; k++) {
      result['profitsData'][`${time_type.name}_tokens`][
        result['profitsData'][`${time_type.name}_tokens`].length - 1
      ].push({
        token: date_filtered[k].token,
        value: date_filtered[k].profit,
      })
      result['profitsData_ETH'][`${time_type.name}_tokens`][
        result['profitsData_ETH'][`${time_type.name}_tokens`].length - 1
      ].push({
        token: date_filtered[k].token,
        value: date_filtered[k].profit,
      })
      result['profitsData_BTC'][`${time_type.name}_tokens`][
        result['profitsData_BTC'][`${time_type.name}_tokens`].length - 1
      ].push({
        token: date_filtered[k].token,
        value: date_filtered[k].profit,
      })
    }
    start_date = addDaysToDate(start_date, time_type.duration)
  }
}

/**
 * Get info for profits diagram on pool details.
 */
export function usePoolProfits(filtered) {
  let result = {
    profitsTimestamps: {},
    profitsData: {},
    profitsData_ETH: {},
    profitsData_BTC: {},
  }
  for (let i = 0; i < TIME_TYPES.length; i++) {
    usePoolProfitTimeType(filtered, TIME_TYPES[i], result)
  }
  return result
}
