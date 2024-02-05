import { addDaysToDate, countOccurrences } from '@/lib/utils'
import { TIME_TYPES } from '../../../admin/mappings'

export function usePoolTradesTimeType(filtered, time_type, result) {
  let dates = filtered.map((t) => time_type.method(t.timestamp))
  let start_date = new Date(time_type.start_date)
  let end_date = new Date()
  result['tradesTimestamps'][time_type.name] = []
  result['tradesData'][time_type.name] = []
  while (start_date < end_date) {
    let date = time_type.method(start_date.getTime() / 1000)
    result['tradesTimestamps'][time_type.name].push(date)
    result['tradesData'][time_type.name].push(countOccurrences(dates, date))
    start_date = addDaysToDate(start_date, time_type.duration)
  }
}

export function usePoolTrades(filtered) {
  let result = {
    tradesTimestamps: {},
    tradesData: {},
  }
  for (let i = 0; i < TIME_TYPES.length; i++) {
    usePoolTradesTimeType(filtered, TIME_TYPES[i], result)
  }
  return result
}
