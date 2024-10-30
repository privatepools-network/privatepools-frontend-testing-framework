import { TIME_TYPES } from '@/composables/admin/mappings'
import {
  addDaysToDate,
  getShortHourString,
  getPriceForTimestamp,
} from '@/lib/utils'
import { getTokensPricesForTimestamp } from '@/lib/formatter/financialStatement/financialStatementUtils'

import { findLast } from 'lodash'
export function FormatPoolsAssetsPerformanceTimeType(
  assetsPerformance,
  tokens,
  time_type,
  result,
  historicalCurrencyPrices,
) {
  result['assetsPerformanceTimestamps'][time_type.name] = []
  result['assetsPerformanceData'][`${time_type.name}_tokens`] = []
  result['assetsPerformanceData'][`${time_type.name}`] = []
  result['assetsPerformanceData_ETH'][`${time_type.name}_tokens`] = []
  result['assetsPerformanceData_ETH'][`${time_type.name}`] = []
  result['assetsPerformanceData_BTC'][`${time_type.name}_tokens`] = []
  result['assetsPerformanceData_BTC'][`${time_type.name}`] = []
  let start_date = new Date(time_type.start_date)
  let end_date = new Date()

  for (let i = 0; i < tokens.length; i++) {
    result['assetsPerformanceData'][time_type.name].push({
      name: tokens[i].symbol,
      data: [],
    })
    result['assetsPerformanceData'][`${time_type.name}_tokens`].push({
      name: tokens[i].symbol,
      data: [],
    })
    result['assetsPerformanceData_ETH'][time_type.name].push({
      name: tokens[i].symbol,
      data: [],
    })
    result['assetsPerformanceData_ETH'][`${time_type.name}_tokens`].push({
      name: tokens[i].symbol,
      data: [],
    })
    result['assetsPerformanceData_BTC'][time_type.name].push({
      name: tokens[i].symbol,
      data: [],
    })
    result['assetsPerformanceData_BTC'][`${time_type.name}_tokens`].push({
      name: tokens[i].symbol,
      data: [],
    })
  }
  assetsPerformance = assetsPerformance.map((a) => ({
    ...a,
    date: time_type.method(parseFloat(a.timestamp.toString())),
  }))
  while (start_date.getTime() < end_date.getTime()) {
    const temp_start_date = start_date.getTime() / 1000
    const date = time_type.method(start_date.getTime() / 1000)
    result['assetsPerformanceTimestamps'][time_type.name].push(date)
    start_date = addDaysToDate(start_date, time_type.duration)
    const end_start_date = start_date.getTime() / 1000
    const priceETH =
      1 / getPriceForTimestamp('ETH', historicalCurrencyPrices, temp_start_date)
    const priceBTC =
      1 / getPriceForTimestamp('BTC', historicalCurrencyPrices, temp_start_date)
    for (let i = 0; i < tokens.length; i++) {
      const tokenAssetsPerformance = assetsPerformance.filter(
        (item) =>
          item.pricingAsset.toLowerCase() == tokens[i].address.toLowerCase(),
      )
      const timeRangeTokenAssetsPerformance = tokenAssetsPerformance.filter(
        (item) =>
          item.timestamp > temp_start_date && item.timestamp < end_start_date,
      )
      const found_chart_data = result['assetsPerformanceData'][
        time_type.name
      ].find((item) => item.name == tokens[i].symbol)
      const found_chart_data_tokens = result['assetsPerformanceData'][
        `${time_type.name}_tokens`
      ].find((item) => item.name == tokens[i].symbol)
      let usd_value = '0'
      let tokens_value = '0'
      if (
        tokenAssetsPerformance &&
        timeRangeTokenAssetsPerformance.length == 0
      ) {
        const found = findLast(
          tokenAssetsPerformance,
          (item) => item.timestamp < temp_start_date,
        )
        if (found) {
          usd_value = found.balanceUsd.toFixed(4)
          tokens_value = parseFloat(found.balance.toString()).toFixed(4)
        } else {
          let previous_value =
            found_chart_data?.data[found_chart_data.data.length - 1] ?? '0'
          let previous_tokens_value =
            found_chart_data_tokens?.data[
              found_chart_data_tokens.data.length - 1
            ] ?? '0'
          usd_value = previous_value
          tokens_value = previous_tokens_value
        }
      } else {
        usd_value =
          timeRangeTokenAssetsPerformance[
            timeRangeTokenAssetsPerformance.length - 1
          ].balanceUsd.toFixed(4)
        tokens_value = parseFloat(
          timeRangeTokenAssetsPerformance[
            timeRangeTokenAssetsPerformance.length - 1
          ].balance.toString(),
        ).toFixed(4)
      }
      found_chart_data?.data.push(usd_value)
      found_chart_data_tokens?.data.push(tokens_value)

      const found_chart_data_ETH = result['assetsPerformanceData_ETH'][
        time_type.name
      ].find((item) => item.name == tokens[i].symbol)
      const found_chart_data_tokens_ETH = result['assetsPerformanceData_ETH'][
        `${time_type.name}_tokens`
      ].find((item) => item.name == tokens[i].symbol)

      found_chart_data_ETH?.data.push(
        (parseFloat(usd_value) * priceETH).toFixed(6),
      )
      found_chart_data_tokens_ETH?.data.push(tokens_value)

      const found_chart_data_BTC = result['assetsPerformanceData_BTC'][
        time_type.name
      ].find((item) => item.name == tokens[i].symbol)
      const found_chart_data_tokens_BTC = result['assetsPerformanceData_BTC'][
        `${time_type.name}_tokens`
      ].find((item) => item.name == tokens[i].symbol)

      found_chart_data_BTC?.data.push(
        (parseFloat(usd_value) * priceBTC).toFixed(6),
      )
      found_chart_data_tokens_BTC?.data.push(tokens_value)
    }
  }
}

