import moment from 'moment'

export function addressShorthand(address) {
  if (!address) return ''

  const length = address.length
  const prefix = address.substring(0, 6)
  const suffix = address.substring(length - 4, length)
  return `${prefix}...${suffix}`
}

export async function fetchJson(url) {
  const res = await fetch(url)
  return await res.json()
}

export function toUtcTime(date) {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  )
}

export function unixToJsTime(time) {
  return time * 1000
}

export function JsTimeToDate(time) {
  return {
    date: moment(unixToJsTime(time)).format('MMM, DD, YYYY'),
    fromNow: moment(unixToJsTime(time)).fromNow(),
  }
}

export const timestampToDateTime = (timestamp) => {
  const timestampInt = parseInt(timestamp) // Convert the string to a number
  if (isNaN(timestampInt)) return ['', '']

  const date = new Date(timestampInt)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based, so add 1
  const year = date.getFullYear().toString().substr(2) // Get the last two digits of the year

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const milliseconds = String(date.getMilliseconds()).padStart(2, '0')

  const formattedDate = `${day}/${month}/${year}`
  const formattedTime = `${hours}:${minutes}:${seconds}:${milliseconds}`

  return [formattedDate, formattedTime]
}

import Ether from '@/assets/images/tokens/ether.png'
import USDT from '@/assets/images/tokens/usdt.png'
import USDC from '@/assets/images/tokens/usdc.png'
import ARB from '@/assets/images/tokens/arb.png'
import WBNB from '@/assets/images/tokens/wbnb.webp'
import STG from '@/assets/images/tokens/stargate.png'
import GHST from '@/assets/images/tokens/GHST.png'
import DAI from '@/assets/images/tokens/dai.webp'
// import Ethereum from '@/assets/images/networks/ethereum.png'
import PENDLE from '@/assets/images/tokens/pendle.png'
import MAGIC from '@/assets/images/tokens/magic.png'
import MATIC from '@/assets/images/tokens/matic.png'
import GMX from '@/assets/images/tokens/gmx-logo.png'
import RDNT from '@/assets/images/tokens/rdnt.png'
import Btc from '@/assets/images/tokens/btc.png'
import WBTC from '@/assets/images/tokens/WBTC.png'
import CHFsmall from '@/assets/images/tokens/small/flags/CH.png'
import GBsmall from '@/assets/images/tokens/small/flags/GB.png'
import USsmall from '@/assets/images/tokens/small/flags/US.png'
import EUsmall from '@/assets/images/tokens/small/flags/EU.png'
import LDOsmall from '@/assets/images/tokens/small/LDO.png'
import LINK from '@/assets/images/tokens/small/LINK.png'
import APPLEsmall from '@/assets/images/tokens/small/APPLE.png'
import ADAsmall from '@/assets/images/tokens/small/ADA.png'
import AVAXsmall from '@/assets/images/tokens/small/AVAX.png'
import BNBsmall from '@/assets/images/tokens/small/BNB.png'
import BTCsmall from '@/assets/images/tokens/small/BTC.png'
import DOGEsmall from '@/assets/images/tokens/small/DOGE.png'
import ETHsmall from '@/assets/images/tokens/small/ETH.png'
import FTMsmall from '@/assets/images/tokens/small/FTM.png'
import GHSTsmall from '@/assets/images/tokens/small/GHST.png'
import GMXsmall from '@/assets/images/tokens/small/GMX.png'
import IMXsmall from '@/assets/images/tokens/small/IMX.png'
import LTCsmall from '@/assets/images/tokens/small/LTC.png'
import MATICsmall from '@/assets/images/tokens/small/MATIC.png'
import MKRsmall from '@/assets/images/tokens/small/MKR.png'
import OPsmall from '@/assets/images/tokens/small/OP.png'
import PAXsmall from '@/assets/images/tokens/small/PAX.png'
import PAXG from '@/assets/images/tokens/PAXG.png'
import SNXsmall from '@/assets/images/tokens/small/SNX.png'
import SOLsmall from '@/assets/images/tokens/small/SOL.png'
import STGsmall from '@/assets/images/tokens/small/STG.png'
import UNIsmall from '@/assets/images/tokens/small/UNI.png'
// import USDTsmall from '@/assets/images/tokens/small/usdt.png'
import XRPsmall from '@/assets/images/tokens/small/XRP.png'
import ARBsmall from '@/assets/images/tokens/small/ARB.png'
import VELOsmall from '@/assets/images/tokens/small/VELO.png'
import BETH from '@/assets/images/tokens/BETH.png'
import VLX from '@/assets/images/tokens/VLX.png'
import CAKE from '@/assets/images/tokens/cake.png'
import DOT from '@/assets/images/tokens/DOT.webp'
import INJ from '@/assets/images/tokens/inj.png'

