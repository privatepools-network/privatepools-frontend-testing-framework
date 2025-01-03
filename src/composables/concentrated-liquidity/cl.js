import { ethers } from 'ethers'
import JSBI from 'jsbi'
import IMulticall from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IMulticall.sol/IMulticall.json'
import {
  nearestUsableTick,
  NonfungiblePositionManager,
  Pool,
  Position,
  priceToClosestTick,
  tickToPrice,
  encodeSqrtRatioX96,
  TickMath,
  TICK_SPACINGS,
  toHex,
} from '@uniswap/v3-sdk'
import { Interface } from '@ethersproject/abi'

import {
  CurrencyAmount,
  Fraction,
  Percent,
  Price,
  Token,
  Rounding,
} from '@uniswap/sdk-core'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import NonfungiblePositionManagerAbi from '@/lib/abi/NonFungiblePositionManager.json'
import UniswapFactoryAbi from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'
import {
  ERC20_ABI,
  NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
  POOL_FACTORY_CONTRACT_ADDRESS,
} from './constants'
import { formatUnits, parseUnits } from '@ethersproject/units'
import Toast from '@/UI/Toast.vue'
import { toast } from 'vue3-toastify'

const { BigNumber } = require('ethers')
const bn = require('bignumber.js')
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 })
///
/// UTILS
///

export const FEE_AMOUNTS = [100, 500, 3000, 10000]

function countDecimals(x) {
  if (Math.floor(x) === x) {
    return 0
  }
  return x.toString().split('.')[1].length || 0
}

export function fromReadableAmount(amount, decimals) {
  const extraDigits = Math.pow(10, countDecimals(amount))
  const adjustedAmount = amount * extraDigits
  return JSBI.divide(
    JSBI.multiply(
      JSBI.BigInt(adjustedAmount),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals)),
    ),
    JSBI.BigInt(extraDigits),
  )
}

export async function getPoolInfo(provider, tokenA, tokenB, feeAmount, price) {
  if (!provider) {
    throw new Error('No provider')
  }

  const factoryContract = new ethers.Contract(
    POOL_FACTORY_CONTRACT_ADDRESS,
    UniswapFactoryAbi.abi,
    provider,
  )
  const currentPoolAddress = await factoryContract.getPool(
    tokenA.address,
    tokenB.address,
    0,
  )
  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    provider,
  )
  try {
    const [token0, token1, fee, tickSpacing, liquidity, slot0] =
      await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.tickSpacing(),
        poolContract.liquidity(),
        poolContract.slot0(),
      ])
    return {
      token0,
      token1,
      fee,
      tickSpacing,
      liquidity,
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
      address: currentPoolAddress,
    }
  } catch (e) {
    console.error(e)
    let pool_address = await deployPool(
      tokenA,
      tokenB,
      feeAmount,
      price,
      provider,
    )
    if (pool_address) {
      return await getPoolInfo(provider, tokenA, tokenB, feeAmount, null)
    }
  }
}

export async function getPrice(token0, token1, poolInfo) {
  return tickToPrice(token0, token1, poolInfo.tick)
}

export async function constructTakeProfitOrder(
  provider,
  poolInfo,
  tokenA,
  tokenB,
  amountA,
  amountB,
  feeAmount,
  tickLower,
  tickUpper,
) {
  const configuredPool = new Pool(
    tokenA,
    tokenB,
    poolInfo.fee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick,
  )

  const current = await getPrice(tokenA, tokenB, poolInfo)
  const priceTarget = new Price(
    current.baseCurrency,
    current.quoteCurrency,
    current.asFraction.divide(
      new Fraction(100 + 5, 100), // maybe it's 5% range between actual price?
    ).denominator,
    current.asFraction.divide(new Fraction(100 + 5, 100)).numerator,
  )

  const targetTick = nearestUsableTick(
    priceToClosestTick(priceTarget),
    poolInfo.tickSpacing,
  )
  // const amount0 = CurrencyAmount.fromRawAmount(tokenA, amountA)
  // const amount1 = CurrencyAmount.fromRawAmount(tokenB, amountB)

  const position = await constructRangeOrderPosition(
    amountA,
    amountB,
    configuredPool,
    tickLower,
    tickUpper,
    feeAmount,
  )
  console.log(position.mintAmounts.amount0.toString())
  console.log(position.mintAmounts.amount1.toString())
  const closestTargetPrice = tickToPrice(
    position.amount0.currency,
    position.amount1.currency,
    targetTick,
  )
  let res = {
    targetTick,
    targetPrice: closestTargetPrice,
    position,
    zeroForOne: false,
  }
  return res
}

async function constructRangeOrderPosition(
  token0Amount,
  token1Amount,
  pool,
  tickLower,
  tickUpper,
  feeAmount,
) {
  // POOL TOKENS ORDER MATTER
  if (tickLower >= tickUpper) {
    tickLower = tickUpper -= pool.tickSpacing
  }
  pool = {
    ...pool,
    token0Price: pool.token0Price,
    token1Price: pool.token1Price,
    tickSpacing: 10,
  }
  if (!token0Amount) {
    return Position.fromAmount1({
      pool: pool,
      tickLower: nearestUsableTick(tickLower, 10),
      tickUpper: nearestUsableTick(tickUpper, 10),
      amount1: token1Amount.quotient,
    })
  }
  if (!token1Amount) {
    return Position.fromAmount0({
      pool: pool,
      tickLower: nearestUsableTick(tickLower, 10),
      tickUpper: nearestUsableTick(tickUpper, 10),
      amount0: token0Amount.quotient,
    })
  }
  return Position.fromAmounts({
    pool: pool,
    tickLower: nearestUsableTick(tickLower, 10),
    tickUpper: nearestUsableTick(tickUpper, 10),
    amount0: token0Amount.quotient,
    amount1: token1Amount.quotient,
  })
}
export default function tryParseCurrencyAmount(value, currency) {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(
      value.toString(),
      currency.decimals,
    ).toString()
    if (typedValueParsed !== '0') {
      return CurrencyAmount.fromRawAmount(
        currency,
        JSBI.BigInt(typedValueParsed),
      )
    }
  } catch (error) {
    // fails if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  return undefined
}

