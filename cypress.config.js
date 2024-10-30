const { defineConfig } = require('cypress')
const synpressPlugins = require('@synthetixio/synpress/plugins')

module.exports = defineConfig({
  userAgent: 'synpress',
  video: true,
  chromeWebSecurity: true,
  defaultCommandTimeout: 99999999,
  execTimeout: 99999999,
  taskTimeout: 99999999,
  requestTimeout: 999999999,
  pageLoadTimeout: 9999999999,
  responseTimeout: 9999999999,
  component: {
    devServer: {
      framework: 'vue-cli',
      bundler: 'webpack',
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      synpressPlugins(on, config)
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
      })
      return config
    },
    chromeWebSecurity: true,
    defaultCommandTimeout: 9999999,
    pageLoadTimeout: 9999999,
    execTimeout: 9999999,
    retries: 5,
    taskTimeout: 9999999,
    responseTimeout: 9999999,
    requestTimeout: 9999999,
    baseUrl: 'http://localhost:8080',
    testIsolation: true,
    supportFile: 'cypress/support/e2e.js',
    env: {
      METAMASK_PASSWORD: process.env.CYPRESS_METAMASK_PASSWORD,
      NETWORK: 'mainnet',
      NETWORK_NAME: process.env.NETWORK_NAME,
      T_NETWORK_NAME: process.env.T_NETWORK_NAME,
      T_CHAIN_ID: process.env.T_CHAIN_ID,
      T_RPC_URL: process.env.T_RPC_URL,
      T_SYMBOL: process.env.T_SYMBOL,
    },
  },
})