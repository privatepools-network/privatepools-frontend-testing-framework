import { testWithSynpress } from '@synthetixio/synpress'
import { metaMaskFixtures } from '@synthetixio/synpress/playwright'
import connectedSetup from './wallet-setup/connected.setup.mjs'

export default testWithSynpress(metaMaskFixtures(connectedSetup))
