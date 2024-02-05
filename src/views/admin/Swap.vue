<template>
  <MainCard>
    <CRow class="mb-4 d-flex align-items-center">
      <CCol md="auto">
        <div class="text-white fw-bold fs-4">{{ caption }}</div>
      </CCol>
    </CRow>

    <CRow class="mb-4 d-flex align-items-center">
      <CCol md="auto">
        <div v-if="allSwapableTokens && allSwapableTokens.length > 0">
          <Swapper :allSwapableTokens="allSwapableTokens" :nativeTokenPrice="nativeTokenPrice" />
        </div>
      </CCol>
    </CRow>



  </MainCard>
  <NetworkWarning :NetworkUnsupported="NetworkUnsupported" :visibleNetworkModal="visibleNetworkModal"
    @changeVisibleNetworkModal="changeVisibleNetworkModal" />
</template>

<script setup>
import Swapper from '@/components/Swapper.vue';
import { GetTokenPriceUsd } from '@/composables/balances/cryptocompare';
import { GetPossibleComposeTokens } from '@/composables/poolActions/compose/usePossibleComposeTokens';
import { networkId } from '@/composables/useNetwork';
import { configService } from '@/services/config/config.service';
import { ref, watch, onMounted } from 'vue'
import NetworkWarning from '@/components/modals/NetworkWarning.vue'
import { ethers } from "ethers"
import MainCard from '@/UI/MainCard.vue'

const caption = ref('Swap')

const allSwapableTokens = ref([])
const nativeTokenPrice = ref(0)


const visibleNetworkModal = ref(false)
const NetworkUnsupported = ref(false)
const networksSupported = ref(false)

watch(networkId, async () => {
  allSwapableTokens.value = await GetPossibleComposeTokens(true)
  allSwapableTokens.value.forEach((t) => { t.value = 0 })
  nativeTokenPrice.value = await GetTokenPriceUsd(configService.getNetworkConfig(networkId.value).nativeAsset.symbol)
})


onMounted(async () => {
  if (window.ethereum !== undefined) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    networksSupported.value = await provider.getNetwork()
  }

  if (window.ethereum === undefined || window.ethereum?._state?.accounts?.length === 0 || !localStorage.getItem('isConnectedToWeb3')) {
    NetworkUnsupported.value = false
    changeVisibleNetworkModal()
  }
  if (window.ethereum !== undefined && window.ethereum?._state?.accounts?.length !== 0 && networksSupported.value.chainId !== 42161 && networksSupported.value.chainId !== 56 && networksSupported.value.chainId !== 137) {
    NetworkUnsupported.value = true
    changeVisibleNetworkModal()
  }
})

function changeVisibleNetworkModal() {
  visibleNetworkModal.value = !visibleNetworkModal.value
}


</script>

<style lang="scss" scoped>
.caption {
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  color: #ffffff;
  margin-bottom: 20px;
}
</style>
