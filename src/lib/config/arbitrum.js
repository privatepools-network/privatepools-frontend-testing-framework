export default {
  key: process.env.VUE_APP_KEY_ARBITRUM,
  chainId: process.env.VUE_APP_CHAIN_ID_ARBITRUM,
  chainName: process.env.VUE_APP_CHAIN_NAME_ARBITRUM,
  name: process.env.VUE_APP_NAME_ARBITRUM,
  shortName: process.env.VUE_APP_SHORT_NAME_ARBITRUM,
  network: process.env.VUE_APP_NETWORK_ARBITRUM,
  rpc: process.env.VUE_APP_RPC_ARBITRUM,
  ws: process.env.VUE_APP_WS_ARBITRUM,
  publicRpc: process.env.VUE_APP_PUBLIC_RPC_ARBITRUM,
  loggingRpc: process.env.VUE_APP_LOGGING_RPC_ARBITRUM,
  explorer: process.env.VUE_APP_EXPLORER_ARBITRUM,
  explorerName: process.env.VUE_APP_EXPLORER_NAME_ARBITRUM,
  subgraph: process.env.VUE_APP_SUBGRAPH_ARBITRUM,
  poolsUrlV1: process.env.VUE_APP_POOLS_URL_V1_ARBITRUM,
  poolsUrlV2: process.env.VUE_APP_POOLS_URL_V2_ARBITRUM,
  nativeAsset: {
    name: 'Ether',
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    decimals: 18,
    deeplinkId: 'ether',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    minTransactionBuffer: '0.05',
  },
  tokenListSanityUrl: process.env.VUE_APP_TOKEN_LIST_SANITY_URL_ARBITRUM,
  addresses: {
    exchangeProxy: process.env.VUE_APP_EXCHANGE_PROXY_ARBITRUM,
    merkleRedeem: process.env.VUE_APP_MERKLE_REDEEM_ARBITRUM,
    merkleOrchard: process.env.VUE_APP_MERKLE_ORCHARD_ARBITRUM,
    multicall: process.env.VUE_APP_MULTICALL_ARBITRUM,
    authorizer: process.env.VUE_APP_AUTHORIZER_ARBITRUM,
    vault: process.env.VUE_APP_VAULT_ARBITRUM,
    weightedPoolFactory: process.env.VUE_APP_WEIGHTED_POOL_FACTORY_ARBITRUM,
    stablePoolFactory: process.env.VUE_APP_STABLE_POOL_FACTORY_ARBITRUM,
    weth: process.env.VUE_APP_WETH_ARBITRUM,
    stETH: process.env.VUE_APP_STETH_ARBITRUM,
    wstETH: process.env.VUE_APP_WSTETH_ARBITRUM,
    lidoRelayer: process.env.VUE_APP_LIDO_RELAYER_ARBITRUM,
    balancerHelpers: process.env.VUE_APP_BALANCER_HELPERS_ARBITRUM,
    batchRelayer: process.env.VUE_APP_BATCH_RELAYER_ARBITRUM,
    rewards: process.env.VUE_APP_REWARDS_CONTRACT_ARBITRUM,
    zap: process.env.VUE_APP_ZAP_CONTRACT_ARBITRUM,
  },
  tokens: {
    usdt: {
      name: 'USDT',
      symbol: 'USDT',
      decimals: 6,
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      logoURI: './images/tokens/usdt.png',
      apiId: 'USDT',
    },
    usdc: {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      logoURI: './images/tokens/usdc.png',
      apiId: 'USDC',
    },
    weth: {
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      logoURI: './images/tokens/weth.png',
      apiId: 'ETH',
    },
    arb: {
      name: 'Arbitrum Token',
      symbol: 'ARB',
      decimals: 18,
      address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
      logoURI: './images/tokens/arb.png',
      apiId: 'ARB',
    },
    stg: {
      name: 'Stargate Token',
      symbol: 'STG',
      decimals: 18,
      address: '0x6694340fc020c5E6B96567843da2df01b2CE1eb6',
      logoURI: './images/tokens/STG.png',
      apiId: 'STG',
    },
    wbtc: {
      name: 'Wrapped Bitcoin',
      symbol: 'WBTC',
      decimals: 8,
      address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
      logoURI: './images/tokens/btc.png',
      apiId: 'BTC',
    },
    pendle: {
      name: 'Pendle',
      symbol: 'PENDLE',
      decimals: 18,
      address: '0x0c880f6761f1af8d9aa9c466984b80dab9a8c9e8',
      logoURI: './images/tokens/btc.png',
      apiId: 'PENDLE',
    },
    magic: {
      name: 'Magic',
      symbol: 'MAGIC',
      decimals: 18,
      address: '0x539bdE0d7Dbd336b79148AA742883198BBF60342',
      logoURI: './images/tokens/magic.png',
      apiId: 'MAGIC',
    },
    gmx: {
      name: 'GMX',
      symbol: 'GMX',
      decimals: 18,
      address: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
      logoURI: './images/tokens/GMX.png',
      apiId: 'GMX',
    },
    RDNT: {
      name: 'RDNT',
      symbol: 'RDNT',
      decimals: 18,
      address: '0x3082CC23568eA640225c2467653dB90e9250AaA0',
      logoURI: './images/tokens/rdnt.png',
      apiId: 'RDNT',
    },
    WBNB: {
      name: 'WBNB',
      symbol: 'WBNB',
      decimals: 18,
      address: '0x20865e63B111B2649ef829EC220536c82C58ad7B',
      logoURI: './images/tokens/wbnb.webp',
      apiId: 'WBNB',
    },
    MATIC: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
      address: '0x561877b6b3DD7651313794e5F2894B2F18bE0766',
      logoURI: './images/tokens/matic.png',
      apiId: 'MATIC',
    },
  },
  keys: {},
}
