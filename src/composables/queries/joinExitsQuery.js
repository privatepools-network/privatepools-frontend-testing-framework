export const JOIN_EXITS_QUERY = (poolId) =>
  `query { joinExits (first: 10, orderBy: "timestamp", orderDirection: "desc", skip: 0, where: {pool: "${poolId}"}) { amounts timestamp tx type valueUSD  pool{
      tokens{
        symbol
      }
    } } }`
