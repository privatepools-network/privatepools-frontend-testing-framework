import { useQuery } from '@tanstack/vue-query'
import useGraphQLQuery from '../useQuery'
import { configService } from '@/services/config/config.service'
import { networkId } from '../useNetwork'
import { AllPoolSharesQuery, PoolSharesQuery } from '../queries/poolSharesQuery'

export async function GetPoolShares(poolId, account) {
  let config = configService.getNetworkConfig(networkId.value)
  if (!config.poolsUrlV2) return []
  let data = await useGraphQLQuery(
    config.subgraph,
    PoolSharesQuery(
      account,
      poolId,
    ),
  )
  if (data['poolShares']) {
    let shares = data['poolShares']
    return shares.length > 0 ? shares[0] : {}
  }
  return {}
}

export function usePoolShares(poolId, account, options = {}) {
  return useQuery(
    ['poolShares', account.value],
    () => GetPoolShares(poolId, account),
    {
      ...options,
      onError: (error) => {
        console.error('GraphQL query error:', error)
      },
      onSuccess: () => {},
    },
  )
}

export async function GetAllUserShares(account) {
  let config = configService.getNetworkConfig(networkId.value)
  if (!config.poolsUrlV2) return []
  let data = await useGraphQLQuery(
    config.subgraph,
    AllPoolSharesQuery(account && typeof account == 'string' ? account : ''),
  )
  if (data['poolShares']) {
    let shares = data['poolShares']
    return shares
  }
  return {}
}
