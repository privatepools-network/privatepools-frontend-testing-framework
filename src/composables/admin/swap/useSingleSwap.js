import { ethers } from 'ethers'
import vaultAbi from '@/lib/abi/VaultAbi.json'

export async function SingleSwap(
  signer,
  vaultAddress,
  poolId,
  tokenIn,
  tokenOut,
  amountIn,
) {
  let vault = new ethers.Contract(vaultAddress, vaultAbi, signer)
  let addr = await signer.getAddress()
  const fund_settings = {
    sender: addr,
    recipient: addr,
    fromInternalBalance: false,
    toInternalBalance: false,
  }
  let deadline_ts = Date.now() + 1000 * 45
  const deadline = ethers.BigNumber.from(deadline_ts)

  const tokenInAddress = tokenIn.address.toLowerCase()
  const tokenOutAddress = tokenOut.address.toLowerCase()
  const token_data = {}
  token_data[tokenInAddress] = tokenIn
  token_data[tokenInAddress]['limit'] = 0
  token_data[tokenOutAddress] = tokenOut

  const swap = {
    poolId: poolId,
    assetIn: tokenInAddress,
    assetOut: tokenOutAddress,
    amount: amountIn,
  }
  const swap_kind = 0
  const swap_struct = {
    poolId: swap['poolId'],
    kind: swap_kind,
    assetIn: swap['assetIn'],
    assetOut: swap['assetOut'],
    amount: ethers.utils
      .parseUnits(swap['amount'], token_data[swap['assetIn']]['decimals']),
    userData: '0x',
  }

  const fund_struct = {
    sender: fund_settings['sender'],
    fromInternalBalance: fund_settings['fromInternalBalance'],
    recipient: fund_settings['recipient'],
    toInternalBalance: fund_settings['toInternalBalance'],
  }
  // will leave it as a zero for now
  const token_limit = 0
  try {
    const tx = await vault.swap(
      swap_struct,
      fund_struct,
      token_limit,
      deadline.toString(),
    )
    console.log('TX - ', tx)
    let receipt = await tx.wait()
    console.log('RECEIPT - ', receipt)
    return receipt
  } catch (e) {
    console.error(e)
    return null
  }
}
