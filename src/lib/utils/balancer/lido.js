import { networkId } from '@/composables/useNetwork'
import { getJsonRpcProvider } from '@/composables/useProvider'
import { configService } from '@/services/config/config.service'
import { Contract } from 'ethers'
import { getAddress } from 'ethers/lib/utils'

export function isStETH(tokenInAddress, tokenOutAddress) {
  const { stETH: stEthAddress } = configService.getNetworkConfig(
    networkId.value,
  ).addresses
  if (!tokenInAddress || !tokenOutAddress || !stEthAddress) return false

  return [tokenInAddress, tokenOutAddress]
    .map(getAddress)
    .includes(getAddress(stEthAddress))
}

/**
 * @notice Get amount of wstETH for a given amount of stETH
 */
export function getWstETHByStETH(stETHAmount) {
  const { wstETH: wstEthAddress } = configService.getNetworkConfig(
    networkId.value,
  ).addresses
  const wstETH = new Contract(
    wstEthAddress,
    [
      'function getWstETHByStETH(uint256 stETHAmount) external view returns (uint256)',
    ],
    getJsonRpcProvider(networkId.value),
  )
  return wstETH.getWstETHByStETH(stETHAmount)
}

/**
 * @notice Get amount of stETH for a given amount of wstETH
 */
export function getStETHByWstETH(wstETHAmount) {
  const { wstETH: wstEthAddress } = configService.getNetworkConfig(
    networkId.value,
  ).addresses
  const wstETH = new Contract(
    wstEthAddress,
    [
      'function getStETHByWstETH(uint256 wstETHAmount) external view returns (uint256)',
    ],
    getJsonRpcProvider(networkId.value),
  )
  return wstETH.getStETHByWstETH(wstETHAmount)
}
