import {
  UNISWAP_ACTIVITY_QUERY,
  UNISWAP_POOL_ACTIVITY_QUERY,
} from '../queries/external/uniswapActivityQuery'
import useGraphQLQuery from '../useQuery'
import { UNISWAP_SUBGRAPHS } from './constants'
import { generateTimeAgoString } from '@/lib/utils'

export async function GetUniswapActivity(networkId) {
  if (networkId != 56) {
    return []
  }
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    UNISWAP_ACTIVITY_QUERY,
  )
  let burns = data['burns']
  let mints = data['mints']
  let swaps = data['swaps']
  let activity = [
    ...burns.map((item) => ({ ...item, type: 'Join' })),
    ...mints.map((item) => ({ ...item, type: 'Exit' })),
    ...swaps.map((item) => ({ ...item, type: 'Swap' })),
  ]
  return formatClActivity(activity)
}
export async function GetUniswapPoolActivity(networkId, poolId) {
  if (networkId != 56) {
    return []
  }
  let data = await useGraphQLQuery(
    UNISWAP_SUBGRAPHS[networkId],
    UNISWAP_POOL_ACTIVITY_QUERY(poolId),
  )
  let burns = data['burns']
  let mints = data['mints']
  let swaps = data['swaps']
  let activity = [
    ...burns.map((item) => ({ ...item, type: 'Join' })),
    ...mints.map((item) => ({ ...item, type: 'Exit' })),
    ...swaps.map((item) => ({ ...item, type: 'Swap' })),
  ]
  return formatClActivity(activity)
}

function formatClActivity(clActivity) {
  let result = []
  let cl_joins = clActivity.filter((item) => item.type == 'Join')
  let cl_exits = clActivity.filter((item) => item.type == 'Exit')
  let cl_swaps = clActivity.filter((item) => item.type == 'Swap')
  console.log('HERE - ', cl_joins)
  result.push(
    ...cl_swaps.map((item) => {
      let out = {
        Actions: 'Swap',
        Details: [
          {
            action: 'Swap',
          },
        ],
        Value: item.amountUSD,
        Time: generateTimeAgoString(item.timestamp),
        Tx: item.transaction.id,
        timestamp: item.timestamp,
        chainId: item.chainId,
      }
      out['Details'][0][item.token0.symbol] = parseFloat(item.amount0).toFixed(
        2,
      )
      out['Details'][0][item.token1.symbol] = parseFloat(item.amount1).toFixed(
        2,
      )
      return out
    }),
  )
  let cl_joinExits = cl_joins.concat(cl_exits)
  result.push(
    ...cl_joinExits.map((item) => {
      let out = {
        Actions: item.type == 'Join' ? 'Deposit' : 'Withdraw',
        Details: [{}],
        Value: parseFloat(item.amountUSD).toFixed(2),
        Time: generateTimeAgoString(item.timestamp),
        Tx: item.transaction.id,
        timestamp: item.timestamp,
        chainId: item.chainId,
      }
      out['Details'][0][item.token0.symbol] = parseFloat(item.amount0).toFixed(
        2,
      )
      out['Details'][0][item.token1.symbol] = parseFloat(item.amount1).toFixed(
        2,
      )
      return out
    }),
  )
  return result
}
