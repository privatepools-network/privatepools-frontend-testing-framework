import { ethers } from 'ethers'
import I1InchRouterAbi from '@/lib/abi/I1InchRouter.json'
import ZapperAbi from '@/lib/abi/Zapper.json'
import ERC20Abi from '@/lib/abi/ERC20.json'
import { configService } from '@/services/config/config.service'
import { networkId } from '../../useNetwork'
import { InitializeMetamask } from '@/lib/utils/metamask'
import axios from 'axios'
import { BACKEND_URL, REDUNDANT_BACKEND_URL } from '../../pools/mappings'
import * as SDK from '@georgeroman/balancer-v2-pools'
import { bnum } from '@/lib/utils'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'
import { default as weightedPoolAbi } from '@/lib/abi/WeightedPool.json'
import { default as vaultAbi } from '@/lib/abi/VaultAbi.json'
import BigNumber from 'bignumber.js'

export const LPT_SLIPPAGE = 5
const ONE_INCH_SLIPPAGE = 0.1

export function denormAmounts(amounts, decimals) {
  return amounts.map((a, i) =>
    ethers.utils.parseUnits(parseFloat(a).toFixed(decimals[i]), decimals[i]),
  )
}

export function roundDown(number, decimals) {
  decimals = decimals || 0
  return (
    Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
  ).toString()
}
export async function useZapper(
  pool,
  srcToken,
  srcAmount,
  tokenAmounts,
  oneInchDatas,
  oneInchDescs,
  rawAmount = false,
  ConfirmZapToastPending,
  aggregatorName = '1inch',
) {
  if (aggregatorName == '1inch') {
    return await zap1inch(
      pool,
      srcToken,
      srcAmount,
      tokenAmounts,
      oneInchDatas,
      oneInchDescs,
      rawAmount,
      ConfirmZapToastPending,
      aggregatorName,
    )
  }
  return await zap0x(
    pool,
    srcToken,
    srcAmount,
    tokenAmounts,
    oneInchDatas,
    oneInchDescs,
    rawAmount,
    ConfirmZapToastPending,
    aggregatorName,
  )
}

