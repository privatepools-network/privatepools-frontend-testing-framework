import axios from 'axios'
import { replaceFirstCharIfW } from '../poolActions/compose/usePossibleComposeTokens'
import { getCoingeckoList } from '../useTokenPrice'

export const CRYPTOCOMPARE_API_KEY = process.env.VUE_APP_CRYPTOCOMPARE_API_KEY
const CACHED_PRICES = {}
const IS_CRYPTOCOMPARE = process.env.VUE_APP_CRYPTOCOMPARE_BY_DEFAULT == 'true'
const COINGECKO_API_KEY = process.env.VUE_APP_COINGECKO_API_KEY
const COINMARKETCAP_API_KEY = process.env.VUE_APP_COINMARKET_CAP_API_KEY

/**
 * Get current price of the token
 * @function GetPriceBySymbol
 * @param {string} symbol - symbol of the token
 * @returns {Promise<number>} - price of the token
 */
export async function GetPriceBySymbol(symbol, toToken = 'USD') {
  try {
    if (IS_CRYPTOCOMPARE == 'coinmarketcap') {
      return await GetPriceBySymbolCoinMarketCap(symbol, toToken)
    }
    if (IS_CRYPTOCOMPARE) {
      return await GetPriceBySymbolCC(symbol, toToken)
    } else {
      return await GetPriceBySymbolCoingecko(symbol, toToken)
    }
  } catch (e) {
    console.error(e)
    if (IS_CRYPTOCOMPARE == 'coinmarketcap') {
      return await GetPriceBySymbolCoinMarketCap(symbol, toToken)
    }
    if (IS_CRYPTOCOMPARE) {
      return await GetPriceBySymbolCoingecko(symbol, toToken)
    } else {
      return await GetPriceBySymbolCC(symbol, toToken)
    }
  }
}

async function GetPriceBySymbolCoinMarketCap(symbol) {
  let url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbol}`
  let response = await axios.get(url, {
    headers: {
      'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
    },
  })
  let data = (await response.json()).data
  let coins_data = Object.entries(data).map(([, value]) => value)
  return coins_data[0].quote.USD.price
}

async function GetPriceBySymbolCC(symbol, toToken = 'USD') {
  if (CACHED_PRICES[toToken] && CACHED_PRICES[toToken][symbol]) {
    return CACHED_PRICES[toToken][symbol]
  }
  const url = `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=${toToken}&api_key=${CRYPTOCOMPARE_API_KEY}`
  let response = await axios.get(url)
  let price = response.data[toToken]
  if (!CACHED_PRICES[toToken]) {
    CACHED_PRICES[toToken] = {}
  }
  CACHED_PRICES[toToken][symbol] = price
  return price
}

async function GetPriceBySymbolCoingecko(symbol, toToken = 'UDST') {
  let coingecko_list = await getCoingeckoList()
  let id = coingecko_list.find((t) => t.symbol == symbol.toLowerCase()).id
  let url = `https://pro-api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${toToken}&x_cg_pro_api_key=${COINGECKO_API_KEY}`
  let response = await fetch(url)
  return (await response.json())[id][toToken]
}

/**
 * Get token price in USD, the same as @see GetPriceBySymbol , but including Wrapped token formatting, because cryptocompare doesn't have data for some of the wrapped tokens, but has for not wrapped.
 * @function GetTokenPriceUsd
 * @param {string} symbol - symbol of the token
 * @returns {Promise<number>} price of the token
 */
export async function GetTokenPriceUsd(symbol, toToken = 'USD') {
  symbol = replaceFirstCharIfW(symbol, '')
  let token_price_usd = await GetPriceBySymbol(symbol, toToken)
  if (token_price_usd == undefined) {
    token_price_usd = 0
  }
  return token_price_usd
}

/**
 * Get current prices of the multiple tokens
 * @function GetTokenPricesBySymbols
 * @param {string[]} symbols - symbols of the tokens
 * @returns {Promise<Map<string,number>>} mapping with info about each token price
 */
export async function GetTokenPricesBySymbols(symbols, toToken = 'USD') {
  let promises = []
  for (let i = 0; i < symbols.length; i++) {
    promises.push(GetTokenPriceUsd(symbols[i], toToken))
  }
  let prices = await Promise.all(promises)
  let results = []
  for (let k = 0; k < symbols.length; k++) {
    results[symbols[k]] = prices[k]
  }
  return results
}

