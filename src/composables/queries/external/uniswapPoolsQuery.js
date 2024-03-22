export const UNISWAP_POOLS_QUERY = `{
  pools{
    id
    createdAtTimestamp
    totalValueLockedUSD
    totalValueLockedToken0
    totalValueLockedToken1
    token0{
        symbol
        id
    }
    token1{
        symbol
        id
    }
    feeTier
  }
}`
export const UNISWAP_FILTERED_POOLS_QUERY = (ids) => `{
  pools(where:{id_in:[${ids.map((item) => `"${item}"`).join(',')}]}){
    id
    createdAtTimestamp
    totalValueLockedUSD
    token0{
        symbol
        id
    }
    token1{
        symbol
        id
    }
    feeTier
  }
}`
