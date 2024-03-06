import { ethers } from 'ethers'
import JSBI from 'jsbi'

import {
  computePoolAddress,
  nearestUsableTick,
  NonfungiblePositionManager,
  Pool,
  Position,
  priceToClosestTick,
  tickToPrice,
  encodeSqrtRatioX96,
  TickMath,
  TICK_SPACINGS,
  FACTORY_ADDRESS,
} from '@uniswap/v3-sdk'
import {
  CurrencyAmount,
  Fraction,
  Percent,
  Price,
  Token,
  Rounding,
} from '@uniswap/sdk-core'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import NonfungiblePositionManagerAbi from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import UniswapFactoryAbi from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'
import {
  ERC20_ABI,
  NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
  POOL_FACTORY_CONTRACT_ADDRESS,
} from './constants'
import { formatUnits, parseUnits } from '@ethersproject/units'
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

  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA,
    tokenB,
    fee: feeAmount,
  })

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
  return Position.fromAmounts({
    pool: pool,
    tickLower: nearestUsableTick(tickLower, TICK_SPACINGS[feeAmount]),
    tickUpper: nearestUsableTick(tickUpper, TICK_SPACINGS[feeAmount]),
    amount0: token0Amount.quotient,
    amount1: token1Amount.quotient,
    useFullPrecision: true,
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

  return nearestUsableTick(tick, TICK_SPACINGS[feeAmount])
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
    pairToken.decimals,
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
) {
  const { tickLower, tickUpper } = parseDisplayTicks(
    token0,
    token1,
    lowPrice,
    highPrice,
    feeAmount,
  )
  const poolInfo = await getPoolInfo(
    signer,
    token0,
    token1,
    feeAmount,
    currentPrice,
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
  await ApproveToken(token1Contract, signer, amount1, token1.decimals)
  await ApproveToken(token0Contract, signer, amount0, token0.decimals)
  await mintPosition(order, signer)
}

export async function AddLiquidityToPosition(
  signer,
  position,
  depositAmount0,
  depositAmount1,
) {
  let parsed0 = tryParseCurrencyAmount(depositAmount0, position.token0)
  let parsed1 = tryParseCurrencyAmount(depositAmount1, position.token1)
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
  await ApproveToken(token1Contract, signer, amount1, position.token1.decimals)
  await ApproveToken(token0Contract, signer, amount0, position.token0.decimals)
  await addLiquidity(order, signer, position.id)

  // const addLiquidityOptions: AddLiquidityOptions = {
  //   deadline: Math.floor(Date.now() / 1000) + 60 * 20,
  //   slippageTolerance: new Percent(50, 10_000),
  //   tokenId,
  // }
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
  )
}

async function ApproveToken(contract, signer, amount) {
  contract = contract.connect(signer)
  let tx = await contract.approve(
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    amount.toString(),
  )
  console.log('APPROVE - ', tx)
  return await tx.wait()
}

function checkTokensSwapped(
  poolInfo,
  token0,
  token1,
  depositAmount0,
  depositAmount1,
) {
  let swapped = false
  if (poolInfo.token0 != token0.address) {
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

async function mintPosition(order, signer) {
  let address = await signer.getAddress()
  const mintOptions = {
    recipient: address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    slippageTolerance: new Percent(50, 10_000),
  }
  const { calldata, value } = NonfungiblePositionManager.addCallParameters(
    order.position,
    mintOptions,
  )

  const transaction = {
    data: calldata,
    to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: ethers.BigNumber.from(value),
    from: address,
    gasLimit: '1000000',
  }

  const txRes = await signer.call(transaction)

  const decodedRes = ethers.utils.defaultAbiCoder.decode(
    ['tuple(uint256, uint128, uint256, uint256)'],
    txRes,
  )
  console.log(decodedRes)
  let tx = await signer.sendTransaction(transaction)
  const receipt = await tx.wait()
  console.log('SUCCESS', receipt)
  return receipt
}
async function addLiquidity(order, signer, tokenId) {
  try {
    let address = await signer.getAddress()
    const addLiquidityOptions = {
      deadline: Math.floor(Date.now() / 1000) + 60 * 20,
      slippageTolerance: new Percent(50, 10_000),
      tokenId,
    }
    const { calldata, value } = NonfungiblePositionManager.addCallParameters(
      order.position,
      addLiquidityOptions,
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
async function removeLiquidity(
  order,
  signer,
  tokenId,
  percent,
  token0,
  token1,
) {
  try {
    let address = await signer.getAddress()
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

    const { calldata, value } = NonfungiblePositionManager.removeCallParameters(
      order.position,
      removeLiquidityOptions,
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
  const configuredPool = new Pool(
    token0,
    token1,
    poolInfo.fee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick,
  )
  let position = token0Changed
    ? Position.fromAmount0({
        pool: configuredPool,
        tickLower: nearestUsableTick(tickLower, TICK_SPACINGS[feeAmount]),
        tickUpper: nearestUsableTick(tickUpper, TICK_SPACINGS[feeAmount]),
        amount0: parsed0.quotient,
      })
    : Position.fromAmount1({
        pool: configuredPool,
        tickLower: nearestUsableTick(tickLower, TICK_SPACINGS[feeAmount]),
        tickUpper: nearestUsableTick(tickUpper, TICK_SPACINGS[feeAmount]),
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
    return token0Changed ? amount0 : amount1
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
      NonfungiblePositionManagerAbi.abi,
      signer,
    )
    let tx = await contract.createAndInitializePoolIfNecessary(
      token0.address,
      token1.address,
      fee,
      `0x${sqrtPrice.toString(16)}`,
    )
    let receipt = await tx.wait()
    console.log('RECEIPT - ', receipt)
    return true
  } catch (e) {
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
  return [amount0wei, amount1wei]
}

export async function fetchPositions(signer, tokens, networkId) {
  const nfpmContract = new ethers.Contract(
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    NonfungiblePositionManagerAbi.abi,
    signer,
  )
  let address = await signer.getAddress()
  address = '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0'
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
        let token0 = convertPairToken(
          tokens.find((item) => item.address == position.token0),
          networkId,
        )
        let token1 = convertPairToken(
          tokens.find((item) => item.address == position.token1),
          networkId,
        )
        let pool = await getPoolInfo(signer, token0, token1, position.fee, null)
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
          amount0: amounts[0],
          amount1: amounts[1],
          amountReadable0: ethers.utils.formatUnits(amounts[0].toString()),
          amountReadable1: ethers.utils.formatUnits(amounts[1].toString()),
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
