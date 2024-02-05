import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { NETWORK_URL } from './mappings'

export const USER = process.env.VUE_APP_BOT_USER
export const PASSWORD = process.env.VUE_APP_BOT_PASSWORD
/**
 * @typedef {import('@/composables/useNetwork').Chain} Chain
 * @typedef {import('vue').Ref} Ref
 */

/**
 * @typedef {Object} BotConfig
 * @property {boolean} serviceExists - Indicates whether the service exists.
 * @property {number} deviation - The deviation value.
 * @property {string[]} tokenAddresses - An array of token addresses.
 * @property {string} strategy - The strategy to be executed.
 * @property {string} chain - The blockchain chain.
 */

/**
 * Get arbitrage bot running status
 * @function GetBotStatus
 * @param {Ref<Chain>} chain - name of the network on which you want to check the status
 * @returns {Promise<null|BotConfig>} - is bot running or not
 */
export async function GetBotStatus(chain) {
  let url
  if (chain.value.name == 'Arbitrum') {
    url = `${NETWORK_URL[chain.value.name]}status-pm2`
  }
  if (chain.value.name == 'Polygon') {
    url = `${NETWORK_URL[chain.value.name]}status-pm2`
  }
  if (chain.value.name == 'Binance') {
    url = `${NETWORK_URL[chain.value.name]}status-pm2`
  }
  console.log('Url:', url)
  try {
    let response = await axios.get(url, {
      auth: { username: USER, password: PASSWORD },
    })
    let data = response.data
    if (!data['serviceExists']) return null
    return data
  } catch (e) {
    return null
  }
}

const BOT_STATUS_REPEAT_DELAY = 5000

/**
 * Repeatedly query arbitrage bot running status.
 * @param {Chain} network - name of the network on which you want to check the status
 * @param {*} options - additional options for query
 * @returns {*} query for checking bot status
 */
export function useBotStatus(network, options = {}) {
  const queryFn = async () => {
    console.log('STATUS CHECK')
    return await GetBotStatus(network)
  }
  return useQuery(['botStatus', network], queryFn, {
    ...options,
    refetchInterval: BOT_STATUS_REPEAT_DELAY,
    onError: (error) => {
      console.error('Dex query error:', error)
    },
    onSuccess: () => {},
  })
}
