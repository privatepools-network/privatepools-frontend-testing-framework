export default function numberToAposthrophe(x, fixedDecimals = 0) {
  // Convert the number to a string
  let numberStr = parseFloat(x).toFixed(fixedDecimals).toString()
  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = numberStr.split('.')
  // Add the separator to the integer part
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  // If there is a decimal part, append it to the formatted integer part
  const formattedNumber = decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart
  return formattedNumber
}
