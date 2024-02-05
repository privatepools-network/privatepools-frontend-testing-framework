import { computed, onMounted, onUnmounted, ref } from 'vue'

export function useDevice() {
  let windowWidth = ref(window.innerWidth)

  const onWidthChange = () => (windowWidth.value = window.innerWidth)
  onMounted(() => window.addEventListener('resize', onWidthChange))
  onUnmounted(() => window.removeEventListener('resize', onWidthChange))

  const type = computed(() => {
    if (windowWidth.value < 576) return 'sm'
    if (windowWidth.value >= 576 && windowWidth.value < 768) return 'md'
    if (windowWidth.value >= 768 && windowWidth.value < 992) return 'lg'
    if (windowWidth.value >= 992 && windowWidth.value < 1200) return 'xl'
    if (windowWidth.value >= 1400) return 'xxl'
    return null
  })

  const width = computed(() => windowWidth.value)

  return { width, type }
}
