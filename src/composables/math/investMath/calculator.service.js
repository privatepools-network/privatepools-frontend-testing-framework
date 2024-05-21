import { parseUnits, formatUnits } from '@ethersproject/units'
import Weighted from './weighted'
import Stable from './stable'
import { bnum, lowercaseKeys } from '@/lib/utils'
import { configService } from '@/services/config/config.service'
import StablePhantom from './stable-phantom'
import { computed } from 'vue'
import usePoolParameters from '@/composables/pools/usePoolParameters'

export default class CalculatorService {
  types = ['send', 'receive']
  weighted
  stable
  stablePhantom
  poolParameters
  constructor(
    pool,
    allTokens,
    balances,
    action,
    useNativeAsset,
    weightedClass = Weighted,
    stableClass = Stable,
    stablePhantomClass = StablePhantom,
    config = configService,
  ) {
    this.pool = pool
    this.poolParameters = usePoolParameters(pool)
    this.allTokens = allTokens
    this.balances = balances
    this.action = action
    this.useNativeAsset = useNativeAsset
    this.config = config
    this.weighted = new weightedClass(this)
    this.stable = new stableClass(this)
    this.stablePhantom = new stablePhantomClass(this)
  }

  priceImpact(tokenAmounts, opts = { exactOut: false, tokenIndex: 0 }) {
    if (this.poolParameters.isStableLikePool.value) {
      if (this.poolParameters.isStablePhantomPool.value) {
        return this.stablePhantom.priceImpact(tokenAmounts, opts)
      } else {
        return this.stable.priceImpact(tokenAmounts, opts)
      }
    }
    return this.weighted.priceImpact(tokenAmounts, opts)
  }

  exactTokensInForBPTOut(tokenAmounts) {
    if (this.poolParameters.isStableLikePool.value) {
      return this.stable.exactTokensInForBPTOut(tokenAmounts)
    }
    return this.weighted.exactTokensInForBPTOut(tokenAmounts)
  }

  exactBPTInForTokenOut(bptAmount, tokenIndex) {
    if (this.poolParameters.isStableLikePool.value) {
      return this.stable.exactBPTInForTokenOut(bptAmount, tokenIndex)
    }
    return this.weighted.exactBPTInForTokenOut(bptAmount, tokenIndex)
  }

  bptInForExactTokenOut(amount, tokenIndex) {
    if (this.poolParameters.isStableLikePool.value) {
      return this.stable.bptInForExactTokenOut(amount, tokenIndex)
    }
    return this.weighted.bptInForExactTokenOut(amount, tokenIndex)
  }

  propMax() {
    let maxAmounts = {
      send: [],
      receive: [],
      fixedToken: 0,
    }
    const type = this.action === 'join' ? 'send' : 'receive'

    this.tokenAddresses.forEach((token, tokenIndex) => {
      let hasBalance = true
      let balance
      if (token === this.config.network.nativeAsset.address) {
        balance = bnum(this.balances.value[token])
          .minus(this.config.network.nativeAsset.minTransactionBuffer)
          .toString()
      } else {
        balance = this.balances.value[token] || '0'
      }
      const amounts = this.propAmountsGiven(balance, tokenIndex, type)

      amounts.send.forEach((amount, amountIndex) => {
        const greaterThanBalance = bnum(amount).gt(
          this.balances.value[this.tokenOf(type, amountIndex)],
        )
        if (greaterThanBalance) hasBalance = false
      })

      if (hasBalance) {
        const currentMaxAmount = parseFloat(maxAmounts.send[tokenIndex] || '0')
        const thisAmount = parseFloat(amounts.send[tokenIndex])
        if (thisAmount > currentMaxAmount) {
          maxAmounts = amounts
          maxAmounts.fixedToken = tokenIndex
        }
      }
    })

    return maxAmounts
  }

  propAmountsGiven(fixedAmount, index, type) {
    if (fixedAmount.trim() === '')
      return { send: [], receive: [], fixedToken: 0 }

    const types = ['send', 'receive']
    const fixedTokenAddress = this.tokenOf(type, index)
    const fixedToken = this.allTokens.value[fixedTokenAddress]
    if (!fixedToken) return []
    const fixedDenormAmount = parseUnits(fixedAmount, fixedToken.decimals)
    const fixedRatio = this.ratioOf(type, index)
    const amounts = {
      send: this.sendTokens.map(() => ''),
      receive: this.receiveTokens.map(() => ''),
      fixedToken: index,
    }

    amounts[type][index] = fixedAmount
    ;[this.sendRatios, this.receiveRatios].forEach((ratios, ratioType) => {
      ratios.forEach((ratio, i) => {
        if (i !== index || type !== types[ratioType]) {
          const tokenAddress = this.tokenOf(types[ratioType], i)
          const token = lowercaseKeys(this.allTokens.value)[tokenAddress]
          amounts[types[ratioType]][i] = formatUnits(
            fixedDenormAmount.mul(ratio).div(fixedRatio),
            token.decimals,
          )
        }
      })
    })

    return amounts
  }

  denormAmounts(amounts, decimals) {
    return amounts.map((a, i) =>
      parseUnits(parseFloat(a).toFixed(decimals[i]), decimals[i]),
    )
  }

  tokenOf(type, index) {
    return this[`${type}Tokens`][
      Math.min(this[`${type}Tokens`].length - 1, index)
    ]
  }

  ratioOf(type, index) {
    return this[`${type}Ratios`][index]
  }

  get tokenAddresses() {
    if (this.useNativeAsset) {
      return this.pool.value.tokenAddresses.map((address) => {
        if (address === this.config.network.addresses.weth)
          return this.config.network.nativeAsset.address
        return address
      })
    }
    return this.pool.value.tokens.map((t) => t.address)
  }

  get poolTokenBalances() {
    let result = []
    for (const [, value] of Object.entries(this.pool.value.onchain.tokens)) {
      result.push(parseUnits(value.balance, value.decimals))
    }
    return result
  }

  get poolTokenDecimals() {
    return Object.values(this.pool.value.onchain.tokens).map((t) => t.decimals)
  }

  get poolTokenWeights() {
    const normalizedWeights = Object.values(this.pool.value.onchain.tokens).map(
      (t) => t.weight,
    )
    return normalizedWeights.map((weight) => parseUnits(weight.toString(), 18))
  }

  get poolTotalSupply() {
    return parseUnits(
      this.pool.value.onchain.totalSupply,
      this.pool.valueDecimals,
    )
  }

  get poolSwapFee() {
    return parseUnits(this.pool.value.onchain.swapFee, 18)
  }

  get poolDecimals() {
    return this.pool.value.onchain.decimals
  }

  get bptBalance() {
    return this.balances.value[this.pool.value.address]
  }

  get isStablePool() {
    return computed(
      () =>
        !!this.pool.value &&
        this.poolParameters.isStable(this.pool.value.poolType),
    )
  }

  get sendTokens() {
    if (this.action === 'join') return this.tokenAddresses
    return [this.pool.value.address]
  }

  get receiveTokens() {
    if (this.action === 'join') return [this.pool.value.address]
    return this.tokenAddresses
  }

  get sendRatios() {
    if (this.action === 'join') return this.poolTokenBalances
    return [this.poolTotalSupply]
  }

  get receiveRatios() {
    if (this.action === 'join') return [this.poolTotalSupply]
    return this.poolTokenBalances
  }
}
