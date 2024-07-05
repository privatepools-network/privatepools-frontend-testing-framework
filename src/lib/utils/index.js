import BigNumber from 'bignumber.js'
import pkg from '@/../package.json'
export function shorten(str = '') {
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`
}

export async function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export function clone(item) {
  return JSON.parse(JSON.stringify(item))
}

export function getCurrentTs() {
  return parseInt((new Date().getTime() / 1e3).toString())
}

export function tsToBlockNumber(currentBlockNumber, ts) {
  const diffTs = getCurrentTs() - ts
  return currentBlockNumber - parseInt((diffTs / 13.35).toString())
}

export function bnum(val) {
  const number = typeof val === 'string' ? val : val ? val.toString() : '0'
  return new BigNumber(number)
}

export const bnumZero = bnum(0)

export function scale(input, decimalPlaces) {
  const unscaled = typeof input === 'string' ? new BigNumber(input) : input
  const scalePow = new BigNumber(decimalPlaces.toString())
  const scaleMul = new BigNumber(10).pow(scalePow)
  return unscaled.times(scaleMul)
}

export function scaleDown(input, decimalPlaces) {
  const scalePow = new BigNumber(decimalPlaces.toString())
  const scaleMul = new BigNumber(10).pow(scalePow)
  return input.dividedBy(scaleMul)
}

export function shortenLabel(str, segLength = 4) {
  const firstSegment = str.substring(0, segLength + 2)
  const lastSegment = str.substring(str.length, str.length - segLength)
  return `${firstSegment}...${lastSegment}`
}

/**
 * Wait for a reactive variable to change to an expected value.
 */
export async function forChange(
  reactiveVar,
  expected,
  checkCount = 0,
  checkDelay = 500,
  checkLimit = 20,
) {
  if (reactiveVar.value === expected || checkCount >= checkLimit) return
  await sleep(checkDelay)
  await forChange(reactiveVar, expected, checkCount++)
}

/**
 * Sums and array of string numbers and returns as BigNumber
 */
export function bnSum(amounts) {
  return amounts.reduce((a, b) => bnum(a).plus(b), bnum(0))
}

export function formatBigNumber(number, decimals = 2) {
  if (isNaN(number)) return 0
  number = parseFloat(parseFloat(number).toFixed(decimals))
  if (Math.abs(number) >= 1000000000) {
    return (number / 1000000000).toFixed(decimals) + 'B'
  } else if (Math.abs(number) >= 1000000) {
    return (Math.abs(number) / 1000000).toFixed(decimals) + 'M'
  } else if (Math.abs(number) >= 1000) {
    return (number / 1000).toFixed(decimals) + 'K'
  }
  return number.toString()
}

export function trimZeros(number) {
  if (isNaN(number) || number == '-') return 0
  // Convert number to string
  let numberString = number.toString()

  // Check if the number has a decimal point
  if (numberString.includes('.')) {
    // Remove trailing zeros after decimal point
    numberString = numberString.replace(/\.?0+$/, '')
  }

  // Convert back to number and return
  return parseFloat(numberString)
}
export function formatDateFromTimestamp(timestamp) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const date = new Date(timestamp * 1000) // Convert UNIX timestamp to milliseconds
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()

  const formattedDate = `${month}.${day}, ${year}`
  return formattedDate
}

export function generateTimeAgoString(timestamp) {
  const now = new Date().getTime() / 1000
  const difference = now - timestamp

  const secondsInAMinute = 60
  const secondsInAnHour = 60 * secondsInAMinute
  const secondsInADay = 24 * secondsInAnHour
  const secondsInAMonth = 30 * secondsInADay
  const secondsInAYear = 365 * secondsInADay

  if (difference >= secondsInAYear) {
    const yearsAgo = Math.floor(difference / secondsInAYear)
    return `${yearsAgo} year${yearsAgo !== 1 ? 's' : ''} ago`
  } else if (difference >= secondsInAMonth) {
    const monthsAgo = Math.floor(difference / secondsInAMonth)
    return `${monthsAgo} month${monthsAgo !== 1 ? 's' : ''} ago`
  } else if (difference >= secondsInADay) {
    const daysAgo = Math.floor(difference / secondsInADay)
    return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`
  } else {
    const hoursAgo = Math.floor(difference / secondsInAnHour)
    return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`
  }
}

export function SummarizeTokens(tokens, pricesInfo) {
  if (!pricesInfo) return 0
  let sum = 0
  for (let i = 0; i < tokens.length; i++) {
    let current = tokens[i]

    let price = pricesInfo[current.address]
    sum += parseFloat(price) * parseFloat(current.balance)
  }
  return formatBigNumber(sum.toFixed(2))
}

export function lowercaseKeys(obj) {
  return Object.keys(obj).reduce((accumulator, key) => {
    accumulator[key.toLowerCase()] = obj[key]
    return accumulator
  }, {})
}

export function getShortDayString(timestamp) {
  const options = {
    day: 'numeric',
    month: 'short',
  }

  const date = new Date(timestamp * 1000)
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)

  return formattedDate
}

export function getShortWeekString(timestamp) {
  const startDate = new Date(timestamp * 1000)
  const endDate = new Date(timestamp * 1000)

  startDate.setDate(startDate.getDate() - startDate.getDay()) // Start of the week (Sunday)
  endDate.setDate(endDate.getDate() - endDate.getDay() + 6) // End of the week (Saturday)

  const options = {
    day: 'numeric',
    month: 'short',
  }

  const formattedStartDate = new Intl.DateTimeFormat('en-US', options).format(
    startDate,
  )
  const formattedEndDate = new Intl.DateTimeFormat('en-US', options).format(
    endDate,
  )

  return `${formattedStartDate}-${formattedEndDate}`
}

export function getShortMonthString(timestamp) {
  const date = new Date(timestamp * 1000)
  const options = {
    month: 'short',
  }

  const formattedMonth = new Intl.DateTimeFormat('en-US', options).format(date)

  return formattedMonth
}

export function getShortYearString(timestamp) {
  const date = new Date(timestamp * 1000)
  const options = {
    year: 'numeric',
  }

  const formattedYear = new Intl.DateTimeFormat('en-US', options).format(date)

  return formattedYear
}
export function getShortHourString(timestamp) {
  const date = new Date(timestamp * 1000)
  const hours = date.getHours()
  const minutes = date.getMinutes()

  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`

  return formattedTime
}

