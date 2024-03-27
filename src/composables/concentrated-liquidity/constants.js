// This file stores web3 related constants such as addresses, token definitions, ETH currency references and ABI's

// Addresses

export const POOL_FACTORY_CONTRACT_ADDRESS =
  '0xFfDb6e87aA9B7425E542602C7Ea689D76182A9Ad'
export const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS =
  '0x03cA04Df0EEBd7AD7cad03F47b6dD04D475AA887'
export const V3_SWAP_ROUTER_ADDRESS =
  '0x53fBD87e8d5E478100C01e2be1b6060db8e55365'

// Transactions

export const MAX_FEE_PER_GAS = '100000000000'
export const MAX_PRIORITY_FEE_PER_GAS = '100000000000'

// ABI's

export const ERC20_ABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  'function approve(address _spender, uint256 _value) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
]

export const NONFUNGIBLE_POSITION_MANAGER_ABI = [
  // Read-Only Functions
  'function balanceOf(address _owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address _owner, uint256 _index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string memory)',

  'function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
]

export const WETH_ABI = [
  // Wrap ETH
  'function deposit() payable',

  // Unwrap ETH
  'function withdraw(uint wad) public',
]

export const UNISWAP_SUBGRAPHS = {
  1: 'https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-ethereum',
  56: 'https://api.thegraph.com/subgraphs/name/ruslanzhezh/clp', // 56: 'https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-bsc',
  137: 'https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-polygon',
}
