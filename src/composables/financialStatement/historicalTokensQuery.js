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

export const FILTERED_HISTORICAL_TOKENS_QUERY = (filter, skip) => {
  let str = filter
    .map((item) => `{historicalBalanceId_contains:${item}},`)
    .join('')
  str = str.slice(0, -1)
  return `
 {
   historicalTokens (first:1000,skip:${skip}, orderBy:historicalBalanceId__timestamp, orderDirection:desc, where:{or:[${str}]})){
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
}
