import {
  getShortDayString,
  getShortMonthString,
  getShortWeekString,
  getShortYearString,
} from '@/lib/utils'
export const NETWORK_SHORT_NAME = {
  Arbitrum: 'arbitrum',
  Binance: 'bsc',
  Polygon: 'polygon',
}

export const NETWORK_URL = {
  Arbitrum: process.env.VUE_APP_BOT_ARBITRUM,
  Binance: process.env.VUE_APP_BOT_BINANCE,
  Polygon: process.env.VUE_APP_BOT_POLYGON,
}

/**
 * @typedef {Object} TimeType
 * @property {Function} method
 * @property {string} name
 * @property {number} duration
 * @property {Date} start_date
 */

/**
 * @const {TimeType[]}
 */
export const TIME_TYPES = [
  {
    method: getShortDayString,
    name: 'D',
    duration: 1,
    start_date: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    method: getShortWeekString,
    name: 'W',
    duration: 7,
    start_date: new Date(new Date().getTime() - 35 * 24 * 60 * 60 * 1000),
  },
  {
    method: getShortMonthString,
    name: 'M',
    duration: 30,
    start_date: new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000),
  },
  {
    method: getShortYearString,
    name: 'Y',
    duration: 365,
    start_date: new Date(new Date().getTime() - 1000 * 24 * 60 * 60 * 1000),
  },
  {
    method: getShortYearString,
    name: 'SD',
    duration: 365,
    start_date: new Date(new Date().getTime() - 1000 * 24 * 60 * 60 * 1000),
  },
]
