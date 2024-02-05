<template>
  <CModal backdrop="static" size="lg" alignment="center" :visible="visibleNetworkModal"
    @close="$emit('changeVisibleNetworkModal')">
    <CModalBody class="p-0">
      <div class="d-flex">
        <div class="bg-danger d-flex justify-content-center pt-3" style="border-radius: 0.5rem 0px 0px 0.5rem; width: 6%">
          <div v-if="NetworkUnsupported">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 11V11.2C18 13.54 16.05 16.64 12 20.34C7.95 16.64 6 13.55 6 11.2C6 7.57 8.65 5 12 5C12.34 5 12.68 5.03 13 5.08V3.06C12.67 3.02 12.34 3 12 3C7.8 3 4 6.22 4 11.2C4 14.52 6.67 18.45 12 23C17.33 18.45 20 14.52 20 11.2V11H18Z"
                fill="#F8F8F8" />
              <path
                d="M12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z"
                fill="#F8F8F8" />
              <path
                d="M22.54 2.87996L21.12 1.45996L19 3.58996L16.88 1.45996L15.46 2.87996L17.59 4.99996L15.46 7.11996L16.88 8.53996L19 6.40996L21.12 8.53996L22.54 7.11996L20.41 4.99996L22.54 2.87996Z"
                fill="#F8F8F8" />
            </svg>
          </div>
          <div v-if="!NetworkUnsupported">
            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_2070_64809)">
                <path
                  d="M14 5.5V2.5C14 2.23478 13.8946 1.98043 13.7071 1.79289C13.5196 1.60536 13.2652 1.5 13 1.5H3C2.46957 1.5 1.96086 1.71071 1.58579 2.08579C1.21071 2.46086 1 2.96957 1 3.5M1 3.5C1 4.03043 1.21071 4.53914 1.58579 4.91421C1.96086 5.28929 2.46957 5.5 3 5.5H15C15.2652 5.5 15.5196 5.60536 15.7071 5.79289C15.8946 5.98043 16 6.23478 16 6.5V9.5M1 3.5V15.5C1 16.0304 1.21071 16.5391 1.58579 16.9142C1.96086 17.2893 2.46957 17.5 3 17.5H15C15.2652 17.5 15.5196 17.3946 15.7071 17.2071C15.8946 17.0196 16 16.7652 16 16.5V13.5"
                  stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M17 9.5V13.5H13C12.4696 13.5 11.9609 13.2893 11.5858 12.9142C11.2107 12.5391 11 12.0304 11 11.5C11 10.9696 11.2107 10.4609 11.5858 10.0858C11.9609 9.71071 12.4696 9.5 13 9.5H17Z"
                  stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_2070_64809">
                  <rect width="18" height="19" fill="white" />
                </clipPath>
              </defs>
            </svg>

          </div>
        </div>
        <div style="width: 94%" class="p-3">
          <div class="d-flex justify-content-between">
            <div v-if="NetworkUnsupported" class="text-danger fs-4 fw-bolder">
              Network Mismatch Detected!
            </div>
            <div v-if="!NetworkUnsupported" class="text-danger fs-4 fw-bolder">
              Wallet Connection Required!
            </div>
            <div style="cursor: pointer" @click="$emit('changeVisibleNetworkModal')">
              <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.6208 16.5062C17.8622 16.7473 17.9979 17.0743 17.9979 17.4152C17.9979 17.7562 17.8622 18.0832 17.6208 18.3242C17.3793 18.5653 17.0518 18.7008 16.7104 18.7008C16.3689 18.7008 16.0415 18.5653 15.8 18.3242L9 11.5324L2.19785 18.3221C1.9564 18.5632 1.62893 18.6986 1.28747 18.6986C0.946013 18.6986 0.61854 18.5632 0.377092 18.3221C0.135644 18.081 3.59785e-09 17.754 0 17.4131C-3.59785e-09 17.0722 0.135644 16.7452 0.377092 16.5041L7.17924 9.71438L0.379234 2.92253C0.137786 2.68144 0.00214212 2.35446 0.00214212 2.01352C0.00214212 1.67258 0.137786 1.3456 0.379234 1.10452C0.620682 0.863437 0.948155 0.727998 1.28961 0.727998C1.63107 0.727998 1.95855 0.863437 2.19999 1.10452L9 7.89638L15.8021 1.10345C16.0436 0.862367 16.3711 0.726929 16.7125 0.726929C17.054 0.726929 17.3815 0.862367 17.6229 1.10345C17.8644 1.34453 18 1.67151 18 2.01245C18 2.3534 17.8644 2.68037 17.6229 2.92146L10.8208 9.71438L17.6208 16.5062Z"
                  fill="white" />
              </svg>
            </div>
          </div>
          <div v-if="NetworkUnsupported" class="text-white mt-4 mb-4" style="width: 85%">
            It seems you've connected to an incompatible network. For optimal
            performance and security, please ensure you select the correct
            network when connecting to the protocol. Check your wallet settings
            and switch to the recommended network before proceeding.
          </div>
          <div v-if="!NetworkUnsupported" class="text-white mt-4 mb-4" style="width: 85%">
            Before you can interact with the protocol, you need to connect a compatible wallet. This ensures secure
            transactions and a seamless experience. Head over to the wallet section and link your preferred digital
            wallet.
          </div>
          <div class="mt-4 mb-1">
            <CButton v-if="NetworkUnsupported" @click="switchNetwork" color="warning" variant="outline"
              class="text-warning fw-bold">
              Switch Network
            </CButton>
            <CButton v-if="!NetworkUnsupported" @click="connectWallet" color="warning" variant="outline"
              class="text-warning fw-bold">
              Connect Wallet
            </CButton>
          </div>
        </div>
      </div>
    </CModalBody>
  </CModal>
