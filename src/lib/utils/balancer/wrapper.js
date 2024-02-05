import { BigNumber } from 'ethers'
import { sendTransaction } from '@/lib/utils/balancer/web3'
import configs from '@/lib/config'
import { configService } from '@/services/config/config.service'
import { getStETHByWstETH, getWstETHByStETH } from './lido'
import { networkId } from '@/composables/useNetwork'

export const WrapType = {
  NonWrap: 0,
  Wrap: 1,
  Unwrap: 2,
}

export const isNativeAssetWrap = (tokenIn, tokenOut) => {
  let config = configService.getNetworkConfig(networkId.value)
  const nativeAddress = config.nativeAsset.address
  const { weth } = config.addresses
  return tokenIn === nativeAddress && tokenOut === weth
}

export const getWrapAction = (tokenIn, tokenOut) => {
  let config = configService.getNetworkConfig(networkId.value)
  const nativeAddress = config.nativeAsset.address
  const { weth, stETH, wstETH } = config.addresses

  if (tokenIn === nativeAddress && tokenOut === weth) return WrapType.Wrap
  if (tokenIn === stETH && tokenOut === wstETH) return WrapType.Wrap

  if (tokenOut === nativeAddress && tokenIn === weth) return WrapType.Unwrap
  if (tokenOut === stETH && tokenIn === wstETH) return WrapType.Unwrap

  return WrapType.NonWrap
}

export const getWrapOutput = (wrapper, wrapType, wrapAmount) => {
  let config = configService.getNetworkConfig(networkId.value)
  if (wrapType === WrapType.NonWrap) throw new Error('Invalid wrap type')
  const { weth, wstETH } = config.addresses

  if (wrapper === weth) return BigNumber.from(wrapAmount)
  if (wrapper === wstETH) {
    return wrapType === WrapType.Wrap
      ? getWstETHByStETH(wrapAmount)
      : getStETHByWstETH(wrapAmount)
  }
  throw new Error('Unknown wrapper')
}

export async function wrap(network, web3, wrapper, amount) {
  try {
    if (wrapper === configs[network].addresses.weth) {
      return wrapNative(network, web3, amount)
    } else if (wrapper === configs[network].addresses.wstETH) {
      return wrapLido(network, web3, amount)
    }
    throw new Error('Unrecognised wrapper contract')
  } catch (e) {
    console.log('[Wrapper] Wrap error:', e)
    return Promise.reject(e)
  }
}

export async function unwrap(network, web3, wrapper, amount) {
  try {
    if (wrapper === configs[network].addresses.weth) {
      return unwrapNative(network, web3, amount)
    } else if (wrapper === configs[network].addresses.wstETH) {
      return unwrapLido(network, web3, amount)
    }
    throw new Error('Unrecognised wrapper contract')
  } catch (e) {
    console.log('[Wrapper] Unwrap error:', e)
    return Promise.reject(e)
  }
}

const wrapNative = async (network, web3, amount) =>
  sendTransaction(
    web3,
    configs[network].addresses.weth,
    ['function deposit() payable'],
    'deposit',
    [],
    { value: amount },
  )

const unwrapNative = (network, web3, amount) =>
  sendTransaction(
    web3,
    configs[network].addresses.weth,
    ['function withdraw(uint256 wad)'],
    'withdraw',
    [amount],
  )

const wrapLido = async (network, web3, amount) =>
  sendTransaction(
    web3,
    configs[network].addresses.wstETH,
    ['function wrap(uint256 _stETHAmount) returns (uint256)'],
    'wrap',
    [amount],
  )

const unwrapLido = async (network, web3, amount) =>
  sendTransaction(
    web3,
    configs[network].addresses.wstETH,
    ['function unwrap(uint256 _wstETHAmount) returns (uint256)'],
    'unwrap',
    [amount],
  )
