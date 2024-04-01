import {
  AddEmptyDaysAssetsPerformance,
  ConvertAssetsPerformanceToArray,
  FormatPoolsAssetsPerformanceTimeType,
} from '@/lib/formatter/poolAssetsPerformanceFormatter'
import { usePoolProfitTimeType } from './usePoolProfits'
import { usePoolTradesTimeType } from './usePoolTrades'
import { TIME_TYPES } from '@/composables/admin/mappings'
import { getShortHourString } from '@/lib/utils'
import { getTokensPricesForTimestamp } from '@/lib/formatter/financialStatement/financialStatementFormatter'

/**
 * @typedef {import('./usePoolProfits').ProfitsDiagram} ProfitsDiagram
 */

/**
 * @typedef {Object} DiagramsData
 * @property {Object} assetsPerformance
 * @property {number[]} assetsPerformance.assetsPerformanceTimestamps
 * @property {number[]} assetsPerformance.assetsPerformanceData
 * @property {Object} trades
 * @property {number[]} trades.tradesTimestamps
 * @property {number[]} trades.tradesData
 * @property {ProfitsDiagram} profits

 */

const Diagrams = {
  profits: usePoolProfitTimeType,
  trades: usePoolTradesTimeType,
  assetsPerformance: FormatPoolsAssetsPerformanceTimeType,
  assetsPerformanceEmptyDays: AddEmptyDaysAssetsPerformance,
}

/**
 * Calculate data for pool details diagrams.
 * @function UseDiagramsData
 * @param {import('../../usePoolSwapsStats').Swap[]} filtered - arbitrage trades for that pool
 * @param {import('../usePoolHistoricValues').HistoricalBalance[]} assetsPerformance - assets performance for the pool tokens
 * @param {import('@/composables/tokens/useTokenSymbols').Token[]} tokens - tokens of the pool
 * @returns {DiagramsData} formatted data for pool details diagrams.
 */
export function UseDiagramsData(
  filtered,
  assetsPerformance,
  tokens,
  prices = null,
) {
  assetsPerformance = ConvertAssetsPerformanceToArray(assetsPerformance, prices)
  return createResults(filtered, assetsPerformance, tokens)
}

export function UseCLDiagramsData(
  filtered,
  historicalTokens,
  tokens,
  prices = null,
) {
  const formattedHistoricalTokens = historicalTokens.map((item) => ({
    pricingAsset: item.token.id,
    timestamp: item.date,
    balanceUsd:
      item.totalValueLocked *
      getTokensPricesForTimestamp([item.token.symbol], prices, item.date)[
        item.token.symbol
      ],
    balance: item.totalValueLocked,
  }))
  return createResults(
    filtered,
    formattedHistoricalTokens,
    tokens.map((t) => ({ ...t, address: t.id })),
  )
}

function createResults(filtered, assetsPerformance, tokens) {
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
    profits: { profitsTimestamps: {}, profitsData: {} },
    trades: { tradesTimestamps: {}, tradesData: {} },
    assetsPerformance: {
      assetsPerformanceData: {},
      assetsPerformanceTimestamps: {},
    },
  }
  for (let i = 0; i < time_types.length; i++) {
    let time_type = time_types[i]
    console.log(time_type.name)
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
          )
          break
        case 'assetsPerformanceEmptyDays':
          Diagrams[key](time_type, results['assetsPerformance'])
          Diagrams[key](time_type, results['assetsPerformance'], '_tokens')
          break
      }
    }
  }
  return results
}

// pricingAsset: token_info.token.address,
// timestamp: assetsPerformance[i].timestamp,
// balanceUsd:
//   _prices != null
//     ? token_info.balance * _prices[token_info.token.symbol]
//     : token_info.balanceUsd,
// balance: token_info.balance,
