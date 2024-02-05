import { computed } from 'vue'

export default function usePoolParameters(pool) {
  function isStableLike(poolType) {
    return (
      this.isStable(poolType) ||
      this.isMetaStable(poolType) ||
      this.isStablePhantom(poolType)
    )
  }

  function isStableLikePool() {
    return computed(
      () => !!pool.value && this.isStableLike(pool.value.poolType),
    )
  }

  function isStable(poolType) {
    return poolType === 'Stable'
  }
  function isMetaStable(poolType) {
    return poolType === 'MetaStable'
  }
  function isStablePhantom(poolType) {
    return poolType == 'StablePhantom'
  }

  function isStablePhantomPool() {
    return computed(() => !!pool.value && isStablePhantom(pool.value.poolType))
  }
  function isStablePool() {
    return computed(() => !!pool.value && isStable(pool.value.poolType))
  }

  return {
    isStableLike,
    isStable,
    isMetaStable,
    isStablePhantom,
    isStableLikePool,
    isStablePhantomPool,
    isStablePool,
  }
}
