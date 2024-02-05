import { computed } from 'vue'
import { parseUnits, formatUnits } from '@ethersproject/units'
import { bnum } from '@/lib/utils'
import BigNumber from 'bignumber.js'

export default function useSlippage() {
  const slippage = 0.01

  const slippageBasisPoints = computed(() => {
    return bnum(slippage).times(10000).toString()
  })

  function minusSlippage(_amount, decimals) {
    let amount = parseUnits(_amount, decimals).toString()
    amount = minusSlippageScaled(amount)

    return formatUnits(amount, decimals)
  }

  function minusSlippageScaled(amount) {
    const delta = bnum(amount)
      .times(slippageBasisPoints.value)
      .div(10000)
      .dp(0, BigNumber.ROUND_UP)

    return bnum(amount).minus(delta).toFixed()
  }

  function addSlippage(_amount, decimals) {
    let amount = parseUnits(_amount, decimals).toString()
    amount = addSlippageScaled(amount)

    return formatUnits(amount, decimals).toString()
  }

  function addSlippageScaled(amount) {
    const delta = bnum(amount)
      .times(slippageBasisPoints.value)
      .div(10000)
      .dp(0, BigNumber.ROUND_DOWN)

    return bnum(amount).plus(delta).toString()
  }

  return { minusSlippage, minusSlippageScaled, addSlippage, addSlippageScaled }
}
