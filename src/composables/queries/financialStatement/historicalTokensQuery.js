export const HISTORICAL_TOKENS_QUERY = (skip) => `
{
  historicalTokens (first:1000,skip:${skip}, orderBy:historicalBalanceId__timestamp, orderDirection:desc){
    historicalBalanceId{
      poolId{
        id
      }
      timestamp
    }
    token{
      address
      symbol
    }
    balanceUsd
    balance
  }
}
`

