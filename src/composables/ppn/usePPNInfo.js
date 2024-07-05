import { ref, toValue, watchEffect } from 'vue'
import { SwapType, getLimitsForSlippage } from '@balancer-labs/sdk'
import { ethers } from 'ethers'

import useGraphQLQuery from '@/composables/useQuery'
import { networkId } from '@/composables/useNetwork'
import { getJsonRpcProvider } from '@/composables/useProvider'
import { configService } from '@/services/config/config.service'
import ABI_PPNBuyer from '@/lib/abi/PPNBuyer.json'
import ABI_Vault from '@/lib/abi/VaultAbi.json'
import ABI_ERC20 from '@/lib/abi/ERC20.json'

const ppnAddr = '0xc687e90f6a0a7e01d3fd03df2aabcea7f323a845'
const ppnBuyerAddress = '0x939EDCA8F050C1965082aF99ff1b53106E55682D'
const ppnPoolId =
  '0x6ed6da3cb4310efe95a315aacd934c5637d85407000200000000000000000009'

export const usePPNInfo = () => {
  const tokens = ref([])

  const chainId = toValue(networkId)
  const config = configService.getNetworkConfig(chainId)
  const provider = getJsonRpcProvider(chainId)

  const vault = new ethers.Contract(config.addresses.vault, ABI_Vault, provider)
  const ppnBuyer = new ethers.Contract(ppnBuyerAddress, ABI_PPNBuyer, provider)

  const fetchPPNPoolTokens = async () => {
    tokens.value = []

    const query = `{
      pools (where: {tokensList_contains_nocase: ["${ppnAddr}"]}) {
        id
        tokens {
          id
          address
          name
          symbol
          decimals
        }
      }
    }`
    const data = await useGraphQLQuery(config.subgraph, query)

    if (data) {
      data.pools.forEach((item) => {
        tokens.value.concat(
          item.tokens.filter((token) => token.address !== ppnAddr),
        )
      })
    }
  }

  const fetchAmountOut = async (token0, token1, amount) => {
    const [tokenIn, tokenOut, amountIn] = [
      toValue(token0),
      toValue(token1),
      toValue(amount),
    ]

    const amountoWei = ethers.utils.parseUnits(
      amountIn.toString(),
      tokenIn.decimals,
    )
    const batchSwaps = [
      {
        poolId: ppnPoolId,
        assetInIndex: 0,
        assetOutIndex: 1,
        amount: amountoWei,
        userData: '0x',
      },
    ]
    const assets = [tokenIn.address, tokenOut.address]
    const funds = {
      sender: ethers.constants.AddressZero,
      fromInternalBalance: false,
      recipient: ethers.constants.AddressZero,
      toInternalBalance: false,
    }

    const delats = await vault.queryBatchSwap(
      SwapType.SwapExactIn,
      batchSwaps,
      assets,
      funds,
    )

    return ethers.utils.formatUnits(delats[1].abs(), tokenOut.decimals)
  }

  const approveToken = async (token, to, amount) => {
    try {
      const address = await provider.getSigner().getAddress()

      const tokenContract = new ethers.Contract(
        token.address,
        ABI_ERC20,
        provider,
      )

      const allowance = await tokenContract.allowance(address, to)
      if (allowance >= amount) return true

      const transaction = await tokenContract.approve(
        to,
        ethers.utils.parseUnits(amount.toString(), token.decimals),
      )
      await transaction.wait()
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  const tradePPN = async (token0, token1, amount) => {
    const [tokenIn, tokenOut, amountIn] = [
      toValue(token0),
      toValue(token1),
      toValue(amount),
    ]

    if (await approveToken(tokenIn, ppnBuyerAddress, amountIn)) {
      const wallet = await provider.getSigner().getAddress()

      const batchSwaps = [
        {
          poolId: ppnPoolId,
          assetInIndex: 0,
          assetOutIndex: 1,
          amount: ethers.utils.parseUnits(amount.toString(), tokenIn.decimals),
          userData: '0x',
        },
      ]
      const assets = [tokenIn.address, tokenOut.address]
      const funds = {
        sender: ppnBuyerAddress,
        fromInternalBalance: false,
        recipient: wallet,
        toInternalBalance: false,
      }
      const delats = await vault.queryBatchSwap(
        SwapType.SwapExactIn,
        batchSwaps,
        assets,
        funds,
      )
      const limits = getLimitsForSlippage(
        [tokenIn.address],
        [tokenOut.address],
        SwapType.SwapExactIn,
        delats,
        assets,
        0,
      )
      const deadline = Math.floor(Date.now() / 1000) + 60

      const tx = await ppnBuyer.swapWithVault(
        batchSwaps,
        assets,
        funds,
        limits,
        deadline,
      )
      let receipt = await tx.wait()
    }
  }

  watchEffect(() => {
    fetchPPNPoolTokens()
  })

  return { tokens, fetchAmountOut }
}
