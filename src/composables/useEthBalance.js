import { formatEther } from '@ethersproject/units'

export default async function useEthBalance(provider, user) {
  const balance = await provider.getBalance(user)
  return formatEther(balance)
}
