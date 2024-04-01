export const UNISWAP_HISTORICAL_TOKENS_QUERY = (pool) => `{
  poolTokenHourDatas (where:{pool:"${pool}"}){
    totalValueLocked
    date
    token{
      symbol
      id
    }
  }
}`
