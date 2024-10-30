import axios from 'axios'
import { getHeaderData } from './headerData'
import { ethers } from 'ethers'

export async function getPoolsRewards(user) {
  //user = '0x0a97304d95f014db2cb98cab7e7457960c6d8386'
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
  const results = {}
  for (const [poolId, value] of Object.entries(rewards_data['proofs'])) {
    const search_tokens_data = await getHeaderData(56)
    const formatted_rewards = formatRewards(
      rewards_data.proofs[poolId],
      search_tokens_data.search.tokens,
    )
    if (formatted_rewards.length == 0) {
      console.log(`ACCOUNT ${user} HAS NO REWARDS`)
    }
    results[poolId] = {
      formatted_rewards,
      rewards: { ...rewards_data, proofs: rewards_data.proofs[poolId] },
      tokens: search_tokens_data.search.tokens,
    }
  }
  return results
}

export async function getRewards(
  user,
  poolAddress = ethers.constants.AddressZero,
) {
  //user = '0x0a97304d95f014db2cb98cab7e7457960c6d8386'

  // DELETE LATER
  const url = `${
    process.env.VUE_APP_REWARDS_BACKEND_BINANCE
  }/rewards/${user.toLowerCase()}/${poolAddress}`
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
        }/rewards/${user.toLowerCase()}/${poolAddress}`,
      )
    ).data
  }
  // let rewards_data = {
  //   proofs: [
  //     '0x6db7cc2b86725a6cf4a7d64962669cf186deaa81267bc8a4889e9df6d51570d7',
  //     '0x23f8a25c5d1be30e3a599500fbedf09bfb1a9e47a3de46bb26440d2e4e31601b',
  //     '0x4e68d64ce23373a5c14e7f230b06121109c884c33b1f1790e5d882e4a8cdd2a3',
  //     '0x127f7a7a4488945f80dddbac5832291ddb0ff71576269f6b40898e27756486da',
  //   ],
  //   value: [
  //     '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0',
  //     '0x0000000000000000000000000000000000000000',
  //     [
  //       '0x2f61d587d2953BD186edCba010A10F437dfaA6Dd',
  //       '0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf',
  //       '0xaE2a4925aFb06Bf97702908cFb9f8afbAC0BFd1e',
  //     ],
  //     [
  //       {
  //         type: 'BigNumber',
  //         hex: '0x94f4c7cb41dde437',
  //       },
  //       {
  //         type: 'BigNumber',
  //         hex: '0x2e22a11741c7259c50',
  //       },
  //       {
  //         type: 'BigNumber',
  //         hex: '0x010047170ed1dae7b86e',
  //       },
  //     ],
  //   ],
  //   pool_rewards: {
  //     '0x52ef5d5633bc7db3a5f5c296ee8711a3b4092a82': {
  //       '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0': {
  //         '0x2f61d587d2953BD186edCba010A10F437dfaA6Dd': {
  //           type: 'BigNumber',
  //           hex: '0x94f4c7cb41dde437',
  //         },
  //         '0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf': {
  //           type: 'BigNumber',
  //           hex: '0x22e6170b2ca7ec8198',
  //         },
  //       },
  //       '0x1000000000000000000000000000000000000000': {
  //         '0x2f61d587d2953BD186edCba010A10F437dfaA6Dd': {
  //           type: 'BigNumber',
  //           hex: '0x00',
  //         },
  //         '0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf': {
  //           type: 'BigNumber',
  //           hex: '0x00',
  //         },
  //       },
  //     },
  //     '0x018526999e56dccd17b5859ad3d3dff5ce4b78a5': {
  //       '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0': {
  //         '0xaE2a4925aFb06Bf97702908cFb9f8afbAC0BFd1e': {
  //           type: 'BigNumber',
  //           hex: '0x010047170ed1dae7b86e',
  //         },
  //       },
  //       '0x1000000000000000000000000000000000000000': {
  //         '0xaE2a4925aFb06Bf97702908cFb9f8afbAC0BFd1e': {
  //           type: 'BigNumber',
  //           hex: '0x00',
  //         },
  //       },
  //     },
  //     '0x8c5c92a2e1362e5528980edbfc2077199c2fff25': {},
  //     '0x01f7e3ac0e75403a57e1a1820879044333c95db8': {
  //       '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0': {
  //         '0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf': {
  //           type: 'BigNumber',
  //           hex: '0xcb57fadd7bd02ae1',
  //         },
  //       },
  //       '0x1000000000000000000000000000000000000000': {
  //         '0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf': {
  //           type: 'BigNumber',
  //           hex: '0x00',
  //         },
  //       },
  //     },
  //     '0x4fe59d902548991bbeb14dfc75f3611522b56844': {
  //       '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0': {
  //         '0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf': {
  //           type: 'BigNumber',
  //           hex: '0x02295ae439ce6ef5b3',
  //         },
  //       },
  //       '0x1000000000000000000000000000000000000000': {
  //         '0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf': {
  //           type: 'BigNumber',
  //           hex: '0x00',
  //         },
  //       },
  //     },
  //     '0xbc8146432a9e8b2eafe479d5b96bd2aa7c9faf7b': {
  //       '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0': {
  //         '0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf': {
  //           type: 'BigNumber',
  //           hex: '0x051864d78cddcf1700',
  //         },
  //       },
  //       '0x1000000000000000000000000000000000000000': {
  //         '0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf': {
  //           type: 'BigNumber',
  //           hex: '0x00',
  //         },
  //       },
  //     },
  //     '0xb40cd9541b52ce6a7478faa9199a518569f45875': {
  //       '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0': {
  //         '0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf': {
  //           type: 'BigNumber',
  //           hex: '0x01e9c8e124342ab4d8',
  //         },
  //       },
  //       '0x1000000000000000000000000000000000000000': {
  //         '0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf': {
  //           type: 'BigNumber',
  //           hex: '0x00',
  //         },
  //       },
  //     },
  //     '0xc38f04ca53355dfb578ad4393ece0454a60d4e55': {
  //       '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0': {
  //         '0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf': {
  //           type: 'BigNumber',
  //           hex: '0x0145a9744cc3002e4c',
  //         },
  //       },
  //       '0x1000000000000000000000000000000000000000': {
  //         '0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf': {
  //           type: 'BigNumber',
  //           hex: '0x00',
  //         },
  //       },
  //     },
  //   },
  // }
  const search_tokens_data = await getHeaderData(56)
  const formatted_rewards = formatRewards(
    rewards_data,
    search_tokens_data.search.tokens,
  )
  if (formatted_rewards.length == 0) {
    console.log(`ACCOUNT ${user} HAS NO REWARDS`)
  }
  return {
    formatted_rewards,
    rewards: rewards_data,
    tokens: search_tokens_data.search.tokens,
  }
}

function formatRewards(rewards, search_tokens) {
  const formatted_rewards = []
  if (!rewards.value || rewards.value.length < 3) {
    return formatted_rewards
  }
  for (let i = 0; i < rewards.value[2].length; i++) {
    const token_address = rewards.value[2][i]
    const tokenInfo = search_tokens.find(
      (t) => t.address.toLowerCase() == token_address.toLowerCase(),
    )
    if (!tokenInfo) {
      console.error('NOT FOUND ', token_address)
      continue
    }
    const displayAmount = ethers.utils.formatUnits(
      rewards.value[3][i],
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
      address:tokenInfo.address,
      value: displayAmount,
      decimals:tokenInfo.decimals,
      pool: rewards.value[1],
    })
  }
  return formatted_rewards
}
