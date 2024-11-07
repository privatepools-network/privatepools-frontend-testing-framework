import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'
import 'dotenv/config'
import BasicSetup from '../wallet-setup/basic.setup.mjs'
import { createPool, createAnvil } from '@viem/anvil'
import { ethers } from 'ethers'
import { signMessage } from './signMessage.mjs'

const test = testWithSynpress(metaMaskFixtures(BasicSetup))

const { expect } = test
test('Deposit', async ({
  context,
  page,
  metamaskPage,
  extensionId,
  createAnvilNode,
  connectToAnvil,
  metamask,
  _contextPath,
}) => {
  await signMessage(metamask, createAnvilNode, page, metamaskPage)
  console.log('d1')
  await page.goto(
    '/pools/0x7ba6cb6380f1dfb363bfbe3e86d42248e93036b8000100000000000000000001/BNB/deposit',
  )
  console.log('d2')
  const tokenInput = page.locator('.currency_container .token-input')
  await tokenInput.click()
  await tokenInput.fill('1') // Clear the input and type '1'
  console.log('d3')

  await page.locator('.compose_pool_connect_wallet').click()
  console.log('d4')

  // Wait for 15 seconds
  await page.waitForTimeout(15000)
  console.log('d5')

  // Click the connect wallet button again
  await page.locator('.compose_pool_connect_wallet').click()
  console.log('d6')

  // Wait for another 15 seconds
  await page.waitForTimeout(15000)
  console.log('d7')

  await page.locator('.compose_pool_connect_wallet').click()

  await page.waitForTimeout(15000)
  console.log('d8')
  // Confirm the Metamask transaction (implement Metamask helper as needed)
  await metamask.confirmTransaction()
  console.log('d9')

  // Wait for 15 seconds
  await page.waitForTimeout(15000)
  console.log('d10')
})
