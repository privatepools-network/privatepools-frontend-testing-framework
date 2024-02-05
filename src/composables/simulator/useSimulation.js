import {
  FormatSimulationChart,
  FormatSimulationResults,
} from '@/lib/formatter/simulationResultsFormatter'
import axios from 'axios'
import Papa from 'papaparse'
const SIMULATE_BASE_URL = process.env.VUE_APP_SIMULATE_BASE_URL

/**
 * @typedef {Object} YearlyResult
 * @property {number} year - The year.
 * @property {number} initialLiquidity - Initial liquidity for the year.
 * @property {number} finalPoolLiquidity - Final pool liquidity for the year.
 * @property {number} averageLiquidity - Average liquidity for the year.
 * @property {number} capitalGains - Capital gains for the year.
 * @property {number} totalUsdProfitsEoY - Total USD profits at the end of the year.
 * @property {number} apr - Annual Percentage Rate for the year.
 * @property {number} roi - Return on Investment for the year.
 * @property {number} profitLoss - Profit or loss for the year.
 */

/**
 * @typedef {Object} TokenProfit
 * @property {number} tokenProfits - Token profits.
 * @property {number} tokenProfitsUSD - Token profits in USD.
 * @property {string} symbol - Symbol of the token.
 * @property {number} tokenDif - Token difference.
 * @property {number} tokenDifUSD - Token difference in USD.
 */

/**
 * @typedef {Object} CsvFormat
 * @property {number} timelineArrayLength - Length of the timeline array.
 * @property {number} pricesArrayLength - Length of the prices array.
 * @property {number} ratioArrayLength - Length of the ratio array.
 * @property {number} mainPoolReservesArrayLength - Length of the main pool reserves array.
 * @property {number} mainPoolRatioArrayLength - Length of the main pool ratio array.
 * @property {number} mirrorPoolReservesArrayLength - Length of the mirror pool reserves array.
 * @property {number} profitsArrayLength - Length of the profits array.
 * @property {number} usdProfitsArrayLength - Length of the USD profits array.
 */

/**
 * @typedef {Object} SimData
 * @property {number} initialLiquidity - Initial liquidity for the simulation.
 * @property {number} totalUSDProfitsSum - Total USD profits sum.
 * @property {number} averageLiquidity - Average liquidity.
 * @property {number} finalPoolLiquidity - Final pool liquidity.
 * @property {number} aprYoY - Annual Percentage Rate Year over Year.
 * @property {number} totalUsdProfitsEoY - Total USD profits at the end of the year.
 * @property {number} capitalGains - Capital gains.
 * @property {number} profitLoss - Profit or loss.
 * @property {number} roiYoY - Return on Investment Year over Year.
 * @property {number} daysPassed - Number of days passed.
 * @property {string} compounding - Compounding status.
 * @property {number} totalROI - Total Return on Investment.
 */

/**
 * @typedef {Object} SimulationData
 * @property {string} simName - Simulation name.
 * @property {SimData} simData - Simulation data.
 * @property {YearlyResult[]} yearlyResults - Array of yearly results.
 * @property {TokenProfit[]} poolSimDataArray - Array of pool simulation data.
 * @property {CsvFormat} csvFormat - CSV format information.
 * @property {string} csvFilePath - CSV file path.
 */

/**
 * Set simulation chart data.
 * @function useSimulation
 * @param {string[]} tokens - token symbols
 * @param {number[]} weights - token weights
 * @param {number} fee - fee percent
 * @param {number} depositAmount - deposit amount
 * @param {string[]} timeRange - time range for sumulation
 * @param {import('vue').Ref<any>} chartDataRef - reference to chart data
 * @returns {import('@/lib/formatter/simulationResultsFormatter').FormattedSimulationResult} formatted simulation results
 */
export async function useSimulation(
  tokens,
  weights,
  fee,
  depositAmount,
  timeRange,
  chartDataRef,
) {
  try {
    const response = await axios.post(
      `${SIMULATE_BASE_URL}/simulate`,
      {
        assetSymbols: tokens,
        weightArray: weights,
        mainPoolLiquidity: depositAmount,
        deviationThreshold: 4,
        mirrorPoolLiquidity: '10000000000000000',
        avgGasFee: 0.03,
        dexFee: 0,
        dexFee2: fee,
        startTime: timeRange[0],
        endTime: timeRange[1],
        compounding: 'false',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    if (response.status == 200) {
      if (response.data.message) {
        return response.data.message
      }
      DownloadCsvFile(
        response.data['csvFilename'],
        response.data['csvFormat'],
        chartDataRef,
      )
      return FormatSimulationResults(response.data, {
        tokens,
        weights,
        fee,
        depositAmount,
        timeRange,
      })
    }
  } catch (error) {
    console.error(error)
  }
  return {}
}

/**
 * Download CSV file by path and format it.
 * @function DownloadCsvFile
 * @param {string} fileName - name of the csv file
 * @param {CsvFormat} csvFormat - format of the csv
 * @param {import('vue').Ref<any>} chartDataRef - reference to chart data
 * @returns {void}
 */
async function DownloadCsvFile(fileName, csvFormat, chartDataRef) {
  const response = await axios.get(
    `${SIMULATE_BASE_URL}/download-csv/${fileName}`,
  )
  let csvArray = transpose(Papa.parse(response.data).data)
  FormatSimulationChart(csvArray, csvFormat, chartDataRef)
}

/**
 * Transpose matrix
 * @function transpose
 * @param {any[]} matrix - matrix to transpose
 * @returns {any[]} transposed matrix
 */
function transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]))
}
