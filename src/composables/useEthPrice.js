import ABI_PRICEFEED from '@/lib/abi/PriceFeed.json'
import { Contract } from '@ethersproject/contracts'
import { formatUnits } from '@ethersproject/units'

export default async function useEthPrice(provider, address) {
  const priceFeed = new Contract(address, ABI_PRICEFEED, provider)
  let roundData = await priceFeed.latestRoundData()
  let decimals = await priceFeed.decimals()

  return formatUnits(roundData.answer, decimals)
}
