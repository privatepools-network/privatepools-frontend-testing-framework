import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'
import 'dotenv/config'
import BasicSetup from '../wallet-setup/basic.setup.mjs'
import { createPool, createAnvil } from '@viem/anvil'
import { ethers } from 'ethers'
import { signMessage } from './signMessage.mjs'

const test = testWithSynpress(metaMaskFixtures(BasicSetup))

const { expect } = test
test('Claim', async ({
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
  console.log('CLAIM START')
  await page.goto('/pools')
  await page.waitForTimeout(20_000)
  console.log('c1')
  await page.locator('.button_drop').click()
  console.log('c2')
  await page.waitForTimeout(5_000)
  console.log('c3')
  await page.locator('.rewards_button_dropdown').click()
  console.log('c4')
  const toastLocator = page.locator('.toast_text')
  const toastText = await toastLocator.textContent()
  if (
    toastText &&
    toastText.includes(
      'Claiming your rewards is currently unavailable due to a recent trade',
    )
  ) {
    console.log('Toast message found, skipping confirmation')
  } else {
    console.log('No toast message found, proceeding with confirmation')
    await metamask.confirmTransaction()
  }
  console.log('CLAIM END!')
  await page.waitForTimeout(15_000)
})
