import { formatSimpleDate, formatBigNumber } from '../utils'

/**
 * @typedef {Array} Timestamps
 */

/**
 * @typedef {Object} TVL
 * @property {string} name
 * @property {string} title
 * @property {string} label
 * @property {boolean} isPair
 * @property {boolean} isSelected
 * @property {string} color
 * @property {Array} denominations
 * @property {Array} selectedDenominations
 * @property {boolean} isOptionsOpened
 * @property {boolean} isSolo
 * @property {Array} data
 * @property {boolean} cumulable
 */

/**
 * @typedef {Object} Profits
 * @property {string} name
 * @property {string} title
 * @property {string} label
 * @property {boolean} isPair
 * @property {boolean} isSelected
 * @property {string} color
 * @property {Array} denominations
 * @property {Array} selectedDenominations
 * @property {boolean} isOptionsOpened
 * @property {boolean} isSolo
 * @property {Array} data
 * @property {boolean} cumulable
 */

/**
 * @typedef {Object} ProfitsPerPair
 * @property {string} name
 * @property {string} title
 * @property {string} label
 * @property {boolean} isPair
 * @property {boolean} isSelected
 * @property {string} color
 * @property {Array} denominations
 * @property {Array} selectedDenominations
 * @property {boolean} isOptionsOpened
 * @property {boolean} isSolo
 * @property {Array} data
 * @property {boolean} cumulable
 */

/**
 * @typedef {Object} PriceOfAssets
 * @property {string} name
 * @property {string} title
 * @property {string} label
 * @property {boolean} isPair
 * @property {boolean} isSelected
 * @property {string} color
 * @property {Array} denominations
 * @property {Array} selectedDenominations
 * @property {boolean} isOptionsOpened
 * @property {boolean} isSolo
 * @property {Array} data
 * @property {boolean} cumulable
 */

/**
 * @typedef {Object} AssetsReserves
 * @property {string} name
 * @property {string} title
 * @property {string} label
 * @property {boolean} isPair
 * @property {boolean} isSelected
 * @property {string} color
 * @property {Array} denominations
 * @property {Array} selectedDenominations
 * @property {boolean} isOptionsOpened
 * @property {boolean} isSolo
 * @property {Array} data
 * @property {boolean} cumulable
 */

/**
 * @typedef {Object} AssetsRatio
 * @property {string} name
 * @property {string} title
 * @property {string} label
 * @property {boolean} isPair
 * @property {boolean} isSelected
 * @property {string} color
 * @property {Array} denominations
 * @property {Array} selectedDenominations
 * @property {boolean} isOptionsOpened
 * @property {boolean} isSolo
 * @property {Array} data
 * @property {boolean} cumulable
 */

/**
 * @typedef {Object} ReservesRatio
 * @property {string} name
 * @property {string} title
 * @property {string} label
 * @property {boolean} isPair
 * @property {boolean} isSelected
 * @property {string} color
 * @property {Array} denominations
 * @property {Array} selectedDenominations
 * @property {boolean} isOptionsOpened
 * @property {boolean} isSolo
 * @property {Array} data
 * @property {boolean} cumulable
 */

/**
 * @typedef {Object} SimulationChartData
 * @property {Timestamps} timestamps
 * @property {TVL} TVL
 * @property {Profits} profits
 * @property {ProfitsPerPair} profitsPerPair
 * @property {PriceOfAssets} priceOfAssets
 * @property {AssetsReserves} assetsReserves
 * @property {AssetsRatio} assetsRatio
 * @property {ReservesRatio} reservesRatio
 */

/**
 * Get maximum yearly results.
 * @function InitMaxYearlyValues
 * @param {import('@/composables/simulator/useSimulation').YearlyResult[]} data  - yearly results from response
 * @returns {Map<string, string>} - map with max values for each year
 */
function InitMaxYearlyValues(data) {
  // Initialize an object to store the maximum values
  const maxValues = {}

  // Loop through the array of objects
  data.forEach((item) => {
    // Loop through the keys in each object
    for (const key in item) {
      // Check if the key is already in maxValues and update it if the current value is greater
      if (
        key !== 'year' &&
        (maxValues[key] === undefined || item[key] > maxValues[key])
      ) {
        maxValues[key] = item[key]
      }
    }
  })
  return maxValues
}

