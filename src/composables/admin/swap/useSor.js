import { ref, computed, reactive, toRefs } from 'vue'
import { BigNumber, formatFixed, parseFixed } from '@ethersproject/bignumber'
import { Zero, WeiPerEther as ONE } from '@ethersproject/constants'
import { BigNumber as OldBigNumber } from 'bignumber.js'
import { SwapTypes } from '@wavelength/sor2'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { scale, bnum } from '@/lib/utils'
import {
  getWrapOutput,
  unwrap,
  wrap,
  WrapType,
} from '@/lib/utils/balancer/wrapper'
import {
  SorManager,
  LiquiditySelection,
} from '@/lib/utils/balancer/helpers/sor/sorManager'
import { useIntervalFn } from '@vueuse/core'
import { swapIn, swapOut } from '@/lib/utils/balancer/swapper'
import { configService } from '@/services/config/config.service'

import useNumbers from '@/composables/useNumbers'
import { getStETHByWstETH } from '@/lib/utils/balancer/lido'
import { formatUnits, isAddress, parseUnits } from 'ethers/lib/utils'
import { getJsonRpcProvider } from '@/composables/useProvider'
import { networkId } from '@/composables/useNetwork'
import { ethers } from 'ethers'
import { useApproveTokens } from '@/composables/poolActions/deposit/useApproveTokens'

const GAS_PRICE = process.env.VUE_APP_GAS_PRICE || '100000000000'
const MAX_POOLS = process.env.VUE_APP_MAX_POOLS || '4'
const MIN_PRICE_IMPACT = 0.0001
const HIGH_PRICE_IMPACT_THRESHOLD = 0.05
const state = reactive({
  validationErrors: {
    highPriceImpact: false,
  },
  submissionError: null,
})

