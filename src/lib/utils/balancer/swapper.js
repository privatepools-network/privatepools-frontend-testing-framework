import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import { Vault__factory, LidoRelayer__factory } from '@balancer-labs/typechain'
import { sendTransaction } from '@/lib/utils/balancer/web3'
import exchangeProxyAbi from '@/lib/abi/ExchangeProxy.json'
import configs from '@/lib/config'
import { getWstETHByStETH, isStETH } from './lido'
import { configService } from '@/services/config/config.service'
import { SwapKind } from '@balancer-labs/balancer-js'
import { bnum } from '..'
import { networkId } from '@/composables/useNetwork'
//import { BigNumber } from '@ethersproject/bignumber'

export async function swapIn(
  network,
  provider,
  sorReturn,
  tokenInAmount,
  tokenOutAmountMin,
) {
  if (isStETH(sorReturn.v2result.tokenIn, sorReturn.v2result.tokenOut)) {
    return lidoBatchSwapGivenIn(
      network,
      provider,
      sorReturn.v2result.tokenIn,
      sorReturn.v2result.tokenOut,
      tokenInAmount,
      tokenOutAmountMin,
      sorReturn.v2result.swaps,
      sorReturn.v2result.tokenAddresses,
    )
  } else if (sorReturn.isV1swap) {
    return batchSwapGivenInV1(
      network,
      provider,
      sorReturn.tokenIn,
      sorReturn.tokenOut,
      tokenInAmount,
      tokenOutAmountMin,
      sorReturn.v1result[0],
    )
  } else if (sorReturn.v2result.tokenIn && sorReturn.v2result.tokenOut) {
    return batchSwapGivenInV2(
      network,
      provider,
      sorReturn.v2result.tokenIn,
      sorReturn.v2result.tokenOut,
      tokenInAmount,
      tokenOutAmountMin,
      sorReturn.v2result.swaps,
      sorReturn.v2result.tokenAddresses,
    )
  }
}

export async function swapOut(
  network,
  provider,
  sorReturn,
  tokenInAmountMax,
  tokenOutAmount,
) {
  if (isStETH(sorReturn.v2result.tokenIn, sorReturn.v2result.tokenOut)) {
    return lidoBatchSwapGivenOut(
      network,
      provider,
      sorReturn.v2result.tokenIn,
      sorReturn.v2result.tokenOut,
      tokenInAmountMax,
      tokenOutAmount,
      sorReturn.v2result.swaps,
      sorReturn.v2result.tokenAddresses,
    )
  } else if (sorReturn.isV1swap) {
    return batchSwapGivenOutV1(
      network,
      provider,
      sorReturn.tokenIn,
      sorReturn.tokenOut,
      tokenInAmountMax,
      sorReturn.v1result[0],
    )
  } else if (sorReturn.v2result.tokenIn && sorReturn.v2result.tokenOut) {
    return batchSwapGivenOutV2(
      network,
      provider,
      sorReturn.v2result.tokenIn,
      sorReturn.v2result.tokenOut,
      tokenInAmountMax,
      tokenOutAmount,
      sorReturn.v2result.swaps,
      sorReturn.v2result.tokenAddresses,
    )
  }
}

export async function batchSwapGivenInV1(
  network,
  web3,
  tokenIn,
  tokenOut,
  tokenInAmount,
  tokenOutAmountMin,
  swaps,
) {
  console.log('[Swapper] batchSwapGivenInV1')
  const overrides = {}

  if (
    tokenIn ===
    configService.getNetworkConfig(networkId.value).nativeAsset.address
  ) {
    overrides.value = tokenInAmount.toHexString()
  }

  try {
    return sendTransaction(
      web3,
      configs[network].addresses.exchangeProxy,
      exchangeProxyAbi,
      'multihopBatchSwapExactIn',
      [
        swaps,
        tokenIn,
        tokenOut,
        tokenInAmount.toString(),
        tokenOutAmountMin.toString(),
      ],
      overrides,
    )
  } catch (e) {
    console.log('[Swapper] batchSwapGivenInV1 Error:', e)
    return Promise.reject(e)
  }
}

