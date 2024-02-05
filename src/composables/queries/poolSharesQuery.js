export function PoolSharesQuery(account) {
  return `query { poolShares (first: 300, where: {balance_gt: 0, userAddress: "${account.toLowerCase()}"}) { poolId { id } balance } }`
}
