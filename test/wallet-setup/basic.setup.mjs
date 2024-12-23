import { defineWalletSetup } from '@synthetixio/synpress'
import { getExtensionId, MetaMask } from '@synthetixio/synpress/playwright'
import 'dotenv/config'
import { createPool, createAnvil } from '@viem/anvil'

const PRIVATE_KEY = process.env.PRIVATE_KEY
const SEED_PHRASE = process.env.SEED_PHRASE
const PASSWORD = '123123123'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, 'MetaMask')

  console.log({ extensionId })
  console.log(process.env.RANDOM_PARAMETER)
  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId)

  await metamask.importWallet(SEED_PHRASE)
  await metamask.importWalletFromPrivateKey(PRIVATE_KEY)
  await metamask.switchAccount('Account 2')
  await metamask.openSettings()

  const SidebarMenus = metamask.homePage.selectors.settings.SettingsSidebarMenus
  await metamask.openSidebarMenu(SidebarMenus.Advanced)

  await metamask.toggleDismissSecretRecoveryPhraseReminder()

  // const page = await context.newPage()

  // await page.goto('https://beta.privatepools.network//pools')

  // try {
  //   const anvil = createAnvil({
  //     chainId: 56,
  //     forkUrl: 'https://bscrpc.com',
  //     port: 8545,
  //   })
  //   await anvil.start()
  //   await metamask.addNetwork({
  //     name: 'FORK',
  //     rpcUrl: `http://127.0.0.1:8545`,
  //     chainId: 56,
  //     symbol: 'BNB',
  //   })
  //   console.log('ADDED NETWORK')
  // } catch (e) {
  //   console.log('ERROR - ', e)
  // }
  // try {
  //   await metamask.switchNetwork('FORK', false)
  // } catch (e2) {
  //   console.log('ERROR - ', e2)
  // }

  // await metamask.addNetwork({
  //   rpcUrl: 'http://127.0.0.1:8545',
  //   name: 'foundry',
  //   chainId: 56,
  //   symbol: 'BNB',
  // })
})
