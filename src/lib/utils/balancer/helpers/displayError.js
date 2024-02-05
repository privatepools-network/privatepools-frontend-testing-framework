const ERRORS = {
  'BAL#433': 'Address is not allowlisted',
  'BAL#406': 'Insufficient balance',
  'BAL#419': 'Insufficient balance',
  'BAL#311': 'Pool balances must be > 0',
  'BAL#304': 'Token in unbalanced the pool too much on a swap',
  'BAL#305': 'Token out unbalanced the pool too much on a swap',
  'BAL#306': 'Disproportionate exit unbalanced the pool too much',
  'BAL#307': 'Disproportionate join unbalanced the pool too much',
  'BAL#505': 'Exit would yield fewer than the user-supplied minimum tokens out',
  'BAL#207': 'Slippage/front-running protection check failed on a pool exit',
  'user rejected transaction': 'User rejected transaction',
}

export function GetDisplayStringError(errorCode) {
  for (const [key, value] of Object.entries(ERRORS)) {
    if (errorCode.includes(key)) {
      return value
    }
  }
  return errorCode
}
