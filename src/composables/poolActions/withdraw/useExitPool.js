import { configService } from '@/services/config/config.service'
import { networkId } from '../../useNetwork'
import { InitializeMetamask } from '@/lib/utils/metamask'
import ExitParams from '@/lib/serializers/ExitParam'
import { ethers } from 'ethers'
import VaultAbi from '@/lib/abi/VaultAbi.json'
import { orderBy } from 'lodash'
// import { toast } from 'vue3-toastify'
// import Toast from '@/UI/Toast.vue'
// import 'vue3-toastify/dist/index.css'

/**
 * Exit pool
 * @function useExitPool
 * @param {import('@/composables/pools/usePools').PoolData} pool - pool in which user wants to exit
 * @param {string} account - user address
 * @param {number[]} amountsOut - array with amounts for exiting pool
 * @param {string[]} tokensOut - array of token addresses
 * @param {number} bptIn - minimum bpt
 * @param {number} exactOut - how much tokens will be out in lp token
 * @param {number} tokenOutIndex - index for case when there's only 1 token out
 * @returns {Promise<import('@ethersproject/providers').TransactionReceipt | null>} transaction execution result
 */
export async function useExitPool(
  pool,
  account,
  amountsOut,
  tokensOut,
  bptIn,
  exactOut,
  tokenOutIndex,
  confirmingState,
  // ConfirmToastPending,
) {
  let provider = await InitializeMetamask()
  if (!provider) return
  let config = configService.getNetworkConfig(networkId.value)
  let tokens = tokensOut.map((t, i) => ({ address: t, amount: amountsOut[i] }))
  tokens = sortTokens(tokens)
  tokensOut = tokens.map((t) => t.address)
  let params = new ExitParams({ pool: pool, config: config })
  let txParams = params.serialize(
    account,
    tokens.map((t) => t.amount),
    tokensOut,
    bptIn,
    tokenOutIndex,
    exactOut,
  )
  const vaultContract = new ethers.Contract(
    config.addresses.vault,
    VaultAbi,
    provider.getSigner(),
  )

  try {
    confirmingState.value = true
    var tx = await vaultContract.exitPool(...txParams)

    // await tx.wait()
  } catch (error) {
    console.log('Error sending tx - ', error)

    // toast.update(ConfirmToastPending.value, {
    //   render: Toast,
    //   data: {
    //     header_text: 'Confirm rejected',
    //     toast_text: `You rejected confirm`,
    //     tx_link: '',
    //     speedUp: '',
    //   },
    //   autoClose: 7000,
    //   closeOnClick: false,
    //   closeButton: false,
    //   type: 'error',
    //   isLoading: false,
    // })

    confirmingState.value = false
    return error
  }

  return tx
}

function sortTokens(tokens) {
  return orderBy(tokens, (token) => token.address.toLowerCase(), 'asc')
}