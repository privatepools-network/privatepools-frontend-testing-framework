import { ethers } from 'ethers'
import I1InchRouterAbi from '@/lib/abi/I1InchRouter.json'
import ZapperAbi from '@/lib/abi/Zapper.json'
import ERC20Abi from '@/lib/abi/ERC20.json'
import { configService } from '@/services/config/config.service'
import { networkId } from '../../useNetwork'
import { InitializeMetamask } from '@/lib/utils/metamask'
import axios from 'axios'
import { BACKEND_URL } from '../../pools/mappings'

export async function useZapper(
  pool,
  srcToken,
  srcAmount,
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

    console.log({
      decimalsAmount,
      srcToken,
      address: pool.address,
      tokens: pool.tokens.map((t) => t.address),
      oneInchDescs,
      oneInchDatas,
    })

    const tx = await zapper.zap(
      decimalsAmount,
      srcToken,
      pool.address,
      pool.tokens.map((t) => t.address),
      oneInchDescs,
      oneInchDatas,
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

    const tokenContract = new ethers.Contract(srcToken, ERC20Abi, signer)
    const decimals = await tokenContract.decimals()
    const decimalsAmount =  rawAmount ? srcAmount :ethers.utils.parseUnits(
      srcAmount.toString(),
      decimals,
    )

    const oneInchDatas = []
    const oneInchDescs = []
    const toAmounts = []
    const fromAmounts = []

    const i1InchRouter = new ethers.utils.Interface(I1InchRouterAbi)
    for (let i = 0; i < pool.tokens.length; i++) {
      if (pool.tokens[i].address !== srcToken) {
        const amount = pool.tokens[i].weight * decimalsAmount
        fromAmounts.push(pool.tokens[i].weight * srcAmount)

        const oneInchTxData = await fetch1InchData(
          srcToken,
          pool.tokens[i].address,
          amount.toString(),
          config.addresses.zapper,
          slippage,
        )
        const decodedDatas = i1InchRouter.decodeFunctionData(
          'swap',
          oneInchTxData.data,
        )
        oneInchDatas.push(decodedDatas[3])

        oneInchDescs.push({
          srcToken,
          dstToken: pool.tokens[i].address,
          srcReceiver: config.addresses.oneInchExecutor,
          dstReceiver: config.addresses.zapper,
          amount: amount.toString(),
          minReturnAmount: 1,
          flags: 0,
        })
        toAmounts.push(
          ethers.utils.formatUnits(
            oneInchTxData.toAmount,
            pool.tokens[i].decimals,
          ),
        )

        if (i < pool.tokens.length - 1) await sleep(1000)
      }
    }

    return { oneInchDatas, oneInchDescs, fromAmounts, toAmounts }
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
