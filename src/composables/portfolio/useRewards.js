import { InitializeMetamask } from "@/lib/utils/metamask"
import { ethers } from 'ethers';
import rewards_abi from '@/lib/abi/Rewards.json'
export async function claimRewards(rewards) {
  try {
    const mmProvider = await InitializeMetamask()
    if (mmProvider) {
      const rewardsContract = new ethers.Contract(
        process.env.VUE_APP_REWARDS_CONTRACT_BINANCE,
        rewards_abi,
        mmProvider.getSigner(),
      )
      let tx = await rewardsContract.claim(
        rewards.proof,
        rewards.rewards[1],
        rewards.rewards[2],
      )
      let receipt = await tx.wait()
      console.log("CLAIMED - ", receipt)
    }
  }
  catch (e) {
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