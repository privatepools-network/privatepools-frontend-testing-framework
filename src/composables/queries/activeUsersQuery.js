export const ACTIVE_USERS_QUERY = `
{
  joinExits(first:1000){
    user{
      id
    }
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
swaps(first:1000){
    timestamp
    userAddress{
      id
    }
  }
}`

export const POOL_ACTIVE_USERS_QUERY = (poolId) => `

{
  joinExits(first:1000, where:{pool:"${poolId}"}){
    user{
      id
    }
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
swaps(first:1000, where:{poolId:"${poolId}"}){
    timestamp
  
    userAddress{
      id
    }
  }
}
`