export function tryParseTick(baseToken, quoteToken, feeAmount, value) {
  if (!baseToken || !quoteToken || !feeAmount || !value) {
    return undefined
  }

  const price = tryParsePrice(baseToken, quoteToken, value)

  if (!price) {
    return undefined
  }

  let tick

  // check price is within min/max bounds, if outside return min/max
  const sqrtRatioX96 = encodeSqrtRatioX96(price.numerator, price.denominator)

  if (JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MAX_SQRT_RATIO)) {
    tick = TickMath.MAX_TICK
  } else if (JSBI.lessThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO)) {
    tick = TickMath.MIN_TICK
  } else {
    // this function is agnostic to the base, will always return the correct tick
    tick = priceToClosestTick(price)
  }

  return nearestUsableTick(tick, 100)
}

export function tryParsePrice(baseToken, quoteToken, value) {
  if (!baseToken || !quoteToken || !value) {
    return undefined
  }

  if (!value.match(/^\d*\.?\d+$/)) {
    return undefined
  }

  const [whole, fraction] = value.split('.')

  const decimals = fraction?.length ?? 0
  const withoutDecimals = JSBI.BigInt((whole ?? '') + (fraction ?? ''))

  return new Price(
    baseToken,
    quoteToken,
    JSBI.multiply(
      JSBI.BigInt(10 ** decimals),
      JSBI.BigInt(10 ** baseToken.decimals),
    ),
    JSBI.multiply(withoutDecimals, JSBI.BigInt(10 ** quoteToken.decimals)),
  )
}

function getTickToPrice(baseToken, quoteToken, tick) {
  if (!baseToken || !quoteToken || typeof tick !== 'number') {
    return undefined
  }
  return tickToPrice(baseToken, quoteToken, tick)
}

///
/// MY LOGIC
///
// Input params:
// Token0/Token1 (address, symbol, decimals)
// FeeAmount: 100/500/3000/10000
// Deposit amounts: token0Amount, token1Amount
// Low price / High price (Token0 per Token1)
// Current price ?

export function getDecrementUpper(
  tickUpper,
  pool,
  baseToken,
  quoteToken,
  feeAmount,
) {
  if (baseToken && quoteToken && typeof tickUpper === 'number' && feeAmount) {
    const newPrice = tickToPrice(
      baseToken,
      quoteToken,
      tickUpper < 0
        ? tickUpper + TICK_SPACINGS[feeAmount]
        : tickUpper - TICK_SPACINGS[feeAmount],
    )
    return newPrice.toSignificant(5, undefined, Rounding.ROUND_DOWN)
  }
  // use pool current tick as starting tick if we have pool but no tick input
  if (
    !(typeof tickUpper === 'number') &&
    baseToken &&
    quoteToken &&
    feeAmount &&
    pool
  ) {
    const newPrice = tickToPrice(
      baseToken,
      quoteToken,
      pool.tickCurrent < 0
        ? pool.tickCurrent + TICK_SPACINGS[feeAmount]
        : pool.tickCurrent - TICK_SPACINGS[feeAmount],
    )
    return newPrice.toSignificant(5, undefined, Rounding.ROUND_DOWN)
  }
  return ''
}

export function getIncrementUpper(
  tickUpper,
  pool,
  baseToken,
  quoteToken,
  feeAmount,
) {
  if (baseToken && quoteToken && typeof tickUpper === 'number' && feeAmount) {
    const newPrice = tickToPrice(
      baseToken,
      quoteToken,
      tickUpper < 0
        ? tickUpper - TICK_SPACINGS[feeAmount]
        : tickUpper + TICK_SPACINGS[feeAmount],
    )
    return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP)
  }
  // use pool current tick as starting tick if we have pool but no tick input
  if (
    !(typeof tickUpper === 'number') &&
    baseToken &&
    quoteToken &&
    feeAmount &&
    pool
  ) {
    const newPrice = tickToPrice(
      baseToken,
      quoteToken,
      pool.tickCurrent < 0
        ? pool.tickCurrent - TICK_SPACINGS[feeAmount]
        : pool.tickCurrent + TICK_SPACINGS[feeAmount],
    )

    return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP)
  }
  return ''
}