export async function batchSwapGivenOutV1(
  network,
  web3,
  tokenIn,
  tokenOut,
  tokenInAmountMax,
  swaps,
) {
  console.log('[Swapper] batchSwapGivenOutV1')
  const overrides = {}

  if (
    tokenIn ===
    configService.getNetworkConfig(networkId.value).nativeAsset.address
  ) {
    overrides.value = tokenInAmountMax.toHexString()
  }

  try {
    return sendTransaction(
      web3,
      configs[network].addresses.exchangeProxy,
      exchangeProxyAbi,
      'multihopBatchSwapExactOut',
      [swaps, tokenIn, tokenOut, tokenInAmountMax.toString()],
      overrides,
    )
  } catch (e) {
    console.log('[Swapper] batchSwapGivenOutV1 Error:', e)
    return Promise.reject(e)
  }
}

async function batchSwapGivenInV2(
  network,
  web3,
  tokenIn,
  tokenOut,
  tokenInAmount,
  tokenOutAmountMin,
  swaps,
  tokenAddresses,
) {
  console.log('[Swapper] batchSwapGivenInV2')
  const overrides = {}

  if (tokenIn === AddressZero) {
    overrides.value = tokenInAmount.toHexString()
  }

  const address = await web3.getSigner().getAddress()

  const funds = {
    sender: address,
    recipient: address,
    fromInternalBalance: false,
    toInternalBalance: false,
  }

  // Limits:
  // +ve means max to send
  // -ve mean min to receive
  // For a multihop the intermediate tokens should be 0
  const limits = []
  tokenAddresses.forEach((token, i) => {
    if (token.toLowerCase() === tokenIn.toLowerCase()) {
      limits[i] = tokenInAmount.toString()
    } else if (token.toLowerCase() === tokenOut.toLowerCase()) {
      limits[i] = tokenOutAmountMin.mul(-1).toString()
    } else {
      limits[i] = '0'
    }
  })
  console.log('Limits', limits)

  try {
    // Do a single swap instead of a batch to save gas
    if (swaps.length == 1) {
      console.log('[Swapper] Overriding with single swap() GivenIn')

      const single = {
        poolId: swaps[0].poolId,
        kind: SwapKind.GivenIn,
        assetIn: tokenAddresses[swaps[0].assetInIndex],
        assetOut: tokenAddresses[swaps[0].assetOutIndex],
        amount: swaps[0].amount,
        userData: swaps[0].userData,
      }

      return sendTransaction(
        web3,
        configs[network].addresses.vault,
        Vault__factory.abi,
        'swap',
        [single, funds, tokenOutAmountMin.toString(), MaxUint256],
        overrides,
      )
    }

    return sendTransaction(
      web3,
      configs[network].addresses.vault,
      Vault__factory.abi,
      'batchSwap',
      [SwapKind.GivenIn, swaps, tokenAddresses, funds, limits, MaxUint256],
      overrides,
    )
  } catch (e) {
    console.log('[Swapper] batchSwapGivenInV2 Error:', e)
    return Promise.reject(e)
  }
}

/**
 * Join a Boosted Pool (StablePhantom) using a batch swap
 */
export async function boostedJoinBatchSwap(
  network,
  web3,
  swaps,
  tokenAddresses,
  tokenOut,
  amountsInMap,
  amountOutMin,
) {
  try {
    const address = await web3.getSigner().getAddress()
    const overrides = {}
    const tokensIn = Object.keys(amountsInMap)

    const funds = {
      sender: address,
      recipient: address,
      fromInternalBalance: false,
      toInternalBalance: false,
    }

    // Limits:
    // +ve means max to send
    // -ve mean min to receive
    // For a multihop the intermediate tokens should be 0
    const limits = []
    tokenAddresses.forEach((token, i) => {
      if (tokensIn.includes(token.toLowerCase())) {
        limits[i] = amountsInMap[token].toString()
      } else if (token.toLowerCase() === tokenOut.toLowerCase()) {
        limits[i] = amountOutMin.mul(-1).toString()
      } else {
        limits[i] = '0'
      }
    })

    return sendTransaction(
      web3,
      configs[network].addresses.vault,
      Vault__factory.abi,
      'batchSwap',
      [SwapKind.GivenIn, swaps, tokenAddresses, funds, limits, MaxUint256],
      overrides,
    )
  } catch (error) {
    console.log('[Swapper] batchSwapGivenInV2 Error:', error)
    throw error
  }
}

/**
 * Exit a Boosted Pool (StablePhantom) using a batch swap
 */
