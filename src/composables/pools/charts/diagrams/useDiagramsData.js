import {
  AddEmptyDaysAssetsPerformance,
  ConvertAssetsPerformanceToArray,
  FormatPoolsAssetsPerformanceTimeType,
} from './poolAssetsPerformanceFormatter'
import { usePoolProfitTimeType } from './usePoolProfits'
import { usePoolTradesTimeType } from './usePoolTrades'

import { getShortHourString } from '@/lib/utils'
import { TIME_TYPES } from '@/composables/admin/mappings'

const Diagrams = {
  profits: usePoolProfitTimeType,
  trades: usePoolTradesTimeType,
  assetsPerformance: FormatPoolsAssetsPerformanceTimeType,
  assetsPerformanceEmptyDays: AddEmptyDaysAssetsPerformance,
}

/**
 * Calculate data for pool details diagrams.
 */
export function UseDiagramsData(filtered, assetsPerformance, tokens, prices) {
  const convertedAssetsPerformance = ConvertAssetsPerformanceToArray(
    assetsPerformance,
    prices,
  )
  return createResults(filtered, convertedAssetsPerformance, tokens, prices)
}


function createResults(
  filtered,
  assetsPerformance,
  tokens,
  historicalCurrencyPrices,
) {
  let time_types = [
    {
      method: getShortHourString,
      name: '1H',
      duration: 0.04,
      start_date: new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
    },
    ...TIME_TYPES,
  ]
  let results = {
    profits: {
      profitsTimestamps: {},
      profitsData: {},
      profitsData_ETH: {},
      profitsData_BTC: {},
    },
    trades: { tradesTimestamps: {}, tradesData: {} },
    assetsPerformance: {
      assetsPerformanceData: {},
      assetsPerformanceData_ETH: {},
      assetsPerformanceData_BTC: {},
      assetsPerformanceTimestamps: {},
    },
  }
  for (let i = 0; i < time_types.length; i++) {
    let time_type = time_types[i]
    for (const [key] of Object.entries(Diagrams)) {
      if (time_type.name == '1H' && !key.includes('assets')) {
        continue
      }

      switch (key) {
        case 'profits':
          Diagrams[key](filtered, time_type, results[key])
          break
        case 'trades':
          Diagrams[key](filtered, time_type, results[key])
          break
        case 'assetsPerformance':
          Diagrams[key](
            assetsPerformance,
            tokens,
            time_type,
            results['assetsPerformance'],
            historicalCurrencyPrices,
          )
          break
        // case "assetsPerformanceEmptyDays":
        //   Diagrams[key](time_type, results["assetsPerformance"]);
        //   Diagrams[key](time_type, results["assetsPerformance"], "_tokens");
        //   break;
      }
    }
  }
  return results
}
