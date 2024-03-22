import UNISWAP from '@uniswap/sdk'
import fs from 'fs'
import {
  Token,
  Fetcher,
  Route,
  Trade,
  TokenAmount,
  TradeType,
  Percent,
} from '@uniswap/sdk'
import { FeeAmount, Pool, computePoolAddress } from '@uniswap/v3-sdk'
import { ethers } from 'ethers'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json' assert { type: 'json' }
import { POOL_FACTORY_CONTRACT_ADDRESS } from './config.js'

let provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545')

const privateKey = ''
const wallet = new ethers.Wallet(privateKey, provider)

const UNISWAP_ROUTER_ADDRESS = '0x53fBD87e8d5E478100C01e2be1b6060db8e55365'
const UNISWAP_ROUTER_ABI = fs.readFileSync('./abi/router.json').toString()
const UNISWAP_ROUTER_CONTRACT = new ethers.Contract(
  UNISWAP_ROUTER_ADDRESS,
  UNISWAP_ROUTER_ABI,
  provider,
)

const WETH = new Token(
  56,
  '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
  18,
  'WETH',
  'Wrapped Ether',
)

const WBNB = new Token(
  56,
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  18,
  'WBNB',
  'WBNB',
)

async function getPoolInfo(tokenIn, tokenOut, poolFee) {
  const currentPoolAddress = '0x9f97740Ac7ceff6Ed5c08FD3a46e4247cBB85333'
  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    provider,
  )

  const [token0, token1, fee, liquidity, slot0] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ])
  return {
    token0,
    token1,
    fee,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  }
}
async function swapTokens(token1, token2, amount, slippage = '50') {
  try {
    const poolInfo = await getPoolInfo(token1, token2, 500)

    const pool = new Pool(
      token1,
      token2,
      500,
      poolInfo.sqrtPriceX96.toString(),
      poolInfo.liquidity.toString(),
      poolInfo.tick,
    )
    const route = new Route([pool], token1, token2) // a fully specified path from input token to output token
    let amountIn = ethers.utils.parseEther(amount.toString()) //helper function to convert ETH to Wei
    amountIn = amountIn.toString()

    const slippageTolerance = new Percent(slippage, '10000') // 50 bips, or 0.50% - Slippage tolerance

    const trade = new Trade( //information necessary to create a swap transaction.
      route,
      new TokenAmount(token2, amountIn),
      TradeType.EXACT_INPUT,
    )

    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
    const amountOutMinHex = ethers.BigNumber.from(
      amountOutMin.toString(),
    ).toHexString()
    const path = [token2.address, token1.address] //An array of token addresses
    const to = wallet.address // should be a checksummed recipient address
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
    const value = trade.inputAmount.raw // // needs to be converted to e.g. hex
    const valueHex = await ethers.BigNumber.from(value.toString()).toHexString() //convert to hex string

    //Return a copy of transactionRequest, The default implementation calls checkTransaction and resolves to if it is an ENS name, adds gasPrice, nonce, gasLimit and chainId based on the related operations on Signer.
    const rawTxn =
      await UNISWAP_ROUTER_CONTRACT.populateTransaction.swapExactETHForTokens(
        amountOutMinHex,
        path,
        to,
        deadline,
        {
          value: valueHex,
        },
      )

    //Returns a Promise which resolves to the transaction.
    let sendTxn = (await wallet).sendTransaction(rawTxn)

    //Resolves to the TransactionReceipt once the transaction has been included in the chain for x confirms blocks.
    let reciept = (await sendTxn).wait()

    //Logs the information about the transaction it has been mined.
    if (reciept) {
      console.log(
        ' - Transaction is mined - ' + '\n' + 'Transaction Hash:',
        (await sendTxn).hash +
          '\n' +
          'Block Number: ' +
          (await reciept).blockNumber +
          '\n' +
          'Navigate to https://rinkeby.etherscan.io/txn/' +
          (await sendTxn).hash,
        'to see your transaction',
      )
    } else {
      console.log('Error submitting transaction')
    }
  } catch (e) {
    console.log(e)
  }
}

swapTokens(WETH, WBNB, 0.001) //first argument = token we want, second = token we have, the amount we want
