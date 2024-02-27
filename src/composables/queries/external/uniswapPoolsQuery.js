export const UNISWAP_POOLS_QUERY = `{
  pools{
    id
    totalValueLockedUSD
    token0{
        symbol
    }
    token1{
        symbol
    }
  }
}`
