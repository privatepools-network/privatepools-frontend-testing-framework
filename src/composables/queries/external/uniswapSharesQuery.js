export const UNISWAP_SHARES_QUERY = (pool, user) => `
{
  positions (first:1, where:{and:[{pool:"${pool}"}, {owner:"${user}"}]}){
    depositedToken0
    depositedToken1
    pool{
      feeTier
    }
     token0{
      symbol
      id
      decimals
    }
    token1{
      symbol
      id
      decimals
    }
  }
}
`
