import {
  CalculateTokenOrderPrice,
  calculatePercentageChange,
} from '@/composables/math/chartMath/trackingInfoMath'
import wl from '@/assets/wl/tokenslist.json'
export const NATIVE_ASSET = {
  name: 'Binance',
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'BNB',
  decimals: 18,
  deeplinkId: 'binance-smart-chain',
  logoURI:
    'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  minTransactionBuffer: '0.1',
}
const MS_IN_WEEK = 604800000
const MS_IN_SEC = 1000

export function GetWeeklyTextData(timestamp) {
  const date = new Date(timestamp)

  // Get the year and week number
  const year = date.getFullYear()
  const weekNumber =
    Math.floor((date.getTime() - new Date(year, 0, 1).getTime()) / MS_IN_WEEK) +
    1

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
    end: endDate.getTime() / MS_IN_SEC,
    start: startDate.getTime() / MS_IN_SEC,
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
    end: endDate.getTime() / MS_IN_SEC,
    start: startDate.getTime() / MS_IN_SEC,
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
  const endDate = new Date(year, quarterEndMonth + 1, 1, 0, 0, 0, 0)
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
    end: endDate.getTime() / MS_IN_SEC,
    start: startDate.getTime() / MS_IN_SEC,
  }
}
export function GetYearlyTextData(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  return {
    title: year.toString(),
    range: '-',
    end: new Date(year, 11, 31, 23, 59, 59, 999).getTime() / MS_IN_SEC,
    start: new Date(year, 0).getTime() / MS_IN_SEC,
  }
}

function getTotalAssetsInfo(assetsInfo) {
  let sum = 0
  let prevSum = 0
  for (let k = 0; k < assetsInfo.length; k++) {
    sum += assetsInfo[k].value
    prevSum += assetsInfo[k].previousValue
  }
  return {
    sum,
    percent: calculatePercentageChange(prevSum, sum),
  }
}

function getAssetsInfo(
  symbols,
  historicalTokens,
  historicalPrices,
  start,
  end,
) {
  let assets_info = InitAssetsTemplate(symbols)
  let start_balances = getTokensHoldingForTimestamp(
    historicalTokens,
    historicalPrices,
    symbols,
    start,
  )
  let end_balances = getTokensHoldingForTimestamp(
    historicalTokens,
    historicalPrices,
    symbols,
    end,
  )
  for (let i = 0; i < assets_info.length; i++) {
    let asset = assets_info[i]
    asset.balance = end_balances[asset.symbol].balance
    asset.value = end_balances[asset.symbol].balanceUsd
    asset.previousValue = start_balances[asset.symbol].balanceUsd
    asset.percent = calculatePercentageChange(
      start_balances[asset.symbol].balanceUsd,
      end_balances[asset.symbol].balanceUsd,
    )
  }
  return assets_info
}

export function InitAssetsInfo(
  template,
  token_symbols,
  historicalPrices,
  filtered_historical_tokens,
  trades,
) {
  template.AssetsInfo = getAssetsInfo(
    token_symbols,
    filtered_historical_tokens,
    historicalPrices,
    template.start,
    template.end,
  )
  const all_tokens = Array.from(
    new Set(trades.map((item) => item.token.toLowerCase())),
  )
  const all_symbols = all_tokens.map((token) => ({
    symbol: wl[token],
    address: token,
  }))
  console.log('ALL SYMBOLS = ', all_symbols)
  template.AssetsProfitInfo = [
    ...all_symbols.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      valueETH: 0,
      valueBTC: 0,
      percent: 0,
    })),
  ]
  template.AssetsRevenueInfo = [
    ...all_symbols.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      valueETH: 0,
      valueBTC: 0,
      percent: 0,
    })),
  ]
  template.AssetsVolumeInfo = [
    ...all_symbols.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      valueETH: 0,
      valueBTC: 0,
      percent: 0,
    })),
  ]
  template.AssetsDepositInfo = [
    ...template.AssetsInfo.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      valueETH: 0,
      valueBTC: 0,
      percent: 0,
    })),
  ]
  template.AssetsWithdrawInfo = [
    ...template.AssetsInfo.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      valueETH: 0,
      valueBTC: 0,
      percent: 0,
    })),
  ]
  template.AssetsInitialLiquidityInfo = [
    ...template.AssetsInfo.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      valueETH: 0,
      valueBTC: 0,
      percent: 0,
    })),
  ]
  template.AssetsFinalLiquidityInfo = [
    ...template.AssetsInfo.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      valueETH: 0,
      valueBTC: 0,
      percent: 0,
    })),
  ]
  template.AssetsCapitalGainsInfo = [
    ...template.AssetsInfo.map((item) => ({
      ...item,
      value: 0,
      valueUsd: 0,
      valueETH: 0,
      valueBTC: 0,
      percent: 0,
    })),
  ]
  let nativeTokens = [NATIVE_ASSET.symbol]
  template.AssetsGasFeeInfo = nativeTokens.map((t) => ({
    value: 0,
    valueUsd: 0,
    valueETH: 0,
    valueBTC: 0,
    percent: 0,
    symbol: t,
  }))
  let total_assets_info = getTotalAssetsInfo(template.AssetsInfo)
  template.Assets = total_assets_info.sum.toString()
  template.AssetsPercent = total_assets_info.percent
}

