import { ref, toValue, watchEffect } from 'vue'

import { GetPossibleComposeTokens } from '@/composables/poolActions/compose/usePossibleComposeTokens'

export const useFetchTokens = (network) => {
  const tokens = ref([])
  const isLoading = ref(false)

  const fetchTokens = async () => {
    isLoading.value = false
    tokens.value = []

    const data = await GetPossibleComposeTokens(toValue(network))

    tokens.value = data.filter((item) => item.price > 0)
    isLoading.value = true
  }

  watchEffect(() => fetchTokens())

  return { tokens, isLoading }
}