/**
 * Represents a data point with cryptocurrency price information.
 * @typedef {Object} PriceData
 * @property {number} time - The timestamp for the data point.
 * @property {number} high - The highest price during the period.
 * @property {number} low - The lowest price during the period.
 * @property {number} open - The opening price of the period.
 * @property {number} volumefrom - The volume of the asset traded from.
 * @property {number} volumeto - The volume of the asset traded to.
 * @property {number} close - The closing price of the period.
 * @property {string} conversionType - The conversion type (e.g., "direct").
 * @property {string} conversionSymbol - The conversion symbol.
 */

/**
 * Get historical daily prices for token.
 * @function GetTokenHistoricalPriceDaily
 * @param {string} symbol - symbol of the token
 * @param {number} daysLimit - how many days ago to count prices
 * @returns {Promise<PriceData[]>} historical daily prices for token
 */
export async function GetTokenHistoricalPriceDaily(
  symbol,
  daysLimit,
  toToken = 'USD',
) {
  try {
    if (IS_CRYPTOCOMPARE == 'coinmarketcap') {
      return await GetTokenPriceDailyCoinMarketCap(symbol, daysLimit, toToken)
    }
    if (IS_CRYPTOCOMPARE) {
      return await GetTokenHistoricalPriceDailyCC(symbol, daysLimit, toToken)
    } else {
      return await GetTokenHistoricalPriceDailyCoingecko(
        symbol,
        daysLimit,
        toToken,
      )
    }
  } catch (e) {
    console.error(e)
    if (IS_CRYPTOCOMPARE == 'coinmarketcap') {
      return await GetTokenPriceDailyCoinMarketCap(symbol, daysLimit, toToken)
    }
    if (IS_CRYPTOCOMPARE) {
      return await GetTokenHistoricalPriceDailyCoingecko(
        symbol,
        daysLimit,
        toToken,
      )
    } else {
      return await GetTokenHistoricalPriceDailyCC(symbol, daysLimit, toToken)
    }
  }
}

async function GetTokenHistoricalPriceDailyCC(
  symbol,
  daysLimit,
  toToken = 'USD',
) {
  const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=${toToken}&limit=${daysLimit}&api_key=${CRYPTOCOMPARE_API_KEY}`
  let response = await axios.get(url)
  return response.data.Data.Data
}
async function GetTokenHistoricalPriceDailyCoingecko(
  symbol,
  daysLimit,
  toToken = 'USD',
) {
  let coingecko_list = await getCoingeckoList()
  let id = coingecko_list.find((t) => t.symbol == symbol.toLowerCase()).id
  const url = `https://pro-api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${toToken}&days=${daysLimit}&interval=daily&x_cg_pro_api_key=${COINGECKO_API_KEY}`
  let response = await axios.get(url)
  return response.data['prices'].map((t) => ({
    time: t[0] / 1000,
    open: t[1],
    high: t[1],
    low: t[1],
  }))
}

async function GetTokenPriceDailyCoinMarketCap(symbol, daysLimit) {
  const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/ohlcv/historical?symbol=${symbol}&time_period=daily&count=${daysLimit}&interval=daily`
  let response = await axios.get(url, {
    headers: {
      'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
    },
  })
  let data = (await response.json()).data
  let entries = Object.entries(data).map(([, value]) => value)
  return entries[0].quotes.map((q) => ({
    ...q.quote.USD,
    time: new Date(q.quote.USD.timestamp).getTime() / 1000,
  }))
}

/**
 * Get historical hourly prices for token.
 * @function GetTokenHistoricalPriceHourly
 * @param {string} symbol - symbol of the token
 * @returns {Promise<PriceData[]>} historical hourly prices for token
 */
export async function GetTokenHistoricalPriceHourly(symbol, toToken = 'USD') {
  try {
    if (IS_CRYPTOCOMPARE == 'coinmarketcap') {
      return await GetTokenPriceHourlyCoinMarketCap(symbol, toToken)
    }
    if (IS_CRYPTOCOMPARE) {
      return await GetTokenPriceHourlyCC(symbol, toToken)
    } else {
      return await GetTokenPriceHourlyCoingecko(symbol, toToken)
    }
  } catch (e) {
    console.error(e)
    if (IS_CRYPTOCOMPARE) {
      return await GetTokenPriceHourlyCoingecko(symbol, toToken)
    } else {
      return await GetTokenPriceHourlyCC(symbol, toToken)
    }
  }
}

async function GetTokenPriceHourlyCC(symbol, toToken = 'USD') {
  const url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=${toToken}&limit=23&api_key=${CRYPTOCOMPARE_API_KEY}`
  let response = await axios.get(url)
  return response.data.Data.Data
}