export function getIncrementLower(
  tickLower,
  pool,
  baseToken,
  quoteToken,
  feeAmount,
) {
  if (baseToken && quoteToken && typeof tickLower === 'number' && feeAmount) {
    const newPrice = tickToPrice(
      baseToken,
      quoteToken,
      tickLower < 0
        ? tickLower - TICK_SPACINGS[feeAmount]
        : tickLower + TICK_SPACINGS[feeAmount],
    )
    console.log(newPrice.toSignificant(5, undefined, Rounding.ROUND_UP))
    return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP)
  }
  // use pool current tick as starting tick if we have pool but no tick input
  if (
    !(typeof tickLower === 'number') &&
    baseToken &&
    quoteToken &&
    feeAmount &&
    pool
  ) {
    const newPrice = tickToPrice(
      baseToken,
      quoteToken,
      pool.tickCurrent < 0
        ? pool.tickCurrent - TICK_SPACINGS[feeAmount]
        : pool.tickCurrent + TICK_SPACINGS[feeAmount],
    )
    return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP)
  }
  return ''
}
export function getDecrementLower(
  tickLower,
  pool,
  baseToken,
  quoteToken,
  feeAmount,
) {
  if (baseToken && quoteToken && typeof tickLower === 'number' && feeAmount) {
    const newPrice = tickToPrice(
      baseToken,
      quoteToken,
      tickLower < 0
        ? tickLower + 1 + TICK_SPACINGS[feeAmount]
        : tickLower + 1 - TICK_SPACINGS[feeAmount],
    )
    return newPrice.toSignificant(5, undefined, Rounding.ROUND_DOWN)
  }
  // use pool current tick as starting tick if we have pool but no tick input
  if (
    !(typeof tickLower === 'number') &&
    baseToken &&
    quoteToken &&
    feeAmount &&
    pool
  ) {
    const newPrice = tickToPrice(
      baseToken,
      quoteToken,
      pool.tickCurrent < 0
        ? pool.tickCurrent + TICK_SPACINGS[feeAmount]
        : pool.tickCurrent - TICK_SPACINGS[feeAmount],
    )
    return newPrice.toSignificant(5, undefined, Rounding.ROUND_DOWN)
  }
  return ''
}

export function convertPairToken(pairToken, chainId) {
  return new Token(
    chainId,
    pairToken.address,
    parseInt(pairToken.decimals),
    pairToken.symbol,
    pairToken.name,
  )
}

export function parseTicks(token0, token1, lowPrice, highPrice, feeAmount) {
  try {
    let tickLower = tryParseTick(token0, token1, feeAmount, lowPrice.toString())
    let tickUpper = tryParseTick(
      token0,
      token1,
      feeAmount,
      highPrice.toString(),
    )
    return { tickLower, tickUpper }
  } catch (e) {
    console.error(e)
    return { tickLower: 0, tickUpper: 0 }
  }
}

export function adjustPrices(token0, token1, lowPrice, highPrice, feeAmount) {
  const { tickLower, tickUpper } = parseTicks(
    token0,
    token1,
    lowPrice,
    highPrice,
    feeAmount,
  )
  let priceLower = getTickToPrice(token0, token1, tickLower)
  let priceUpper = getTickToPrice(token0, token1, tickUpper)
  return { priceLower, priceUpper }
}

export async function MintPosition(
  signer,
  token0,
  token1,
  feeAmount,
  depositAmount0,
  depositAmount1,
  lowPrice,
  highPrice,
  currentPrice = null,
  step = null,
) {
  const { tickLower, tickUpper } = parseDisplayTicks(
    token0,
    token1,
    lowPrice,
    highPrice,
    100,
  )
  let result = checkTokensSwapped(
    null,
    token0,
    token1,
    depositAmount0,
    depositAmount1,
  )
  ;[token0, token1, depositAmount0, depositAmount1] = [
    result.token0,
    result.token1,
    result.depositAmount0,
    result.depositAmount1,
  ]
  const poolInfo = await getPoolInfo(
    signer,
    token0,
    token1,
    feeAmount,
    currentPrice > 0 ? currentPrice : (highPrice + lowPrice) / 2,
  )
  let swapped = checkTokensSwapped(
    poolInfo,
    token0,
    token1,
    depositAmount0,
    depositAmount1,
  )
  token0 = swapped.token0
  token1 = swapped.token1
  depositAmount0 = swapped.depositAmount0
  depositAmount1 = swapped.depositAmount1
  let order = await constructTakeProfitOrder(
    signer,
    poolInfo,
    token0,
    token1,
    tryParseCurrencyAmount(depositAmount0, token0),
    tryParseCurrencyAmount(depositAmount1, token1),
    feeAmount,
    tickLower,
    tickUpper,
  )
  const { amount0, amount1 } = order.position.mintAmounts
  let token0Contract = new ethers.Contract(token0.address, ERC20_ABI, signer)
  let token1Contract = new ethers.Contract(token1.address, ERC20_ABI, signer)
  step.value = 3
  const ApproveTokensToastPending = toast.loading(Toast, {
    data: {
      header_text: 'Approve pending',
      toast_text: 'Approve all requested tokens in your wallet',
      tx_link: '',
      speedUp: '',
    },
    position: toast.POSITION.TOP_RIGHT,
    theme: 'dark',
    closeOnClick: false,
  })
  await ApproveToken(
    token1Contract,
    signer,
    amount1,
    token1.decimals,
    ApproveTokensToastPending,
  )
  await ApproveToken(
    token0Contract,
    signer,
    amount0,
    token0.decimals,
    ApproveTokensToastPending,
  )
  toast.update(ApproveTokensToastPending, {
    render: Toast,
    data: {
      header_text: 'All tokens approved',
      toast_text: `All tokens from wallet successfully approved`,
      tx_link: ``,
      speedUp: '',
    },

    closeOnClick: false,
    autoClose: 5000,
    closeButton: true,
    type: 'success',
    isLoading: false,
  })

  step.value = 4
  await mintPosition(order, signer, poolInfo)
  // step.value = 0
}

