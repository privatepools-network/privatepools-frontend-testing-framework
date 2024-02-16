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
import {
  ERC20_ABI,
  NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
  POOL_FACTORY_CONTRACT_ADDRESS,
} from './constants'
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

export async function getPoolInfo(provider, tokenA, tokenB, feeAmount) {
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
}

export async function getPrice(token0, token1, poolInfo) {
  return tickToPrice(token0, token1, poolInfo.tick)
}

export async function constructTakeProfitOrder(
  provider,
  tokenA,
  tokenB,
  amountA,
  amountB,
  feeAmount,
  tickLower,
  tickUpper,
) {
  const poolInfo = await getPoolInfo(provider, tokenA, tokenB, feeAmount)
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
  // Create position from next tick below or one tick below the current tick to boundary tick
  //   let tickLower = tickBoundary;
  //   let tickUpper = tickLower + pool.tickSpacing;
  //   if (tickUpper > pool.tickCurrent) {
  //     tickUpper -= pool.tickSpacing;
  //   }

  //   if (tickLower >= tickUpper) {
  //     tickLower = tickUpper -= pool.tickSpacing;
  //   }

  return Position.fromAmounts({
    pool: pool,
    tickLower: nearestUsableTick(tickLower, TICK_SPACINGS[feeAmount]),
    tickUpper: nearestUsableTick(tickUpper, TICK_SPACINGS[feeAmount]),
    amount0: token0Amount,
    amount1: token1Amount,
    useFullPrecision: true,
  })
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
// export function getDecrementLower(
//   tickLower,
//   pool,
//   baseToken,
//   quoteToken,
//   feeAmount,
// ) {
//   if (baseToken && quoteToken && typeof tickLower === 'number' && feeAmount) {
//     const newPrice = tickToPrice(
//       baseToken,
//       quoteToken,
//       tickLower < 0
//         ? tickLower + TICK_SPACINGS[feeAmount]
//         : tickLower - TICK_SPACINGS[feeAmount],
//     )
//     console.log(
//       'f',
//       tickToPrice(baseToken, quoteToken, tickLower).toSignificant(
//         18,
//         undefined,
//         Rounding.ROUND_UP,
//       ),
//     )
//     console.log('s', newPrice.toSignificant(18, undefined, Rounding.ROUND_UP))
//     return newPrice.toSignificant(18, undefined, Rounding.ROUND_UP)
//   }
//   // use pool current tick as starting tick if we have pool but no tick input
//   if (
//     !(typeof tickLower === 'number') &&
//     baseToken &&
//     quoteToken &&
//     feeAmount &&
//     pool
//   ) {
//     const newPrice = tickToPrice(
//       baseToken,
//       quoteToken,
//       pool.tickCurrent < 0
//         ? pool.tickCurrent + TICK_SPACINGS[feeAmount]
//         : pool.tickCurrent - TICK_SPACINGS[feeAmount],
//     )
//     return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP)
//   }
//   return ''
// }

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
  let tickLower = tryParseTick(token0, token1, feeAmount, lowPrice.toString())
  let tickUpper = tryParseTick(token0, token1, feeAmount, highPrice.toString())
  if (tickLower > tickUpper) {
    let _lower = tickLower
    tickLower = tickUpper
    tickUpper = _lower
  }
  let order = await constructTakeProfitOrder(
    signer,
    token0,
    token1,
    ethers.utils
      .parseUnits(depositAmount0.toString(), token0.decimals)
      .toString(),
    ethers.utils
      .parseUnits(depositAmount1.toString(), token1.decimals)
      .toString(),
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

async function ApproveToken(contract, signer, amount) {
  contract = contract.connect(signer)
  let tx = await contract.approve(
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    amount.toString(),
  )
  console.log('APPROVE - ', tx)
  return await tx.wait()
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
