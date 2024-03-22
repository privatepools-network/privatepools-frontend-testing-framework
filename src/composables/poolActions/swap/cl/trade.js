import { CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core'
import { FeeAmount, Pool, SwapRouter, Trade } from '@uniswap/v3-sdk'
import { Route } from '@uniswap/v3-sdk'
import { getPoolInfo, getQuote } from './index.js'
import { fromReadableAmount, getTokenTransferApproval } from './utils.js'
import {
  SWAP_ROUTER_ADDRESS,
  USDC_TOKEN,
  WETH_TOKEN,
  signer,
} from './config.js'
import { ethers } from 'ethers'
import ERC20 from './abi/ERC20.json' assert { type: 'json' }
async function trade(tokenIn, tokenOut, amountIn, poolFee) {
  const poolInfo = await getPoolInfo(tokenIn, tokenOut, poolFee)
  let token1_contract = new ethers.Contract(tokenIn.address, ERC20, signer)
  let token2_contract = new ethers.Contract(tokenOut.address, ERC20, signer)
  console.log(
    await token1_contract.balanceOf(
      '0x9f97740Ac7ceff6Ed5c08FD3a46e4247cBB85333',
    ),
  )
  console.log(
    await token2_contract.balanceOf(
      '0x9f97740Ac7ceff6Ed5c08FD3a46e4247cBB85333',
    ),
  )
  //  eth = 1.137878695946798097 ~ 4000$
  //  wbnb = 2.429532100804054607 ~ 1500$
  // trade.js:79
  // BigNumber {_hex: '0x21b76e92ced58e4f', _isBigNumber: true}
  const pool = new Pool(
    tokenIn,
    tokenOut,
    poolFee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick,
  )
  const swapRoute = new Route([pool], tokenIn, tokenOut)
  const amountOut = '0' //await getQuote(tokenIn, tokenOut, amountIn, poolFee);
  let inputAmount = CurrencyAmount.fromRawAmount(
    tokenIn,
    fromReadableAmount(amountIn, tokenIn.decimals),
  )
  let outputAmount = CurrencyAmount.fromRawAmount(tokenOut, amountOut)
  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: inputAmount,
    outputAmount: outputAmount,
    tradeType: TradeType.EXACT_INPUT,
  })
  const tokenApproval = await getTokenTransferApproval(
    tokenIn,
    amountIn,
    SWAP_ROUTER_ADDRESS,
    signer,
  )

  if (tokenApproval) {
    let walletAddress = await signer.getAddress()
    const options = {
      slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
      recipient: walletAddress,
    }
    const methodParameters = SwapRouter.swapCallParameters(
      [uncheckedTrade],
      options,
    )
    const tx = {
      data: methodParameters.calldata,
      to: SWAP_ROUTER_ADDRESS,
      value: methodParameters.value,
      from: walletAddress,
      maxFeePerGas: '100000000000',
      gasLimit: ethers.utils.hexlify(10000000),
    }

    const transaction = await signer.sendTransaction(tx)
    let receipt = await transaction.wait()
    console.log(receipt)
    console.log(
      await token1_contract.balanceOf(
        '0x9f97740Ac7ceff6Ed5c08FD3a46e4247cBB85333',
      ),
    )
    console.log(
      await token2_contract.balanceOf(
        '0x9f97740Ac7ceff6Ed5c08FD3a46e4247cBB85333',
      ),
    )
    return receipt
  }
}

trade(WETH_TOKEN, USDC_TOKEN, 0.4, FeeAmount.LOW)
