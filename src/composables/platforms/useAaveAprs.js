import useGraphQLQuery from '../useQuery'
import { AAVE_APR_QUERY } from '../queries/platforms/aaveAprQuery'
import { ethers } from 'ethers'

/**
 * @typedef {Object} Reserve
 * @property {number} decimals - The number of decimals for the reserve.
 * @property {string} symbol - The symbol of the reserve.
 * @property {string} variableBorrowRate - The variable borrow rate for the reserve.
 *
 * @typedef {Array<Reserve>} APRs
 */

/**
 * Get APRs for AAVE protocol.
 * @function GetAaveAprs
 * @returns {APRs} array of AAVE reserves.
 */
export async function GetAaveAprs() {
  const aave_graph_url =
    'https://api.thegraph.com/subgraphs/name/aave/protocol-v3'
  let data = await useGraphQLQuery(aave_graph_url, AAVE_APR_QUERY)
  if (data && data['reserves']) {
    return data['reserves']
  }
  return []
}

/**
 * Get APRs info for stablecoins on aave platform.
 * @param {APRs} aave_info
 * @param {string[]} stables
 * @returns {object} APR results for stablecoins
 */
export function FormatAave(aave_info, stables) {
  let usd_stables = aave_info.filter((item) => stables.includes(item.symbol))
  let result = {}
  for (let i = 0; i < stables.length; i++) {
    let stable = stables[i]
    let stable_data = usd_stables.filter((item) => item.symbol == stable)[0]
    let apr = 0
    if (stable_data) {
      apr = parseFloat(
        ethers.utils.formatUnits(stable_data['variableBorrowRate'], 25),
      )
    }
    result[stable] = apr
  }
  return result
}