export function getTimestampMinusDays(days) {
  // Get the current date and time
  const currentDate = new Date()

  // Subtract the specified number of days
  currentDate.setDate(currentDate.getDate() - days)

  // Set the time to midnight (00:00:00)
  currentDate.setHours(0, 0, 0, 0)

  // Get the timestamp (milliseconds since epoch) for the resulting date
  const timestamp = currentDate.getTime()

  return Math.floor(timestamp / 1000)
}

export function isTimestampWithinCurrentHour(timestamp) {
  const now = new Date()
  const hourAgo = new Date(now)
  hourAgo.setHours(now.getHours() - 1)
  timestamp = timestamp * 1000
  return timestamp >= hourAgo.getTime() && timestamp <= now.getTime()
}

export function isTimestampWithinCurrentDay(timestamp) {
  timestamp = timestamp * 1000
  const now = new Date()
  const startOfDay = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  return timestamp >= startOfDay.getTime()
}

export function isTimestampWithinPreviousDay(timestamp) {
  timestamp = timestamp * 1000
  const now = new Date()
  const startOfDay = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)

  return (
    timestamp >= startOfDay.getTime() &&
    !isTimestampWithinCurrentDay(timestamp / 1000)
  )
}

export function isTimestampWithinLast7Days(timestamp) {
  timestamp = timestamp * 1000
  // Get the current timestamp in milliseconds
  const currentTimestamp = Date.now()

  // Calculate the timestamp for 7 days ago (7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  const sevenDaysAgoTimestamp = currentTimestamp - 7 * 24 * 60 * 60 * 1000

  // Compare the given timestamp with the timestamp for 7 days ago
  return timestamp >= sevenDaysAgoTimestamp && timestamp <= currentTimestamp
}

export function isTimestampWithinPrevious7Days(timestampInSeconds) {
  // Convert the given timestamp to milliseconds
  const timestampInMilliseconds = timestampInSeconds * 1000

  // Get the current timestamp in milliseconds
  const currentTimestamp = Date.now()

  // Calculate the timestamp for 7 days ago
  const sevenDaysAgoTimestamp = currentTimestamp - 7 * 24 * 60 * 60 * 1000

  // Calculate the timestamp for 14 days ago
  const fourteenDaysAgoTimestamp = currentTimestamp - 14 * 24 * 60 * 60 * 1000

  // Check if the timestamp is within the previous 7 days
  return (
    timestampInMilliseconds >= fourteenDaysAgoTimestamp &&
    timestampInMilliseconds < sevenDaysAgoTimestamp
  )
}

