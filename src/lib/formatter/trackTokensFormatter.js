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
 * @typedef {{
 *  'Name':string,
 *  'Token id':string,
 * }} TokenName
 *
 * @typedef {TrackingInfoTableItem & TokenName} TokenTrackingInfo
 */

/**
 * Format tokens for tracking page.
 * @function FormatTokensData
 * @param {import('./tokenSnapshotsFormatter').TokenInfo[]} tokens - info about protocol tokens
 * @param {import('./poolsFormatter').Swap[]} poolSwapsData - swaps of these tokens from /output call
 * @param {boolean} enableAdditionalInfo - add periods info based on trades (like revenue, fee, profit and etc)
 * @returns {import('./trackPairsFormatter').TokenTrackingInfo[]} formatted tokens for tracking info page
 */
export function FormatTokensData(
  tokens,
  poolSwapsData,
  enableAdditionalInfo = false,
  decimals = 3,
) {
  let result = []
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    let tokenSym = tokens[i].symbol
    let filtered = poolSwapsData.filter(
      (t) =>
        tokenSym ==
        tokens.find((tok) => tok.id.toLowerCase() == t.token.toLowerCase())
          .symbol,
    )

    let additionalInfo = {}
    if (enableAdditionalInfo) {
      additionalInfo = getAdditionalInfoByTimeline(
        TIMELINE_MAPPING,
        filtered,
        decimals,
      )
      additionalInfo['Token id'] = token.id
    }
    result.push({
      Name: [tokenSym],
      TVL: parseFloat(token.totalBalanceUSD).toFixed(decimals),
      ...additionalInfo,
    })
  }
  return result
}

/**
 * Format tokens data for tracking info page. (without fields deleting)
 * @function FormatAllPairsData
 * @param {TokenPairsInfo} tokens - tokens info
 * @param {Swap[]} poolSwapsData - swaps of these pairs
 * @param {number} network - network ID of the network where the data is to be found
 * @returns {TokenTrackingInfo[]} formatted tokens info for tracking info page.
 */
export function FormatAllTokensData(
  tokens,
  poolSwapsData,
  network,
  decimals = 3,
) {
  let formatted = FormatTokensData(tokens, poolSwapsData, true, decimals)
  let allData = formatted.map((p) => ({
    id: p['Token Id'],
    'Token Name': p['Name'].flat(),
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
 * Format tokens data for tracking info page. (with fields deleting)
 * @function FormatAllTokensToDisplay
 * @param {TokenTrackingInfo[]} allData - all data with excess fields
 * @param {number} network - network ID of the network where the data is to be found
 * @returns {TokenTrackingInfo[]} formatted pool info for tracking info page.
 */
export function FormatAllTokensToDisplay(allData, network) {
  console.log(allData, network)
  return allData
    .filter((d) => d.Blockchain == network || network == 'All Chains')
    .map((p) => ({
      id: p['Token Id'],
      'Token Name': [p['Name']],
      Revenue: p['Revenue All Time'],
      Fees: p['Fees All Time'],
      Trades: p['Trades All Time'],
      Volume: p['Volume All Time'],
      TVL: p.TVL,
      Profit: p['Profit All Time'],
      Blockchain: p['Blockchain'],
    }))
}
