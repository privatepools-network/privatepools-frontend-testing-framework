export const UNISWAP_TVL_QUERY = (poolId) => `{
  liquidityPools(where:{id:"${poolId}"}){
    totalValueLockedUSD
  }
}`
