import axios from 'axios'
export async function getStatus() {
  let lastStatusFetched = localStorage.getItem('lastStatusFetched')
  let lastStatus = localStorage.getItem('lastStatus')
  if (lastStatusFetched && Date.now() - lastStatusFetched < 1000 * 60 * 5) {
    return lastStatus
  }
  const url = `${process.env.VUE_APP_STATUS_LINK}`
  try {
    const response = await axios.get(url)
    const status = response.data.every((item) => item.status == 'Success')
    localStorage.setItem('lastStatusFetched', Date.now())
    localStorage.setItem('lastStatus', status)
    return status
  } catch (e) {
    // localStorage.setItem('lastStatusFetched', Date.now())
    // localStorage.setItem('lastStatus', false)
    console.error('[SERVER ERROR]', e)
    return false
  }
}
