import { ref } from 'vue'

export default function usePromiseSequence() {
  const promises = ref([])
  const processing = ref(false)

  async function processAll() {
    processing.value = true
    for (let i = 0; i < promises.value.length; i++) {
      await promises.value[i]()
      promises.value.splice(i, 1)
    }
    processing.value = false
  }

  return {
    promises,
    processing,
    processAll,
  }
}
