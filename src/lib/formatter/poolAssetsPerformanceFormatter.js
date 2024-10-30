import { TIME_TYPES } from '@/composables/admin/mappings'
import {
  getShortHourString,
  isTimestampWithinCurrentHour,
  addDaysToDate,
} from '../utils'
import { getTokensPricesForTimestamp } from './financialStatement/financialStatementUtils'
/**
 * Format assets performance for the time type. Used on pool details page.
 * @function FormatPoolsAssetsPerformanceTimeType
 * @param {import('../usePoolHistoricValues').HistoricalBalance[]} assetsPerformance - assets performance for the pool tokens
 * @param {import('@/composables/tokens/useTokenSymbols').Token[]} tokens - tokens of the pool
 * @param {import('@/composables/admin/mappings').TimeType} time_type - time period
 * @param {import('@/composables/pools/charts/diagrams/useDiagramsData').DiagramsData} result - result object for diagrams data
 * @returns {void}
 */
export function FormatPoolsAssetsPerformanceTimeType(
  assetsPerformance,
  tokens,
  time_type,
  result,
) {
  result['assetsPerformanceTimestamps'][time_type.name] = []
  result['assetsPerformanceData'][`${time_type.name}_tokens`] = []
  let start_date = new Date(time_type.start_date)
  let end_date = new Date()
  while (start_date.getTime() < end_date.getTime()) {
    result['assetsPerformanceTimestamps'][time_type.name].push(
      time_type.method(start_date.getTime() / 1000),
    )
    start_date = addDaysToDate(start_date, time_type.duration)
  }
  assetsPerformance = assetsPerformance.map((a) => ({
    ...a,
    date: time_type.method(a.timestamp),
  }))

  for (let k = 0; k < tokens.length; k++) {
    let filtered = assetsPerformance
      .filter((a) => a.pricingAsset == tokens[k].address)
      .sort((a, b) => a.timestamp - b.timestamp)
    if (filtered.length > 0) {
      let timestamps = filtered
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((t) => t.date)
      if (time_type.name == '1H') {
        timestamps = timestamps.filter((t) => isTimestampWithinCurrentHour(t))
      }

      if (!result['assetsPerformanceData'][time_type.name])
        result['assetsPerformanceData'][time_type.name] = []
      result['assetsPerformanceData'][time_type.name].push({
        name: tokens[k].symbol,
        data: result['assetsPerformanceTimestamps'][time_type.name].map((t) => {
          let filtered_dates = filtered.filter((f) => f.date == t)
          if (filtered_dates.length == 0) return null
          let sorted = filtered_dates.sort((a, b) => b.timestamp - a.timestamp)
          let last_balance = sorted[0]
          return parseFloat(last_balance.balanceUsd).toFixed(4)
        }),
      })
      result['assetsPerformanceData'][`${time_type.name}_tokens`].push({
        name: tokens[k].symbol,
        data: result['assetsPerformanceTimestamps'][time_type.name].map((t) => {
          let filtered_dates = filtered.filter((f) => f.date == t)
          if (filtered_dates.length == 0) return null
          let sorted = filtered_dates.sort((a, b) => b.timestamp - a.timestamp)
          let last_balance = sorted[0]
          return parseFloat(last_balance.balance).toFixed(4)
        }),
      })
    }
  }
}

/**
 * Add empty days for Asset Performance chart
 * @function AddEmptyDaysAssetsPerformance
 * @param {import('@/composables/admin/mappings').TimeType} time_type - time period
 * @param {import('@/composables/pools/charts/diagrams/useDiagramsData').DiagramsData} result - result object for diagrams data
 * @returns {void}
 */
