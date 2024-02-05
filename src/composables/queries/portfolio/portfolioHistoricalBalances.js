export const PORTFOLIO_HISTORICAL_BALANCES = (address) => `
{
  historicalUserBalances (where:{address:"${address}"}){
    poolId{
      id
    }
    address
    balances (orderBy:timestamp, orderDirection:desc){
      value
      timestamp
    }
  }
}
`
