export const TOKEN_PAIRS_QUERY = `{
  tokenPairs{
    id
    balanceToken0
    balanceToken1
  }
  tokens{
  id
  symbol
  totalBalanceUSD
  totalBalanceNotional
  }
  tokenSnapshots(orderBy:timestamp, orderDirection:desc, first:300){
    totalBalanceUSD
    timestamp
    id
  }

}`
