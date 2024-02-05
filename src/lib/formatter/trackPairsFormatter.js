import { DisplayNetwork } from '@/composables/useNetwork'
import {
  //formatAggregatedValue,
  getAdditionalInfoByTimeline,
} from './poolsFormatter'
import {
  usePool24hGasFee,
  usePool24hProfit,
  usePool24hRevenue,
  usePool30dGasFee,
  usePool30dProfit,
  usePool30dRevenue,
  usePool7dGasFee,
  usePool7dProfit,
  usePool7dRevenue,
  usePoolAllTimeGasFee,
  usePoolAllTimeProfit,
  usePoolAllTimeRevenue,
  usePool24hTrades,
  usePool24hVolume,
  usePool30dTrades,
  usePool30dVolume,
  usePool7dTrades,
  usePool7dVolume,
  usePoolAllTimeTrades,
  usePoolAllTimeVolume,
} from '@/composables/pools/usePoolSwapsStats'

const TIMELINE_MAPPING = {
  '24 H': {
    Profit: usePool24hProfit,
    Revenue: usePool24hRevenue,
    Trades: usePool24hTrades,
    Volume: usePool24hVolume,
    Fees: usePool24hGasFee,
  },
  '7 D': {
    Profit: usePool7dProfit,
    Revenue: usePool7dRevenue,
    Trades: usePool7dTrades,
    Volume: usePool7dVolume,
    Fees: usePool7dGasFee,
  },
  '30 D': {
    Profit: usePool30dProfit,
    Revenue: usePool30dRevenue,
    Trades: usePool30dTrades,
    Volume: usePool30dVolume,
    Fees: usePool30dGasFee,
  },
  'All Time': {
    Profit: usePoolAllTimeProfit,
    Revenue: usePoolAllTimeRevenue,
    Trades: usePoolAllTimeTrades,
    Volume: usePoolAllTimeVolume,
    Fees: usePoolAllTimeGasFee,
  },
}

/**
 * @typedef {import('@/composables/pools/useTokenPairs').TokenInfo} TokenInfo
 * @typedef {import('@/composables/pools/useTokenPairs').TokenPairInfo} TokenPairInfo
 * @typedef {import('@/composables/pools/useTokenPairs').TokenPairsInfo} TokenPairsInfo
 */

/**
 * @typedef {{
 * id: string,
 *   Profit: number,
 *   Revenue: number,
 *   Trades: number,
 *   Volume: number,
 *   TVL: string,
 *   Fees: number,
 *   Blockchain: string
 * }}TrackingInfoTableItem
 */

/**
 * @typedef {{
 *  'Pair Name':string
 * }} PairName
 *
 * @typedef {TrackingInfoTableItem & PairName} PairTrackingInfo
 */

/**
 * Find all pairs that equal to id in swap.
 * @function findAllTrackPairIndexes
 * @param {string[]} arr - array of pairs
 * @param {string} id - pair id
 * @returns {number[]} array of found pairs indexes
 */
function findAllTrackPairIndexes(arr, id) {
  const indexes = []
  for (let i = 0; i < arr.length; i++) {
    if (isEqualPairs(arr[i], id)) {
      indexes.push(i)
    }
  }
  return indexes
}

/**
 * Format token pairs for tracking page.
 * @function FormatPairsData
 * @param {TokenPairInfo[]} pairs - info about protocol pairs
 * @param {TokenInfo[]} tokens - info about protocol tokens
 * @param {import('./poolsFormatter').Swap[]} poolSwapsData - swaps of these pairs from /output call
 * @param {boolean} enableAdditionalInfo - add periods info based on trades (like revenue, fee, profit and etc)
 * @returns {PairTrackingInfo[]} formatted pairs for tracking info page
 */
