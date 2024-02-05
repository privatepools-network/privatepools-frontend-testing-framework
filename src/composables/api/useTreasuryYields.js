import axios from 'axios'

/**
 * @typedef {Object} Treasury
 * @property {string} record_calendar_year - The calendar year of the treasury record.
 * @property {string} record_calendar_month - The calendar month of the treasury record.
 * @property {string} record_date - The date of the treasury record.
 * @property {string} avg_interest_rate_amt - The average interest rate amount in the treasury.
 */

const START_DATE = '2023-06-01'
const MAX_PAGE_SIZE = 100
const FILTER_FIELDS =
  'record_calendar_year,record_calendar_month,record_date,avg_interest_rate_amt'
var CACHED_TREASURY_YIELDS = []

/**
 * Get US Treasury Yields that have already been parsed.
 * @function GetCachedTreasuryYields
 * @returns {Treasury[]} array of treasuries.
 **/
export function GetCachedTreasuryYields() {
  return CACHED_TREASURY_YIELDS
}

/**
 * Parse US Treasuries.
 * @function InitTreasuryYields
 * @returns {Promise<Treasury[]>} array of treasuries.
 **/
export async function InitTreasuryYields() {
  CACHED_TREASURY_YIELDS = []
  const url = `https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates?fields=${FILTER_FIELDS}&filter=record_date:gt:${START_DATE}&page[size]=${MAX_PAGE_SIZE}`
  let response = await axios.get(url)
  let result = response.data.data
  let total_pages = response.data['meta']['total-pages']
  let current_page = 2
  while (current_page <= total_pages) {
    response = await axios.get(`${url}&page[number]=${current_page}`)
    result.push(...response.data.data)
    current_page++
  }
  CACHED_TREASURY_YIELDS = result
  return CACHED_TREASURY_YIELDS
}
