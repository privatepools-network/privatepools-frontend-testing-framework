/**
 * @typedef {Object} FormattedHistoricalToken
 * @property {string} id
 * @property {string} poolId
 * @property {number} timestamp
 * @property {string} symbol
 * @property {string} balanceUsd
 * @property {string} balance
 * @property {string} chain
 */
/**
 * Format historical token balances.
 * @function FormatHistoricalTokens
 * @param {import("@/composables/balances/useHistoricalTokens").HistoricalToken[]} tokens
 * @returns {FormattedHistoricalToken[]} formatted historical token balances
 */
export function FormatHistoricalTokens(tokens) {
  let result = []
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    result.push({
      id: token.token.address,
      poolId: token.historicalBalanceId.poolId.id,
      timestamp: token.historicalBalanceId.timestamp,
      symbol: token.token.symbol,
      balanceUsd: token.balanceUsd,
      balance: token.balance,
      chain: token.chain,
    })
  }

  return result
}
