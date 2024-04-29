import { computed, ref } from 'vue'
import { bnum } from '@/lib/utils'
import PoolCalculator from '@/composables/math/investMath/calculator.service'
import useSlippage from '@/composables/useSlippage'
import usePoolParameters from '@/composables/pools/usePoolParameters'

export default function useInvestFormMath(
  pool,
  _tokens,
  balances,
  amounts,
  useNativeAsset,
) {
  /**
   * STATE
   */
  const tokens = computed(() => _tokens.length > 0 ? _tokens : pool.value.tokens)
  const batchSwap = ref({})
  const { minusSlippageScaled } = useSlippage()
  /**
   * COMPOSABLES
   */
  let tokenAddresses = tokens.value.map((t) => t.address)
  const { isStablePhantomPool } = usePoolParameters(pool)
  /**
   * Services
   */
  const poolCalculator = new PoolCalculator(
    pool,
    tokens.value,
    balances,
    'join',
    useNativeAsset,
  )

  /**
   * COMPUTED
   */
  const tokenCount = tokenAddresses.length

  // Input amounts can be null so fullAmounts returns amounts for all tokens
  // and zero if null.
  const fullAmounts = computed(() =>
    new Array(tokenCount)
      .fill('0')
      .map((_, i) => (amounts.value[i] ? amounts.value[i].toString() : '0')),
  )

  const hasAmounts = computed(() =>
    fullAmounts.value.some((amount) => bnum(amount).gt(0)),
  )
  const managedPoolWithTradingHalted = computed(
    () =>
      pool.value.onchain &&
      !pool.value.onchain?.swapEnabled &&
      pool.value.poolType == 'Investment',
  )
  const priceImpact = computed(() => {
    console.log(hasAmounts)
    if (!hasAmounts.value && !pool.value.onchain) return 0
    return (
      poolCalculator
        .priceImpact(fullAmounts.value, {
          queryBPT: fullBPTOut.value.toString(),
        })
        .toNumber() || 0
    )
  })

  const fullBPTOut = computed(() => {
    let _bptOut
    if (!pool.value.onchain) return '0'
    if (isStablePhantomPool.value) {
      _bptOut = batchSwap.value
        ? bnum(batchSwap.value.amountTokenOut).abs().toFixed()
        : '0'
    } else {
      _bptOut = poolCalculator
        .exactTokensInForBPTOut(fullAmounts.value)
        .toFixed()
    }

    return _bptOut
  })

  const bptOut = computed(() => {
    if (managedPoolWithTradingHalted.value) return fullBPTOut.value.toFixed()
    return minusSlippageScaled(fullBPTOut.value)
  })

  return {
    priceImpact,
    fullAmounts,
    bptOut,
  }
}
