import axios from 'axios'
import { formatNotificationDate } from '@/lib/utils/index'

/**
 * @typedef {import('./composables/pools/usePoolSwapsStats').Swap} Swap
 */

/**
 * Find uniquie elements in both of arrays.
 * @function findDifferences
 * @param {Array<Object>} array1
 * @param {Array<Object} array2
 * @returns {Array<Object>} array of objects that exists in only one of the arrays
 */
function findDifferences(array1, array2) {
  const differences = []

  // Check items in array1 that are not present in array2
  const inArray1NotInArray2 = array1.filter(
    (item1) => !array2.some((item2) => isEqual(item1, item2)),
  )

  // Check items in array2 that are not present in array1
  const inArray2NotInArray1 = array2.filter(
    (item2) => !array1.some((item1) => isEqual(item1, item2)),
  )

  differences.push(...inArray1NotInArray2, ...inArray2NotInArray1)

  return differences
}

/**
 * Helper function to check object equality
 * @function isEqual
 * @param {Object} obj1
 * @param {Object} obj2
 * @returns {boolean} is object1 equals obj2 by value.
 */
function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

onmessage = async function (e) {
  let { method, data } = e.data
  switch (method) {
    case 'update':
      await updateNotifications(this, data)
      break
    case 'add':
      await addNotification(
        this,
        data['all_notifications'],
        data['newNotification'],
      )
  }
}

/**
 * Check if there are any new trades or not.
 * @function updateNotifications
 * @param {Worker} window - worker object
 * @param {*} all_notifications
 * @returns {Promise<void>}
 */
async function updateNotifications(window, all_notifications) {
  let presentData = await fetchOutputs()
  await fetchData()
  let updatedData = await fetchOutputs()

  let diff_items = findDifferences(presentData, updatedData)
  addTradesNotification(window, all_notifications, diff_items)
}
/**
 * Start parsing of trades for each chain.
 * @function fetchData
 */
async function fetchData() {
  // let links = [
  //   process.env.VUE_APP_OUTPUT_LINK_ARBITRUM,
  //   process.env.VUE_APP_OUTPUT_LINK_BINANCE,
  //   process.env.VUE_APP_OUTPUT_LINK_POLYGON,
  // ]
  // await Promise.all(
  //   links.map((l) =>
  //     l != undefined
  //       ? axios.get(`${l}/fetch-data`, {
  //           timeout: 120000,
  //         })
  //       : new Promise((resolve) => {
  //           resolve({ data: [] })
  //         }),
  //   ),
  // )
}

/**
 * Get all arbitrage trades on all chains.
 * @function fetchOutputs
 * @returns {Promise<Swap[]>} array of all trades on all chains
 */
async function fetchOutputs() {
  let links = [
    process.env.VUE_APP_OUTPUT_LINK_ARBITRUM,
    process.env.VUE_APP_OUTPUT_LINK_BINANCE,
    process.env.VUE_APP_OUTPUT_LINK_POLYGON,
  ]
  let data = await Promise.all(
    links.map((l) =>
      l != undefined
        ? axios.get(`${l}/output`)
        : new Promise((resolve) => {
            resolve({ data: [] })
          }),
    ),
  )

  return data.map((d) => d.data).flat()
}

/**
 * Add new notification.
 * @function addNotification
 * @param {Worker} window - worker object
 * @param {*} all_notifications - current notifications
 * @param {*} notification - new notification to add
 * @returns {*} all notifications with the new one.
 */
function addNotification(window, all_notifications, notification) {
  all_notifications = [notification, ...all_notifications]
  window.postMessage(all_notifications)
  return all_notifications
}

/**
 * Add notification from new arbitrage trade
 * @function addTradesNotification
 * @param {Worker} window - worker object
 * @param {*} all_notifications - all current notifications
 * @param {Swap[]} trades - new trades
 * @returns {void}
 */
function addTradesNotification(window, all_notifications, trades) {
  console.log('TRADES - ', trades)
  for (let i = 0; i < trades.length; i++) {
    all_notifications = addNotification(window, all_notifications, {
      type: 'Successful Trade',
      value: `$${parseFloat(trades[i].profitUsd).toFixed(
        2,
      )} Profit - ${formatNotificationDate(trades[i].timestamp * 1000)}`,
      status: 'Traded',
      network: trades[i].chain,
      hash: trades[i].hash,
    })
  }
}
