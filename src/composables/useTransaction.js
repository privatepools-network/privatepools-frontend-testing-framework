import config from '@/lib/config'
import { fetchJson } from '@/lib/helpers/util'
import ABI_TxContract from '@/lib/abi/TxContract.json'
import { Interface } from '@ethersproject/abi'
import { Formatter } from '@ethersproject/providers'

import { Network } from './useNetwork'

const iface = new Interface(ABI_TxContract)
const apiLabel = {
  [Network.MAINNET]: 'etherscan.io',
  [Network.ARBITRUM]: 'arbiscan.io',
  [Network.FANTOM]: 'ftmscan.com',
}

export const decodeTransaction = (tx) => {
  if (tx.from && tx.to) {
    const formatter = new Formatter()
    const parsedTx = formatter.transactionResponse(tx)
    const decodeData = iface.parseTransaction({
      data: parsedTx?.data,
      value: parsedTx?.value,
    })

    return decodeData
  }

  return null
}

export default async function useTransaction(
  networkId,
  contractAddress,
  start = 1,
  pageCount,
) {
  const apiUrl = `https://api.${apiLabel[networkId]}/api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&page=${start}&offset=${pageCount}&sort=asc&apikey=${config[networkId]?.keys['apiKey']}`
  const response = await fetchJson(apiUrl)
  if (response.status === '1' && response?.result.length > 0) {
    return response?.result
  }
  return []
}
