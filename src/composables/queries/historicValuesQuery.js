export const HISTORIC_FILTERED_VALUES_QUERY = (poolId, month_timestamp) =>
  `query { 
    pools (first: 1, skip: 0, where: {id: "${poolId}"}) { historicalValues{poolLiquidityUSD poolShareValue pricingAsset timestamp}   historicalUserBalances {
    	address
      balances(
      orderBy: timestamp
      orderDirection: desc
      first: 1
      where: { value_gt: 0 }
      ){
        value
      }
    } 
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
    }
    historicalBalances(orderBy:timestamp, orderDirection:desc, first:500){timestamp tokens{ token {symbol address} balance balanceUsd } } } }`
export const HISTORIC_VALUES_QUERY = `query { pools { id historicalValues{poolLiquidityUSD poolShareValue pricingAsset timestamp} } }`
