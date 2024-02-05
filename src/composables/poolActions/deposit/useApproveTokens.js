import { ethers } from 'ethers'
import ABI_ERC20 from '@/lib/abi/ERC20.json'
import { configService } from '@/services/config/config.service'
import { networkId } from '../../useNetwork'
import { InitializeMetamask } from '@/lib/utils/metamask'

/**
 * Approve ERC20 tokens.
 * @function useApproveTokens
 * @param {string[]} tokens - token addresses array
 * @param {number} amounts - token amounts array
 * @param {string} wallet_address - wallet address from which we will approve the tokens
 * @returns {Promise<boolean>} results of the transactions was it successful or not
 */
export async function useApproveTokens(tokens, amounts, wallet_address) {
  let provider = await InitializeMetamask()
  if (!provider) return
  let config = configService.getNetworkConfig(networkId.value)
  let vault_addr = config.addresses.vault
  for (let i = 0; i < tokens.length; i++) {
    const tokenContract = new ethers.Contract(
      tokens[i],
      ABI_ERC20,
      provider.getSigner(),
    )
    let approval_amount = await tokenContract.allowance(
      wallet_address,
      vault_addr,
    )
    try {
      let decimals = await tokenContract.decimals()
      let amount = ethers.utils.parseUnits(
        amounts[i].toFixed(decimals),
        decimals,
      )
      if (amount.gt(approval_amount)) {
        const tx = await tokenContract.approve(vault_addr, amount)
        await tx.wait() // Wait for the transaction to be mined
        console.log('Transaction Hash:', tx.hash)
      }
    } catch (error) {
      console.error('Error sending transaction:', error)
      return false
    }
  }
  return true
}
