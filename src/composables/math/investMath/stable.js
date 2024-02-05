import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits, formatUnits } from '@ethersproject/units'

import { bnum } from '@/lib/utils'
import OldBigNumber from 'bignumber.js'

import { stableBPTForTokensZeroPriceImpact as _bptForTokensZeroPriceImpact } from '@wavelength/sor2'
import * as SDK from '@georgeroman/balancer-v2-pools'

/**
 * The stableMathEvm works with all values scaled to 18 decimals,
 * all inputs should be scaled appropriately.
 */
export default class Stable {
  calc
  AMP_PRECISION = bnum(1000)

  constructor(calculator) {
    this.calc = calculator
  }

  exactTokensInForBPTOut(tokenAmounts) {
    try {
      const amp = bnum(this.calc.pool.value.onchain.amp?.toString() || '0')
      const ampAdjusted = this.adjustAmp(amp)
      const amounts = this.calc.pool.value.tokens.map(({ priceRate }, i) =>
        this.scaleInput(tokenAmounts[i], priceRate),
      )

      const bptOut = SDK.StableMath._calcBptOutGivenExactTokensIn(
        ampAdjusted,
        this.scaledBalances,
        amounts,
        this.scaledPoolTotalSupply,
        bnum(this.calc.poolSwapFee.toString()),
      )

      return this.scaleOutput(
        bptOut.toString(),
        this.calc.poolDecimals,
        '1',
        OldBigNumber.ROUND_DOWN, // If OUT given IN, round down
      )
    } catch (error) {
      console.error(error)
      return this.scaleOutput(
        '0',
        this.calc.poolDecimals,
        '1',
        OldBigNumber.ROUND_DOWN, // If OUT given IN, round down
      )
    }
  }

  bptInForExactTokensOut(tokenAmounts) {
    const amp = bnum(this.calc.pool.value.onchain.amp?.toString() || '0')
    const ampAdjusted = this.adjustAmp(amp)

    const amounts = this.calc.pool.value.tokens.map(({ priceRate }, i) =>
      this.scaleInput(tokenAmounts[i], priceRate),
    )

    const bptIn = SDK.StableMath._calcBptInGivenExactTokensOut(
      ampAdjusted,
      this.scaledBalances,
      amounts,
      this.scaledPoolTotalSupply,
      bnum(this.calc.poolSwapFee.toString()),
    )

    return this.scaleOutput(
      bptIn.toString(),
      this.calc.poolDecimals,
      '1',
      OldBigNumber.ROUND_UP, // If IN given OUT, round up
    )
  }

  bptInForExactTokenOut(amount, tokenIndex) {
    const amp = bnum(this.calc.pool.value.onchain.amp?.toString() || '0')
    const ampAdjusted = this.adjustAmp(amp)
    const amounts = this.calc.pool.value.tokens.map(({ priceRate }, i) => {
      if (i === tokenIndex) return this.scaleInput(amount, priceRate)
      return bnum('0')
    })

    const bptIn = SDK.StableMath._calcBptInGivenExactTokensOut(
      ampAdjusted,
      this.scaledBalances,
      amounts,
      this.scaledPoolTotalSupply,
      bnum(this.calc.poolSwapFee.toString()),
    )

    return this.scaleOutput(
      bptIn.toString(),
      this.calc.poolDecimals,
      '1',
      OldBigNumber.ROUND_UP, // If IN given OUT, round up
    )
  }

  exactBPTInForTokenOut(bptAmount, tokenIndex) {
    if (bnum(bptAmount).eq(0))
      return this.scaleOutput(
        '0',
        this.calc.poolTokenDecimals[tokenIndex],
        this.calc.pool.value.tokens[tokenIndex].priceRate,
        OldBigNumber.ROUND_DOWN, // If OUT given IN, round down
      )

    const amp = bnum(this.calc.pool.value.onchain.amp?.toString() || '0')
    const ampAdjusted = this.adjustAmp(amp)
    const bptAmountIn = this.scaleInput(bptAmount)

    const tokenAmountOut = SDK.StableMath._calcTokenOutGivenExactBptIn(
      ampAdjusted,
      this.scaledBalances,
      tokenIndex,
      bptAmountIn,
      this.scaledPoolTotalSupply,
      bnum(this.calc.poolSwapFee.toString()),
    )

    return this.scaleOutput(
      tokenAmountOut.toString(),
      this.calc.poolTokenDecimals[tokenIndex],
      this.calc.pool.value.tokens[tokenIndex].priceRate || null,
      OldBigNumber.ROUND_DOWN, // If OUT given IN, round down
    )
  }