export async function AddLiquidityToPosition(
  signer,
  position,
  depositAmount0,
  depositAmount1,
  step,
) {
  let parsed0 = tryParseCurrencyAmount(depositAmount0, position.token0)
  let parsed1 = tryParseCurrencyAmount(depositAmount1, position.token1)
  let order = await constructTakeProfitOrder(
    signer,
    position.pool,
    position.token0,
    position.token1,
    parsed0,
    parsed1,
    position.pool.fee,
    position.tickLower,
    position.tickUpper,
  )
  const { amount0, amount1 } = order.position.mintAmounts
  let token0Contract = new ethers.Contract(
    position.token0.address,
    ERC20_ABI,
    signer,
  )
  let token1Contract = new ethers.Contract(
    position.token1.address,
    ERC20_ABI,
    signer,
  )
  step.value = 3
  await ApproveToken(token1Contract, signer, amount1, position.token1.decimals)
  await ApproveToken(token0Contract, signer, amount0, position.token0.decimals)
  step.value = 4
  await addLiquidity(order, signer, position.id, position.pool)
  step.value = 0
}
export async function RemoveLiquidityFromPosition(signer, position, percent) {
  let parsed0 = tryParseCurrencyAmount(
    position.amountReadable0,
    position.token0,
  )
  let parsed1 = tryParseCurrencyAmount(
    position.amountReadable1,
    position.token1,
  )
  const configuredPool = new Pool(
    position.token0,
    position.token1,
    position.pool.fee,
    position.pool.sqrtPriceX96.toString(),
    position.pool.liquidity.toString(),
    position.pool.tick,
  )
  let order = await constructTakeProfitOrder(
    signer,
    position.pool,
    position.token0,
    position.token1,
    parsed0,
    parsed1,
    position.pool.fee,
    position.tickLower,
    position.tickUpper,
  )
  await removeLiquidity(
    order,
    signer,
    position.id,
    percent,
    position.token0,
    position.token1,
    configuredPool,
  )
}

async function ApproveToken(
  contract,
  signer,
  amount,
  _,
  ApproveTokensToastPending,
) {
  try {
    contract = contract.connect(signer)
    let tx = await contract.approve(
      NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      amount.toString(),
    )
    console.log('APPROVE - ', tx)
    return await tx.wait()
  } catch {
    toast.update(ApproveTokensToastPending, {
      render: Toast,
      data: {
        header_text: 'Approval rejected',
        toast_text: `You rejected tokens approval`,
        tx_link: ``,
        speedUp: '',
      },

      closeOnClick: false,
      autoClose: 5000,
      closeButton: true,
      type: 'error',
      isLoading: false,
    })

    throw new Error('Approve rej')
  }
}

function checkTokensSwapped(
  poolInfo,
  token0,
  token1,
  depositAmount0,
  depositAmount1,
) {
  let swapped = false
  if (
    (poolInfo && poolInfo.token0 != token0.address) ||
    ethers.BigNumber.from(token0.address).gt(token1.address)
  ) {
    let _token0 = token0
    token0 = token1
    token1 = _token0
    let _deposit0 = depositAmount0
    depositAmount0 = depositAmount1
    depositAmount1 = _deposit0
    swapped = true
  }
  return { token0, token1, depositAmount0, depositAmount1, swapped }
}

function parseDisplayTicks(token0, token1, lowPrice, highPrice, feeAmount) {
  let tickLower = tryParseTick(token0, token1, feeAmount, lowPrice.toString())
  let tickUpper = tryParseTick(token0, token1, feeAmount, highPrice.toString())
  if (tickLower > tickUpper) {
    let _lower = tickLower
    tickLower = tickUpper
    tickUpper = _lower
  }
  return { tickUpper, tickLower }
}

async function mintPosition(order, signer, pool) {
  let tx
  const configuredPool = new Pool(
    order.position.pool.token0,
    order.position.pool.token1,
    pool.fee,
    pool.sqrtPriceX96.toString(),
    pool.liquidity.toString(),
    pool.tick,
  )
  pool = {
    ...configuredPool,
    tickSpacing: 10,
    token0Price: configuredPool.token0Price,
    token1Price: configuredPool.token1Price,
  }
  let position = {
    ...order.position,
    pool,
    amount0: order.position.amount0,
    amount1: order.position.amount1,
    mintAmounts: order.position.mintAmounts,
    token0PriceLower: order.position.token0PriceLower,
    token0PriceUpper: order.position.token0PriceUpper,
    mintAmountsWithSlippage: order.position.mintAmountsWithSlippage,
  }

  let MintingToastPending
  setTimeout(() => {
    MintingToastPending = toast.loading(Toast, {
      data: {
        header_text: 'Minting liquidity',
        toast_text: 'Minting CL position',
        tx_link: '',
        speedUp: 'speed',
      },
      position: toast.POSITION.TOP_RIGHT,
      theme: 'dark',
      closeOnClick: false,
    })
  }, 500)

  try {
    let address = await signer.getAddress()
    const mintOptions = {
      recipient: address,
      deadline: Math.floor(Date.now() / 1000) + 60 * 20,
      slippageTolerance: new Percent(50, 10_000),
    }
    const { amount0: amount0Desired, amount1: amount1Desired } =
      position.mintAmounts
    const minimumAmounts = mintAmountsWithSlippage(
      mintOptions.slippageTolerance,
      pool,
      order.position.tickLower,
      order.position.tickUpper,
      position.mintAmounts,
    )
    const amount0Min = toHex(minimumAmounts.amount0)
    const amount1Min = toHex(minimumAmounts.amount1)
    const calldata = NonfungiblePositionManager.INTERFACE.encodeFunctionData(
      'mint',
      [
        {
          token0: position.pool.token0.address,
          token1: position.pool.token1.address,
          fee: position.pool.fee,
          tickLower: position.tickLower,
          tickUpper: position.tickUpper,
          amount0Desired: toHex(amount0Desired),
          amount1Desired: toHex(amount1Desired),
          amount0Min,
          amount1Min,
          recipient: mintOptions.recipient,
          deadline: mintOptions.deadline,
        },
      ],
    )

    const transaction = {
      data: calldata,
      to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      value: ethers.BigNumber.from(0),
      from: address,
      gasLimit: '1000000',
    }

    tx = await signer.sendTransaction(transaction)
  } catch (e) {
    console.error(e)
    toast.update(MintingToastPending, {
      render: Toast,
      data: {
        header_text: 'Minting rejected',
        toast_text: `You rejected minting`,
        tx_link: '',
        speedUp: '',
      },
      autoClose: 7000,
      closeOnClick: false,
      closeButton: true,
      type: 'error',
      isLoading: false,
    })
    return
  }

  const receipt = await tx.wait()

  toast.update(MintingToastPending, {
    render: Toast,
    data: {
      header_text: 'Minting Confirm',
      toast_text: `Minted a CL position`,
      tx_link: ``,
      speedUp: '',
    },

    closeOnClick: false,
    autoClose: 5000,
    closeButton: true,
    type: 'success',
    isLoading: false,
  })
  console.log('SUCCESS', receipt)
  return receipt
}

