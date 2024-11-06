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
  console.log('comp1')
  await page.goto(
    '/pools/0xc6d780cc3b3cd74c9b4f3228cb1224310cf71a80000200000000000000000001/BNB/compound',
  )
  console.log('comp2')

  await page.locator('.compose_pool_connect_wallet').click()
  console.log('comp3')

  await page.waitForTimeout(15000)
  console.log('comp4 select')

  await page.locator('#select-all-checkbox').click()
  await page.waitForTimeout(3000)

  await page.locator('.compose_pool_connect_wallet').click()
  console.log('comp5')

  await page.waitForTimeout(15000)
  console.log('comp6')

  await page.locator('.compose_pool_connect_wallet').click()

  await page.waitForTimeout(15000)
  console.log('comp7')
  await metamask.confirmTransaction()
  console.log('comp8')

  await page.waitForTimeout(15000)
  console.log('comp9')
})
