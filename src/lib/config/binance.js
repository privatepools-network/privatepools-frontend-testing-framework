export default {
  key: process.env.VUE_APP_KEY_BINANCE,
  chainId: process.env.VUE_APP_CHAIN_ID_BINANCE,
  chainName: process.env.VUE_APP_CHAIN_NAME_BINANCE,
  name: process.env.VUE_APP_NAME_BINANCE,
  shortName: process.env.VUE_APP_SHORT_NAME_BINANCE,
  network: process.env.VUE_APP_NETWORK_BINANCE,
  unknown: false,
  rpc: process.env.VUE_APP_RPC_BINANCE,
  ws: process.env.VUE_APP_WS_BINANCE,
  loggingRpc: process.env.VUE_APP_LOGGING_RPC_BINANCE,
  explorer: process.env.VUE_APP_EXPLORER_BINANCE,
  explorerName: process.env.VUE_APP_EXPLORER_NAME_BINANCE,
  subgraph: process.env.VUE_APP_SUBGRAPH_BINANCE,
  farmSubgraph: process.env.VUE_APP_FARM_SUBGRAPH_BINANCE,
  blockSubgraph: process.env.VUE_APP_BLOCK_SUBGRAPH_BINANCE,
  xembrSubgraph: process.env.VUE_APP_XEMBR_SUBGRAPH_BINANCE,
  poolsUrlV1: process.env.VUE_APP_POOLS_URL_V1_BINANCE,
  poolsUrlV2: process.env.VUE_APP_POOLS_URL_V2_BINANCE,
  backendUrl: process.env.VUE_APP_BACKEND_URL_BINANCE,
  etherscan: {
    apiKey: process.env.VUE_APP_ETHERSCAN_API_KEY_BINANCE,
    apiUrl: process.env.VUE_APP_ETHERSCAN_API_URL_BINANCE,
  },
  nativeAsset: {
    name: 'Binance',
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'BNB',
    decimals: 18,
    deeplinkId: 'binance-smart-chain',
    logoURI:
      'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    minTransactionBuffer: '0.1',
  },
  addresses: {
    bFactory: process.env.VUE_APP_B_FACTORY_BINANCE,
    bActions: process.env.VUE_APP_B_ACTIONS_BINANCE,
    dsProxyRegistry: process.env.VUE_APP_DS_PROXY_REGISTRY_BINANCE,
    exchangeProxy: process.env.VUE_APP_EXCHANGE_PROXY_BINANCE,
    merkleRedeem: process.env.VUE_APP_MERKLE_REDEEM_BINANCE,
    merkleOrchard: process.env.VUE_APP_MERKLE_ORCHARD_BINANCE,
    multicall: process.env.VUE_APP_MULTICALL_BINANCE,
    authorizer: process.env.VUE_APP_AUTHORIZER_BINANCE,
    vault: process.env.VUE_APP_VAULT_BINANCE,
    weightedPoolFactory: process.env.VUE_APP_WEIGHTED_POOL_FACTORY_BINANCE,
    stablePoolFactory: process.env.VUE_APP_STABLE_POOL_FACTORY_BINANCE,
    tokenFactory: process.env.VUE_APP_TOKEN_FACTORY_BINANCE,
    weth: process.env.VUE_APP_WETH_BINANCE,
    stETH: process.env.VUE_APP_STETH_BINANCE,
    wstETH: process.env.VUE_APP_WSTETH_BINANCE,
    usdc: process.env.VUE_APP_USDC_BINANCE,
    embr: process.env.VUE_APP_EMBR_BINANCE,
    ausd: process.env.VUE_APP_AUSD_BINANCE,
    lidoRelayer: process.env.VUE_APP_LIDO_RELAYER_BINANCE,
    balancerHelpers: process.env.VUE_APP_BALANCER_HELPERS_BINANCE,
    masterChef: process.env.VUE_APP_MASTER_CHEF_BINANCE,
    embrUsdcReferencePricePool:
      process.env.VUE_APP_EMBR_USDC_REFERENCE_PRICE_POOL_BINANCE,
    embrToken: process.env.VUE_APP_EMBR_TOKEN_BINANCE,
    xembrVestingToken: process.env.VUE_APP_XEMBR_VESTING_TOKEN_BINANCE,
    xembrToken: process.env.VUE_APP_XEMBR_TOKEN_BINANCE,
    defaultPoolOwner: process.env.VUE_APP_DEFAULT_POOL_OWNER_BINANCE,
    earlyLudwigNft: process.env.VUE_APP_EARLY_LUDWIG_NFT_BINANCE,
    hnd: process.env.VUE_APP_HND_BINANCE,
    hndRewarder: process.env.VUE_APP_HND_REWARDER_BINANCE,
    batchRelayer: process.env.VUE_APP_BATCH_RELAYER_BINANCE,
    copperProxy: process.env.VUE_APP_COPPER_PROXY_BINANCE,
    rewards: process.env.VUE_APP_REWARDS_CONTRACT_BINANCE,
  },
  strategies: {
    0: {
      type: '0',
      name: 'stablePool',
    },
    1: {
      type: '1',
      name: 'weightedPool',
    },
    2: {
      type: '2',
      name: 'weightedPool',
    },
  },
  lbp: {
    poolId: process.env.VUE_APP_LBP_POOL_ID_BINANCE,
    tokenAddress: process.env.VUE_APP_LBP_TOKEN_ADDRESS_BINANCE,
    tokenSymbol: process.env.VUE_APP_LBP_TOKEN_SYMBOL_BINANCE,
    startingAmount: process.env.VUE_APP_LBP_STARTING_AMOUNT_BINANCE,
    usdcAddress: process.env.VUE_APP_LBP_USDC_ADDRESS_BINANCE,
    startTime: process.env.VUE_APP_LBP_START_TIME_BINANCE,
    endTime: process.env.VUE_APP_LBP_END_TIME_BINANCE,
    weightStep: process.env.VUE_APP_LBP_WEIGHT_STEP_BINANCE,
    timeStep: process.env.VUE_APP_LBP_TIME_STEP_BINANCE,
  },
  keys: {
    infura: process.env.VUE_APP_INFURA_BINANCE,
    alchemy: process.env.VUE_APP_ALCHEMY_BINANCE,
  },
  supportsEIP1559: process.env.VUE_APP_SUPPORTS_EIP1559_BINANCE,
  supportsElementPools: process.env.VUE_APP_SUPPORTS_ELEMENT_POOLS_BINANCE,
  tokenListSanityUrl: process.env.VUE_APP_TOKEN_LIST_SANITY_URL_BINANCE,
  configSanityUrl: process.env.VUE_APP_CONFIG_SANITY_URL_BINANCE,
  xEmbr: {
    address: process.env.VUE_APP_XEMBR_ADDRESS_BINANCE,
    poolAddress: process.env.VUE_APP_XEMBR_POOL_ADDRESS_BINANCE,
    poolId: process.env.VUE_APP_XEMBR_POOL_ID_BINANCE,
  },
  tokens: {
    usdt: {
      name: 'USDT',
      symbol: 'USDT',
      decimals: 6,
      address: '0x55d398326f99059ff775485246999027b3197955',
      logoURI: './images/tokens/usdt.png',
      apiId: 'USDT',
    },
    WBNB: {
      name: 'WBNB',
      symbol: 'WBNB',
      decimals: 18,
      address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      logoURI: './images/tokens/wbnb.webp',
      apiId: 'WBNB',
    },
    STG: {
      name: 'STG',
      symbol: 'STG',
      decimals: 18,
      address: '0xB0D502E938ed5f4df2E681fE6E419ff29631d62b',
      logoURI: './images/tokens/stargate.png',
      apiId: 'STG',
    },
    BETH: {
      name: 'BETH',
      symbol: 'BETH',
      decimals: 18,
      address: '0x250632378E573c6Be1AC2f97Fcdf00515d0Aa91B',
      logoURI: './images/tokens/BETH.png',
      apiId: 'BETH',
    },
    VLX: {
      name: 'VLX',
      symbol: 'VLX',
      decimals: 18,
      address: '0xE9C803F48dFFE50180Bd5B01dC04DA939E3445Fc',
      logoURI: './images/tokens/VLX.png',
      apiId: 'VLX',
    },
    WETH: {
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
      address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      logoURI: './images/tokens/WETH.png',
      apiId: 'ETH',
    },
    BTCB: {
      name: 'BTCB',
      symbol: 'BTCB',
      decimals: 18,
      apiId: 'BTCB',
      logoURI: './images/tokens/btc.png',
      address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    },
    XRP: {
      name: 'XRP',
      symbol: 'XRP',
      apiId: 'XRP',
      logoURI: './images/tokens/XRP.png',
      decimals: 18,
      address: '0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe',
    },
    ADA: {
      name: 'ADA',
      symbol: 'ADA',
      apiId: 'ADA',
      logoURI: './images/tokens/ADA.png',
      decimals: 18,
      address: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
    },
    CAKE: {
      name: 'CAKE',
      symbol: 'CAKE',
      apiId: 'CAKE',
      logoURI: './images/tokens/CAKE.png',
      decimals: 18,
      address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    AVAX: {
      name: 'AVAX',
      symbol: 'AVAX',
      apiId: 'AVAX',
      logoURI: './images/tokens/AVAX.png',
      decimals: 18,
      address: '0x1ce0c2827e2ef14d5c4f29a091d735a204794041',
    },
    SOL: {
      name: 'SOL',
      symbol: 'SOL',
      apiId: 'SOL',
      logoURI: './images/tokens/SOL.png',
      decimals: 18,
      address: '0x570a5d26f7765ecb712c0924e4de545b89fd43df',
    },
    INJ: {
      name: 'INJ',
      symbol: 'INJ',
      apiId: 'INJ',
      logoURI: './images/tokens/inj.png',
      decimals: 18,
      address: '0xa2B726B1145A4773F68593CF171187d8EBe4d495',
    },
    DOT: {
      name: 'DOT',
      symbol: 'DOT',
      apiId: 'DOT',
      logoURI: './images/tokens/DOT.webp',
      decimals: 18,
      address: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
    },
    DOGE: {
      name: 'DOGE',
      symbol: 'DOGE',
      apiId: 'DOGE',
      logoURI: './images/tokens/DOGE.png',
      decimals: 8,
      address: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
    },
    DAI: {
      name: 'DAI',
      symbol: 'DAI',
      apiId: 'DAI',
      logoURI: './images/tokens/DAI.png',
      decimals: 18,
      address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    },
  },
  incentivizedPools: [process.env.VUE_APP_INCENTIVIZED_POOL_BINANCE],
}