async function addLiquidity(order, signer, tokenId, pool) {
  try {
    let address = await signer.getAddress()
    const addLiquidityOptions = {
      deadline: Math.floor(Date.now() / 1000) + 60 * 20,
      slippageTolerance: new Percent(50, 10_000),
      tokenId,
    }
    const configuredPool = new Pool(
      order.position.pool.token0,
      order.position.pool.token1,
      pool.fee,
      pool.sqrtPriceX96.toString(),
      pool.liquidity.toString(),
      pool.tick,
    )
    pool = {
      ...configuredPool,
      tickSpacing: 10,
      token0Price: configuredPool.token0Price,
      token1Price: configuredPool.token1Price,
    }
    const { amount0: amount0Desired, amount1: amount1Desired } =
      order.position.mintAmounts
    const minimumAmounts = mintAmountsWithSlippage(
      addLiquidityOptions.slippageTolerance,
      pool,
      order.position.tickLower,
      order.position.tickUpper,
      order.position.mintAmounts,
    )
    const amount0Min = toHex(minimumAmounts.amount0)
    const amount1Min = toHex(minimumAmounts.amount1)
    const calldata = NonfungiblePositionManager.INTERFACE.encodeFunctionData(
      'increaseLiquidity',
      [
        {
          tokenId: toHex(tokenId),
          amount0Desired: toHex(amount0Desired),
          amount1Desired: toHex(amount1Desired),
          amount0Min,
          amount1Min,
          deadline: addLiquidityOptions.deadline,
        },
      ],
    )

    const transaction = {
      data: calldata,
      to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      value: ethers.BigNumber.from(0),
      from: address,
      gasLimit: '1000000',
    }

    let tx = await signer.sendTransaction(transaction)
    const receipt = await tx.wait()
    console.log('SUCCESS', receipt)
    return receipt
  } catch (err) {
    console.error('[ADD LIQUIDITY ERROR] ', err)
  }
}
async function removeLiquidity(
  order,
  signer,
  tokenId,
  percent,
  token0,
  token1,
  pool,
) {
  try {
    let address = await signer.getAddress()
    // TODO set owed tokens in order to withdraw tokens properly
    const collectOptions = {
      expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(token0, 0),
      expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(token1, 0),
      recipient: address,
    }
    const removeLiquidityOptions = {
      deadline: Math.floor(Date.now() / 1000) + 60 * 20,
      slippageTolerance: new Percent(50, 10_000),
      tokenId: tokenId,
      // percentage of liquidity to remove
      liquidityPercentage: new Percent(percent, 100),
      collectOptions,
    }

    const { calldata, value } = removeCallParameters(
      order.position,
      removeLiquidityOptions,
      pool,
    )

    const transaction = {
      data: calldata,
      to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      value: ethers.BigNumber.from(value),
      from: address,
      gasLimit: '1000000',
    }

    let tx = await signer.sendTransaction(transaction)
    const receipt = await tx.wait()
    console.log('SUCCESS', receipt)
    return receipt
  } catch (err) {
    console.error('[ADD LIQUIDITY ERROR] ', err)
  }
}

