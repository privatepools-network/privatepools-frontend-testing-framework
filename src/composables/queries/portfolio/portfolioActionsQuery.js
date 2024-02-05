export const PORTFOLIO_ACTIONS_QUERY = (user) =>
  `query {
 joinExits (first:1000, where:{user:"${user}"}){ 
  user{
    id
  }
  tx
  amounts
  pool{
    tokens{
      symbol
    }
  }
  valueUSD
  type
  timestamp
}
  swaps (first:1000,where:{userAddress:"${user}"}){
    userAddress{
      id
    }
    valueUSD
    tokenInSym
    tokenOutSym
    tokenAmountIn
    tokenAmountOut
    tx
    timestamp
  }
}`
