import {
  usePool24hFee,
  usePool24hGasFee,
  usePool24hProfit,
  usePool24hRevenue,
  usePool24hTrades,
  usePool24hVolume,
  usePool30dFee,
  usePool30dGasFee,
  usePool30dProfit,
  usePool30dRevenue,
  usePool30dTrades,
  usePool30dVolume,
  usePool7dFee,
  usePool7dGasFee,
  usePool7dProfit,
  usePool7dRevenue,
  usePool7dTrades,
  usePool7dVolume,
  usePoolAllTimeFee,
  usePoolAllTimeGasFee,
  usePoolAllTimeProfit,
  usePoolAllTimeRevenue,
  usePoolAllTimeTrades,
  usePoolAllTimeVolume,
} from '@/composables/pools/usePoolSwapsStats'
import { FormatHistoricalTvl } from '@/lib/formatter/poolTvlFormatter'
import {
  formatBigNumber,
  formatDateFromTimestamp,
  generateTimeAgoString,
} from '../utils'
import { FormatPoolLP } from './poolLPFormatter'
import { DisplayNetwork } from '@/composables/useNetwork'
import {
  CalculateDayAvgApr,
  CalculateMonthAvgApr,
  CalculateTotalAvgApr,
  CalculateWeekAvgApr,
} from '@/composables/math/chartMath/trackingInfoMath'
/**
 * @typedef {Object} Timeline
 * @property {Function} Profit
 * @property {Function} Revenue
 * @property {Function} Trades
 * @property {Function} Volume
 * @property {Function} APR
 * @property {Function} Fees
 * @property {Function} 'Gas Fees'
 */
/**
 * @typedef {Object} TimelineMapping
 * @property {Timeline} '24 H'
 * @property {Timeline} '7 D'
 * @property {Timeline} '30 D'
 * @property {Timeline} 'All Time'
 */

export const TIMELINE_MAPPING = {
  '24 H': {
    Profit: usePool24hProfit,
    Revenue: usePool24hRevenue,
    Trades: usePool24hTrades,
    Volume: usePool24hVolume,
    APR: () => ({ value: 0 }),
    Fees: usePool24hFee,
    'Gas Fees': usePool24hGasFee,
  },
  '7 D': {
    Profit: usePool7dProfit,
    Revenue: usePool7dRevenue,
    Trades: usePool7dTrades,
    Volume: usePool7dVolume,
    APR: () => ({ value: 0 }),
    Fees: usePool7dFee,
    'Gas Fees': usePool7dGasFee,
  },
  '30 D': {
    Profit: usePool30dProfit,
    Revenue: usePool30dRevenue,
    Trades: usePool30dTrades,
    Volume: usePool30dVolume,
    APR: () => ({ value: 0 }),
    Fees: usePool30dFee,
    'Gas Fees': usePool30dGasFee,
  },
  'All Time': {
    Profit: usePoolAllTimeProfit,
    Revenue: usePoolAllTimeRevenue,
    Trades: usePoolAllTimeTrades,
    Volume: usePoolAllTimeVolume,
    APR: () => ({ value: 0 }),
    Fees: usePoolAllTimeFee,
    'Gas Fees': usePoolAllTimeGasFee,
  },
}

const APR_TIMELINE_MAPPING = {
  '24 H': {
    APR: CalculateDayAvgApr,
  },
  '7 D': {
    APR: CalculateWeekAvgApr,
  },
  '30 D': {
    APR: CalculateMonthAvgApr,
  },
  'All Time': {
    APR: CalculateTotalAvgApr,
  },
}

/**
 * @typedef {import('@/composables/pools/usePoolSwapsStats').Swap} Swap
 * @typedef {import('@/composables/pools/usePools').SimplePoolData} SimplePoolData
 * @typedef {import('@/composables/pools/charts/usePoolHistoricValues').PoolHistoricalValues} PoolHistoricalValues
 * @typedef {import('@/composables/pools/snapshots/usePoolHistoricalTvl').HistoricalTVL} HistoricalTVL
 * @typedef {import('@/composables/pools/usePools').PoolData} PoolData
 */

