function runWithTimeout(promise, timeoutMs) {
  // Create a timeout promise that resolves after timeoutMs milliseconds
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Promise timed out')), timeoutMs)
  })

  // Use Promise.race to race the promise against the timeout
  return Promise.race([promise, timeoutPromise])
}

export async function signMessage(
  metamask,
  createAnvilNode,
  page,
  metamaskPage,
) {
  console.log('s1')
  const { rpcUrl, chainId } = await createAnvilNode({
    rpcUrl: 'https://bscrpc.com',
    chainId: 56,
    port: 8545,
  })
  console.log('s2')
  const network = {
    name: 'Anvil',
    rpcUrl,
    chainId,
    symbol: 'ETH',
    blockExplorerUrl: 'https://etherscan.io/',
  }
  try {
    await runWithTimeout(metamask.addNetwork(network), 15_000)
    console.log('s3')
    await metamaskPage.reload()
    console.log('s4')
    await runWithTimeout(metamask.switchNetwork('Anvil', false), 15_000)
    console.log('s5')
  } catch (e) {
    await metamaskPage.reload()
    console.log('s6')
    try {
      await runWithTimeout(metamask.switchNetwork('Anvil', false), 15_000)
    } catch {
      console.log('s6.5')
    }
    console.log('s7')
  }

  console.log('s8')
  await page.goto('http://localhost:8080/pools')

  console.log('s9')
  await page.waitForSelector(
    'div.referrals_button:has-text("Connect your wallet")',
    { timeout: 100000 },
  )
  console.log('s10')
  await page.click('div.referrals_button:has-text("Connect your wallet")')
  console.log('s11')

  await metamask.connectToDapp()
  console.log('s12')
  await page.waitForSelector('//div[contains(text(), "Sign and proceed")]', {
    timeout: 100000,
  })
  console.log('s13')
  await page.click('//div[contains(text(), "Sign and proceed")]')
  console.log('s14')
  await page.waitForTimeout(15000) // Wait for another 15 seconds
  console.log('s15')

  await metamask.confirmSignature()
}