async function zap1inch(
  pool,
  srcToken,
  srcAmount,
  tokenAmounts,
  oneInchDatas,
  oneInchDescs,
  rawAmount = false,
  ConfirmZapToastPending,
) {
  try {
    const provider = await InitializeMetamask()
    if (!provider) return
    const signer = provider.getSigner()
    const config = configService.getNetworkConfig(networkId.value)
    const tokenContract = new ethers.Contract(srcToken, ERC20Abi, signer)
    const poolContract = new ethers.Contract(
      pool.address,
      weightedPoolAbi,
      provider,
    )
    const vault = new ethers.Contract(
      config.addresses.vault,
      vaultAbi,
      provider,
    )
    const [poolId, totalSupply, decimals] = await Promise.all([
      poolContract.getPoolId(),
      poolContract.totalSupply(),
      tokenContract.decimals(),
    ])
    const [, balances] = await vault.getPoolTokens(poolId)
    const zapper = new ethers.Contract(
      config.addresses.zapper,
      ZapperAbi,
      signer,
    )

    const decimalsAmount = rawAmount
      ? srcAmount
      : ethers.utils.parseUnits(
          roundDown(parseFloat(srcAmount).toFixed(decimals), decimals),
          decimals,
        )
    const weights = pool.tokens
      .map((t) => t.weight)
      .map((w) => bnum(ethers.utils.parseUnits(w.toString(), 18).toString()))

    const _denormAmounts = denormAmounts(
      tokenAmounts,
      pool.tokens.map((t) => t.decimals),
    )
    const amounts = _denormAmounts?.map((a) => bnum(a.toString()))
    const swapFee = bnum(ethers.utils.parseUnits('0', 18).toString())
    let minimumLPT = SDK.WeightedMath._calcBptOutGivenExactTokensIn(
      balances.map((item) => new BigNumber(item.toString())),
      weights,
      amounts,
      new BigNumber(totalSupply.toString()),
      swapFee,
    )
    const bn_minimumLpt = ethers.BigNumber.from(minimumLPT.toFixed(0))
    minimumLPT = bn_minimumLpt.sub(bn_minimumLpt.mul(LPT_SLIPPAGE).div(100)) // 500 = 100%, percent = 5

    const tx = await zapper.zap1inch(
      decimalsAmount,
      srcToken,
      pool.address,
      pool.tokens.map((t) => t.address),
      oneInchDescs,
      oneInchDatas,
      minimumLPT.toString(),
    )

    return tx
  } catch (error) {
    toast.update(ConfirmZapToastPending, {
      render: Toast,
      data: {
        header_text: 'Confirm rejected',
        toast_text: `You rejected confirm`,
        tx_link: '',
        speedUp: '',
      },
      autoClose: 7000,
      closeOnClick: false,
      closeButton: true,
      type: 'error',
      isLoading: false,
    })
    console.log('Error sending tx - ', error)
    if (!error.error && error.message) {
      return { error: { data: { message: error.message } } }
    }
    return error
  }
}
async function zap0x(
  pool,
  srcToken,
  srcAmount,
  tokenAmounts,
  datas,
  descs,
  rawAmount = false,
  ConfirmZapToastPending,
) {
  try {
    const provider = await InitializeMetamask()
    if (!provider) return
    const signer = provider.getSigner()
    const config = configService.getNetworkConfig(networkId.value)
    const tokenContract = new ethers.Contract(srcToken, ERC20Abi, signer)
    const poolContract = new ethers.Contract(
      pool.address,
      weightedPoolAbi,
      provider,
    )
    const vault = new ethers.Contract(
      config.addresses.vault,
      vaultAbi,
      provider,
    )
    const [poolId, totalSupply, decimals] = await Promise.all([
      poolContract.getPoolId(),
      poolContract.totalSupply(),
      tokenContract.decimals(),
    ])
    const [, balances] = await vault.getPoolTokens(poolId)
    const zapper = new ethers.Contract(
      config.addresses.zapper,
      ZapperAbi,
      signer,
    )

    const decimalsAmount = rawAmount
      ? srcAmount
      : ethers.utils.parseUnits(
          roundDown(parseFloat(srcAmount).toFixed(decimals), decimals),
          decimals,
        )
    const weights = pool.tokens
      .map((t) => t.weight)
      .map((w) => bnum(ethers.utils.parseUnits(w.toString(), 18).toString()))
    const _denormAmounts = denormAmounts(
      tokenAmounts,
      pool.tokens.map((t) => t.decimals),
    )
    const amounts = _denormAmounts?.map((a) => bnum(a.toString()))
    const swapFee = bnum(ethers.utils.parseUnits('0', 18).toString())
    let minimumLPT = SDK.WeightedMath._calcBptOutGivenExactTokensIn(
      balances.map((item) => new BigNumber(item.toString())),
      weights,
      amounts,
      new BigNumber(totalSupply.toString()),
      swapFee,
    )
    const bn_minimumLpt = ethers.BigNumber.from(minimumLPT.toFixed(0))
    minimumLPT = bn_minimumLpt.sub(bn_minimumLpt.mul(LPT_SLIPPAGE).div(100)) // 500 = 100%, percent = 5

    const tx = await zapper.zap0x(
      decimalsAmount,
      srcToken,
      pool.address,
      pool.tokens.map((t) => t.address),
      descs.map((item) => item.dstReceiver),
      datas,
      minimumLPT.toString(),
    )

    return tx
  } catch (error) {
    toast.update(ConfirmZapToastPending, {
      render: Toast,
      data: {
        header_text: 'Confirm rejected',
        toast_text: `You rejected confirm`,
        tx_link: '',
        speedUp: '',
      },
      autoClose: 7000,
      closeOnClick: false,
      closeButton: true,
      type: 'error',
      isLoading: false,
    })
    console.log('Error sending tx - ', error)
    if (!error.error && error.message) {
      return { error: { data: { message: error.message } } }
    }
    return error
  }
}

export async function useTrades(
  pool,
  srcToken,
  srcAmount,
  slippage = 2,
  rawAmount = false,
) {
  let aggregator = '1inch'
  let trades = await fetch1InchTrades(
    pool,
    srcToken,
    srcAmount,
    slippage,
    rawAmount,
  )
  if (!trades) {
    aggregator = '0x'
    trades = await fetch0xTrades(pool, srcToken, srcAmount, slippage, rawAmount)
  }
  return { ...trades, aggregator }
}

