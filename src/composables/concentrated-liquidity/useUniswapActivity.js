import { UNISWAP_ACTIVITY_QUERY } from '../queries/external/uniswapActivityQuery'
import useGraphQLQuery from '../useQuery'
import { UNISWAP_SUBGRAPHS } from './constants'

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
  return activity
}
