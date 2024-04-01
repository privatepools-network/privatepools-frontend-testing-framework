export function PoolSharesQuery(account, poolId) {
  return `query { poolShares (first: 300, where: {balance_gt: 0, userAddress: "${account.toLowerCase()}", poolId:"${poolId}"}) { poolId { id } balance percentage } }`
}

export function AllPoolSharesQuery(account) {
  return `query { poolShares (first: 300, where: {balance_gt: 0, userAddress: "${account.toLowerCase()}"}) { poolId { id } balance percentage } }`
}
