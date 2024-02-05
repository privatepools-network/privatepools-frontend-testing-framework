import {
  calculatePercentageDifference,
  formatDateFromTimestamp,
  generateTimeAgoString,
} from '../utils'

export function FormatPoolLP(historicalValues) {
  let sorted = historicalValues.sort((a, b) => a.timestamp - b.timestamp)
  let sortedValue = historicalValues.sort(
    (a, b) => a.poolShareValue - b.poolShareValue,
  )

  let currentLP = 0

  if (sorted.length > 0) {
    currentLP = sorted[sorted.length - 1]['poolShareValue']
  }
  let previousLP = 0
  if (sorted.length > 1) {
    previousLP = sorted[sorted.length - 2]['poolShareValue']
  }
  let highest = sortedValue[sortedValue.length - 1]
  let highestPercent = 0
  if (highest)
    highestPercent = calculatePercentageDifference(
      highest.poolShareValue,
      currentLP,
    )
  else {
    highest = { poolShareValue: 0, timestamp: -1 }
  }
  if (isNaN(highestPercent)) highestPercent = 0

  let lowest = sortedValue[0]
  let lowestPercent = 0
  if (lowest) calculatePercentageDifference(lowest.poolShareValue, currentLP)
  else {
    lowest = { poolShareValue: 0, timestamp: -1 }
  }
  if (isNaN(lowestPercent)) lowestPercent = 0
  let percentChange = calculatePercentageDifference(previousLP, currentLP)
  if (isNaN(percentChange)) percentChange = 0
  return {
    lp: parseFloat(currentLP).toFixed(2),
    highest: parseFloat(highest.poolShareValue).toFixed(2),
    highestTime: formatDateFromTimestamp(highest.timestamp),
    highestTimeAgo: generateTimeAgoString(highest.timestamp),
    highestPercent: parseFloat(highestPercent).toFixed(2),
    lowest: parseFloat(lowest.poolShareValue).toFixed(2),
    lowestTime: formatDateFromTimestamp(lowest.timestamp),
    lowestTimeAgo: generateTimeAgoString(lowest.timestamp),
    lowestPercent: parseFloat(lowestPercent).toFixed(2),
    percentChange: parseFloat(percentChange).toFixed(2),
    diff: currentLP - previousLP,
  }
}
