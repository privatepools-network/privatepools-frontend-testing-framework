import ABI_ERC20 from '@/lib/abi/ERC20.json'
import { formatUnits } from '@ethersproject/units'
import { ethers } from 'ethers'
export default async function useBalanceInfo(
  tokenAddress,
  provider,
  user,
  decimals = null,
) {
  try {
    const contract = new ethers.Contract(tokenAddress, ABI_ERC20, provider)
    const balance = await contract.balanceOf(user)
    if (!decimals) decimals = await contract.decimals()

    return { balance: formatUnits(balance, decimals), decimals }
  } catch (e) {
    console.error('Error fetching balance for - ', tokenAddress)
    return { balance: 0, decimals: 18 }
  }
}
