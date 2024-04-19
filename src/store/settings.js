import { defineStore } from 'pinia'

export const useSettings = defineStore('settings', {
  state: () => ({
    /** @type {{ text: string, id: number, isFinished: boolean }[]} */
    todos: [],
    /** @type {'USD' | 'BTC' | 'ETH'} */
    currency: 'USD',
  }),
  actions: {
    updateCurrency(newCurrency) {
      this.currency = newCurrency
    },
  },
  getters: {},
})
