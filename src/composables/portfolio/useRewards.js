import { InitializeMetamask } from '@/lib/utils/metamask'
import { ethers } from 'ethers'
import rewards_abi from '@/lib/abi/Rewards.json'
import { useAutoCompound } from '../poolActions/deposit/useAutoCompound'
import { configService } from '@/services/config/config.service'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'
import { formatNotificationDate, getShortHourString } from '@/lib/utils'
import { networkId } from '@/composables/useNetwork'
import successSound from '@/assets/sounds/success_sound.mp3'
import errorSound from '@/assets/sounds/error_sound.mp3'
import 'vue3-toastify/dist/index.css'
import { BACKEND_URL } from '../pools/mappings'
import axios from 'axios'

export async function claimRewards(rewards) {
  const playSuccess = new Audio(successSound)
  const playError = new Audio(errorSound)
  let ConfirmToastPending = null
  try {
    const trades = (await axios.get(`${BACKEND_URL[56]}/output`)).data
    let _trades = trades.filter(
      (item) => parseFloat(item.timestamp) >= Date.now() / 1000 - 5 * 60,
    )
    if (_trades.length > 0) {
      ConfirmToastPending = toast.warn(Toast, {
        data: {
          header_text: 'Claim rewards',
          toast_text: `Claiming your rewards is currently unavailable due to a recent trade. Please wait 5 minutes from the last trade time. The last trade occurred at ${getShortHourString(
            _trades[_trades.length - 1].timestamp,
          )}`,
          tx_link: '',
          speedUp: '/',
        },
        position: toast.POSITION.TOP_RIGHT,
        theme: 'dark',
        closeOnClick: false,
      })
      return
    }
    if (!rewards.formatted_rewards) {
      const zero_pool_rewards = rewards[ethers.constants.AddressZero]
      if (zero_pool_rewards) {
        rewards = [zero_pool_rewards]
      } else {
        rewards = Object.values(rewards)
      }
    } else {
      rewards = [rewards]
    }

    const mmProvider = await InitializeMetamask()
    if (mmProvider) {
      const rewardsContract = new ethers.Contract(
        process.env.VUE_APP_REWARDS_CONTRACT_BINANCE,
        rewards_abi,
        mmProvider.getSigner(),
      )
      for (let i = 0; i < rewards.length; i++) {
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

        const value = rewards[i].rewards.proofs.proofs
          ? rewards[i].rewards.proofs.value
          : rewards[i].rewards.value
        const proofs = rewards[i].rewards.proofs.proofs
          ? rewards[i].rewards.proofs.proofs
          : rewards[i].rewards.proofs
        let tx = await rewardsContract.claim(
          proofs,
          value[1],
          value[2],
          value[3],
        )
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
          closeButton: true,
          type: 'success',
          isLoading: false,
        })
        window.location.reload()
      }
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
        closeButton: true,
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
  window.location.reload()
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
