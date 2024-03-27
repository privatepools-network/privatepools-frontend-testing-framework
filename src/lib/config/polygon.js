export default {
  key: process.env.VUE_APP_KEY_POLYGON,
  chainId: process.env.VUE_APP_CHAIN_ID_POLYGON,
  chainName: process.env.VUE_APP_CHAIN_NAME_POLYGON,
  name: process.env.VUE_APP_NAME_POLYGON,
  shortName: process.env.VUE_APP_SHORT_NAME_POLYGON,
  network: process.env.VUE_APP_NETWORK_POLYGON,
  unknown: false,
  rpc: process.env.VUE_APP_RPC_POLYGON,
  ws: process.env.VUE_APP_WS_POLYGON,
  loggingRpc: process.env.VUE_APP_LOGGING_RPC_POLYGON,
  explorer: process.env.VUE_APP_EXPLORER_POLYGON,
  explorerName: process.env.VUE_APP_EXPLORER_NAME_POLYGON,
  subgraph: process.env.VUE_APP_SUBGRAPH_POLYGON,
  farmSubgraph: process.env.VUE_APP_FARM_SUBGRAPH_POLYGON,
  blockSubgraph: process.env.VUE_APP_BLOCK_SUBGRAPH_POLYGON,
  poolsUrlV1: process.env.VUE_APP_POOLS_URL_V1_POLYGON,
  poolsUrlV2: process.env.VUE_APP_POOLS_URL_V2_POLYGON,
  backendUrl: process.env.VUE_APP_BACKEND_URL_POLYGON,
  etherscan: {
    apiKey: process.env.VUE_APP_ETHERSCAN_API_KEY_POLYGON,
    apiUrl: process.env.VUE_APP_ETHERSCAN_API_URL_POLYGON,
  },
  nativeAsset: {
    name: 'Polygon',
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'MATIC',
    decimals: 18,
    deeplinkId: 'polygon-pos',
    logoURI:
      'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    minTransactionBuffer: '0.1',
  },
  addresses: {
    bFactory: process.env.VUE_APP_BFACTORY_POLYGON,
    bActions: process.env.VUE_APP_BACTIONS_POLYGON,
    dsProxyRegistry: process.env.VUE_APP_DSPROXYREGISTRY_POLYGON,
    exchangeProxy: process.env.VUE_APP_EXCHANGEPROXY_POLYGON,
    merkleRedeem: process.env.VUE_APP_MERKLEREDEEM_POLYGON,
    merkleOrchard: process.env.VUE_APP_MERKLEORCHARD_POLYGON,
    multicall: process.env.VUE_APP_MULTICALL_POLYGON,
    authorizer: process.env.VUE_APP_AUTHORIZER_POLYGON,
    vault: process.env.VUE_APP_VAULT_POLYGON,
    weightedPoolFactory: process.env.VUE_APP_WEIGHTED_POOL_FACTORY_POLYGON,
    stablePoolFactory: process.env.VUE_APP_STABLE_POOL_FACTORY_POLYGON,
    tokenFactory: process.env.VUE_APP_TOKEN_FACTORY_POLYGON,
    weth: process.env.VUE_APP_WETH_POLYGON,
    stETH: process.env.VUE_APP_STETH_POLYGON,
    wstETH: process.env.VUE_APP_WSTETH_POLYGON,
    usdc: process.env.VUE_APP_USDC_POLYGON,
    embr: process.env.VUE_APP_EMBR_POLYGON,
    ausd: process.env.VUE_APP_AUSD_POLYGON,
    lidoRelayer: process.env.VUE_APP_LIDO_RELAYER_POLYGON,
    balancerHelpers: process.env.VUE_APP_BALANCER_HELPERS_POLYGON,
    masterChef: process.env.VUE_APP_MASTER_CHEF_POLYGON,
    embrUsdcReferencePricePool:
      process.env.VUE_APP_EMBR_USDC_REFERENCE_PRICE_POOL_POLYGON,
    embrToken: process.env.VUE_APP_EMBR_TOKEN_POLYGON,
    xembrVestingToken: process.env.VUE_APP_XEMBR_VESTING_TOKEN_POLYGON,
    xembrToken: process.env.VUE_APP_XEMBR_TOKEN_POLYGON,
    defaultPoolOwner: process.env.VUE_APP_DEFAULT_POOL_OWNER_POLYGON,
    earlyLudwigNft: process.env.VUE_APP_EARLY_LUDWIG_NFT_POLYGON,
    hnd: process.env.VUE_APP_HND_POLYGON,
    hndRewarder: process.env.VUE_APP_HND_REWARDER_POLYGON,
    batchRelayer: process.env.VUE_APP_BATCH_RELAYER_POLYGON,
    copperProxy: process.env.VUE_APP_COPPER_PROXY_POLYGON,
    rewards: process.env.VUE_APP_REWARDS_CONTRACT_POLYGON,
  },
  strategies: {
    0: {
      type: process.env.VUE_APP_STRATEGY_0_TYPE_POLYGON,
      name: process.env.VUE_APP_STRATEGY_0_NAME_POLYGON,
    },
    1: {
      type: process.env.VUE_APP_STRATEGY_1_TYPE_POLYGON,
      name: process.env.VUE_APP_STRATEGY_1_NAME_POLYGON,
    },
    2: {
      type: process.env.VUE_APP_STRATEGY_2_TYPE_POLYGON,
      name: process.env.VUE_APP_STRATEGY_2_NAME_POLYGON,
    },
  },
  lbp: {
    poolId: process.env.VUE_APP_LBP_POOL_ID_POLYGON,
    tokenAddress: process.env.VUE_APP_LBP_TOKEN_ADDRESS_POLYGON,
    tokenSymbol: process.env.VUE_APP_LBP_TOKEN_SYMBOL_POLYGON,
    startingAmount: process.env.VUE_APP_LBP_STARTING_AMOUNT_POLYGON,
    usdcAddress: process.env.VUE_APP_LBP_USDC_ADDRESS_POLYGON,
    startTime: process.env.VUE_APP_LBP_START_TIME_POLYGON,
    endTime: process.env.VUE_APP_LBP_END_TIME_POLYGON,
    weightStep: process.env.VUE_APP_LBP_WEIGHT_STEP_POLYGON,
    timeStep: process.env.VUE_APP_LBP_TIME_STEP_POLYGON,
  },
  keys: {
    infura: process.env.VUE_APP_INFURA_KEY_POLYGON,
    alchemy: process.env.VUE_APP_ALCHEMY_KEY_POLYGON,
  },
  supportsEIP1559: process.env.VUE_APP_SUPPORTS_EIP1559_POLYGON,
  supportsElementPools: process.env.VUE_APP_SUPPORTS_ELEMENT_POOLS_POLYGON,
  tokenListSanityUrl: process.env.VUE_APP_TOKEN_LIST_SANITY_URL_POLYGON,
  configSanityUrl: process.env.VUE_APP_CONFIG_SANITY_URL_POLYGON,
  xEmbr: {
    address: process.env.VUE_APP_XEMBR_ADDRESS_POLYGON,
    poolAddress: process.env.VUE_APP_XEMBR_POOL_ADDRESS_POLYGON,
    poolId: process.env.VUE_APP_XEMBR_POOL_ID_POLYGON,
  },
  tokens: {
    USDT: {
      name: 'USDT',
      symbol: 'USDT',
      decimals: 6,
      address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      logoURI: './images/tokens/USDT.png',
      apiId: 'USDT',
    },
    STG: {
      name: 'Stargate Token',
      symbol: 'STG',
      decimals: 18,
      address: '0x2f6f07cdcf3588944bf4c42ac74ff24bf56e7590',
      logoURI: './images/tokens/STG.png',
      apiId: 'STG',
    },
    MATIC: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
      address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      logoURI: './images/tokens/MATIC.png',
      apiId: 'MATIC',
    },
    weth: {
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      logoURI: './images/tokens/WETH.png',
      apiId: 'ETH',
    },
    wbtc: {
      name: 'Wrapped Bitcoin',
      symbol: 'WBTC',
      decimals: 8,
      address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
      logoURI: './images/tokens/BTC.png',
      apiId: 'BTC',
    },
    PAXG: {
      name: 'PAXG',
      symbol: 'PAXG',
      decimals: 18,
      address: '0x553d3D295e0f695B9228246232eDF400ed3560B5',
      logoURI: './images/tokens/PAXG.png',
      apiId: 'PAXG',
    },
    GHST: {
      name: 'GHST',
      symbol: 'GHST',
      decimals: 18,
      address: '0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7',
      logoURI: './images/tokens/GHST.png',
      apiId: 'GHST',
    },
    USDC: {
      name: 'USD Coin (PoS)',
      symbol: 'USDC.e',
      decimals: 6,
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      logoURI: './images/tokens/USDC.png',
      apiId: 'USDC',
    },
    LINK: {
      name: 'LINK',
      symbol: 'LINK',
      apiId: 'LINK',
      logoURI: './images/tokens//LINK.png',
      decimals: 18,
      address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
    },
    LDO: {
      name: 'LDO',
      symbol: 'LDO',
      apiId: 'LDO',
      logoURI: '  ./images/tokens//LDO.png',
      decimals: 18,
      address: '0xc3c7d422809852031b44ab29eec9f1eff2a58756',
    },
    AVAX: {
      name: 'AVAX',
      symbol: 'AVAX',
      apiId: 'AVAX',
      logoURI: './images/tokens//AVAX.png',
      decimals: 18,
      address: '0x2c89bbc92bd86f8075d1decc58c7f4e0107f286b',
    },
  },
  incentivizedPools: process.env.VUE_APP_INCENTIVIZED_POOLS_POLYGON,
}