/**
 * @typedef {Object} PoolFormattedData
 * @property {string} id - The unique identifier of the pool.
 * @property {string} chain - The chain associated with the pool.
 * @property {string} factory - The factory of the pool.
 * @property {string} address - The address of the pool.
 * @property {string} LPPriceChange - The LP price change, formatted to 3 decimal places.
 * @property {string} LPCurrent - The current LP value, formatted to 2 decimal places.
 * @property {string} volume24H - The 24-hour trading volume.
 * @property {string} TVL - The total value locked in the pool, formatted to 5 decimal places.
 * @property {string} LPPrice - The LP price calculated as totalShares divided by totalLiquidity.
 * @property {string} APRPercentage - The annual percentage rate (APR) as a percentage, formatted to 3 decimal places.
 */

/**
 * @typedef {{
 *   id: string,
 *   'Pool Name': string[],
 *   Profit: number,
 *   Revenue: number,
 *   Trades: number,
 *   Volume: number,
 *   TVL: string,
 *   Fees: number,
 *   Blockchain: string
 * }} PoolTrackingInfo
 */

function filterSwaps(swaps, poolId) {
  return swaps.filter(
    (t) =>
      t['swaps'].length > 0 && t['swaps'][0]['poolIdVault'].includes(poolId),
  )
}

/**
 * Format raw pools data to display in table.
 * @function FormatPoolsData
 * @param {SimplePoolData[]} pools - pools to format
 * @param {Swap[]} poolSwapsData - swaps of these pools from /output call
 * @param {PoolHistoricalValues} historicValues - pools historic values
 * @param {boolean} enableAdditionalInfo - add periods info based on trades (like revenue, fee, profit and etc)
 * @returns {PoolFormattedData[]} formatted pools data
 */
export function FormatPoolsData(
  pools,
  poolSwapsData,
  historicValues,
  enableAdditionalInfo = false,
  decimals = 3,
) {
  let result = []
  for (let i = 0; i < pools.length; i++) {
    let pool = pools[i]
    let filtered = filterSwaps(poolSwapsData, pool.id)
    let filtered_historic = historicValues.find((hv) => hv.id == pool.id)
    let lpChange = '0'
    let lpCurrent = '0'
    if (
      filtered_historic &&
      filtered_historic.historicalValues &&
      filtered_historic.historicalValues.length > 0
    ) {
      let formatted = FormatPoolLP(filtered_historic.historicalValues)
      lpChange = formatted.diff
      lpCurrent = formatted.lp
    }
    let additionalInfo = {}
    if (enableAdditionalInfo) {
      additionalInfo = getAdditionalInfoByTimeline(
        TIMELINE_MAPPING,
        filtered,
        decimals,
      )
      additionalInfo['Pool Id'] = pool.id
    }
    let volume24h = formatAggregatedValue(filtered, usePool24hVolume)
    result.push({
      Name: [pool.tokens.map((t) => t.symbol)],
      id: pool.id,
      chain: pool.chain,
      factory: pool.factory,
      address: pool.address,
      'LP Price Change': parseFloat(lpChange).toFixed(3),
      'LP Current': parseFloat(lpCurrent).toFixed(2),
      'Volume 24 H': volume24h,
      TVL: parseFloat(pool.totalLiquidity).toFixed(5),
      'LP Price': pool.totalShares / pool.totalLiquidity,
      'APR %':
        parseFloat(parseFloat(pool.totalLiquidity).toFixed(3)) > 0
          ? pool.apr
            ? parseFloat(pool.apr.total * 100).toFixed(3)
            : 0
          : 0,
      ...additionalInfo,
    })
  }
  return result
}

