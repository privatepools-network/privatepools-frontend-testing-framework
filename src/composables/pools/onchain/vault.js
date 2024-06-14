import { Multicaller } from './contract'
import { getAddress } from '@ethersproject/address'
import { formatUnits } from '@ethersproject/units'

import { toNormalizedWeights } from '@balancer-labs/balancer-js'
import { pick } from 'lodash'
import { Vault__factory } from '@balancer-labs/typechain'
import { Contract, ethers } from 'ethers'
import VaultAbi from '@/lib/abi/VaultAbi.json'
import { configService } from '@/services/config/config.service'

export default class Vault {
  service
  instance

  constructor(service, instanceABI = VaultAbi) {
    this.service = service
    if (service && service.config && service.config.rpc) {
      let provider = new ethers.providers.JsonRpcProvider(service.config.rpc)
      if (this.service.config.addresses)
        this.instance = new Contract(
          this.service.config.addresses.vault,
          instanceABI,
          provider,
        )
    }
  }

  isWeighted(poolType) {
    return poolType === 'Weighted'
  }
  isManaged(poolType) {
    return poolType === 'Investment'
  }
  isLiquidityBootstrapping(poolType) {
    return poolType === 'LiquidityBootstrapping'
  }

  isWeightedLike(poolType) {
    return (
      this.isWeighted(poolType) ||
      this.isManaged(poolType) ||
      this.isLiquidityBootstrapping(poolType)
    )
  }
  isStable(poolType) {
    return poolType === 'Stable'
  }
  isMetaStable(poolType) {
    return poolType === 'MetaStable'
  }
  isStablePhantom(poolType) {
    return poolType == 'StablePhantom'
  }

  isStableLike(poolType) {
    return (
      this.isStable(poolType) ||
      this.isMetaStable(poolType) ||
      this.isStablePhantom(poolType)
    )
  }

  isTradingHaltable(poolType) {
    return this.isManaged(poolType) || this.isLiquidityBootstrapping(poolType)
  }

  async getPoolData(id, type, tokens, network) {
    const poolAddress = getAddress(id.slice(0, 42))
    let result = {}
    let config = configService.getNetworkConfig(network)
    let provider = new ethers.providers.JsonRpcProvider(config.rpc)
    const vaultMultiCaller = new Multicaller(
      network,
      provider,
      Vault__factory.abi,
    )

    const poolMulticaller = new Multicaller(
      network,
      provider,
      this.service.allPoolABIs,
    )

    poolMulticaller.call('totalSupply', poolAddress, 'totalSupply')
    // poolMulticaller.call('decimals', poolAddress, 'decimals')
    // poolMulticaller.call('swapFee', poolAddress, 'getSwapFeePercentage')

    poolMulticaller.call('weights', poolAddress, 'getNormalizedWeights', [])
    // if (this.isWeightedLike(type)) {

    //   // if (this.isTradingHaltable(type)) {
    //   //   poolMulticaller.call('swapEnabled', poolAddress, 'getSwapEnabled')
    //   // }
    // } else if (this.isStableLike(type)) {
    //   poolMulticaller.call('amp', poolAddress, 'getAmplificationParameter')
    // }

    result = await poolMulticaller.execute(result)

    vaultMultiCaller.call(
      'poolTokens',
      this.address(network),
      'getPoolTokens',
      [id],
    )

    result = await vaultMultiCaller.execute(result)

    return this.formatPoolData(result, type, tokens, poolAddress)
  }
  async getPoolSupply(id, network) {
    const poolAddress = getAddress(id.slice(0, 42))
    let result = {}
    let config = configService.getNetworkConfig(network)
    let provider = new ethers.providers.JsonRpcProvider(config.rpc)
    const vaultMultiCaller = new Multicaller(
      network,
      provider,
      Vault__factory.abi,
    )

    const poolMulticaller = new Multicaller(
      network,
      provider,
      this.service.allPoolABIs,
    )

    poolMulticaller.call('totalSupply', poolAddress, 'totalSupply')
    poolMulticaller.call('decimals', poolAddress, 'decimals')
    result = await poolMulticaller.execute(result)

    return formatUnits(result.totalSupply, result.decimals)
  }

