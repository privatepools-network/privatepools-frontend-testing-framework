import { Contract } from '@ethersproject/contracts'
import ABI_ERC20 from '@/lib/abi/ERC20.json'

export default async function useDecimals(tokenAddress, provider) {
  const contract = new Contract(tokenAddress, ABI_ERC20, provider)
  const decimals = await contract.decimals()
  return decimals
}
