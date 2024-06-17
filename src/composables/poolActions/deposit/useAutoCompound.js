import { InitializeMetamask } from '@/lib/utils/metamask'
import { useApproveTokens } from './useApproveTokens'
import { useZapper } from './useZapper'

// Record<pool_addr, Record<token, big_num_amount>>
export async function useAutoCompound(params) {
  let provider = await InitializeMetamask()
  const account = await provider.getSigner().getAddress()
  for (const [key, value] of Object.entries(params)) {
    for (const [tkey, tvalue] of Object.entries(value)) {
      try {
        await useApproveTokens([tkey], [tvalue], account, 'zap')
        await useZapper(key, tkey, tvalue)
      } catch (e) {
        console.error('[AUTO_COMPOUND_ERROR]', e)
      }
    }
  }
}
