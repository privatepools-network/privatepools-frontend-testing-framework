import { getPrices } from '@/composables/data/pricesData'
import { fetch0xData, LPT_SLIPPAGE, roundDown } from './useZapper'
import { ethers } from 'ethers'
import { default as weightedPoolAbi } from '@/lib/abi/WeightedPool.json'
import { default as vaultAbi } from '@/lib/abi/VaultAbi.json'
import { InitializeMetamask } from '@/lib/utils/metamask'
import RewardsCompounder from '@/lib/abi/RewardsCompounder.json'
import ERC20Abi from '@/lib/abi/ERC20.json'
import { configService } from '@/services/config/config.service'
import { parseUnits } from '@ethersproject/units'
import { bnum, sleep } from '@/lib/utils'
import * as SDK from '@georgeroman/balancer-v2-pools'
import BigNumber from 'bignumber.js'

export async function useCompoundRewards(pool, srcTokens, formattedAmounts) {
  try {
    const provider = await InitializeMetamask()
    const config = configService.getNetworkConfig(56)

    const poolContract = new ethers.Contract(
      pool.address,
      weightedPoolAbi,
      provider,
    )
    const vault = new ethers.Contract(
      config.addresses.vault,
      vaultAbi,
      provider,
    )
    const [poolId, lptTotalSupply] = await Promise.all([
      poolContract.getPoolId(),
      poolContract.totalSupply(),
    ])
    const [, balances] = await vault.getPoolTokens(poolId)
    const compounder = new ethers.Contract(
      config.addresses.compounder,
      RewardsCompounder,
      provider.getSigner(),
    )
    const srcAmounts = formattedAmounts.map((amount, index) =>
      parseUnits(amount, srcTokens[index].decimals),
    )

    const poolSymbols = pool.tokens.map((t) => t.symbol)
    const symbols = Array.from(
      new Set([...poolSymbols, ...srcTokens.map((t) => t.symbol)]),
    )
    const prices = await getPrices(56, symbols)

    let totalRewardsUsd = parseFloat(
      roundDown(
        formattedAmounts.reduce(
          (sum, value, index) =>
            sum + parseFloat(value) * prices[srcTokens[index].symbol],
          0,
        ),
        8,
      ),
    )
    const tokens = pool.tokens
    const weights = pool.tokens
      .map((t) => t.weight)
      .map((w) => bnum(ethers.utils.parseUnits(w.toString(), 18).toString()))
    const poolTokenDepositUsd = [] // how much each token would get in usd
    const totalWeight = weights.reduce(
      (total, item) =>
        total + parseFloat(ethers.utils.formatEther(item.toString())),
      0,
    )

    for (let i = 0; i < tokens.length; i++) {
      poolTokenDepositUsd.push({
        token: tokens[i].address,
        amount: roundDown(
          (parseFloat(ethers.utils.formatEther(weights[i].toString())) *
            totalRewardsUsd) /
            totalWeight,
          8,
        ),
      })
    }

    let rewardIndex = 0
    const amountsIn = []
    const datas = []
    const toAddresses = []
    const dstTokens = []
    const _srcTokens = []
    const minBuyTokens = []
    for (let i = 0; i < poolTokenDepositUsd.length; i++) {
      let reward = parseFloat(formattedAmounts[rewardIndex])
      let srcToken = srcTokens[rewardIndex]
      let price = prices[srcToken.symbol]
      let usdReward = reward * price
      let fulfillAmount = 0
      let fulfilled = false
      let currentRewardIndex = rewardIndex
      if (usdReward < poolTokenDepositUsd[i].amount) {
        fulfillAmount = usdReward
        rewardIndex += 1
      } else {
        fulfilled = true
        fulfillAmount = poolTokenDepositUsd[i].amount
      }
      formattedAmounts[currentRewardIndex] = (
        parseFloat(formattedAmounts[currentRewardIndex]) -
        fulfillAmount / price
      ).toString()
      poolTokenDepositUsd[i].amount -= fulfillAmount
      let amountIn = parseUnits(
        roundDown(fulfillAmount / price, 8),
        srcToken.decimals,
      )
      if (amountIn.toString() == '0') {
        console.log('AMOUNT BECOME 0')
        continue
      }
      if (srcToken.address == poolTokenDepositUsd[i].token) {
        amountsIn.push(amountIn)
        toAddresses.push(srcToken.address)
        _srcTokens.push(srcToken.address)
        dstTokens.push(srcToken.address)
        minBuyTokens.push({
          token: srcToken.address,
          amount: BigNumber(amountIn),
        })
        datas.push('0x')
      } else {
        const data = await fetch0xData(
          srcToken.address,
          poolTokenDepositUsd[i].token,
          amountIn.toString(),
          compounder.address,
        )
        dstTokens.push(poolTokenDepositUsd[i].token)
        minBuyTokens.push({
          token: poolTokenDepositUsd[i].token,
          amount: BigNumber(data.minBuyAmount),
        })
        _srcTokens.push(srcToken.address)
        datas.push(data.transaction.data)
        toAddresses.push(data.transaction.to)
        amountsIn.push(amountIn)

        //spent = spent.plus(new BigNumber(data.sellAmount));
        if (!fulfilled) {
          i--
        }
      }
    }

    const bnMinimumLPT = calculateMinLPT(
      minBuyTokens,
      tokens.map((t) => t.address),
      balances,
      weights,
      lptTotalSupply,
    )
    // let approveAmounts = calculateApproveAmounts(
    //   srcTokens.map((t) => t.address),
    //   amountsIn.map((item, index) => ({
    //     token: _srcTokens[index],
    //     amount: BigNumber(item.toString()),
    //   })),
    // )
    // for (let i = 0; i < approveAmounts.length; i++) {
    //   let token = new ethers.Contract(
    //     srcTokens[i].address,
    //     ERC20Abi,
    //     provider.getSigner(),
    //   )
    //   let approvetx = await token.approve(compounder.address, approveAmounts[i])
    //   await approvetx.wait()
    // }
    console.log('MIN LPT - ', bnMinimumLPT)
    const tx = await compounder.compound0x(
      amountsIn,
      _srcTokens,
      dstTokens,
      pool.address,
      tokens.map((t) => t.address),
      toAddresses,
      datas,
      bnMinimumLPT.toString(),
    )
    await tx.wait()
  } catch (e) {
    console.error('COMPOUNDER ERROR - ', e)
  }
}