/**
 * Represents the detailed information for a specific year within the yearlyResults object.
 * @typedef {Object} YearInfoDetails
 * @property {number} id - Identifier for the information.
 * @property {string} title - Title of the information.
 * @property {number} value - Value of the information.
 * @property {string} equivalent - Equivalent unit (e.g., '%', '$').
 * @property {number} maxValue - Maximum value for the information.
 */

/**
 * Represents the yearlyResults object where each year is mapped to YearInfoDetails.
 * @typedef {Object.<string, YearInfoDetails[]>} YearlyResultsFormatted
 */

/**
 * Format yearly results from CSV response
 * @function InitYearlyResults
 * @param {import('@/composables/simulator/useSimulation').YearlyResult[]} _yearlyResults - yearly results from response
 * @param {import('@/composables/simulator/useSimulation').SimData} simData - simulation data from response
 * @returns {YearlyResultsFormatted} formatted yearly results
 */
function InitYearlyResults(_yearlyResults, simData) {
  let yearlyResults = {}
  let maxYearlyResults = InitMaxYearlyValues(_yearlyResults)
  for (let i = 0; i < _yearlyResults.length; i++) {
    let yearInfo = _yearlyResults[i]
    yearlyResults[yearInfo['year']] = [
      {
        id: 1,
        title: 'APR',
        value: yearInfo['apr'],
        equivalent: '%',
        maxValue: maxYearlyResults['apr'],
      },
      {
        id: 2,
        title: 'ROI',
        value: yearInfo['roi'],
        equivalent: '%',
        maxValue: maxYearlyResults['roi'],
      },
      {
        id: 3,
        title: 'Profit/Loss',
        value: yearInfo['profitLoss'],
        equivalent: '$',
        maxValue: maxYearlyResults['profitLoss'],
      },
      {
        id: 4,
        title: 'Capital Gains',
        value: yearInfo['capitalGains'],
        equivalent: '$',
        maxValue: maxYearlyResults['capitalGains'],
      },
      {
        id: 5,
        title: 'APR YOY',
        value: simData['aprYoY'],
        equivalent: '%',
        maxValue: simData['aprYoY'],
      },
      {
        id: 6,
        title: 'ROI YOY',
        value: simData['roiYoY'],
        equivalent: '%',
        maxValue: simData['roiYoY'],
      },
      {
        id: 7,
        title: 'Profits EOY',
        value: simData['totalUsdProfitsEoY'],
        equivalent: '$',
        maxValue: simData['totalUsdProfitsEoY'],
      },
      {
        id: 8,
        title: 'Total Profits',
        value: simData['totalUSDProfitsSum'],
        equivalent: '$',
        maxValue: simData['totalUSDProfitsSum'],
      },
    ]
  }
  return yearlyResults
}

/**
 * Represents detailed information for a specific item in the array.
 * @typedef {Object} InfoItem
 * @property {string} label - Label describing the information.
 * @property {string | number} value - Value of the information.
 */

/**
 * Represents an array of detailed information items.
 * @typedef {InfoItem[]} DetailedInitialInfoArray
 */

/**
 * Format initial data for simulation response.
 * @function FormatInitialData
 * @param {InitialSimulationData} initialData - initial simulation data from the form
 * @param {import('@/composables/simulator/useSimulation').SimData} simData - simulation data from response
 * @returns {DetailedInitialInfoArray} formatted initial data
 */
function FormatInitialData(initialData, simData) {
  return [
    {
      label: 'Start-Time',
      value: formatSimpleDate(initialData.timeRange[0]),
    },
    {
      label: 'End-Time',
      value: formatSimpleDate(initialData.timeRange[1]),
    },
    {
      label: 'Initial Liquidity',
      value: `$${initialData.depositAmount}`,
    },
    {
      label: 'Fee Selected',
      value: `${initialData.fee}%`,
    },
    {
      label: 'Weight Array',
      value: initialData.tokens
        .map((token, index) => `${token} ${initialData.weights[index]}`)
        .join('-'),
    },
    {
      label: 'Days Simulated',
      value: simData.daysPassed,
    },
  ]
}

/**
 * Represents detailed options for a specific item in the result array.
 * @typedef {Object} ProfitOption
 * @property {string} title - Title of the option.
 * @property {string} data - Data associated with the option.
 */

/**
 * Represents detailed information for a specific item in the result array.
 * @typedef {Object} ProfitItem
 * @property {string} label - Label describing the information.
 * @property {ProfitOption[]} options - Array of options associated with the label.
 */