export async function boostedExitBatchSwap(
  network,
  web3,
  swaps,
  tokenAddresses,
  tokenIn,
  amountIn,
  amountsOutMap,
  swapKind = SwapKind.GivenIn,
) {
  try {
    const address = await web3.getSigner().getAddress()
    const overrides = {}
    const tokensOut = Object.keys(amountsOutMap)

    const funds = {
      sender: address,
      recipient: address,
      fromInternalBalance: false,
      toInternalBalance: false,
    }

    // Limits:
    // +ve means max to send
    // -ve mean min to receive
    // For a multihop the intermediate tokens should be 0
    const limits = []
    tokenAddresses.forEach((token, i) => {
      if (tokensOut.includes(token.toLowerCase())) {
        limits[i] = bnum(amountsOutMap[token]).times(-1).toString()
      } else if (token.toLowerCase() === tokenIn.toLowerCase()) {
        limits[i] = bnum(amountIn).abs().toString()
      } else {
        limits[i] = '0'
      }
    })

    console.log('limits', limits)

    return sendTransaction(
      web3,
      configs[network].addresses.vault,
      Vault__factory.abi,
      'batchSwap',
      [swapKind, swaps, tokenAddresses, funds, limits, MaxUint256],
      overrides,
    )
  } catch (error) {
    console.log('[Swapper] batchSwapGivenInV2 Error:', error)
    throw error
  }
}

async function batchSwapGivenOutV2(
  network,
  web3,
  tokenIn,
  tokenOut,
  tokenInAmountMax,
  tokenOutAmount,
  swaps,
  tokenAddresses,
) {
  console.log('[Swapper] batchSwapGivenOutV2')
  const overrides = {}

  if (tokenIn === AddressZero) {
    overrides.value = tokenInAmountMax.toHexString()
  }

  const address = await web3.getSigner().getAddress()

  const funds = {
    sender: address,
    recipient: address,
    fromInternalBalance: false,
    toInternalBalance: false,
  }

  // Limits:
  // +ve means max to send
  // -ve mean min to receive
  // For a multihop the intermediate tokens should be 0
  const limits = []
  tokenAddresses.forEach((token, i) => {
    if (token.toLowerCase() === tokenIn.toLowerCase()) {
      limits[i] = tokenInAmountMax.toString()
    } else if (token.toLowerCase() === tokenOut.toLowerCase()) {
      limits[i] = tokenOutAmount.mul(-1).toString()
    } else {
      limits[i] = '0'
    }
  })
  console.log('Limits', limits)

  try {
    // Do a single swap instead of a batch to save gas
    if (swaps.length == 1) {
      console.log('[Swapper] Overriding with single swap() GivenOut')

      const single = {
        poolId: swaps[0].poolId,
        kind: SwapKind.GivenOut,
        assetIn: tokenAddresses[swaps[0].assetInIndex],
        assetOut: tokenAddresses[swaps[0].assetOutIndex],
        amount: swaps[0].amount,
        userData: swaps[0].userData,
      }

      return sendTransaction(
        web3,
        configs[network].addresses.vault,
        Vault__factory.abi,
        'swap',
        [single, funds, tokenInAmountMax.toString(), MaxUint256],
        overrides,
      )
    }

    return sendTransaction(
      web3,
      configs[network].addresses.vault,
      Vault__factory.abi,
      'batchSwap',
      [SwapKind.GivenOut, swaps, tokenAddresses, funds, limits, MaxUint256],
      overrides,
    )
  } catch (e) {
    console.log('[Swapper] batchSwapGivenOutV2 Error:', e)
    return Promise.reject(e)
  }
}

