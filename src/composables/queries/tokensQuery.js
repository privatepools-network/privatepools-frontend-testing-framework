export const TOKENS_QUERY = `{
  tokens{
  id
  symbol
  address
  totalBalanceNotional
  totalBalanceUSD
  name
  decimals
  }
}`

export const SINGLE_TOKEN_QUERY = (token) => `{
  tokens (where:{address:"${token}"}){
    symbol
    address
    totalBalanceUSD
  }
}`
