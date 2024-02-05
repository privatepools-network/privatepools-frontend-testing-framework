import axios from 'axios'
/**
 * Represents an array of tokens with information related to Yearn Finance.
 * @typedef {Object} YearnToken
 * @property {number} inception - The inception timestamp.
 * @property {string} address - The address of the token.
 * @property {string} symbol - The symbol of the token.
 * @property {string} name - The name of the token.
 * @property {string} display_name - The display name of the token.
 * @property {string} icon - The URL of the token's icon.
 * @property {Object} token - Information about the underlying token.
 * @property {string} token.name - The name of the underlying token.
 * @property {string} token.symbol - The symbol of the underlying token.
 * @property {string} token.address - The address of the underlying token.
 * @property {number} token.decimals - The number of decimals for the underlying token.
 * @property {string} token.display_name - The display name of the underlying token.
 * @property {string} token.icon - The URL of the underlying token's icon.
 * @property {Object} tvl - Total Value Locked information.
 * @property {number} tvl.total_assets - Total assets locked.
 * @property {number} tvl.price - The price of the token.
 * @property {number|null} tvl.tvl - Total Value Locked.
 * @property {Object} apy - Annual Percentage Yield information.
 * @property {string} apy.type - The type of APY.
 * @property {number} apy.gross_apr - Gross Annual Percentage Rate.
 * @property {number} apy.net_apy - Net Annual Percentage Yield.
 * @property {Object} apy.fees - Fee information.
 * @property {number} apy.fees.performance - Performance fee.
 * @property {number} apy.fees.withdrawal - Withdrawal fee.
 * @property {number|null} apy.fees.management - Management fee.
 * @property {number|null} apy.fees.keep_crv - Keep CRV fee.
 * @property {number|null} apy.fees.cvx_keep_crv - CVX Keep CRV fee.
 * @property {number|null} apy.fees.keep_velo - Keep Velo fee.
 * @property {Object} apy.points - Points information.
 * @property {number} apy.points.week_ago - Points a week ago.
 * @property {number} apy.points.month_ago - Points a month ago.
 * @property {number} apy.points.inception - Points since inception.
 * @property {Object} apy.blocks - Blocks information.
 * @property {number} apy.blocks.now - Current block number.
 * @property {number} apy.blocks.week_ago - Block number a week ago.
 * @property {number} apy.blocks.month_ago - Block number a month ago.
 * @property {number} apy.blocks.inception - Block number since inception.
 * @property {number|null} apy.composite - Composite APY.
 * @property {string} apy.error_reason - Reason for APY error.
 * @property {number} apy.staking_rewards_apr - Staking Rewards APR.
 * @property {Array<Object>} strategies - Array of strategies.
 * @property {boolean} endorsed - Whether the token is endorsed.
 * @property {string} version - The version of the token.
 * @property {number} decimals - The number of decimals for the token.
 * @property {string} type - The type of the token.
 * @property {boolean} emergency_shutdown - Whether emergency shutdown is enabled.
 * @property {number} updated - Timestamp of the last update.
 * @property {null|Object} migration - Migration information.
 * @property {boolean} special - Whether the token is special.
 */

/**
 * @typedef {Array<YearnToken>} APRs
 */

/**
 * Get APR's info for yearn platform.
 * @returns {APRs} APR's info for yearn platform.
 */
export async function GetYearnAprs() {
  const url = `https://api.yexporter.io/v1/chains/1/vaults/all`
  let response = await axios.get(url)
  return response.data
}

/**
 * Get stables APRs on yearn platform.
 * @param {APRs} yearn
 * @param {string[]} stables
 * @returns {Object} results for stables
 */
export function FormatYearn(yearn, stables) {
  let usd_stables = yearn.filter(
    (item) =>
      stables.includes(item.token.symbol) &&
      item.type == 'v2' &&
      item.apy.type != 'error',
  )
  let result = {}
  for (let i = 0; i < stables.length; i++) {
    let stable = stables[i]
    let stable_data = usd_stables.filter(
      (item) => item.token.symbol == stable,
    )[0]
    let apr = 0
    if (stable_data) {
      apr = parseFloat(stable_data.apy.net_apy) * 100
    }
    result[stable] = apr
  }
  return result
}
