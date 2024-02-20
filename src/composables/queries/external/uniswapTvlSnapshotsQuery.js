export const UNISWAP_TVL_SNAPSHOTS_QUERY = (poolId) => `{
  liquidityPoolDailySnapshots(where:{pool:"${poolId}"}, first:30, orderBy:timestamp, orderDirection:desc){
    totalValueLockedUSD
    timestamp
  }
}`
