import { ethers } from 'ethers'
import I1InchRouterAbi from '@/lib/abi/I1InchRouter.json'
import ZapperAbi from '@/lib/abi/Zapper.json'
import ERC20Abi from '@/lib/abi/ERC20.json'
import { configService } from '@/services/config/config.service'
import { networkId } from '../../useNetwork'
import { InitializeMetamask } from '@/lib/utils/metamask'
import axios from 'axios'
import { BACKEND_URL } from '../../pools/mappings'
import * as SDK from '@georgeroman/balancer-v2-pools'
import { bnum } from '@/lib/utils'

const LPT_SLIPPAGE = 0.02
const ONE_INCH_SLIPPAGE = 0.1

export async function useZapper(
  pool,
  srcToken,
  srcAmount,
  amounts,
  oneInchDatas,
  oneInchDescs,
  rawAmount = false,
) {
  try {
    const provider = await InitializeMetamask()
    if (!provider) return
    const signer = provider.getSigner()
    const config = configService.getNetworkConfig(networkId.value)
    const tokenContract = new ethers.Contract(srcToken, ERC20Abi, signer)
    const zapper = new ethers.Contract(
      config.addresses.zapper,
      ZapperAbi,
      signer,
    )

    const decimals = await tokenContract.decimals()
    const decimalsAmount = rawAmount
      ? srcAmount
      : ethers.utils.parseUnits(srcAmount.toString(), decimals)

    const minimumLPT = SDK.WeightedMath._calcBptOutGivenExactTokensIn(
      pool.tokens.map((t) => t.balance),
      pool.tokens.map((t) => t.weight),
      amounts,
      bnum(pool.totalLiquidity.toString()),
      bnum(this.calc.poolSwapFee.toString()),
    )
      .times(1 - LPT_SLIPPAGE)
      .toFixed(0)

    const tx = await zapper.zap(
      decimalsAmount,
      srcToken,
      pool.address,
      pool.tokens.map((t) => t.address),
      oneInchDescs,
      oneInchDatas,
      minimumLPT,
    )

    return tx
  } catch (error) {
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
  slippage = 1,
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
    const fee =
      (srcAmount * (await zapper.fee())) / (await zapper.FEE_MULTIPLIER())
    srcAmount -= fee

    const tokenContract = new ethers.Contract(srcToken, ERC20Abi, signer)
    const decimals = await tokenContract.decimals()
    const decimalsAmount = rawAmount
      ? srcAmount
      : ethers.utils.parseUnits(srcAmount.toString(), decimals)

    const oneInchDatas = []
    const oneInchDescs = []
    const toAmounts = []
    const fromAmounts = []
    const amounts = []

    const i1InchRouter = new ethers.utils.Interface(I1InchRouterAbi)
    for (let i = 0; i < pool.tokens.length; i++) {
      const amount = pool.tokens[i].weight * decimalsAmount

      if (pool.tokens[i].address !== srcToken) {
        amounts.push
        fromAmounts.push(pool.tokens[i].weight * srcAmount)

        const { data, toAmount } = await fetch1InchData(
          srcToken,
          pool.tokens[i].address,
          amount.toString(),
          config.addresses.zapper,
          slippage,
        )

        const decodedDatas = i1InchRouter.decodeFunctionData('swap', data)
        oneInchDatas.push(decodedDatas[3])

        oneInchDescs.push({
          srcToken,
          dstToken: pool.tokens[i].address,
          srcReceiver: config.addresses.oneInchExecutor,
          dstReceiver: config.addresses.zapper,
          amount: amount.toString(),
          minReturnAmount: (toAmount * (1 - ONE_INCH_SLIPPAGE)).toFixed(0),
          flags: 0,
        })
        toAmounts.push(
          ethers.utils.formatUnits(toAmount, pool.tokens[i].decimals),
        )
        amounts.push(toAmounts[i])

        if (i < pool.tokens.length - 1) await sleep(1000)
      } else {
        amounts.push(amount)
      }
    }

    return { oneInchDatas, oneInchDescs, fromAmounts, toAmounts, amounts }
  } catch (error) {
    console.log('Error useTrades - ', error)
    return error
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
  try {
    const params = {
      src: srcToken,
      dst: dstToken,
      amount,
      from,
      slippage,
      disableEstimate: true,
      compatibility: true,
    }

    const baseUrl = `${BACKEND_URL[networkId.value]}`

    const { data } = await axios.get(`${baseUrl}/1inch-swap`, {
      params,
    })

    return { data: data.tx.data, toAmount: data.toAmount }
  } catch (error) {
    throw new Error(error.response.data)
  }
}
