export const UNISWAP_TVL_SNAPSHOTS_QUERY = (poolId) => `{
  poolDayDatas(where:{pool:"${poolId}"}, orderBy:date, orderDirection:desc, first:1000){
   	tvlUSD
    date
  }
}`
export const UNISWAP_TVL_SNAPSHOTS_ALL_QUERY = `{
  poolDayDatas(first:1000,orderBy:date, orderDirection:desc){
   	tvlUSD
    date
    pool{
      id
    }
  }
}`
