import config from '@/lib/config'
import axios from 'axios'

const API_KEY = process.env.VUE_APP_CRYPTOCOMPARE_API_KEY
const IS_CRYPTOCOMPARE = process.env.VUE_APP_CRYPTOCOMPARE_BY_DEFAULT == 'true'
const COINGECKO_API_KEY = process.env.VUE_APP_COINGECKO_API_KEY
const COINMARKETCAP_API_KEY = process.env.VUE_APP_COINMARKET_CAP_API_KEY

let COINGECKO_LIST = []

export default async function useTokenPrice(tokenId, target) {
  try {
    if (IS_CRYPTOCOMPARE == 'coinmarketcap') {
      return await useTokenPriceCoinMarketCap(tokenId, target)
    }
    if (IS_CRYPTOCOMPARE) {
      return await useTokenPriceCC(tokenId, target)
    } else {
      return await useTokenPriceCoingecko(tokenId, target)
    }
  } catch (e) {
    console.error(e)
    if (IS_CRYPTOCOMPARE) {
      return await useTokenPriceCoingecko(tokenId, target)
    } else {
      return await useTokenPriceCC(tokenId, target)
    }
  }
}

async function useTokenPriceCC(tokenId, target) {
  const apiUrl = `https://min-api.cryptocompare.com/data/price?fsym=${tokenId}&tsyms=${target}&api_key=${API_KEY}`
  const response = await fetch(apiUrl)
  const data = await response.json()

  return data.USD
}

async function useTokenPriceCoingecko(tokenId, target) {
  if (COINGECKO_LIST.length == 0) {
    await getCoingeckoList()
  }
  let id = COINGECKO_LIST.find((t) => t.symbol == tokenId.toLowerCase()).id
  let url = `https://pro-api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${target}&x_cg_pro_api_key=${COINGECKO_API_KEY}`
  let response = await fetch(url)
  return (await response.json())[id][target.toLowerCase()]
}

export async function getCoingeckoList() {
  if (COINGECKO_LIST.length > 0) return COINGECKO_LIST
  let url = `https://pro-api.coingecko.com/api/v3/coins/list?x_cg_pro_api_key=${COINGECKO_API_KEY}`
  let response = await fetch(url)
  COINGECKO_LIST = await response.json()
  return COINGECKO_LIST
}

async function useTokenPriceCoinMarketCap(tokenId, target) {
  let url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${tokenId}&convert=${target}`
  let response = await axios.get(url, {
    headers: {
      'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
    },
  })
  let data = (await response.json()).data
  let coins_data = Object.entries(data).map(([, value]) => value)
  return coins_data[0].quote.USD.price
}

export async function useTokenPrices(tokenIds, target) {
  try {
    if (IS_CRYPTOCOMPARE == 'coinmarketcap') {
      return await useTokenPricesCoinMarketCap(tokenIds, target)
    }
    if (IS_CRYPTOCOMPARE) {
      return await useTokenPricesCC(tokenIds, target)
    } else {
      return await useTokenPricesCoingecko(tokenIds, target)
    }
  } catch (e) {
    console.error(e)
    if (IS_CRYPTOCOMPARE) {
      return await useTokenPricesCoingecko(tokenIds, target)
    } else {
      return await useTokenPricesCC(tokenIds, target)
    }
  }
}

async function useTokenPricesCoingecko(tokenIds, target) {
  if (COINGECKO_LIST.length == 0) {
    await getCoingeckoList()
  }
  let ids = tokenIds.map(
    (tokenId) =>
      COINGECKO_LIST.find((t) => t.symbol == tokenId.toLowerCase()).id,
  )
  let url = `https://pro-api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${target}&x_cg_pro_api_key=${COINGECKO_API_KEY}`
  let response = await fetch(url)
  let data = await response.json()
  let result = {}
  for (let i = 0; i < tokenIds.length; i++) {
    result[tokenIds[i]] = {}
    result[tokenIds[i]]['USD'] = data[ids[i]][target]
  }
  return result
}

async function useTokenPricesCC(tokenIds, target) {
  const apiUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tokenIds}&tsyms=${target}&api_key=${API_KEY}`
  const response = await fetch(apiUrl)
  const data = await response.json()

  return data
}

async function useTokenPricesCoinMarketCap(tokenIds, target) {
  let url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${tokenIds}&convert=${target}`
  let response = await axios.get(url, {
    headers: {
      'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
    },
  })
  let data = (await response.json()).data
  let coins_data = Object.entries(data).map(([, value]) => value)
  let result = {}
  for (let i = 0; i < tokenIds.length; i++) {
    result[tokenIds[i]] = {}
    result[tokenIds[i]]['USD'] = coins_data.find(
      (item) => item.symbol == tokenIds[i],
    ).quote.USD.price
  }
  return result
}

export async function getNativeTokenPrices(networkId) {
  return await useTokenPrice(config[networkId]['nativeAsset']['apiId'], 'usd')
}
