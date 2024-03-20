import { createStore } from 'vuex'

export default createStore({
  state: {
    currentNetwork: '',
    walletData: '',
  },
  mutations: {
    STORE_CURRENT_NETWORK(state, payload) {
      state.currentNetwork = payload
    },
    STORE_WALLET_DATA(state, payload) {
      state.walletData = payload
    },
  },

  actions: {
    setCurrentNetwork(context, data) {
      context.commit('STORE_CURRENT_NETWORK', data)
    },
    setWalletData(context, data) {
      context.commit('STORE_WALLET_DATA', data)
    },
  },

  getters: {
    getCurrentNetwork(state) {
      return state.currentNetwork
    },
    getWalletData(state) {
      return state.walletData
    },
  },
  modules: {},
})
