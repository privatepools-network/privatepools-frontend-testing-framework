import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'
import 'dotenv/config'
import BasicSetup from '../wallet-setup/basic.setup.mjs'
import { createPool, createAnvil } from '@viem/anvil'
import { ethers } from 'ethers'
import { signMessage } from './signMessage.mjs'

const test = testWithSynpress(metaMaskFixtures(BasicSetup))

const { expect } = test
test('Zapper', async ({
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
  console.log('ZAPPER START')
  await page.goto(
    '/pools/0x7ba6cb6380f1dfb363bfbe3e86d42248e93036b8000100000000000000000001/BNB/deposit',
  )
  await page.waitForTimeout(3000)
  console.log('z1')
  await page
    .locator('div.cursor-pointer.rounded-full:has(span:has-text("Zap"))')
    .click({ force: true })
  const tokenInput = page.locator('.token-input')
  console.log('z2')
  await tokenInput.click({ force: true })
  console.log('z3')
  await tokenInput.clear()
  console.log('z4')
  await tokenInput.fill('0.005')
  console.log('z5')
  const connectWalletButton = page.locator('.compose_pool_connect_wallet')
  console.log('z6')
  await connectWalletButton.click({ force: true })
  console.log('z7')
  await page.waitForTimeout(15000)
  console.log('z8')
  await connectWalletButton.click({ force: true })
  console.log('z9')
  await page.waitForTimeout(15000)
  console.log('z10')
  await page
    .locator('div.compose_pool_connect_wallet:has-text("Adding Liquidty")')
    .click({ force: true })
  console.log('z11')
  await page.waitForTimeout(30000)
  console.log('z12')
  await page.locator('.zapper_button').click({ force: true })
  console.log('z13')
  await page.waitForTimeout(15000)
  console.log('z14')
  await metamask.confirmTransaction()

  console.log('ZAPPER END')
  await page.waitForTimeout(10000)
})
