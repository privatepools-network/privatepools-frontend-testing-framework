export const COMPOUND_APR_QUERY = `{
  markets(first: 1000) {
    borrowRate
		underlyingSymbol
  }
}`
