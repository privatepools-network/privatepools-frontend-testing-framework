import { useQuery } from '@tanstack/vue-query'
import useGraphQLQuery from '../../useQuery'
import { configService } from '@/services/config/config.service'
import { networkId } from '../../useNetwork'
import { HISTORIC_PERCENTAGES_QUERY } from '@/composables/queries/historicPercentagesQuery'

export async function GetPoolHistoricPercentages(poolId, network) {
  network = network ? network : networkId.value
  const currentDate = new Date()
  const thirtyDaysAgo = new Date(currentDate - 30 * 24 * 60 * 60 * 1000) // 30 days ago in milliseconds
  const timestampInSeconds = Math.floor(thirtyDaysAgo.getTime() / 1000)
  let query = HISTORIC_PERCENTAGES_QUERY(poolId, timestampInSeconds)
  let poolInfo = await useGraphQLQuery(
    configService.getNetworkConfig(network).subgraph,
    query,
  )
  let result = {}
  if (poolInfo['pools'] && poolInfo['pools'].length > 0) {
    result = {
      historicalTotalShares: poolInfo['pools'][0]['historicalTotalShares'],
      historicalUserBalances: poolInfo['pools'][0]['historicalUserBalances'],
    }
  }
  return result
}

export function usePoolHistoricPercentages(poolId, options = {}) {
  return useQuery(
    ['historicalPercentages', poolId],
    () => GetPoolHistoricPercentages(poolId),
    {
      ...options,
      onError: (error) => {
        console.error('GraphQL query error:', error)
      },
      onSuccess: () => {},
    },
  )
}
