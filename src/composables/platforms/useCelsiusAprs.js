import axios from 'axios'

/**
 * @typedef {Object} Currency
 * @property {number} id - The ID of the currency.
 * @property {string} name - The name of the currency.
 * @property {string} short - The short symbol of the currency.
 * @property {string} image_url - The URL of the currency's image.
 */

/**
 * @typedef {Object} InterestRate
 * @property {string} coin - The coin symbol.
 * @property {string} rate - The interest rate.
 * @property {Currency} currency - The currency information.
 */

/**
 * @typedef {Object} InterestRatesData
 * @property {Array<InterestRate>} interestRates - An array of interest rate information.
 */

/**
 * Get rates info on Celsius platform.
 * @returns {InterestRatesData} array of celsius rates info.
 */
export async function GetCelsiusAprs() {
  try {
    const url = `https://wallet-api.staging.celsius.network/util/interest/rates`
    let response = await axios.get(url)
    return response.data
  } catch (e) {
    console.error(e)
    return null
  }
}
