import axios from 'axios'
import { NETWORK_URL } from './mappings'
import { USER, PASSWORD } from './useBotStatus'

/**
 * Run arbitrage bot with parameters.
 * @function RunBot
 * @param {string} chainName - name of the chain on which the arbitrage will take place
 * @param {string[]} tokenAddresses - token addresses to be used for arbitrage
 * @param {number} deviation - devation percent from 0-10%
 * @param {string} strategy - which strategy will be used (for example: runArbitrageOne1inch)
 * @returns {Promise<void>}
 */
export async function RunBot(chainName, tokenAddresses, deviation, strategy) {
  try {
    let response = await axios.post(
      `${NETWORK_URL[chainName]}start-pm2`,
      {
        chainName: chainName.toLowerCase(),
        tokenAddresses,
        deviation,
        strategy,
      },
      {
        auth: {
          username: USER,
          password: PASSWORD,
        },
      },
    )
    console.log(response)
  } catch (e) {
    console.error(e)
  }
}

/**
 * Stop currently running arbitrage bot.
 * @function StopBot
 * @param {string} chainName - name of the chain on which the arbitrage bot is running.
 * @returns {Promise<void>}
 */
export async function StopBot(chainName) {
  try {
    let response = await axios.post(`${NETWORK_URL[chainName]}stop-pm2`, {}, {
      auth: {
        username: USER,
        password: PASSWORD,
      },
    })
    console.log(response)
  } catch (e) {
    console.error(e)
  }
}