  formatPoolData(rawData, type, tokens, poolAddress) {
    const poolData = {}

    // Filter out pre-minted BPT token if exists
    const validTokens = Object.keys(tokens).filter(
      (address) => address !== poolAddress,
    )
    tokens = pick(tokens, validTokens)

    const normalizedWeights = this.normalizeWeights(
      rawData?.weights || [],
      type,
      tokens,
    )

    poolData.tokens = this.formatPoolTokens(
      rawData.poolTokens,
      tokens,
      normalizedWeights,
      poolAddress,
    )

    poolData.amp = '0'
    if (rawData?.amp) {
      poolData.amp = rawData.amp.value.div(rawData.amp.precision).toString()
    }

    poolData.swapEnabled = true
    if (rawData.swapEnabled !== undefined) {
      poolData.swapEnabled = rawData.swapEnabled
    }

    if (rawData?.linearPools) {
      poolData.linearPools = this.formatLinearPools(rawData.linearPools)
    }

    if (rawData.tokenRates) {
      poolData.tokenRates = rawData.tokenRates.map((rate) =>
        formatUnits(rate.toString(), 18),
      )
    }

    poolData.totalSupply = formatUnits(rawData.totalSupply, 18)
    poolData.decimals = 18
    if (rawData.swapFee) poolData.swapFee = formatUnits(rawData.swapFee, 18)
    else poolData.swapFee = 0

    return poolData
  }

  formatPoolTokens(poolTokens, tokenInfo, weights, poolAddress) {
    const tokens = {}
    poolTokens.tokens.forEach((token, i) => {
      const tokenBalance = poolTokens.balances[i]
      let _tokenInfo = Object.values(tokenInfo).filter(
        (t) => t.address.toLowerCase() == token.toLowerCase(),
      )[0]
      const decimals = _tokenInfo?.decimals
      tokens[token] = {
        decimals,
        balance: formatUnits(tokenBalance, decimals),
        weight: `${weights[i]}`,
        symbol: _tokenInfo[token]?.symbol,
        name: _tokenInfo[token]?.name,
        //logoURI: tokenInfo[token]?.logoURI
      }
    })

    // Remove pre-minted BPT
    delete tokens[poolAddress]

    return tokens
  }

  formatLinearPools(linearPools) {
    const _linearPools = {}

    Object.keys(linearPools).forEach((address) => {
      const {
        id,
        mainToken,
        wrappedToken,
        priceRate,
        unwrappedTokenAddress,
        tokenData,
        totalSupply,
      } = linearPools[address]

      _linearPools[address] = {
        id,
        priceRate: formatUnits(priceRate.toString(), 18),
        mainToken: {
          address: getAddress(mainToken.address),
          index: mainToken.index.toNumber(),
          balance: tokenData.balances[mainToken.index.toNumber()].toString(),
        },
        wrappedToken: {
          address: getAddress(wrappedToken.address),
          index: wrappedToken.index.toNumber(),
          balance: tokenData.balances[wrappedToken.index.toNumber()].toString(),
          priceRate: formatUnits(wrappedToken.rate, 18),
        },
        unwrappedTokenAddress: getAddress(unwrappedTokenAddress),
        totalSupply: formatUnits(totalSupply, 18),
      }
    })

    return _linearPools
  }

  normalizeWeights(weights, type, tokens) {
    if (this.isWeightedLike(type)) {
      // toNormalizedWeights returns weights as 18 decimal fixed point
      return toNormalizedWeights(weights).map((w) =>
        Number(formatUnits((w * 100).toFixed(0), 18)),
      )
    } else if (this.isStableLike(type)) {
      const tokensList = Object.values(tokens)
      return tokensList.map(() => 1 / tokensList.length)
    } else {
      return []
    }
  }

  address(network) {
    return configService.getNetworkConfig(network).addresses.vault
  }
}
