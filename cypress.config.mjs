import { configureSynpress } from '@synthetixio/synpress/cypress'
import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'https://privatepools-frontend-git-dev-dark-pools-team.vercel.app',
    specPattern: 'test/cypress/**/*.cy.{js,jsx,ts,tsx,,mjs}',
    supportFile: 'test/cypress/support/e2e.{js,jsx,ts,tsx,mjs}',
    testIsolation: false,
    async setupNodeEvents(on, config) {
      return configureSynpress(on, config)
    },
  },
})
