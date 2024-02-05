import { useQuery } from '@tanstack/vue-query'
import { networkId } from '../../useNetwork'
import { getTokenEntity } from '@/lib/helpers/util'
import { InitializeMetamask } from '@/lib/utils/metamask'
import useBalance from '@/composables/useBalance'
import { useTokenPrices } from '@/composables/useTokenPrice'
import { GetSwapTokenPrices } from '@/composables/admin/swap/useSwapTokenPrices'
import { GetTokens } from '@/composables/tokens/useTokenSymbols'

/**
 * Replace W char in token symbol (W stands for wrapped usually)
 * @function replaceFirstCharIfW
 * @param {string} inputStr - input token symbol
 * @param {string} newChar - to which character replace 'W' letter
 * @returns {string} - token symbol with replaced first W letter
 */
export function replaceFirstCharIfW(inputStr, newChar) {
  if (inputStr.charAt(0) === 'W') {
    return newChar + inputStr.slice(1)
  } else {
    if (inputStr == 'BTCB') return 'BTC'
    return inputStr
  }
}

/**
 * Get tokens to compose a new pool
 * @function GetPossibleComposeTokens
 * @param {boolean} enablePrices - enable prices parsing or not
 * @returns {Promise<import('@/composables/tokens/useTokenSymbols').Token[]>} - array of possible tokens for pool composing
 */
export async function GetPossibleComposeTokens(enablePrices = false) {
  if (!networkId.value) return {}
  let tokens = await GetTokens()
  const mmProvider = await InitializeMetamask()
  if (!mmProvider) return []
  let account = await mmProvider.getSigner().getAddress()
  let balancesPromises = tokens.map(async (t) => {
    return {
      token: t.address,
      balance: await useBalance(t.address, mmProvider, account),
    }
  })
  let balancesMapping = await Promise.all(balancesPromises)
  if (enablePrices) {
    var prices = await GetSwapTokenPrices()
    var cryptocompare_prices = await useTokenPrices(
      tokens.map((t) => replaceFirstCharIfW(t.symbol, '')),
      'USD',
    )
  }
  tokens.forEach(async (t) => {
    let icon = getTokenEntity(t.symbol, 'short').icon
    if (enablePrices) {
      let found = prices.find((p) => p.address == t.address)
      let price = found ? found.price : null
      if (!price) {
        price = cryptocompare_prices[replaceFirstCharIfW(t.symbol, '')].USD
      }
      t.price = price
      t.value = 0
    }
    t.img = icon
    let found_balance = balancesMapping.find((bm) => bm['token'] == t.address)
    t.balance = parseFloat(found_balance.balance)
    t.userBalance = found_balance.balance
  })
  return tokens
}

/**
 * Query to get possible compose tokens
 * @function usePossibleComposeTokens
 * @param {any} options - additional options for query
 * @returns {any} query for fetching possible tokens to compose a new pool
 */
export function usePossibleComposeTokens(options = {}) {
  const queryFn = async () => {
    return await GetPossibleComposeTokens()
  }
  return useQuery(['possibleComposeTokens', networkId], queryFn, {
    ...options,
    onError: (error) => {
      console.error('Pool query error:', error)
    },
    onSuccess: () => {},
  })
}
