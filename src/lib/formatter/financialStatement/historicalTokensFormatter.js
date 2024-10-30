export function FormatHistoricalTokens(tokens) {
  let result = []
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    result.push({
      id: token.token.address,
      poolId: token.historicalBalanceId.poolId.id,
      timestamp: token.historicalBalanceId.timestamp,
      symbol: token.token.symbol,
      balance: token.balance,
      chain: 'Binance',
    })
  }

  return result
}

export function FormatCLHistoricalTokens(tokens) {
  let result = []
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    result.push({
      id: token.token.id,
      poolId: token.pool.id,
      timestamp: token.date,
      symbol: token.token.symbol,
      balance: token.totalValueLocked,
      chain: 'Binance',
    })
  }

  return result
}
