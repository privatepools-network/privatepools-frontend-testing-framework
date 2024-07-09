import { InitializeMetamask } from '@/lib/utils/metamask'
import { ethers } from 'ethers'
import rewards_abi from '@/lib/abi/Rewards.json'
import { useAutoCompound } from '../poolActions/deposit/useAutoCompound'
import { configService } from '@/services/config/config.service'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'
import { formatNotificationDate } from '@/lib/utils'
import { networkId } from '@/composables/useNetwork'
import successSound from '@/assets/sounds/success_sound.mp3'
import errorSound from '@/assets/sounds/error_sound.mp3'
import 'vue3-toastify/dist/index.css'

export async function claimRewards(rewards) {
  const playSuccess = new Audio(successSound)
  const playError = new Audio(errorSound)

  let ConfirmToastPending = null
  try {
    // DELETE LATER
    // await useAutoCompound({
    //   '0x90924102c512f52ffa074f5ede35a72c5f0b43f9000100000000000000000001': {
    //     '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': '10000000000000000',
    //   },
    // })
    const mmProvider = await InitializeMetamask()
    if (mmProvider) {
      ConfirmToastPending = toast.loading(Toast, {
        data: {
          header_text: 'Claim pending',
          toast_text: `Claim confirming - ${formatNotificationDate(
            new Date().getTime(),
          )}`,
          tx_link: '',
          speedUp: '/',
        },
        position: toast.POSITION.TOP_RIGHT,
        theme: 'dark',
        closeOnClick: false,
      })
      const rewardsContract = new ethers.Contract(
        process.env.VUE_APP_REWARDS_CONTRACT_BINANCE,
        rewards_abi,
        mmProvider.getSigner(),
      )
      const value = rewards.rewards.proofs.proofs
        ? rewards.rewards.proofs.value
        : rewards.rewards.value
      const proofs = rewards.rewards.proofs.proofs
        ? rewards.rewards.proofs.proofs
        : rewards.rewards.proofs
      let tx = await rewardsContract.claim(proofs, value[1], value[2], value[3])
      let receipt = await tx.wait()
      console.log('CLAIMED - ', receipt)
      let conf = configService.getNetworkConfig(networkId.value)
      playSuccess.play()
      toast.update(ConfirmToastPending, {
        render: Toast,
        data: {
          header_text: 'Tokens successfully claimed',
          toast_text: ``,
          tx_link: `${conf.explorer}/tx/${tx.hash}`,
          speedUp: '',
        },
        autoClose: 7000,
        closeOnClick: false,
        closeButton: false,
        type: 'success',
        isLoading: false,
      })
    }
  } catch (e) {
    if (ConfirmToastPending) {
      toast.update(ConfirmToastPending, {
        render: Toast,
        data: {
          header_text: 'Claim rejected',
          toast_text: `You rejected claim`,
          tx_link: '',
          speedUp: '',
        },
        autoClose: 7000,
        closeOnClick: false,
        closeButton: false,
        type: 'error',
        isLoading: false,
      })
    } else {
      ConfirmToastPending = toast.error(Toast, {
        data: {
          header_text: 'Claim failed',
          toast_text: `Error happened during tokens claim`,
          tx_link: '',
          speedUp: '/',
        },
        position: toast.POSITION.TOP_RIGHT,
        theme: 'dark',
        closeOnClick: false,
      })
    }
    playError.play()
    console.error(e)
  }
}
// export async function claimRewards(rewards) {
//   try {
//     const mmProvider = await InitializeMetamask()
//     if (mmProvider) {
//       const rewardsContract = new ethers.Contract(
//         process.env.VUE_APP_REWARDS_CONTRACT_BINANCE,
//         rewards_abi,
//         mmProvider.getSigner(),
//       )
//       let tx = await rewardsContract.withdrawAllTokens(rewards.filter((item) => item.reward > 0).map((item) => item.address))
//       let receipt = await tx.wait()
//       console.log("CLAIMED - ", receipt)
//     }
//   }
//   catch (e) {
//     console.error(e)
//   }
// }
