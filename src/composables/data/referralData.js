import axios from 'axios'

export async function getReferralCode(user) {
  // DELETE LATER
  const url = `${
    process.env.VUE_APP_REWARDS_BACKEND_BINANCE
  }/referral_code/${user.toLowerCase()}`
  let referral_data = {}
  try {
    const response = await axios.get(url)
    referral_data = response.data
  } catch (e) {
    console.error('[SERVER ERROR]', e)
    referral_data = (
      await axios.get(
        `${
          process.env.VUE_APP_REDUNDANT_REWARDS_BACKEND_BINANCE
        }/referral_code/${user.toLowerCase()}`,
      )
    ).data
  }
  return referral_data.referral_code
}
export async function generateReferralCode(user, code) {
  // DELETE LATER
  const url = `${process.env.VUE_APP_REWARDS_BACKEND_BINANCE}/referral_code/generate`
  let referral_data = {}
  try {
    const response = await axios.post(url, {
      wallet: user,
      referral_code: code,
    })
    referral_data = response.data
  } catch (e) {
    console.error('[SERVER ERROR]', e)
    referral_data = (
      await axios.post(
        `${process.env.VUE_APP_REDUNDANT_REWARDS_BACKEND_BINANCE}/referral_code/generate`,
        {
          wallet: user,
          referral_code: code,
        },
      )
    ).data
  }
  return referral_data
}