export function isTimestampWithinCurrent30Days(timestampInSeconds) {
  // Convert the given timestamp to milliseconds
  const timestampInMilliseconds = timestampInSeconds * 1000

  // Get the current timestamp in milliseconds
  const currentTimestamp = Date.now()

  // Calculate the timestamp for 30 days ago
  const thirtyDaysAgoTimestamp = currentTimestamp - 30 * 24 * 60 * 60 * 1000

  // Check if the timestamp is within the current 30 days
  return (
    timestampInMilliseconds >= thirtyDaysAgoTimestamp &&
    timestampInMilliseconds <= currentTimestamp
  )
}

export function isTimestampWithinPrevious30Days(timestampInSeconds) {
  // Convert the given timestamp to milliseconds
  const timestampInMilliseconds = timestampInSeconds * 1000

  // Get the current timestamp in milliseconds
  const currentTimestamp = Date.now()

  // Calculate the timestamp for 30 days ago
  const thirtyDaysAgoTimestamp = currentTimestamp - 30 * 24 * 60 * 60 * 1000

  // Calculate the timestamp for 60 days ago (previous 30 days)
  const sixtyDaysAgoTimestamp = currentTimestamp - 60 * 24 * 60 * 60 * 1000

  // Check if the timestamp is within the previous 30 days
  return (
    timestampInMilliseconds >= sixtyDaysAgoTimestamp &&
    timestampInMilliseconds < thirtyDaysAgoTimestamp
  )
}
export function isTimestampWithinCurrent90Days(timestampInSeconds) {
  // Convert the given timestamp to milliseconds
  const timestampInMilliseconds = timestampInSeconds * 1000

  // Get the current timestamp in milliseconds
  const currentTimestamp = Date.now()

  // Calculate the timestamp for 30 days ago
  const thirtyDaysAgoTimestamp = currentTimestamp - 90 * 24 * 60 * 60 * 1000

  // Check if the timestamp is within the current 30 days
  return (
    timestampInMilliseconds >= thirtyDaysAgoTimestamp &&
    timestampInMilliseconds <= currentTimestamp
  )
}

export function isTimestampWithinPrevious90Days(timestampInSeconds) {
  // Convert the given timestamp to milliseconds
  const timestampInMilliseconds = timestampInSeconds * 1000

  // Get the current timestamp in milliseconds
  const currentTimestamp = Date.now()

  // Calculate the timestamp for 30 days ago
  const thirtyDaysAgoTimestamp = currentTimestamp - 90 * 24 * 60 * 60 * 1000

  // Calculate the timestamp for 60 days ago (previous 30 days)
  const sixtyDaysAgoTimestamp = currentTimestamp - 90 * 2 * 24 * 60 * 60 * 1000

  // Check if the timestamp is within the previous 30 days
  return (
    timestampInMilliseconds >= sixtyDaysAgoTimestamp &&
    timestampInMilliseconds < thirtyDaysAgoTimestamp
  )
}

export function isTimestampWithinPreviousYear(timestampInSeconds) {
  // Convert the given timestamp to milliseconds
  const timestampInMilliseconds = timestampInSeconds * 1000

  // Get the current timestamp in milliseconds
  const currentTimestamp = Date.now()

  const thirtyDaysAgoTimestamp = currentTimestamp - 365 * 24 * 60 * 60 * 1000

  const sixtyDaysAgoTimestamp = currentTimestamp - 365 * 2 * 24 * 60 * 60 * 1000

  return (
    timestampInMilliseconds >= sixtyDaysAgoTimestamp &&
    timestampInMilliseconds < thirtyDaysAgoTimestamp
  )
}

