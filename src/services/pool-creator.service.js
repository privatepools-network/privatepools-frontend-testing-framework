import configs from '@/lib/config'
import { default as weightedPoolFactoryAbi } from '@/lib/abi/WeightedPoolFactory.json'
import { default as weightedPoolAbi } from '@/lib/abi/WeightedPool.json'
import { orderBy } from 'lodash'
import { parseUnits } from '@ethersproject/units'
import { encodeJoinWeightedPool } from '@/lib/utils/balancer/weightedPoolEncoding'
import { WeiPerEther as ONE } from '@ethersproject/constants/lib/bignumbers'
import { Zero } from '@ethersproject/constants'
import { default as vaultAbi } from '@/lib/abi/VaultAbi.json'
import { sleep } from '@/lib/utils'
import { ethers } from 'ethers'

export class PoolCreatorService {
  network
  vaultAddress
  weightedPoolFactoryAddress
  helpersAddress
  poolVerifier

  MaxWeightedTokens = 100
  bnToNormalizedWeights(weights) {
    // When the number is exactly equal to the max, normalizing with common inputs
    // leads to a value < 0.01, which reverts. In this case fill in the weights exactly.
    if (weights.length == this.MaxWeightedTokens) {
      return Array(this.MaxWeightedTokens).fill(ONE.div(this.MaxWeightedTokens))
    }

    const sum = weights.reduce((total, weight) => total.add(weight), Zero)
    if (sum.eq(ONE)) return weights

    const normalizedWeights = []
    let normalizedSum = Zero
    for (let index = 0; index < weights.length; index++) {
      if (index < weights.length - 1) {
        normalizedWeights[index] = weights[index].mul(ONE).div(sum)
        normalizedSum = normalizedSum.add(normalizedWeights[index])
      } else {
        normalizedWeights[index] = ONE.sub(normalizedSum)
      }
    }

    return normalizedWeights
  }
  constructor(network) {
    this.network = network
    this.vaultAddress = configs[network].addresses.vault
    this.weightedPoolFactoryAddress =
      configs[network].addresses.weightedPoolFactory
    this.helpersAddress = configs[network].addresses.balancerHelpers
  }

  async createWeightedPool(provider, name, symbol, swapFeePercentage, tokens) {
    console.log('provider', provider)
    console.log('name', name)
    console.log('symbol', symbol)
    console.log('swapFeePercentage', swapFeePercentage)
    console.log('tokens', tokens)
    tokens = tokens.filter((t) => t && t != {} && t.address)
    console.log(tokens)
    if (tokens.length == 0) return false
    const sorted = this.sortTokens(tokens)

    let contract = new ethers.Contract(
      this.weightedPoolFactoryAddress,
      weightedPoolFactoryAbi,
      provider.getSigner(),
    )
    try {
      let params = [
        name,
        symbol,
        sorted.map((token) => token.address),
        this.bnToNormalizedWeights(
          sorted.map((token) => parseUnits(token.weight.toString(), 16)),
        ),
        parseUnits(swapFeePercentage, 16),
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ]
      var tx = await contract.create(...params)
      await tx.wait()
    } catch (e) {
      console.log('ERROR SENDING TX - ', e)
      return e
    }
    return tx
  }

  async joinPool(provider, tokens, poolId, address) {
    const sorted = this.sortTokens(tokens)
    const amountsIn = sorted.map((token) =>
      parseUnits(token.amount.toString(), token.decimals),
    )

    const joinPoolRequest = {
      assets: sorted.map((token) => token.address),
      maxAmountsIn: amountsIn,
      userData: encodeJoinWeightedPool({ kind: 'Init', amountsIn }),
      fromInternalBalance: false,
    }

    let contract = new ethers.Contract(
      this.vaultAddress,
      vaultAbi,
      provider.getSigner(),
    )
    try {
      let params = [poolId, address, address, joinPoolRequest]
      var tx = await contract.joinPool(...params)
      await tx.wait()
    } catch (e) {
      console.log('ERROR SENDING TX - ', e)
      return false
    }
    return tx
  }
  async callStatic(web3, contractAddress, abi, action, params, overrides = {}) {
    console.log('Sending transaction')
    console.log('Contract', contractAddress)
    console.log('Action', `"${action}"`)
    console.log('Params', params)
    const signer = web3.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, web3)
    const contractWithSigner = contract.connect(signer)
    return await contractWithSigner.callStatic[action](...params, overrides)
  }
  async getPoolDataFromTransaction(provider, receipt) {
    const poolCreatedEvent = receipt.logs.find(
      (e) =>
        e.topics[0] ===
        '0x83a48fbcfc991335314e74d0496aab6a1987e992ddc85dddbcc4d6dd6ef2e9fc',
    )
    let poolId = ''
    let poolAddress = poolCreatedEvent.topics[1].replace(
      '0x000000000000000000000000',
      '0x',
    )
    //generous amount of retries, to give the rpc time to catch up.
    for (let i = 0; i < 20; i++) {
      try {
        await sleep(1000)
        poolId = await this.callStatic(
          provider,
          poolAddress,
          weightedPoolAbi,
          'getPoolId',
          [],
        )

        if (poolId) {
          break
        }
      } catch {
        //
      }
    }

    if (poolId === '') {
      throw new Error('Failed to retrieve the pool id')
    }

    return {
      poolAddress: poolAddress,
      blockHash: receipt.blockHash,
      poolId,
    }
  }

  //   async verifyPool(
  //     provider,
  //     name,
  //     symbol,
  //     swapFeePercentage,
  //     tokens,
  //     poolAddress,
  //     blockHash,
  //   ) {
  //     const sorted = this.sortTokens(tokens)

  //     await this.poolVerifier.verifyPool(
  //       provider,
  //       name,
  //       symbol,
  //       '0x59AfAF89723614Cbf303D3D4CbABa2c7280Fe563',
  //       sorted.map((token) => token.address),
  //       //weights and swap fee come in as 1 = 1%, so its base 16
  //       bnToNormalizedWeights(
  //         sorted.map((token) => parseUnits(token.weight, 16)),
  //       ),
  //       parseUnits(swapFeePercentage, 16),
  //       poolAddress,
  //       blockHash,
  //     )
  //   }

  sortTokens(tokens) {
    return orderBy(tokens, (token) => token.address.toLowerCase(), 'asc')
  }
}