export function GetSecondAmount(
  poolInfo,
  token0,
  token1,
  lowPrice,
  highPrice,
  amount0,
  amount1,
  feeAmount,
  token0Changed = false,
) {
  const { tickLower, tickUpper } = parseDisplayTicks(
    token0,
    token1,
    lowPrice,
    highPrice,
    feeAmount,
  )
  let swapped = checkTokensSwapped(poolInfo, token0, token1, amount0, amount1)
  token0Changed = swapped.swapped ? !token0Changed : token0Changed
  token0 = swapped.token0
  token1 = swapped.token1
  amount0 = swapped.depositAmount0
  amount1 = swapped.depositAmount1

  let parsed0 = tryParseCurrencyAmount(amount0, token0)
  let parsed1 = tryParseCurrencyAmount(amount1, token1)
  const _configuredPool = new Pool(
    token0,
    token1,
    poolInfo.fee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick,
  )
  const configuredPool = {
    ..._configuredPool,
    tickSpacing: 10,
    token0Price: _configuredPool.token0Price,
    token1Price: _configuredPool.token1Price,
  }
  let position = token0Changed
    ? Position.fromAmount0({
        pool: configuredPool,
        tickLower: nearestUsableTick(tickLower, 10),
        tickUpper: nearestUsableTick(tickUpper, 10),
        amount0: parsed0.quotient,
      })
    : Position.fromAmount1({
        pool: configuredPool,
        tickLower: nearestUsableTick(tickLower, 10),
        tickUpper: nearestUsableTick(tickUpper, 10),
        amount1: parsed1.quotient,
      })
  const { amount0: mint_amount0, amount1: mint_amount1 } = position.mintAmounts
  let string_amount0 = mint_amount0.toString()
  let string_amount1 = mint_amount1.toString()
  console.log(string_amount0)
  console.log(string_amount1)
  let changed_amount = token0Changed
    ? formatUnits(mint_amount1.toString(), token1.decimals)
    : formatUnits(mint_amount0.toString(), token0.decimals)
  if (parseFloat(string_amount0) == 0 || parseFloat(string_amount1) == 0) {
    return null
  }
  return changed_amount
}

export function GetTickSpaceLimits(feeAmount) {
  const lower = nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount])
  const upper = nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount])
  return { lower, upper }
}
export function GetPricesAtLimit(poolInfo, token0, token1, feeAmount) {
  let { lower, upper } = GetTickSpaceLimits(feeAmount)
  let swapped = checkTokensSwapped(poolInfo, token0, token1, 0, 0)
  token0 = swapped.token0
  token1 = swapped.token1
  let lowerPrice = getTickToPrice(token0, token1, lower).toSignificant(5)
  let upperPrice = getTickToPrice(token0, token1, upper).toSignificant(5)
  return { lowerPrice, upperPrice }
}

/// DEPLOY POOL

function encodePriceSqrt(reserve1, reserve0) {
  return BigNumber.from(
    bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString(),
  )
}

async function deployPool(token0, token1, fee, price, signer) {
  try {
    if (!price) return null
    let parsedPrice = tryParsePrice(token0, token1, price.toString())
    let tick = priceToClosestTick(parsedPrice)
    let sqrtPrice = TickMath.getSqrtRatioAtTick(tick)
    let contract = new ethers.Contract(
      NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      NonfungiblePositionManagerAbi,
      signer,
    )
    let tx = await contract.createAndInitializePoolIfNecessary(
      token0.address,
      token1.address,
      `0x${sqrtPrice.toString(16)}`,
    )
    let receipt = await tx.wait()
    console.log('RECEIPT - ', receipt)
    return true
  } catch (e) {
    // check if you can deploy doge on default uniswap
    console.error(e)
    return false
  }
}
const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96))
function getTickAtSqrtRatio(sqrtPriceX96) {
  let tick = Math.floor(Math.log((sqrtPriceX96 / Q96) ** 2) / Math.log(1.0001))
  return tick
}
function getTokenAmounts(
  liquidity,
  sqrtPriceX96,
  tickLow,
  tickHigh,
  token0Decimal,
  token1Decimal,
) {
  let sqrtRatioA = Math.sqrt(1.0001 ** tickLow).toFixed(18)
  let sqrtRatioB = Math.sqrt(1.0001 ** tickHigh).toFixed(18)

  let currentTick = getTickAtSqrtRatio(sqrtPriceX96)

  let currentRatio = Math.sqrt(1.0001 ** currentTick).toFixed(18)
  let amount0wei = 0
  let amount1wei = 0
  if (currentTick <= tickLow) {
    amount0wei = Math.floor(
      liquidity * ((sqrtRatioB - sqrtRatioA) / (sqrtRatioA * sqrtRatioB)),
    )
  }
  if (currentTick > tickHigh) {
    amount1wei = Math.floor(liquidity * (sqrtRatioB - sqrtRatioA))
  }
  if (currentTick >= tickLow && currentTick < tickHigh) {
    amount0wei = Math.floor(
      liquidity * ((sqrtRatioB - currentRatio) / (currentRatio * sqrtRatioB)),
    )
    amount1wei = Math.floor(liquidity * (currentRatio - sqrtRatioA))
  }

  let amount0Human = amount0wei / 10 ** token0Decimal
  let amount1Human = amount1wei / 10 ** token1Decimal

  console.log('Amount Token0 wei: ' + amount0wei)
  console.log('Amount Token1 wei: ' + amount1wei)
  console.log('Amount Token0 : ' + amount0Human)
  console.log('Amount Token1 : ' + amount1Human)
  return [amount0Human, amount1Human]
}