/**
 * Represents the result array containing detailed information with options.
 * @typedef {ProfitItem[]} FormattedProfitArray
 */

/**
 * Format profits data of the simulation response
 * @function FormatProfits
 * @param {import('@/composables/simulator/useSimulation').TokenProfit[]} poolSimDataArray - profits simulation data for the tokens
 * @returns {FormattedProfitArray} formatted profits
 */
function FormatProfits(poolSimDataArray) {
  let result = [
    {
      label: 'Profits (USD)',
      options: [],
    },
    {
      label: 'Pool Difference',
      options: [],
    },
    {
      label: 'Pool Difference (USD)',
      options: [],
    },
    {
      label: 'Profit',
      options: [],
    },
    {
      label: 'Profits in',
      options: [],
    },
  ]
  for (let i = 0; i < poolSimDataArray.length; i++) {
    let token = poolSimDataArray[i]
    result[0].options.push({
      title: token.symbol,
      data: `$${formatBigNumber(token.tokenProfitsUSD)}`,
    })
    result[1].options.push({
      title: token.symbol,
      data: `${formatBigNumber(token.tokenDif)} ${token.symbol}`,
    })
    result[2].options.push({
      title: token.symbol,
      data: `$${formatBigNumber(token.tokenDifUSD)}`,
    })
    result[3].options.push({
      title: token.symbol,
      data: '-',
    })
    result[4].options.push({
      title: token.symbol,
      data: `${formatBigNumber(token.tokenProfits)} ${token.symbol}`,
    })
  }
  return result
}

/**
 * @typedef {Object} InitialSimulationData
 * @property {string[]} tokens - token symbols
 * @property {number[]} weights - token weights
 * @property {number} fee - fee percent
 * @property {number} depositAmount - deposit amount
 * @property {string[]} timeRange - time range for sumulation
 */

/**
 * @typedef {Object} FormattedSimulationResult
 * @property {YearlyResultsFormatted} yearlyResults
 * @property {{initialLiquidity:number, averageLiquidity:number, finalPoolLiquidity:number}} liquidityInfo
 * @property {DetailedInitialInfoArray} parameters
 * @property {FormattedProfitArray} profitsInfo
 * @property {{csvFilename:string, csvFormat:import('@/composables/simulator/useSimulation').CsvFormat}} csv
 */

/**
 * Format simulations results.
 * @function FormatSimulationResults
 * @param {import('@/composables/simulator/useSimulation').SimulationData} results - simulation response data
 * @param {InitialSimulationData} initialData - initial simulation data from the form
 * @returns {FormattedSimulationResult} formatted simulation results
 */
export function FormatSimulationResults(results, initialData) {
  let _yearlyResults = results['yearlyResults']
  const simData = results['simData']
  let yearlyResults = InitYearlyResults(_yearlyResults, simData)
  let profitsInfo = FormatProfits(results.poolSimDataArray)
  return {
    yearlyResults,
    liquidityInfo: {
      initialLiquidity: simData.initialLiquidity,
      averageLiquidity: simData.averageLiquidity,
      finalLiquidity: simData.finalPoolLiquidity,
    },
    parameters: FormatInitialData(initialData, simData),
    profitsInfo,
    csv: {
      csvFilename: results['csvFilename'],
      csvFormat: results['csvFormat'],
    },
  }
}

const CSV_MAPPING = {
  priceOfAssets: 'pricesArrayLength',
  assetsRatio: 'ratioArrayLength',
  assetsReserves: 'mainPoolReservesArrayLength',
  reservesRatio: 'mainPoolRatioArrayLength',
  profits: 'profitsArrayLength',
  profitsPerPair: 'usdProfitsArrayLength',
}

/**
 * Set simulation chart data
 * @function FormatSimulationChart
 * @param {any[]} csv - csv data
 * @param {import('@/composables/simulator/useSimulation').CsvFormat} csvFormat - format of the csv
 * @param {import('vue').Ref<any>} chartDataRef - reference to chart data
 * @returns {SimulationChartData} formatted data for the chart
 */
