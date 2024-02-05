import { formatUnits, parseUnits } from '@ethersproject/units'
import { bnum } from '@/lib/utils'

import * as SDK from '@georgeroman/balancer-v2-pools'
import { weightedBPTForTokensZeroPriceImpact as _bptForTokensZeroPriceImpact } from '@wavelength/sor2'

export default class Weighted {
  calc

  constructor(calculator) {
    this.calc = calculator
  }

  exactTokensInForBPTOut(tokenAmounts) {
    const balances = this.calc.poolTokenBalances.map((b) => bnum(b.toString()))
    const weights = this.calc.poolTokenWeights.map((w) => bnum(w.toString()))
    const denormAmounts = this.calc.denormAmounts(
      tokenAmounts,
      this.calc.poolTokenDecimals,
    )
    const amounts = denormAmounts.map((a) => bnum(a.toString()))

    return SDK.WeightedMath._calcBptOutGivenExactTokensIn(
      balances,
      weights,
      amounts,
      bnum(this.calc.poolTotalSupply.toString()),
      bnum(this.calc.poolSwapFee.toString()),
    )
  }

  bptInForExactTokensOut(tokenAmounts) {
    const balances = this.calc.poolTokenBalances.map((b) => bnum(b.toString()))
    const weights = this.calc.poolTokenWeights.map((w) => bnum(w.toString()))
    const denormAmounts = this.calc.denormAmounts(
      tokenAmounts,
      this.calc.poolTokenDecimals,
    )
    const amounts = denormAmounts.map((a) => bnum(a.toString()))

    console.log('bptInForExactTokensOut', tokenAmounts)
    return SDK.WeightedMath._calcBptInGivenExactTokensOut(
      balances,
      weights,
      amounts,
      bnum(this.calc.poolTotalSupply.toString()),
      bnum(this.calc.poolSwapFee.toString()),
    )
  }

  bptInForExactTokenOut(amount, tokenIndex) {
    const tokenBalance = bnum(
      this.calc.poolTokenBalances[tokenIndex].toString(),
    )
    const tokenNormalizedWeight = bnum(
      this.calc.poolTokenWeights[tokenIndex].toString(),
    )
    const bptAmountIn = bnum(
      parseUnits(amount, this.calc.poolTokenDecimals[tokenIndex]).toString(),
    )
    const bptTotalSupply = bnum(this.calc.poolTotalSupply.toString())
    const swapFee = bnum(this.calc.poolSwapFee.toString())

    return SDK.WeightedMath._calcBptInGivenExactTokenOut(
      tokenBalance,
      tokenNormalizedWeight,
      bptAmountIn,
      bptTotalSupply,
      swapFee,
    )
  }

  exactBPTInForTokenOut(bptAmount, tokenIndex) {
    const tokenBalance = bnum(
      this.calc.poolTokenBalances[tokenIndex].toString(),
    )
    const tokenNormalizedWeight = bnum(
      this.calc.poolTokenWeights[tokenIndex].toString(),
    )
    const bptAmountIn = bnum(
      parseUnits(bptAmount.toString(), this.calc.poolDecimals).toString(),
    )

    console.log(
      'xploited exactBPTInForTokenOut',
      bptAmount,
      tokenIndex,
      tokenBalance.toString(),
      tokenNormalizedWeight.toString(),
      bptAmountIn.toString(),
    )

    return SDK.WeightedMath._calcTokenOutGivenExactBptIn(
      tokenBalance,
      tokenNormalizedWeight,
      bptAmountIn,
      bnum(this.calc.poolTotalSupply.toString()),
      bnum(this.calc.poolSwapFee.toString()),
    )
  }

  priceImpact(tokenAmounts, opts) {
    let bptAmount, bptZeroPriceImpact

    if (this.calc.action === 'join') {
      bptAmount = this.exactTokensInForBPTOut(tokenAmounts)
      if (bptAmount < 0) return bnum(0)
      bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts)

      return bnum(1).minus(bptAmount.div(bptZeroPriceImpact))
    } else {
      // Single asset exit
      if (opts.exactOut) {
        bptAmount = this.bptInForExactTokensOut(tokenAmounts)
        bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts)
      } else {
        bptAmount = parseUnits(
          this.calc.bptBalance.toString(),
          this.calc.poolDecimals,
        ).toString()
        tokenAmounts = this.calc.pool.value.tokensList.map((_, i) => {
          if (i !== opts.tokenIndex) return '0'
          const tokenAmount = this.exactBPTInForTokenOut(
            this.calc.bptBalance,
            opts.tokenIndex,
          ).toString()
          return formatUnits(
            tokenAmount,
            this.calc.poolTokenDecimals[opts.tokenIndex],
          ).toString()
        })
        bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts)
      }

      return bnum(bptAmount).div(bptZeroPriceImpact).minus(1)
    }
  }

  bptForTokensZeroPriceImpact(tokenAmounts) {
    const denormAmounts = this.calc.denormAmounts(
      tokenAmounts,
      this.calc.poolTokenDecimals,
    )

    return bnum(
      _bptForTokensZeroPriceImpact(
        this.calc.poolTokenBalances,
        this.calc.poolTokenDecimals,
        this.calc.poolTokenWeights,
        denormAmounts,
        this.calc.poolTotalSupply,
      ).toString(),
    )
  }
}
