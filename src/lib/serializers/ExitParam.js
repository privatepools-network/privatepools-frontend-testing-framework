import { encodeExitStablePool } from '@/lib/utils/balancer/stablePoolEncoding'
import { encodeExitWeightedPool } from '@/lib/utils/balancer/weightedPoolEncoding'
import { parseUnits } from '@ethersproject/units'
import { AddressZero } from '@ethersproject/constants'
import usePoolParameters from '@/composables/pools/usePoolParameters'
import { bnum, groupBy, trim_decimal_overflow } from '@/lib/utils'
export default class ExitParams {
  pool
  config
  isStableLike
  dataEncodeFn
  toInternalBalance = false

  constructor(exchange) {
    this.pool = exchange.pool
    this.config = exchange.config
    this.isStableLike = usePoolParameters(this.pool).isStableLike(
      exchange.pool.value.poolType,
    )
    this.dataEncodeFn = this.isStableLike
      ? encodeExitStablePool
      : encodeExitWeightedPool
  }

  serialize(account, amountsOut, tokensOut, bptIn, exitTokenIndex, exactOut) {
    const parsedAmountsOut = this.parseAmounts(amountsOut)
    const parsedBptIn = parseUnits(
      trim_decimal_overflow(bptIn.toString(), this.pool.value.onchain.decimals-1),
      this.pool.value.onchain.decimals,
    )
    const assets = this.parseTokensOut(tokensOut)
    const txData = this.txData(
      parsedAmountsOut,
      parsedBptIn,
      exitTokenIndex,
      exactOut,
    )

    return [
      this.pool.value.id,
      account,
      account,
      {
        assets,
        minAmountsOut: parsedAmountsOut.map(
          (amount) =>
            // This is a hack to get around rounding issues for MetaStable pools
            // TODO: do this more elegantly
            amount, //.gt(0) ? amount.sub(1) : amount,
        ),
        userData: txData,
        toInternalBalance: this.toInternalBalance,
      },
    ]
  }

  parseAmounts(amounts) {
    return amounts.map((amount, i) => {
      const token = this.pool.value.tokens[i]
      return parseUnits(
        trim_decimal_overflow(amount.toString(), token.decimals),
        token.decimals,
      )
    })
  }

  parseTokensOut(tokensOut) {
    const nativeAsset = this.config.nativeAsset

    return tokensOut.map((address) =>
      address === nativeAsset.address ? AddressZero : address,
    )
  }

  txData(amountsOut, bptIn, exitTokenIndex, exactOut) {
    const isSingleAssetOut = exitTokenIndex !== null

    if (isSingleAssetOut) {
      return this.dataEncodeFn({
        kind: 'ExactBPTInForOneTokenOut',
        bptAmountIn: bptIn,
        exitTokenIndex,
      })
    } else if (exactOut) {
      return this.dataEncodeFn({
        amountsOut,
        maxBPTAmountIn: bptIn,
      })
    } else {
      return this.dataEncodeFn({
        kind: 'ExactBPTInForTokensOut',
        bptAmountIn: bptIn,
      })
    }
  }
}
