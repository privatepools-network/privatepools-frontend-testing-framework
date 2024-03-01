export const UNISWAP_POOLS_QUERY = `{
  pools{
    id
    createdAtTimestamp
    totalValueLockedUSD
    token0{
        symbol
    }
    token1{
        symbol
    }
  }
}`
export const UNISWAP_FILTERED_POOLS_QUERY = (ids) => `{
  pools(where:{id_in:[${ids.map((item) => `"${item}"`).join(',')}]}){
    id
    createdAtTimestamp
    totalValueLockedUSD
    token0{
        symbol
    }
    token1{
        symbol
    }
  }
}`
