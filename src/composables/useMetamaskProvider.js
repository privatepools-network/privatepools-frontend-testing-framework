var provider = null

export function setMetamaskProvider(_provider) {
  provider = _provider
}
export function useMetamaskProvider() {
  return provider
}