export function FormatSimulationChart(csv, csvFormat, chartDataRef) {
  let resultFormat = {
    timestamps: [],
    TVL: {
      name: 'TVL',
      title: 'TVL',
      label: '',
      isPair: false,
      isSelected: false,
      color: '#335cd7',
      denominations: [],
      selectedDenominations: [],
      isOptionsOpened: false,
      isSolo: true,
      data: [],
      cumulable: false,
    },
    profits: {
      name: 'profits',
      title: 'Profits',
      label: '',
      isPair: false,
      isSelected: false,
      color: '#fa4646',
      denominations: [],
      selectedDenominations: [],
      isOptionsOpened: false,
      isSolo: true,
      data: [],
      cumulable: true,
    },
    profitsPerPair: {
      name: 'profitsPerPair',
      title: 'Profits per Pair',
      label: '',
      isPair: true,
      isSelected: false,
      color: '#46faf2',
      denominations: [],
      selectedDenominations: [],
      isOptionsOpened: false,
      isSolo: false,
      data: [],
      cumulable: true,
    },
    priceOfAssets: {
      name: 'priceOfAssets',
      title: 'Price of Assets',
      label: 'Price of ',
      isPair: false,
      isSelected: false,
      color: '#ffb12b',
      denominations: [],
      selectedDenominations: [],
      isOptionsOpened: false,
      isSolo: false,
      data: [],
      cumulable: false,
    },
    assetsReserves: {
      name: 'assetsReserves',
      title: 'Assets Reserves',
      label: 'Reserve ',
      isPair: false,
      isSelected: false,
      color: '#7700ff',
      denominations: [],
      selectedDenominations: [],
      isOptionsOpened: false,
      isSolo: false,
      data: [],
      cumulable: false,
    },
    assetsRatio: {
      name: 'assetsRatio',
      title: 'Assets ratio',
      label: '',
      isPair: true,
      isSelected: false,
      color: '#307622',
      denominations: [],
      selectedDenominations: [],
      isOptionsOpened: false,
      isSolo: false,
      data: [],
      cumulable: false,
    },
    reservesRatio: {
      name: 'reservesRatio',
      title: 'Reserves Ratio',
      label: '',
      isPair: true,
      isSelected: false,
      color: '#00a09d',
      denominations: [],
      selectedDenominations: [],
      isOptionsOpened: false,
      isSolo: false,
      data: [],
      cumulable: false,
    },
  }
  let keys = Object.keys(resultFormat)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    resultFormat[key].index = i
    if (key == 'timestamps') {
      resultFormat[key] = csv[0].filter((d) => d != '')
    } else if (i == 1) {
      resultFormat['TVL'].data = [csv[csv.length - 1]]
    } else {
      if (key != 'mirrorPoolReservesArrayLength') {
        let indexes = getCSVIndexes(key, csvFormat)
        if (key != 'profits') {
          resultFormat[key].data = indexes.map((index) =>
            csv[index].filter((d) => d != ''),
          )
        }
        if (key == 'profitsPerPair') {
          let result = sumArrays(
            indexes.map((index) => csv[index].filter((d) => d != '')),
          )
          resultFormat['profits'].data = [result]
        }
      }
    }
  }
  chartDataRef.value = resultFormat
  return resultFormat
}

/**
 * Summarize array values
 * @function sumArrays
 * @param {any[][]} arrays - array of arrays to summarize
 * @returns {any[]}
 */
function sumArrays(arrays) {
  const maxLength = Math.max(...arrays.map((arr) => arr.length))
  const result = new Array(maxLength).fill(0)

  for (const array of arrays) {
    for (let i = 0; i < array.length; i++) {
      result[i] += parseFloat(array[i])
    }
  }

  return result
}

/**
 * Get indexes by csv key.
 * @function getCSVIndexes
 * @param {string} key
 * @param {import('@/composables/simulator/useSimulation').CsvFormat} csvFormat
 * @returns {number[]} - array of indexes
 */
function getCSVIndexes(key, csvFormat) {
  let keys = Object.keys(csvFormat)
  let index = 0
  for (let k = 0; k < keys.length; k++) {
    if (keys[k] == CSV_MAPPING[key]) {
      return getNumbersBetween(index, index + csvFormat[keys[k]])
    }
    index += csvFormat[keys[k]]
  }
  return []
}

/**
 * Get all numbers between 2 numbers.
 * @function getNumbersBetween
 * @param {number} start
 * @param {number} end
 * @returns {number[]} all numbers between 2 numbers
 */
function getNumbersBetween(start, end) {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}
