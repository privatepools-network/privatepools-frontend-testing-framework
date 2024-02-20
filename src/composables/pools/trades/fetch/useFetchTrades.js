import axios from 'axios'

export async function fetchDataAndMerge() {
  console.log('Starting requests...')

  let links = [
    process.env.VUE_APP_OUTPUT_LINK_ARBITRUM,
    process.env.VUE_APP_OUTPUT_LINK_BINANCE,
    process.env.VUE_APP_OUTPUT_LINK_POLYGON,
  ]
  const [response1, response2, response3] = await Promise.all(
    links.map((l) =>
      l != undefined
        ? axios.get(`${l}/output`)
        : new Promise((resolve) => {
            resolve({ data: [] })
          }),
    ),
  )

  console.log('All requests completed!')

  let data1 = response1.data
  let data2 = response2.data
  let data3 = response3.data

  data1 = data1.length > 0 ? addChainToData(data1, 'arbitrum') : []
  data2 = data2.length > 0 ? addChainToData(data2, 'binance') : []
  data3 = data3.length > 0 ? addChainToData(data3, 'polygon') : []
  let mergedData = []

  mergedData = [...data1, ...data2, ...data3]
  return mergedData
}

function addChainToData(data, chain) {
  if (Array.isArray(data)) {
    return data.map((item) => ({ ...item, chain }))
  }
  return [{ ...data, chain }]
}
