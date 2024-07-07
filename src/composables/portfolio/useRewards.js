import { InitializeMetamask } from '@/lib/utils/metamask'
import { ethers } from 'ethers'
import rewards_abi from '@/lib/abi/Rewards.json'
import { useAutoCompound } from '../poolActions/deposit/useAutoCompound'
export async function claimRewards(rewards) {
  try {
    // DELETE LATER
    // await useAutoCompound({
    //   '0x90924102c512f52ffa074f5ede35a72c5f0b43f9000100000000000000000001': {
    //     '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': '10000000000000000',
    //   },
    // })
    const mmProvider = await InitializeMetamask()
    if (mmProvider) {
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
      let tx = await rewardsContract.claim(
        proofs,
        value[1],
        value[2],
        value[3],
      )
      let receipt = await tx.wait()
      console.log('CLAIMED - ', receipt)
    }
  } catch (e) {
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
