export const UNISWAP_TVL_SNAPSHOTS_QUERY = (poolId) => `{
  liquidityPoolDailySnapshots(where:{pool:"${poolId}"}, first:30, orderBy:timestamp, orderDirection:desc){
    totalValueLockedUSD
    timestamp
  }
}`
export const UNISWAP_TVL_SNAPSHOTS_ALL_QUERY = `{
  liquidityPoolDailySnapshots(first:1000, orderBy:timestamp, orderDirection:desc){
    totalValueLockedUSD
    timestamp
  }
}`