const tokenHT = [
  {
    key: 'Ether (ETH)',
    name: 'Ether',
    short: 'ETH',
    icon: Ether,
  },
  {
    key: 'Wrapped Ether (WETH)',
    name: 'Wrapped ether',
    short: 'WETH',
    icon: Ether,
  },
  {
    key: 'WETH',
    name: 'WETH',
    short: 'WETH',
    icon: Ether,
  },
  {
    key: 'WBTC',
    name: 'WBTC',
    short: 'WBTC',
    icon: WBTC,
  },
  {
    key: 'RDNT',
    name: 'RDNT',
    short: 'RDNT',
    icon: RDNT,
  },
  {
    key: 'DAI',
    name: 'DAI',
    short: 'DAI',
    icon: DAI,
  },
  {
    key: 'GHST',
    name: 'GHST',
    short: 'GHST',
    icon: GHST,
  },
  {
    key: 'MAGIC',
    name: 'MAGIC',
    short: 'MAGIC',
    icon: MAGIC,
  },
  {
    key: 'WMATIC',
    name: 'WMATIC',
    short: 'WMATIC',
    icon: MATIC,
  },

  {
    key: 'MATIC',
    name: 'MATIC',
    short: 'MATIC',
    icon: MATIC,
  },
  {
    key: 'STG',
    name: 'STG',
    short: 'STG',
    icon: STG,
  },
  {
    key: 'PENDLE',
    name: 'PENDLE',
    short: 'PENDLE',
    icon: PENDLE,
  },
  {
    key: 'Tether (ETH)',
    name: 'Tether USD',
    short: 'USDT',
    icon: USDT,
  },
  {
    key: 'GMX',
    name: 'GMX',
    short: 'GMX',
    icon: GMX,
  },
  {
    key: 'USDC',
    name: 'USDC',
    short: 'USDC',
    icon: USDC,
  },
  {
    key: 'USDT',
    name: 'USDT',
    short: 'USDT',
    icon: USDT,
  },
  {
    key: 'Wrapped BTC (WBTC)',
    name: 'Wrapped BTC',
    short: 'WBTC',
    icon: Btc,
  },
  {
    key: 'BTCB',
    name: 'BTCB',
    short: 'BTCB',
    icon: Btc,
  },
  {
    key: 'ARB',
    name: 'ARB',
    short: 'ARB',
    icon: ARB,
  },
  {
    key: 'Wrapped BNB',
    name: 'WBNB',
    short: 'WBNB',
    icon: WBNB,
  },
  {
    key: 'BETH',
    name: 'BETH',
    short: 'BETH',
    icon: BETH,
  },
  {
    key: 'VLX',
    name: 'VLX',
    short: 'VLX',
    icon: VLX,
  },
  {
    key: 'BTC',
    name: 'BTC',
    short: 'BTC',
    icon: Btc,
  },
  {
    key: 'CHF',
    name: 'CHF',
    short: 'CHF',
    icon: CHFsmall,
  },
  {
    key: 'GBP',
    name: 'GBP',
    short: 'GBP',
    icon: GBsmall,
  },
  {
    key: 'EUR',
    name: 'EUR',
    short: 'EUR',
    icon: EUsmall,
  },
  {
    key: 'US',
    name: 'US',
    short: 'US',
    icon: USsmall,
  },
  {
    key: 'LDO',
    name: 'LDO',
    short: 'LDO',
    icon: LDOsmall,
  },
  {
    key: 'APPLE',
    name: 'APPLE',
    short: 'AAPL',
    icon: APPLEsmall,
  },
  {
    key: 'ADA',
    name: 'ADA',
    short: 'ADA',
    icon: ADAsmall,
  },
  {
    key: 'AVAX',
    name: 'AVAX',
    short: 'AVAX',
    icon: AVAXsmall,
  },
  {
    key: 'BNB',
    name: 'BNB',
    short: 'BNB',
    icon: BNBsmall,
  },
  {
    key: 'BTC',
    name: 'BTC',
    short: 'BTC',
    icon: BTCsmall,
  },
  {
    key: 'DOGE',
    name: 'DOGE',
    short: 'DOGE',
    icon: DOGEsmall,
  },
  {
    key: 'ETH',
    name: 'ETH',
    short: 'ETH',
    icon: ETHsmall,
  },
  {
    key: 'FTM',
    name: 'FTM',
    short: 'FTM',
    icon: FTMsmall,
  },
  {
    key: 'GHST',
    name: 'GHST',
    short: 'GHST',
    icon: GHSTsmall,
  },
  {
    key: 'GMX',
    name: 'GMX',
    short: 'GMX',
    icon: GMXsmall,
  },
  {
    key: 'IMX',
    name: 'IMX',
    short: 'IMX',
    icon: IMXsmall,
  },
  {
    key: 'LTC',
    name: 'LTC',
    short: 'LTC',
    icon: LTCsmall,
  },
  {
    key: 'MATIC',
    name: 'MATIC',
    short: 'MATIC',
    icon: MATICsmall,
  },
  {
    key: 'MKR',
    name: 'MKR',
    short: 'MKR',
    icon: MKRsmall,
  },
  {
    key: 'OP',
    name: 'OP',
    short: 'OP',
    icon: OPsmall,
  },
  {
    key: 'PAX',
    name: 'PAX',
    short: 'PAXG',
    icon: PAXsmall,
  },
  {
    key: 'PAXG',
    name: 'PAXG',
    short: 'PAXG',
    icon: PAXG,
  },
  {
    key: 'SNX',
    name: 'SNX',
    short: 'SNX',
    icon: SNXsmall,
  },
  {
    key: 'SOL',
    name: 'SOL',
    short: 'SOL',
    icon: SOLsmall,
  },
  {
    key: 'STG',
    name: 'STG',
    short: 'STG',
    icon: STGsmall,
  },
  {
    key: 'UNI',
    name: 'UNI',
    short: 'UNI',
    icon: UNIsmall,
  },
  {
    key: 'USDT',
    name: 'USDT',
    short: 'USDT',
    icon: USDT,
  },
  {
    key: 'XRP',
    name: 'XRP',
    short: 'XRP',
    icon: XRPsmall,
  },

  {
    key: 'ARB',
    name: 'ARB',
    short: 'ARB',
    icon: ARBsmall,
  },
  {
    key: 'CAKE',
    name: 'CAKE',
    short: 'CAKE',
    icon: CAKE,
  },
  {
    key: 'Cake',
    name: 'Cake',
    short: 'Cake',
    icon: CAKE,
  },
  {
    key: 'VELO',
    name: 'VELO',
    short: 'VELO',
    icon: VELOsmall,
  },
  {
    key: 'DOT',
    name: 'DOT',
    short: 'DOT',
    icon: DOT,
  },
  {
    key: 'INJ',
    name: 'INJ',
    short: 'INJ',
    icon: INJ,
  },
  {
    key: 'LINK',
    name: 'LINK',
    short: 'LINK',
    icon: LINK,
  },
]

const EMPTY_TOKEN = {
  key: '',
  name: '',
  short: '',
  icon: '',
}

/**
 * Function to get a token entity.
 * @param {string} tokenKey - The key of the token.
 * @param {('key'|'name'|'short'|'icon')} [key='key'] - The key to be used. It can be 'key', 'name', 'short', or 'icon'.
 * @returns {Object} The token entity.
 */
export const getTokenEntity = (tokenKey, key = 'key') => {
  let found = tokenHT.find((tokenHTEntry) => tokenHTEntry[key] === tokenKey)
  if (!found) return { ...EMPTY_TOKEN, short: tokenKey }
  return found
}
