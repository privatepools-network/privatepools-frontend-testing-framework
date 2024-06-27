import axios from 'axios'
import { getHeaderData } from './headerData'
import { ethers } from 'ethers'
export async function getRewards(user) {
  // DELETE LATER
  //user = '0x282a2dfee159aa78ef4e28d2f9fdc9bd92a19b54'
  const url = `${
    process.env.VUE_APP_REWARDS_BACKEND_BINANCE
  }/rewards/${user.toLowerCase()}`
  let rewards_data = []
  try {
    const response = await axios.get(url)
    rewards_data = response.data
  } catch (e) {
    console.error('[SERVER ERROR]', e)
    rewards_data = (
      await axios.get(
        `${
          process.env.VUE_APP_REDUNDANT_REWARDS_BACKEND_BINANCE
        }/rewards/${user.toLowerCase()}`,
      )
    ).data
  }
  const search_tokens_data = await getHeaderData(56)

  return {
    formatted_rewards: formatRewards(
      rewards_data,
      search_tokens_data.search.tokens,
    ),
    rewards: rewards_data,
    tokens: search_tokens_data.search.tokens,
  }
}

function formatRewards(rewards, search_tokens) {
  const formatted_rewards = []
  for (let i = 0; i < rewards.value[1].length; i++) {
    const token_address = rewards.value[1][i]
    const tokenInfo = search_tokens.find(
      (t) => t.address.toLowerCase() == token_address.toLowerCase(),
    )
    if (!tokenInfo) {
      console.error('NOT FOUND ', token_address)
      continue
    }
    const displayAmount = ethers.utils.formatUnits(
      rewards.value[2][i],
      tokenInfo.decimals,
    )
    formatted_rewards.push({
      rewardUsd: displayAmount * tokenInfo.price,
      usdValue: displayAmount * tokenInfo.price,
      ETHValue: displayAmount * tokenInfo.price_ETH,
      rewardETH: displayAmount * tokenInfo.price_ETH,
      BTCValue: displayAmount * tokenInfo.price_BTC,
      rewardBTC: displayAmount * tokenInfo.price_BTC,
      symbol: tokenInfo.symbol,
      value: displayAmount,
    })
  }
  return formatted_rewards
}
