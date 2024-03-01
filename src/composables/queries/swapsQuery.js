export const SWAPS_QUERY = (poolId) =>
  `query { swaps (first: 10, orderBy: "timestamp", orderDirection: "desc", skip: 0, where: {poolId: "${poolId}"}) { tokenIn tokenOut tokenAmountIn tokenAmountOut tx timestamp tokenInSym tokenOutSym } }`