export function AddEmptyDaysAssetsPerformance(
  time_type,
  result,
  additional_key = '',
) {
  let start_date = new Date(time_type.start_date)
  let end_date = new Date()
  let index = 0
  for (
    let k = 0;
    k <
    result['assetsPerformanceData'][`${time_type.name}${additional_key}`]
      .length;
    k++
  ) {
    let item =
      result['assetsPerformanceData'][`${time_type.name}${additional_key}`][k]
    for (let j = 0; j < item.data.length; j++) {
      let previousItem = j > 0 ? item.data[j - 1] : 0
      if (!item.data[j])
        result['assetsPerformanceData'][`${time_type.name}${additional_key}`][
          k
        ].data[j] = previousItem
    }
  }
  const existingTimestamps = new Set(
    result['assetsPerformanceTimestamps'][time_type.name],
  )

  while (end_date > start_date) {
    let date = time_type.method(start_date.getTime() / 1000)

    if (!existingTimestamps.has(date)) {
      result['assetsPerformanceTimestamps'][time_type.name].splice(
        index,
        0,
        date,
      )
      for (
        let k = 0;
        k <
        result['assetsPerformanceData'][`${time_type.name}${additional_key}`]
          .length;
        k++
      ) {
        let item =
          result['assetsPerformanceData'][`${time_type.name}${additional_key}`][
            k
          ]
        let previous =
          index > 0 && item.data.length > index ? item.data[index - 1] : 0
        item.data.splice(index, 0, previous)
      }
    }
    index++
    start_date = addDaysToDate(start_date, time_type.duration)
  }
  return result
}

/**
 * Format Assets Performance data for the chart.
 * @function FormatPoolAssetsPerformance
 * @param {import('../usePoolHistoricValues').HistoricalBalance[]} assetsPerformance - assets performance for the pool tokens
 * @param {import('@/composables/tokens/useTokenSymbols').Token[]} tokens - tokens of the pool
 * @returns {{assetsPerformance:number[], assetsPerformanceTimestamps:number[]}} - formatted data for the Assets Performance chart on the Pool Details page.
 */
export function FormatPoolAssetsPerformance(assetsPerformance, tokens) {
  let result = {
    assetsPerformanceData: {},
    assetsPerformanceTimestamps: {},
  }
  let time_types = [
    {
      method: getShortHourString,
      name: '1H',
      duration: 0.04,
      start_date: new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
    },
    ...TIME_TYPES,
  ]
  assetsPerformance = ConvertAssetsPerformanceToArray(assetsPerformance)
  for (let i = 0; i < time_types.length; i++) {
    FormatPoolsAssetsPerformanceTimeType(
      assetsPerformance,
      tokens,
      result,
      time_types[i],
    )
  }

  for (let i = 0; i < time_types.length; i++) {
    AddEmptyDaysAssetsPerformance(time_types[i], result, '_tokens')
    AddEmptyDaysAssetsPerformance(time_types[i], result)
  }
  return result
}

/**
 * @typedef {{
 * pricingAsset:string,
 * timestamp:number,
 * balanceUsd:string
 * }} FormattedAssetPerformance
 */

/**
 * Format raw assets performance to array.
 * @function ConvertAssetsPerformanceToArray
 * @param {import('@/composables/pools/charts/usePoolHistoricValues').HistoricalBalance[]} assetsPerformance
 * @returns {FormattedAssetPerformance[]}
 */
export function ConvertAssetsPerformanceToArray(
  assetsPerformance,
  prices = null,
) {
  let result = []
  for (let i = 0; i < assetsPerformance.length; i++) {
    for (let k = 0; k < assetsPerformance[i].tokens.length; k++) {
      let token_info = assetsPerformance[i].tokens[k]
      let _prices = null
      if (prices != null)
        _prices = getTokensPricesForTimestamp(
          [token_info.token.symbol],
          prices,
          assetsPerformance[i].timestamp,
        )
      result.push({
        pricingAsset: token_info.token.address,
        timestamp: assetsPerformance[i].timestamp,
        balanceUsd:
          _prices != null
            ? token_info.balance * _prices[token_info.token.symbol]
            : token_info.balanceUsd,
        balance: token_info.balance,
      })
    }
  }
  return result
}
