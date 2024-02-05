import { ref } from 'vue'
import { lsGet, lsSet } from '@/lib/utils'
import LS_KEYS from '@/constants/local-storage.keys'

export const EthereumTxType = {
  LEGACY: 'Legacy',
  EIP1559: 'EIP1559',
}

const lsEthereumTxType = lsGet(
  LS_KEYS.App.EthereumTxType,
  EthereumTxType.EIP1559,
)

// STATE
export const ethereumTxType = ref(lsEthereumTxType)

// MUTATIONS
function setEthereumTxType(txType) {
  ethereumTxType.value = txType
  lsSet(LS_KEYS.App.EthereumTxType, txType)
}

// INIT
setEthereumTxType(ethereumTxType.value)

export default function useEthereumTxType() {
  return {
    ethereumTxType,
    setEthereumTxType,
  }
}