export function FormatPairsData(
  pairs,
  tokens,
  poolSwapsData,
  enableAdditionalInfo = false,
  decimals = 3,
) {
  let result = []
  for (let i = 0; i < pairs.length; i++) {
    let pair = pairs[i]
    let filtered = poolSwapsData.filter(
      (t) =>
        t['swaps'].length > 0 &&
        t['swaps'][0]['trackPair'].filter((id) => isEqualPairs(id, pair.id))
          .length > 0,
    )
    filtered.forEach((f) => {
      f = { ...f, gasFeeUsd: f.gasFeeUsd / 2 / f.swaps.length }
      let indexes = findAllTrackPairIndexes(f.swaps[0].trackPair, pair.id)
      for (const [key, value] of Object.entries(f.swaps[0])) {
        f.swaps[0][key] = indexes.map((i) => value[i])
      }
    })
    let additionalInfo = {}
    if (enableAdditionalInfo) {
      additionalInfo = getAdditionalInfoByTimeline(
        TIMELINE_MAPPING,
        filtered,
        decimals,
      )
      additionalInfo['Pair Id'] = pair.id
    }
    let splited = pair.id.split('-')
    let token0Price = tokens.find((t) => t.id == splited[0]).latestPrice
    let token1Price = tokens.find((t) => t.id == splited[1]).latestPrice
    let balance0Usd = token0Price
      ? token0Price.priceUSD * parseFloat(pair.balanceToken0)
      : 0
    let balance1Usd = token1Price
      ? token1Price.priceUSD * parseFloat(pair.balanceToken1)
      : 0
    result.push({
      Name: [splited.map((s) => tokens.find((t) => t.id == s).symbol)],
      TVL: (balance0Usd + balance1Usd).toFixed(decimals),
      balance0: balance0Usd,
      balance1: balance1Usd,
      ...additionalInfo,
    })
  }
  return result
}

/**
 * Format pairs data for tracking info page. (without fields deleting)
 * @function FormatAllPairsData
 * @param {TokenPairsInfo} pairs - pairs info including (pairs, tokens, token snapshots)
 * @param {Swap[]} poolSwapsData - swaps of these pairs
 * @param {number} network - network ID of the network where the data is to be found
 * @returns {PairTrackingInfo[]} formatted pairs info for tracking info page.
 */
export function FormatAllPairsData(
  pairs,
  poolSwapsData,
  network,
  decimals = 3,
) {
  let { tokens, tokenPairs } = pairs
  let formatted = FormatPairsData(
    tokenPairs,
    tokens,
    poolSwapsData,
    true,
    decimals,
  )
  let allData = formatted.map((p) => ({
    id: p['Pair Id'],
    'Pair Name': p.Name.flat(),
    Profit: p['Profit All Time'],
    Revenue: p['Revenue All Time'],
    Trades: p['Trades All Time'],
    Volume: p['Volume All Time'],
    TVL: p.TVL,
    Fees: p['Fees All Time'],
    Blockchain: DisplayNetwork[network],
    balance0: p.balance0,
    balance1: p.balance1,
    ...p,
  }))
  return allData
}

/**
 * Format pairs data for tracking info page. (with fields deleting)
 * @function FormatAllPairsToDisplay
 * @param {PairTrackingInfo[]} allData - all data with excess fields from @see FormatAllPairsData
 * @param {number} network - network ID of the network where the data is to be found
 * @returns {PairTrackingInfo[]} formatted pool info for tracking info page.
 */
export function FormatAllPairsToDisplay(allData, network) {
  return allData
    .filter((d) => d.Blockchain == network || network == 'All Chains')
    .map((p) => ({
      id: p['Pair Id'],
      'Pair Name': p.Name,
      Revenue: p['Revenue All Time'],
      Fees: p['Fees All Time'],
      Trades: p['Trades All Time'],
      Volume: p['Volume All Time'],
      TVL: p.TVL,
      Profit: p['Profit All Time'],
      Blockchain: p['Blockchain'],
      balance0: p.balance0,
      balance1: p.balance1,
    }))
}

/**
 * Check is one pair equals to another. In both orders (a/b = b/a || a/b = a/b)
 * @function isEqualPairs
 * @param {string} pair0
 * @param {string} pair1
 * @returns {boolean} is pair equals to another or not.
 */
export function isEqualPairs(pair0, pair1) {
  let [pair0_0, pair0_1] = pair0.split('-').map((p) => p.toLowerCase())
  let [pair1_0, pair1_1] = pair1.split('-').map((p) => p.toLowerCase())
  return (
    (pair0_0 == pair1_0 && pair0_1 == pair1_1) ||
    (pair0_0 == pair1_1 && pair0_1 == pair1_0)
  )
}
