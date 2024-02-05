import set from 'lodash/set'
import { Contract } from '@ethersproject/contracts'
import { Interface } from '@ethersproject/abi'
import configs from '@/lib/config'
export async function multicall(
  network,
  provider,
  abi,
  calls,
  options = {},
  requireSuccess = false,
) {
  const multi = new Contract(
    configs[network].addresses.multicall,
    [
      'function tryAggregate(bool requireSuccess, tuple(address, bytes)[] memory calls) public view returns (tuple(bool, bytes)[] memory returnData)',
    ],
    provider,
  )
  const itf = new Interface(abi)
  try { 
    const res = await multi.tryAggregate(
      // if false, allows individual calls to fail without causing entire multicall to fail
      requireSuccess,
      calls.map((call) => [
        call[0].toLowerCase(),
        itf.encodeFunctionData(call[1], call[2]),
      ]),
      options,
    )

    return res.map(([success, returnData], i) => {
      if (!success) return null
      const decodedResult = itf.decodeFunctionResult(calls[i][1], returnData)
      // Automatically unwrap simple return values
      return decodedResult.length > 1 ? decodedResult : decodedResult[0]
    })
  } catch (e) {
    return Promise.reject(e)
  }
}
export class Multicaller {
  network
  provider
  abi
  options = {}
  calls = []
  paths = []

  constructor(network, provider, abi, options = {}) {
    this.network = network
    this.provider = provider
    this.abi = abi
    this.options = options || {}
  }

  call(path, address, fn, params) {
    this.calls.push([address, fn, params])
    this.paths.push(path)
    return this
  }

  async execute(from = {}) {
    const obj = from || {}
    const result = await multicall(
      this.network,
      this.provider,
      this.abi,
      this.calls,
      this.options,
    )
    result.forEach((r, i) => set(obj, this.paths[i], r))
    this.calls = []
    this.paths = []
    return obj
  }
}
