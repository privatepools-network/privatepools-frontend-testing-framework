import { InitializeMetamask } from '@/lib/utils/metamask'
import { useApproveTokens } from './useApproveTokens'
import { useZapper } from './useZapper'
import { ethers } from 'ethers'
import { getPoolsData } from '@/composables/data/poolsData'

// Record<pool_addr, Record<token, big_num_amount>>
export async function useAutoCompound(params) {
  let provider = await InitializeMetamask()
  const pools = await getPoolsData(56)
  const account = await provider.getSigner().getAddress()
  for (const [key, value] of Object.entries(params)) {
    for (const [tkey, tvalue] of Object.entries(value)) {
      try {
        await useApproveTokens(
          [tkey],
          [ethers.BigNumber.from(tvalue)],
          account,
          'zap',
          true,
        )
        await useZapper(
          pools.table.find((item) => item.id == key),
          tkey,
          ethers.BigNumber.from(tvalue),
        )
      } catch (e) {
        console.error('[AUTO_COMPOUND_ERROR]', e)
      }
    }
  }
}
