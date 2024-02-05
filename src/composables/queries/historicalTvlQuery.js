export const HISTORICAL_TVL_QUERY = `{
poolSnapshots (orderBy:timestamp, orderDirection:desc, first:1000){
  totalLiquidity
  timestamp
  pool{
    id
    tokens{
      symbol
    }
  }
}
}`
export const HISTORICAL_POOL_TVL_QUERY = (poolId) => `{
poolSnapshots (orderBy:timestamp, orderDirection:desc, first:1000, where:{pool:"${poolId}"}){
  totalLiquidity
  timestamp
  pool{
    id
    tokens{
      symbol
    }
}
}
}`
export const HISTORICAL_POOL_TVL_BACKEND_QUERY = (poolId) => `{
poolSnapshots(poolId:"${poolId}"){
  totalLiquidity
  timestamp
  poolId
}
}`