export function InitAssetsTemplate(token_symbols) {
  return token_symbols.map((s) => ({
    symbol: s,
    value: 0,
    valueETH: 0,
    valueBTC: 0,
    percent: 0,
    previousValue: 0,
  }))
}

function getTokensHoldingForTimestamp(
  historicalTokens,
  historicalPrices,
  symbols,
  timestamp,
) {
  let found_pools = []
  let filtered_historical_tokens = historicalTokens
    .filter((t) => t.timestamp < timestamp)
    .sort((a, b) => b.timestamp - a.timestamp)

  let balances = {}
  symbols.forEach((t) => {
    balances[t] = {
      balance: 0,
      balanceUsd: 0,
      balanceETH: 0,
      balanceBTC: 0,
    }
  })

  let prices = getTokensPricesForTimestamp(symbols, historicalPrices, timestamp)
  for (let i = 0; i < filtered_historical_tokens.length; i++) {
    let token = filtered_historical_tokens[i]
    let token_id = `${token.symbol}-${token.poolId}`
    if (!found_pools.includes(token_id)) {
      found_pools.push(token_id)
      balances[token.symbol]['balanceUsd'] +=
        parseFloat(token.balance) * prices[token.symbol]
      balances[token.symbol]['balanceETH'] +=
        (parseFloat(token.balance) * prices[token.symbol]) / prices['ETH']
      balances[token.symbol]['balanceBTC'] +=
        (parseFloat(token.balance) * prices[token.symbol]) / prices['BTC']
      balances[token.symbol]['balance'] += parseFloat(token.balance)
    }
  }
  return balances
}

export function getTokensPricesForTimestamp(
  symbols,
  historicalPrices,
  timestamp,
) {
  let prices = {}
  for (let i = 0; i < symbols.length; i++) {
    prices[symbols[i]] = getPriceForTimestamp(
      symbols[i],
      historicalPrices,
      timestamp,
    )
  }
  return prices
}

export function getPriceForTimestamp(symbol, historicalPrices, timestamp) {
  if (!historicalPrices || historicalPrices.length == 0) return 0
  let symbol_prices = historicalPrices.filter((h) => h.symbol == symbol)[0]
  if (!symbol_prices || !symbol_prices.Daily) return 0
  let sorted = [...symbol_prices.Daily].sort((a, b) => b.time - a.time)
  let found = sorted.find((item) => item.time <= timestamp)
  if (!found) return 0
  return CalculateTokenOrderPrice(found)
}

export function InitPoolsInfo(
  template,
  pools,
  filtered_historical_tvl,
  historical_token_prices,
) {
  template.PoolsInfo = getPoolsInfo(
    pools,
    filtered_historical_tvl,
    historical_token_prices,
    template.start,
    template.end,
  )
  let total_pools_info = getTotalPoolsInfo(template.PoolsInfo)

  template.Pools = total_pools_info.sum
  template.PoolsPercent = total_pools_info.percent
}

function getPoolsInfo(
  pools,
  historical_tvl,
  historical_token_prices,
  start,
  end,
) {
  let result = []
  let tvl_start = getPoolsTvlFromTimestamp(
    pools,
    historical_tvl,
    historical_token_prices,
    start,
  )
  let tvl_end = getPoolsTvlFromTimestamp(
    pools,
    historical_tvl,
    historical_token_prices,
    end,
  )
  for (let k = 0; k < pools.length; k++) {
    result.push({
      id: tvl_start[pools[k]].id,
      name: tvl_start[pools[k]].name,
      value: tvl_end[pools[k]].value,
      previousValue: tvl_start[pools[k]].value,
      percent: calculatePercentageChange(
        tvl_start[pools[k]].value,
        tvl_end[pools[k]].value,
      ),
    })
  }
  return result
}

