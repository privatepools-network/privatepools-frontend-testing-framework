export const UNISWAP_POOL_TICKS = (poolId) => `
{
ticks(where:{pool:"${poolId}"}, orderBy:tickIdx, orderDirection:asc)
{
  liquidityGross
  tickIdx
  liquidityNet
}}
`
