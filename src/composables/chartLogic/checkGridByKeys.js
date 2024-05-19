export function checkGridByKeys(showTrueCount, currentGridToRight) {
  if (showTrueCount === 4) {
    currentGridToRight.value = 240
  }
  if (showTrueCount === 3) {
    currentGridToRight.value = 185
  }
  if (showTrueCount === 2) {
    currentGridToRight.value = 130
  }
  if (showTrueCount === 1) {
    currentGridToRight.value = 75
  }
  if (showTrueCount === 0) {
    currentGridToRight.value = 30
  }
}