function getPoolsTvlFromTimestamp(
  pools,
  historical_tvl,
  historical_token_prices,
  timestamp,
) {
  let result = {}
  for (let i = 0; i < pools.length; i++) {
    let pool = pools[i]
    let poolHistoricalTvl = historical_tvl.filter((t) => t.pool.id == pool)
    if (poolHistoricalTvl.length > 0) {
      let { tvlUsd, tvlETH, tvlBTC } = getTvlForTimestamp(
        poolHistoricalTvl,
        historical_token_prices,
        timestamp,
      )
      result[pool] = {
        value: tvlUsd,
        value_ETH: tvlETH,
        value_BTC: tvlBTC,
        name: poolHistoricalTvl[0].pool.tokens.map((t) => t.symbol).join('/'),
        id: poolHistoricalTvl[0].pool.id,
      }
    }
  }
  return result
}

export function getTvlForTimestamp(
  historical_tvl,
  historical_token_prices,
  timestamp,
) {
  let found_pools = []
  let sum_tvl = 0
  let filtered_historical_tvl = historical_tvl
    .filter((t) => t.timestamp <= timestamp)
    .sort((a, b) => b.timestamp - a.timestamp)
  if (filtered_historical_tvl.length == 0) {
    return { tvlUsd: 0, tvlETH: 0, tvlBTC: 0, balances: [] }
  }
  const balances = []
  for (let i = 0; i < filtered_historical_tvl.length; i++) {
    let tvl = filtered_historical_tvl[i]
    if (!found_pools.includes(tvl.pool.id)) {
      found_pools.push(tvl.pool.id)
      balances.push(
        tvl.balances.map((t, i) => ({
          balance: t,
          symbol: tvl.pool.tokens[i].symbol,
        })),
      )
      sum_tvl += parseFloat(tvl.totalLiquidity)
    }
  }
  return {
    tvlUsd: sum_tvl,
    tvlETH:
      sum_tvl *
      (1 /
        getPriceForTimestamp(
          'ETH',
          historical_token_prices,
          new Date().getTime(),
        )),
    tvlBTC:
      sum_tvl *
      (1 /
        getPriceForTimestamp(
          'BTC',
          historical_token_prices,
          new Date().getTime(),
        )),
    balances,
  }
}

function getTotalPoolsInfo(poolsInfo) {
  let sum = 0
  let prevSum = 0
  for (let k = 0; k < poolsInfo.length; k++) {
    sum += poolsInfo[k].value
    prevSum += poolsInfo[k].previousValue
  }
  return {
    sum,
    percent: calculatePercentageChange(prevSum, sum),
  }
}

export function CalculateJoinExitPrice(
  timeline_data,
  joinExit,
  historicalPrices,
  enableTimelineDataSet = true,
) {
  let valueUsd = 0
  let valueETH = 0
  let valueBTC = 0
  if (joinExit.type == 'Trade') return { valueUsd, valueBTC, valueETH }
  let amounts = joinExit.amounts
  let tokens = joinExit.pool.tokens.map((t) => t.symbol)
  let ts = joinExit.timestamp
  let type = joinExit.type
  for (let i = 0; i < amounts.length; i++) {
    let token = tokens[i]
    let amount = parseFloat(amounts[i])
    let price = getPriceForTimestamp(token, historicalPrices, ts)
    let priceETH = 1 / getPriceForTimestamp('ETH', historicalPrices, ts)
    let priceBTC = 1 / getPriceForTimestamp('BTC', historicalPrices, ts)
    let usdTokenValue = amount * price
    let ETHTokenValue = usdTokenValue * priceETH
    let BTCTokenValue = usdTokenValue * priceBTC
    valueUsd += usdTokenValue
    valueETH += ETHTokenValue
    valueBTC += BTCTokenValue
    if (enableTimelineDataSet) {
      let key = type == 'Join' ? 'AssetsDepositInfo' : 'AssetsWithdrawInfo'
      let found = timeline_data[key].find((t) => t.symbol == token)
      if (found) {
        found.value += amount
        found.valueUsd += usdTokenValue
        found.valueETH += ETHTokenValue
        found.valueBTC += BTCTokenValue
      }
    }
  }
  return { valueUsd, valueETH, valueBTC }
}

export function getTvlBalancesForTimestamp(
  historical_tvl,
  historical_token_prices,
  timestamp,
) {
  let found_pools = []
  let filtered_historical_tvl = historical_tvl
    .filter((t) => t.timestamp <= timestamp)
    .sort((a, b) => b.timestamp - a.timestamp)
  if (filtered_historical_tvl.length == 0) {
    return []
  }
  let balances = []
  for (let i = 0; i < filtered_historical_tvl.length; i++) {
    let tvl = filtered_historical_tvl[i]
    if (!found_pools.includes(tvl.pool.id)) {
      for (let k = 0; k < tvl.pool.tokens.length; k++) {
        let symbol = tvl.pool.tokens[k].symbol
        let found = balances.find((t) => t.symbol == symbol)
        if (!found) {
          found = { symbol, value: 0, valueUsd: 0, valueETH: 0, valueBTC: 0 }
          balances.push(found)
        }
        found.value += parseFloat(tvl.balances[k].toString())
        found.valueUsd += parseFloat(tvl.balancesUsd[k].toString())
        found.valueETH +=
          tvl.balancesUsd[k] *
          (1 /
            getPriceForTimestamp('ETH', historical_token_prices, tvl.timestamp))
        found.valueBTC +=
          tvl.balancesUsd[k] *
          (1 /
            getPriceForTimestamp('BTC', historical_token_prices, tvl.timestamp))
      }
      found_pools.push(tvl.pool.id)
    }
  }
  return balances
}

