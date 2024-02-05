import { TIME_TYPES } from '../../../admin/mappings'
import { addDaysToDate } from '@/lib/utils'

/**
 * @typedef {import('../../usePoolSwapsStats').Swap} Swap
 */

/**
 * @typedef {Object} ProfitsDiagram
 * @property {number[]} profitsTimestamps
 * @property {number[]} profitsData
 */

/**
 * Add info for profits diagram on pool details page.
 * @function usePoolProfitTimeType
 * @param {Swap[]} filtered - arbitrage trades of the pool
 * @param {import('../../../admin/mappings').TimeType} time_type - time period
 * @param {import('./useDiagramsData').DiagramsData} result - result object for diagrams data
 * @returns {void}
 */
export function usePoolProfitTimeType(filtered, time_type, result) {
  let start_date = new Date(time_type.start_date)
  let end_date = new Date()
  result['profitsTimestamps'][time_type.name] = []
  result['profitsData'][`${time_type.name}_tokens`] = []
  result['profitsData'][time_type.name] = []
  filtered = filtered.map((f) => ({
    ...f,
    date: time_type.method(f.timestamp),
  }))
  while (start_date < end_date) {
    let date = time_type.method(start_date.getTime() / 1000)
    result['profitsTimestamps'][time_type.name].push(date)
    result['profitsData'][time_type.name].push(
      filtered
        .filter((f) => f.date == date)
        .reduce((sum, f) => sum + f.profitUsd, 0)
        .toFixed(2),
    )
    let date_filtered = filtered.filter((f) => f.date == date)
    result['profitsData'][`${time_type.name}_tokens`].push([])
    for (let k = 0; k < date_filtered.length; k++) {
      result['profitsData'][`${time_type.name}_tokens`][
        result['profitsData'][`${time_type.name}_tokens`].length - 1
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
 * @function usePoolProfits
 * @param {Swap[]} filtered - arbitrage trades for the pool
 * @returns {ProfitsDiagram} data for profits diagram on pool details page.
 */
export function usePoolProfits(filtered) {
  let result = {
    profitsTimestamps: {},
    profitsData: {},
  }
  for (let i = 0; i < TIME_TYPES.length; i++) {
    usePoolProfitTimeType(filtered, TIME_TYPES[i], result)
  }
  return result
}