async function GetTokenPriceHourlyCoingecko(symbol, toToken = 'USD') {
  let coingecko_list = await getCoingeckoList()
  let id = coingecko_list.find((t) => t.symbol == symbol.toLowerCase()).id
  const url = `https://pro-api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${toToken}&days=2&x_cg_pro_api_key=${COINGECKO_API_KEY}`
  let response = await axios.get(url)
  return response.data['prices'].map((t) => ({
    time: t[0] / 1000,
    open: t[1],
    high: t[1],
    low: t[1],
  }))
}

async function GetTokenPriceHourlyCoinMarketCap(symbol) {
  const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/ohlcv/historical?symbol=${symbol}&time_period=hourly&count=24&interval=hourly`
  let response = await axios.get(url, {
    headers: {
      'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
    },
  })
  let data = (await response.json()).data
  let entries = Object.entries(data).map(([, value]) => value)
  return entries[0].quotes.map((q) => ({
    ...q.quote.USD,
    time: new Date(q.quote.USD.timestamp).getTime() / 1000,
  }))
}

/**
 * @typedef {Object} HistoricalPriceInfo
 * @property {PriceData[]} Hourly
 * @property {PriceData[]} Daily
 * @property {string} symbol
 */

/**
 * Get info about daily/hourly historical prices of the token
 * @function GetHistoricalPrice
 * @param {string} symbol - symbol of the token
 * @param {boolean} enableHourly - include parsing hourly prices for current day or not
 * @param {number} daysLimit - how many days ago to count price
 * @returns {Promise<HistoricalPriceInfo>}
 */
export async function GetHistoricalPrice(
  symbol,
  enableHourly = true,
  daysLimit = 500,
  toToken = 'USD',
) {
  let _symbol = symbol
  _symbol = replaceFirstCharIfW(_symbol, '')
  let [hourly, daily] = await Promise.all([
    enableHourly ? GetTokenHistoricalPriceHourly(_symbol, toToken) : undefined,
    GetTokenHistoricalPriceDaily(_symbol, daysLimit, toToken),
  ])
  return { Hourly: hourly, Daily: daily, symbol: symbol }
}

/**
 * Get top 10 tokens my market cap.
 * @function GetTop10Tokens
 * @returns {Promise<string[]>} top 10 token symbols by market cap.
 */
export async function GetTop10Tokens(toToken = 'USD') {
  try {
    if (IS_CRYPTOCOMPARE == 'coinmarketcap') {
      return await GetTop10TokensCoinmarketCap(toToken)
    }
    if (IS_CRYPTOCOMPARE) {
      return await GetTop10TokensCC(toToken)
    } else {
      return await GetTop10TokensCoingecko(toToken)
    }
  } catch (e) {
    console.error(e)
    if (IS_CRYPTOCOMPARE == 'coinmarketcap') {
      return await GetTop10TokensCoinmarketCap(toToken)
    }
    if (IS_CRYPTOCOMPARE) {
      return await GetTop10TokensCoingecko(toToken)
    } else {
      return await GetTop10TokensCC(toToken)
    }
  }
}

async function GetTop10TokensCC(toToken = 'USD') {
  const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=${toToken}&api_key=${CRYPTOCOMPARE_API_KEY}`
  let response = await axios.get(url)
  return response.data.Data.map((item) => item.CoinInfo.Name)
}

async function GetTop10TokensCoingecko() {
  let url = `https://pro-api.coingecko.com/api/v3/global?x_cg_pro_api_key=${COINGECKO_API_KEY}`
  let response = await axios.get(url)
  return Object.keys(response.data.total_market_cap).map((t) => t.toUpperCase())
}

async function GetTop10TokensCoinmarketCap() {
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?limit=10&sort=cmc_rank`
  let response = await axios.get(url, {
    headers: {
      'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
    },
  })
  let data = (await response.json()).data
  return data.map((item) => item.symbol)
}