export async function fetchPositions(
  signer,
  tokens,
  networkId,
  fee = null,
  poolId = null,
) {
  const nfpmContract = new ethers.Contract(
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    NonfungiblePositionManagerAbi,
    signer,
  )
  let poolToken0 = null
  let poolToken1 = null
  if (poolId) {
    const pool = new ethers.Contract(poolId, IUniswapV3PoolABI.abi, signer)
    fee = await pool.fee()
    ;[poolToken0, poolToken1] = (
      await Promise.all([pool.token0(), pool.token1()])
    ).map((t) => t.toLowerCase())
  }

  let address = await signer.getAddress() //
  const numPositions = await nfpmContract.balanceOf(address)
  const calls = []

  for (let i = 0; i < numPositions; i++) {
    calls.push(nfpmContract.tokenOfOwnerByIndex(address, i))
  }

  const positionIds = await Promise.all(calls)
  const positionCalls = []

  for (let id of positionIds) {
    positionCalls.push(nfpmContract.positions(id))
  }

  const callResponses = await Promise.all(positionCalls)
  let positionInfos = await Promise.all(
    callResponses.map(async (position, index) => {
      try {
        let token0Found = tokens.find(
          (item) => item.address.toLowerCase() == position.token0.toLowerCase(),
        )
        let token1Found = tokens.find(
          (item) => item.address.toLowerCase() == position.token1.toLowerCase(),
        )
        console.log(position)
        if (!token0Found || !token1Found) return null
        if (fee && position.fee != fee) return null
        if (poolId && poolToken0) {
          if (
            token0Found.address.toLowerCase() != poolToken0 ||
            token1Found.address.toLowerCase() != poolToken1
          )
            return null
        }

        let token0 = convertPairToken(token0Found, networkId)
        let token1 = convertPairToken(token1Found, networkId)
        let pool = await getPoolInfo(signer, token0, token1, position.fee, null)
        let _pool = new Pool(
          token0,
          token1,
          position.fee,
          pool.sqrtPriceX96,
          pool.liquidity,
          pool.tick,
        )
        console.log('POOL - ', _pool)
        let liquidity = JSBI.BigInt(position.liquidity)
        let amounts = getTokenAmounts(
          BigNumber.from(position.liquidity).toString(),
          BigNumber.from(pool.sqrtPriceX96).toString(),
          position.tickLower,
          position.tickUpper,
          token0.decimals,
          token1.decimals,
        )
        console.log('AMOUNTS - ', amounts)
        return {
          id: positionIds[index],
          tickLower: position.tickLower,
          tickUpper: position.tickUpper,
          liquidity,
          feeGrowthInside0LastX128: JSBI.BigInt(
            position.feeGrowthInside0LastX128,
          ),
          feeGrowthInside1LastX128: JSBI.BigInt(
            position.feeGrowthInside1LastX128,
          ),
          tokensOwed0: JSBI.BigInt(position.tokensOwed0),
          tokensOwed1: JSBI.BigInt(position.tokensOwed1),
          token0: token0,
          token1: token1,
          fee: position.fee,
          amount0: ethers.utils.parseUnits(
            amounts[0].toString(),
            token0.decimals,
          ),
          amount1: ethers.utils.parseUnits(
            amounts[1].toString(),
            token1.decimals,
          ),
          amountReadable0: amounts[0].toString(),
          amountReadable1: amounts[1].toString(),
          pool,
        }
      } catch (err) {
        console.error(err)
        return null
      }
    }),
  )
  positionInfos = positionInfos.filter((item) => item != null)
  console.log('POSITIONS - ', positionInfos)
  return positionInfos
}

// const addLiquidityOptions: AddLiquidityOptions = {
//   deadline: Math.floor(Date.now() / 1000) + 60 * 20,
//   slippageTolerance: new Percent(50, 10_000),
//   tokenId,
// }

// const removeLiquidityOptions: RemoveLiquidityOptions = {
//   deadline: Math.floor(Date.now() / 1000) + 60 * 20,
//   slippageTolerance: new Percent(50, 10_000),
//   tokenId: positionId,
//   // percentage of liquidity to remove
//   liquidityPercentage: new Percent(0.5),
//   collectOptions,
// }

