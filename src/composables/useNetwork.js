import { ref } from 'vue'


/**
 * @typedef {Object} Chain
 * @property {string} name
 * @property {string} code
 * @property {string?} img
 */


export const Network = {
  MAINNET: 1,
  BINANCE: 56,
  POLYGON: 137,
  ARBITRUM: 42161,
  FANTOM: 250,
  NONE: 0,
}

export const DisplayNetwork = {
  56: 'Binance',
  137: 'Polygon',
  42161: 'Arbitrum',
  0: 'None',
}
export const ReversedDisplayNetwork = {
  Binance: Network.BINANCE,
  Polygon: Network.POLYGON,
  Arbitrum: Network.ARBITRUM,
  None: Network.NONE,
}
export const DisplayChain = {
  56: 'BNB',
  137: 'MATIC',
  42161: 'ETH',
  0: 'None',
}

export const networkId = ref(Network.NONE)

export function setNetworkId(id) {
  networkId.value = id
}

export default function useNetwork() {
  return {
    setNetworkId,
    networkId,
  }
}