/**
 * Add empty days for Asset Performance chart
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
    let item_ETH =
      result['assetsPerformanceData_ETH'][`${time_type.name}${additional_key}`][
        k
      ]
    let item_BTC =
      result['assetsPerformanceData_BTC'][`${time_type.name}${additional_key}`][
        k
      ]
    for (let j = 0; j < item.data.length; j++) {
      let previousItem = j > 0 ? item.data[j - 1] : 0
      let previousItem_ETH = j > 0 ? item_ETH.data[j - 1] : 0
      let previousItem_BTC = j > 0 ? item_BTC.data[j - 1] : 0
      if (!item.data[j])
        result['assetsPerformanceData'][`${time_type.name}${additional_key}`][
          k
        ].data[j] = previousItem.toString()
      result['assetsPerformanceData_ETH'][`${time_type.name}${additional_key}`][
        k
      ].data[j] = previousItem_ETH.toString()
      result['assetsPerformanceData_BTC'][`${time_type.name}${additional_key}`][
        k
      ].data[j] = previousItem_BTC.toString()
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
        let item_ETH =
          result['assetsPerformanceData_ETH'][
            `${time_type.name}${additional_key}`
          ][k]
        let item_BTC =
          result['assetsPerformanceData_BTC'][
            `${time_type.name}${additional_key}`
          ][k]
        let previous =
          index > 0 && item.data.length > index ? item.data[index - 1] : 0
        item.data.splice(index, 0, previous.toString())
        item_ETH.data.splice(index, 0, previous.toString())
        item_BTC.data.splice(index, 0, previous.toString())
      }
    }
    index++
    start_date = addDaysToDate(start_date, time_type.duration)
  }
  return result
}

/**
 * Format Assets Performance data for the chart.
 */
export function FormatPoolAssetsPerformance(
  assetsPerformance,
  tokens,
  historicalCurrencyPrices,
) {
  let result = {
    assetsPerformanceData: {},
    assetsPerformanceData_ETH: {},
    assetsPerformanceData_BTC: {},
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
  const convertedAssetsPerformance = ConvertAssetsPerformanceToArray(
    assetsPerformance,
    historicalCurrencyPrices,
  )
  for (let i = 0; i < time_types.length; i++) {
    FormatPoolsAssetsPerformanceTimeType(
      convertedAssetsPerformance,
      tokens,
      time_types[i],
      result,
      historicalCurrencyPrices,
    )
  }

  //for (let i = 0; i < time_types.length; i++) {
  //AddEmptyDaysAssetsPerformance(time_types[i], result, "_tokens");
  //AddEmptyDaysAssetsPerformance(time_types[i], result);
  // }
  return result
}

export function ConvertAssetsPerformanceToArray(assetsPerformance, prices) {
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
  return result.sort((a, b) => a.timestamp - b.timestamp)
}
