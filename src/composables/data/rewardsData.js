import axios from 'axios'
import { getHeaderData } from './headerData'
import { ethers } from 'ethers'

export async function getPoolsRewards(user) {
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
  // let rewards_data = {
  //   proofs: {
  //     '0x52ef5d5633bc7db3a5f5c296ee8711a3b4092a82': {
  //       proofs: [
  //         '0xb14b3334b2949131f08bff9de59a0c272b0597e453c60f8c1209eaab5d010bdc',
  //         '0xea781af23fd125f707bf51c9676a1624445cae050463811696d3433e0b0fbafe',
  //         '0x1dcb858badaad6de9f5df1b4e47e31335da61dff1216390d91832e2941c13801',
  //         '0xdc5fe3c7b8cdc2e5119218a188db70a75cf0172b905c9905f19f8b40ce771819',
  //       ],
  //       value: [
  //         '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0',
  //         '0x52ef5d5633bc7db3a5f5c296ee8711a3b4092a82',
  //         [
  //           '0x2f61d587d2953BD186edCba010A10F437dfaA6Dd',
  //           '0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf',
  //         ],
  //         ['10733423487728084023', '643769031345736286616'],
  //       ],
  //     },
  //     '0x018526999e56dccd17b5859ad3d3dff5ce4b78a5': {
  //       proofs: [
  //         '0x053677a4b66f9952ef3f4e7757f9dd9e8b56c6f22555841391ddda77dfb79cf3',
  //         '0xb8724f9002660fadc802595e3bb819c3f8870128e06c80f9f962ccb6b823c859',
  //         '0x742f3d98e69f6c24b6ffc16daa232a430aa786eb76c2dcc6980b99b43a749d6f',
  //         '0x127f7a7a4488945f80dddbac5832291ddb0ff71576269f6b40898e27756486da',
  //       ],
  //       value: [
  //         '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0',
  //         '0x018526999e56dccd17b5859ad3d3dff5ce4b78a5',
  //         ['0xaE2a4925aFb06Bf97702908cFb9f8afbAC0BFd1e'],
  //         ['4727489062265286015086'],
  //       ],
  //     },
  //     '0x01f7e3ac0e75403a57e1a1820879044333c95db8': {
  //       proofs: [
  //         '0x6f393b77e1cd889a98d2cf2b1299a0ebe38ceb593caba402448b28226e03feda',
  //         '0x569bcbebe3b4a9cde0c1492a3cbc1bd25ad69c23e890d24c461eb6f096f7f4a8',
  //         '0x76dca0bd7b38c441d7a09bbfae3c2579b41e8d4d87b1884cb60a95ee114dd285',
  //         '0xdc5fe3c7b8cdc2e5119218a188db70a75cf0172b905c9905f19f8b40ce771819',
  //       ],
  //       value: [
  //         '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0',
  //         '0x01f7e3ac0e75403a57e1a1820879044333c95db8',
  //         ['0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf'],
  //         ['14652455741845154529'],
  //       ],
  //     },
  //     '0x4fe59d902548991bbeb14dfc75f3611522b56844': {
  //       proofs: [
  //         '0x8bd773c08348e82559e9e99f632cdccb6d22d769fdb966d99cfb23f68a2d9681',
  //         '0xfe36aa7db7210196904b616965f762388d7470deb2f6f9aeeaf08cdf815b81e7',
  //         '0x76dca0bd7b38c441d7a09bbfae3c2579b41e8d4d87b1884cb60a95ee114dd285',
  //         '0xdc5fe3c7b8cdc2e5119218a188db70a75cf0172b905c9905f19f8b40ce771819',
  //       ],
  //       value: [
  //         '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0',
  //         '0x4fe59d902548991bbeb14dfc75f3611522b56844',
  //         ['0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf'],
  //         ['39873433187805754803'],
  //       ],
  //     },
  //     '0xbc8146432a9e8b2eafe479d5b96bd2aa7c9faf7b': {
  //       proofs: [
  //         '0x64b6b5c5448d5743a051b3264049418f6c6d8b4ec273b678c9aba021152817e3',
  //         '0x5b27e373ef0f34976e7cc95a256283aeef21df712c86924bc537490f08d1d802',
  //         '0x4e68d64ce23373a5c14e7f230b06121109c884c33b1f1790e5d882e4a8cdd2a3',
  //         '0x127f7a7a4488945f80dddbac5832291ddb0ff71576269f6b40898e27756486da',
  //       ],
  //       value: [
  //         '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0',
  //         '0xbc8146432a9e8b2eafe479d5b96bd2aa7c9faf7b',
  //         ['0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf'],
  //         ['93991487123145824000'],
  //       ],
  //     },
  //     '0xb40cd9541b52ce6a7478faa9199a518569f45875': {
  //       proofs: [
  //         '0x6574a998407f70869c3991387b705db7c878f988327614e6fa1e2502135c75c7',
  //         '0x23f8a25c5d1be30e3a599500fbedf09bfb1a9e47a3de46bb26440d2e4e31601b',
  //         '0x4e68d64ce23373a5c14e7f230b06121109c884c33b1f1790e5d882e4a8cdd2a3',
  //         '0x127f7a7a4488945f80dddbac5832291ddb0ff71576269f6b40898e27756486da',
  //       ],
  //       value: [
  //         '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0',
  //         '0xb40cd9541b52ce6a7478faa9199a518569f45875',
  //         ['0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf'],
  //         ['35292706025499178200'],
  //       ],
  //     },
  //     '0xc38f04ca53355dfb578ad4393ece0454a60d4e55': {
  //       proofs: [
  //         '0x5e93f25723bd18eb40145cd7151693e8848774e0835f2bfe5e2db0be1131e9a8',
  //         '0x5b27e373ef0f34976e7cc95a256283aeef21df712c86924bc537490f08d1d802',
  //         '0x4e68d64ce23373a5c14e7f230b06121109c884c33b1f1790e5d882e4a8cdd2a3',
  //         '0x127f7a7a4488945f80dddbac5832291ddb0ff71576269f6b40898e27756486da',
  //       ],
  //       value: [
  //         '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0',
  //         '0xc38f04ca53355dfb578ad4393ece0454a60d4e55',
  //         ['0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf'],
  //         ['23466415206428585548'],
  //       ],
  //     },
  //     '0x0000000000000000000000000000000000000000': {
  //       proofs: [
  //         '0x6db7cc2b86725a6cf4a7d64962669cf186deaa81267bc8a4889e9df6d51570d7',
  //         '0x23f8a25c5d1be30e3a599500fbedf09bfb1a9e47a3de46bb26440d2e4e31601b',
  //         '0x4e68d64ce23373a5c14e7f230b06121109c884c33b1f1790e5d882e4a8cdd2a3',
  //         '0x127f7a7a4488945f80dddbac5832291ddb0ff71576269f6b40898e27756486da',
  //       ],
  //       value: [
  //         '0x759ee62a73a8a0690a0e20fc489d3f462b4385c0',
  //         '0x0000000000000000000000000000000000000000',
  //         [
  //           '0x2f61d587d2953BD186edCba010A10F437dfaA6Dd',
  //           '0x48a8162b477d3C34E8529e70A4FbE92B9B5031cf',
  //           '0xaE2a4925aFb06Bf97702908cFb9f8afbAC0BFd1e',
  //         ],
  //         [
  //           {
  //             type: 'BigNumber',
  //             hex: '0x94f4c7cb41dde437',
  //           },
  //           {
  //             type: 'BigNumber',
  //             hex: '0x2e22a11741c7259c50',
  //           },
  //           {
  //             type: 'BigNumber',
  //             hex: '0x010047170ed1dae7b86e',
  //           },
  //         ],
  //       ],
  //     },
  //   },
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

export async function getRewards(user, poolId = ethers.constants.AddressZero) {
  // DELETE LATER
  //user = '0x282a2dfee159aa78ef4e28d2f9fdc9bd92a19b54'
  const url = `${
    process.env.VUE_APP_REWARDS_BACKEND_BINANCE
  }/rewards/${user.toLowerCase()}/${poolId}`
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
        }/rewards/${user.toLowerCase()}/${poolId}`,
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
      value: displayAmount,
      pool: rewards.value[1],
    })
  }
  return formatted_rewards
}