async function lidoBatchSwapGivenIn(
  network,
  web3,
  tokenIn,
  tokenOut,
  tokenInAmount,
  tokenOutAmountMin,
  swaps,
  tokenAddresses,
) {
  console.log('[Swapper] lidoBatchSwapGivenIn')
  const overrides = {}

  if (tokenIn === AddressZero) {
    overrides.value = tokenInAmount.toHexString()
  }

  // Convert tokenIn/tokenOut so that it matches what's in tokenAddresses
  const { stETH, wstETH } = configService.network.addresses
  if (tokenIn === stETH.toLowerCase()) {
    tokenIn = wstETH.toLowerCase()
    tokenInAmount = await getWstETHByStETH(tokenInAmount)
  } else if (tokenOut === stETH.toLowerCase()) {
    tokenOut = wstETH.toLowerCase()
    tokenOutAmountMin = await getWstETHByStETH(tokenOutAmountMin)
  }

  const address = await web3.getSigner().getAddress()

  const funds = {
    sender: address,
    recipient: address,
    fromInternalBalance: false,
    toInternalBalance: false,
  }

  // Limits:
  // +ve means max to send
  // -ve mean min to receive
  // For a multihop the intermediate tokens should be 0
  const limits = []
  tokenAddresses.forEach((token, i) => {
    if (token.toLowerCase() === tokenIn.toLowerCase()) {
      limits[i] = tokenInAmount.toString()
    } else if (token.toLowerCase() === tokenOut.toLowerCase()) {
      limits[i] = tokenOutAmountMin.mul(-1).toString()
    } else {
      limits[i] = '0'
    }
  })
  console.log('Limits', limits)

  try {
    // Do a single swap instead of a batch to save gas
    if (swaps.length == 1) {
      console.log('[Swapper] Overriding with single swap() GivenIn')

      const single = {
        poolId: swaps[0].poolId,
        kind: SwapKind.GivenIn,
        assetIn: tokenAddresses[swaps[0].assetInIndex],
        assetOut: tokenAddresses[swaps[0].assetOutIndex],
        amount: swaps[0].amount,
        userData: swaps[0].userData,
      }

      return sendTransaction(
        web3,
        configs[network].addresses.lidoRelayer,
        LidoRelayer__factory.abi,
        'swap',
        [single, funds, tokenOutAmountMin.toString(), MaxUint256],
        overrides,
      )
    }

    return sendTransaction(
      web3,
      configs[network].addresses.lidoRelayer,
      LidoRelayer__factory.abi,
      'batchSwap',
      [SwapKind.GivenIn, swaps, tokenAddresses, funds, limits, MaxUint256],
      overrides,
    )
  } catch (e) {
    console.log('[Swapper] batchSwapGivenIn Error:', e)
    return Promise.reject(e)
  }
}

async function lidoBatchSwapGivenOut(
  network,
  web3,
  tokenIn,
  tokenOut,
  tokenInAmountMax,
  tokenOutAmount,
  swaps,
  tokenAddresses,
) {
  console.log('[Swapper] lidoBatchSwapGivenOut')
  const overrides = {}

  if (tokenIn === AddressZero) {
    overrides.value = tokenInAmountMax.toHexString()
  }

  // Convert tokenIn/tokenOut so that it matches what's in tokenAddresses
  const { stETH, wstETH } = configService.network.addresses
  if (tokenIn === stETH.toLowerCase()) {
    tokenIn = wstETH.toLowerCase()
    tokenInAmountMax = await getWstETHByStETH(tokenInAmountMax)
  } else if (tokenOut === stETH.toLowerCase()) {
    tokenOut = wstETH.toLowerCase()
    tokenOutAmount = await getWstETHByStETH(tokenOutAmount)
  }

  const address = await web3.getSigner().getAddress()

  const funds = {
    sender: address,
    recipient: address,
    fromInternalBalance: false,
    toInternalBalance: false,
  }

  // Limits:
  // +ve means max to send
  // -ve mean min to receive
  // For a multihop the intermediate tokens should be 0
  const limits = []
  tokenAddresses.forEach((token, i) => {
    if (token.toLowerCase() === tokenIn.toLowerCase()) {
      limits[i] = tokenInAmountMax.toString()
    } else if (token.toLowerCase() === tokenOut.toLowerCase()) {
      limits[i] = tokenOutAmount.mul(-1).toString()
    } else {
      limits[i] = '0'
    }
  })
  console.log('Limits', limits)

  try {
    // Do a single swap instead of a batch to save gas
    if (swaps.length == 1) {
      console.log('[Swapper] Overriding with single swap() GivenOut')

      const single = {
        poolId: swaps[0].poolId,
        kind: SwapKind.GivenOut,
        assetIn: tokenAddresses[swaps[0].assetInIndex],
        assetOut: tokenAddresses[swaps[0].assetOutIndex],
        amount: swaps[0].amount,
        userData: swaps[0].userData,
      }

      return sendTransaction(
        web3,
        configs[network].addresses.lidoRelayer,
        LidoRelayer__factory.abi,
        'swap',
        [single, funds, tokenInAmountMax.toString(), MaxUint256],
        overrides,
      )
    }

    return sendTransaction(
      web3,
      configs[network].addresses.lidoRelayer,
      LidoRelayer__factory.abi,
      'batchSwap',
      [SwapKind.GivenOut, swaps, tokenAddresses, funds, limits, MaxUint256],
      overrides,
    )
  } catch (e) {
    console.log('[Swapper] batchSwapGivenOut Error:', e)
    return Promise.reject(e)
  }
}
