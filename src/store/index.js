import { createStore } from 'vuex'

export default createStore({
  state: {
    // sidebarVisible: '',
    // sidebarUnfoldable: false,
    // botStrategy: 'Strategie 2 MultiTokens: Vault - 1inch',
    // trackingTradesData: '',
    currentNetwork: '',
    walletData: '',
  },
  mutations: {
    // STORE_BOT_STRATEGY(state, payload) {
    //   state.botStrategy = payload
    // },
    // STORE_TRACKING_TRADES(state, payload) {
    //   state.trackingTradesData = payload
    // },
    STORE_CURRENT_NETWORK(state, payload) {
      state.currentNetwork = payload
    },
    STORE_WALLET_DATA(state, payload) {
      state.walletData = payload
    },
    // toggleSidebar(state) {
    //   state.sidebarVisible = !state.sidebarVisible
    // },
    // toggleUnfoldable(state) {
    //   state.sidebarUnfoldable = !state.sidebarUnfoldable
    // },
    // updateSidebarVisible(state, payload) {
    //   state.sidebarVisible = payload.value
    // },
  },

  actions: {
    // setBotStrategy(context, number) {
    //   context.commit('STORE_BOT_STRATEGY', number)
    // },
    // setTrackingTradesData(context, data) {
    //   context.commit('STORE_TRACKING_TRADES', data)
    // },
    setCurrentNetwork(context, data) {
      context.commit('STORE_CURRENT_NETWORK', data)
    },
    setWalletData(context, data) {
      context.commit('STORE_WALLET_DATA', data)
    },
  },

  getters: {
    // getBotStrategy(state) {
    //   return state.botStrategy
    // },
    // getTrackingTradesData(state) {
    //   return state.trackingTradesData
    // },
    getCurrentNetwork(state) {
      return state.currentNetwork
    },
    getWalletData(state) {
      return state.walletData
    },
  },
  modules: {},
})
