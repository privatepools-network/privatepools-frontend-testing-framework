import { useQuery } from '@tanstack/vue-query'
import useGraphQLQuery from '../useQuery'
import { configService } from '@/services/config/config.service'
import { networkId } from '../useNetwork'
import { AllPoolSharesQuery, PoolSharesQuery } from '../queries/poolSharesQuery'
import { ethers } from 'ethers'
import { InitializeMetamask } from '@/lib/utils/metamask'
import erc20Abi from '@/lib/abi/ERC20.json'
export async function GetPoolShares(poolId, account) {
  const mmProvider = await InitializeMetamask()
  const poolContract = new ethers.Contract(
    poolId.slice(0, 42),
    erc20Abi,
    mmProvider,
  )
  const balance = await poolContract.balanceOf(account)

  return {
    balanceRaw: balance,
    balance: ethers.utils.formatEther(balance),
  }
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
