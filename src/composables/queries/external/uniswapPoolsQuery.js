export const UNISWAP_POOLS_QUERY = `{
  pools{
    totalValueLockedUSD
    token0{
        symbol
    }
    token1{
        symbol
    }
  }
}`