function calculateMinLPT(
  minBuyTokens,
  assets,
  balances,
  weights,
  lptTotalSupply,
) {
  let amountsIn = calculateApproveAmounts(assets, minBuyTokens)
  let minimumLPT = SDK.WeightedMath._calcBptOutGivenExactTokensIn(
    balances.map((item) => new BigNumber(item.toString())),
    weights.map((item) => new BigNumber(item.toString())),
    amountsIn.map((item) => new BigNumber(item.toString())),
    new BigNumber(lptTotalSupply.toString()),
    new BigNumber(0),
  )
  return new BigNumber(
    minimumLPT.minus(minimumLPT.multipliedBy(LPT_SLIPPAGE).div(100)).toFixed(0),
  ) // 500 = 100%, percent = 2
}

function calculateApproveAmounts(srcTokens, amounts) {
  let _amounts = []
  let currentToken = null
  let amountsIndex = 0
  for (let i = 0; i < amounts.length; i++) {
    if (currentToken == null || currentToken != amounts[i].token) {
      currentToken = srcTokens[amountsIndex]
      amountsIndex++
      _amounts.push(BigNumber(0))
    }
    console.log(amounts[i].amount)
    _amounts[_amounts.length - 1] = BigNumber(
      _amounts[_amounts.length - 1],
    ).plus(BigNumber(amounts[i].amount))
  }
  return _amounts.map((item) => item.toString())
}
