export const POOL_QUERY = {
  id: true,
  name: true,
  address: true,
  poolType: true,
  swapFee: true,
  tokensList: true,
  totalLiquidity: true,
  totalSwapVolume: true,
  totalSwapFee: true,
  totalShares: true,
  owner: true,
  factory: true,
  amp: true,
  createTime: true,
  swapEnabled: true,
  volume24h: true,
  fees24h: true,
  apr: {
    total: true,
  },
  tokens: {
    name: true,
    symbol: true,
    decimals: true,
    address: true,
    balance: true,
    weight: true,
    //TODO: uncomment for linear support
    //priceRate: true
  },
  //TODO: uncomment for linear support
  mainIndex: true,
  tokenRates: true,
  holdersCount: true,
  swapsCount: true,
  linearPools: {
    id: true,
    address: true,
    priceRate: true,
    totalSupply: true,
    unwrappedTokenAddress: true,
    mainToken: {
      index: true,
      address: true,
      balance: true,
      name: true,
      symbol: true,
      decimals: true,
    },
  },
}

export const POOL_SUBGRAPH_QUERY = {
  id: true,
  name: true,
  address: true,
  totalLiquidity: true,
  totalShares: true,
  createTime: true,
  tokens: {
    symbol: true,
    address: true,
    balance: true,
    weight: true,
  },
}

export const FILTERED_POOL_SUBGRAPH_QUERY = (ids) =>
  `{pools(where:{id_in:[${ids.map(
    (item) => `"${item}"`,
  )}]}) {id createTime name address totalLiquidity totalShares tokens{symbol address balance weight }}}`

export const SINGLE_POOL_QUERY = (id) => `

query { pool (id: "${id}") { id name address poolType swapFee tokensList totalLiquidity totalSwapVolume totalSwapFee totalShares owner factory amp createTime swapEnabled volume24h fees24h apr { total } tokens { name symbol decimals address balance weight } mainIndex tokenRates holdersCount swapsCount linearPools { id address priceRate totalSupply unwrappedTokenAddress mainToken { index address balance name symbol decimals } } }} 
`
