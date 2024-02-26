import axios from 'axios'
import contractImage from '@/assets/icons/sidebarIcons/contractImage.svg'
import { generateTimeAgoString, shorten } from '@/lib/utils'
const ETHERSCAN_KEY = `Y8I1PHGDYXFZ9UMUWMWUR2HZVBS4RYJDE8`

export async function useWalletActivity(account, provider) {
  const url = `https://api.bscscan.com/api?module=account&action=txlist&address=${account}&startblock=0&endblock=99999999999&page=1&offset=100&sort=desc&apikey=${ETHERSCAN_KEY}`
  let response = await axios.get(url)
  let txs = response.data.result
  let formattedTxs = []
  for (let i = 0; i < txs.length; i++) {
    let formatted = formatEtherscanTx(txs[i])
    if (formatted) formattedTxs.push(formatted)
  }
  return formattedTxs
}

function formatEtherscanTx(tx) {
  let now = Date.now() / 1000
  let this_day = now - 60 * 60 * 24
  let week_ago = now - 60 * 60 * 24 * 7
  let month_ago = now - 60 * 60 * 24 * 30
  let type =
    tx.timeStamp >= this_day
      ? 'today'
      : tx.timeStamp >= week_ago
      ? 'week'
      : tx.timeStamp >= month_ago
      ? 'month'
      : ''
  if (!type) {
    return null
  }
  if (tx.functionName == '') {
    return {
      label: 'Transfer',
      desc: shorten(tx.hash),
      img: contractImage,
      time: generateCustomTimeAgoString(tx.timeStamp),
      type,
    }
  } else {
    return {
      label: 'Contract interaction',
      desc: tx.functionName,
      img: contractImage,
      time: generateCustomTimeAgoString(tx.timeStamp),
      type,
    }
  }
}

function generateCustomTimeAgoString(timestamp) {
  let timeAgoString = generateTimeAgoString(timestamp)
  let splitted = timeAgoString.split(' ')
  return `${splitted[0]} ${splitted[1].slice(0, 1)}`
}
