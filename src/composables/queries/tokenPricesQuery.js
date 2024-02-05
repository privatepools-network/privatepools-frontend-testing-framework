export function TokensPricesQuery(addresses) {
  const lowerCaseAddresses = addresses.map((address) => address.toLowerCase())

  return `
    {tokenPrices (orderBy:timestamp, orderDirection:desc, where:{asset_in:["${lowerCaseAddresses.join(
      '","',
    )}"]}){
    asset
    timestamp
    priceUSD
  }}
    `
}

export function FilteredTokensPricesQuery(assets, pricingAssets) {
  assets = assets.map((a) => a.toLowerCase())
  pricingAssets = pricingAssets.map((p) => p.toLowerCase())
  return `
  {
  tokenPrices(where:{and:[{pricingAsset_in:["${pricingAssets.join(
    '","',
  )}"]}, {asset_in:["${assets.join('","')}"]}]}){
    id
    asset
    pricingAsset
  }
}
  `
}
