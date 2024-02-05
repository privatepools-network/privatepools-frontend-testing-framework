/**
 * @typedef {Object} CoinData
 * @property {Object.<string, Object.<string, CoinDetails>>} RAW
 * @property {Object.<string, Object.<string, CoinDisplayDetails>>} DISPLAY
 */
/**
 * @typedef {Object} CoinDetails
 * @property {string} TYPE
 * @property {string} MARKET
 * @property {string} FROMSYMBOL
 * @property {string} TOSYMBOL
 * @property {string} FLAGS
 * @property {string} LASTMARKET
 * @property {number} MEDIAN
 * @property {number} TOPTIERVOLUME24HOUR
 * @property {number} TOPTIERVOLUME24HOURTO
 * @property {string} LASTTRADEID
 * @property {number} PRICE
 * @property {number} LASTUPDATE
 * @property {number} LASTVOLUME
 * @property {number} LASTVOLUMETO
 * @property {number} VOLUMEHOUR
 * @property {number} VOLUMEHOURTO
 * @property {number} OPENHOUR
 * @property {number} HIGHHOUR
 * @property {number} LOWHOUR
 * @property {number} VOLUMEDAY
 * @property {number} VOLUMEDAYTO
 * @property {number} OPENDAY
 * @property {number} HIGHDAY
 * @property {number} LOWDAY
 * @property {number} VOLUME24HOUR
 * @property {number} VOLUME24HOURTO
 * @property {number} OPEN24HOUR
 * @property {number} HIGH24HOUR
 * @property {number} LOW24HOUR
 * @property {number} CHANGE24HOUR
 * @property {number} CHANGEPCT24HOUR
 * @property {number} CHANGEDAY
 * @property {number} CHANGEPCTDAY
 * @property {number} CHANGEHOUR
 * @property {number} CHANGEPCTHOUR
 * @property {string} CONVERSIONTYPE
 * @property {string} CONVERSIONSYMBOL
 * @property {number} CONVERSIONLASTUPDATE
 * @property {number} SUPPLY
 * @property {number} MKTCAP
 * @property {number} MKTCAPPENALTY
 * @property {number} CIRCULATINGSUPPLY
 * @property {number} CIRCULATINGSUPPLYMKTCAP
 * @property {number} TOTALVOLUME24H
 * @property {number} TOTALVOLUME24HTO
 * @property {number} TOTALTOPTIERVOLUME24H
 * @property {number} TOTALTOPTIERVOLUME24HTO
 * @property {string} IMAGEURL
 */

import { calculatePercentageDifference } from '@/lib/utils'
import { replaceFirstCharIfW } from './poolActions/compose/usePossibleComposeTokens'
import { getCoingeckoList } from './useTokenPrice'
import axios from 'axios'

/**
 * @typedef {Object} CoinDisplayDetails
 * @property {string} FROMSYMBOL
 * @property {string} TOSYMBOL
 * @property {string} MARKET
 * @property {string} LASTMARKET
 * @property {string} TOPTIERVOLUME24HOUR
 * @property {string} TOPTIERVOLUME24HOURTO
 * @property {string} LASTTRADEID
 * @property {string} PRICE
 * @property {string} LASTUPDATE
 * @property {string} LASTVOLUME
 * @property {string} LASTVOLUMETO
 * @property {string} VOLUMEHOUR
 * @property {string} VOLUMEHOURTO
 * @property {string} OPENHOUR
 * @property {string} HIGHHOUR
 * @property {string} LOWHOUR
 * @property {string} VOLUMEDAY
 * @property {string} VOLUMEDAYTO
 * @property {string} OPENDAY
 * @property {string} HIGHDAY
 * @property {string} LOWDAY
 * @property {string} VOLUME24HOUR
 * @property {string} VOLUME24HOURTO
 * @property {string} OPEN24HOUR
 * @property {string} HIGH24HOUR
 * @property {string} LOW24HOUR
 * @property {string} CHANGE24HOUR
 * @property {string} CHANGEPCT24HOUR
 * @property {string} CHANGEDAY
 * @property {string} CHANGEPCTDAY
 * @property {string} CHANGEHOUR
 * @property {string} CHANGEPCTHOUR
 * @property {string} CONVERSIONTYPE
 * @property {string} CONVERSIONSYMBOL
 * @property {string} CONVERSIONLASTUPDATE
 * @property {string} SUPPLY
 * @property {string} MKTCAP
 * @property {string} MKTCAPPENALTY
 * @property {string} CIRCULATINGSUPPLY
 * @property {string} CIRCULATINGSUPPLYMKTCAP
 * @property {string} TOTALVOLUME24H
 * @property {string} TOTALVOLUME24HTO
 * @property {string} TOTALTOPTIERVOLUME24H
 * @property {string} TOTALTOPTIERVOLUME24HTO
 * @property {string} IMAGEURL
 */

const API_KEY = process.env.VUE_APP_CRYPTOCOMPARE_API_KEY
const IS_CRYPTOCOMPARE = process.env.VUE_APP_CRYPTOCOMPARE_BY_DEFAULT == 'true'
const COINGECKO_API_KEY = process.env.VUE_APP_COINGECKO_API_KEY
const COINMARKETCAP_API_KEY = process.env.VUE_APP_COINMARKET_CAP_API_KEY
/**
 * Get token price change for the last 24 H.
 * @function useTokenPriceChange
 * @param {string} tokenId - token symbol
 * @returns {number} - price change for last 24 H
 */
