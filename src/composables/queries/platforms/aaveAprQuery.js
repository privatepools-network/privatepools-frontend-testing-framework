export const AAVE_APR_QUERY = `
{
  reserves(first: 100) {
    decimals
    symbol
    variableBorrowRate   
  }
}`



