export const POOL_HISTORICAL_BALANCES_QUERY = (
  poolId,
) => `{poolHistoricalBalances (orderBy:timestamp, orderDirection:desc,first:500,where:{poolId:"${poolId}"}){
 	timestamp
  tokens {
    token{
      symbol
    }
    balanceUsd
    balance
  }
}
}`