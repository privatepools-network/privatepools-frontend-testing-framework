import { InitializeMetamask } from '@/lib/utils/metamask'
import useBalance from '../useBalance'
import { getPrices } from '../data/pricesData'
import { getPortfolioBalance } from '../data/portfolioData'

function roundDown(number, decimals) {
  decimals = decimals || 0
  return (
    Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
  ).toString()
}
export async function usePoolActionBalances(tokens, tokensInfo, network) {
  let account = ''
  let balances = {}
  let lastTokenPrices = { USD: {}, ETH: {}, BTC: {} }
  let lineNumbers = []
  const mmProvider = await InitializeMetamask()
  if (!mmProvider) return
  account = await mmProvider.getSigner().getAddress()
  const account_balances = await getPortfolioBalance(56, account)
  const prices = await getPrices(56, [
    'ETH',
    'BTC',
    ...tokensInfo.map((t) => t.symbol),
  ])
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    let found_balance = account_balances.tokens.find(
      (bm) => bm['address'] == token,
    )
    let balance = 0
    if (found_balance) {
      balance = found_balance.amount
      balances[token] = roundDown(parseFloat(balance), 8)
      let found_token = tokensInfo.find((t) => t.address == token)
      if (found_token) {
        const usdPrice = found_balance.usdAmount / found_balance.amount
        const ethPrice = found_balance.ETHAmount / found_balance.amount
        const btcPrice = found_balance.BTCAmount / found_balance.amount
        lastTokenPrices['USD'][token] = usdPrice
        lastTokenPrices['ETH'][token] = ethPrice
        lastTokenPrices['BTC'][token] = btcPrice
        found_token.userBalance = balance
      }
    } else {
      balances[token] = '0'
      let found_token = tokensInfo.find((t) => t.address == token)
      if (found_token) {
        lastTokenPrices['USD'][token] = prices[found_token.symbol]
        lastTokenPrices['ETH'][token] =
          prices[found_token.symbol] * (1 / prices['ETH'])
        lastTokenPrices['BTC'][token] =
          prices[found_token.symbol] * (1 / prices['BTC'])
        found_token.userBalance = balance
      }
    }
    lineNumbers.push(0)
  }
  return {
    account,
    balances,
    lastTokenPrices,
    lineNumbers,
    mmProvider,
  }
}
