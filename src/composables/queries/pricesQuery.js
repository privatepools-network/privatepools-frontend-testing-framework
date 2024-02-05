export const PRICES_QUERY = ` query {
        tokenPrices: tokenPriceGetCurrentPrices {
          price
          address
        }
      }`