  priceImpact(tokenAmounts, opts) {
    let bptAmount
    let bptZeroPriceImpact

    if (this.calc.action === 'join') {
      bptAmount = this.exactTokensInForBPTOut(tokenAmounts)
      if (bptAmount.isLessThan(0)) return bnum(0)
      bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts)

      return bnum(1).minus(bptAmount.div(bptZeroPriceImpact))
    } else {
      // Single asset exit
      if (opts.exactOut) {
        bptAmount = this.bptInForExactTokensOut(tokenAmounts)
        bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts)
      } else {
        bptAmount = parseUnits(
          this.calc.bptBalance,
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

  /**
   *  FUNCTIONS
   */
  bptForTokensZeroPriceImpact(tokenAmounts) {
    const amp = bnum(this.calc.pool.value.onchain.amp?.toString() || '0')
    const ampAdjusted = BigNumber.from(this.adjustAmp(amp).toString())
    const denormAmounts = this.calc.denormAmounts(
      tokenAmounts,
      this.calc.poolTokenDecimals,
    )

    // _bptForTokensZeroPriceImpact is the only stable pool function
    // that requires balances be scaled by the token decimals and not 18
    const balances = this.scaledBalances.map((balance, i) => {
      const normalizedBalance = formatUnits(balance.toString(), 18)
      const denormBalance = parseUnits(
        normalizedBalance,
        this.calc.poolTokenDecimals[i],
      )
      return denormBalance
    })

    const bptZeroImpact = _bptForTokensZeroPriceImpact(
      balances,
      this.calc.poolTokenDecimals,
      denormAmounts,
      this.calc.poolTotalSupply,
      ampAdjusted,
    )

    return bnum(bptZeroImpact.toString())
  }

  get scaledBalances() {
    let result = []
    for (let i = 0; i < this.calc.poolTokenBalances.length; i++) {
      const normalizedBalance = formatUnits(
        this.calc.poolTokenBalances[i],
        this.calc.poolTokenDecimals[i],
      )
      const scaledBalance = this.scaleInput(
        normalizedBalance,
        this.calc.pool.value.tokens[i].priceRate,
      )
      result.push(bnum(scaledBalance.toString()))
    }
    return result

    // return this.calc.poolTokenBalances.map((balance, i) => {
    //   const normalizedBalance = formatUnits(
    //     balance,
    //     this.calc.poolTokenDecimals[i],
    //   )
    //   const scaledBalance = this.scaleInput(
    //     normalizedBalance,
    //     this.calc.pool.value.tokens[i].priceRate,
    //   )
    //   return bnum(scaledBalance.toString())
    // })
  }

  get scaledPoolTotalSupply() {
    const normalizedSupply = formatUnits(
      this.calc.poolTotalSupply,
      this.calc.poolDecimals,
    )
    const scaledSupply = parseUnits(normalizedSupply, 18)
    return bnum(scaledSupply.toString())
  }

  scaleInput(normalizedAmount, priceRate = null) {
    if (priceRate === null) priceRate = '1'

    const denormAmount = bnum(parseUnits(normalizedAmount, 18).toString())
      .times(priceRate)
      .toFixed(0, OldBigNumber.ROUND_UP)

    return bnum(denormAmount.toString())
  }

  scaleOutput(amount, decimals, priceRate, rounding) {
    if (priceRate === null) priceRate = '1'

    const amountAfterPriceRate = bnum(amount).div(priceRate).toString()

    const normalizedAmount = bnum(amountAfterPriceRate)
      .div(parseUnits('1', 18).toString())
      .toFixed(decimals, rounding)
    const scaledAmount = parseUnits(normalizedAmount, decimals)

    return bnum(scaledAmount.toString())
  }

  // Solidity maths uses precison method for amp that must be replicated
  adjustAmp(amp) {
    return amp.times(this.AMP_PRECISION)
  }
}
