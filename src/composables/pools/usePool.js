import { FormatPoolStats } from '@/lib/formatter/poolsFormatter'
import { balancerContractsService } from './onchain/balancer-contract.service'
import { useQuery } from '@tanstack/vue-query'
import { networkId } from '../useNetwork'
import { configService } from '@/services/config/config.service'
import { SINGLE_POOL_QUERY } from '../queries/poolQuery'
import useGraphQLQuery from '../useQuery'
import { setPoolsTvls } from './usePools'
import { orderBy } from 'lodash'
async function querySinglePool(network, id) {
  network = network ? network : networkId.value
  let config = configService.getNetworkConfig(network)
  let url = config.subgraph
  let query = SINGLE_POOL_QUERY(id)
  if (!url) return null
  let data = await useGraphQLQuery(url, query)
  if (data && data['pool']) return data['pool']
  return null
}

export async function GetSinglePool(network, id, toToken = 'USD') {
  network = network ? network : networkId.value
  const poolData = await querySinglePool(network, id)

  const pool = poolData ? FormatPoolStats(poolData) : null
  await setPoolsTvls([pool], toToken)
  pool.lpPrice = pool.totalLiquidity / pool.totalShares
  if (!pool) return pool
  pool.tokens = pool.tokens.map((t) => ({ ...t, id: t.address }))
  pool.tokens = sortTokens(pool.tokens)
  // let onchain = await balancerContractsService.vault.getPoolData(
  //   pool.id,
  //   pool.poolType,
  //   pool.tokens,
  //   network,
  // )
  // if (onchain) return { ...pool, onchain }
  return pool
}

function sortTokens(tokens) {
  return orderBy(tokens, (token) => token.address.toLowerCase(), 'asc')
}

export function usePool(id, options = {}) {
  return useQuery(['poolsOnchain', id], () => GetSinglePool(id), {
    ...options,
    onError: (error) => {
      console.error('GraphQL query error:', error)
    },
    onSuccess: () => {},
  })
}
