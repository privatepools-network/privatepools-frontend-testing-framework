# Privatepools-frontend

## Overviews

This project is a web application that provides charts, statistics, and information about pools, arbitrage profitability, revenue, and other related data. It is built using Vue.js and leverages various Vue CLI scripts for development, testing, and production.

## Table of Contents

- Prerequisites
- Installation
- Usage
- Scripts

## Prerequisites

Before you begin, ensure you have the following dependencies installed:

- [Node.js](https://nodejs.org/)
- [Vue CLI](https://cli.vuejs.org/)

## Installation

1. Clone the repository:

bashCopy code

`git clone https://github.com/privatepools-network/privatepools-frontend`

2. Navigate to the project directory:

bashCopy code

`cd privatepools-frontend`

3. Install the dependencies:

bashCopy code

`npm install`

## Usage

To run the development server:

bashCopy code

`npm run serve`

This will start a development server, and you can view the app by navigating to [https://beta.privatepools.network/](https://beta.privatepools.network//) in your browser.

To build the project for production:

bashCopy code

`npm run build`

The production-ready files will be located in the `dist` directory.

## Scripts

- **build**: Builds the app for production.
- **production**: Serves the app in production mode.
- **lint**: Lints and fixes files using ESLint.
- **serve**: Serves the app in development mode.
- **test:e2e**: Runs end-to-end tests.
- **test:unit**: Runs unit tests.

## .env

```bash
# Contract address for 1inch executor on the Binance Smart Chain (BSC)
VUE_APP_1INCHEXECUTOR_CONTRACT_BINANCE=
# Wallet address used for arbitrage transactions
VUE_APP_ARBITRAGE_WALLET=
# Authorizer contract address for managing permissions on BSC
VUE_APP_AUTHORIZER_BINANCE=
# Address for Balancer's helper contract on BSC, used in various Balancer operations
VUE_APP_BALANCER_HELPERS_BINANCE=
# Batch relayer contract address on BSC, facilitating multi-step transactions
VUE_APP_BATCH_RELAYER_BINANCE=
# Chain ID for Binance Smart Chain (BSC)
VUE_APP_CHAIN_ID_BINANCE=
# Chain name for Binance Smart Chain
VUE_APP_CHAIN_NAME_BINANCE=
# API key for accessing CoinGecko's cryptocurrency data
VUE_APP_COINGECKO_API_KEY=
# URL for configuration sanity checks on BSC, typically contains asset or pair lists
VUE_APP_CONFIG_SANITY_URL_BINANCE=
# Flag to use CryptoCompare as a default data source
VUE_APP_CRYPTOCOMPARE_BY_DEFAULT=
# Binance Smart Chain (BSC) block explorer link
VUE_APP_EXPLORER_BINANCE=
# Name of the Binance block explorer for UI display
VUE_APP_EXPLORER_NAME_BINANCE=
# Another identifier for Binance Smart Chain, aligning with the chain ID
VUE_APP_KEY_BINANCE=
# Specifies whether to use the local API server
VUE_APP_LOCAL_API=
# MasterChef contract on BSC, typically used for staking
VUE_APP_MASTER_CHEF_BINANCE=
# Multicall contract on BSC, which allows batching multiple on-chain calls
VUE_APP_MULTICALL_BINANCE=
# Display name for Binance Smart Chain
VUE_APP_NAME_BINANCE=
# Network name identifier for Binance Smart Chain
VUE_APP_NETWORK_BINANCE=
# Primary output link for private pool API
VUE_APP_OUTPUT_LINK_BINANCE=
# Redundant link for fallback access to the private pool API
VUE_APP_REDUNDANT_OUTPUT_LINK_BINANCE=
# Redundant URL for accessing the rewards backend in case of primary failure
VUE_APP_REDUNDANT_REWARDS_BACKEND_BINANCE=
# Primary rewards backend URL for profit distribution
VUE_APP_REWARDS_BACKEND_BINANCE=
# Rewards contract address on BSC for distributing rewards to users
VUE_APP_REWARDS_CONTRACT_BINANCE=
# RPC endpoint for Binance Smart Chain
VUE_APP_RPC_BINANCE=
# Short display name for Binance Smart Chain
VUE_APP_SHORT_NAME_BINANCE=
# URL for checking application status
VUE_APP_STATUS_LINK=
# Indicates whether BSC supports EIP-1559, used for transaction fee market upgrades
VUE_APP_SUPPORTS_EIP1559_BINANCE=
# Specifies if Element pools are supported on Binance Smart Chain
VUE_APP_SUPPORTS_ELEMENT_POOLS_BINANCE=
# URL for token list used in configuration sanity checks on BSC
VUE_APP_TOKEN_LIST_SANITY_URL_BINANCE=
# USDC token contract address on BSC
VUE_APP_USDC_BINANCE=
# Vault contract address on BSC, generally used for secure asset storage
VUE_APP_VAULT_BINANCE=
# Weighted Pool Factory contract address on BSC, for creating liquidity pools with specified weights
VUE_APP_WEIGHTED_POOL_FACTORY_BINANCE=
# Wrapped Ether (WETH) token address on BSC
VUE_APP_WETH_BINANCE=
# WebSocket endpoint for Binance API, used for real-time data and updates
VUE_APP_WS_BINANCE=
# Zap contract address on BSC, likely used for efficient multi-token swapping
VUE_APP_ZAP_CONTRACT_BINANCE=
# Source for Wavelength SDK, used to integrate with Balancer SDK
WAVELENGTH_SDK_SOURCE=
# Source for Wavelength SOR (Smart Order Router), a component of Balancer for optimal order routing
WAVELENGTH_SOR2_SOURCE=
# Compounder contract address on BSC, for automatically compounding returns
VUE_APP_COMPOUNDER_CONTRACT_BINANCE=
```