import { TIME_TYPES } from '@/composables/admin/mappings'

export function FormatPoolPercentageData(historicalData, historicalBalances) {
  let output = {
    poolPercentageTimestamps: {},
    poolPercentageData: {},
  }
  let historicalTotalShares = aggregateData(
    historicalData['historicalTotalShares'],
  )
  let poolPercentageData = []
  let poolPercentageTimestamps = []
  let allUsersData = historicalData['historicalUserBalances']
  let results = []
  for (let i = 0; i < historicalTotalShares.length; i++) {
    let total_share_info = historicalTotalShares[i]
    poolPercentageTimestamps.push(historicalTotalShares[i].timestamp)
    results = []
    for (let k = 0; k < historicalBalances.length; k++) {
      let user = historicalBalances[k]
      let balance = GetBalance(user, allUsersData, total_share_info.timestamp)
      let user_info = {
        name: user.address,
        data: (balance / (total_share_info.totalShares / 100)).toFixed(4),
        timestamp: total_share_info.timestamp,
      }
      results.push(user_info)
    }
    let sorted = results.sort((a, b) => b.data - a.data)
    let data = [
      { name: 'Top 1', group: 'group0', data: 0 },
      { name: 'Top 2', group: 'group0', data: 0 },
      { name: 'Top 3', group: 'group0', data: 0 },
      { name: 'Top 4', group: 'group0', data: 0 },
      { name: 'Top 5', group: 'group0', data: 0 },
      { name: 'Others', group: 'group0', data: 0 },
    ]
    for (let j = 0; j < sorted.length; j++) {
      if (j < 5) {
        data[j].data = sorted[j].data
      } else {
        data[5].data = sorted[j].data
      }
    }
    poolPercentageData.push({
      timestamp: historicalTotalShares[i].timestamp,
      data,
    })
  }

  for (let i = 0; i < TIME_TYPES.length; i++) {
    let timestamps = Array.from(
      new Set(poolPercentageTimestamps.map((t) => TIME_TYPES[i].method(t)))
    )
    output['poolPercentageTimestamps'][TIME_TYPES[i].name] = timestamps
    output['poolPercentageData'][TIME_TYPES[i].name] = mergeAndJoinArrays(
      timestamps.map((t) => {
        let filtered_dates = poolPercentageData.filter(
          (f) => TIME_TYPES[i].method(f.timestamp) == t,
        )
        if (filtered_dates.length == 0) return null
        let sorted = filtered_dates.sort((a, b) => b.timestamp - a.timestamp)
        let last_info = sorted[0]
        return last_info.data
      }),
    )
  }

  return output
}

function mergeAndJoinArrays(arrays) {
  const merged = {}

  for (const arr of arrays) {
    for (const item of arr) {
      if (!merged[item.name]) {
        merged[item.name] = { name: item.name, data: [] }
      }
      merged[item.name].data.push(item.data)
    }
  }

  const result = Object.values(merged)

  return result
}

function GetBalance(user, historicalBalances, current_timestamp) {
  let user_history = historicalBalances.find((hb) => hb.address == user.address)

  let filtered = user_history.balances.filter(
    (b) => b.timestamp <= current_timestamp,
  )
  if (filtered.length == 0) {
    return user.balances[0].value
  }
  return filtered[0].value
}

function aggregateData(data) {
  const aggregatedData = []
  const dateToValueMap = {}

  for (const entry of data) {
    const date = new Date(entry.timestamp * 1000).toDateString()
    const currentMaxTimestamp = dateToValueMap[date]
      ? dateToValueMap[date].timestamp
      : 0

    if (entry.timestamp > currentMaxTimestamp) {
      dateToValueMap[date] = entry
    }
  }

  for (const date in dateToValueMap) {
    aggregatedData.push(dateToValueMap[date])
  }

  return aggregatedData
}
