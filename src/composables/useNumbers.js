import numeral from 'numeral'
import BigNumber from 'bignumber.js'

const PresetFormats = {
  default: '(0.[0]a)',
  token: '0,0.[0000]',
  token_fixed: '0,0.0000',
  token_lg: '0,0',
  usd: '$0,0.00',
  usd_lg: '$0,0',
  usd_m: '$0,0.00a',
  percent: '0.0%',
  // percent : '0.0000%',
  percent_lg: '0%',
}

export function fNum(number, preset = 'default', options = {}) {
  if (options.format) return numeral(number).format(options.format)

  let adjustedPreset
  if (number >= 10_000 && !options.forcePreset) {
    adjustedPreset = `${preset}_lg`
  }

  if (
    (preset === 'token' || preset === 'token_fixed') &&
    number > 0 &&
    number < 0.0001
  ) {
    return '< 0.0001'
  }

  if (number < 1e-6) {
    // Numeral returns NaN in this case so just set to zero.
    // https://github.com/adamwdraper/Numeral-js/issues/596
    number = 0
  }

  return numeral(number).format(
    PresetFormats[adjustedPreset || preset || 'default'],
  )
}

export default function useNumbers(tokenPrices) {
  function toFiat(amount, tokenAddress) {
    const price = tokenPrices[tokenAddress].price
    const tokenAmount = new BigNumber(amount)
    return tokenAmount.times(price).toString()
  }

  return { fNum, toFiat }
}