</template>

<script setup>
import { setMetamaskProvider } from '@/composables/useMetamaskProvider';
import { ethers } from 'ethers';
import { defineProps, ref } from 'vue'
defineProps([
  'visibleNetworkModal',
  'changeVisibleNetworkModal',
  'NetworkUnsupported',
])

const accountData = ref()
const address = ref('')
const ethereumNetwork = ref('')

async function connectWallet() {
  if (window.ethereum !== undefined) {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
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
    params: [{ chainId: '0xa4b1' }],    // chainId must be in HEX with 0x in front
  }).then(() => {
    window.location.reload()
  });
}


</script>
<style>
:deep(.range-slider) {
  background: transparent;
  border-radius: 8px;
  padding: 0;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 12px;
  outline: none;
  transition: opacity 0.2s;
  position: relative;

  /* Styling the track */
  &::-webkit-slider-runnable-track {
    height: 12px;
    background: rgba(59, 97, 65, 0.11);
    border-radius: 8px;
  }

  &::-moz-range-track {
    height: 12px;
    background: #ffffff29;
    border-radius: 8px;
  }

  &::-moz-range-progress {
    background-color: #01b47e;
    height: 12px;
    border-radius: 8px 0 0 8px;
  }

  &::-ms-track {
    height: 12px;
    background: #ffffff29;
    border-radius: 8px;
  }

  /* Styling the thumb */
  &::-webkit-slider-thumb {
    width: 14px;
    height: 14px;
    background: #c1c1d1;
    border-radius: 50%;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -1px;
    /* necessary to center the thumb in the track */
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: #c1c1d1;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-ms-thumb {
    width: 14px;
    height: 14px;
    background: #c1c1d1;
    border-radius: 50%;
    cursor: pointer;
    margin-top: 0;
  }
}

.modal_stake_token {
  border: 1px #01b47e solid;
  border-radius: 5px;
  padding: 15px;
}

.modal_stake_token_inner {
  background-color: rgba(59, 97, 65, 0.11);
  border-radius: 5px;
  padding: 15px;
}

.modal_stake_token_inner_name {
  background-color: rgba(59, 97, 65, 0.14);
  border-radius: 17px;
  color: white;
  display: flex;
  align-items: center;
  padding: 1px 18px;
}
</style>