export function isTimestampWithinLastYear(timestampInSeconds) {
  // Convert the given timestamp to milliseconds
  const timestampInMilliseconds = timestampInSeconds * 1000

  // Get the current timestamp in milliseconds
  const currentTimestamp = Date.now()

  // Calculate the timestamp for one year ago
  const oneYearAgoTimestamp = currentTimestamp - 365 * 24 * 60 * 60 * 1000

  // Check if the timestamp is within the last year
  return (
    timestampInMilliseconds >= oneYearAgoTimestamp &&
    timestampInMilliseconds <= currentTimestamp
  )
}

export function formatLpTimestamp(timestamp) {
  timestamp = timestamp * 1000
  const date = new Date(timestamp)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  const formattedDate = `${day}/${month}/${year}`
  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`

  return `${formattedDate} ${formattedTime}`
}
export function formatSimpleDate(date_str) {
  let date = new Date(date_str)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are 0-based, so we add 1
  const year = date.getFullYear().toString().slice(-2) // Get the last 2 digits of the year

  const formattedDate = `${day}/${month}/${year}`
  return formattedDate
}

export function formatTimestampForChart(timestamp) {
  // Create a JavaScript date object from the timestamp (assuming timestamp is in milliseconds)
  var date = new Date(timestamp * 1000)

  // Extract individual components
  var day = date.getDate()
  var month = date.getMonth() + 1 // Months are zero-indexed, so add 1
  var year = date.getFullYear()
  var hour = date.getHours()
  var minute = date.getMinutes()

  // Format the components
  var formattedDate =
    month +
    '/' +
    day +
    '/' +
    year +
    ' ' +
    (hour < 10 ? '0' : '') +
    hour +
    ':' +
    (minute < 10 ? '0' : '') +
    minute

  return formattedDate
}

export function countOccurrences(array, value) {
  return array.reduce((count, currentValue) => {
    if (currentValue === value) {
      count++
    }
    return count
  }, 0)
}

export function calculatePercentageDifference(oldValue, newValue) {
  if (oldValue === 0) {
    return newValue !== 0 ? 100 : 0
  }

  const difference = newValue - oldValue
  const percentageDifference = (difference / Math.abs(oldValue)) * 100

  return percentageDifference
}

export function median(numbers) {
  const sorted = Array.from(numbers).sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}

function lsGetKey(key) {
  return `${pkg.name}.${key}`
}

function lsAddVersion(value, version) {
  return {
    data: value,
    _version: version,
  }
}
export function lsSet(key, value, version = null) {
  const data = version != null ? lsAddVersion(value, version) : value

  return localStorage.setItem(lsGetKey(key), JSON.stringify(data))
}

export function lsGet(key, defaultValue, version = null) {
  const rawValue = localStorage.getItem(lsGetKey(key))

  if (rawValue != null) {
    try {
      const value = JSON.parse(rawValue)

      if (version != null) {
        return value._version === version ? value.data : defaultValue
      }
      return value
    } catch (e) {
      return defaultValue
    }
  }

  return defaultValue
}

export function excludeKeyFromObject(originalObject, keyToExclude) {
  return Object.keys(originalObject).reduce((result, key) => {
    if (key !== keyToExclude) {
      result[key] = originalObject[key]
    }
    return result
  }, {})
}
export function excludeKeysFromObject(originalObject, keysToExclude) {
  return Object.keys(originalObject).reduce((result, key) => {
    if (!keysToExclude.includes(key)) {
      result[key] = originalObject[key]
    }
    return result
  }, {})
}

export function generatePairCombinations(tokens) {
  const combinations = []
  for (let i = 0; i < tokens.length; i++) {
    for (let j = i + 1; j < tokens.length; j++) {
      combinations.push(tokens[i] + '/' + tokens[j])
    }
  }
  return combinations
}

export function sumFields(arrayOfItems, keysToSum) {
  if (arrayOfItems.length == 0) return {}
  const sums = {}
  for (const key of keysToSum) {
    if (Object.hasOwn(arrayOfItems[0], key)) {
      sums[key] =
        (sums[key] || 0) +
        arrayOfItems.reduce((sum, value) => sum + value[key], 0)
    }
  }

  return sums
}
export function formatSimpleTimestamp(timestamp) {
  // Create a new Date object from the timestamp (in milliseconds, so multiply by 1000)
  const date = new Date(timestamp * 1000)

  // Extract year, month, and day
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // Month is 0-based, so add 1
  const day = date.getDate()

  // Create the formatted date string
  const formattedDate = `${month}/${day}/${year}`
  return formattedDate
}

export function groupTimestampsByDayWithIndexes(timestamps, dates) {
  const groupedIndexes = {}

  for (let i = 0; i < timestamps.length; i++) {
    const date = new Date(timestamps[i])
    const dayKey = dates[i]

    if (
      !groupedIndexes[dayKey] ||
      timestamps[i] > timestamps[groupedIndexes[dayKey]]
    ) {
      groupedIndexes[dayKey] = i
    }
  }

  return Object.values(groupedIndexes)
}

export function groupTimestampsByWeekWithIndexes(timestamps, dates=null) {
  const groupedIndexes = {}

  for (let i = 0; i < timestamps.length; i++) {
    const date = new Date(timestamps[i])
    const startOfWeek = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - date.getDay(),
    )
    const weekKey = startOfWeek.toDateString()

    if (
      !groupedIndexes[weekKey] ||
      timestamps[i] > timestamps[groupedIndexes[weekKey]]
    ) {
      groupedIndexes[weekKey] = i
    }
  }

  return Object.values(groupedIndexes)
}

export function groupTimestampsByMonthWithIndexes(timestamps, dates=null) {
  const groupedIndexes = {}

  for (let i = 0; i < timestamps.length; i++) {
    const date = new Date(timestamps[i])
    const monthKey = new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
    ).toDateString()

    if (
      !groupedIndexes[monthKey] ||
      timestamps[i] > timestamps[groupedIndexes[monthKey]]
    ) {
      groupedIndexes[monthKey] = i
    }
  }

  return Object.values(groupedIndexes)
}

export function calculateAverage(array) {
  if (array.length == 0) {
    return 0
  }
  let sum = array.reduce((acc, current) => acc + current, 0)
  return sum / array.length
}

export function stringToColor(str) {
  if(!str){
    return "#FFFFFF"
  }
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const color = Math.floor(
    Math.abs(Math.sin(hash) * 16777215) % 16777215,
  ).toString(16)
  return '#' + Array(6 - color.length + 1).join('0') + color
}

export function sumArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    throw new Error('Arrays must have the same length to be summed.')
  }

  const result = []

  for (let i = 0; i < arr1.length; i++) {
    result.push(arr1[i] + arr2[i])
  }

  return result
}

export function groupBy(array, keyFn) {
  return array.reduce((result, currentValue) => {
    const key = keyFn(currentValue)

    if (!result[key]) {
      result[key] = []
    }

    result[key].push(currentValue)

    return result
  }, {})
}

export function GetWeeklyTextData(timestamp) {
  const date = new Date(timestamp)

  // Get the year and week number
  const year = date.getFullYear()
  const weekNumber = Math.floor((date - new Date(year, 0, 1)) / 604800000) + 1

  // Calculate the start and end dates of the week
  const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7)
  const endDate = new Date(
    year,
    0,
    1 + (weekNumber - 1) * 7 + 6,
    23,
    59,
    59,
    999,
  )

  // Format the output
  const weekInfo = `Week ${weekNumber} / ${year}`
  const dateRange = `${startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} - ${endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`

  return {
    title: weekInfo,
    range: dateRange,
    end: endDate.getTime() / 1000,
    start: startDate.getTime() / 1000,
  }
}
export function GetMonthlyTextData(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const startDate = new Date(year, date.getMonth(), 1)
  const endDate = new Date(year, date.getMonth() + 1, 1, 0, 0, 0, 0)
  const monthInfo = `${month} ${year}`
  const dateRange = `${startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} - ${endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`
  return {
    title: monthInfo,
    range: dateRange,
    end: endDate.getTime() / 1000,
    start: startDate.getTime() / 1000,
  }
}

export function GetQuarterlyTextData(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const quarter = Math.floor(date.getMonth() / 3) + 1
  const quarterInfo = `Q${quarter} ${year}`
  const quarterStartMonth = (quarter - 1) * 3
  const quarterEndMonth = quarterStartMonth + 2
  const startDate = new Date(year, quarterStartMonth, 1)
  const endDate = new Date(year, quarterEndMonth + 1, 1, 0, 0, 0, 0, 0)
  const dateRange = `${startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} - ${endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`
  return {
    title: quarterInfo,
    range: dateRange,
    end: endDate.getTime() / 1000,
    start: startDate.getTime() / 1000,
  }
}
export function GetYearlyTextData(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  return {
    title: year,
    range: '-',
    end: new Date(year, 11, 31, 23, 59, 59, 999).getTime() / 1000,
    start: new Date(year, 0).getTime() / 1000,
  }
}

function formatDate(date) {
  const day = date.getDate()
  const month = date.getMonth() + 1 // Months are 0-based
  const year = date.getFullYear()

  return day + '/' + month + '/' + year
}

export function getLast7Days() {
  const today = new Date()
  const last7Days = []

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today)
    currentDate.setDate(today.getDate() - i)
    currentDate.setHours(0, 0, 0, 0)
    const formattedDate = i === 0 ? 'Today' : formatDate(currentDate)

    const timestampStart = currentDate.getTime() / 1000 // Unix timestamp in milliseconds
    const timestampEnd = (currentDate.getTime() + 86400000 - 1) / 1000 // End of the day

    last7Days.push({
      timestampStart,
      timestampEnd,
      date: formattedDate,
    })
  }
  console.log('7 DAYS ', last7Days)
  return last7Days.reverse()
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function timestampToHours(timestamp) {
  const date = new Date(timestamp * 1000) // Convert to milliseconds
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = '00' // Since we want the "00:00" format
  return `${hours}:${minutes}`
}

export function getTodayHoursArray() {
  const now = new Date()
  const hoursArray = []
  for (let h = 0; h <= now.getHours(); h++) {
    const hour = String(h).padStart(2, '0')
    hoursArray.push(`${hour}:00`)
  }
  return hoursArray
}

export function timestampToWeekDayMonth(timestamp) {
  const date = new Date(timestamp * 1000) // Convert to milliseconds
  const options = { day: 'numeric', month: 'short' }
  return date.toLocaleDateString('en-US', options)
}

export function getLastWeekDatesArray() {
  const today = new Date()
  const last7Days = []

  for (let i = 6; i >= 0; i--) {
    const day = new Date(today)
    day.setDate(today.getDate() - i)
    last7Days.push(timestampToWeekDayMonth(day / 1000))
  }

  return last7Days
}

export function getLastMonthDatesArray() {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const weeksArray = []

  let currentDate = new Date(currentYear, currentMonth, 1)

  while (
    currentDate.getMonth() === currentMonth ||
    currentDate.getDate() === 1
  ) {
    const weekStart = new Date(currentDate)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const formattedStartDate = weekStart.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    })
    const formattedEndDate = weekEnd.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    })

    const formattedWeek = `${formattedStartDate} - ${formattedEndDate}`
    if (weekStart <= today) weeksArray.push(formattedWeek)

    currentDate.setDate(currentDate.getDate() + 7)
  }

  return weeksArray
}

export function timestampToWeekRange(ts) {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const weeksArray = []

  let currentDate = new Date(currentYear, currentMonth, 1)

  while (
    currentDate.getMonth() === currentMonth ||
    currentDate.getDate() === 1
  ) {
    const weekStart = new Date(currentDate)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const formattedStartDate = weekStart.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    })
    const formattedEndDate = weekEnd.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    })

    const formattedWeek = `${formattedStartDate} - ${formattedEndDate}`
    if (ts >= Math.floor(weekStart / 1000) && ts <= Math.floor(weekEnd / 1000))
      return formattedWeek
    if (weekStart <= today) weeksArray.push(formattedWeek)

    currentDate.setDate(currentDate.getDate() + 7)
  }

  return weeksArray
}

export function getMonthsArray() {
  const monthsArray = []

  let currentDate = new Date(
    new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 6,
  )
  currentDate.setDate(1)
  while (monthsArray.length < 7) {
    const formattedMonth = currentDate.toLocaleDateString('en-US', {
      month: 'long',
    })

    monthsArray.push(formattedMonth)
    if (currentDate.getMonth() == 11) {
      currentDate.setFullYear(currentDate.getFullYear() + 1)
      currentDate.setMonth(0)
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1)
    }
  }
  return monthsArray
}
export function timestampToMonth(ts) {
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    month: 'long',
  })
}

export function getAgoTimestamp(option) {
  const now = new Date()
  if (option === 'Today') {
    return Math.floor(now / 1000)
  } else if (option === 'Weekly') {
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(now.getDate() - 7)
    return Math.floor(sevenDaysAgo / 1000)
  } else if (option === 'Monthly') {
    const twentyEightDaysAgo = new Date(now)
    twentyEightDaysAgo.setDate(now.getDate() - 28)
    return Math.floor(twentyEightDaysAgo / 1000)
  } else {
    return null // Handle unsupported option
  }
}

export function getStartOfDayTimestamp() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.floor(today / 1000)
}
export function getStartOfPreviousDayTimestamp() {
  const today = new Date()
  today.setDate(today.getDate() - 1) // Subtract 1 day
  today.setHours(0, 0, 0, 0)

  return Math.floor(today / 1000)
}

export function getStartOfWeekTimestamp() {
  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 7)

  // Get the timestamp (in milliseconds)
  const timestamp = sevenDaysAgo.getTime()

  return timestamp / 1000
}

export function getStartOfPreviousWeekTimestamp() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysToSubtract = (dayOfWeek + 6) % 7 // Subtract the appropriate number of days to go back one week

  const startOfPreviousWeek = new Date(today)
  startOfPreviousWeek.setDate(today.getDate() - daysToSubtract)
  startOfPreviousWeek.setHours(0, 0, 0, 0)

  return Math.floor(startOfPreviousWeek / 1000)
}

export function getStartOfMonthTimestamp() {
  const today = new Date()
  today.setDate(1) // Set the day of the month to 1
  today.setHours(0, 0, 0, 0)

  return Math.floor(today / 1000)
}

const protocolStartTs = 1685556000000

export function getStartOfYearFirstMonthTimestamp() {
  let today = new Date()
  const currentYear = today.getFullYear()

  // Set the date to the first month (January) of the current year
  today.setFullYear(currentYear, 0, 1)
  today.setHours(0, 0, 0, 0)
  if (today < protocolStartTs) today = protocolStartTs
  return Math.floor(today / 1000)
}
export function getStartOfPreviousMonthTimestamp() {
  const today = new Date()
  today.setMonth(today.getMonth() - 1) // Subtract 1 month
  today.setDate(1) // Set the day of the month to 1
  today.setHours(0, 0, 0, 0)

  return Math.floor(today / 1000)
}

export function getStartOfHalfYearTimestamp() {
  const today = new Date()
  const halfYearAgo = new Date(today)
  halfYearAgo.setMonth(today.getMonth() - 6)
  halfYearAgo.setHours(0, 0, 0, 0)
  return Math.floor(halfYearAgo / 1000)
}

export function getStartOfYearTimestamp() {
  const today = new Date()
  const currentYear = today.getFullYear()

  const startOfYear = new Date(currentYear, 0, 1) // January is month 0
  startOfYear.setHours(0, 0, 0, 0)

  return Math.floor(startOfYear / 1000)
}

export function combineArrayObjects(inputArray) {
  const combinedObject = {}

  inputArray.forEach((currentObj) => {
    for (const key in currentObj) {
      if (combinedObject[key] === undefined) {
        combinedObject[key] = []
      }
      combinedObject[key] = combinedObject[key].concat(currentObj[key])
    }
  })

  return combinedObject
}

export function addDaysToDate(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}
export function removeDaysFromDate(date, days) {
  return new Date(date.getTime() - days * 24 * 60 * 60 * 1000)
}

export function timestampToSimpleDate(timestamp) {
  const date = new Date(timestamp)
  const options = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }

  const formattedDate = date.toLocaleDateString(undefined, options)
  return formattedDate
}

export function formatNotificationDate(timestamp) {
  const date = new Date(timestamp)

  // Get date components
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const year = String(date.getFullYear()).slice(-2) // Get last two digits of the year

  // Get time components
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  // Format the string
  const formattedString = `${day}/${month}/${year} ${hours}:${minutes}`

  return formattedString
}

export function removeDuplicates(arr, key) {
  let uniqueValues = {}
  return arr.filter((obj) => {
    const value = obj[key]
    if (!uniqueValues[value]) {
      uniqueValues[value] = true
      return true
    }
    return false
  })
}

export function trim_decimal_overflow(n, decimals=18) {
  n += ''

  if (n.indexOf('.') === -1) return n

  const arr = n.split('.')
  const fraction = arr[1].substr(0, decimals)
  return arr[0] + '.' + fraction
}
