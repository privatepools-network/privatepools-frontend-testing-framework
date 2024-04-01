export const UNISWAP_POOL_HOLDERS = (pool) => `
{
  positions(first:1000, where:{pool:"${pool}"}){
    owner
  }
}
`
