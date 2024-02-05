import axios from 'axios'

/**
 * @typedef {Object} MetaData
 * @property {string} symbol - The symbol associated with the meta data.
 * @property {string} address - The address associated with the meta data.
 * @property {number} chainId - The chain ID associated with the meta data.
 */

/**
 * @typedef {Object} APRData
 * @property {number} timeUnix - The Unix timestamp associated with the APR data.
 * @property {number} apr - The APR (Annual Percentage Rate) value.
 */

/**
 * @typedef {Object} APRResponse
 * @property {APRData} data - The data object containing APR information.
 * @property {MetaData} meta - The meta object containing meta information.
 */

/**
 * Get APR for stEth on Lido platform.
 * @returns {APRResponse} APR for stEth
 */
export async function GetLidoApr() {
  const url = `https://eth-api.lido.fi/v1/protocol/steth/apr/last`
  let response = await axios.get(url)
  return response.data
}
