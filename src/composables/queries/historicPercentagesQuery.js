export const HISTORIC_PERCENTAGES_QUERY = (poolId, month_timestamp) =>
  `query { pools (skip: 0, where: {id: "${poolId}"}) {  
      historicalTotalShares(where:{timestamp_gt:${month_timestamp}}, orderBy:timestamp, orderDirection:desc){
  	totalShares
    timestamp
  }
    historicalUserBalances {
      address
      balances(orderBy:timestamp, orderDirection:desc, where:{and:[{timestamp_gt:${month_timestamp}}, {value_gt:0}]}) {
        value
        timestamp
      }
    }} }`
