/* eslint-disable */
import useQuery from '@/composables/useQuery'
import queryBuilder from './query'
import config from '@/lib/config'
import { Network } from '@/composables/useNetwork'
import useTokenPrice from '@/composables/useTokenPrice'
import BigNumber from 'bignumber.js'
import useTokenPriceChange from '@/composables/useTokenPriceChange'
import moment from 'moment'

export default class Trades {
  getProfit(period, data, chain) {
    const weekBiggerThanMonth =
      moment().utc(true).startOf('week').unix() <
      moment().utc(true).startOf('month').unix()

    // console.log('weekBiggerThanMonth', weekBiggerThanMonth)
    let timestampArg
    let timestampEnd = Number.MAX_SAFE_INTEGER
    switch (period) {
      case 'total':
        timestampArg = 0
        break
      case 'weekly':
        timestampArg = moment().subtract(7, 'days').unix()
        break
      case 'halfyearly':
        timestampArg = moment().subtract(6, 'months').unix()
        break
      case 'monthly':
        timestampArg = moment().subtract(1, 'months').unix()
        break
      case 'daily':
        timestampArg = moment().subtract(1, 'days').unix()
        break
      case 'week-past':
        timestampArg = moment().subtract(14, 'days').unix()
        timestampEnd = moment().subtract(7, 'days').unix()
        break
      case 'day-past':
        timestampArg = moment().subtract(2, 'days').unix()
        timestampEnd = moment().subtract(1, 'days').unix()
        break
      case 'month-past':
        timestampArg = moment().subtract(2, 'months').unix()
        timestampEnd = moment().subtract(1, 'months').unix()
        break
      default:
        timestampArg = moment().subtract(1, 'days').unix()
    }

    let sum = {}
    let tokens =
      config[
        chain == 'binance'
          ? Network.BINANCE
          : chain == 'arbitrum'
          ? Network.ARBITRUM
          : Network.POLYGON
      ].tokens
    const tokenKeys = Object.keys(tokens)
    data?.map((transfer) => {
      if (!sum[transfer.token]) sum[transfer.token] = new BigNumber(0)
      if (
        Number(transfer.timestamp) >= Number(timestampArg) &&
        Number(transfer.timestamp) <= Number(timestampEnd)
      ) {
        const num1 = Number(transfer.profitUsd)
        const num2 = Number(sum[transfer.token])
        const final = num1 + num2
        sum[transfer.token] = final
      }
    })
    let total = 0

    Object.keys(sum).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token = tokens[key]
        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          total = Number(total.toString()) + Number(sum[tokenAddress])
        }
      }
    })
    return Number(total)
  }

  getRevenue(period, data, chain) {
    const timestampArg = '0'

    let sum = {}
    const tokenKeys = Object.keys(
      config[
        chain == 'binance'
          ? Network.BINANCE
          : chain == 'arbitrum'
          ? Network.ARBITRUM
          : Network.POLYGON
      ].tokens,
    )
    data?.map((transfer) => {
      if (!sum[transfer.token]) sum[transfer.token] = new BigNumber(0)
      if (Number(transfer.timestamp) >= Number(timestampArg)) {
        const num1 = Number(transfer.revenueUsd)
        const num2 = Number(sum[transfer.token])
        const final = num1 + num2
        sum[transfer.token] = final
      }
    })
    let total = 0

    Object.keys(sum).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address === tokenAddress) {
          total = Number(total.toString()) + Number(sum[tokenAddress])
        }
      }
    })
    return Number(total).toFixed(2)
  }

  getVolume(period, data, chain) {
    let timestampArg
    let timestampEnd = Number.MAX_SAFE_INTEGER
    let weekBiggerThanMonth =
      moment().utc(true).startOf('week').unix() <
      moment().utc(true).startOf('month').unix()

    switch (period) {
      case 'total':
        timestampArg = 0
        break
      case 'weekly':
        timestampArg = moment().subtract(7, 'days').unix()
        break
      case 'halfyearly':
        timestampArg = moment().subtract(6, 'months').unix()
        break
      case 'monthly':
        timestampArg = moment().subtract(1, 'months').unix()
        break
      case 'daily':
        timestampArg = moment().subtract(1, 'days').unix()
        break
      case 'week-past':
        timestampArg = moment().subtract(14, 'days').unix()
        timestampEnd = moment().subtract(7, 'days').unix()
        break
      case 'day-past':
        timestampArg = moment().subtract(2, 'days').unix()
        timestampEnd = moment().subtract(1, 'days').unix()
        break
      case 'month-past':
        timestampArg = moment().subtract(2, 'months').unix()
        timestampEnd = moment().subtract(1, 'months').unix()
        break
      default:
        timestampArg = moment().subtract(1, 'days').unix()
    }

    let sum = {}
    const tokenKeys = Object.keys(
      config[
        chain == 'binance'
          ? Network.BINANCE
          : chain == 'arbitrum'
          ? Network.ARBITRUM
          : Network.POLYGON
      ].tokens,
    )
    data?.map((transfer) => {
      if (!sum[transfer.token]) sum[transfer.token] = Number(0)
      if (
        Number(transfer.timestamp) >= Number(timestampArg) &&
        Number(transfer.timestamp) <= Number(timestampEnd)
      ) {
        const num1 = Number(transfer.volumeUsd)
        const num2 = Number(sum[transfer.token]) //
        const final = num1 + num2
        sum[transfer.token] = final
      }
    })
    let total = 0

    Object.keys(sum).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          total = Number(total.toString()) + Number(sum[tokenAddress])
        }
      }
    })
    return Number(total.toFixed(2))
  }

  async getYesterdayVolume(period, data, chain) {
    // const weekBiggerThanMonth =
    //   moment().utc(true).startOf('week').unix() <
    //   moment().utc(true).startOf('month').unix()

    const timestampArg = moment().utc(true).subtract(1, 'day').unix()
    // period === 'total'
    //   ? '0'
    //   : period === 'weekly'
    //   ? weekBiggerThanMonth
    //     ? moment().utc(true).subtract(1, 'day').unix()
    //     : moment().utc(true).subtract(1, 'day').unix()
    //   : period === 'monthly'
    //   ? moment().utc(true).subtract(1, 'day').unix()
    //   : moment().utc(true).subtract(1, 'day').unix()

    let sum = {}
    let tokenKeys = []
    data?.map((transfer) => {
      if (!sum[transfer.token]) sum[transfer.token] = new Number(0)
      if (Number(transfer.timestamp) >= Number(timestampArg)) {
        tokenKeys = Object.keys(
          config[
            transfer.chain == 'binance'
              ? Network.BINANCE
              : transfer.chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens,
        )
        const num1 = Number(transfer.volumeUsd)
        const num2 = Number(sum[transfer.token])
        const final = num1 + num2
        sum[transfer.token] = final
      }
    })
    let total = 0

    await Promise.all(
      Object.keys(sum).map(async (tokenAddress) => {
        for (const key of tokenKeys) {
          const token =
            config[
              chain == 'binance'
                ? Network.BINANCE
                : chain == 'arbitrum'
                ? Network.ARBITRUM
                : Network.POLYGON
            ].tokens[key]
          if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
            total = Number(total.toString()) + Number(sum[tokenAddress])
          }
        }
      }),
    )

    return Number(total)
  }

  getTotalFeesNative(data, chain) {
    let total = 0
    data?.map((transfer) => {
      if (transfer.chain == chain) {
        const num1 = Number(total)
        const num2 = Number(transfer.gasFee)
        total = num2 + num1
      }
    })
    return total
  }

  getTotalFeesUsd(data, chain) {
    let total = 0
    data?.map((transfer) => {
      if (transfer.chain == chain) {
        const num1 = Number(total)
        const num2 = Number(transfer.gasFeeUsd)
        total = num2 + num1
      }
    })
    return total
  }

  getWeeklyTradesAmount(data, chain) {
    const currentDate = new Date()
    const currentDayOfWeek = currentDate.getDay()
    let sunday = 0
    let monday = 0
    let tuesday = 0
    let wednesday = 0
    let thursday = 0
    let friday = 0
    let saturday = 0
    data?.map((transfer) => {
      // console.log('sunday begin', Math.floor(new Date() / 1000 - 24 * 3600 * 6))
      // console.log(
      //   'sunday finish',
      //   Math.floor(new Date() / 1000 - 24 * 3600 * 5),
      // )

      if (currentDayOfWeek == 0) {
        //SUNDAY
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').unix() &&
          Number(transfer.timestamp) <= Math.floor(new Date())
        ) {
          if (chain == transfer.chain) sunday++
        }
      }
      if (currentDayOfWeek == 1) {
        //MONDAY
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(1, 'days').unix() &&
          Number(transfer.timestamp) <= moment().utc(true).startOf('day').unix()
        ) {
          if (chain == transfer.chain) sunday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').unix() &&
          Number(transfer.timestamp) <= Math.floor(new Date())
        ) {
          if (chain == transfer.chain) monday++
        }
      }
      if (currentDayOfWeek == 2) {
        //TUESDAY
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(3, 'days').unix() &&
          Number(transfer.timestamp) <=
            moment().utc(true).startOf('day').subtract(2, 'days').unix()
        ) {
          if (chain == transfer.chain) sunday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(1, 'days').unix() &&
          Number(transfer.timestamp) <= moment().utc(true).startOf('day').unix()
        ) {
          if (chain == transfer.chain) monday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').unix() &&
          Number(transfer.timestamp) <= Math.floor(new Date())
        ) {
          if (chain == transfer.chain) tuesday++
        }
      }
      if (currentDayOfWeek == 3) {
        //WEDNESDAY
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(4, 'days').unix() &&
          Number(transfer.timestamp) <=
            moment().utc(true).startOf('day').subtract(3, 'days').unix()
        ) {
          if (chain == transfer.chain) sunday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(2, 'days').unix() &&
          Number(transfer.timestamp) <=
            moment().utc(true).startOf('day').subtract(1, 'days').unix()
        ) {
          if (chain == transfer.chain) monday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(1, 'days').unix() &&
          Number(transfer.timestamp) <= moment().utc(true).startOf('day').unix()
        ) {
          if (chain == transfer.chain) tuesday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').unix() &&
          Number(transfer.timestamp) <= Math.floor(new Date())
        ) {
          if (chain == transfer.chain) wednesday++
        }
      }
      if (currentDayOfWeek == 4) {
        //THURDAY
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(4, 'days').unix() &&
          Number(transfer.timestamp) <=
            moment().utc(true).startOf('day').subtract(3, 'days').unix()
        ) {
          if (chain == transfer.chain) sunday++
        }
        // console.log('FWAFWFAF', Math.floor(new Date() / 1000 - 24 * 3600 * 5))
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(3, 'days').unix() &&
          Number(transfer.timestamp) <=
            moment().utc(true).startOf('day').subtract(2, 'days').unix()
        ) {
          if (chain == transfer.chain) monday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(2, 'days').unix() &&
          Number(transfer.timestamp) <=
            moment().utc(true).startOf('day').subtract(1, 'days').unix()
        ) {
          if (chain == transfer.chain) tuesday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(1, 'days').unix() &&
          Number(transfer.timestamp) <= moment().utc(true).startOf('day').unix()
        ) {
          if (chain == transfer.chain) wednesday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').unix() &&
          Number(transfer.timestamp) <= Math.floor(new Date())
        ) {
          if (chain == transfer.chain) thursday++
        }
      }
      if (currentDayOfWeek == 5) {
        //FRIDAY
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(5, 'days').unix() &&
          Number(transfer.timestamp) <=
            moment().utc(true).startOf('day').subtract(4, 'days').unix()
        ) {
          if (chain == transfer.chain) sunday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(4, 'days').unix() &&
          Number(transfer.timestamp) <=
            moment().utc(true).startOf('day').subtract(3, 'days').unix()
        ) {
          if (chain == transfer.chain) monday++
        }
        // console.log('FWAFWFAF', Math.floor(new Date() / 1000 - 24 * 3600 * 5))
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(3, 'days').unix() &&
          Number(transfer.timestamp) <=
            moment().utc(true).startOf('day').subtract(2, 'days').unix()
        ) {
          if (chain == transfer.chain) tuesday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(2, 'days').unix() &&
          Number(transfer.timestamp) <=
            moment().utc(true).startOf('day').subtract(1, 'days').unix()
        ) {
          if (chain == transfer.chain) wednesday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(1, 'days').unix() &&
          Number(transfer.timestamp) <= moment().utc(true).startOf('day').unix()
        ) {
          if (chain == transfer.chain) thursday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').unix() &&
          Number(transfer.timestamp) <= Math.floor(new Date())
        ) {
          if (chain == transfer.chain) friday++
        }
      }
      if (currentDayOfWeek == 6) {
        //SATURDAY
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(7, 'days').unix() &&
          Number(transfer.timestamp) <=
            moment().utc(true).startOf('day').subtract(6, 'days').unix()
        ) {
          if (chain == transfer.chain) sunday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(6, 'days').unix() &&
          Number(transfer.timestamp) <=
            moment().utc(true).startOf('day').subtract(5, 'days').unix()
        ) {
          if (chain == transfer.chain) monday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(5, 'days').unix() &&
          Number(transfer.timestamp) <=
            moment().utc(true).startOf('day').subtract(4, 'days').unix()
        ) {
          if (chain == transfer.chain) tuesday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(4, 'days').unix() &&
          Number(transfer.timestamp) <=
            moment().utc(true).startOf('day').subtract(3, 'days').unix()
        ) {
          if (chain == transfer.chain) wednesday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(3, 'days').unix() &&
          Number(transfer.timestamp) <=
            moment().utc(true).startOf('day').subtract(2, 'days').unix()
        ) {
          if (chain == transfer.chain) thursday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').subtract(2, 'days').unix() &&
          Number(transfer.timestamp) <= moment().utc(true).startOf('day').unix()
        ) {
          if (chain == transfer.chain) friday++
        }
        if (
          Number(transfer.timestamp) >=
            moment().utc(true).startOf('day').unix() &&
          Number(transfer.timestamp) <= Math.floor(new Date())
        ) {
          if (chain == transfer.chain) saturday++
        }
      }
    })

    return {
      sunday: sunday,
      monday: monday,
      tuesday: tuesday,
      wednesday: wednesday,
      thursday: thursday,
      friday: friday,
      saturday: saturday,
    }
  }

  getMonthRevenueAmount(data, chain) {
    const tokenKeys = Object.keys(
      config[
        chain == 'binance'
          ? Network.BINANCE
          : chain == 'arbitrum'
          ? Network.ARBITRUM
          : Network.POLYGON
      ].tokens,
    )
    let january = 0
    let february = 0
    let march = 0
    let april = 0
    let may = 0
    let june = 0
    let july = 0
    let august = 0
    let september = 0
    let october = 0
    let november = 0
    let december = 0

    let januaryList = {}
    let februaryList = {}
    let marchList = {}
    let aprilList = {}
    let mayList = {}
    let juneList = {}
    let julyList = {}
    let augustList = {}
    let septemberList = {}
    let octoberList = {}
    let novemberList = {}
    let decemberList = {}

    data?.map((transfer) => {
      if (chain == transfer.chain) {
        if (!januaryList[transfer.token])
          januaryList[transfer.token] = new Number(0)
        if (!februaryList[transfer.token])
          februaryList[transfer.token] = new Number(0)
        if (!marchList[transfer.token])
          marchList[transfer.token] = new Number(0)
        if (!aprilList[transfer.token])
          aprilList[transfer.token] = new Number(0)
        if (!mayList[transfer.token]) mayList[transfer.token] = new Number(0)
        if (!juneList[transfer.token]) juneList[transfer.token] = new Number(0)
        if (!julyList[transfer.token]) julyList[transfer.token] = new Number(0)
        if (!augustList[transfer.token])
          augustList[transfer.token] = new Number(0)
        if (!septemberList[transfer.token])
          septemberList[transfer.token] = new Number(0)
        if (!octoberList[transfer.token])
          octoberList[transfer.token] = new Number(0)
        if (!novemberList[transfer.token])
          novemberList[transfer.token] = new Number(0)
        if (!decemberList[transfer.token])
          decemberList[transfer.token] = new Number(0)

        if (new Date(transfer.timestamp * 1000).getMonth() == 0) {
          const num1 = Number(transfer.revenueUsd)
          const num2 = Number(januaryList[transfer.token])
          const final = num1 + num2
          januaryList[transfer.token] = final
        }

        if (new Date(transfer.timestamp * 1000).getMonth() == 1) {
          //FEBRUARY
          const num1 = Number(transfer.revenueUsd)
          const num2 = Number(februaryList[transfer.token])
          const final = num1 + num2
          februaryList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 2) {
          //MARCH
          const num1 = Number(transfer.revenueUsd)
          const num2 = Number(marchList[transfer.token])
          const final = num1 + num2
          marchList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 3) {
          //APRIL
          const num1 = Number(transfer.revenueUsd)
          const num2 = Number(aprilList[transfer.token])
          const final = num1 + num2
          aprilList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 4) {
          //MAY
          const num1 = Number(transfer.revenueUsd)
          const num2 = Number(mayList[transfer.token])
          const final = num1 + num2
          mayList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 5) {
          //JUNE
          const num1 = Number(transfer.revenueUsd)
          const num2 = Number(juneList[transfer.token])
          const final = num1 + num2
          juneList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 6) {
          //JULY
          const num1 = Number(transfer.revenueUsd)
          const num2 = Number(julyList[transfer.token])
          const final = num1 + num2
          julyList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 7) {
          //AUGUST
          const num1 = Number(transfer.revenueUsd)
          const num2 = Number(augustList[transfer.token])
          const final = num1 + num2
          augustList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 8) {
          //SEPTEMBER
          const num1 = Number(transfer.revenueUsd)
          const num2 = Number(septemberList[transfer.token])
          const final = num1 + num2
          septemberList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 9) {
          //OCTOBER
          const num1 = Number(transfer.revenueUsd)
          const num2 = Number(octoberList[transfer.token])
          const final = num1 + num2
          octoberList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 10) {
          //NOVEMBER
          const num1 = Number(transfer.revenueUsd)
          const num2 = Number(novemberList[transfer.token])
          const final = num1 + num2
          novemberList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 11) {
          //DECEMBER
          const num1 = Number(transfer.revenueUsd)
          const num2 = Number(decemberList[transfer.token])
          const final = num1 + num2
          decemberList[transfer.token] = final
        }
      }
    })

    Object.keys(januaryList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]
        const decimal = token.decimals

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          january += januaryList[tokenAddress]
        }
      }
    })
    Object.keys(februaryList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]
        const decimal = token.decimals

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          february += februaryList[tokenAddress]
        }
      }
    })

    Object.keys(mayList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]
        const decimal = token.decimals

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          may += mayList[tokenAddress]
        }
      }
    })

    Object.keys(aprilList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]
        const decimal = token.decimals

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          april += aprilList[tokenAddress]
        }
      }
    })

    Object.keys(marchList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          march += marchList[tokenAddress]
        }
      }
    })

    Object.keys(juneList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          june += juneList[tokenAddress]
        }
      }
    })

    Object.keys(julyList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]
        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          july += julyList[tokenAddress]
        }
      }
    })

    Object.keys(augustList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          august += augustList[tokenAddress]
        }
      }
    })

    Object.keys(septemberList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          september += septemberList[tokenAddress]
        }
      }
    })
    Object.keys(octoberList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]
        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          october += octoberList[tokenAddress]
        }
      }
    })

    Object.keys(novemberList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          november += novemberList[tokenAddress]
        }
      }
    })

    Object.keys(decemberList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          december += decemberList[tokenAddress]
        }
      }
    })

    return {
      january: january.toFixed(0),
      february: february.toFixed(0),
      march: march.toFixed(0),
      april: april.toFixed(0),
      may: may.toFixed(0),
      june: june.toFixed(0),
      july: july.toFixed(0),
      august: august.toFixed(0),
      september: september.toFixed(0),
      october: october.toFixed(0),
      november: november.toFixed(0),
      december: december.toFixed(0),
    }
  }

  async getTokenInfo(tokenAddress, data, chain, pricesChange = null) {
    let price = 0
    let priceChange = 0
    let volume24 = 0
    let sum = {}
    const tokenKeys = Object.keys(
      config[
        chain == 'binance'
          ? Network.BINANCE
          : chain == 'arbitrum'
          ? Network.ARBITRUM
          : Network.POLYGON
      ].tokens,
    )
    data?.map((transfer) => {
      if (!sum[tokenAddress]) sum[tokenAddress] = new Number(0)
      if (
        Number(transfer.timestamp) >=
        Number(Math.floor(new Date() / 1000 - 24 * 3600))
      ) {
        if (tokenAddress.toLowerCase() == transfer.token.toLowerCase()) {
          const num1 = parseFloat(transfer.volumeUsd)
          const num2 = parseFloat(sum[tokenAddress])
          const final = num1 + num2
          if (isNaN(final)) {
            final = 0
          }
          sum[tokenAddress] = final
        }
      }
    })

    let tokenSymbol
    for (const key of tokenKeys) {
      const token =
        config[
          chain == 'binance'
            ? Network.BINANCE
            : chain == 'arbitrum'
            ? Network.ARBITRUM
            : Network.POLYGON
        ].tokens[key]
      if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
        tokenSymbol = token.symbol
        try {
          if (!pricesChange || !pricesChange.RAW[token.symbol]) {
            price = await useTokenPrice(token.apiId, 'USD')
          } else {
            price = pricesChange.RAW[token.symbol].USD.PRICE
          }

          if (!pricesChange || !pricesChange.RAW[token.symbol]) {
            priceChange = await useTokenPriceChange(token.apiId)
          } else {
            priceChange = pricesChange.RAW[token.symbol].USD.CHANGEPCT24HOUR
          }
          if (sum[tokenAddress])
            volume24 = Number(volume24) + Number(sum[tokenAddress])
        } catch (e) {
          console.log(e)
        }
      }
    }

    return {
      price: price,
      priceChange: parseFloat(priceChange).toFixed(2),
      volume24: parseFloat(volume24).toFixed(2),
      address: tokenAddress,
      symbol: tokenSymbol,
    }
  }

  formatTrackPair(pair, tokens_data) {
    let splited = pair.split('-')
    let token0 = tokens_data.find((t) => t.id == splited[0]).symbol
    let token1 = tokens_data.find((t) => t.id == splited[1]).symbol
    return `${token0}/${token1}`
  }

  processChainData(chainData, chain, tokens_data) {
    const listData = []

    for (const transfer of chainData) {
      const tokenKeys = Object.keys(config[chain].tokens)
      for (const key of tokenKeys) {
        const token = config[chain].tokens[key]
        if (token.address.toLowerCase() === transfer.token.toLowerCase()) {
          let tokenPrice = transfer.profitUsd / transfer.profit
          const date = {
            date: moment.unix(transfer.timestamp).utc(true).toLocaleString(),
            transactionHash: transfer.hash,
            valueIn: Number(transfer.amountIn),
            valueInUsd:
              Number(transfer.amountInUsd) || transfer.amountIn * tokenPrice,
            valueOut: Number(transfer.amountOut),
            valueOutUsd:
              Number(transfer.amountOutUsd) || transfer.amountOut * tokenPrice,
            token: token.symbol,
            buypath:
              transfer.sellPath == '' ? '1Inch Fusion' : transfer.sellPath,
            volumeNative: transfer.volume,
            volumeUsd: transfer.volumeUsd,
            chain: transfer.chain,
            selector:
              transfer.selector ==
              '0x00000000000000000000000082a8d8b59a13ed9df879c1f450a379182661ab59'
                ? 1
                : 0,
            strategie: transfer.functionName,
            sellpath: transfer.buyPath == '' ? 'Darkpools' : transfer.buyPath,
            profit: transfer.profitUsd,
            profitInToken: transfer.profit,
            gasFee: transfer.gasFee,
            gasFeeUsd: transfer.gasFeeUsd,
            trackPair:
              tokens_data.length > 0
                ? transfer.swaps[0].trackPair
                    .map((pair) => this.formatTrackPair(pair, tokens_data))
                    .join(',')
                : '-',
            deviation: this.getDeviation(transfer.amountIn, transfer.amountOut),
          }
          listData.push(date)
        }
      }
    }
    return listData
  }

  getDeviation(amountIn, amountOut) {
    let deviation = amountOut - amountIn
    return (deviation / amountIn) * 100
  }

  getTxsInfo(data, period, tokens_data) {
    const bscData = data.filter(
      (transfer) => transfer && transfer.chain === 'binance',
    )
    const arbitrumData = data.filter(
      (transfer) => transfer && transfer.chain === 'arbitrum',
    )
    const polygonData = data.filter(
      (transfer) => transfer && transfer.chain === 'polygon',
    )

    const [bscResults, arbitrumResults, polygonResults] = [
      this.processChainData(bscData, Network.BINANCE, tokens_data),
      this.processChainData(arbitrumData, Network.ARBITRUM, tokens_data),
      this.processChainData(polygonData, Network.POLYGON, tokens_data),
    ]

    const combinedResults = [
      ...bscResults,
      ...arbitrumResults,
      ...polygonResults,
    ]
    combinedResults.reverse()

    return combinedResults
  }

  getMonthProfitAmount(data, chain) {
    const tokenKeys = Object.keys(
      config[
        chain == 'binance'
          ? Network.BINANCE
          : chain == 'arbitrum'
          ? Network.ARBITRUM
          : Network.POLYGON
      ].tokens,
    )
    let january = 0
    let february = 0
    let march = 0
    let april = 0
    let may = 0
    let june = 0
    let july = 0
    let august = 0
    let september = 0
    let october = 0
    let november = 0
    let december = 0

    let januaryList = {}
    let februaryList = {}
    let marchList = {}
    let aprilList = {}
    let mayList = {}
    let juneList = {}
    let julyList = {}
    let augustList = {}
    let septemberList = {}
    let octoberList = {}
    let novemberList = {}
    let decemberList = {}

    data?.map((transfer) => {
      if (chain == transfer.chain) {
        if (!januaryList[transfer.token])
          januaryList[transfer.token] = new Number(0)
        if (!februaryList[transfer.token])
          februaryList[transfer.token] = new Number(0)
        if (!marchList[transfer.token])
          marchList[transfer.token] = new Number(0)
        if (!aprilList[transfer.token])
          aprilList[transfer.token] = new Number(0)
        if (!mayList[transfer.token]) mayList[transfer.token] = new Number(0)
        if (!juneList[transfer.token]) juneList[transfer.token] = new Number(0)
        if (!julyList[transfer.token]) julyList[transfer.token] = new Number(0)
        if (!augustList[transfer.token])
          augustList[transfer.token] = new Number(0)
        if (!septemberList[transfer.token])
          septemberList[transfer.token] = new Number(0)
        if (!octoberList[transfer.token])
          octoberList[transfer.token] = new Number(0)
        if (!novemberList[transfer.token])
          novemberList[transfer.token] = new Number(0)
        if (!decemberList[transfer.token])
          decemberList[transfer.token] = new Number(0)

        if (new Date(transfer.timestamp * 1000).getMonth() == 0) {
          const num1 = Number(transfer.profitUsd)
          const num2 = Number(februaryList[transfer.token])
          const final = num1 + num2
          februaryList[transfer.token] = final
        }

        if (new Date(transfer.timestamp * 1000).getMonth() == 1) {
          //FEBRUARY
          const num1 = Number(transfer.profitUsd)
          const num2 = Number(februaryList[transfer.token])
          const final = num1 + num2
          februaryList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 2) {
          //MARCH
          const num1 = Number(transfer.profitUsd)
          const num2 = Number(marchList[transfer.token])
          const final = num1 + num2
          marchList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 3) {
          //APRIL
          const num1 = Number(transfer.profitUsd)
          const num2 = Number(aprilList[transfer.token])
          const final = num1 + num2
          aprilList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 4) {
          //MAY
          const num1 = Number(transfer.profitUsd)
          const num2 = Number(mayList[transfer.token])
          const final = num1 + num2
          mayList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 5) {
          //JUNE
          const num1 = Number(transfer.profitUsd)
          const num2 = Number(juneList[transfer.token])
          const final = num1 + num2
          juneList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 6) {
          //JULY
          const num1 = Number(transfer.profitUsd)
          const num2 = Number(julyList[transfer.token])
          const final = num1 + num2
          julyList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 7) {
          //AUGUST
          const num1 = Number(transfer.profitUsd)
          const num2 = Number(augustList[transfer.token])
          const final = num1 + num2
          augustList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 8) {
          //SEPTEMBER
          const num1 = Number(transfer.profitUsd)
          const num2 = Number(septemberList[transfer.token])
          const final = num1 + num2
          septemberList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 9) {
          //OCTOBER
          const num1 = Number(transfer.profitUsd)
          const num2 = Number(octoberList[transfer.token])
          const final = num1 + num2
          octoberList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 10) {
          //NOVEMBER
          const num1 = Number(transfer.profitUsd)
          const num2 = Number(novemberList[transfer.token])
          const final = num1 + num2
          novemberList[transfer.token] = final
        }
        if (new Date(transfer.timestamp * 1000).getMonth() == 11) {
          //DECEMBER
          const num1 = Number(transfer.profitUsd)
          const num2 = Number(decemberList[transfer.token])
          const final = num1 + num2
          decemberList[transfer.token] = final
        }
      }
    })

    Object.keys(januaryList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          january += januaryList[tokenAddress]
        }
      }
    })
    Object.keys(februaryList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          february += februaryList[tokenAddress]
        }
      }
    })

    Object.keys(mayList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          may += mayList[tokenAddress]
        }
      }
    })
    Object.keys(aprilList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          april += aprilList[tokenAddress]
        }
      }
    })

    Object.keys(marchList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          march += marchList[tokenAddress]
        }
      }
    })

    Object.keys(juneList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          june += juneList[tokenAddress]
        }
      }
    })

    Object.keys(julyList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          july += julyList[tokenAddress]
        }
      }
    })

    Object.keys(augustList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          august += augustList[tokenAddress]
        }
      }
    })

    Object.keys(septemberList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          september += septemberList[tokenAddress]
        }
      }
    })
    Object.keys(octoberList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          october += octoberList[tokenAddress]
        }
      }
    })

    Object.keys(novemberList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          november += novemberList[tokenAddress]
        }
      }
    })

    Object.keys(decemberList).map(async (tokenAddress) => {
      for (const key of tokenKeys) {
        const token =
          config[
            chain == 'binance'
              ? Network.BINANCE
              : chain == 'arbitrum'
              ? Network.ARBITRUM
              : Network.POLYGON
          ].tokens[key]

        if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
          december += decemberList[tokenAddress]
        }
      }
    })

    return {
      january: january.toFixed(0),
      february: february.toFixed(0),
      march: march.toFixed(0),
      april: april.toFixed(0),
      may: may.toFixed(0),
      june: june.toFixed(0),
      july: july.toFixed(0),
      august: august.toFixed(0),
      september: september.toFixed(0),
      october: october.toFixed(0),
      november: november.toFixed(0),
      december: december.toFixed(0),
    }
  }
}
