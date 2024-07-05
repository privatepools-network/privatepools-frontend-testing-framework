import { ref, watch } from 'vue'
import { SwapType, getLimitsForSlippage } from '@balancer-labs/sdk'
import { ethers } from 'ethers'

import * as SDK from '@georgeroman/balancer-v2-pools'
import { weightedBPTForTokensZeroPriceImpact as _bptForTokensZeroPriceImpact } from '@wavelength/sor2'

import binance from '@/lib/config/binance'
import ABI_PPNBuyer from '@/lib/abi/PPNBuyer.json'
import ABI_Vault from '@/lib/abi/VaultAbi.json'
import ABI_ERC20 from '@/lib/abi/ERC20.json'
import { SorManager } from '@/lib/utils/balancer/helpers/sor/sorManager'

const ppnBuyerAddress = '0x939EDCA8F050C1965082aF99ff1b53106E55682D'
const ppnPoolId =
  '0x6ed6da3cb4310efe95a315aacd934c5637d85407000200000000000000000009'

export async function swapPPNToken(token1, token2, amount, signer, method) {
  try {
    const tokenIn = method === 'buy' ? token2 : token1
    const tokenOut = method === 'buy' ? token1 : token2

    approveToken(tokenIn, amount, ppnBuyerAddress, signer)

    const vault = new ethers.Contract(
      binance.addresses.vault,
      ABI_Vault,
      signer,
    )
    const ppnBuyer = new ethers.Contract(ppnBuyerAddress, ABI_PPNBuyer, signer)
    const wallet = await signer.getAddress()

    const batchSwaps = [
      {
        poolId: ppnPoolId,
        assetInIndex: 0,
        assetOutIndex: 1,
        amount: ethers.utils.parseUnits(amount.toString(), tokenIn.decimals),
        userData: '0x',
      },
    ]
    const assets = [tokenIn.address, tokenOut.address]
    const funds = {
      sender: ppnBuyerAddress,
      fromInternalBalance: false,
      recipient: wallet,
      toInternalBalance: false,
    }
    const delats = await vault.queryBatchSwap(
      SwapType.SwapExactIn,
      batchSwaps,
      assets,
      funds,
    )
    const limits = getLimitsForSlippage(
      [tokenIn.address],
      [tokenOut.address],
      SwapType.SwapExactIn,
      delats,
      assets,
      0,
    )
    const deadline = Math.floor(Date.now() / 1000) + 60

    const tx = await ppnBuyer.swapWithVault(
      batchSwaps,
      assets,
      funds,
      limits,
      deadline,
    )
    let receipt = await tx.wait()
    console.log(receipt)
  } catch (error) {
    console.log(error)
  }
}

export async function approveToken(token, tokenAmount, to, signer) {
  try {
    let address = await signer.getAddress()
    console.log({ address })

    const tokenContract = new ethers.Contract(token.address, ABI_ERC20, signer)

    const allowance = await tokenContract.allowance(address, to)
    if (allowance >= tokenAmount) return true

    const transaction = await tokenContract.approve(
      to,
      ethers.utils.parseUnits(tokenAmount.toString(), token.decimals),
    )
    await transaction.wait()
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function getAmountOut(
  tokenIn,
  tokenOut,
  amount,
  signer,
  swapType,
) {
  try {
    const vault = new ethers.Contract(
      binance.addresses.vault,
      ABI_Vault,
      signer,
    )

    const amountoWei = ethers.utils.parseUnits(
      amount.toString(),
      swapType === SwapType.SwapExactIn ? tokenIn.decimals : tokenOut.decimals,
    )
    const batchSwaps = [
      {
        poolId: ppnPoolId,
        assetInIndex: 0,
        assetOutIndex: 1,
        amount: amountoWei,
        userData: '0x',
      },
    ]
    const assets = [tokenIn.address, tokenOut.address]
    const funds = {
      sender: ethers.constants.AddressZero,
      fromInternalBalance: false,
      recipient: ethers.constants.AddressZero,
      toInternalBalance: false,
    }

    const delats = await vault.queryBatchSwap(
      swapType,
      batchSwaps,
      assets,
      funds,
    )

    if (swapType === SwapType.SwapExactIn) {
      return ethers.utils.formatUnits(delats[1].abs(), tokenOut.decimals)
    } else {
      return ethers.utils.formatUnits(delats[0], tokenIn.decimals)
    }
  } catch (error) {
    console.log(error)
  }
}

export const useSwap = (tokenIn, tokenOut, amountIn, swapType, signer) => {
  const amountOut = ref(0)
  const isPossible = ref(0)

  const fetchGetAmountOut = () => {}

  watch(() => {
    fetchGetAmountOut()
  })

  return { amountOut, isPossible }
}
