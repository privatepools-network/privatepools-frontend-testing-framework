export function strictCheckChartOffsetConditions(
  yaxis1,
  yaxis2,
  yaxis3,
  yaxis4,
  optionObj,
) {
  if (
    yaxis1.value === true &&
    yaxis2.value === true &&
    yaxis3.value === true &&
    yaxis4.value === true
  ) {
    optionObj.value.yAxis[1].offset = 0
    optionObj.value.yAxis[2].offset = 60
    optionObj.value.yAxis[3].offset = 120
    optionObj.value.yAxis[4].offset = 180
  }

  if (
    yaxis1.value === false &&
    yaxis2.value === true &&
    yaxis3.value === true &&
    yaxis4.value === true
  ) {
    optionObj.value.yAxis[2].offset = 0
    optionObj.value.yAxis[3].offset = 60
    optionObj.value.yAxis[4].offset = 120
  }

  if (
    yaxis1.value === true &&
    yaxis2.value === false &&
    yaxis3.value === true &&
    yaxis4.value === true
  ) {
    optionObj.value.yAxis[1].offset = 0
    optionObj.value.yAxis[3].offset = 60
    optionObj.value.yAxis[4].offset = 120
  }

  if (
    yaxis1.value === true &&
    yaxis2.value === true &&
    yaxis3.value === false &&
    yaxis4.value === true
  ) {
    optionObj.value.yAxis[1].offset = 0
    optionObj.value.yAxis[2].offset = 60
    optionObj.value.yAxis[4].offset = 120
  }

  if (
    yaxis1.value === false &&
    yaxis2.value === false &&
    yaxis3.value === true &&
    yaxis4.value === true
  ) {
    optionObj.value.yAxis[3].offset = 0
    optionObj.value.yAxis[4].offset = 60
  }

  if (
    yaxis1.value === false &&
    yaxis2.value === false &&
    yaxis3.value === false &&
    yaxis4.value === true
  ) {
    optionObj.value.yAxis[4].offset = 0
  }

  if (
    yaxis1.value === false &&
    yaxis2.value === true &&
    yaxis3.value === false &&
    yaxis4.value === true
  ) {
    optionObj.value.yAxis[2].offset = 0
    optionObj.value.yAxis[4].offset = 60
  }
  if (
    yaxis1.value === true &&
    yaxis2.value === false &&
    yaxis3.value === true &&
    yaxis4.value === true
  ) {
    optionObj.value.yAxis[1].offset = 0
    optionObj.value.yAxis[3].offset = 60
    optionObj.value.yAxis[4].offset = 120
  }
  if (
    yaxis1.value === true &&
    yaxis2.value === false &&
    yaxis3.value === false &&
    yaxis4.value === true
  ) {
    optionObj.value.yAxis[1].offset = 0
    optionObj.value.yAxis[4].offset = 60
  }
  if (
    yaxis1.value === false &&
    yaxis2.value === true &&
    yaxis3.value === false &&
    yaxis4.value === false
  ) {
    optionObj.value.yAxis[2].offset = 0
  }
  if (
    yaxis1.value === false &&
    yaxis2.value === true &&
    yaxis3.value === true &&
    yaxis4.value === false
  ) {
    optionObj.value.yAxis[2].offset = 0
    optionObj.value.yAxis[3].offset = 60
  }
  if (
    yaxis1.value === false &&
    yaxis2.value === false &&
    yaxis3.value === true &&
    yaxis4.value === false
  ) {
    optionObj.value.yAxis[3].offset = 0
  }
  if (
    yaxis1.value === true &&
    yaxis2.value === true &&
    yaxis3.value === true &&
    yaxis4.value === false
  ) {
    optionObj.value.yAxis[1].offset = 0
    optionObj.value.yAxis[2].offset = 60
    optionObj.value.yAxis[3].offset = 120
  }
  if (
    yaxis1.value === true &&
    yaxis2.value === false &&
    yaxis3.value === true &&
    yaxis4.value === false
  ) {
    optionObj.value.yAxis[1].offset = 0
    optionObj.value.yAxis[3].offset = 60
  }
  if (
    yaxis1.value === true &&
    yaxis2.value === true &&
    yaxis3.value === false &&
    yaxis4.value === false
  ) {
    optionObj.value.yAxis[1].offset = 0
    optionObj.value.yAxis[2].offset = 60
  }
}
