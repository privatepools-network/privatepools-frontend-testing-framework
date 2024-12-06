import { ethers } from 'ethers'
import VaultAbi from '@/lib/abi/VaultAbi.json'
import { parseUnits } from '@ethersproject/units'
import { configService } from '@/services/config/config.service'
import { networkId } from '../../useNetwork'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { encodeJoinWeightedPool } from '@/lib/utils/balancer/weightedPoolEncoding'
import { orderBy } from 'lodash'

//Join Pool (bytes32, address, address, address[], uint256[], bytes, bool)

function roundDown(number, decimals) {
  decimals = decimals || 0
  return (
    Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
  ).toString()
}

/**
 * Join pool.
 * @function useJoinPool
 * @param {import('@/composables/pools/usePools').PoolData} pool - pool in which user wants to join
 * @param {import('@/composables/tokens/useTokenSymbols').Token[]} tokens - array with tokens info for joinin
 * @param {number[]} amounts - array with amounts for joining pool
 * @param {string} wallet_address - wallet address which will perform this tx
 * @param {number} bptOut - balancer minimum out amount
 * @returns {Promise<import('@ethersproject/providers').TransactionReceipt | null>} result of transaction execution
 */
export async function useJoinPool(
  pool,
  tokens,
  amounts,
  wallet_address,
  bptOut,
) {
  let provider = await InitializeMetamask()
  if (!provider) return
  let config = configService.getNetworkConfig(networkId.value)
  const vaultContract = new ethers.Contract(
    config.addresses.vault,
    VaultAbi,
    provider.getSigner(),
  )
  const bnbToken_index = tokens.findIndex(
    (t) => t.address == ethers.constants.AddressZero,
  )
  if (bnbToken_index != -1) {
    tokens[bnbToken_index] = {
      ...tokens[bnbToken_index],
      symbol: 'WBNB',
      address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    }
  }
  tokens = tokens.map((t, i) => ({ ...t, amount: amounts[i] }))
  tokens = sortTokens(tokens)
  const addresses = tokens.map((t) => t.address)
  try {
    const amountsIn = tokens.map((token) => getMaxBalance(token))
    const joinPoolRequest = {
      assets: addresses,
      maxAmountsIn: amountsIn,
      userData: txData(pool, amountsIn, bptOut),
      fromInternalBalance: false,
    }

    var tx = await vaultContract.joinPool(
      pool.id,
      wallet_address,
      wallet_address,
      joinPoolRequest,
    )
    // await tx.wait()
  } catch (error) {
    console.log('Error sending tx - ', error)
    if (!error.error && error.message) {
      return { error: { data: { message: error.message } } }
    }
    return error
  }

  return tx
}

export function getMaxBalance(token) {
  let balance = token.userBalance
    ? parseUnits(token.userBalance.toString(), token.decimals)
    : parseUnits('0', token.decimals)
  let slippage = parseUnits('0.001', token.decimals)
  let amount = token.amount.toString().includes('e')
    ? parseUnits(
        parseFloat(
          roundDown(
            parseFloat(token.amount).toFixed(token.decimals),
            token.decimals,
          ),
        ).toFixed(token.decimals),
        token.decimals,
      )
    : parseUnits(
        roundDown(
          parseFloat(token.amount).toFixed(token.decimals),
          token.decimals,
        ),
        token.decimals,
      )
  if (token.userBalance && amount.gt(balance)) {
    if (amount.sub(balance).gt(slippage)) {
      throw new Error('BAL#406')
    }
    return balance
  }
  return amount
}

/**
 * Format tx data for joining pool
 * @function txData
 * @param {import('@/composables/pools/usePools').PoolData} pool - pool in which user wants to join
 * @param {number[]} amountsIn - array with amounts for joining pool
 * @param {number} minimumBPT - balancer minimum out amount
 * @returns {any} formatted tx data for balancer
 */
function txData(pool, amountsIn, minimumBPT) {
  if (parseFloat(pool.onchain.totalSupply).toString() == '0') {
    return encodeJoinWeightedPool({ kind: 'Init', amountsIn })
  } else {
    if (pool.poolType == 'Investment' && !pool.onchain.swapEnabled) {
      return encodeJoinWeightedPool({
        kind: 'AllTokensInForExactBPTOut',
        bptAmountOut: minimumBPT,
      })
    } else {
      return encodeJoinWeightedPool({
        kind: 'ExactTokensInForBPTOut',
        amountsIn,
        minimumBPT,
      })
    }
  }
}

function sortTokens(tokens) {
  return orderBy(tokens, (token) => token.address.toLowerCase(), 'asc')
}
