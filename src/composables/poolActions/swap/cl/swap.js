import {
  FeeAmount,
  Pool,
  computePoolAddress,
  Route,
  SwapRouter,
  Trade,
} from '@uniswap/v3-sdk'
import { TradeType, Percent } from '@uniswap/sdk'
import { BigNumber, ethers } from 'ethers'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import {
  ERC20_ABI,
  POOL_FACTORY_CONTRACT_ADDRESS,
  V3_SWAP_ROUTER_ADDRESS,
} from '@/composables/concentrated-liquidity/constants'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { fromReadableAmount } from '@/composables/concentrated-liquidity/cl'
import { useUniswapTicks } from '@/composables/concentrated-liquidity/useUniswapTicks'

export async function GetCLPoolInfo(tokenIn, tokenOut, poolFee, signer) {
  // if (BigNumber.from(tokenIn.address).gt(BigNumber.from(tokenOut.address))) {
  //   const temp = { ...tokenIn }
  //   tokenIn = { ...tokenOut }
  //   tokenOut = temp
  // }
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: tokenIn,
    tokenB: tokenOut,
    fee: poolFee,
  })
  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    signer,
  )

  const [token0, token1, fee, liquidity, slot0] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ])
  const ticks = await useUniswapTicks(currentPoolAddress.toLowerCase(), 56)
  return {
    token0,
    token1,
    fee,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
    ticks,
  }
}
export async function SwapCLTokens(
  token1,
  token2,
  poolInfo,
  amount,
  signer,
  exact = 'in',
  slippage = '50',
  chainId = 56,
) {
  try {
    const { trade } = await quoteCLTrade(
      token1,
      token2,
      poolInfo,
      amount,
      exact,
    )
    const wallet = await signer.getAddress() // should be a checksummed recipient address
    const result = await getTokenTransferApproval(
      trade.swaps[0].route.input,
      amount,
      V3_SWAP_ROUTER_ADDRESS,
      signer,
    )
    if (!result) {
      return
    }
    const options = {
      slippageTolerance: new Percent(slippage, 10_000), // 50 bips, or 0.50%
      deadline: Math.floor(Date.now() / 1000) + 60 * 5, // 20 minutes from the current Unix time
      recipient: wallet,
    }
    const methodParameters = SwapRouter.swapCallParameters([trade], options)
    const tx = {
      data: methodParameters.calldata,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: methodParameters.value,
      from: wallet,
    }

    const transaction = await signer.sendTransaction(tx)
    let receipt = await transaction.wait()
    console.log(receipt)
  } catch (e) {
    console.error(e)
  }
}
export async function getTokenTransferApproval(token, tokenAmount, to, signer) {
  let address = await signer.getAddress()
  console.log(await signer.getTransactionCount())
  if (!signer || !address) {
    console.log('No Provider Found')
    return false
  }

  try {
    const tokenContract = new ethers.Contract(token.address, ERC20_ABI, signer)

    const transaction = await tokenContract.approve(
      to,
      ethers.utils.parseUnits(tokenAmount.toString(), token.decimals),
    )
    await transaction.wait()
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function quoteCL(
  token1,
  token2,
  poolInfo,
  amount,
  exact = 'in',
  slippage = '50',
) {
  const { trade } = await quoteCLTrade(token1, token2, poolInfo, amount, exact)
  return extractAmountOut(trade, slippage, exact)
}

function extractAmountOut(trade, slippage, exact = 'in') {
  const slippageTolerance = new Percent(slippage, '10000') // 50 bips, or 0.50% - Slippage tolerance
  const amountOutMin = trade.minimumAmountOut(slippageTolerance)
  return amountOutMin.toFixed()
}

async function quoteCLTrade(token1, token2, poolInfo, amount, exact = 'in') {
  const POOL_FEE = 500
  const pool = new Pool(
    exact == 'in' ? token2 : token1,
    exact == 'in' ? token1 : token2,
    POOL_FEE,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick,
    poolInfo.ticks,
  )
  const route = new Route(
    [pool],
    exact == 'in' ? token2 : token1,
    exact == 'in' ? token1 : token2,
  ) // a fully specified path from input token to output token
  let inputAmount = CurrencyAmount.fromRawAmount(
    exact == 'in' ? token2 : token1, // token1 - output, token2 - input
    ethers.utils
      .parseUnits(
        amount.toString(),
        exact == 'in' ? token2.decimals : token1.decimals,
      )
      .toString(),
  )
  const [amountOut, _] =
    poolInfo.ticks.length > 0 ? await pool.getOutputAmount(inputAmount) : 0
  let outputAmount = CurrencyAmount.fromRawAmount(
    exact == 'in' ? token1 : token2,
    ethers.utils
      .parseUnits(
        amountOut.toFixed(),
        exact == 'in' ? token1.decimals : token2.decimals,
      )
      .toString(),
  )
  console.log(inputAmount.toFixed())
  console.log(outputAmount.toFixed())
  console.log(pool.priceOf(token1).toFixed())
  console.log(pool.priceOf(token2).toFixed())
  const trade = Trade.createUncheckedTrade({
    route: route,
    inputAmount:
      route.input.address == inputAmount.currency.address
        ? inputAmount
        : outputAmount,
    outputAmount:
      route.input.address == inputAmount.currency.address
        ? outputAmount
        : inputAmount,
    tradeType: TradeType.EXACT_INPUT,
  })

  return { trade, inputAmount, outputAmount, route }
}