export default async function useTokenPriceChange(tokenId) {
  try {
    if (IS_CRYPTOCOMPARE == 'coinmarketcap') {
      return await useTokenPriceChangeCoinMarketCap(tokenId)
    }
    if (IS_CRYPTOCOMPARE) {
      return await useTokenPriceChangeCC(tokenId)
    } else {
      return await useTokenPriceChangeCoingecko(tokenId)
    }
  } catch (e) {
    console.error(e)
    if (IS_CRYPTOCOMPARE) {
      return await useTokenPriceChangeCoingecko(tokenId)
    } else {
      return await useTokenPriceChangeCC(tokenId)
    }
  }
}

async function useTokenPriceChangeCC(tokenId) {
  tokenId = replaceFirstCharIfW(tokenId, '')
  const response = await fetch(
    `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${tokenId}&tsyms=USD&api_key=${API_KEY}`,
  )
  const data = await response.json()
  if (data.RAW[tokenId]) {
    return data.RAW[tokenId].USD.CHANGEPCT24HOUR
  }
  return 0
}

async function useTokenPriceChangeCoingecko(tokenId) {
  let coingecko_list = await getCoingeckoList()
  let id = coingecko_list.find((t) => t.symbol == tokenId.toLowerCase()).id
  const url = `https://pro-api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=2&interval=daily&x_cg_pro_api_key=${COINGECKO_API_KEY}`
  let response = await fetch(url)
  let data = await response.json()
  return calculatePercentageDifference(
    data['prices'][0],
    data['prices'][data['prices'].length - 1],
  )
}

async function useTokenPriceChangeCoinMarketCap(tokenId) {
  let url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${tokenId}`
  let response = await axios.get(url, {
    headers: {
      'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
    },
  })
  let data = (await response.json()).data
  let coins_data = Object.entries(data).map(([, value]) => value)
  return coins_data[0].quote.USD.percent_change_24h
}

/**
 * Get tokens price change for the last 24 H.
 * @function useTokenPricesChange
 * @param {string[]} tokenIds - token symbols
 * @returns {Promise<CoinData>} full market data for the tokens
 */
export async function useTokenPricesChange(tokenIds, toToken = 'USD') {
  try {
    if (IS_CRYPTOCOMPARE == 'coinmarketcap') {
      return await useTokenPricesChangeCoinMarketCap(tokenIds)
    }
    if (IS_CRYPTOCOMPARE) {
      return await useTokenPricesChangeCC(tokenIds, toToken)
    } else {
      return await useTokenPricesChangeCoingecko(tokenIds)
    }
  } catch (e) {
    console.error(e)
    if (IS_CRYPTOCOMPARE) {
      return await useTokenPricesChangeCoingecko(tokenIds)
    } else {
      return await useTokenPricesChangeCC(tokenIds, toToken)
    }
  }
}

async function useTokenPricesChangeCC(tokenIds, toToken="USD") {
  tokenIds = tokenIds.map((t) => replaceFirstCharIfW(t, ''))

  const response = await fetch(
    `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${tokenIds}&tsyms=${toToken}&api_key=${API_KEY}`,
  )
  const data = await response.json()
  return data
}
// @FiX no CHANGEPCT24HOUR PROPERTY!!!
async function useTokenPricesChangeCoingecko(tokenIds) {
  let coingecko_list = await getCoingeckoList()
  let ids = tokenIds.map(
    (tokenId) =>
      coingecko_list.find((t) => t.symbol == tokenId.toLowerCase()).id,
  )
  let result = { RAW: {} }
  for (let k = 0; k < ids.length; k++) {
    let id = ids[k]
    const url = `https://pro-api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=2&interval=daily&x_cg_pro_api_key=${COINGECKO_API_KEY}`
    let response = await fetch(url)
    let data = await response.json()
    result.RAW[tokenIds[k]] = {}
    result.RAW[tokenIds[k]]['USD'] = {
      MKTCAP: data['market_caps'][data['market_caps'].length - 1],
      PRICE: data['prices'][data['prices'].length - 1],
      CIRCULATINGSUPPLYMKTCAP:
        data['market_caps'][data['market_caps'].length - 1],
    }
  }
  return result
}

async function useTokenPricesChangeCoinMarketCap(tokenIds) {
  let url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${tokenIds}`
  let response = await axios.get(url, {
    headers: {
      'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
    },
  })
  let data = (await response.json()).data
  let coins_data = Object.entries(data).map(([, value]) => value)
  let result = { RAW: {} }
  for (let i = 0; i < tokenIds.length; i++) {
    let item = coins_data.find((item) => item.symbol == tokenIds[i])
    result[item.symbol].RAW = {}
    result[item.symbol].RAW['USD'] = {
      MKTCAP: item.quote.USD.market_cap,
      PRICE: item.quote.USD.price,
      CIRCULATINGSUPPLYMKTCAP: item.circulating_supply * item.quote.USD.price,
      CHANGEPCT24HOUR: item.quote.USD.percent_change_24h,
    }
  }

  return result
}