export function getActiveUsersForPeriod(active_users, start, end) {
  let filtered = active_users
    .filter(
      (user_info) => user_info.timestamp > start && user_info.timestamp < end,
    )
    .map((item) => item.user)
  return Array.from(new Set(filtered)).length
}

export function RemoveZeroValueAssets(result, filtered_swaps) {
  if (result.Yearly.length == 0) {
    return
  }
  let allTokens = result.Yearly[0].AssetsProfitInfo.map((t) => t.symbol)
  let zeroTokens = [...allTokens]

  let existingNativeTokens = [{ ...NATIVE_ASSET }]
  for (let i = 0; i < result.Yearly.length; i++) {
    let item = result.Yearly[i]
    for (let k = 0; k < allTokens.length; k++) {
      let symbol = allTokens[k]
      if (
        item.AssetsProfitInfo.find((t) => t.symbol == symbol).value > 0.0001
      ) {
        zeroTokens = zeroTokens.filter((t) => t != symbol)
      }
    }
  }
  for (const [, value] of Object.entries(result)) {
    for (let i = 0; i < value.length; i++) {
      value[i].AssetsGasFeeInfo = value[i].AssetsGasFeeInfo.filter((item) =>
        existingNativeTokens.includes(item.symbol),
      )
      value[i].AssetsProfitInfo = value[i].AssetsProfitInfo.filter(
        (item) => !zeroTokens.includes(item.symbol),
      )
      value[i].AssetsVolumeInfo = value[i].AssetsVolumeInfo.filter(
        (item) => !zeroTokens.includes(item.symbol),
      )
      value[i].AssetsRevenueInfo = value[i].AssetsRevenueInfo.filter(
        (item) => !zeroTokens.includes(item.symbol),
      )
    }
  }
}

export function RemoveZeroValuePools(result) {
  if (result.Yearly.length == 0) {
    return
  }
  let allPools = result.Yearly[0].PoolsInfo.map((t) => t.id)
  let zeroPools = [...allPools]
  for (let i = 0; i < result.Yearly.length; i++) {
    let item = result.Yearly[i]
    for (let k = 0; k < allPools.length; k++) {
      let id = allPools[k]
      if (item.PoolsInfo.find((t) => t.id == id).value > 0.0001) {
        zeroPools = zeroPools.filter((t) => t != id)
      }
    }
  }
  for (const [, value] of Object.entries(result)) {
    for (let i = 0; i < value.length; i++) {
      value[i].PoolsInfo = value[i].PoolsInfo.filter(
        (item) => !zeroPools.includes(item.id),
      )
    }
  }
}

export function RemoveZeroValueAssetPools(result) {
  if (result.Yearly.length == 0) {
    return
  }
  let allAssets = result.Yearly[0].AssetsInfo.map((t) => t.symbol)
  let zeroAssets = [...allAssets]
  for (let i = 0; i < result.Yearly.length; i++) {
    let item = result.Yearly[i]
    for (let k = 0; k < allAssets.length; k++) {
      let symbol = allAssets[k]
      if (item.AssetsInfo.find((t) => t.symbol == symbol).value > 0.0001) {
        zeroAssets = zeroAssets.filter((t) => t != symbol)
      }
    }
  }
  for (const [, value] of Object.entries(result)) {
    for (let i = 0; i < value.length; i++) {
      value[i].AssetsInfo = value[i].AssetsInfo.filter(
        (item) => !zeroAssets.includes(item.symbol),
      )
      value[i].AssetsProfitLossInfo = value[i].AssetsProfitLossInfo.filter(
        (item) => !zeroAssets.includes(item.symbol),
      )
      value[i].AssetsDepositInfo = value[i].AssetsDepositInfo.filter(
        (item) => !zeroAssets.includes(item.symbol),
      )
      value[i].AssetsWithdrawInfo = value[i].AssetsWithdrawInfo.filter(
        (item) => !zeroAssets.includes(item.symbol),
      )
    }
  }
}