function mintAmountsWithSlippage(
  slippageTolerance,
  pool,
  tickLower,
  tickUpper,
  mintAmounts,
) {
  // get lower/upper prices
  const { sqrtRatioX96Upper, sqrtRatioX96Lower } = ratiosAfterSlippage(
    slippageTolerance,
    pool,
  )

  // construct counterfactual pools
  let poolLower = new Pool(
    pool.token0,
    pool.token1,
    pool.fee,
    sqrtRatioX96Lower,
    0 /* liquidity doesn't matter */,
    TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower),
  )
  poolLower = {
    ...poolLower,
    tickSpacing: 10,
    token0Price: pool.token0Price,
    token1Price: pool.token1Price,
  }
  let poolUpper = new Pool(
    pool.token0,
    pool.token1,
    pool.fee,
    sqrtRatioX96Upper,
    0 /* liquidity doesn't matter */,
    TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper),
  )

  poolUpper = {
    ...poolUpper,
    tickSpacing: 10,
    token0Price: pool.token0Price,
    token1Price: pool.token1Price,
  }
  // because the router is imprecise, we need to calculate the position that will be created (assuming no slippage)
  const positionThatWillBeCreated = Position.fromAmounts({
    pool: pool,
    tickLower: tickLower,
    tickUpper: tickUpper,
    ...mintAmounts, // the mint amounts are what will be passed as calldata
    useFullPrecision: false,
  })

  // we want the smaller amounts...
  // ...which occurs at the upper price for amount0...
  const { amount0 } = new Position({
    pool: poolUpper,
    liquidity: positionThatWillBeCreated.liquidity,
    tickLower: tickLower,
    tickUpper: tickUpper,
  }).mintAmounts
  // ...and the lower for amount1
  const { amount1 } = new Position({
    pool: poolLower,
    liquidity: positionThatWillBeCreated.liquidity,
    tickLower: tickLower,
    tickUpper: tickUpper,
  }).mintAmounts

  return { amount0, amount1 }
}
function ratiosAfterSlippage(slippageTolerance, pool) {
  const priceLower = pool.token0Price.asFraction.multiply(
    new Percent(1).subtract(slippageTolerance),
  )
  const priceUpper = pool.token0Price.asFraction.multiply(
    slippageTolerance.add(1),
  )
  let sqrtRatioX96Lower = encodeSqrtRatioX96(
    priceLower.numerator,
    priceLower.denominator,
  )
  if (JSBI.lessThanOrEqual(sqrtRatioX96Lower, TickMath.MIN_SQRT_RATIO)) {
    sqrtRatioX96Lower = JSBI.add(TickMath.MIN_SQRT_RATIO, JSBI.BigInt(1))
  }
  let sqrtRatioX96Upper = encodeSqrtRatioX96(
    priceUpper.numerator,
    priceUpper.denominator,
  )
  if (JSBI.greaterThanOrEqual(sqrtRatioX96Upper, TickMath.MAX_SQRT_RATIO)) {
    sqrtRatioX96Upper = JSBI.subtract(TickMath.MAX_SQRT_RATIO, JSBI.BigInt(1))
  }
  return {
    sqrtRatioX96Lower,
    sqrtRatioX96Upper,
  }
}
const ZERO = JSBI.BigInt(0)
const ONE = JSBI.BigInt(1)
function removeCallParameters(position, options, pool) {
  pool = {
    ...pool,
    tickSpacing: 10,
    token0Price: pool.token0Price,
    token1Price: pool.token1Price,
  }
  const calldatas = []

  const deadline = toHex(options.deadline)
  const tokenId = toHex(options.tokenId)

  // construct a partial position with a percentage of liquidity
  const partialPosition = new Position({
    pool: pool,
    liquidity: options.liquidityPercentage.multiply(position.liquidity)
      .quotient,
    tickLower: position.tickLower,
    tickUpper: position.tickUpper,
  })
  if (!JSBI.greaterThan(partialPosition.liquidity, ZERO)) {
    throw new Error('invariant : ZERO_LIQUIDITY')
  }

  const { amount0: amount0Min, amount1: amount1Min } = burnAmountsWithSlippage(
    options.slippageTolerance,
    pool,
    partialPosition.liquidity,
    position.tickLower,
    position.tickUpper,
  )

  // remove liquidity
  calldatas.push(
    NonfungiblePositionManager.INTERFACE.encodeFunctionData(
      'decreaseLiquidity',
      [
        {
          tokenId,
          liquidity: toHex(partialPosition.liquidity),
          amount0Min: toHex(amount0Min),
          amount1Min: toHex(amount1Min),
          deadline,
        },
      ],
    ),
  )

  const { expectedCurrencyOwed0, expectedCurrencyOwed1, ...rest } =
    options.collectOptions
  calldatas.push(
    ...NonfungiblePositionManager.encodeCollect({
      tokenId: toHex(options.tokenId),
      // add the underlying value to the expected currency already owed
      expectedCurrencyOwed0: expectedCurrencyOwed0.add(
        CurrencyAmount.fromRawAmount(
          expectedCurrencyOwed0.currency,
          amount0Min,
        ),
      ),
      expectedCurrencyOwed1: expectedCurrencyOwed1.add(
        CurrencyAmount.fromRawAmount(
          expectedCurrencyOwed1.currency,
          amount1Min,
        ),
      ),
      ...rest,
    }),
  )

  if (options.liquidityPercentage.equalTo(ONE)) {
    if (options.burnToken) {
      calldatas.push(
        NonfungiblePositionManager.INTERFACE.encodeFunctionData('burn', [
          tokenId,
        ]),
      )
    }
  }

  return {
    calldata:  new Interface(IMulticall.abi).encodeFunctionData('multicall', [
      calldatas,
    ]),
    value: toHex(0),
  }
}

function burnAmountsWithSlippage(
  slippageTolerance,
  pool,
  liquidity,
  tickLower,
  tickUpper,
) {
  // get lower/upper prices
  const { sqrtRatioX96Upper, sqrtRatioX96Lower } = ratiosAfterSlippage(
    slippageTolerance,
    pool,
  )

  // construct counterfactual pools
  let poolLower = new Pool(
    pool.token0,
    pool.token1,
    pool.fee,
    sqrtRatioX96Lower,
    0 /* liquidity doesn't matter */,
    TickMath.getTickAtSqrtRatio(sqrtRatioX96Lower),
  )
  poolLower = {
    ...poolLower,
    tickSpacing: 10,
    token0Price: pool.token0Price,
    token1Price: pool.token1Price,
  }
  let poolUpper = new Pool(
    pool.token0,
    pool.token1,
    pool.fee,
    sqrtRatioX96Upper,
    0 /* liquidity doesn't matter */,
    TickMath.getTickAtSqrtRatio(sqrtRatioX96Upper),
  )
  poolUpper = {
    ...poolUpper,
    tickSpacing: 10,
    token0Price: pool.token0Price,
    token1Price: pool.token1Price,
  }

  // we want the smaller amounts...
  // ...which occurs at the upper price for amount0...
  const amount0 = new Position({
    pool: poolUpper,
    liquidity: liquidity,
    tickLower: tickLower,
    tickUpper: tickUpper,
  }).amount0
  // ...and the lower for amount1
  const amount1 = new Position({
    pool: poolLower,
    liquidity: liquidity,
    tickLower: tickLower,
    tickUpper: tickUpper,
  }).amount1

  return { amount0: amount0.quotient, amount1: amount1.quotient }
}