/**
 * Set Total APR % for pools.
 * @function FormatPoolsApr
 * @param {PoolFormattedData[]} formattedPools - formatted pools @see FormatPoolsData
 * @param {HistoricalTVL[]} historicalTvl - historical tvls for these pools
 * @param {Swap[]} swapsData - swaps data of these pools
 * @returns {void} It updates formattedPools objects!
 */
export function FormatPoolsApr(formattedPools, historicalTvl, swapsData) {
  for (let i = 0; i < formattedPools.length; i++) {
    let pool = formattedPools[i]
    let poolTvl = FormatHistoricalTvl(
      historicalTvl.filter((t) => t.pool.id == pool.id),
    )
    let poolSwaps = swapsData.filter(
      (t) => t.swaps[0].poolIdVault[0] == pool.id,
    )

    let apr = CalculateTotalAvgApr(poolTvl, poolSwaps, pool.chain)

    pool['APR %'] = formatBigNumber(apr)
  }
}

/**
 * Format pool statistics to more readable format.
 * @function FormatPoolStats
 * @param {PoolData} pool - pool data to format
 * @returns {import('@/composables/pools/usePools').PoolData} copy of that pool with formatted values/
 */
export function FormatPoolStats(pool) {
  let result = {
    ...pool,
    apr: {
      ...pool?.apr,
      total: pool.apr
        ? formatBigNumber(parseFloat((pool?.apr.total * 100).toFixed(3)))
        : 0,
    },
    totalLiquidity: formatBigNumber(parseFloat(pool?.totalLiquidity)),
    volume24h: formatBigNumber(parseFloat(pool?.volume24h).toFixed(3)),
    fees24h: formatBigNumber(parseFloat(pool?.fees24h).toFixed(3)),
    createdAt: formatDateFromTimestamp(pool?.createTime),
    timeAgo: generateTimeAgoString(pool?.createTime),
    lpPrice: pool?.totalLiquidity / pool?.totalShares,
    tokens: pool?.tokens.map((t) => {
      return { ...t, weight: parseFloat((t.weight * 100).toFixed(0)) }
    }),
    totalSwapVolume: formatBigNumber(
      parseFloat(pool?.totalSwapVolume).toFixed(2),
    ),
    totalSwapFee: formatBigNumber(parseFloat(pool?.totalSwapFee).toFixed(2)),
  }
  return result
}

/**
 * Format summarized data of swaps from /output to more readable format.
 * @function formatAggregatedValue
 * @param {Swap[]} filtered - filtered swaps data
 * @param {Function} aggregateFunc - function which will summarize swaps fields.
 * @param {number} decimals - number of decimals to leave in result.
 * @returns {number} Formatted value of summarized swaps data stat.
 */
export function formatAggregatedValue(filtered, aggregateFunc, decimals = 3) {
  let aggregated_result = aggregateFunc(filtered)
  return parseFloat(
    aggregated_result.rawValue
      ? aggregated_result.rawValue
      : aggregated_result.value,
  ).toFixed(decimals)
}

/**
 * Get additional info about trades based on swaps from /output.
 * @function getAdditionalInfoByTimeline
 * @param {TimelineMapping} timeline_mapping
 * @param {Swap[]} filtered - swaps to analyze for statistics
 * @returns {Object} summarized statistics for swaps
 */
export function getAdditionalInfoByTimeline(
  timeline_mapping,
  filtered,
  decimals = 3,
) {
  let info = {}
  Object.keys(timeline_mapping).forEach((key) => {
    Object.keys(timeline_mapping[key]).map((main_key) => {
      let _decimals = decimals
      if (main_key.includes('Trades')) _decimals = 0
      info[`${main_key} ${key}`] = formatAggregatedValue(
        filtered,
        timeline_mapping[key][main_key],
        _decimals,
      )
    })
  })
  return info
}

