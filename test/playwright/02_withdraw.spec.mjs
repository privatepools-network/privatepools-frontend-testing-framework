import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'
import 'dotenv/config'
import BasicSetup from '../wallet-setup/basic.setup.mjs'
import { createPool, createAnvil } from '@viem/anvil'
import { ethers } from 'ethers'
import { signMessage } from './signMessage.mjs'

const test = testWithSynpress(metaMaskFixtures(BasicSetup))

const { expect } = test
test('Withdraw', async ({
  context,
  page,
  metamaskPage,
  extensionId,
  createAnvilNode,
  connectToAnvil,
  metamask,
  _contextPath,
}) => {
  console.log('WITHDRAW START')
  await signMessage(metamask, createAnvilNode, page, metamaskPage)

  await page.goto(
    '/pools/0x7ba6cb6380f1dfb363bfbe3e86d42248e93036b8000100000000000000000001/BNB/withdraw',
  )
  console.log('w1')
  const tokenInput = page.locator('.token-input')
  console.log('w2')
  await tokenInput.click({ force: true })
  console.log('w3')
  await tokenInput.fill('1')
  console.log('w4')
  const connectWalletButton = page.locator('.compose_pool_connect_wallet')
  console.log('w5')
  await connectWalletButton.click()
  console.log('w6')
  await page.waitForTimeout(5_000)
  console.log('w7')
  await connectWalletButton.click()
  console.log('w8')
  await page.waitForTimeout(15_000)
  console.log('w9')
  await metamask.confirmTransaction()
  console.log('WITHDRAW END')
  await page.waitForTimeout(10000)
})
