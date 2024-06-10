import { ethers } from 'ethers'
import ABI_ERC20 from '@/lib/abi/ERC20.json'
import { configService } from '@/services/config/config.service'
import { networkId } from '../../useNetwork'
import { InitializeMetamask } from '@/lib/utils/metamask'
import Toast from '@/UI/Toast.vue'
import { toast } from 'vue3-toastify'
import successSound from '@/assets/sounds/success_sound.mp3'
import errorSound from '@/assets/sounds/error_sound.mp3'
import { useSound } from '@vueuse/sound'

const playSuccess = useSound(successSound, { volume: 1 })
const playError = useSound(errorSound, { volume: 1 })
/**
 * Approve ERC20 tokens.
 * @function useApproveTokens
 * @param {string[]} tokens - token addresses array
 * @param {number} amounts - token amounts array
 * @param {string} wallet_address - wallet address from which we will approve the tokens
 * @returns {Promise<boolean>} results of the transactions was it successful or not
 */
export async function useApproveTokens(
  tokens,
  amounts,
  wallet_address,
  depositMethod,
) {
  const approveTokensPending = toast.loading(Toast, {
    data: {
      header_text: 'Approve pending',
      toast_text: 'Approve all tokens for adding liquidity',
      tx_link: '',
      speedUp: '',
    },
    position: toast.POSITION.TOP_RIGHT,
    theme: 'dark',
    closeOnClick: false,
  })

  let approveErrorCheck = false

  let provider = await InitializeMetamask()
  if (!provider) return
  let config = configService.getNetworkConfig(networkId.value)
  let to_addr =
    depositMethod === 'zap' ? config.addresses.zapper : config.addresses.vault
  for (let i = 0; i < tokens.length; i++) {
    const tokenContract = new ethers.Contract(
      tokens[i],
      ABI_ERC20,
      provider.getSigner(),
    )
    let approval_amount = await tokenContract.allowance(wallet_address, to_addr)
    try {
      let decimals = await tokenContract.decimals()
      let amount = ethers.utils.parseUnits(
        amounts[i].toFixed(decimals),
        decimals,
      )
      if (amount.gt(approval_amount)) {
        const tx = await tokenContract.approve(to_addr, amount)
        await tx.wait() // Wait for the transaction to be mined
        console.log('Transaction Hash:', tx.hash)
      }
    } catch (error) {
      console.error('Error sending transaction:', error)
      approveErrorCheck = true
      playError.play()
      toast.update(approveTokensPending, {
        render: Toast,
        data: {
          header_text: 'Approved rejected',
          toast_text: 'You rejected approval',
          tx_link: ``,
          speedUp: '',
        },

        closeOnClick: false,
        autoClose: 5000,
        closeButton: false,
        type: 'error',
        isLoading: false,
      })
      return false
    }
  }
  if (approveErrorCheck === false) {
    playSuccess.play()
  }
  toast.update(approveTokensPending, {
    render: Toast,
    data: {
      header_text: 'Approved Confirm',
      toast_text: 'All tokens have been approved',
      tx_link: ``,
      speedUp: '',
    },

    closeOnClick: false,
    autoClose: 5000,
    closeButton: false,
    type: 'success',
    isLoading: false,
  })
  approveErrorCheck = false
  return true
}
