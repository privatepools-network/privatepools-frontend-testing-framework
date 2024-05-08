export const USER_POSITIONS_QUERY = (user) => `
{
  positions(where:{owner:"${user.toLowerCase()}"}){
    owner
    depositedToken0
    depositedToken1
    token0{
      id
      symbol
    }
    token1{
      id
      symbol
    }
    pool{
      id
    }
  }
}
`