function addAPRInfo(historicalTvl, poolSwapsData, chainSelected) {
  let info = {}
  Object.keys(APR_TIMELINE_MAPPING).forEach((key) => {
    info[`APR ${key}`] = parseFloat(
      APR_TIMELINE_MAPPING[key]['APR'](
        historicalTvl,
        poolSwapsData,
        chainSelected,
      ),
    ).toFixed(3)
  })
  return info
}

/**
 * Format pools data for tracking info page.
 * @function FormatPoolForTrackingPage
 * @param {SimplePoolData[]} pools - pools to format
 * @param {Swap[]} poolSwapsData - swaps of these pools
 * @param {PoolHistoricalValues} historicValues - pools historic values
 * @param {number} network - network ID of the network where the data is to be found
 * @returns {PoolTrackingInfo} formatted pool info for tracking info page.
 */
export function FormatPoolForTrackingPage(
  pools,
  poolSwapsData,
  historicValues,
  historicalTvl,
  network,
) {
  let formatted = FormatPoolsData(pools, poolSwapsData, historicValues, true)
  let trackPageFormatted = formatted.map((p) => ({
    id: p['Pool Id'],
    'Pool Name': p.Name.flat(), // array of symbols

    Profit: p['Profit All Time'],
    Revenue: p['Revenue All Time'],
    Trades: p['Trades All Time'],
    Volume: p['Volume All Time'],
    TVL: p.TVL,
    Fees: p['Fees All Time'],
    Blockchain: DisplayNetwork[network],
  }))
  return trackPageFormatted
}

/**
 * The same thing as @see FormatPoolForTrackingPage, but without fields being deleted.
 * @function FormatPoolForTrackingPage
 * @param {SimplePoolData[]} pools - pools to format
 * @param {Swap[]} poolSwapsData - swaps of these pools
 * @param {PoolHistoricalValues} historicValues - pools historic values
 * @param {number} network - network ID of the network where the data is to be found
 * @returns {Object} formatted pool info for tracking info page.
 */
export function FormatAllPoolForTrackingPage(
  pools,
  poolSwapsData,
  historicValues,
  historicalTvl,
  network,
  decimals = 3,
) {
  let formatted = FormatPoolsData(
    pools,
    poolSwapsData,
    historicValues,
    true,
    decimals,
  )
  formatted = formatted.map((item) => ({
    ...item,
    ...addAPRInfo(
      FormatHistoricalTvl(historicalTvl.filter((hv) => hv.pool.id == item.id)),
      filterSwaps(poolSwapsData, item.id),
      DisplayNetwork[network],
    ),
  }))
  let allData = formatted.map((p) => ({
    id: p['Pool Id'],
    'Pool Name': p.Name.flat(),
    Profit: p['Profit All Time'],
    Revenue: p['Revenue All Time'],
    Trades: p['Trades All Time'],
    Volume: p['Volume All Time'],
    TVL: p.TVL,
    Fees: p['Fees All Time'],
    Blockchain: DisplayNetwork[network],
    ...p,
  }))
  return allData
}
/**
 * Delete unnecessary fields to display on tracking info page.
 * @function FormatAllToDisplay
 * @param {Object} allData - all data taken from @see FormatAllPoolForTrackingPage
 * @param {number} network - network ID of the network where the data is to be found
 * @returns {PoolTrackingInfo} return pools formatted data like in @see FormatPoolForTrackingPage
 */
export function FormatAllToDisplay(allData, network) {
  return allData
    .filter((d) => d.Blockchain == network || network == 'All Chains')
    .map((p) => ({
      id: p['Pool Id'],
      'Pool Name': p.Name,
      Revenue: p['Revenue All Time'],
      Fees: p['Fees All Time'],
      Trades: p['Trades All Time'],
      Volume: p['Volume All Time'],
      TVL: p.TVL,
      APR: p['APR All Time'],
      Profit: p['Profit All Time'],
      Blockchain: p['Blockchain'],
      // address: p['address'],
      // ...p,
    }))
}