async function fetch1InchTrades(
  pool,
  srcToken,
  srcAmount,
  slippage = 2,
  rawAmount = false,
) {
  try {
    const provider = await InitializeMetamask()
    if (!provider) return
    const signer = provider.getSigner()
    const config = configService.getNetworkConfig(networkId.value)
    const zapper = new ethers.Contract(
      config.addresses.zapper,
      ZapperAbi,
      signer,
    )
    const tokenContract = new ethers.Contract(srcToken, ERC20Abi, signer)
    const [decimals, _fee] = await Promise.all([
      tokenContract.decimals(),
      zapper.fee(),
    ])
    const fee = (srcAmount * _fee) / 1_000_000
    srcAmount -= fee

    const decimalsAmount = rawAmount
      ? srcAmount
      : ethers.utils.parseUnits(
          roundDown(parseFloat(srcAmount).toFixed(decimals), decimals),
          decimals,
        )

    const datas = []
    const descs = []
    const toAmounts = []
    const fromAmounts = []
    const amounts = []

    const i1InchRouter = new ethers.utils.Interface(I1InchRouterAbi)
    let containsSrcToken = false
    let spent = ethers.BigNumber.from(0)
    for (let i = 0; i < pool.tokens.length; i++) {
      const amount = pool.tokens[i].weight * decimalsAmount
      if (pool.tokens[i].address !== srcToken) {
        fromAmounts.push(
          ethers.utils.formatUnits(
            decimalsAmount
              .div(100)
              .mul(
                ethers.BigNumber.from((pool.tokens[i].weight * 100).toFixed(0)),
              ),
            decimals,
          ),
        )

        const { data, toAmount } = await fetch1InchData(
          srcToken,
          pool.tokens[i].address,
          amount.toString(),
          config.addresses.zapper,
          slippage,
        )

        const decodedDatas = i1InchRouter.decodeFunctionData('swap', data)
        datas.push(decodedDatas[3])

        datas.push({
          srcToken,
          dstToken: pool.tokens[i].address,
          srcReceiver: decodedDatas[1][2],
          dstReceiver: config.addresses.zapper,
          amount: decodedDatas[1][4].toString(),
          minReturnAmount: decodedDatas[1][5].toString(),
          flags: decodedDatas[1][6].toString(),
        })
        spent = spent.add(decodedDatas[1][4].toString())
        toAmounts.push(
          ethers.utils.formatUnits(toAmount, pool.tokens[i].decimals),
        )
        amounts.push(toAmounts[toAmounts.length - 1])

        if (i < pool.tokens.length - 1) await sleep(500)
      } else {
        containsSrcToken = true
        descs.push({
          srcToken,
          dstToken: srcToken,
          srcReceiver: ethers.constants.AddressZero,
          dstReceiver: ethers.constants.AddressZero,
          amount: '0',
          minReturnAmount: '0',
          flags: 4,
        })
        datas.push('0x')
        fromAmounts.push('0')
        // toAmounts.push('0')
        amounts.push('0')
      }
    }
    if (containsSrcToken) {
      const index = descs.findIndex((item) => item.dstToken == srcToken)
      const remainingAmount = ethers.BigNumber.from(decimalsAmount).sub(
        ethers.BigNumber.from(spent),
      )
      descs[index].amount = remainingAmount
      descs[index].minReturnAmount = remainingAmount
      fromAmounts[index] = ethers.utils.formatUnits(
        remainingAmount,
        pool.tokens[index].decimals,
      )
      // toAmounts[index] = ethers.utils.formatUnits(
      //   remainingAmount,
      //   pool.tokens[index].decimals,
      // )
      amounts[index] = ethers.utils.formatUnits(
        remainingAmount,
        pool.tokens[index].decimals,
      )
    }
    return { datas, descs, fromAmounts, toAmounts, amounts }
  } catch (error) {
    console.log('Error 1inch useTrades - ', error)
    return null
  }
}
async function fetch0xTrades(
  pool,
  srcToken,
  srcAmount,
  slippage = 2,
  rawAmount = false,
) {
  try {
    const provider = await InitializeMetamask()
    if (!provider) return
    const signer = provider.getSigner()
    const config = configService.getNetworkConfig(networkId.value)
    const zapper = new ethers.Contract(
      config.addresses.zapper,
      ZapperAbi,
      signer,
    )
    const tokenContract = new ethers.Contract(srcToken, ERC20Abi, signer)
    const [_fee, decimals] = await Promise.all([
      zapper.fee(),
      tokenContract.decimals(),
    ])
    const fee = (srcAmount * _fee) / 1_000_000
    srcAmount -= fee

    const decimalsAmount = rawAmount
      ? srcAmount
      : ethers.utils.parseUnits(
          roundDown(parseFloat(srcAmount).toFixed(decimals), decimals),
          decimals,
        )

    const datas = []
    const descs = []
    const toAmounts = []
    const fromAmounts = []
    const amounts = []

    let containsSrcToken = false
    let spent = ethers.BigNumber.from(0)
    for (let i = 0; i < pool.tokens.length; i++) {
      const amount = pool.tokens[i].weight * decimalsAmount
      if (pool.tokens[i].address !== srcToken) {
        fromAmounts.push(
          ethers.utils.formatUnits(
            decimalsAmount
              .div(100)
              .mul(
                ethers.BigNumber.from((pool.tokens[i].weight * 100).toFixed(0)),
              ),
            decimals,
          ),
        )

        const data = await fetch0xData(
          srcToken,
          pool.tokens[i].address,
          amount.toString(),
          config.addresses.zapper,
          slippage * 100,
        )

        datas.push(data.transaction.data)

        descs.push({
          srcToken,
          dstToken: pool.tokens[i].address,
          srcReceiver: '',
          dstReceiver: data.transaction.to,
          amount: data.sellAmount,
          minReturnAmount: data.minBuyAmount,
        })
        spent = spent.add(data.sellAmount)
        toAmounts.push(
          ethers.utils.formatUnits(data.minBuyAmount, pool.tokens[i].decimals),
        )
        amounts.push(toAmounts[toAmounts.length - 1])
      } else {
        containsSrcToken = true
        descs.push({
          srcToken,
          dstToken: srcToken,
          srcReceiver: ethers.constants.AddressZero,
          dstReceiver: ethers.constants.AddressZero,
          amount: '0',
          minReturnAmount: '0',
          flags: 4,
        })
        datas.push('0x')
        fromAmounts.push('0')
        // toAmounts.push('0')
        amounts.push('0')
      }
    }
    if (containsSrcToken) {
      const index = descs.findIndex((item) => item.dstToken == srcToken)
      const remainingAmount = ethers.BigNumber.from(decimalsAmount).sub(
        ethers.BigNumber.from(spent),
      )
      descs[index].amount = remainingAmount
      descs[index].minReturnAmount = remainingAmount
      fromAmounts[index] = ethers.utils.formatUnits(
        remainingAmount,
        pool.tokens[index].decimals,
      )
      // toAmounts[index] = ethers.utils.formatUnits(
      //   remainingAmount,
      //   pool.tokens[index].decimals,
      // )
      amounts[index] = ethers.utils.formatUnits(
        remainingAmount,
        pool.tokens[index].decimals,
      )
    }
    return { datas, descs, fromAmounts, toAmounts, amounts }
  } catch (error) {
    console.log('Error 0x useTrades - ', error)
    return null
  }
}

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const fetch1InchData = async (
  srcToken,
  dstToken,
  amount,
  from,
  slippage = 1,
) => {
  const params = {
    src: srcToken,
    dst: dstToken,
    amount,
    from,
    slippage,
    disableEstimate: true,
    compatibility: true,
  }
  let data = null
  const baseUrl = `${BACKEND_URL[networkId.value]}`
  data = (
    await axios.get(`${baseUrl}/1inch-swap`, {
      params,
    })
  ).data
  // const baseUrl = `${REDUNDANT_BACKEND_URL[networkId.value]}`
  // data = (
  //   await axios.get(`${baseUrl}/1inch-swap`, {
  //     params,
  //   })
  // ).data

  return { data: data.tx.data, toAmount: data.toAmount }
}
export const fetch0xData = async (
  srcToken,
  dstToken,
  amount,
  from,
  slippage = 100,
) => {
  try {
    const params = {
      chainId: 56,
      sellToken: srcToken,
      buyToken: dstToken,
      sellAmount: amount,
      taker: from,
      slippage,
    }
    let data = null
    try {
      const baseUrl = `${BACKEND_URL[networkId.value]}`
      data = (
        await axios.get(`${baseUrl}/0x-swap`, {
          params,
        })
      ).data
    } catch (e) {
      const baseUrl = `${REDUNDANT_BACKEND_URL[networkId.value]}`
      data = (
        await axios.get(`${baseUrl}/0x-swap`, {
          params,
        })
      ).data
    }

    return data
  } catch (error) {
    throw new Error(error.response.data)
  }
}
