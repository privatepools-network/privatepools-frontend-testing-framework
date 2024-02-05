import useGraphQLQuery from '../useQuery'
import { COMPOUND_APR_QUERY } from '../queries/platforms/compoundAprQuery'
/**
 * @typedef {Object} Market
 * @property {string} borrowRate - The borrow rate for the market.
 * @property {string} underlyingSymbol - The underlying symbol for the market.
 */
/**
 * @typedef {Array<Market>} APRs
 */

/**
 * Get APR's on Compound platform.
 * @returns {APRs} array of compound APR's.
 */
export async function GetCompoundAprs() {
  const compound_graph_url =
    'https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2'
  let data = await useGraphQLQuery(compound_graph_url, COMPOUND_APR_QUERY)
  if (data && data['markets']) {
    return data['markets']
  }
  return []
}

/**
 * Get stables APRs on compound platform.
 * @param {APRs} compound
 * @param {string[]} stables
 * @returns {Object} results for stables
 */
export function FormatCompound(compound, stables) {
  let usd_stables = compound.filter((item) =>
    stables.includes(item.underlyingSymbol),
  )
  let result = {}
  for (let i = 0; i < stables.length; i++) {
    let stable = stables[i]
    let stable_data = usd_stables.filter(
      (item) => item.underlyingSymbol == stable,
    )[0]
    let apr = 0
    if (stable_data) {
      apr = parseFloat(stable_data.borrowRate) * 100
    }
    result[stable] = apr
  }
  return result
}
