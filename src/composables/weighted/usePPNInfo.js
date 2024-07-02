import axios from 'axios'
import { NETWORK_URL } from '../admin/mappings'
import useGraphQLQuery from '../useQuery'

const poolId =
  '0x6ed6da3cb4310efe95a315aacd934c5637d85407000200000000000000000009'
const ppnAddr = '0xc687e90f6a0a7e01d3fd03df2aabcea7f323a845'

const DARKPOOLS_BINANCE_SUBGRAPH = 'https://runrunrunforest.xyz/graphql'

const DARKPOOLS_BINANCE_QUERY = `{
  token(id: "${ppnAddr}") {
    name
    totalBalanceNotional
    totalBalanceUSD
    totalVolumeNotional
    totalVolumeUSD
    latestPrice {
      priceUSD
    }
  }
}`

export async function usePPNInfo() {
  const data = await useGraphQLQuery(
    DARKPOOLS_BINANCE_SUBGRAPH,
    DARKPOOLS_BINANCE_QUERY,
  )

  return {
    priceUsd: data.token.latestPrice?.priceUSD || 0,
    marketCap: data.token.totalBalanceUSD,
    totalVolume: data.token.totalVolumeUSD,
    circulatingSupply: data.token.totalBalanceNotional,
  }
}
