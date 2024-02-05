import { formatSimpleTimestamp, sumArrays } from '../utils'

/**
 * @typedef {import('@/composables/pools/useTokenPairs').TokenInfo} TokenInfo
 * @typedef {import('@/composables/pools/useTokenPairs').TokenSnapshotInfo} TokenSnapshotInfo
 */

/**
 * @typedef {{timestamps:number[], Dates:string[]}  & {[key: string]: number[]}} ChartAssets
 */

/**
 * Format tokens snapshots to diplay them on tracking info chart.
 * @function FormatTokenSnapshots
 * @param {TokenSnapshotInfo[]} snapshots - token snapshots with historical balances
 * @param {TokenInfo[]} tokens - tokens of protocol
 * @returns {ChartAssets} returns object with info about dates/timestamps and value for each symbol.
 * @example
 * {timestamps:[167000000, 168000000, 168000000], 'BTC':[1,2,3], 'Dates':['1/2/2000', '1/3/2000', '1/4/2000']}
 */
export function FormatTokenSnapshots(snapshots, tokens) {
  let result_temp = {}
  let result = {
    timestamps: [],
    Dates: [],
  }

  let timestamps = Array.from(new Set(snapshots.map((s) => s.timestamp))).sort(
    (a, b) => a - b,
  )
  for (let i = 0; i < timestamps.length; i++) {
    let ts = timestamps[i] * 1000
    result.timestamps.push(ts)
    result.Dates.push(formatSimpleTimestamp(timestamps[i]))
    for (let k = 0; k < tokens.length; k++) {
      let found = snapshots.find(
        (s) => s.id.includes(tokens[k].id) && s.timestamp == timestamps[i],
      )
      let id = tokens[k].id
      let token_value = 0
      if (!result_temp[id]) {
        result_temp[id] = []
      }
      if (!found) {
        if (result_temp[id].length > 0)
          token_value = result_temp[id][result_temp[id].length - 1]
      } else {
        token_value = parseFloat(found.totalBalanceUSD)
      }

      result_temp[id].push(token_value)
    }
  }
  for (let k = 0; k < tokens.length; k++) {
    let symbol = tokens[k].symbol
    if (!result[symbol]) result[symbol] = result_temp[tokens[k].id]
    else {
      result[symbol] = sumArrays(result[symbol], result_temp[tokens[k].id])
    }
  }

  return result
}