export default function useSor({
  exactIn,
  tokenInAddressInput,
  tokenInAmountInput,
  tokenOutAddressInput,
  tokenOutAmountInput,
  tokens,
  wrapType,
  tokenInAmountScaled,
  tokenOutAmountScaled,
  sorConfig = {
    refetchPools: true,
    handleAmountsOnFetchPools: true,
  },
  tokenIn,
  tokenOut,
  slippageBufferRate,
  nativeTokenPrice,
}) {
  let sorManager = undefined
  const pools = ref([])
  const sorReturn = ref({
    isV1swap: false,
    isV1best: false,
    hasSwaps: false,
    tokenIn: '',
    tokenOut: '',
    returnDecimals: 18,
    returnAmount: Zero,
    marketSpNormalised: '0',
    v1result: [[], Zero, new OldBigNumber(0)],
    v2result: {
      tokenAddresses: [],
      swaps: [],
      swapAmount: Zero,
      returnAmount: Zero,
      returnAmountConsideringFees: Zero,
      tokenIn: '',
      tokenOut: '',
      marketSp: '0',
    },
  })
  const trading = ref(false)
  const confirming = ref(false)
  const priceImpact = ref(0)
  const latestTxHash = ref('')
  const poolsLoading = ref(true)

  const isV1Supported = computed(() =>
    networkId.value
      ? isAddress(
          configService.getNetworkConfig(networkId.value).addresses
            .exchangeProxy,
        )
      : false,
  )

  const { fNum } = useNumbers()
  const sorManagerInitialized = ref(false)
  const sorManagerRef = ref(null)
  const liquiditySelection = ref({})

  async function init() {
    await initSor()
    await handleAmountChange()
  }

  useIntervalFn(async () => {
    if (sorConfig.refetchPools && sorManager) {
      fetchPools()
    }
  }, 30 * 1e3)

  function resetState() {
    state.validationErrors.highPriceImpact = false

    state.submissionError = null
  }

  async function initSor() {
    let config = configService.getNetworkConfig(networkId.value)
    const poolsUrlV1 = `${config.poolsUrlV1}?timestamp=${Date.now()}`
    const subgraphUrl = config.poolsUrlV2

    // If V1 previously selected on another network then it uses this and returns no liquidity.
    if (!isV1Supported.value) {
      liquiditySelection.value = LiquiditySelection.V2
    }
    sorManager = new SorManager(
      isV1Supported.value,
      getJsonRpcProvider(networkId.value),
      BigNumber.from(GAS_PRICE),
      Number(MAX_POOLS),

      networkId.value,
      config.addresses.weth,
      poolsUrlV1,
      subgraphUrl,
    )

    sorManagerInitialized.value = true
    sorManagerRef.value = sorManager

    fetchPools()
  }

  async function fetchPools() {
    if (!sorManager) {
      return
    }

    console.time('[SOR] fetchPools')
    await sorManager.fetchPools()
    console.timeEnd('[SOR] fetchPools')
    poolsLoading.value = false
    // Updates any swaps with up to date pools/balances
    if (sorConfig.handleAmountsOnFetchPools) {
      handleAmountChange()
    }
  }

  async function handleAmountChange() {
    const amount = exactIn.value
      ? tokenInAmountInput.value
      : tokenOutAmountInput.value
    // Avoid using SOR if querying a zero value or (un)wrapping trade
    const zeroValueTrade = amount === '' || amount === '0' || isNaN(amount)
    if (zeroValueTrade) {
      tokenInAmountInput.value = amount
      tokenOutAmountInput.value = amount
      priceImpact.value = 0
      sorReturn.value.hasSwaps = false
      sorReturn.value.returnAmount = Zero
      return
    }

    const tokenInAddress = tokenInAddressInput.value
    const tokenOutAddress = tokenOutAddressInput.value

    if (!tokenInAddress || !tokenOutAddress) {
      if (exactIn.value) tokenOutAmountInput.value = ''
      else tokenInAmountInput.value = ''
      return
    }

    const tokenInDecimals = tokens.value.find(
      (t) => t.address == tokenInAddress,
    ).decimals
    const tokenOutDecimals = tokens.value.find(
      (t) => t.address == tokenOutAddress,
    ).decimals

    if (wrapType.value !== WrapType.NonWrap) {
      const wrapper =
        wrapType.value === WrapType.Wrap ? tokenOutAddress : tokenInAddress

      if (exactIn.value) {
        tokenInAmountInput.value = amount

        const outputAmount = await getWrapOutput(
          wrapper,
          wrapType.value,
          amount,
        )
        tokenOutAmountInput.value = outputAmount
      } else {
        tokenOutAmountInput.value = amount

        const inputAmount = await getWrapOutput(
          wrapper,
          wrapType.value === WrapType.Wrap ? WrapType.Unwrap : WrapType.Wrap,
          amount,
        )
        tokenInAmountInput.value = inputAmount
      }

      sorReturn.value.hasSwaps = false
      priceImpact.value = 0
      return
    }

    if (!sorManager || !sorManager.hasPoolData()) {
      if (exactIn.value) tokenOutAmountInput.value = ''
      else tokenInAmountInput.value = ''
      return
    }

    if (exactIn.value) {
      await setSwapCost(
        tokenOutAddressInput.value,
        tokenOutDecimals,
        sorManager,
      )

      const tokenInAmountNormalised = new OldBigNumber(
        amount.toFixed(tokenInDecimals),
      ) // Normalized value
      const tokenInAmountScaled = scale(
        tokenInAmountNormalised,
        tokenInDecimals,
      )

      console.log('[SOR Manager] swapExactIn')

      const swapReturn = await sorManager.getBestSwap(
        tokenInAddress,
        tokenOutAddress,
        tokenInDecimals,
        tokenOutDecimals,
        SwapTypes.SwapExactIn,
        tokenInAmountScaled,
        tokenInDecimals,
        liquiditySelection.value,
      )

      sorReturn.value = swapReturn // TO DO - is it needed?
      const tokenOutAmountNormalised = bnum(
        formatFixed(swapReturn.returnAmount, tokenOutDecimals),
      )
      tokenOutAmountInput.value =
        tokenOutAmountNormalised.toNumber() > 0
          ? tokenOutAmountNormalised.toFixed(6, OldBigNumber.ROUND_DOWN)
          : ''

      if (!sorReturn.value.hasSwaps) {
        priceImpact.value = 0
      } else {
        let returnAmtNormalised = bnum(
          formatFixed(swapReturn.returnAmount, tokenOutDecimals),
        )

        returnAmtNormalised = await adjustedPiAmount(
          returnAmtNormalised,
          tokenOutAddress,
          tokenOutDecimals,
        )

        const effectivePrice = tokenInAmountNormalised.div(returnAmtNormalised)
        const priceImpactCalc = effectivePrice
          .div(swapReturn.marketSpNormalised)
          .minus(1)

        priceImpact.value = OldBigNumber.max(
          priceImpactCalc,
          MIN_PRICE_IMPACT,
        ).toNumber()
      }
    } else {
      // Notice that outputToken is tokenOut if swapType == 'swapExactIn' and tokenIn if swapType == 'swapExactOut'
      await setSwapCost(tokenInAddressInput.value, tokenInDecimals, sorManager)

      let tokenOutAmountNormalised = new OldBigNumber(
        amount.toFixed(tokenOutDecimals),
      )
      const tokenOutAmount = scale(tokenOutAmountNormalised, tokenOutDecimals)

      console.log('[SOR Manager] swapExactOut')

      const swapReturn = await sorManager.getBestSwap(
        tokenInAddress,
        tokenOutAddress,
        tokenInDecimals,
        tokenOutDecimals,
        SwapTypes.SwapExactOut,
        tokenOutAmount,
        tokenOutDecimals,
        liquiditySelection.value,
      )

      sorReturn.value = swapReturn // TO DO - is it needed?

      const tradeAmount = swapReturn.returnAmount
      const tokenInAmountNormalised = bnum(
        formatFixed(tradeAmount, tokenInDecimals),
      )
      tokenInAmountInput.value =
        tokenInAmountNormalised.toNumber() > 0
          ? tokenInAmountNormalised.toFixed(6, OldBigNumber.ROUND_UP)
          : ''

      if (!sorReturn.value.hasSwaps) {
        priceImpact.value = 0
      } else {
        tokenOutAmountNormalised = await adjustedPiAmount(
          tokenOutAmountNormalised,
          tokenOutAddress,
          tokenOutDecimals,
        )

        const effectivePrice = tokenInAmountNormalised.div(
          tokenOutAmountNormalised,
        )
        const priceImpactCalc = effectivePrice
          .div(swapReturn.marketSpNormalised)
          .minus(1)

        priceImpact.value = OldBigNumber.max(
          priceImpactCalc,
          MIN_PRICE_IMPACT,
        ).toNumber()
      }
    }

    pools.value = sorManager.selectedPools

    state.validationErrors.highPriceImpact =
      priceImpact.value >= HIGH_PRICE_IMPACT_THRESHOLD
  }

  function txHandler(tx, action) {
    confirming.value = false

    let summary = ''
    const tokenInAmountFormatted = fNum(tokenInAmountInput.value, 'token')
    const tokenOutAmountFormatted = fNum(tokenOutAmountInput.value, 'token')

    const tokenInSymbol = tokenIn.value.symbol
    const tokenOutSymbol = tokenOut.value.symbol

    if (['wrap', 'unwrap'].includes(action)) {
      summary = `transactionSummary.wrapUnwrap, ${[
        tokenInAmountFormatted,
        tokenInSymbol,
        tokenOutSymbol,
      ]}`
    } else {
      summary = `${tokenInAmountFormatted} ${tokenInSymbol} -> ${tokenOutAmountFormatted} ${tokenOutSymbol}`
    }

    // addTransaction({
    //   id: tx.hash,
    //   type: 'tx',
    //   action,
    //   summary,
    //   details: {
    //     tokenIn: tokenIn.value,
    //     tokenOut: tokenOut.value,
    //     tokenInAddress: tokenInAddressInput.value,
    //     tokenOutAddress: tokenOutAddressInput.value,
    //     tokenInAmount: tokenInAmountInput.value,
    //     tokenOutAmount: tokenOutAmountInput.value,
    //     exactIn: exactIn.value,
    //     quote: getQuote(),
    //     priceImpact: priceImpact.value,
    //     slippageBufferRate: slippageBufferRate.value,
    //   },
    // })

    // txListener(tx, {
    //   onTxConfirmed: () => {
    //     trading.value = false
    //     latestTxHash.value = tx.hash
    //     trackGoal(Goals.Swapped)
    //   },
    //   onTxFailed: () => {
    //     trading.value = false
    //   },
    // })
    return summary
  }

  async function trade(successCallback = null) {
    console.log(exactIn.value)
    await handleAmountChange()
    console.log(sorReturn.value)
    trading.value = true
    confirming.value = true
    state.submissionError = null

    const tokenInAddress = tokenInAddressInput.value
    const tokenOutAddress = tokenOutAddressInput.value
    const tokenInDecimals = tokens.value.find(
      (t) => t.address == tokenInAddress,
    ).decimals
    const tokenOutDecimals = tokens.value.find(
      (t) => t.address == tokenOutAddress,
    ).decimals
    const tokenInAmountScaled = tokenInAmountInput.value
    let mmProvider = await InitializeMetamask()
    if (wrapType.value == WrapType.Wrap) {
      try {
        const tx = await wrap(
          networkId.value,
          mmProvider,
          tokenOutAddress,
          tokenInAmountScaled,
        )
        console.log('Wrap tx', tx)

        txHandler(tx, 'wrap')

        if (successCallback != null) {
          successCallback()
        }
      } catch (e) {
        console.log(e)
        state.submissionError = e.message
        trading.value = false
        confirming.value = false
      }
      return
    } else if (wrapType.value == WrapType.Unwrap) {
      try {
        const tx = await unwrap(
          networkId.value,
          mmProvider,
          tokenInAddress,
          tokenInAmountScaled,
        )
        console.log('Unwrap tx', tx)

        txHandler(tx, 'unwrap')

        if (successCallback != null) {
          successCallback()
        }
      } catch (e) {
        console.log(e)
        state.submissionError = e.message
        trading.value = false
        confirming.value = false
      }
      return
    }

    if (exactIn.value) {
      const tokenOutAmount = tokenOutAmountInput.value
      console.log(slippageBufferRate)
      console.log(nativeTokenPrice)
      const minAmount = getMinOut(tokenOutAmount, tokenOutDecimals)
      const sr = sorReturn.value

      try {
        const tx = await swapIn(
          networkId.value,
          mmProvider,
          sr,
          ethers.utils.parseUnits(
            tokenInAmountScaled.toFixed(tokenInDecimals),
            tokenInDecimals,
          ),
          minAmount,
        )
        console.log('Swap in tx', tx)

        txHandler(tx, 'trade')

        if (successCallback != null) {
          successCallback()
        }
        return tx
      } catch (e) {
        console.log(e)
        state.submissionError = e.message
        trading.value = false
        confirming.value = false
        return false
      }
    } else {
      const tokenInAmountMax = getMaxIn(tokenInAmountScaled, tokenInDecimals)
      const sr = sorReturn.value
      const tokenOutAmountScaled = tokenOutAmountInput.value
      let result = await useApproveTokens(
        [tokenInAddress],
        [ethers.utils.formatUnits(tokenInAmountMax, tokenInDecimals)],
        await mmProvider.getSigner().getAddress(),
      )
      if (!result) return
      try {
        const tx = await swapOut(
          networkId.value,
          mmProvider,
          sr,
          tokenInAmountMax,
          ethers.utils.parseUnits(
            tokenOutAmountScaled.toFixed(tokenOutDecimals),
            tokenOutDecimals,
          ),
        )
        console.log('Swap out tx', tx)

        txHandler(tx, 'trade')

        if (successCallback != null) {
          successCallback()
        }
        return tx
      } catch (e) {
        console.log(e)
        state.submissionError = e.message
        trading.value = false
        confirming.value = false
        return false
      }
    }
  }

  // Uses stored market prices to calculate price of native asset in terms of token
  function calculateEthPriceInToken(tokenAddress) {
    const ethPriceFiat = nativeTokenPrice.value
    const tokenPriceFiat = tokens.value.find(
      (t) => t.address == tokenAddress,
    ).price
    if (tokenPriceFiat === 0) return bnum(0)
    const ethPriceToken = bnum(ethPriceFiat / tokenPriceFiat)
    return ethPriceToken
  }

  // Sets SOR swap cost for more efficient routing
  async function setSwapCost(tokenAddress, tokenDecimals, sorManager) {
    await sorManager.setCostOutputToken(
      tokenAddress,
      tokenDecimals,
      calculateEthPriceInToken(tokenAddress).toString(),
    )
  }

  function getMaxIn(amount, decimals) {
    amount = ethers.utils.parseUnits(amount.toFixed(decimals), decimals)
    return amount
      .mul(parseFixed(String(1 + slippageBufferRate.value), 18))
      .div(ONE)
    // let percent = amount.div(100 / slippageBufferRate.value)
    // return amount.add(percent)
  }

  function getMinOut(amount, decimals) {
    let fixedAmount = amount.toFixed(decimals)
    amount = ethers.utils.parseUnits(fixedAmount, decimals)
    return amount
      .mul(ONE)
      .div(parseFixed(String(1 + slippageBufferRate.value), 18))
  }

  function getQuote() {
    const maximumInAmount =
      tokenInAmountScaled != null ? getMaxIn(tokenInAmountScaled.value) : Zero

    const minimumOutAmount =
      tokenOutAmountScaled != null
        ? getMinOut(tokenOutAmountScaled.value)
        : Zero

    return {
      feeAmountInToken: '0',
      feeAmountOutToken: '0',
      maximumInAmount,
      minimumOutAmount,
    }
  }

  /**
   * Under certain circumstance we need to adjust an amount
   * for the price impact calc due to background wrapping taking place
   * e.g. when trading weth to wstEth.
   */
  async function adjustedPiAmount(amount, address, decimals) {
    if (
      address ===
      configService.getNetworkConfig(networkId.value).addresses.wstETH
    ) {
      const denormAmount = parseUnits(amount.toString(), decimals)
      const denormStEthAmount = await getStETHByWstETH(denormAmount)
      return bnum(formatUnits(denormStEthAmount, decimals))
    }
    return amount
  }

  return {
    ...toRefs(state),
    sorManager,
    sorReturn,
    pools,
    initSor,
    init,
    handleAmountChange,
    exactIn,
    trade,
    trading,
    priceImpact,
    latestTxHash,
    fetchPools,
    poolsLoading,
    getQuote,
    resetState,
    confirming,

    // For Tests
    setSwapCost,
    sorManagerInitialized,
    sorManagerRef,
  }
}
