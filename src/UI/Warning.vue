<template>
  <div class="warning">
    <img :src="bunner" class="warning__bunner">
    <div class="warning-info">
      <div class="warning-info__title" v-if="!NetworkUnsupported">
        Wallet Connection Required!
      </div>
      <div class="warning-info__title" v-if="NetworkUnsupported">
        Network Mismatch Detected!
      </div>

      <div class="warning-info__description" v-if="!NetworkUnsupported">
        Before you can interact with the protocol, you need to connect a compatible wallet. This ensures secure
        transactions and a seamless experience. Head over to the wallet section and link your preferred digital wallet.
      </div>
      <div class="warning-info__description" v-if="NetworkUnsupported">
        It seems you've connected to an incompatible network. For optimal performance and security, please ensure you
        select the correct network when connecting to the protocol. Check your wallet settings and switch to the
        recommended network before proceeding.
      </div>
      <div class="warning-info__button" v-if="!NetworkUnsupported" @click="connectWallet">
        Connect Wallet
      </div>
      <div class="warning-info__button" v-if="NetworkUnsupported" @click="switchNetwork">
        Switch Network
      </div>

    </div>
    <div class="warning__close" v-if="closable" @click="$emit('closeWarning')">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
        <path
            d="M17.6208 15.9294C17.8622 16.1603 17.9979 16.4736 17.9979 16.8002C17.9979 17.1268 17.8622 17.44 17.6208 17.671C17.3793 17.9019 17.0518 18.0317 16.7104 18.0317C16.3689 18.0317 16.0415 17.9019 15.8 17.671L9 11.1647L2.19785 17.6689C1.9564 17.8999 1.62893 18.0296 1.28747 18.0296C0.946013 18.0296 0.61854 17.8999 0.377092 17.6689C0.135644 17.438 3.59785e-09 17.1247 0 16.7981C-3.59785e-09 16.4715 0.135644 16.1583 0.377092 15.9273L7.17924 9.42308L0.379234 2.91677C0.137786 2.68582 0.00214212 2.37259 0.00214212 2.04598C0.00214212 1.71937 0.137786 1.40614 0.379234 1.17519C0.620682 0.944246 0.948155 0.814501 1.28961 0.814501C1.63107 0.814501 1.95855 0.944246 2.19999 1.17519L9 7.68151L15.8021 1.17417C16.0436 0.943221 16.3711 0.813477 16.7125 0.813477C17.054 0.813477 17.3815 0.943221 17.6229 1.17417C17.8644 1.40511 18 1.71835 18 2.04495C18 2.37156 17.8644 2.68479 17.6229 2.91574L10.8208 9.42308L17.6208 15.9294Z"
            fill="white"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import bunner from '@/assets/images/warning-bg.jpg'
import {setMetamaskProvider} from '@/composables/useMetamaskProvider';
import {ethers} from 'ethers';
import {defineProps, ref} from 'vue'

defineProps([
  'NetworkUnsupported',
    'closable'
])

const accountData = ref()
const address = ref('')
const ethereumNetwork = ref('')

async function connectWallet() {
  if (window.ethereum !== undefined) {
    window.ethereum
        .request({method: 'eth_requestAccounts'})
        .then(async (res) => {
          // Request MetaMask to connect
          await window.ethereum.enable();
          let provider = new ethers.providers.Web3Provider(window.ethereum);
          setMetamaskProvider(provider)
          const network = await provider.getNetwork()
          localStorage.setItem('isConnectedToWeb3', true)
          const walletData = res
          accountData.value = walletData
          address.value = walletData[0]
          ethereumNetwork.value = network
          localStorage.setItem('ethereumNetwork', JSON.stringify(network))

          window.location.reload()

        })
        .catch((err) => console.log(err))
  } else window.open('https://metamask.io/download/', "_blank")

}

async function switchNetwork() {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{chainId: '0xa4b1'}],    // chainId must be in HEX with 0x in front
  }).then(() => {
    window.location.reload()
  });
}
</script>

<style lang="scss" scoped>
.warning {
  display: flex;
  position: absolute;
  width: 660px;
  height: auto;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
  border-radius: 4px 20px 20px 4px;
  padding: 0;
  border: 0.2px solid rgba(1, 180, 126, 0.40);
  background: #02120A;
  box-shadow: 0px 12px 24px 0px rgba(1, 180, 126, 0.20), 0px 4px 8px 0px rgba(1, 180, 126, 0.30);

  &__bunner {
    border-radius: 4px 0 0 4px;
  }
  &__close {
    position: absolute;
    right: 10px;
    top: 5px;
    cursor: pointer;
    svg {
      width: 10px;
    }
  }
  &-info {
    color: #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    padding: 24px;

    &__title {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 4px;
    }

    &__description {
      font-size: 14px;
      margin-bottom: 12px;
    }

    &__button {
      padding: 8px;
      font-size: 12px;
      color: #E6B10C;
      border: 1px solid #E6B10C;
      border-radius: 20px;
      cursor: pointer;
      transition-duration: 0.3s;

      &:hover {
        color: #fff;
        background: #E6B10C;
        box-shadow: 0px 12px 24px 0px rgba(#E6B10C, 0.20), 0px 4px 8px 0px rgba(#E6B10C, 0.30);
      }
    }
  }
}
</style>
