export const UNISWAP_PPN_HISTORY =(pool) => `{
  poolTokenHourDatas(where:{pool:"0x37db09f292929bcd05a50825bf91f64a26f36f1d"}, orderBy:date, orderDirection:asc){
    totalValueLocked
    token{
      symbol
    }
    date
  }
}`
