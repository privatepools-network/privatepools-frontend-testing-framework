import { InitializeMetamask } from '@/lib/utils/metamask'
import useBalance from '../useBalance'
import { getPrices } from '../data/pricesData'
export async function usePoolActionBalances(tokens, tokensInfo, network) {
  let account = ''
  let balances = {}
  let lastTokenPrices = {}
  let lineNumbers = []
  const mmProvider = await InitializeMetamask()
  if (!mmProvider) return
  account = await mmProvider.getSigner().getAddress()
  let balancesPromises = tokens.map(async (t) => {
    return {
      token: t,
      balance: await useBalance(t, mmProvider, account),
    }
  })
  let balancesMapping = await Promise.all(balancesPromises)
  const prices = await getPrices(
    network,
    tokensInfo.map((t) => t.symbol),
  )
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    let found_balance = balancesMapping.find((bm) => bm['token'] == token)
    let balance = found_balance.balance
    balances[token] = parseFloat(balance).toFixed(6)
    let found_token = tokensInfo.find((t) => t.address == token)
    if (found_token) {
      lastTokenPrices[token] = prices[found_token.symbol]
      found_token.userBalance = balance
    }
    lineNumbers.push(balance > 0.001 ? 1 : balance)
  }
  return {
    account,
    balances,
    lastTokenPrices,
    lineNumbers,
    mmProvider,
  }
}
