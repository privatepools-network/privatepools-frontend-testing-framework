import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useSettings = defineStore('settings', {
  state: () => ({
    /** @type {{ text: string, id: number, isFinished: boolean }[]} */
    todos: [],
    /** @type {'USD' | 'BTC' | 'ETH'} */
    currentCurrency: useLocalStorage('currency', 'USD'),

    currentLanguage: useLocalStorage('language', 'English'),

    currentParticles: useLocalStorage('particles', 'off'),

    currentVersion: useLocalStorage('version', 'lite'),
  }),
  actions: {
    updateCurrency(newCurrency) {
      this.currentCurrency = newCurrency
    },
    updateLanguage(newLang) {
      this.currentLanguage = newLang
    },
    updateParticles(newProp) {
      this.currentParticles = newProp
    },
    updateVersion(newProp) {
      this.currentVersion = newProp
    },
  },
  getters: {},
})
