export const PORTFOLIO_POOLS_QUERY = (user) => `
{
  user(id:"${user}"){
    id 
    sharesOwned (where:{percentage_gt:0}){
      percentage
      poolId{
        id
        totalLiquidity
        tokens{
          address
          symbol
        }
      }
    }
  }
}
`
